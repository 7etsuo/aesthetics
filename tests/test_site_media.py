from hashlib import sha256

from PIL import Image

from vslib.build import default_root
from vslib.site_chamber import build_chamber_payload
from vslib.site_media import write_evidence_atlases
from vslib.store import Library


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
