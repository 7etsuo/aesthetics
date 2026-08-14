"""Materialize the authoring catalog into registry JSON."""

from __future__ import annotations

from vslib.catalog import (
    aesthetic_records,
    alias_records,
    anchor_records,
    families,
    interaction_records,
    vector_records,
)
from vslib.models import Vector
from vslib.store import Library


def materialize(lib: Library, *, overwrite_vectors: bool = False) -> Library:
    lib.ensure_dirs()
    if not lib.families:
        lib.families = {f.id: f for f in families()}
    else:
        for fam in families():
            lib.families.setdefault(fam.id, fam)

    for rec in vector_records():
        vec = Vector.from_dict(rec)
        if vec.id in lib.vectors and not overwrite_vectors:
            existing = lib.vectors[vec.id]
            # Keep evidence and validation written by studies.
            vec.study_ids = existing.study_ids
            vec.observation_ids = existing.observation_ids
            vec.status = existing.status
            vec.confidence = existing.confidence
            vec.validation = existing.validation
            vec.open_questions = existing.open_questions or vec.open_questions
            vec.notes = existing.notes or vec.notes
        lib.vectors[vec.id] = vec

    if not lib.aliases:
        lib.aliases = {a.id: a for a in alias_records()}
    else:
        for alias in alias_records():
            lib.aliases.setdefault(alias.id, alias)

    for aes in aesthetic_records():
        if aes.id in lib.aesthetics:
            current = lib.aesthetics[aes.id]
            aes.observation_ids = current.observation_ids
            aes.study_ids = current.study_ids
            aes.revision = current.revision
            if current.confidence:
                aes.confidence = current.confidence
        lib.aesthetics[aes.id] = aes

    for item in interaction_records():
        lib.interactions.setdefault(item.id, item)

    for anchor in anchor_records():
        if anchor.id in lib.anchors and lib.anchors[anchor.id].image_path:
            anchor.image_path = lib.anchors[anchor.id].image_path
        lib.anchors[anchor.id] = anchor

    for fam in lib.families.values():
        fam.vector_ids = [v.id for v in lib.vectors.values() if v.family_id == fam.id]
    return lib
