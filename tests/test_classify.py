from vslib.build import default_root
from vslib.classify import classify
from vslib.seed import materialize
from vslib.store import Library


def _lib():
    lib = Library(default_root())
    lib.ensure_dirs()
    return materialize(lib)


def test_cinematic_is_vague():
    hit = classify(_lib(), "cinematic")
    assert hit.kind == "vague"
    assert hit.target_id in {None, "aes_cinematic_generic"}


def test_halation_is_vector():
    hit = classify(_lib(), "halation")
    assert hit.target_id == "vec_halation"
    assert hit.kind in {"atomic_vector", "candidate"}


def test_old_tv_softness_alias():
    hit = classify(_lib(), "old-tv softness")
    assert hit.target_id == "vec_telecine_softness"
    assert hit.kind == "alias"


def test_80s_fantasy_is_composite():
    hit = classify(_lib(), "1980s fantasy")
    assert hit.target_id == "aes_80s_fantasy_tv"
    assert hit.kind == "composite_aesthetic"
