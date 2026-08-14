"""Matrix construction from observations and aesthetics."""

from __future__ import annotations

import csv
import json
import math
from pathlib import Path
from typing import Iterable

import numpy as np

from vslib.store import Library


def _vector_columns(lib: Library) -> list[str]:
    scored = lib.scored_vector_ids()
    if scored:
        return scored
    return [v.id for v in sorted(lib.canonical_vectors(), key=lambda v: v.id)]


def observation_matrix(lib: Library) -> tuple[list[str], list[str], np.ndarray, np.ndarray]:
    cols = _vector_columns(lib)
    rows = sorted(lib.observations)
    x = np.zeros((len(rows), len(cols)), dtype=float)
    c = np.zeros_like(x)
    col_index = {vid: i for i, vid in enumerate(cols)}
    for r, obs_id in enumerate(rows):
        obs = lib.observations[obs_id]
        for score in obs.scores:
            if score.vector_id in col_index:
                j = col_index[score.vector_id]
                x[r, j] = score.score
                c[r, j] = score.confidence
    return rows, cols, x, c


def weight_matrix(lib: Library) -> tuple[list[str], list[str], np.ndarray]:
    cols = sorted({w.vector_id for aes in lib.aesthetics.values() for w in aes.weights})
    if not cols:
        cols = [v.id for v in sorted(lib.vectors.values(), key=lambda v: v.id)]
    rows = sorted(lib.aesthetics)
    w = np.zeros((len(rows), len(cols)), dtype=float)
    col_index = {vid: i for i, vid in enumerate(cols)}
    for r, aes_id in enumerate(rows):
        for item in lib.aesthetics[aes_id].weights:
            if item.vector_id in col_index:
                w[r, col_index[item.vector_id]] = item.weight
    return rows, cols, w


def cooccurrence(x: np.ndarray) -> np.ndarray:
    return x.T @ x


