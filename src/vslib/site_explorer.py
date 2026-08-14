"""Build the evidence payload used by the interactive atlas homepage.

The payload is derived from canonical registry objects at build time.  It does
not read the generated site or treat missing observation scores as zero.
"""

from __future__ import annotations

from collections import Counter, defaultdict
from math import sqrt
from statistics import mean, median
from typing import Any, Iterable

from vslib.models import Observation, Score, Study
from vslib.store import Library


EXPLORER_SCHEMA = "visual-basis-atlas/explorer-v1"
SCORE_METHOD = "agent_visual"
MODEL_LABEL = "Grok Imagine"

CONTROLLED_STUDY_IDS = (
    "study_diffusion_001",
    "study_halation_002",
    "study_highlight_bloom_001",
    "study_optical_softness_001",
    "study_shadow_density_002",
    "study_black_level_001",
    "study_key_to_fill_ratio_001",
    "study_bokeh_softness_001",
    "study_edge_softness_001",
    "study_telecine_softness_001",
    "study_analog_video_texture_001",
)
CORRELATION_STUDY_IDS = (
    "study_diffusion_001",
    "study_halation_001",
    "study_optical_softness_001",
    "study_shadow_density_001",
    "study_bokeh_softness_001",
    "study_edge_softness_001",
    "study_anchor_set_001",
    "study_reconstruction_soft_halated_shadow_001",
)
HERO_STUDY_ID = "study_halation_002"
HERO_VECTOR_ID = "vec_halation"
HERO_ANCHOR_ID = "anchor_lamp_architecture"
HERO_OBSERVATION_IDS = ("obs_0157", "obs_0158", "obs_0159")
LEVEL_ORDER = ("low", "medium", "high")

RECONSTRUCTION_STUDY_ID = "study_reconstruction_soft_halated_shadow_001"
RECONSTRUCTION_AESTHETIC_ID = "aes_soft_halated_shadow"
RECONSTRUCTION_PLATE_ANCHORS = ("anchor_object", "anchor_landscape")


def build_explorer_payload(lib: Library) -> dict[str, Any]:
    """Return the complete JSON-serializable homepage evidence contract."""

    _require_records(lib)
    responses = [_response_payload(lib, lib.studies[study_id]) for study_id in CONTROLLED_STUDY_IDS]
    dates = [observation.date for observation in lib.observations.values() if observation.date]

    return {
        "schema": EXPLORER_SCHEMA,
        "model_label": MODEL_LABEL,
        "score_method": SCORE_METHOD,
        "observed_at": max(dates, default=""),
        "stats": {
            "vectors": len(lib.vectors),
            "observations": len(lib.observations),
            "studies": len(lib.studies),
            "anchors": len(lib.anchors),
            "controlled_vector_studies": len(CONTROLLED_STUDY_IDS),
            "canonical_vectors": sum(vector.status == "canonical" for vector in lib.vectors.values()),
        },
        "hero": _hero_payload(lib),
        "responses": responses,
        "correlations": _correlation_payload(lib),
        "reconstruction": _reconstruction_payload(lib),
    }


def paired_response_deltas(
    lib: Library,
    study: Study,
    *,
    method: str = SCORE_METHOD,
) -> list[dict[str, Any]]:
    """Calculate mean high-minus-low deltas paired within each anchor.

    A component contributes only when the same scoring method supplies that
    component at both endpoints.  Missing values therefore never become zero.
    """

    by_anchor = _observations_by_anchor_and_level(lib, study)
    component_deltas: dict[str, list[tuple[str, float]]] = defaultdict(list)

    for anchor_id in sorted(by_anchor):
        levels = by_anchor[anchor_id]
        if "low" not in levels or "high" not in levels:
            continue
        low = _scores_by_method(levels["low"], method)
        high = _scores_by_method(levels["high"], method)
        for vector_id in sorted(low.keys() & high.keys()):
            component_deltas[vector_id].append((anchor_id, high[vector_id].score - low[vector_id].score))

    rows = []
    for vector_id, samples in component_deltas.items():
        rows.append(
            {
                "vector_id": vector_id,
                "name": _vector_name(lib, vector_id),
                "value": mean(value for _, value in samples),
                "n_pairs": len(samples),
                "anchor_ids": [anchor_id for anchor_id, _ in samples],
                "method": "paired_high_minus_low_mean",
            }
        )
    return sorted(rows, key=lambda row: (-abs(row["value"]), row["vector_id"]))


def score_support(
    lib: Library,
    *,
    method: str = SCORE_METHOD,
    study_ids: Iterable[str] | None = None,
) -> dict[str, int]:
    """Count observations containing a score for each vector and method."""

    support: Counter[str] = Counter()
    for observation in lib.observations.values():
        if study_ids is not None and observation.study_id not in study_ids:
            continue
        support.update(_scores_by_method(observation, method).keys())
    return dict(sorted(support.items()))


