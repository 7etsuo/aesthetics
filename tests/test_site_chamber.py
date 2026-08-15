import copy
import json

import pytest

from vslib.build import default_root
from vslib.site import _home
from vslib.site_chamber import (
    CHAMBER_SCHEMA,
    COMPARISON_OBSERVATION_IDS,
    CONTROLLED_STUDY_IDS,
    FIELD_ANCHOR_IDS,
    build_chamber_payload,
)
from vslib.store import Library


@pytest.fixture(scope="module")
def library() -> Library:
    return Library(default_root()).load()


@pytest.fixture(scope="module")
def payload(library: Library) -> dict:
    return build_chamber_payload(library)


def _observations(payload: dict) -> dict[str, dict]:
    return {row["id"]: row for row in payload["field"]["observations"]}


def _scores(row: dict) -> dict[str, tuple[float, float]]:
    return {vector_id: (value, confidence) for vector_id, value, confidence in row["scores"]}


def test_chamber_contract_is_compact_normalized_and_explicit(payload: dict):
    assert payload["schema"] == CHAMBER_SCHEMA == "visual-basis-atlas/chamber-v1"
    assert payload["model_label"] == "Grok Imagine"
    assert payload["score_method"] == "agent_visual"
    assert payload["observed_at"] == "2026-08-14"
    assert payload["semantics"] == {
        "coordinates": "not_provided",
        "projection_basis": "observed_scores_only",
        "missing_scores": "omitted",
        "status_source": "study.status",
    }
    assert payload["field"]["score_tuple"] == ["vector_id", "value", "confidence"]
    assert "coordinates" not in payload["field"]

    serialized = json.dumps(payload, separators=(",", ":"), allow_nan=False)
    assert len(serialized.encode("utf-8")) < 125_000


def test_contract_is_deterministic_and_home_embeds_the_same_payload(
    library: Library,
    payload: dict,
):
    encoded = json.dumps(payload, separators=(",", ":"), allow_nan=False)
    rebuilt = json.dumps(
        build_chamber_payload(library),
        separators=(",", ":"),
        allow_nan=False,
    )
    assert rebuilt == encoded

    html = _home(library)
    marker = '<script type="application/json" id="chamber-data">'
    embedded = html.split(marker, 1)[1].split("</script>", 1)[0]
    assert json.loads(embedded) == payload


def test_home_v4_separates_the_world_finale_from_footer_utility(
    library: Library,
):
    html = _home(library)

    assert 'data-world="observatory"' in html
    assert 'data-world-entry' in html
    assert 'data-world-viewport' in html
    assert html.count('type="button" data-enter disabled aria-disabled="true">') == 1

    finale_start = html.index('data-world-finale')
    finale_end = html.index('</section>', finale_start)
    finale = html[finale_start:finale_end]
    assert "The experiment<br>continues." in finale
    assert 'data-world-portal-link' in finale
    assert 'id="atlas-search"' not in finale
    assert 'class="archive-secondary"' not in finale
    assert 'class="chamber-credits"' not in finale

    footer_start = html.index('data-world-footer')
    footer = html[footer_start:]
    assert footer_start > finale_end
    assert 'id="atlas-search"' in footer
    assert 'class="archive-secondary"' in footer
    assert 'class="chamber-credits"' in footer
    assert 'class="chamber-colophon"' in footer
    assert 'data-world-plates="reconstruction"' in html
    assert 'data-world-control="correlation-axis"' in html


def test_fixed_hero_resolves_to_exact_canonical_scores(payload: dict):
    hero = payload["hero"]
    assert hero == {
        "study_id": "study_diffusion_001",
        "vector_id": "vec_diffusion",
        "anchor_id": "anchor_architecture",
        "levels": [
            {"requested_level": "low", "observation_id": "obs_0077"},
            {"requested_level": "medium", "observation_id": "obs_0078"},
            {"requested_level": "high", "observation_id": "obs_0079"},
        ],
    }

    observations = _observations(payload)
    assert [
        _scores(observations[level["observation_id"]])["vec_diffusion"][0]
        for level in hero["levels"]
    ] == [0.08, 0.42, 0.88]
    assert all(
        observations[level["observation_id"]]["image_path"].endswith(
            f"anchor_architecture_{level['requested_level']}.jpg"
        )
        for level in hero["levels"]
    )


