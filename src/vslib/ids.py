"""Stable identifiers for library entities."""

from __future__ import annotations

import re
from pathlib import Path

PREFIXES = {
    "vec": "vector",
    "aes": "aesthetic",
    "obs": "observation",
    "study": "study",
    "alias": "alias",
    "int": "interaction",
    "fam": "family",
    "anchor": "anchor",
    "job": "generation_job",
}

SLUG_RE = re.compile(r"^[a-z][a-z0-9_]*$")
OBS_RE = re.compile(r"^obs_\d{4,}$")
STUDY_RE = re.compile(r"^study_[a-z][a-z0-9_]*_\d{3}$")
INT_RE = re.compile(r"^int_[a-z][a-z0-9_]*__[a-z][a-z0-9_]*$")
GENERIC_RE = re.compile(r"^(vec|aes|alias|fam|anchor|job)_[a-z0-9][a-z0-9_]*$")


def validate_id(entity_id: str) -> str:
    if not entity_id or not isinstance(entity_id, str):
        raise ValueError("id must be a non-empty string")
    if entity_id.startswith("obs_"):
        if not OBS_RE.match(entity_id):
            raise ValueError(f"invalid observation id: {entity_id}")
        return "observation"
    if entity_id.startswith("study_"):
        if not STUDY_RE.match(entity_id):
            raise ValueError(f"invalid study id: {entity_id}")
        return "study"
    if entity_id.startswith("int_"):
        if not INT_RE.match(entity_id):
            raise ValueError(f"invalid interaction id: {entity_id}")
        return "interaction"
    match = GENERIC_RE.match(entity_id)
    if not match:
        raise ValueError(f"invalid id: {entity_id}")
    return PREFIXES[match.group(1)]


def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    text = re.sub(r"_+", "_", text).strip("_")
    if text and text[0].isdigit():
        text = f"n_{text}"
    if not text or not SLUG_RE.match(text):
        raise ValueError(f"cannot slugify: {text!r}")
    return text


def mint_id(kind: str, name: str) -> str:
    if kind not in PREFIXES:
        raise ValueError(f"unknown kind: {kind}")
    if kind == "obs":
        raise ValueError("use next_observation_id() for observations")
    if kind == "int":
        raise ValueError("use interaction_id() for interactions")
    return f"{kind}_{slugify(name)}"


def interaction_id(vector_i: str, vector_j: str) -> str:
    a = vector_i.removeprefix("vec_")
    b = vector_j.removeprefix("vec_")
    left, right = sorted((a, b))
    return f"int_{left}__{right}"


def next_observation_id(existing: list[str]) -> str:
    numbers = []
    for item in existing:
        if OBS_RE.match(item):
            numbers.append(int(item.split("_", 1)[1]))
    nxt = (max(numbers) + 1) if numbers else 1
    return f"obs_{nxt:04d}"


def next_study_id(slug: str, existing: list[str]) -> str:
    slug = slugify(slug)
    prefix = f"study_{slug}_"
    numbers = []
    for item in existing:
        if item.startswith(prefix) and STUDY_RE.match(item):
            numbers.append(int(item.rsplit("_", 1)[1]))
    nxt = (max(numbers) + 1) if numbers else 1
    return f"{prefix}{nxt:03d}"


def counter_path(root: Path) -> Path:
    return root / "data" / "id_counters.json"
