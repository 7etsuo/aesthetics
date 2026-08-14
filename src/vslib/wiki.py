"""Generate human-readable Markdown from canonical records."""

from __future__ import annotations

from pathlib import Path

from vslib.matrices import nearest_aesthetics
from vslib.store import Library


def _w(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8")


def generate_wiki(lib: Library) -> None:
    wiki = lib.root / "wiki"
    generate_index(lib, wiki)
    generate_alias_dictionary(lib, wiki)
    generate_questions(lib, wiki)
    for family in lib.families.values():
        generate_family(lib, wiki, family.id)
    for vector in lib.vectors.values():
        generate_vector(lib, wiki, vector.id)
    for aes in lib.aesthetics.values():
        generate_aesthetic(lib, wiki, aes.id)
    for study in lib.studies.values():
        generate_study(lib, wiki, study.id)
    for obs in lib.observations.values():
        generate_observation(lib, wiki, obs.id)


def generate_index(lib: Library, wiki: Path) -> None:
    fam_lines = []
    for fam in sorted(lib.families.values(), key=lambda f: f.name):
        members = [v for v in lib.vectors.values() if v.family_id == fam.id]
        fam_lines.append(
            f"- [{fam.name}]({fam.id.replace('fam_', 'families/family_')}.md) "
            f"({len(members)} vectors)"
        )
    vec_lines = []
    for vec in sorted(lib.vectors.values(), key=lambda v: v.canonical_name):
        vec_lines.append(
            f"- `{vec.status}` [{vec.canonical_name}](vectors/{vec.id}.md) "
            f"({vec.id}, conf {vec.confidence:.2f})"
        )
    aes_lines = [
        f"- `{aes.status}` [{aes.canonical_name}](aesthetics/{aes.id}.md)"
        for aes in sorted(lib.aesthetics.values(), key=lambda a: a.canonical_name)
    ]
    study_lines = [
        f"- `{s.status}` [{s.title}](studies/{s.id}.md) ({s.id})"
        for s in sorted(lib.studies.values(), key=lambda s: s.id)
    ]
    _w(wiki / "index.md", f"""# Visual basis vector library

Operational library of minimal, independently tested visual dimensions.
These are not assumed to be a mathematically orthogonal basis.

## Indexes

- [Families](#families)
- [Vectors](#vectors)
- [Composite aesthetics](#composite-aesthetics)
- [Aliases](aliases/alias_dictionary.md)
- [Studies](#studies)
- [Open questions](questions.md)
- Searchable HTML site: `site/index.html`

## Families

{chr(10).join(fam_lines)}

## Vectors

{chr(10).join(vec_lines)}

## Composite aesthetics

{chr(10).join(aes_lines)}

## Studies

{chr(10).join(study_lines)}

## Counts

- vectors: {len(lib.vectors)}
- observations: {len(lib.observations)}
- studies: {len(lib.studies)}
- aesthetics: {len(lib.aesthetics)}
- aliases: {len(lib.aliases)}
""")


def generate_family(lib: Library, wiki: Path, family_id: str) -> None:
    fam = lib.families[family_id]
    members = [v for v in lib.vectors.values() if v.family_id == family_id]
    members.sort(key=lambda v: v.canonical_name)
    lines = [
        f"# {fam.name}",
        "",
        "## Metadata",
        f"- id: {fam.id}",
        f"- provisional: {str(fam.provisional).lower()}",
        "",
        "## Definition",
        fam.definition,
        "",
        "## Vectors",
        "",
    ]
    for vec in members:
        lines.append(f"- [{vec.canonical_name}](../vectors/{vec.id}.md) `{vec.status}`")
    if fam.notes:
        lines.extend(["", "## Notes", fam.notes])
    _w(wiki / "families" / f"family_{family_id.removeprefix('fam_')}.md", "\n".join(lines))


def generate_vector(lib: Library, wiki: Path, vector_id: str) -> None:
    vec = lib.vectors[vector_id]
    nearby = []
    for nid in vec.nearby_ids:
        if nid in lib.vectors:
            nearby.append(f"- [{lib.vectors[nid].canonical_name}]({nid}.md)")
        else:
            nearby.append(f"- {nid}")
    not_same = [f"- [{k}]({k}.md): {v}" for k, v in vec.not_the_same_as.items()]
    effects = [f"- {e}" for e in vec.observable_effects] or ["- not yet observed"]
    studies = [f"- [{s}](../studies/{s}.md)" for s in vec.study_ids] or ["- none"]
    images = [f"- [{o}](../observations/{o}.md)" for o in vec.observation_ids] or ["- none"]
    aliases = ", ".join(vec.aliases) if vec.aliases else "none"
    questions = [f"- {q}" for q in vec.open_questions] or ["- none recorded"]
    fam_name = lib.families[vec.family_id].name if vec.family_id in lib.families else vec.family_id
    _w(wiki / "vectors" / f"{vec.id}.md", f"""# {vec.canonical_name}

## Metadata
- id: {vec.id}
- family: [{fam_name}](../families/family_{vec.family_id.removeprefix('fam_')}.md)
- status: {vec.status}
- canonical_name: {vec.canonical_name}
- aliases: {aliases}
- opposite_or_low_pole: {vec.low_pole}
- high_pole: {vec.high_pole}
- polarity: {vec.polarity}
- range: low to high
- confidence: {vec.confidence:.2f}

## Definition
{vec.definition}

## Why it matters
{vec.testable_claim}

## Observable effects
{chr(10).join(effects)}

## Nearby vectors
{chr(10).join(nearby) if nearby else "- none listed"}

## Not the same as
{chr(10).join(not_same) if not_same else "- no discrimination notes yet"}

## Controlled studies
{chr(10).join(studies)}

## Evidence images
{chr(10).join(images)}

## Scoring guidance
{vec.scoring_guidance or "0.00 absent, 0.50 moderate, 1.00 dominant."}

## Prompt phrases
- low: {vec.prompt_phrases.get("low", "n/a")}
- medium: {vec.prompt_phrases.get("medium", "n/a")}
- high: {vec.prompt_phrases.get("high", "n/a")}

## Open questions
{chr(10).join(questions)}
""")


def generate_aesthetic(lib: Library, wiki: Path, aesthetic_id: str) -> None:
    aes = lib.aesthetics[aesthetic_id]
    weights = ["| vector_id | weight | hypothesized |", "|---|---:|:---:|"]
    for item in sorted(aes.weights, key=lambda w: abs(w.weight), reverse=True):
        name = lib.vectors[item.vector_id].canonical_name if item.vector_id in lib.vectors else item.vector_id
        weights.append(
            f"| [{name}](../vectors/{item.vector_id}.md) | {item.weight:.2f} | {str(item.hypothesized).lower()} |"
        )
    if len(weights) == 2:
        weights.append("| _none_ |  |  |")
    interactions = [f"- {n}" for n in aes.interaction_notes] or ["- none recorded"]
    nearest = nearest_aesthetics(lib, aes.id)
    near_lines = [
        f"- [{lib.aesthetics[i].canonical_name}]({i}.md) (cosine {s:.3f})"
        for i, s in nearest
    ] or ["- none"]
    refs = [f"- [{o}](../observations/{o}.md)" for o in aes.observation_ids] or ["- none yet"]
    _w(wiki / "aesthetics" / f"{aes.id}.md", f"""# {aes.canonical_name}

## Metadata
- id: {aes.id}
- status: {aes.status}
- aliases: {", ".join(aes.aliases) if aes.aliases else "none"}
- confidence: {aes.confidence:.2f}
- revision: {aes.revision}

## Definition
{aes.definition}

## Coordinate profile
Linear first-order model: a = sum w_i v_i. Nonlinear terms are not used until evidence requires them.

## Weight table
{chr(10).join(weights)}

## Interaction notes
{chr(10).join(interactions)}

## Nearest-neighbor aesthetics
{chr(10).join(near_lines)}

## Example references
{chr(10).join(refs)}

## Reconstruction notes
{aes.reconstruction_notes or "No reconstruction notes."}
""")


def generate_study(lib: Library, wiki: Path, study_id: str) -> None:
    study = lib.studies[study_id]
    obs_lines = []
    for obs_id in study.observation_ids:
        if obs_id not in lib.observations:
            continue
        obs = lib.observations[obs_id]
        obs_lines.append(
            f"- [{obs.id}](../observations/{obs.id}.md) {obs.anchor_id} {obs.intended_level}"
        )
    grid = lib.root / "artifacts" / "grids" / f"{study.id}.jpg"
    grid_line = f"![comparison grid](../../artifacts/grids/{study.id}.jpg)" if grid.exists() else "_grid not built_"
    nexts = [f"- {n}" for n in study.next_experiments] or ["- none"]
    ents = [f"- {n}" for n in study.entanglement_notes] or ["- none recorded"]
    _w(wiki / "studies" / f"{study.id}.md", f"""# {study.title}

## Metadata
- id: {study.id}
- candidate: [{study.candidate_vector_id}](../vectors/{study.candidate_vector_id}.md)
- status: {study.status}
- date: {study.date}
- decision: {study.decision or "pending"}

## Protocol
{study.protocol}

## Hold constant
{chr(10).join(f"- {h}" for h in study.hold_constant) or "- n/a"}

## Comparison grid
{grid_line}

## Observations
{chr(10).join(obs_lines) or "- none"}

## Decision
{study.decision_reason or "Not decided."}

## Entanglement
{chr(10).join(ents)}

## Next experiments
{chr(10).join(nexts)}

## Notes
{study.notes or ""}
""")


def generate_observation(lib: Library, wiki: Path, observation_id: str) -> None:
    obs = lib.observations[observation_id]
    scores = ["| vector_id | score | confidence |", "|---|---:|---:|"]
    for item in obs.scores:
        scores.append(f"| [{item.vector_id}](../vectors/{item.vector_id}.md) | {item.score:.2f} | {item.confidence:.2f} |")
    if len(scores) == 2:
        scores.append("| _unscored_ |  |  |")
    rel_img = f"../../{obs.image_path}"
    _w(wiki / "observations" / f"{obs.id}.md", f"""# observation {obs.id}

## Metadata
- id: {obs.id}
- source_type: {obs.source_type}
- study_id: [{obs.study_id}](../studies/{obs.study_id}.md)
- anchor_subject: {obs.anchor_id}
- intended_vector: {obs.intended_vector_id}
- intended_level: {obs.intended_level}
- seed: {obs.seed or "unavailable"}
- aspect_ratio: {obs.aspect_ratio}
- model: {obs.model}
- date: {obs.date}

## Image
![{obs.id}]({rel_img})

## Prompt
```
{obs.prompt}
```

## Vector scores
{chr(10).join(scores)}

## Unintended changes
{chr(10).join(f"- {u}" for u in obs.unintended_changes) or "- none recorded"}

## Notes
{obs.notes or ""}
""")


def generate_alias_dictionary(lib: Library, wiki: Path) -> None:
    lines = [
        "# Alias dictionary",
        "",
        "Raw phrases mapped to canonical entities. Vague cultural labels are not atoms.",
        "",
        "| raw phrase | target | mapping | confidence | notes |",
        "|---|---|---|---:|---|",
    ]
    for alias in sorted(lib.aliases.values(), key=lambda a: a.raw_phrase.lower()):
        note = alias.notes.replace("|", "/")
        lines.append(
            f"| {alias.raw_phrase} | `{alias.target_id}` | {alias.mapping_type} | "
            f"{alias.confidence:.2f} | {note} |"
        )
    _w(wiki / "aliases" / "alias_dictionary.md", "\n".join(lines))


def generate_questions(lib: Library, wiki: Path) -> None:
    lines = ["# Unresolved research questions", ""]
    for vec in sorted(lib.vectors.values(), key=lambda v: v.id):
        if not vec.open_questions:
            continue
        lines.append(f"## {vec.canonical_name} (`{vec.id}`)")
        for q in vec.open_questions:
            lines.append(f"- {q}")
        lines.append("")
    for study in lib.studies.values():
        if study.next_experiments:
            lines.append(f"## From {study.id}")
            for item in study.next_experiments:
                lines.append(f"- {item}")
            lines.append("")
    _w(wiki / "questions.md", "\n".join(lines))