def test_every_controlled_study_has_one_architecture_triplet(payload: dict):
    assert [study["study_id"] for study in payload["studies"]] == list(CONTROLLED_STUDY_IDS)
    assert len(payload["studies"]) == 11
    observations = _observations(payload)

    for study in payload["studies"]:
        expected_anchor = (
            "anchor_lamp_architecture"
            if study["study_id"] in {"study_halation_002", "study_highlight_bloom_001"}
            else "anchor_architecture"
        )
        assert study["anchor_id"] == expected_anchor
        assert [level["requested_level"] for level in study["levels"]] == [
            "low",
            "medium",
            "high",
        ]
        assert len({level["observation_id"] for level in study["levels"]}) == 3
        for level in study["levels"]:
            observation = observations[level["observation_id"]]
            assert observation["study_id"] == study["study_id"]
            assert observation["vector_id"] == study["vector_id"]
            assert observation["requested_level"] == level["requested_level"]
            assert observation["anchor_id"] == expected_anchor


def test_halation_and_bloom_comparison_is_same_scene_and_level(payload: dict):
    comparison = payload["comparison"]
    assert comparison == {
        "anchor_id": "anchor_lamp_landscape",
        "requested_level": "high",
        "items": [
            {"vector_id": "vec_halation", "observation_id": "obs_0162"},
            {"vector_id": "vec_highlight_bloom", "observation_id": "obs_0177"},
        ],
    }
    assert tuple(item["observation_id"] for item in comparison["items"]) == (
        COMPARISON_OBSERVATION_IDS
    )

    observations = _observations(payload)
    halation_scores = _scores(observations["obs_0162"])
    bloom_scores = _scores(observations["obs_0177"])
    assert halation_scores["vec_halation"][0] == 0.84
    assert halation_scores["vec_highlight_bloom"][0] == 0.36
    assert bloom_scores["vec_halation"][0] == 0.22
    assert bloom_scores["vec_highlight_bloom"][0] == 0.84


def test_reconstruction_is_an_explicit_manual_hypothesis(payload: dict):
    reconstruction = payload["reconstruction"]
    assert reconstruction["study_id"] == "study_reconstruction_soft_halated_shadow_001"
    assert reconstruction["target_aesthetic_id"] == "aes_soft_halated_shadow"
    assert reconstruction["interpretation"] == "manual_first_order_hypothesis"
    assert reconstruction["weight_method"] == "manual_not_fitted"
    assert reconstruction["n_evaluations"] == 5
    assert reconstruction["human_rated"] is False
    assert reconstruction["n_human_ratings"] == 0
    assert [weight["weight"] for weight in reconstruction["weights"]] == [0.78, 0.7, 0.58]
    assert [weight["name"] for weight in reconstruction["weights"]] == [
        "optical softness",
        "shadow density",
        "halation",
    ]
    assert [plate["observation_id"] for plate in reconstruction["selected_plates"]] == [
        "obs_0052",
        "obs_0055",
    ]
    assert [plate["anchor_name"] for plate in reconstruction["selected_plates"]] == [
        "ordinary physical object",
        "landscape",
    ]
    assert [plate["score"] for plate in reconstruction["selected_plates"]] == [0.52, 0.54]
    assert reconstruction["residual_counts"] == [
        {
            "vector_id": "vec_highlight_bloom",
            "name": "highlight bloom",
            "count": 5,
            "n": 5,
        },
        {
            "vector_id": "vec_halation",
            "name": "halation",
            "count": 1,
            "n": 5,
        },
        {
            "vector_id": "vec_optical_softness",
            "name": "optical softness",
            "count": 1,
            "n": 5,
        },
        {
            "vector_id": "vec_shadow_density",
            "name": "shadow density",
            "count": 1,
            "n": 5,
        },
    ]
    assert all(
        plate["observation_id"] in _observations(payload)
        for plate in reconstruction["selected_plates"]
    )


def test_reconstruction_aggregate_is_scoped_to_its_declared_study(library: Library):
    expanded = copy.deepcopy(library)
    outside = copy.deepcopy(next(iter(expanded.reconstructions.values())))
    outside.id = "recon_outside_declared_study"
    outside.observation_id = "obs_0077"
    outside.reconstruction_score = 0.99
    outside.residual_vectors = ["vec_diffusion"]
    expanded.reconstructions[outside.id] = outside

    reconstruction = build_chamber_payload(expanded)["reconstruction"]

    assert reconstruction["n_evaluations"] == 5
    assert all(
        residual["vector_id"] != "vec_diffusion"
        for residual in reconstruction["residual_counts"]
    )


