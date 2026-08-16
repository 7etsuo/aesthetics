from hashlib import sha256
from inspect import getsource

from PIL import Image

from vslib.build import default_root
from vslib.site_chamber import build_chamber_payload
from vslib.site_media import _edge_extruded_tile, write_evidence_atlases
from vslib.store import Library


def test_atlas_tile_gutters_repeat_edge_texels() -> None:
    tile = Image.new("RGB", (3, 2))
    tile.putdata([
        (10, 11, 12), (20, 21, 22), (30, 31, 32),
        (40, 41, 42), (50, 51, 52), (60, 61, 62),
    ])

    padded = _edge_extruded_tile(tile, 2)

    assert padded.size == (7, 6)
    assert [padded.getpixel((x, 0)) for x in range(7)] == [
        (10, 11, 12), (10, 11, 12), (10, 11, 12),
        (20, 21, 22), (30, 31, 32), (30, 31, 32), (30, 31, 32),
    ]
    assert [padded.getpixel((0, y)) for y in range(6)] == [
        (10, 11, 12), (10, 11, 12), (10, 11, 12),
        (40, 41, 42), (40, 41, 42), (40, 41, 42),
    ]
    assert [padded.getpixel((x, 5)) for x in range(7)] == [
        (40, 41, 42), (40, 41, 42), (40, 41, 42),
        (50, 51, 52), (60, 61, 62), (60, 61, 62), (60, 61, 62),
    ]
    assert [padded.getpixel((6, y)) for y in range(6)] == [
        (30, 31, 32), (30, 31, 32), (30, 31, 32),
        (60, 61, 62), (60, 61, 62), (60, 61, 62),
    ]


def test_atlas_writer_pastes_each_extruded_tile_at_the_cell_origin() -> None:
    writer = getsource(write_evidence_atlases)

    assert "image_size = cell - (2 * gutter)" in writer
    assert "left = geometry[\"offset_x\"] + column * cell" in writer
    assert "top = geometry[\"offset_y\"] + atlas_row * cell" in writer
    assert "canvas.paste(_edge_extruded_tile(tile, gutter), (left, top))" in writer


def test_evidence_atlases_cover_every_nonhuman_field_observation(tmp_path):
    library = Library(default_root()).load()
    chamber = build_chamber_payload(library)
    field = chamber["field"]

    write_evidence_atlases(
        library,
        tmp_path,
        field["observations"],
        field["atlas"],
    )

    outputs = [
        tmp_path / field["atlas"]["desktop_path"],
        tmp_path / field["atlas"]["mobile_path"],
    ]
    assert [output.exists() for output in outputs] == [True, True]
    with Image.open(outputs[0]) as image:
        assert image.size == (2048, 2048)
        assert image.format == "WEBP"
    with Image.open(outputs[1]) as image:
        assert image.size == (1024, 1024)
        assert image.format == "WEBP"

    before = [sha256(output.read_bytes()).hexdigest() for output in outputs]
    write_evidence_atlases(
        library,
        tmp_path,
        reversed(field["observations"]),
        field["atlas"],
    )
    after = [sha256(output.read_bytes()).hexdigest() for output in outputs]
    assert after == before
