from types import SimpleNamespace

from vslib.build import default_root
from vslib.catalog import extra_hold_for
from vslib.scoring import score_halation_v2, score_highlight_bloom
from vslib.site_explorer import CONTROLLED_STUDY_IDS, CORRELATION_STUDY_IDS
from vslib.store import Library


def test_explorer_stays_on_the_original_hundred():
    assert "study_halation_002" not in CONTROLLED_STUDY_IDS
    assert "study_highlight_bloom_001" not in CONTROLLED_STUDY_IDS
    assert "study_lamp_anchor_set_001" not in CORRELATION_STUDY_IDS
    assert "study_halation_002" not in CORRELATION_STUDY_IDS
    assert "study_highlight_bloom_001" not in CORRELATION_STUDY_IDS


def test_lamp_set_is_restricted_to_practicals():
    library = Library(default_root()).load()
    lamps = [
        "anchor_lamp_architecture",
        "anchor_lamp_character",
        "anchor_lamp_landscape",
        "anchor_lamp_object",
        "anchor_lamp_portrait",
    ]
    for anchor_id in lamps:
        assert library.anchors[anchor_id].image_path.endswith(f"{anchor_id}.jpg")
    assert library.studies["study_halation_002"].anchor_ids == lamps
    assert library.studies["study_highlight_bloom_001"].anchor_ids == lamps
    assert "already in the source image" in extra_hold_for("vec_halation")
    assert "existing bright regions" in extra_hold_for("vec_highlight_bloom")


def test_honest_glow_scores_discriminate_on_the_portrait():
    obs = SimpleNamespace(intended_level="high", anchor_id="anchor_lamp_portrait")
    halation_scores, leaks, _note = score_halation_v2(obs)
    bloom_scores, _bloom_leaks, _bloom_note = score_highlight_bloom(obs)
    halation = {item.vector_id: item.score for item in halation_scores}
    bloom = {item.vector_id: item.score for item in bloom_scores}
    assert halation["vec_halation"] > halation["vec_highlight_bloom"]
    assert bloom["vec_highlight_bloom"] > bloom["vec_halation"]
    assert "secondary red wash at the far frame edge" in leaks
