#!/usr/bin/env python3
"""Generate the original Atlas Observation Chamber score stems.

The result is a deterministic, seamless 56-second stereo loop. Every oscillator
completes an integer number of cycles and every noise bed is synthesized in the
frequency domain as a periodic signal. Nothing is sampled or borrowed. The AAC
fallback carries 1.024 seconds of wrapped codec context on either side so its
decoded 56-second loop does not inherit an AAC boundary transient.

Outputs:
  assets/audio/atlas-score.opus
  assets/audio/atlas-score.m4a
  assets/audio/atlas-room.opus
  assets/audio/atlas-room.m4a

Requirements: Python 3.11+, numpy, and ffmpeg with libopus + AAC encoders.
"""

from __future__ import annotations

import argparse
import hashlib
import math
import shutil
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np


SAMPLE_RATE = 48_000
DURATION_SECONDS = 56
FRAME_COUNT = SAMPLE_RATE * DURATION_SECONDS
AAC_GUARD_SECONDS = 1.024
AAC_GUARD_FRAMES = round(SAMPLE_RATE * AAC_GUARD_SECONDS)
TAU = math.tau


def periodic_frequency(target_hz: float) -> tuple[int, float]:
    cycles = round(target_hz * DURATION_SECONDS)
    return cycles, cycles / DURATION_SECONDS


def oscillator(base_phase: np.ndarray, target_hz: float, phase: float = 0.0) -> np.ndarray:
    cycles, _frequency = periodic_frequency(target_hz)
    return np.sin(base_phase * cycles + phase, dtype=np.float32)


def periodic_noise(
    seed: int,
    low_hz: float,
    high_hz: float,
    tilt: float = 0.0,
) -> np.ndarray:
    """Return deterministic band-shaped noise whose final sample wraps cleanly."""

    frequencies = np.fft.rfftfreq(FRAME_COUNT, 1 / SAMPLE_RATE)
    magnitude = np.zeros_like(frequencies)
    band = (frequencies >= low_hz) & (frequencies <= high_hz)
    reference = np.maximum(frequencies[band], max(low_hz, 20.0)) / 200.0
    magnitude[band] = np.power(reference, tilt)

    # Raised-cosine shoulders keep the generated room texture free of sharp
    # spectral edges while preserving exact temporal periodicity.
    low_width = max(10.0, low_hz * 0.45)
    high_width = max(40.0, high_hz * 0.18)
    low_shoulder = (frequencies >= max(0.0, low_hz - low_width)) & (frequencies < low_hz)
    high_shoulder = (frequencies > high_hz) & (frequencies <= high_hz + high_width)
    if np.any(low_shoulder):
        x = (frequencies[low_shoulder] - (low_hz - low_width)) / low_width
        magnitude[low_shoulder] = 0.5 - 0.5 * np.cos(np.pi * x)
    if np.any(high_shoulder):
        x = (frequencies[high_shoulder] - high_hz) / high_width
        magnitude[high_shoulder] = (0.5 + 0.5 * np.cos(np.pi * x)) * np.power(
            np.maximum(frequencies[high_shoulder], 20.0) / 200.0,
            tilt,
        )

    rng = np.random.default_rng(seed)
    phases = rng.uniform(0.0, TAU, magnitude.size)
    spectrum = magnitude * (np.cos(phases) + 1j * np.sin(phases))
    spectrum[0] = 0.0
    spectrum[-1] = complex(spectrum[-1].real, 0.0)
    signal = np.fft.irfft(spectrum, n=FRAME_COUNT).astype(np.float32)
    rms = float(np.sqrt(np.mean(np.square(signal, dtype=np.float64))))
    if rms > 0:
        signal /= rms
    return signal


def circular_event_envelope(
    seconds: np.ndarray,
    center: float,
    attack: float,
    decay: float,
) -> np.ndarray:
    elapsed = np.mod(seconds - center, DURATION_SECONDS)
    envelope = np.zeros(FRAME_COUNT, dtype=np.float32)
    rising = elapsed < attack
    falling = (elapsed >= attack) & (elapsed < attack + decay)
    envelope[rising] = np.sin((elapsed[rising] / attack) * math.pi * 0.5) ** 2
    if np.any(falling):
        x = (elapsed[falling] - attack) / decay
        envelope[falling] = np.exp(-3.8 * x) * (0.5 + 0.5 * np.cos(math.pi * x))
    return envelope