def test_field_is_exact_canonical_nonhuman_subset(payload: dict, library: Library):
    expected = {
        observation.id
        for observation in library.observations.values()
        if observation.anchor_id in FIELD_ANCHOR_IDS
    }
    observations = _observations(payload)

    assert payload["field"]["anchor_ids"] == list(FIELD_ANCHOR_IDS)
    assert payload["field"]["observation_count"] == len(expected) == 126
    assert set(observations) == expected
    assert {row["anchor_id"] for row in observations.values()} == set(FIELD_ANCHOR_IDS)
    assert {
        payload["anchors"][anchor_id]["kind"]
        for anchor_id in FIELD_ANCHOR_IDS
    } == {"architecture", "object", "landscape"}

    for observation_id, row in observations.items():
        canonical = library.observations[observation_id]
        study = library.studies[canonical.study_id]
        assert row["status"] == study.status
        assert row["decision"] == study.decision
        assert row["study_id"] == canonical.study_id
        assert row["vector_id"] == canonical.intended_vector_id
        assert row["requested_level"] == canonical.intended_level
        assert row["image_path"] == canonical.image_path
        assert (library.root / row["image_path"]).is_file()
        assert row["scores"] == [
            [score.vector_id, score.score, score.confidence]
            for score in sorted(
                (score for score in canonical.scores if score.method == "agent_visual"),
                key=lambda score: score.vector_id,
            )
        ]


def test_missing_scores_are_absent_not_zero_filled(payload: dict):
    observation = _observations(payload)["obs_0160"]
    scores = _scores(observation)
    assert "vec_bokeh_softness" not in scores
    assert len(observation["scores"]) == 9
    assert all(value is not None for _, value, _ in observation["scores"])
    assert all(confidence is not None for _, _, confidence in observation["scores"])


def test_field_atlas_manifest_is_complete_and_stable(payload: dict):
    field = payload["field"]
    atlas = field["atlas"]
    observation_ids = sorted(row["id"] for row in field["observations"])

    assert atlas["desktop_path"] == "assets/evidence-atlas-2048.webp"
    assert atlas["mobile_path"] == "assets/evidence-atlas-1024.webp"
    assert atlas["columns"] == 12
    assert atlas["rows"] == 11
    assert atlas["entries"] == {
        observation_id: index
        for index, observation_id in enumerate(observation_ids)
    }
    assert len(atlas["entries"]) == field["observation_count"] == 126


def test_response_metadata_preserves_pair_support(payload: dict):
    responses = payload["analysis"]["responses"]
    assert responses["method"] == "paired_high_minus_low_mean"
    assert responses["pairing"] == "within_anchor"
    assert responses["endpoint_levels"] == ["low", "high"]
    assert responses["missing_scores"] == "pair_omitted_for_component"
    assert responses["component_tuple"] == ["vector_id", "mean_delta", "n_pairs"]
    assert len(responses["studies"]) == 11

    diffusion = next(row for row in responses["studies"] if row["vector_id"] == "vec_diffusion")
    components = {
        vector_id: (mean_delta, n_pairs)
        for vector_id, mean_delta, n_pairs in diffusion["components"]
    }
    assert len(diffusion["paired_anchor_ids"]) == 5
    assert components["vec_diffusion"] == (pytest.approx(0.724), 5)
    assert components["vec_veiling_glare"] == (pytest.approx(0.26), 5)
    assert "vec_atmospheric_haze_response" not in components


def test_correlation_metadata_declares_complete_column_cohort(payload: dict):
    correlations = payload["analysis"]["correlations"]
    assert correlations["method"] == "pearson_unweighted"
    assert correlations["observation_count"] == 100
    assert correlations["support_rule"] == "score_present_in_every_cohort_observation"
    assert len(correlations["dimension_ids"]) == 12
    assert len(correlations["pairs"]) == 66
    assert "vec_veiling_glare" not in correlations["dimension_ids"]
    assert "vec_atmospheric_haze_response" not in correlations["dimension_ids"]

    edge_microcontrast = next(
        value
        for left, right, value in correlations["pairs"]
        if {left, right} == {"vec_edge_softness", "vec_microcontrast"}
    )
    assert edge_microcontrast == pytest.approx(-0.9592, abs=0.00005)


def test_contract_rejects_a_mislabeled_fixed_hero(library: Library):
    broken = copy.deepcopy(library)
    broken.observations["obs_0078"].intended_level = "high"
    with pytest.raises(ValueError, match="hero observations must be ordered"):
        build_chamber_payload(broken)