def cosine_sim(matrix: np.ndarray, axis: int = 1) -> np.ndarray:
    if matrix.size == 0:
        return np.zeros((0, 0))
    if axis == 0:
        data = matrix.T
    else:
        data = matrix
    norms = np.linalg.norm(data, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    normalized = data / norms
    return normalized @ normalized.T


def column_correlation(x: np.ndarray) -> np.ndarray:
    if x.shape[0] < 2 or x.shape[1] == 0:
        return np.zeros((x.shape[1], x.shape[1]))
    with np.errstate(invalid="ignore", divide="ignore"):
        corr = np.corrcoef(x, rowvar=False)
    if np.ndim(corr) == 0:
        return np.array([[float(corr)]])
    return np.nan_to_num(corr, nan=0.0)


def redundancy_pairs(cols: list[str], corr: np.ndarray, threshold: float = 0.85) -> list[dict]:
    pairs = []
    for i, a in enumerate(cols):
        for j in range(i + 1, len(cols)):
            value = float(corr[i, j])
            if abs(value) >= threshold:
                pairs.append({"vector_i": a, "vector_j": cols[j], "correlation": round(value, 4)})
    return pairs


def nearest_aesthetics(lib: Library, aes_id: str, k: int = 5) -> list[tuple[str, float]]:
    rows, cols, w = weight_matrix(lib)
    if aes_id not in rows or not cols:
        return []
    sim = cosine_sim(w, axis=1)
    idx = rows.index(aes_id)
    ranked = []
    for j, other in enumerate(rows):
        if other == aes_id:
            continue
        ranked.append((other, float(sim[idx, j])))
    ranked.sort(key=lambda item: item[1], reverse=True)
    return ranked[:k]


def profile_distance(a: dict[str, float], b: dict[str, float]) -> dict[str, float]:
    keys = sorted(set(a) | set(b))
    va = np.array([a.get(k, 0.0) for k in keys], dtype=float)
    vb = np.array([b.get(k, 0.0) for k in keys], dtype=float)
    diff = va - vb
    na = np.linalg.norm(va)
    nb = np.linalg.norm(vb)
    cosine = float(va @ vb / (na * nb)) if na and nb else 0.0
    return {
        "euclidean": float(np.linalg.norm(diff)),
        "cosine": cosine,
        "l1": float(np.abs(diff).sum()),
        "max_abs": float(np.abs(diff).max()) if len(diff) else 0.0,
    }


def write_csv(path: Path, rows: list[str], cols: list[str], matrix: np.ndarray, row_key: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow([row_key, *cols])
        for i, row in enumerate(rows):
            writer.writerow([row, *[f"{matrix[i, j]:.4f}" for j in range(len(cols))]])


def write_named_csv(path: Path, fieldnames: list[str], rows: Iterable[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def generate_matrices(lib: Library) -> dict:
    data = lib.root / "data"
    data.mkdir(parents=True, exist_ok=True)

    obs_rows, obs_cols, x, x_conf = observation_matrix(lib)
    write_csv(data / "observation_matrix.csv", obs_rows, obs_cols, x, "observation_id")
    write_csv(data / "confidence_matrix.csv", obs_rows, obs_cols, x_conf, "observation_id")

    aes_rows, aes_cols, w = weight_matrix(lib)
    write_csv(data / "composite_weight_matrix.csv", aes_rows, aes_cols, w, "aesthetic_id")

    c = cooccurrence(x) if x.size else np.zeros((len(obs_cols), len(obs_cols)))
    write_csv(data / "cooccurrence_matrix.csv", obs_cols, obs_cols, c, "vector_id")

    s_vec = cosine_sim(x, axis=0) if x.size else np.zeros((len(obs_cols), len(obs_cols)))
    write_csv(data / "vector_similarity_matrix.csv", obs_cols, obs_cols, s_vec, "vector_id")

    s_aes = cosine_sim(w, axis=1) if w.size else np.zeros((len(aes_rows), len(aes_rows)))
    write_csv(data / "aesthetic_similarity_matrix.csv", aes_rows, aes_rows, s_aes, "aesthetic_id")

    corr = column_correlation(x)
    write_csv(data / "vector_correlation_matrix.csv", obs_cols, obs_cols, corr, "vector_id")

    write_named_csv(
        data / "alias_mapping.csv",
        ["raw_phrase", "canonical_id", "mapping_type", "confidence", "notes"],
        (
            {
                "raw_phrase": alias.raw_phrase,
                "canonical_id": alias.target_id,
                "mapping_type": alias.mapping_type,
                "confidence": f"{alias.confidence:.2f}",
                "notes": alias.notes,
            }
            for alias in sorted(lib.aliases.values(), key=lambda a: a.raw_phrase)
        ),
    )

    write_named_csv(
        data / "interaction_candidates.csv",
        ["id", "vector_i", "vector_j", "interaction_strength", "status", "note"],
        (
            {
                "id": item.id,
                "vector_i": item.vector_i,
                "vector_j": item.vector_j,
                "interaction_strength": f"{item.strength:.2f}",
                "status": item.status,
                "note": item.note,
            }
            for item in sorted(lib.interactions.values(), key=lambda i: i.id)
        ),
    )

    write_named_csv(
        data / "reconstruction_evaluations.csv",
        ["id", "target_aesthetic_id", "observation_id", "method", "reconstruction_score",
         "human_rating", "residual_vectors", "notes", "date"],
        (
            {
                "id": item.id,
                "target_aesthetic_id": item.target_aesthetic_id,
                "observation_id": item.observation_id,
                "method": item.method,
                "reconstruction_score": f"{item.reconstruction_score:.3f}",
                "human_rating": "" if item.human_rating is None else f"{item.human_rating:.3f}",
                "residual_vectors": ";".join(item.residual_vectors),
                "notes": item.notes,
                "date": item.date,
            }
            for item in sorted(lib.reconstructions.values(), key=lambda i: i.id)
        ),
    )

    red = redundancy_pairs(obs_cols, corr, threshold=0.85)
    (data / "redundancy_pairs.json").write_text(json.dumps(red, indent=2) + "\n", encoding="utf-8")

    snapshot = {
        "n_vectors": len(lib.vectors),
        "n_canonical_or_provisional": len(lib.canonical_vectors()),
        "n_observations": len(lib.observations),
        "n_studies": len(lib.studies),
        "n_aesthetics": len(lib.aesthetics),
        "n_aliases": len(lib.aliases),
        "observation_columns": obs_cols,
        "redundancy_pairs": red,
        "basis_note": (
            "Operational basis only. Columns are not assumed orthogonal. "
            "Track correlation, redundancy, and reconstruction error."
        ),
    }
    (data / "library_snapshot.json").write_text(json.dumps(snapshot, indent=2) + "\n", encoding="utf-8")
    return snapshot
