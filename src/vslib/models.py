"""Dataclasses for library entities."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any, Literal

from vslib.ids import interaction_id, validate_id

Status = Literal[
    "canonical",
    "provisional",
    "candidate",
    "composite",
    "system",
    "alias",
    "rejected",
    "vague",
]
Polarity = Literal["unipolar", "bipolar"]
MappingType = Literal[
    "alias",
    "near_alias",
    "parent",
    "child",
    "composite",
    "interaction",
    "family",
    "system",
    "vague",
    "invalid",
]
Level = Literal["low", "medium", "high"]
AnchorKind = Literal[
    "portrait",
    "object",
    "architecture",
    "landscape",
    "character",
]


def _clean(data: dict[str, Any]) -> dict[str, Any]:
    return {k: v for k, v in data.items() if v is not None}


@dataclass
class Vector:
    id: str
    canonical_name: str
    family_id: str
    status: Status
    definition: str
    testable_claim: str
    low_pole: str
    high_pole: str
    polarity: Polarity = "unipolar"
    aliases: list[str] = field(default_factory=list)
    nearby_ids: list[str] = field(default_factory=list)
    not_the_same_as: dict[str, str] = field(default_factory=dict)
    observable_effects: list[str] = field(default_factory=list)
    prompt_phrases: dict[str, str] = field(default_factory=dict)
    scoring_guidance: str = ""
    open_questions: list[str] = field(default_factory=list)
    confidence: float = 0.2
    study_ids: list[str] = field(default_factory=list)
    observation_ids: list[str] = field(default_factory=list)
    validation: dict[str, Any] = field(default_factory=dict)
    notes: str = ""

    def __post_init__(self) -> None:
        if validate_id(self.id) != "vector":
            raise ValueError(f"not a vector id: {self.id}")
        self.confidence = _clamp(self.confidence)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Vector:
        return cls(**{k: v for k, v in data.items() if k in cls.__dataclass_fields__})


@dataclass
class Family:
    id: str
    name: str
    definition: str
    provisional: bool = True
    vector_ids: list[str] = field(default_factory=list)
    notes: str = ""

    def __post_init__(self) -> None:
        if validate_id(self.id) != "family":
            raise ValueError(f"not a family id: {self.id}")

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Family:
        return cls(**{k: v for k, v in data.items() if k in cls.__dataclass_fields__})


@dataclass
class Alias:
    id: str
    raw_phrase: str
    target_id: str
    mapping_type: MappingType
    confidence: float
    notes: str = ""

    def __post_init__(self) -> None:
        if validate_id(self.id) != "alias":
            raise ValueError(f"not an alias id: {self.id}")
        validate_id(self.target_id)
        self.confidence = _clamp(self.confidence)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Alias:
        return cls(**{k: v for k, v in data.items() if k in cls.__dataclass_fields__})


@dataclass
class Weight:
    vector_id: str
    weight: float
    source: str = "manual"
    confidence: float = 0.5
    hypothesized: bool = False

    def __post_init__(self) -> None:
        if validate_id(self.vector_id) != "vector":
            raise ValueError(self.vector_id)
        self.weight = float(self.weight)
        self.confidence = _clamp(self.confidence)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class Aesthetic:
    id: str
    canonical_name: str
    status: Status
    definition: str
    weights: list[Weight] = field(default_factory=list)
    aliases: list[str] = field(default_factory=list)
    interaction_notes: list[str] = field(default_factory=list)
    reconstruction_notes: str = ""
    observation_ids: list[str] = field(default_factory=list)
    study_ids: list[str] = field(default_factory=list)
    confidence: float = 0.3
    nearest_ids: list[str] = field(default_factory=list)
    revision: int = 1
    notes: str = ""

    def __post_init__(self) -> None:
        if validate_id(self.id) != "aesthetic":
            raise ValueError(self.id)
        self.confidence = _clamp(self.confidence)
        parsed: list[Weight] = []
        for item in self.weights:
            if isinstance(item, Weight):
                parsed.append(item)
            else:
                parsed.append(Weight(**item))
        self.weights = parsed

    def coordinate(self) -> dict[str, float]:
        return {w.vector_id: w.weight for w in self.weights}

    def to_dict(self) -> dict[str, Any]:
        data = asdict(self)
        return data

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Aesthetic:
        payload = {k: v for k, v in data.items() if k in cls.__dataclass_fields__}
        return cls(**payload)


@dataclass
class Score:
    vector_id: str
    score: float
    confidence: float
    method: str = "agent_visual"

    def __post_init__(self) -> None:
        if validate_id(self.vector_id) != "vector":
            raise ValueError(self.vector_id)
        self.score = float(self.score)
        self.confidence = _clamp(self.confidence)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class Observation:
    id: str
    study_id: str
    source_type: str
    image_path: str
    prompt: str
    intended_vector_id: str | None = None
    intended_level: str | None = None
    anchor_id: str | None = None
    source_image: str | None = None
    seed: str | None = None
    aspect_ratio: str = "1:1"
    model: str = "grok-imagine"
    settings: dict[str, Any] = field(default_factory=dict)
    unintended_changes: list[str] = field(default_factory=list)
    scores: list[Score] = field(default_factory=list)
    notes: str = ""
    date: str = ""

    def __post_init__(self) -> None:
        if validate_id(self.id) != "observation":
            raise ValueError(self.id)
        if validate_id(self.study_id) != "study":
            raise ValueError(self.study_id)
        parsed: list[Score] = []
        for item in self.scores:
            if isinstance(item, Score):
                parsed.append(item)
            else:
                parsed.append(Score(**item))
        self.scores = parsed

    def score_map(self) -> dict[str, float]:
        return {s.vector_id: s.score for s in self.scores}

    def confidence_map(self) -> dict[str, float]:
        return {s.vector_id: s.confidence for s in self.scores}

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Observation:
        payload = {k: v for k, v in data.items() if k in cls.__dataclass_fields__}
        return cls(**payload)


@dataclass
class Study:
    id: str
    title: str
    candidate_vector_id: str
    protocol: str
    status: str
    anchor_ids: list[str] = field(default_factory=list)
    levels: list[str] = field(default_factory=lambda: ["low", "medium", "high"])
    hold_constant: list[str] = field(default_factory=list)
    observation_ids: list[str] = field(default_factory=list)
    decision: str = ""
    decision_reason: str = ""
    entanglement_notes: list[str] = field(default_factory=list)
    next_experiments: list[str] = field(default_factory=list)
    date: str = ""
    notes: str = ""

    def __post_init__(self) -> None:
        if validate_id(self.id) != "study":
            raise ValueError(self.id)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Study:
        return cls(**{k: v for k, v in data.items() if k in cls.__dataclass_fields__})


@dataclass
class Interaction:
    id: str
    vector_i: str
    vector_j: str
    strength: float
    note: str
    evidence_study_ids: list[str] = field(default_factory=list)
    status: str = "suspected"

    def __post_init__(self) -> None:
        expected = interaction_id(self.vector_i, self.vector_j)
        if self.id != expected:
            raise ValueError(f"interaction id must be {expected}, got {self.id}")
        self.strength = _clamp(float(self.strength))

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Interaction:
        return cls(**{k: v for k, v in data.items() if k in cls.__dataclass_fields__})


@dataclass
class Anchor:
    id: str
    kind: AnchorKind
    name: str
    lock_prompt: str
    aspect_ratio: str = "1:1"
    image_path: str | None = None
    notes: str = ""

    def __post_init__(self) -> None:
        if validate_id(self.id) != "anchor":
            raise ValueError(self.id)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Anchor:
        return cls(**{k: v for k, v in data.items() if k in cls.__dataclass_fields__})


@dataclass
class ReconstructionEval:
    id: str
    target_aesthetic_id: str
    observation_id: str
    method: str
    reconstruction_score: float
    human_rating: float | None
    residual_vectors: list[str]
    notes: str
    date: str = ""

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> ReconstructionEval:
        return cls(**{k: v for k, v in data.items() if k in cls.__dataclass_fields__})


@dataclass
class GenerationJob:
    id: str
    study_id: str
    kind: Literal["image_gen", "image_edit"]
    prompt: str
    intended_vector_id: str | None
    intended_level: str | None
    anchor_id: str | None
    source_image: str | None
    aspect_ratio: str = "1:1"
    hold_constant: list[str] = field(default_factory=list)
    status: str = "planned"
    output_path: str | None = None
    observation_id: str | None = None
    notes: str = ""

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> GenerationJob:
        return cls(**{k: v for k, v in data.items() if k in cls.__dataclass_fields__})


def _clamp(value: float, lo: float = 0.0, hi: float = 1.0) -> float:
    return max(lo, min(hi, float(value)))
