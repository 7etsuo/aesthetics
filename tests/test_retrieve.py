from vslib.build import default_root
from vslib.retrieve import compare_aesthetics, map_language
from vslib.seed import materialize
from vslib.store import Library


def test_compare_finds_shared_and_distinct_weights():
    lib = materialize(Library(default_root()))
    result = compare_aesthetics(lib, "aes_soft_halated_shadow", "aes_80s_fantasy_tv")
    ids = {row["vector_id"] for row in result["deltas"]}
    assert "vec_optical_softness" in ids
    assert "vec_telecine_softness" in ids
    assert result["distance"]["euclidean"] > 0


def test_map_analog_is_not_atomic():
    lib = materialize(Library(default_root()))
    hit = map_language(lib, "analog")
    assert hit["kind"] in {"vague", "alias"}
    if hit["target_id"]:
        assert not hit["target_id"].startswith("vec_") or hit["kind"] != "atomic_vector"
