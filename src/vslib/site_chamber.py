"""Build the evidence contract for the Atlas Observation Chamber.

The Chamber is a presentation of canonical observations, not a derived latent
space.  This module deliberately emits no display coordinates.  A client may
project the included observed scores, but it must not interpret a missing score
as zero.
"""

from __future__ import annotations

from collections import defaultdict
from typing import Any

from vslib.models import Observation, Study
from vslib.site_explorer import (
    CONTROLLED_STUDY_IDS,
    CORRELATION_STUDY_IDS,
    HERO_ANCHOR_ID,
    HERO_OBSERVATION_IDS,
    HERO_STUDY_ID,
    HERO_VECTOR_ID,
    LEVEL_ORDER,
    MODEL_LABEL,
    RECONSTRUCTION_AESTHETIC_ID,
    RECONSTRUCTION_PLATE_ANCHORS,
    RECONSTRUCTION_STUDY_ID,
    SCORE_METHOD,
    fully_supported_correlations,
    paired_response_deltas,
    score_support,
)
from vslib.store import Library


CHAMBER_SCHEMA = "visual-basis-atlas/chamber-v1"

# These are the only anchors approved for the Chamber field.  In particular,
# the lamp-character and lamp-portrait sets are not admitted merely because
# they belong to the same studies as the lamp-architecture observations.
FIELD_ANCHOR_IDS = (
    "anchor_architecture",
    "anchor_object",
    "anchor_landscape",
    "anchor_lamp_architecture",
)
TRIPLET_ANCHOR_IDS = ("anchor_architecture", "anchor_lamp_architecture")

COMPARISON_OBSERVATION_IDS = ("obs_0159", "obs_0174")
COMPARISON_VECTOR_IDS = ("vec_halation", "vec_highlight_bloom")


def build_chamber_payload(lib: Library) -> dict[str, Any]:
    """Return the compact, JSON-serializable Observation Chamber contract.

    Observation scores are emitted as ``[vector_id, value, confidence]``
    tuples.  Only scores actually recorded with :data:`SCORE_METHOD` are
    emitted; no rectangular matrix or zero filling is performed.
    """

    _require_records(lib)

    observations = [
        observation
        for observation in lib.observations.values()
        if observation.anchor_id in FIELD_ANCHOR_IDS
    ]
    observations.sort(key=lambda observation: observation.id)

    hero = _hero_payload(lib)
    studies = [_study_payload(lib, lib.studies[study_id]) for study_id in CONTROLLED_STUDY_IDS]
    comparison = _comparison_payload(lib)
    reconstruction = _reconstruction_payload(lib)
    responses = _response_payload(lib)
    correlations = _correlation_payload(lib)

    referenced_vector_ids = _referenced_vector_ids(
        observations,
        studies,
        reconstruction,
        responses,
        correlations,
    )
    dates = [observation.date for observation in lib.observations.values() if observation.date]

    return {
        "schema": CHAMBER_SCHEMA,
        "model_label": MODEL_LABEL,
        "observed_at": max(dates, default=""),
        "score_method": SCORE_METHOD,
        "semantics": {
            "coordinates": "not_provided",
            "projection_basis": "observed_scores_only",
            "missing_scores": "omitted",
            "status_source": "study.status",
        },
        "vectors": {
            vector_id: {
                "name": lib.vectors[vector_id].canonical_name,
                "status": lib.vectors[vector_id].status,
                "confidence": lib.vectors[vector_id].confidence,
            }
            for vector_id in sorted(referenced_vector_ids)
        },
        "anchors": {
            anchor_id: {
                "name": lib.anchors[anchor_id].name,
                "kind": lib.anchors[anchor_id].kind,
            }
            for anchor_id in FIELD_ANCHOR_IDS
        },
        "hero": hero,
        "studies": studies,
        "comparison": comparison,
        "reconstruction": reconstruction,
        "field": {
            "anchor_ids": list(FIELD_ANCHOR_IDS),
            "observation_count": len(observations),
            "score_tuple": ["vector_id", "value", "confidence"],
            "observations": [
                _observation_payload(lib, observation)
                for observation in observations
            ],
        },
        "analysis": {
            "responses": responses,
            "correlations": correlations,
        },
    }