def fully_supported_correlations(
    lib: Library,
    *,
    method: str = SCORE_METHOD,
    study_ids: Iterable[str] | None = CORRELATION_STUDY_IDS,
) -> list[dict[str, Any]]:
    """Return pairwise Pearson correlations for complete score columns only."""

    observation_ids = sorted(
        observation_id
        for observation_id, observation in lib.observations.items()
        if study_ids is None or observation.study_id in study_ids
    )
    n_observations = len(observation_ids)
    support = score_support(lib, method=method, study_ids=study_ids)
    dimensions = sorted(vector_id for vector_id, n in support.items() if n == n_observations)
    columns = {
        vector_id: [
            _scores_by_method(lib.observations[observation_id], method)[vector_id].score
            for observation_id in observation_ids
        ]
        for vector_id in dimensions
    }

    rows = []
    for index, vector_a in enumerate(dimensions):
        for vector_b in dimensions[index + 1 :]:
            value = _pearson(columns[vector_a], columns[vector_b])
            if value is None:
                continue
            rows.append(
                {
                    "a": vector_a,
                    "a_name": _vector_name(lib, vector_a),
                    "b": vector_b,
                    "b_name": _vector_name(lib, vector_b),
                    "r": value,
                    "n": n_observations,
                    "method": "pearson_unweighted",
                }
            )
    return sorted(rows, key=lambda row: (-abs(row["r"]), row["a"], row["b"]))


def _hero_payload(lib: Library) -> dict[str, Any]:
    study = lib.studies[HERO_STUDY_ID]
    levels = [_observation_payload(lib, lib.observations[observation_id]) for observation_id in HERO_OBSERVATION_IDS]

    actual_levels = tuple(level["requested_level"] for level in levels)
    if actual_levels != LEVEL_ORDER:
        raise ValueError(f"hero observations must be ordered {LEVEL_ORDER}, got {actual_levels}")
    if any(level["anchor_id"] != HERO_ANCHOR_ID for level in levels):
        raise ValueError(f"hero observations must use {HERO_ANCHOR_ID}")
    if study.candidate_vector_id != HERO_VECTOR_ID:
        raise ValueError(f"hero study must target {HERO_VECTOR_ID}")

    return {
        "study_id": study.id,
        "vector_id": HERO_VECTOR_ID,
        "name": _vector_name(lib, HERO_VECTOR_ID),
        "anchor_id": HERO_ANCHOR_ID,
        "levels": levels,
    }


def _response_payload(lib: Library, study: Study) -> dict[str, Any]:
    vector = lib.vectors[study.candidate_vector_id]
    by_anchor = _observations_by_anchor_and_level(lib, study)
    architecture = by_anchor.get(HERO_ANCHOR_ID) or by_anchor.get("anchor_architecture", {})
    architecture_levels = [
        _observation_payload(lib, architecture[level])
        for level in LEVEL_ORDER
        if level in architecture
    ]
    paired_anchors = [
        anchor_id
        for anchor_id, levels in by_anchor.items()
        if "low" in levels and "high" in levels
    ]
    return {
        "study_id": study.id,
        "vector_id": vector.id,
        "name": vector.canonical_name,
        "status": study.status,
        "decision": study.decision,
        "confidence": vector.confidence,
        "n_pairs": len(paired_anchors),
        "paired_anchor_ids": sorted(paired_anchors),
        "architecture_levels": architecture_levels,
        "mean_response_delta": paired_response_deltas(lib, study),
    }


def _correlation_payload(lib: Library) -> list[dict[str, Any]]:
    return fully_supported_correlations(lib)


