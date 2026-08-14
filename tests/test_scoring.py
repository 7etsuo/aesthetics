from types import SimpleNamespace

from vslib.build import default_root
from vslib.catalog import DAYLIGHT_ANCHOR_IDS, extra_hold_for
from vslib.scoring import (
    score_analog_texture,
    score_halation_v2,
    score_highlight_bloom,
    score_telecine,
)
from vslib.site_explorer import CONTROLLED_STUDY_IDS, CORRELATION_STUDY_IDS
from vslib.store import Library


def test_explorer_stays_on_the_original_hundred():
    assert "study_halation_002" not in CONTROLLED_STUDY_IDS
    assert "study_highlight_bloom_001" not in CONTROLLED_STUDY_IDS
    assert "study_telecine_softness_001" not in CONTROLLED_STUDY_IDS
    assert "study_analog_video_texture_001" not in CONTROLLED_STUDY_IDS
    assert "study_lamp_anchor_set_001" not in CORRELATION_STUDY_IDS
    assert "study_halation_002" not in CORRELATION_STUDY_IDS
    assert "study_highlight_bloom_001" not in CORRELATION_STUDY_IDS
    assert "study_telecine_softness_001" not in CORRELATION_STUDY_IDS
    assert "study_analog_video_texture_001" not in CORRELATION_STUDY_IDS


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


def test_transfer_studies_stay_on_daylight_anchors():
    library = Library(default_root()).load()
    assert library.studies["study_telecine_softness_001"].anchor_ids == DAYLIGHT_ANCHOR_IDS
    assert library.studies["study_analog_video_texture_001"].anchor_ids == DAYLIGHT_ANCHOR_IDS
    assert "scanlines" in extra_hold_for("vec_telecine_softness")
    assert "CRT bezel" in extra_hold_for("vec_analog_video_texture")


def test_optical_versus_telecine_scores_discriminate_on_the_portrait():
    obs = SimpleNamespace(intended_level="high", anchor_id="anchor_portrait")
    telecine_scores, _leaks, _note = score_telecine(obs)
    analog_scores, analog_leaks, _analog_note = score_analog_texture(obs)
    telecine = {item.vector_id: item.score for item in telecine_scores}
    analog = {item.vector_id: item.score for item in analog_scores}
    assert telecine["vec_telecine_softness"] > telecine["vec_optical_softness"]
    assert telecine["vec_telecine_softness"] > telecine["vec_analog_video_texture"]
    assert analog["vec_analog_video_texture"] > analog["vec_telecine_softness"]
    assert analog["vec_analog_video_texture"] > analog["vec_optical_softness"]
    fox = SimpleNamespace(intended_level="high", anchor_id="anchor_character")
    _scores, fox_leaks, _note = score_analog_texture(fox)
    assert "letterbox bars" in fox_leaks
    assert analog_leaks == []