def _hero_payload(lib: Library) -> dict[str, Any]:
    study = lib.studies[HERO_STUDY_ID]
    observations = [lib.observations[observation_id] for observation_id in HERO_OBSERVATION_IDS]
    actual_levels = tuple(observation.intended_level for observation in observations)

    if study.candidate_vector_id != HERO_VECTOR_ID:
        raise ValueError(f"hero study must target {HERO_VECTOR_ID}")
    if actual_levels != LEVEL_ORDER:
        raise ValueError(f"hero observations must be ordered {LEVEL_ORDER}, got {actual_levels}")
    if any(observation.study_id != HERO_STUDY_ID for observation in observations):
        raise ValueError(f"hero observations must belong to {HERO_STUDY_ID}")
    if any(observation.anchor_id != HERO_ANCHOR_ID for observation in observations):
        raise ValueError(f"hero observations must use {HERO_ANCHOR_ID}")
    if any(observation.intended_vector_id != HERO_VECTOR_ID for observation in observations):
        raise ValueError(f"hero observations must request {HERO_VECTOR_ID}")

    return {
        "study_id": HERO_STUDY_ID,
        "vector_id": HERO_VECTOR_ID,
        "anchor_id": HERO_ANCHOR_ID,
        "levels": [
            {"requested_level": level, "observation_id": observation_id}
            for level, observation_id in zip(LEVEL_ORDER, HERO_OBSERVATION_IDS)
        ],
    }


def _study_payload(lib: Library, study: Study) -> dict[str, Any]:
    anchor_id, observations = _architecture_triplet(lib, study)
    return {
        "study_id": study.id,
        "title": study.title,
        "vector_id": study.candidate_vector_id,
        "status": study.status,
        "decision": study.decision,
        "anchor_id": anchor_id,
        "levels": [
            {
                "requested_level": level,
                "observation_id": observations[level].id,
            }
            for level in LEVEL_ORDER
        ],
    }


def _architecture_triplet(
    lib: Library,
    study: Study,
) -> tuple[str, dict[str, Observation]]:
    candidate_anchors = [
        anchor_id
        for anchor_id in TRIPLET_ANCHOR_IDS
        if anchor_id in study.anchor_ids
    ]
    if len(candidate_anchors) != 1:
        raise ValueError(
            f"{study.id} must contain exactly one architecture triplet anchor; "
            f"found {candidate_anchors}"
        )
    anchor_id = candidate_anchors[0]

    by_level: dict[str, list[Observation]] = defaultdict(list)
    for observation_id in study.observation_ids:
        observation = lib.observations[observation_id]
        if observation.anchor_id == anchor_id:
            by_level[str(observation.intended_level)].append(observation)

    missing_or_duplicate = {
        level: len(by_level.get(level, []))
        for level in LEVEL_ORDER
        if len(by_level.get(level, [])) != 1
    }
    unexpected = sorted(set(by_level) - set(LEVEL_ORDER))
    if missing_or_duplicate or unexpected:
        raise ValueError(
            f"{study.id} must have one {anchor_id} observation at every requested level; "
            f"counts={missing_or_duplicate}, unexpected={unexpected}"
        )

    observations = {level: by_level[level][0] for level in LEVEL_ORDER}
    for level, observation in observations.items():
        if observation.study_id != study.id:
            raise ValueError(f"{observation.id} does not belong to {study.id}")
        if observation.intended_vector_id != study.candidate_vector_id:
            raise ValueError(
                f"{observation.id} must request {study.candidate_vector_id}, "
                f"got {observation.intended_vector_id}"
            )
        if observation.intended_level != level:
            raise ValueError(f"{observation.id} must request {level}")
    return anchor_id, observations


