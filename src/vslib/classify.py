"""Map raw language to ontology entities."""

from __future__ import annotations

import re
from dataclasses import dataclass

from vslib.ids import slugify
from vslib.store import Library

VAGUE = {
    "cinematic", "vintage", "analog", "retro", "moody", "filmic", "aesthetic",
    "vibe", "look", "old look", "dreamy", "gritty", "epic", "premium",
    "hollywood", "nostalgic", "old fashioned", "old-fashioned",
}


@dataclass
class Classification:
    query: str
    kind: str
    target_id: str | None
    mapping_type: str
    confidence: float
    notes: str
    alternatives: list[dict]


def _norm(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[“”\"']", "", text)
    text = re.sub(r"[\-–—]+", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text


def classify(lib: Library, phrase: str) -> Classification:
    raw = phrase.strip()
    key = _norm(raw)

    for alias in lib.aliases.values():
        if _norm(alias.raw_phrase) == key:
            kind = _kind_for_target(lib, alias.target_id, alias.mapping_type)
            return Classification(
                query=raw,
                kind=kind,
                target_id=alias.target_id,
                mapping_type=alias.mapping_type,
                confidence=alias.confidence,
                notes=alias.notes or f"Mapped via alias {alias.id}.",
                alternatives=_nearby_aliases(lib, key, skip=alias.id),
            )

    for vector in lib.vectors.values():
        names = [vector.canonical_name, *vector.aliases, vector.id.removeprefix("vec_").replace("_", " ")]
        if any(_norm(name) == key for name in names):
            return Classification(
                query=raw,
                kind="atomic_vector" if vector.status in {"canonical", "provisional", "candidate"} else vector.status,
                target_id=vector.id,
                mapping_type="exact",
                confidence=max(0.7, vector.confidence),
                notes=vector.definition,
                alternatives=[],
            )

    for aes in lib.aesthetics.values():
        names = [aes.canonical_name, *aes.aliases, aes.id.removeprefix("aes_").replace("_", " ")]
        if any(_norm(name) == key for name in names):
            return Classification(
                query=raw,
                kind="composite_aesthetic" if aes.status == "composite" else aes.status,
                target_id=aes.id,
                mapping_type="exact",
                confidence=max(0.6, aes.confidence),
                notes=aes.definition,
                alternatives=[],
            )

    for family in lib.families.values():
        if _norm(family.name) == key:
            return Classification(
                query=raw,
                kind="family_label",
                target_id=family.id,
                mapping_type="family",
                confidence=0.9,
                notes="Organizational family, not an atomic vector.",
                alternatives=[],
            )

    if key in VAGUE:
        return Classification(
            query=raw,
            kind="vague",
            target_id=None,
            mapping_type="vague",
            confidence=0.9,
            notes="Rejected as atomic. Decompose into tested visual properties.",
            alternatives=_fuzzy(lib, key)[:5],
        )

    fuzzy = _fuzzy(lib, key)
    if fuzzy:
        top = fuzzy[0]
        return Classification(
            query=raw,
            kind="unresolved",
            target_id=top.get("id"),
            mapping_type="fuzzy",
            confidence=top.get("score", 0.0),
            notes="No exact match. Nearest catalog entries listed.",
            alternatives=fuzzy[:6],
        )

    return Classification(
        query=raw,
        kind="invalid",
        target_id=None,
        mapping_type="invalid",
        confidence=0.2,
        notes="No catalog match.",
        alternatives=[],
    )


def _kind_for_target(lib: Library, target_id: str, mapping_type: str) -> str:
    if mapping_type in {"vague", "invalid"}:
        return mapping_type
    if mapping_type == "composite":
        return "composite_aesthetic"
    if mapping_type == "system":
        return "system_label"
    if mapping_type == "family":
        return "family_label"
    if mapping_type in {"parent", "child"}:
        return mapping_type
    if target_id in lib.vectors:
        vec = lib.vectors[target_id]
        if vec.status == "system":
            return "system_label"
        return "alias" if mapping_type in {"alias", "near_alias"} else "atomic_vector"
    if target_id in lib.aesthetics:
        return "composite_aesthetic" if lib.aesthetics[target_id].status == "composite" else lib.aesthetics[target_id].status
    if target_id in lib.families:
        return "family_label"
    return mapping_type


def _nearby_aliases(lib: Library, key: str, skip: str) -> list[dict]:
    hits = []
    for alias in lib.aliases.values():
        if alias.id == skip:
            continue
        if key in _norm(alias.raw_phrase) or _norm(alias.raw_phrase) in key:
            hits.append({
                "id": alias.target_id,
                "phrase": alias.raw_phrase,
                "mapping_type": alias.mapping_type,
                "score": alias.confidence,
            })
    return hits[:5]


def _tokens(text: str) -> set[str]:
    return {t for t in re.split(r"[^a-z0-9]+", _norm(text)) if t and t not in {"the", "a", "of", "and", "or"}}


def _fuzzy(lib: Library, key: str) -> list[dict]:
    q = _tokens(key)
    if not q:
        return []
    scored: list[dict] = []
    for vector in lib.vectors.values():
        names = [vector.canonical_name, *vector.aliases, vector.id]
        scored.append(_score_entry(q, vector.id, vector.canonical_name, names, "vector"))
    for aes in lib.aesthetics.values():
        names = [aes.canonical_name, *aes.aliases, aes.id]
        scored.append(_score_entry(q, aes.id, aes.canonical_name, names, "aesthetic"))
    for alias in lib.aliases.values():
        scored.append(_score_entry(q, alias.target_id, alias.raw_phrase, [alias.raw_phrase], alias.mapping_type))
    scored.sort(key=lambda item: item["score"], reverse=True)
    return [item for item in scored if item["score"] > 0][:8]


def _score_entry(q: set[str], entity_id: str, name: str, names: list[str], kind: str) -> dict:
    bag: set[str] = set()
    for item in names:
        bag |= _tokens(item)
    if not bag:
        score = 0.0
    else:
        overlap = len(q & bag) / len(q | bag)
        contain = 1.0 if any(_norm(key) in _norm(name) or _norm(name) in _norm(key) for key in q for name in names) else 0.0
        score = 0.75 * overlap + 0.25 * contain
    return {"id": entity_id, "name": name, "kind": kind, "score": round(score, 3)}
