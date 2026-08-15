#!/usr/bin/env python3
"""Build the v5 social preview from the optical-observatory artwork."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "art" / "optical-observatory-wide.webp"
OUTPUT = ROOT / "assets" / "social-card-v5.jpg"
SERIF = ROOT / "assets" / "fonts" / "instrument-serif-regular-latin.woff2"
SANS = ROOT / "assets" / "fonts" / "instrument-sans-latin.woff2"


def build() -> None:
    with Image.open(SOURCE) as source:
        background = source.convert("RGB").resize((1200, 630), Image.Resampling.LANCZOS)

    # Pull the artwork back slightly so copy remains legible while the brass and
    # glass retain enough luminance to survive social-platform recompression.
    background = ImageEnhance.Brightness(background).enhance(0.92)
    card = background.convert("RGBA")
    overlay = Image.new("RGBA", card.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rectangle((0, 0, 535, 630), fill=(15, 16, 15, 146))
    overlay_draw.rectangle((0, 0, 1200, 9), fill=(214, 164, 92, 255))
    card = Image.alpha_composite(card, overlay)

    draw = ImageDraw.Draw(card)
    serif = ImageFont.truetype(SERIF, 78)
    sans_small = ImageFont.truetype(SANS, 20)
    sans_mark = ImageFont.truetype(SANS, 25)
    ink = (246, 241, 231, 255)
    quiet = (215, 207, 194, 255)
    amber = (229, 178, 102, 255)

    draw.text((55, 52), "GROK IMAGINE UNDER OBSERVATION", font=sans_small, fill=amber)
    draw.multiline_text(
        (52, 165),
        "Change one thing.\nWatch the image answer.",
        font=serif,
        fill=ink,
        spacing=-8,
    )
    draw.text((56, 548), "VISUAL BASIS ATLAS", font=sans_mark, fill=ink)
    draw.text((56, 584), "Controlled outputs · measured response · provisional basis", font=sans_small, fill=quiet)

    card.convert("RGB").save(OUTPUT, "JPEG", quality=91, optimize=True, progressive=True)


if __name__ == "__main__":
    build()

