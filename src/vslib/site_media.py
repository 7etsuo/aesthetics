"""Deterministic presentation media for the generated Atlas site.

Canonical evidence images remain untouched.  The helpers in this module only
produce display derivatives used by the homepage renderer.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any, Iterable

from PIL import Image, ImageOps

from vslib.store import Library


ATLAS_COLUMNS = 12
ATLAS_ROWS = 11
ATLAS_DESKTOP_PATH = "assets/evidence-atlas-2048.webp"
ATLAS_MOBILE_PATH = "assets/evidence-atlas-1024.webp"


def _edge_extruded_tile(tile: Image.Image, gutter: int) -> Image.Image:
    """Pad a tile by repeating its edge texels for mip-safe atlas filtering."""

    if gutter <= 0:
        return tile.copy()
    width, height = tile.size
    if width < 1 or height < 1:
        raise ValueError("atlas tile must contain at least one pixel")
    output = Image.new(tile.mode, (width + 2 * gutter, height + 2 * gutter))
    nearest = Image.Resampling.NEAREST
    output.paste(tile, (gutter, gutter))
    output.paste(tile.crop((0, 0, width, 1)).resize((width, gutter), nearest), (gutter, 0))
    output.paste(
        tile.crop((0, height - 1, width, height)).resize((width, gutter), nearest),
        (gutter, gutter + height),
    )
    output.paste(tile.crop((0, 0, 1, height)).resize((gutter, height), nearest), (0, gutter))
    output.paste(
        tile.crop((width - 1, 0, width, height)).resize((gutter, height), nearest),
        (gutter + width, gutter),
    )
    corners = (
        ((0, 0, 1, 1), (0, 0)),
        ((width - 1, 0, width, 1), (gutter + width, 0)),
        ((0, height - 1, 1, height), (0, gutter + height)),
        ((width - 1, height - 1, width, height), (gutter + width, gutter + height)),
    )
    for crop_box, destination in corners:
        output.paste(tile.crop(crop_box).resize((gutter, gutter), nearest), destination)
    return output


def evidence_atlas_manifest(observation_ids: Iterable[str]) -> dict[str, Any]:
    """Return the stable tile lookup shared by Python and the WebGL runtime."""

    ordered = sorted(observation_ids)
    capacity = ATLAS_COLUMNS * ATLAS_ROWS
    if len(ordered) > capacity:
        raise ValueError(
            f"evidence atlas supports {capacity} observations, got {len(ordered)}"
        )
    return {
        "desktop_path": ATLAS_DESKTOP_PATH,
        "mobile_path": ATLAS_MOBILE_PATH,
        "columns": ATLAS_COLUMNS,
        "rows": ATLAS_ROWS,
        "entries": {observation_id: index for index, observation_id in enumerate(ordered)},
        "desktop": {
            "width": 2048,
            "height": 2048,
            "cell_size": 160,
            "gutter": 2,
            "offset_x": 64,
            "offset_y": 144,
        },
        "mobile": {
            "width": 1024,
            "height": 1024,
            "cell_size": 80,
            "gutter": 1,
            "offset_x": 32,
            "offset_y": 72,
        },
    }


def write_evidence_atlases(
    lib: Library,
    site: Path,
    observations: Iterable[dict[str, Any]],
    manifest: dict[str, Any],
) -> None:
    """Write desktop and mobile thumbnail sheets from canonical observations."""

    rows = {row["id"]: row for row in observations}
    entry_ids = sorted(manifest["entries"], key=manifest["entries"].get)
    missing_rows = [observation_id for observation_id in entry_ids if observation_id not in rows]
    if missing_rows:
        raise KeyError("evidence atlas is missing rows: " + ", ".join(missing_rows))

    for tier, path_key in (("desktop", "desktop_path"), ("mobile", "mobile_path")):
        geometry = manifest[tier]
        canvas = Image.new(
            "RGB",
            (geometry["width"], geometry["height"]),
            (7, 9, 10),
        )
        cell = geometry["cell_size"]
        gutter = geometry["gutter"]
        image_size = cell - (2 * gutter)

        for observation_id in entry_ids:
            row = rows[observation_id]
            source = lib.root / row["image_path"]
            if not source.is_file():
                raise FileNotFoundError(source)
            index = manifest["entries"][observation_id]
            column = index % manifest["columns"]
            atlas_row = index // manifest["columns"]
            left = geometry["offset_x"] + column * cell
            top = geometry["offset_y"] + atlas_row * cell
            with Image.open(source) as original:
                tile = ImageOps.fit(
                    original.convert("RGB"),
                    (image_size, image_size),
                    method=Image.Resampling.LANCZOS,
                    centering=(0.5, 0.5),
                )
            canvas.paste(_edge_extruded_tile(tile, gutter), (left, top))

        output = site / manifest[path_key]
        output.parent.mkdir(parents=True, exist_ok=True)
        canvas.save(output, "WEBP", quality=76, method=6)
