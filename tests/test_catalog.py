from vslib.build import default_root
from vslib.ids import validate_id
from vslib.seed import materialize
from vslib.store import Library


def test_seed_ids_and_families_line_up():
    lib = materialize(Library(default_root()))
    assert len(lib.vectors) >= 80
    assert len(lib.families) == 12
    for vec in lib.vectors.values():
        assert validate_id(vec.id) == "vector"
        assert vec.family_id in lib.families
    assert "vec_optical_softness" in lib.vectors
    assert "aes_soft_halated_shadow" in lib.aesthetics
    assert "aes_80s_fantasy_tv" in lib.aesthetics


def test_vague_labels_are_not_vectors():
    lib = materialize(Library(default_root()))
    names = {v.canonical_name.lower() for v in lib.vectors.values()}
    for banned in ("cinematic", "vintage", "analog", "1980s fantasy"):
        assert banned not in names
