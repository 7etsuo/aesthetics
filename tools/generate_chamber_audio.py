#!/usr/bin/env python3
"""Build the Atlas chamber's licensed music and original room layer.

The music source is the official creator-hosted 320 kbps MP3 of Scott
Buckley's "Signal to Noise". The source checksum is pinned and the complete
5:53 master is transcoded without trimming, looping, fades, loudness
normalization, time-stretching, or pitch processing.

The room layer is deterministic project-original synthesis: a seamless,
very-low-level 56-second stereo optical-room tone. It contains no samples.
AAC receives wrapped codec context so its decoded loop has no boundary click.

Outputs:
  assets/audio/signal-to-noise.opus  (Opus, 92 kbps constrained-VBR target)
  assets/audio/signal-to-noise.m4a   (AAC-LC, 128 kbps target)
  assets/audio/atlas-room.opus       (Opus, 48 kbps target)
  assets/audio/atlas-room.m4a        (AAC-LC, 64 kbps target)

Requirements: Python 3.11+, numpy, ffmpeg, and ffprobe.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import shutil
import subprocess
import tempfile
import urllib.request
import wave
from pathlib import Path

import numpy as np


SOURCE_URL = (
    "https://www.scottbuckley.com.au/library/wp-content/uploads/2020/04/"
    "sb_signaltonoise.mp3"
)
SOURCE_SHA256 = "47a2f15ecd65f1d7ef0418ee17ae31f4e724bdf73b2c2838aaa39ac1703d094e"
SOURCE_DURATION_SECONDS = 353.541224
SAMPLE_RATE = 48_000
ROOM_DURATION_SECONDS = 56
ROOM_FRAME_COUNT = SAMPLE_RATE * ROOM_DURATION_SECONDS
AAC_GUARD_SECONDS = 1.024
AAC_GUARD_FRAMES = round(SAMPLE_RATE * AAC_GUARD_SECONDS)
TAU = math.tau


def digest(path: Path) -> str:
    checksum = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            checksum.update(chunk)
    return checksum.hexdigest()


def download_source(destination: Path) -> None:
    request = urllib.request.Request(
        SOURCE_URL,
        headers={"User-Agent": "Atlas audio build/1.0 (+https://atlas.agenc.ag/)"},
    )
    with urllib.request.urlopen(request, timeout=45) as response, destination.open("wb") as output:
        shutil.copyfileobj(response, output, length=1024 * 1024)


def probe(path: Path) -> dict[str, object]:
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration,size,bit_rate:stream=codec_name,sample_rate,channels",
            "-of",
            "json",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


def duration(path: Path) -> float:
    return float(probe(path)["format"]["duration"])


def validate_source(path: Path) -> None:
    actual_digest = digest(path)
    if actual_digest != SOURCE_SHA256:
        raise SystemExit(
            "Official source checksum mismatch; refusing an unreviewed master.\n"
            f"expected: {SOURCE_SHA256}\nactual:   {actual_digest}"
        )
    actual_duration = duration(path)
    if abs(actual_duration - SOURCE_DURATION_SECONDS) > 0.02:
        raise SystemExit(
            f"Official source duration changed: {actual_duration:.6f}s "
            f"(expected {SOURCE_DURATION_SECONDS:.6f}s)"
        )


def music_metadata() -> list[str]:
    return [
        "-metadata",
        "title=Signal to Noise",
        "-metadata",
        "artist=Scott Buckley",
        "-metadata",
        "copyright=Licensed under Creative Commons Attribution 4.0 International",
        "-metadata",
        f"comment=Official source: {SOURCE_URL}",
    ]


def encode_music(source: Path, destination: Path, codec: str) -> None:
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
        "-map",
        "0:a:0",
        "-vn",
        "-ac",
        "2",
    ]
    if codec == "opus":
        command = common + [
            "-ar",
            "48000",
            "-c:a",
            "libopus",
            "-application",
            "audio",
            "-b:a",
            "92k",
            "-vbr",
            "constrained",
            "-compression_level",
            "10",
            "-frame_duration",
            "20",
            "-flags:a",
            "+bitexact",
            "-fflags",
            "+bitexact",
            "-serial_offset",
            "684875",
        ]
    elif codec == "aac":
        command = common + [
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            "-fflags",
            "+bitexact",
            "-movflags",
            "+faststart+use_metadata_tags",
        ]
    else:
        raise ValueError(f"Unsupported codec: {codec}")
    subprocess.run(command + music_metadata() + [str(destination)], check=True)


def periodic_frequency(target_hz: float) -> int:
    return round(target_hz * ROOM_DURATION_SECONDS)


def oscillator(base_phase: np.ndarray, target_hz: float, phase: float = 0.0) -> np.ndarray:
    return np.sin(base_phase * periodic_frequency(target_hz) + phase, dtype=np.float32)


def periodic_noise(seed: int, low_hz: float, high_hz: float, tilt: float = 0.0) -> np.ndarray:
    """Return deterministic shaped noise whose end wraps exactly to its start."""

    frequencies = np.fft.rfftfreq(ROOM_FRAME_COUNT, 1 / SAMPLE_RATE)
    magnitude = np.zeros_like(frequencies)
    band = (frequencies >= low_hz) & (frequencies <= high_hz)
    reference = np.maximum(frequencies[band], max(low_hz, 20.0)) / 200.0
    magnitude[band] = np.power(reference, tilt)

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
    signal = np.fft.irfft(spectrum, n=ROOM_FRAME_COUNT).astype(np.float32)
    rms = float(np.sqrt(np.mean(np.square(signal, dtype=np.float64))))
    if rms > 0:
        signal /= rms
    return signal


def add_voice(
    stereo: np.ndarray,
    base_phase: np.ndarray,
    frequency: float,
    level: float,
    pan: float,
    phase: float,
    modulation_cycles: int,
    modulation_depth: float,
) -> None:
    voice = oscillator(base_phase, frequency, phase)
    voice *= 1.0 + modulation_depth * np.sin(
        base_phase * modulation_cycles + phase * 0.37,
        dtype=np.float32,
    )
    left = math.sqrt((1.0 - pan) * 0.5)
    right = math.sqrt((1.0 + pan) * 0.5)
    stereo[:, 0] += voice * (level * left)
    stereo[:, 1] += voice * (level * right)


def finish(stereo: np.ndarray, target_rms_db: float, peak_ceiling_db: float) -> np.ndarray:
    stereo -= np.mean(stereo, axis=0, keepdims=True)
    stereo = np.tanh(stereo * 1.08).astype(np.float32)
    rms = float(np.sqrt(np.mean(np.square(stereo, dtype=np.float64))))
    target_rms = 10 ** (target_rms_db / 20)
    if rms > 0:
        stereo *= target_rms / rms
    ceiling = 10 ** (peak_ceiling_db / 20)
    peak = float(np.max(np.abs(stereo)))
    if peak > ceiling:
        stereo *= ceiling / peak
    return stereo


def build_room(base_phase: np.ndarray) -> np.ndarray:
    stereo = np.zeros((ROOM_FRAME_COUNT, 2), dtype=np.float32)
    low_air = periodic_noise(0x600D, 28.0, 640.0, -1.08)
    optical_air = periodic_noise(0x600E, 760.0, 4_600.0, -0.5)
    side_air = periodic_noise(0x600F, 220.0, 5_800.0, -0.24)
    breathing = 0.86 + 0.14 * np.sin(base_phase * 3 + 0.4, dtype=np.float32)
    stereo[:, 0] += (low_air * 0.20 + optical_air * 0.042 + side_air * 0.013) * breathing
    stereo[:, 1] += (low_air * 0.20 + optical_air * 0.042 - side_air * 0.013) * breathing

    # Transformer body and near-subliminal optical-bench resonances.
    voices = (
        (60.0, 0.09, -0.05, 0.0, 2, 0.07),
        (120.0, 0.022, 0.05, 1.2, 3, 0.09),
        (180.0, 0.006, -0.08, 2.1, 2, 0.08),
        (880.0, 0.0025, 0.18, 0.7, 4, 0.16),
        (1320.0, 0.0012, -0.18, 2.4, 5, 0.18),
    )
    for voice in voices:
        add_voice(stereo, base_phase, *voice)
    return finish(stereo, target_rms_db=-36.0, peak_ceiling_db=-17.0)


def write_wave(path: Path, stereo: np.ndarray) -> None:
    pcm = np.round(np.clip(stereo, -1.0, 1.0) * 32_767.0).astype("<i2")
    with wave.open(str(path), "wb") as output:
        output.setnchannels(2)
        output.setsampwidth(2)
        output.setframerate(SAMPLE_RATE)
        output.writeframes(pcm.tobytes())


def encode_room(source: Path, destination: Path, codec: str) -> None:
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
            "48k",
            "-vbr",
            "on",
            "-compression_level",
            "10",
            "-flags:a",
            "+bitexact",
            "-fflags",
            "+bitexact",
            "-serial_offset",
            "684876",
        ]
    elif codec == "aac":
        command = common + [
            "-c:a",
            "aac",
            "-b:a",
            "64k",
            "-fflags",
            "+bitexact",
            "-movflags",
            "+faststart",
        ]
    else:
        raise ValueError(f"Unsupported codec: {codec}")
    subprocess.run(command + [str(destination)], check=True)


def seam_report(stereo: np.ndarray) -> str:
    seam = float(np.max(np.abs(stereo[0] - stereo[-1])))
    adjacent = np.max(np.abs(np.diff(stereo, axis=0)), axis=1)
    p99 = float(np.percentile(adjacent, 99.9))
    ratio = seam / max(p99, 1e-12)
    rms = float(np.sqrt(np.mean(np.square(stereo, dtype=np.float64))))
    peak = float(np.max(np.abs(stereo)))
    return (
        f"room: rms={20 * math.log10(rms):.2f} dBFS "
        f"peak={20 * math.log10(peak):.2f} dBFS "
        f"seam={seam:.7f} ({ratio:.2f}x p99.9 adjacent step)"
    )


def report_output(path: Path) -> None:
    details = probe(path)
    print(
        f"{path}: {path.stat().st_size} bytes "
        f"duration={float(details['format']['duration']):.6f}s sha256={digest(path)}"
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "assets" / "audio",
    )
    parser.add_argument(
        "--source-mp3",
        type=Path,
        help="Use a previously downloaded official MP3; its pinned checksum is still required.",
    )
    arguments = parser.parse_args()

    for executable in ("ffmpeg", "ffprobe"):
        if not shutil.which(executable):
            raise SystemExit(f"{executable} is required")
    arguments.output_dir.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory(prefix="atlas-chamber-audio-") as temporary:
        temporary_path = Path(temporary)
        if arguments.source_mp3:
            source = arguments.source_mp3.resolve()
            if not source.is_file():
                raise SystemExit(f"Source MP3 not found: {source}")
        else:
            source = temporary_path / "signal-to-noise-source.mp3"
            print(f"Downloading official creator master: {SOURCE_URL}")
            download_source(source)
        validate_source(source)
        print(
            f"source: {source.stat().st_size} bytes "
            f"duration={duration(source):.6f}s sha256={digest(source)}"
        )

        music_outputs = (
            (arguments.output_dir / "signal-to-noise.opus", "opus"),
            (arguments.output_dir / "signal-to-noise.m4a", "aac"),
        )
        for destination, codec in music_outputs:
            encode_music(source, destination, codec)
            if abs(duration(destination) - SOURCE_DURATION_SECONDS) > 0.08:
                raise SystemExit(f"Unexpected duration after {codec} transcode: {duration(destination):.6f}s")
            report_output(destination)

        base_phase = np.arange(ROOM_FRAME_COUNT, dtype=np.float32) * np.float32(
            TAU / ROOM_FRAME_COUNT
        )
        room = build_room(base_phase)
        print(seam_report(room))
        room_wave = temporary_path / "atlas-room.wav"
        write_wave(room_wave, room)
        room_aac_wave = temporary_path / "atlas-room-aac-context.wav"
        room_aac_context = np.concatenate(
            (room[-AAC_GUARD_FRAMES:], room, room[:AAC_GUARD_FRAMES]),
            axis=0,
        )
        write_wave(room_aac_wave, room_aac_context)

        room_outputs = (
            (room_wave, arguments.output_dir / "atlas-room.opus", "opus"),
            (room_aac_wave, arguments.output_dir / "atlas-room.m4a", "aac"),
        )
        for source_wave, destination, codec in room_outputs:
            encode_room(source_wave, destination, codec)
            report_output(destination)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