def _comparison_payload(lib: Library) -> dict[str, Any]:
    observations = [
        lib.observations[observation_id]
        for observation_id in COMPARISON_OBSERVATION_IDS
    ]
    for observation, vector_id in zip(observations, COMPARISON_VECTOR_IDS):
        if observation.anchor_id != HERO_ANCHOR_ID:
            raise ValueError(f"comparison observations must use {HERO_ANCHOR_ID}")
        if observation.intended_level != "high":
            raise ValueError("comparison observations must both request high")
        if observation.intended_vector_id != vector_id:
            raise ValueError(f"{observation.id} must request {vector_id}")

    return {
        "anchor_id": HERO_ANCHOR_ID,
        "requested_level": "high",
        "items": [
            {"vector_id": vector_id, "observation_id": observation_id}
            for vector_id, observation_id in zip(
                COMPARISON_VECTOR_IDS,
                COMPARISON_OBSERVATION_IDS,
            )
        ],
    }


def _observation_payload(lib: Library, observation: Observation) -> dict[str, Any]:
    study = lib.studies[observation.study_id]
    scores = sorted(
        (score for score in observation.scores if score.method == SCORE_METHOD),
        key=lambda score: score.vector_id,
    )
    return {
        "id": observation.id,
        "status": study.status,
        "decision": study.decision,
        "study_id": observation.study_id,
        "vector_id": observation.intended_vector_id,
        "requested_level": observation.intended_level,
        "anchor_id": observation.anchor_id,
        "image_path": observation.image_path,
        "scores": [
            [score.vector_id, score.score, score.confidence]
            for score in scores
        ],
    }


def _reconstruction_payload(lib: Library) -> dict[str, Any]:
    study = lib.studies[RECONSTRUCTION_STUDY_ID]
    aesthetic = lib.aesthetics[RECONSTRUCTION_AESTHETIC_ID]
    evaluations = [
        evaluation
        for evaluation in lib.reconstructions.values()
        if evaluation.target_aesthetic_id == aesthetic.id
    ]
    evaluation_by_observation = {
        evaluation.observation_id: evaluation
        for evaluation in evaluations
    }
    observation_by_anchor = {
        lib.observations[observation_id].anchor_id: lib.observations[observation_id]
        for observation_id in study.observation_ids
    }

    selected_plates = []
    for anchor_id in RECONSTRUCTION_PLATE_ANCHORS:
        observation = observation_by_anchor.get(anchor_id)
        if observation is None or observation.id not in evaluation_by_observation:
            raise KeyError(f"chamber reconstruction is missing {anchor_id}")
        evaluation = evaluation_by_observation[observation.id]
        selected_plates.append(
            {
                "anchor_id": anchor_id,
                "observation_id": observation.id,
                "score": evaluation.reconstruction_score,
            }
        )

    return {
        "study_id": study.id,
        "target_aesthetic_id": aesthetic.id,
        "interpretation": "manual_first_order_hypothesis",
        "weight_method": "manual_not_fitted",
        "n_evaluations": len(evaluations),
        "human_rated": bool(evaluations) and all(
            evaluation.human_rating is not None
            for evaluation in evaluations
        ),
        "n_human_ratings": sum(
            evaluation.human_rating is not None
            for evaluation in evaluations
        ),
        "weights": [
            {
                "vector_id": weight.vector_id,
                "weight": weight.weight,
                "source": weight.source,
                "confidence": weight.confidence,
                "hypothesized": weight.hypothesized,
            }
            for weight in aesthetic.weights
        ],
        "selected_plates": selected_plates,
    }


