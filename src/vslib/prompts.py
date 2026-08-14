"""Translate weight vectors into Imagine prompt language."""

from __future__ import annotations

from vslib.store import Library

DOMINANT = 0.70
SUPPORT = 0.40


def phrases_for_weight(lib: Library, vector_id: str, weight: float) -> str | None:
    vec = lib.vectors.get(vector_id)
    if not vec:
        return None
    if abs(weight) < SUPPORT:
        return None
    if weight >= DOMINANT:
        return vec.prompt_phrases.get("high") or f"strong {vec.canonical_name}"
    if weight <= -DOMINANT:
        return vec.prompt_phrases.get("low") or vec.low_pole
    if weight >= SUPPORT:
        return vec.prompt_phrases.get("medium") or f"moderate {vec.canonical_name}"
    if weight <= -SUPPORT:
        return vec.prompt_phrases.get("low") or vec.low_pole
    return None


def reconstruction_prompt(lib: Library, aesthetic_id: str, subject_lock: str) -> dict:
    aes = lib.aesthetics[aesthetic_id]
    dominant = []
    supporting = []
    omitted = []
    hypothesized = []
    for item in sorted(aes.weights, key=lambda w: abs(w.weight), reverse=True):
        phrase = phrases_for_weight(lib, item.vector_id, item.weight)
        rec = {
            "vector_id": item.vector_id,
            "weight": item.weight,
            "phrase": phrase,
            "hypothesized": item.hypothesized,
        }
        if item.hypothesized:
            hypothesized.append(rec)
        if phrase is None:
            omitted.append(rec)
            continue
        if abs(item.weight) >= DOMINANT:
            dominant.append(rec)
        else:
            supporting.append(rec)

    layers = []
    for rec in dominant:
        layers.append(rec["phrase"])
    for rec in supporting:
        layers.append(rec["phrase"])

    prompt = (
        f"{subject_lock} "
        "Preserve subject, pose, framing, and scene content. "
        "Do not describe a movie, decade, or named genre. "
        + " ".join(f"Apply this image-formation change: {layer}." for layer in layers)
    )
    return {
        "aesthetic_id": aesthetic_id,
        "prompt": prompt.strip(),
        "dominant": dominant,
        "supporting": supporting,
        "omitted": omitted,
        "hypothesized": hypothesized,
        "rule": {
            "dominant_threshold": DOMINANT,
            "support_threshold": SUPPORT,
            "omit_below": SUPPORT,
        },
    }


def level_edit_prompt(lib: Library, vector_id: str, level: str, lock_reminder: str = "") -> str:
    from vslib.catalog import extra_hold_for, edit_prompt

    vec = lib.vectors[vector_id]
    phrase = vec.prompt_phrases.get(level) or f"{level} {vec.canonical_name}"
    return edit_prompt(lock_reminder, vec.canonical_name, phrase, extra_hold_for(vector_id))
