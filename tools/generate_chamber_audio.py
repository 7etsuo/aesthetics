#!/usr/bin/env python3
"""Build the Atlas chamber's licensed music derivatives.

The source is the official creator-hosted 320 kbps MP3 of Scott Buckley's
"Signal to Noise". Its checksum is pinned and the complete 5:53 master is
transcoded without trimming, looping, fades, loudness normalization,
time-stretching, or pitch processing.

The checked-in web derivatives are also checksum-pinned. A toolchain change
that produces different bytes fails before replacing either published file.
Atlas has no generated room stem or continuous synthesized ambience.

Outputs:
  assets/audio/signal-to-noise.opus  (Opus, 92 kbps constrained-VBR target)
  assets/audio/signal-to-noise.m4a   (AAC-LC, 128 kbps target)

Requirements: Python 3.11+, ffmpeg, and ffprobe.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import tempfile
import urllib.request
from pathlib import Path


SOURCE_URL = (
    "https://www.scottbuckley.com.au/library/wp-content/uploads/2020/04/"
    "sb_signaltonoise.mp3"
)
SOURCE_SHA256 = "47a2f15ecd65f1d7ef0418ee17ae31f4e724bdf73b2c2838aaa39ac1703d094e"
SOURCE_DURATION_SECONDS = 353.541224
OUTPUT_SHA256 = {
    "signal-to-noise.opus": "ae46157590f6173508a0d7b680bd0ec5ffe6c26fee132f2e064c7abd542131ea",
    "signal-to-noise.m4a": "da6aedd1d7d53ca3d8fd3511c0f79491d13a44cb9fcbfe3e657446e95c1d9b98",
}


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


def validate_derivative(path: Path) -> None:
    actual_duration = duration(path)
    if abs(actual_duration - SOURCE_DURATION_SECONDS) > 0.08:
        raise SystemExit(f"Unexpected duration for {path.name}: {actual_duration:.6f}s")
    expected_digest = OUTPUT_SHA256[path.name]
    actual_digest = digest(path)
    if actual_digest != expected_digest:
        raise SystemExit(
            f"Non-reproducible {path.name}; refusing to replace the published derivative.\n"
            f"expected: {expected_digest}\nactual:   {actual_digest}"
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
        help="Use a downloaded official MP3; its pinned checksum is still required.",
    )
    arguments = parser.parse_args()

    for executable in ("ffmpeg", "ffprobe"):
        if not shutil.which(executable):
            raise SystemExit(f"{executable} is required")

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

        candidates = (
            ("signal-to-noise.opus", "opus"),
            ("signal-to-noise.m4a", "aac"),
        )
        for filename, codec in candidates:
            candidate = temporary_path / filename
            encode_music(source, candidate, codec)
            validate_derivative(candidate)
            arguments.output_dir.mkdir(parents=True, exist_ok=True)
            destination = arguments.output_dir / filename
            shutil.copyfile(candidate, destination)
            report_output(destination)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