def _reconstruction_payload(lib: Library) -> dict[str, Any]:
    study = lib.studies[RECONSTRUCTION_STUDY_ID]
    aesthetic = lib.aesthetics[RECONSTRUCTION_AESTHETIC_ID]
    evaluations = sorted(
        (
            evaluation
            for evaluation in lib.reconstructions.values()
            if evaluation.target_aesthetic_id == aesthetic.id
        ),
        key=lambda evaluation: evaluation.observation_id,
    )
    scores = [evaluation.reconstruction_score for evaluation in evaluations]
    residual_counts = Counter(
        vector_id
        for evaluation in evaluations
        for vector_id in evaluation.residual_vectors
    )
    evaluation_by_observation = {evaluation.observation_id: evaluation for evaluation in evaluations}
    observations_by_anchor = {
        observation.anchor_id: observation
        for observation in (lib.observations[observation_id] for observation_id in study.observation_ids)
        if observation.anchor_id
    }

    plates = []
    for anchor_id in RECONSTRUCTION_PLATE_ANCHORS:
        observation = observations_by_anchor[anchor_id]
        evaluation = evaluation_by_observation[observation.id]
        plates.append(
            {
                "anchor_id": anchor_id,
                "anchor_name": lib.anchors[anchor_id].name,
                "observation_id": observation.id,
                "image_path": observation.image_path,
                "score": evaluation.reconstruction_score,
                "residual_vectors": evaluation.residual_vectors,
                "unintended_changes": observation.unintended_changes,
                "notes": evaluation.notes,
            }
        )

    human_ratings = [evaluation.human_rating for evaluation in evaluations if evaluation.human_rating is not None]
    return {
        "study_id": study.id,
        "target_aesthetic_id": aesthetic.id,
        "name": aesthetic.canonical_name,
        "interpretation": "manual_first_order_hypothesis",
        "weights": [
            {
                "vector_id": weight.vector_id,
                "name": _vector_name(lib, weight.vector_id),
                "weight": weight.weight,
                "source": weight.source,
                "confidence": weight.confidence,
                "hypothesized": weight.hypothesized,
            }
            for weight in aesthetic.weights
        ],
        "aggregate": {
            "n": len(scores),
            "mean": mean(scores),
            "median": median(scores),
            "range": [min(scores), max(scores)],
            "human_rated": len(human_ratings) == len(evaluations) and bool(evaluations),
            "n_human_ratings": len(human_ratings),
        },
        "selected_plates": plates,
        "residual_counts": [
            {
                "vector_id": vector_id,
                "name": _vector_name(lib, vector_id),
                "count": count,
                "n": len(evaluations),
            }
            for vector_id, count in sorted(
                residual_counts.items(),
                key=lambda item: (-item[1], item[0]),
            )
        ],
    }


def _observation_payload(lib: Library, observation: Observation) -> dict[str, Any]:
    scores = [score for score in observation.scores if score.method == SCORE_METHOD]
    return {
        "observation_id": observation.id,
        "requested_level": observation.intended_level,
        "anchor_id": observation.anchor_id,
        "image_path": observation.image_path,
        "date": observation.date,
        "scores": [
            {
                "vector_id": score.vector_id,
                "name": _vector_name(lib, score.vector_id),
                "value": score.score,
                "confidence": score.confidence,
                "method": score.method,
            }
            for score in sorted(scores, key=lambda item: item.vector_id)
        ],
        "unintended_changes": observation.unintended_changes,
        "notes": observation.notes,
    }


def _observations_by_anchor_and_level(
    lib: Library,
    study: Study,
) -> dict[str, dict[str, Observation]]:
    result: dict[str, dict[str, Observation]] = defaultdict(dict)
    for observation_id in study.observation_ids:
        observation = lib.observations[observation_id]
        if observation.anchor_id and observation.intended_level:
            result[observation.anchor_id][observation.intended_level] = observation
    return dict(result)


def _scores_by_method(observation: Observation, method: str) -> dict[str, Score]:
    return {score.vector_id: score for score in observation.scores if score.method == method}


def _pearson(a: Iterable[float], b: Iterable[float]) -> float | None:
    values_a = list(a)
    values_b = list(b)
    if len(values_a) != len(values_b) or len(values_a) < 2:
        return None
    mean_a = mean(values_a)
    mean_b = mean(values_b)
    centered_a = [value - mean_a for value in values_a]
    centered_b = [value - mean_b for value in values_b]
    denominator = sqrt(
        sum(value * value for value in centered_a)
        * sum(value * value for value in centered_b)
    )
    if denominator == 0:
        return None
    return sum(left * right for left, right in zip(centered_a, centered_b)) / denominator


def _vector_name(lib: Library, vector_id: str) -> str:
    vector = lib.vectors.get(vector_id)
    return vector.canonical_name if vector else vector_id


def _require_records(lib: Library) -> None:
    required_studies = {
        *CONTROLLED_STUDY_IDS,
        *CORRELATION_STUDY_IDS,
        RECONSTRUCTION_STUDY_ID,
    }
    missing_studies = sorted(required_studies - lib.studies.keys())
    missing_observations = sorted(set(HERO_OBSERVATION_IDS) - lib.observations.keys())
    if missing_studies or missing_observations:
        missing = [*(f"study:{item}" for item in missing_studies), *(f"observation:{item}" for item in missing_observations)]
        raise KeyError("explorer contract is missing " + ", ".join(missing))
    if RECONSTRUCTION_AESTHETIC_ID not in lib.aesthetics:
        raise KeyError(f"explorer contract is missing aesthetic:{RECONSTRUCTION_AESTHETIC_ID}")
    if not lib.reconstructions:
        raise KeyError("explorer contract requires reconstruction evaluations")
