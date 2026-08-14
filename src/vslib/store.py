"""Load and save canonical JSON records."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, TypeVar

from vslib.ids import next_observation_id, validate_id
from vslib.models import (
    Aesthetic,
    Alias,
    Anchor,
    Family,
    Interaction,
    Observation,
    ReconstructionEval,
    Study,
    Vector,
)

T = TypeVar("T")


class Library:
    def __init__(self, root: Path | str):
        self.root = Path(root).resolve()
        self.vectors: dict[str, Vector] = {}
        self.families: dict[str, Family] = {}
        self.aliases: dict[str, Alias] = {}
        self.aesthetics: dict[str, Aesthetic] = {}
        self.studies: dict[str, Study] = {}
        self.observations: dict[str, Observation] = {}
        self.interactions: dict[str, Interaction] = {}
        self.anchors: dict[str, Anchor] = {}
        self.reconstructions: dict[str, ReconstructionEval] = {}

    @property
    def registry(self) -> Path:
        return self.root / "registry"

    def dirs(self) -> dict[str, Path]:
        return {
            "vectors": self.registry / "vectors",
            "families": self.registry / "families",
            "aliases": self.registry / "aliases",
            "aesthetics": self.registry / "aesthetics",
            "studies": self.registry / "studies",
            "observations": self.registry / "observations",
            "interactions": self.registry / "interactions",
            "anchors": self.registry / "anchors",
            "reconstructions": self.registry / "reconstructions",
            "data": self.root / "data",
            "artifacts": self.root / "artifacts",
            "wiki": self.root / "wiki",
            "site": self.root / "site",
            "schemas": self.root / "schemas",
        }

    def ensure_dirs(self) -> None:
        for path in self.dirs().values():
            path.mkdir(parents=True, exist_ok=True)
        (self.root / "artifacts" / "anchors").mkdir(parents=True, exist_ok=True)
        (self.root / "artifacts" / "studies").mkdir(parents=True, exist_ok=True)
        (self.root / "artifacts" / "grids").mkdir(parents=True, exist_ok=True)
        (self.root / "artifacts" / "reconstructions").mkdir(parents=True, exist_ok=True)

    def load(self) -> Library:
        self.ensure_dirs()
        self.vectors = self._load_map("vectors", Vector)
        self.families = self._load_map("families", Family)
        self.aliases = self._load_map("aliases", Alias)
        self.aesthetics = self._load_map("aesthetics", Aesthetic)
        self.studies = self._load_map("studies", Study)
        self.observations = self._load_map("observations", Observation)
        self.interactions = self._load_map("interactions", Interaction)
        self.anchors = self._load_map("anchors", Anchor)
        self.reconstructions = self._load_map("reconstructions", ReconstructionEval)
        return self

    def save(self) -> None:
        self.ensure_dirs()
        self._save_map("vectors", self.vectors)
        self._save_map("families", self.families)
        self._save_map("aliases", self.aliases)
        self._save_map("aesthetics", self.aesthetics)
        self._save_map("studies", self.studies)
        self._save_map("observations", self.observations)
        self._save_map("interactions", self.interactions)
        self._save_map("anchors", self.anchors)
        self._save_map("reconstructions", self.reconstructions)

    def _load_map(self, folder: str, cls: type[T]) -> dict[str, T]:
        path = self.dirs()[folder]
        items: dict[str, T] = {}
        if not path.exists():
            return items
        for file in sorted(path.glob("*.json")):
            data = json.loads(file.read_text(encoding="utf-8"))
            obj = cls.from_dict(data) if hasattr(cls, "from_dict") else cls(**data)
            items[getattr(obj, "id")] = obj
        return items

    def _save_map(self, folder: str, items: dict[str, Any]) -> None:
        path = self.dirs()[folder]
        path.mkdir(parents=True, exist_ok=True)
        seen = set()
        for key, obj in items.items():
            data = obj.to_dict() if hasattr(obj, "to_dict") else dict(obj)
            target = path / f"{key}.json"
            target.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")
            seen.add(target)
        for file in path.glob("*.json"):
            if file not in seen:
                file.unlink()

    def next_obs_id(self) -> str:
        return next_observation_id(list(self.observations))

    def put_vector(self, vector: Vector) -> None:
        validate_id(vector.id)
        self.vectors[vector.id] = vector

    def put_observation(self, observation: Observation) -> None:
        self.observations[observation.id] = observation
        if observation.intended_vector_id and observation.intended_vector_id in self.vectors:
            vec = self.vectors[observation.intended_vector_id]
            if observation.id not in vec.observation_ids:
                vec.observation_ids.append(observation.id)
        if observation.study_id in self.studies:
            study = self.studies[observation.study_id]
            if observation.id not in study.observation_ids:
                study.observation_ids.append(observation.id)

    def canonical_vectors(self) -> list[Vector]:
        return [v for v in self.vectors.values() if v.status in {"canonical", "provisional"}]

    def scored_vector_ids(self) -> list[str]:
        ids: set[str] = set()
        for obs in self.observations.values():
            ids.update(obs.score_map())
        return sorted(ids)