def add_voice(
    stereo: np.ndarray,
    base_phase: np.ndarray,
    frequency: float,
    level: float,
    pan: float,
    phase: float,
    modulation_cycles: int,
    modulation_depth: float,
    envelope: np.ndarray | None = None,
) -> None:
    voice = oscillator(base_phase, frequency, phase)
    modulation = 1.0 + modulation_depth * np.sin(
        base_phase * modulation_cycles + phase * 0.37,
        dtype=np.float32,
    )
    voice *= modulation
    if envelope is not None:
        voice *= envelope
    left = math.sqrt((1.0 - pan) * 0.5)
    right = math.sqrt((1.0 + pan) * 0.5)
    stereo[:, 0] += voice * (level * left)
    stereo[:, 1] += voice * (level * right)


def build_score(base_phase: np.ndarray, seconds: np.ndarray) -> np.ndarray:
    stereo = np.zeros((FRAME_COUNT, 2), dtype=np.float32)

    # D-A-E: no third, no conventional cadence. The slight periodic movement
    # creates breadth without turning the chamber into a cinematic trailer.
    voices = (
        (73.416, 0.31, -0.10, 0.13, 2, 0.16),
        (110.000, 0.22, 0.09, 1.17, 3, 0.13),
        (146.832, 0.105, -0.18, 2.43, 4, 0.17),
        (164.814, 0.145, 0.17, 0.68, 3, 0.19),
        (220.000, 0.052, -0.28, 1.91, 5, 0.23),
        (329.628, 0.028, 0.29, 2.74, 4, 0.27),
    )
    for voice in voices:
        add_voice(stereo, base_phase, *voice)

    # Four slow, circular resonances provide composed punctuation. Their tails
    # wrap mathematically across the loop boundary rather than being crossfaded.
    events = (
        (6.5, 440.0, 0.020, -0.23, 0.70, 7.2),
        (19.5, 659.255, 0.014, 0.21, 0.85, 8.0),
        (34.0, 493.883, 0.017, -0.08, 0.75, 7.8),
        (48.0, 987.767, 0.008, 0.18, 0.65, 8.6),
    )
    for index, (center, frequency, level, pan, attack, decay) in enumerate(events):
        envelope = circular_event_envelope(seconds, center, attack, decay)
        add_voice(
            stereo,
            base_phase,
            frequency,
            level,
            pan,
            0.47 + index * 0.83,
            2 + index,
            0.07,
            envelope,
        )

    air_mid = periodic_noise(0xA71A5, 130.0, 2_500.0, -0.72)
    air_side = periodic_noise(0xA71A6, 420.0, 5_400.0, -0.28)
    breath = 0.72 + 0.28 * np.sin(base_phase * 2 - 0.8, dtype=np.float32) ** 2
    stereo[:, 0] += (air_mid * 0.018 + air_side * 0.0065) * breath
    stereo[:, 1] += (air_mid * 0.018 - air_side * 0.0065) * breath
    return finish(stereo, target_rms_db=-24.5, peak_ceiling_db=-9.0)


def build_room(base_phase: np.ndarray) -> np.ndarray:
    stereo = np.zeros((FRAME_COUNT, 2), dtype=np.float32)
    low_air = periodic_noise(0x600D, 28.0, 720.0, -1.05)
    optical_air = periodic_noise(0x600E, 760.0, 5_800.0, -0.44)
    side_air = periodic_noise(0x600F, 190.0, 7_200.0, -0.18)
    breathing = 0.82 + 0.18 * np.sin(base_phase * 3 + 0.4, dtype=np.float32)
    stereo[:, 0] += (low_air * 0.20 + optical_air * 0.050 + side_air * 0.018) * breathing
    stereo[:, 1] += (low_air * 0.20 + optical_air * 0.050 - side_air * 0.018) * breathing

    # Transformer body and a nearly subliminal optical bench resonance.
    room_voices = (
        (60.0, 0.105, -0.05, 0.0, 2, 0.09),
        (120.0, 0.027, 0.05, 1.2, 3, 0.12),
        (180.0, 0.009, -0.08, 2.1, 2, 0.11),
        (880.0, 0.0035, 0.20, 0.7, 4, 0.22),
        (1_320.0, 0.0018, -0.20, 2.4, 5, 0.25),
    )
    for voice in room_voices:
        add_voice(stereo, base_phase, *voice)
    return finish(stereo, target_rms_db=-34.0, peak_ceiling_db=-15.0)