def _response_payload(lib: Library) -> dict[str, Any]:
    studies = []
    for study_id in CONTROLLED_STUDY_IDS:
        study = lib.studies[study_id]
        by_anchor: dict[str, set[str]] = defaultdict(set)
        for observation_id in study.observation_ids:
            observation = lib.observations[observation_id]
            if observation.anchor_id and observation.intended_level:
                by_anchor[observation.anchor_id].add(observation.intended_level)
        paired_anchor_ids = sorted(
            anchor_id
            for anchor_id, levels in by_anchor.items()
            if {"low", "high"}.issubset(levels)
        )
        components = paired_response_deltas(lib, study, method=SCORE_METHOD)
        studies.append(
            {
                "study_id": study_id,
                "vector_id": study.candidate_vector_id,
                "paired_anchor_ids": paired_anchor_ids,
                "components": [
                    [component["vector_id"], component["value"], component["n_pairs"]]
                    for component in components
                ],
            }
        )

    return {
        "method": "paired_high_minus_low_mean",
        "pairing": "within_anchor",
        "endpoint_levels": ["low", "high"],
        "missing_scores": "pair_omitted_for_component",
        "component_tuple": ["vector_id", "mean_delta", "n_pairs"],
        "studies": studies,
    }


def _correlation_payload(lib: Library) -> dict[str, Any]:
    observation_count = sum(
        observation.study_id in CORRELATION_STUDY_IDS
        for observation in lib.observations.values()
    )
    support = score_support(lib, method=SCORE_METHOD, study_ids=CORRELATION_STUDY_IDS)
    dimension_ids = sorted(
        vector_id
        for vector_id, count in support.items()
        if count == observation_count
    )
    pairs = fully_supported_correlations(
        lib,
        method=SCORE_METHOD,
        study_ids=CORRELATION_STUDY_IDS,
    )
    return {
        "method": "pearson_unweighted",
        "study_ids": list(CORRELATION_STUDY_IDS),
        "observation_count": observation_count,
        "support_rule": "score_present_in_every_cohort_observation",
        "dimension_ids": dimension_ids,
        "pair_tuple": ["vector_a", "vector_b", "pearson_r"],
        "pairs": [[pair["a"], pair["b"], pair["r"]] for pair in pairs],
    }


def _referenced_vector_ids(
    observations: list[Observation],
    studies: list[dict[str, Any]],
    reconstruction: dict[str, Any],
    responses: dict[str, Any],
    correlations: dict[str, Any],
) -> set[str]:
    vector_ids = {
        vector_id
        for observation in observations
        for vector_id in [
            observation.intended_vector_id,
            *(score.vector_id for score in observation.scores if score.method == SCORE_METHOD),
        ]
        if vector_id is not None
    }
    vector_ids.update(study["vector_id"] for study in studies)
    vector_ids.update(weight["vector_id"] for weight in reconstruction["weights"])
    vector_ids.update(correlations["dimension_ids"])
    for response in responses["studies"]:
        vector_ids.add(response["vector_id"])
        vector_ids.update(component[0] for component in response["components"])
    return vector_ids


def _require_records(lib: Library) -> None:
    required_study_ids = {
        *CONTROLLED_STUDY_IDS,
        *CORRELATION_STUDY_IDS,
        RECONSTRUCTION_STUDY_ID,
    }
    missing_studies = sorted(required_study_ids - lib.studies.keys())
    required_observation_ids = {*HERO_OBSERVATION_IDS, *COMPARISON_OBSERVATION_IDS}
    missing_observations = sorted(required_observation_ids - lib.observations.keys())
    missing_anchors = sorted(set(FIELD_ANCHOR_IDS) - lib.anchors.keys())
    missing_aesthetics = (
        []
        if RECONSTRUCTION_AESTHETIC_ID in lib.aesthetics
        else [RECONSTRUCTION_AESTHETIC_ID]
    )
    if missing_studies or missing_observations or missing_anchors or missing_aesthetics:
        missing = [
            *(f"study:{item}" for item in missing_studies),
            *(f"observation:{item}" for item in missing_observations),
            *(f"anchor:{item}" for item in missing_anchors),
            *(f"aesthetic:{item}" for item in missing_aesthetics),
        ]
        raise KeyError("chamber contract is missing " + ", ".join(missing))
