import pytest

from vslib.build import default_root
from vslib.site_explorer import CORRELATION_STUDY_IDS, build_explorer_payload, score_support
from vslib.store import Library


@pytest.fixture(scope="module")
def payload() -> dict:
    library = Library(default_root()).load()
    return build_explorer_payload(library)


def test_explorer_contract_and_fixed_architecture_hero(payload: dict):
    assert payload["schema"] == "visual-basis-atlas/explorer-v1"
    assert payload["model_label"] == "Grok Imagine"
    assert payload["score_method"] == "agent_visual"
    assert payload["observed_at"] == "2026-08-14"

    hero = payload["hero"]
    assert hero["study_id"] == "study_diffusion_001"
    assert hero["vector_id"] == "vec_diffusion"
    assert hero["anchor_id"] == "anchor_architecture"
    assert [level["observation_id"] for level in hero["levels"]] == [
        "obs_0077",
        "obs_0078",
        "obs_0079",
    ]
    assert [level["requested_level"] for level in hero["levels"]] == ["low", "medium", "high"]
    assert all(level["anchor_id"] == "anchor_architecture" for level in hero["levels"])

    diffusion_scores = [
        next(score["value"] for score in level["scores"] if score["vector_id"] == "vec_diffusion")
        for level in hero["levels"]
    ]
    assert diffusion_scores == [0.08, 0.42, 0.88]


def test_all_controlled_studies_have_paired_response_deltas(payload: dict):
    responses = {response["vector_id"]: response for response in payload["responses"]}
    assert set(responses) == {
        "vec_diffusion",
        "vec_halation",
        "vec_highlight_bloom",
        "vec_optical_softness",
        "vec_shadow_density",
        "vec_black_level",
        "vec_key_to_fill_ratio",
        "vec_bokeh_softness",
        "vec_edge_softness",
        "vec_telecine_softness",
        "vec_analog_video_texture",
    }
    assert all(response["n_pairs"] == 5 for response in responses.values())
    assert all(
        len(response["architecture_levels"]) == 3
        for vector_id, response in responses.items()
        if vector_id not in {"vec_halation", "vec_highlight_bloom"}
    )
    assert responses["vec_halation"]["architecture_levels"] == []
    assert responses["vec_highlight_bloom"]["architecture_levels"] == []

    diffusion = {
        component["vector_id"]: component
        for component in responses["vec_diffusion"]["mean_response_delta"]
    }
    assert diffusion["vec_diffusion"]["value"] == pytest.approx(0.724)
    assert diffusion["vec_diffusion"]["n_pairs"] == 5
    assert diffusion["vec_veiling_glare"]["value"] == pytest.approx(0.26)
    assert diffusion["vec_veiling_glare"]["n_pairs"] == 5
    assert "vec_atmospheric_haze_response" not in diffusion


def test_latest_controlled_studies_enter_response_but_not_correlation_cohort(payload: dict):
    responses = {response["study_id"] for response in payload["responses"]}
    assert "study_halation_002" in responses
    assert "study_highlight_bloom_001" in responses
    assert "study_telecine_softness_001" in responses
    assert "study_analog_video_texture_001" in responses
    assert payload["stats"]["controlled_vector_studies"] == 11
    assert payload["stats"]["observations"] == 210
    assert all(row["n"] == 100 for row in payload["correlations"])


def test_correlations_only_use_scores_present_in_all_observations(payload: dict):
    library = Library(default_root()).load()
    support = score_support(library, study_ids=CORRELATION_STUDY_IDS)
    complete = {vector_id for vector_id, count in support.items() if count == 100}
    correlated = {
        vector_id
        for row in payload["correlations"]
        for vector_id in (row["a"], row["b"])
    }

    assert len(complete) == 12
    assert correlated == complete
    assert all(row["n"] == 100 for row in payload["correlations"])
    assert all(row["method"] == "pearson_unweighted" for row in payload["correlations"])
    assert "vec_veiling_glare" not in correlated
    assert "vec_atmospheric_haze_response" not in correlated
    assert "vec_highlight_color_bias" not in correlated

    edge_micro = next(
        row
        for row in payload["correlations"]
        if {row["a"], row["b"]} == {"vec_edge_softness", "vec_microcontrast"}
    )
    assert edge_micro["r"] == pytest.approx(-0.9592, abs=0.00005)


def test_reconstruction_is_honest_and_homepage_plates_are_nonhuman(payload: dict):
    reconstruction = payload["reconstruction"]
    assert reconstruction["interpretation"] == "manual_first_order_hypothesis"
    assert [weight["weight"] for weight in reconstruction["weights"]] == [0.78, 0.7, 0.58]
    assert reconstruction["aggregate"] == {
        "n": 5,
        "mean": pytest.approx(0.532),
        "median": 0.52,
        "range": [0.48, 0.62],
        "human_rated": False,
        "n_human_ratings": 0,
    }
    assert [plate["anchor_id"] for plate in reconstruction["selected_plates"]] == [
        "anchor_object",
        "anchor_landscape",
    ]
    assert all("portrait" not in plate["image_path"] for plate in reconstruction["selected_plates"])
    assert all("character" not in plate["image_path"] for plate in reconstruction["selected_plates"])

    residuals = {row["vector_id"]: row["count"] for row in reconstruction["residual_counts"]}
    assert residuals["vec_highlight_bloom"] == 5
