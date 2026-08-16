#!/usr/bin/env python3
"""Build the Atlas V5 social card from the approved Control scene plate."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont


ROOT = Path(__file__).resolve().parents[1]
WORLD_MANIFEST = ROOT / "assets" / "world-v5" / "atlas-world-v2.json"
SOURCE = ROOT / "assets" / "world-v5" / "social-source.webp"
OUTPUT = ROOT / "assets" / "social-card-v5.jpg"
SERIF = ROOT / "assets" / "fonts" / "instrument-serif-regular-latin.woff2"
SANS = ROOT / "assets" / "fonts" / "inter-tight-latin.woff2"
SIZE = (1200, 630)

GRAPHITE = (13, 21, 23)
PALE_MARINE = (216, 232, 230)
SEA_GLASS = (169, 201, 198)
SALT = (241, 243, 237)


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _validated_source() -> Image.Image:
    manifest = json.loads(WORLD_MANIFEST.read_text(encoding="utf-8"))
    record = manifest["scenePlates"]["socialSource"]
    if record["path"] != "assets/world-v5/social-source.webp":
        raise RuntimeError("World manifest no longer points to the approved social source")
    if record["sha256"] != _sha256(SOURCE) or record["bytes"] != SOURCE.stat().st_size:
        raise RuntimeError("Social source does not match its world-manifest record")
    with Image.open(SOURCE) as opened:
        if opened.format != "WEBP" or opened.size != SIZE:
            raise RuntimeError("Social source must be the authored 1200 x 630 Control crop")
        return opened.convert("RGB")


def _marine_grade(image: Image.Image) -> Image.Image:
    graded = ImageEnhance.Color(image).enhance(0.76)
    graded = ImageEnhance.Contrast(graded).enhance(1.04)
    graded = ImageEnhance.Brightness(graded).enhance(0.88)
    marine = Image.new("RGB", SIZE, (181, 207, 207))
    return Image.blend(graded, marine, 0.055).convert("RGBA")


def _graphite_field() -> Image.Image:
    field = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(field)
    # A feathered field protects the typography while keeping the distant sea,
    # headland, and lamp readable as one continuous authored composition.
    for x in range(780):
        position = x / 779
        alpha = round(218 * (1.0 - position) ** 1.72)
        draw.line((x, 0, x, SIZE[1]), fill=(*GRAPHITE, alpha))
    bottom = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    bottom_draw = ImageDraw.Draw(bottom)
    for y in range(420, SIZE[1]):
        position = (y - 420) / (SIZE[1] - 420)
        alpha = round(74 * position**1.5)
        bottom_draw.line((0, y, SIZE[0], y), fill=(*GRAPHITE, alpha))
    return Image.alpha_composite(field, bottom)


def build() -> None:
    card = Image.alpha_composite(_marine_grade(_validated_source()), _graphite_field())
    draw = ImageDraw.Draw(card)
    serif = ImageFont.truetype(SERIF, 75)
    sans_overline = ImageFont.truetype(SANS, 19)
    sans_meta = ImageFont.truetype(SANS, 18)
    sans_micro = ImageFont.truetype(SANS, 15)

    draw.rectangle((0, 0, SIZE[0], 7), fill=(*PALE_MARINE, 255))
    draw.text((58, 48), "VISUAL BASIS ATLAS  /  OBSERVATION CHAMBER", font=sans_overline, fill=(*SEA_GLASS, 255))
    draw.line((59, 96, 153, 96), fill=(*SEA_GLASS, 235), width=2)
    draw.multiline_text(
        (53, 134),
        "Change one variable.\nThe image answers.",
        font=serif,
        fill=(*SALT, 255),
        spacing=-5,
    )
    draw.text((58, 518), "GROK IMAGINE  /  CONTROLLED VISUAL STUDIES", font=sans_meta, fill=(*PALE_MARINE, 255))
    draw.text(
        (58, 561),
        "CONTROL  ·  RESPONSE  ·  COMPARISON  ·  ASSOCIATION  ·  RECONSTRUCTION  ·  ARCHIVE",
        font=sans_micro,
        fill=(*SEA_GLASS, 245),
    )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    temporary = OUTPUT.with_name(f".{OUTPUT.name}.part")
    card.convert("RGB").save(
        temporary,
        "JPEG",
        quality=91,
        optimize=True,
        progressive=True,
        subsampling="4:2:0",
    )
    with Image.open(temporary) as check:
        if check.format != "JPEG" or check.size != SIZE:
            raise RuntimeError("Generated social card failed JPEG dimension validation")
    temporary.replace(OUTPUT)
    print(f"built {OUTPUT.relative_to(ROOT)} ({OUTPUT.stat().st_size:,} bytes, sha256={_sha256(OUTPUT)})")


if __name__ == "__main__":
    build()