def finish(stereo: np.ndarray, target_rms_db: float, peak_ceiling_db: float) -> np.ndarray:
    stereo -= np.mean(stereo, axis=0, keepdims=True)
    stereo = np.tanh(stereo * 1.12).astype(np.float32)
    rms = float(np.sqrt(np.mean(np.square(stereo, dtype=np.float64))))
    target_rms = 10 ** (target_rms_db / 20)
    if rms > 0:
        stereo *= target_rms / rms
    ceiling = 10 ** (peak_ceiling_db / 20)
    peak = float(np.max(np.abs(stereo)))
    if peak > ceiling:
        stereo *= ceiling / peak
    return stereo


def write_wave(path: Path, stereo: np.ndarray) -> None:
    pcm = np.round(np.clip(stereo, -1.0, 1.0) * 32_767.0).astype("<i2")
    with wave.open(str(path), "wb") as output:
        output.setnchannels(2)
        output.setsampwidth(2)
        output.setframerate(SAMPLE_RATE)
        output.writeframes(pcm.tobytes())


def encode(source: Path, destination: Path, codec: str, serial_offset: int) -> None:
    common = [
        "ffmpeg",
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-fflags",
        "+bitexact",
        "-i",
        str(source),
        "-map_metadata",
        "-1",
        "-vn",
        "-ar",
        str(SAMPLE_RATE),
        "-ac",
        "2",
    ]
    if codec == "opus":
        command = common + [
            "-c:a",
            "libopus",
            "-application",
            "audio",
            "-b:a",
            "80k",
            "-vbr",
            "on",
            "-compression_level",
            "10",
            "-frame_duration",
            "20",
            "-fflags",
            "+bitexact",
            "-flags:a",
            "+bitexact",
            "-serial_offset",
            str(serial_offset),
            str(destination),
        ]
    else:
        command = common + [
            "-c:a",
            "aac",
            "-b:a",
            "112k",
            "-movflags",
            "+faststart",
            str(destination),
        ]
    subprocess.run(command, check=True)


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def seam_report(name: str, stereo: np.ndarray) -> str:
    seam = float(np.max(np.abs(stereo[0] - stereo[-1])))
    adjacent = np.max(np.abs(np.diff(stereo, axis=0)), axis=1)
    p99 = float(np.percentile(adjacent, 99.9))
    ratio = seam / max(p99, 1e-12)
    rms = float(np.sqrt(np.mean(np.square(stereo, dtype=np.float64))))
    peak = float(np.max(np.abs(stereo)))
    return (
        f"{name}: rms={20 * math.log10(rms):.2f} dBFS "
        f"peak={20 * math.log10(peak):.2f} dBFS "
        f"seam={seam:.7f} ({ratio:.2f}x p99.9 adjacent step)"
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "assets" / "audio",
    )
    arguments = parser.parse_args()

    if not shutil.which("ffmpeg"):
        raise SystemExit("ffmpeg is required")
    arguments.output_dir.mkdir(parents=True, exist_ok=True)

    base_phase = np.arange(FRAME_COUNT, dtype=np.float32) * np.float32(TAU / FRAME_COUNT)
    seconds = np.arange(FRAME_COUNT, dtype=np.float32) / np.float32(SAMPLE_RATE)

    with tempfile.TemporaryDirectory(prefix="atlas-chamber-audio-") as temporary:
        temporary_path = Path(temporary)
        for index, (name, builder) in enumerate((("score", build_score), ("room", build_room))):
            stereo = builder(base_phase, seconds) if name == "score" else builder(base_phase)
            print(seam_report(name, stereo))
            wave_path = temporary_path / f"atlas-{name}.wav"
            write_wave(wave_path, stereo)
            aac_wave_path = temporary_path / f"atlas-{name}-aac-context.wav"
            aac_context = np.concatenate(
                (stereo[-AAC_GUARD_FRAMES:], stereo, stereo[:AAC_GUARD_FRAMES]),
                axis=0,
            )
            write_wave(aac_wave_path, aac_context)
            del stereo, aac_context

            opus = arguments.output_dir / f"atlas-{name}.opus"
            m4a = arguments.output_dir / f"atlas-{name}.m4a"
            encode(wave_path, opus, "opus", serial_offset=0xA71A5 + index)
            encode(aac_wave_path, m4a, "aac", serial_offset=0)

            for path in (opus, m4a):
                print(f"{path}: {path.stat().st_size} bytes sha256={digest(path)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
