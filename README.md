# Visual timbre lab

A research library of **visual basis vectors**: the smallest visual properties that can be isolated, tested with Grok Imagine, named, and recombined.

Phrases such as `cinematic`, `vintage`, `analog`, and `1980s fantasy` are not atoms. They are composites, systems, or vague labels.

The word *basis vector* is operational. The dimensions are not assumed to be orthogonal.

## What lives here

| Path | Role |
| --- | --- |
| `registry/` | Canonical JSON records (`vec_`, `aes_`, `obs_`, `study_`, `alias_`, `int_`) |
| `schemas/` | JSON schemas for those records |
| `data/` | Observation, confidence, weight, alias, co-occurrence, similarity, interaction, and reconstruction tables |
| `wiki/` | Generated Markdown encyclopedia |
| `site/` | Searchable local HTML wiki |
| `artifacts/` | Imagine outputs, study grids |
| `src/vslib/` | Ontology, matrices, retrieval, Imagine job planner |
| `reports/` | Experiment writeups |

Governing specs: `visual_basis_vector_agent.md`, `aesthetic_synthesis_framework.md`, `label.md`.

## Use

```bash
pip install -e .
python -m vslib build
python -m vslib map "old-tv softness"
python -m vslib profile aes_soft_halated_shadow
python -m vslib reconstruct aes_soft_halated_shadow
python -m vslib compare aes_soft_halated_shadow aes_80s_fantasy_tv
python -m vslib next
python -m vslib serve --port 8765
```

Open `site/index.html`, http://127.0.0.1:8765/, or https://aesthetics.agenc.ag/.

## Experiment rule

Hold subject, composition, framing, and lighting. Change one candidate dimension. Repeat low / medium / high across the five anchors: portrait, object, architecture, landscape, stylized character.

Grok Imagine does not expose a seed. Anchors are locked by generating a reference still, then `image_edit`ing that file.

## Status

See `reports/milestone_01.md` and `reports/milestone_02.md`. Diffusion and bokeh softness are provisional. Edge softness is a near-alias of optical softness. None is canonical yet.
