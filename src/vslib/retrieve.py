"""Structured retrieval for other agents."""

from __future__ import annotations

from dataclasses import asdict

from vslib.classify import classify
from vslib.matrices import nearest_aesthetics, profile_distance
from vslib.prompts import reconstruction_prompt
from vslib.store import Library


def map_language(lib: Library, phrase: str) -> dict:
    hit = classify(lib, phrase)
    return asdict(hit)


def get_vector(lib: Library, vector_id: str) -> dict:
    vec = lib.vectors[vector_id]
    data = vec.to_dict()
    data["tested_prompt_phrases"] = vec.prompt_phrases
    data["studies"] = [lib.studies[s].to_dict() for s in vec.study_ids if s in lib.studies]
    return data


def aesthetic_profile(lib: Library, aesthetic_id: str) -> dict:
    aes = lib.aesthetics[aesthetic_id]
    data = aes.to_dict()
    data["coordinate"] = aes.coordinate()
    data["nearest"] = [
        {"id": other, "cosine": score, "name": lib.aesthetics[other].canonical_name}
        for other, score in nearest_aesthetics(lib, aesthetic_id)
    ]
    return data


def compare_aesthetics(lib: Library, a_id: str, b_id: str) -> dict:
    a = lib.aesthetics[a_id]
    b = lib.aesthetics[b_id]
    wa, wb = a.coordinate(), b.coordinate()
    keys = sorted(set(wa) | set(wb))
    deltas = []
    for key in keys:
        da = wa.get(key, 0.0)
        db = wb.get(key, 0.0)
        if da == db == 0:
            continue
        deltas.append({
            "vector_id": key,
            "a": da,
            "b": db,
            "delta": db - da,
            "name": lib.vectors[key].canonical_name if key in lib.vectors else key,
        })
    deltas.sort(key=lambda item: abs(item["delta"]), reverse=True)
    return {
        "a": a_id,
        "b": b_id,
        "distance": profile_distance(wa, wb),
        "deltas": deltas,
    }


def reconstruct(lib: Library, aesthetic_id: str, subject_lock: str | None = None) -> dict:
    if subject_lock is None:
        if lib.anchors:
            subject_lock = next(iter(lib.anchors.values())).lock_prompt
        else:
            subject_lock = "Keep the current subject."
    return reconstruction_prompt(lib, aesthetic_id, subject_lock)


def explain_observation(lib: Library, observation_id: str) -> dict:
    obs = lib.observations[observation_id]
    intended = None
    if obs.intended_vector_id:
        intended = {
            "vector_id": obs.intended_vector_id,
            "level": obs.intended_level,
            "score": obs.score_map().get(obs.intended_vector_id),
        }
    leaks = []
    for score in obs.scores:
        if obs.intended_vector_id and score.vector_id == obs.intended_vector_id:
            continue
        if score.score >= 0.45:
            leaks.append(score.to_dict())
    return {
        "observation": obs.to_dict(),
        "intended": intended,
        "unintended_changes": obs.unintended_changes,
        "possible_leaks": leaks,
        "notes": obs.notes,
    }


def next_experiments(lib: Library, limit: int = 8) -> list[dict]:
    suggestions = []
    for study in lib.studies.values():
        for item in study.next_experiments:
            suggestions.append({
                "from_study": study.id,
                "proposal": item,
                "priority": "high" if study.decision in {"entangled", "provisional"} else "normal",
            })
    for vec in lib.vectors.values():
        if vec.status == "candidate" and vec.open_questions:
            suggestions.append({
                "from_study": None,
                "proposal": f"Run a controlled low/mid/high study of {vec.id} across the five anchors.",
                "priority": "seed",
                "vector_id": vec.id,
            })
    telecine_done = (
        "study_telecine_softness_001" in lib.studies
        and lib.studies["study_telecine_softness_001"].status == "complete"
    )
    if (
        "vec_optical_softness" in lib.vectors
        and "vec_telecine_softness" in lib.vectors
        and not telecine_done
    ):
        suggestions.insert(0, {
            "from_study": None,
            "proposal": "Discrimination study: optical softness vs telecine softness on the same anchors.",
            "priority": "high",
            "vector_id": "vec_telecine_softness",
        })
    seen = set()
    unique = []
    for item in suggestions:
        key = item["proposal"]
        if key in seen:
            continue
        seen.add(key)
        unique.append(item)
        if len(unique) >= limit:
            break
    return unique


def agent_bundle(lib: Library, query: str) -> dict:
    mapped = map_language(lib, query)
    bundle: dict = {"query": query, "classification": mapped}
    target = mapped.get("target_id")
    if target in lib.vectors:
        bundle["vector"] = get_vector(lib, target)
        bundle["prompt_phrases"] = lib.vectors[target].prompt_phrases
    if target in lib.aesthetics:
        bundle["aesthetic"] = aesthetic_profile(lib, target)
        bundle["reconstruction"] = reconstruct(lib, target)
    bundle["next_experiments"] = next_experiments(lib, limit=5)
    return bundle
