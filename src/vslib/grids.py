"""Assemble comparison grids in code, never as a single Imagine image."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from vslib.store import Library

CELL = 360
PAD = 10
HEADER = 36
LABEL = 28
BG = (22, 24, 26)
INK = (232, 226, 214)
RULE = (42, 111, 115)
MUTED = (168, 162, 150)


def _font(size: int) -> ImageFont.ImageFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def _open_fit(path: Path, size: int) -> Image.Image:
    image = Image.open(path).convert("RGB")
    image.thumbnail((size, size), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (size, size), (16, 16, 16))
    x = (size - image.width) // 2
    y = (size - image.height) // 2
    canvas.paste(image, (x, y))
    return canvas


def study_grid(lib: Library, study_id: str) -> Path | None:
    study = lib.studies[study_id]
    levels = [lvl for lvl in study.levels if lvl != "baseline"]
    if not levels:
        levels = ["low", "medium", "high"]
    anchors = [lib.anchors[a] for a in study.anchor_ids if a in lib.anchors]
    if not anchors:
        return None

    by_key: dict[tuple[str, str], Path] = {}
    for obs in lib.observations.values():
        if obs.study_id != study_id or not obs.anchor_id or not obs.intended_level:
            continue
        by_key[(obs.anchor_id, obs.intended_level)] = lib.root / obs.image_path

    cols = len(levels)
    rows = len(anchors)
    width = PAD * 2 + cols * CELL + (cols - 1) * PAD
    height = PAD + HEADER + rows * (CELL + LABEL + PAD)
    canvas = Image.new("RGB", (width, height), BG)
    draw = ImageDraw.Draw(canvas)
    title_font = _font(18)
    label_font = _font(14)
    draw.text((PAD, 8), study.id, font=title_font, fill=INK)
    draw.rectangle((0, HEADER - 2, width, HEADER), fill=RULE)

    for r, anchor in enumerate(anchors):
        y = HEADER + PAD + r * (CELL + LABEL + PAD)
        draw.text((PAD, y + CELL + 6), anchor.name, font=label_font, fill=MUTED)
        for c, level in enumerate(levels):
            x = PAD + c * (CELL + PAD)
            path = by_key.get((anchor.id, level))
            if path and path.exists():
                cell = _open_fit(path, CELL)
            else:
                cell = Image.new("RGB", (CELL, CELL), (40, 40, 40))
            canvas.paste(cell, (x, y))
            draw.text((x, y - 1), level, font=label_font, fill=INK)

    dest = lib.root / "artifacts" / "grids" / f"{study_id}.jpg"
    dest.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dest, quality=92)
    return dest


def write_all_grids(lib: Library) -> list[Path]:
    paths = []
    for study_id, study in lib.studies.items():
        if study.levels == ["baseline"]:
            continue
        path = study_grid(lib, study_id)
        if path:
            paths.append(path)
    return paths
