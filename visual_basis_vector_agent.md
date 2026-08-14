# visual_basis_vector_agent.md

## Purpose

Build a structured, navigable, evidence-based library of **visual basis vectors** using Grok Build with the Grok Imagine image tool.

The library must help both:

1. **AI agents** retrieve precise visual concepts in a machine-readable way
2. **Humans** browse, compare, and understand the building blocks of visual style

The goal is not just to collect vague aesthetic labels. The goal is to discover the **smallest controllable visual properties** that can be isolated, tested, named, documented, and recombined.

---

## Core idea

Treat visual appearance as a space of controllable dimensions.

Examples of dimensions:

* optical softness
* shadow density
* highlight roll-off
* color separation
* chroma density
* halation
* telecine softness
* material roughness
* practical-fabrication feel
* miniature-set feel
* analog video texture

Each distinct dimension is a candidate **visual basis vector**.

A named aesthetic such as "80s fantasy TV look" is not atomic. It is a composite that can be represented as a combination of multiple basis vectors.

---

## Definitions

### Visual basis vector

A minimal visual property that can be varied independently enough to produce a recognizable, repeatable change across many subjects.

### Candidate vector

A proposed basis vector that has not yet been validated.

### Canonical vector

A validated basis vector with a stable definition, examples, aliases, and evidence.

### Aesthetic family

A broader category used to organize vectors, such as optics, tonal response, texture, lighting, material response, production method, and transfer quality.

### Composite aesthetic

A higher-level named look composed from multiple basis vectors.

### Alias

A synonym, phrase, slang label, or alternate term that maps to the same canonical vector.

### Observation

One controlled generation or analysis result used as evidence.

### Vector profile

A scored description of how strongly each basis vector is present in an image or composite aesthetic.

---

## Non-goals

Do not do the following:

* do not assume all internet aesthetic labels are meaningful
* do not treat every moodboard phrase as atomic
* do not collapse multiple distinct phenomena into one label
* do not accept a candidate vector unless it can be tested and documented
* do not rely on one image or one subject only

---

## Main outputs

The agent must produce:

1. **Canonical vector pages**
2. **Composite aesthetic pages**
3. **Alias dictionary**
4. **Controlled experiment pages**
5. **Observation records**
6. **Matrices and machine-readable data files**
7. **A navigable wiki-style library**

---

## High-level workflow

1. Gather references and candidate phrases
2. Normalize terms and extract candidate vectors
3. Group candidates into provisional families
4. Design controlled image experiments
5. Generate evidence with Grok Imagine
6. Score results in structured matrices
7. Decide whether a candidate is:

   * distinct
   * a synonym
   * a child of a broader vector
   * a composite aesthetic
   * noise or duplicate language
8. Create or update pages
9. Cross-link pages and update matrices
10. Repeat continuously

---

## Discovery strategy

### Step 1: harvest candidate language

Candidate vector phrases can come from:

* user descriptions
* film and photography vocabulary
* VFX vocabulary
* cinematography vocabulary
* restoration vocabulary
* design and art-school vocabulary
* recurring prompt language
* labels found in moodboards and communities

### Step 2: normalize language

Every phrase must be normalized into one of these buckets:

* possible atomic vector
* likely alias
* likely composite aesthetic
* likely family label
* unclear or noisy term

### Step 3: propose a testable definition

A candidate vector is only useful if it can be stated as:

> "If this dimension is increased or decreased while other major factors are held as constant as possible, a recognizable visual change occurs."

### Step 4: validate through controlled variation

Generate multiple images where only one candidate dimension is intentionally changed.

### Step 5: record and compare results

If the effect is reproducible across multiple subjects, it becomes a stronger candidate for a canonical vector.

---

## Controlled experiment protocol

The agent must use **controlled image studies**.

### Rule

Hold as much constant as possible and vary only one candidate dimension at a time.

### Anchor subjects

Use multiple anchor subjects so the vector is not tied to one content type.

Required anchor set:

* portrait
* object
* architecture or interior
* landscape or exterior scene
* stylized character or creature

### Experiment pattern

For each candidate vector, generate at least:

* low expression
* medium expression
* high expression

Optional:

* opposite pole if meaningful
* cross-medium test
* cross-subject test

### Example study prompt logic

Use prompts of this form:

* Preserve subject, pose, framing, and scene
* Change only the candidate dimension
* Produce low, medium, high expression of that dimension

### Validation criteria

A candidate vector is stronger if:

* the change is visible across multiple subjects
* the change is not merely a prompt artifact
* the change is conceptually separable from nearby vectors
* the change can be described clearly
* humans can identify it reliably in comparison grids

---

## Canonical top-level families

These are starting families only. They are provisional, not sacred.

### 1. Tonal response

Examples:

* black level
* shadow density
* highlight roll-off
* global contrast
* local contrast
* microcontrast
* dynamic range compression

### 2. Color response

Examples:

* saturation
* chroma density
* palette compression
* color separation
* hue bias
* shadow color bias
* highlight color bias

### 3. Spatial definition

Examples:

* acutance
* edge softness
* micro-detail retention
* texture resolution
* clarity
* fine-detail roll-off

### 4. Optical character

Examples:

* diffusion
* halation
* veiling glare
* field curvature feel
* bokeh softness
* corner softness
* focal-length feel

### 5. Texture and noise

Examples:

* grain structure
* noise character
* texture uniformity
* compression texture
* analog video texture

### 6. Capture and transfer quality

Examples:

* photochemical feel
* telecine softness
* optical-print softness
* release-print density
* VHS bandwidth loss
* CRT bloom feel

### 7. Lighting response

Examples:

* key-to-fill ratio
* source hardness
* practical-light dominance
* rim-light character
* atmospheric haze response

### 8. Material response

Examples:

* gloss response
* roughness
* subsurface feel
* fabric heaviness
* latex or foam feel
* hand-painted surface quality

### 9. Physical production method

Examples:

* puppetry feel
* animatronic feel
* miniature-set feel
* matte-painting feel
* practical fog feel
* optical-composite feel

### 10. Compositional grammar

Examples:

* lens distance feel
* subject scale
* frame density
* theatrical blocking
* negative-space bias

### 11. Finishing behavior

Examples:

* print-density bias
* final bloom
* sharpening intensity
* cleanup level
* stylized degradation

---

## Acceptance criteria for canonical vectors

A candidate becomes a canonical vector only if most of the following are true:

1. **Isolatable**
   It can be intentionally varied in a controlled study.

2. **Transferable**
   It appears across multiple subjects and scenes.

3. **Legible**
   Humans can perceive the change in side-by-side comparisons.

4. **Describable**
   A concise stable definition is possible.

5. **Non-redundant**
   It is not just an alias of an existing vector.

6. **Directional**
   It has a meaningful strength axis, polarity, or range.

7. **Useful**
   It helps explain or reconstruct broader aesthetics.

---

## Matrix system

Use several matrices, not just one.

### 1. Observation matrix `X`

Rows are observations or images.
Columns are canonical vectors.
Each cell stores the scored strength of the vector in the image.

Suggested range:

* `0.00` to `1.00` for presence strength

Optional signed range:

* `-1.00` to `1.00` for bipolar vectors

Example:

| observation_id | optical_softness | shadow_density | halation | telecine_softness | practical_material_feel |
| -------------- | ---------------: | -------------: | -------: | ----------------: | ----------------------: |
| obs_0001       |             0.82 |           0.64 |     0.27 |              0.73 |                    0.10 |
| obs_0002       |             0.15 |           0.21 |     0.02 |              0.05 |                    0.88 |

### 2. Confidence matrix `X_conf`

Same shape as `X`, but each cell stores confidence in that score.

### 3. Alias mapping table `A`

Maps raw phrases to canonical vector IDs.

| raw_phrase            | canonical_vector_id         | mapping_type | confidence |
| --------------------- | --------------------------- | ------------ | ---------: |
| old-tv softness       | vec_telecine_softness       | alias        |       0.91 |
| practical puppet feel | vec_practical_material_feel | near-alias   |       0.72 |

### 4. Co-occurrence matrix `C`

Measures how often vectors appear together.

[
C = X^T X
]

This helps identify:

* strongly linked vector pairs
* possible redundant vectors
* common composite aesthetics

### 5. Similarity matrix `S`

Can be used for either:

* image-to-image similarity
* vector-to-vector similarity
* aesthetic-to-aesthetic similarity

### 6. Composite weight matrix `W`

Rows are composite aesthetics.
Columns are canonical vectors.
Each cell stores the weight of the vector within that aesthetic.

Example:

| aesthetic_id       | optical_softness | shadow_density | halation | telecine_softness | practical_material_feel |
| ------------------ | ---------------: | -------------: | -------: | ----------------: | ----------------------: |
| aes_80s_fantasy_tv |             0.71 |           0.63 |     0.41 |              0.77 |                    0.68 |

### 7. Interaction candidate matrix `H`

Tracks suspected pairwise interactions between vectors.

Example:

| vector_i                | vector_j          | interaction_strength | note                                  |
| ----------------------- | ----------------- | -------------------: | ------------------------------------- |
| halation                | highlight_rolloff |                 0.62 | may need nonlinear modeling           |
| practical_material_feel | optical_softness  |                 0.55 | often co-produces analog fantasy look |

---

## Recommended repository structure

```text
/visual-style-library
  /README.md
  /vectors
    /vec_optical_softness.md
    /vec_halation.md
    /vec_shadow_density.md
  /aesthetics
    /aes_80s_fantasy_tv.md
    /aes_analog_practical_fantasy.md
  /families
    /family_optics.md
    /family_material_response.md
  /observations
    /obs_0001.md
    /obs_0002.md
  /studies
    /study_optical_softness_001.md
    /study_practical_material_feel_001.md
  /aliases
    /alias_dictionary.md
  /data
    /observation_matrix.csv
    /confidence_matrix.csv
    /composite_weight_matrix.csv
    /cooccurrence_matrix.csv
    /interaction_candidates.csv
  /schemas
    /vector_schema.json
    /aesthetic_schema.json
    /observation_schema.json
```

---

## Canonical vector page template

```md
# {canonical_name}

## Metadata
- id: vec_xxx
- family: optics
- status: canonical
- canonical_name: optical softness
- aliases: vintage softness, lens softness, old-cinema softness
- opposite_or_low_pole: clinical crispness
- range: low to high
- confidence: 0.91

## Definition
A concise definition of the vector.

## Why it matters
What it changes visually and why it is useful.

## Observable effects
- effect 1
- effect 2
- effect 3

## Nearby vectors
- vec_edge_softness
- vec_diffusion
- vec_telecine_softness

## Not the same as
Explain common confusions.

## Controlled studies
- study_optical_softness_001
- study_optical_softness_002

## Evidence images
- obs_0012
- obs_0044
- obs_0111

## Scoring guidance
How to score low, medium, high.

## Open questions
Anything still uncertain.
```

---

## Composite aesthetic page template

```md
# {composite_aesthetic_name}

## Metadata
- id: aes_xxx
- status: composite
- aliases: ...
- summary: ...

## Definition
A named aesthetic composed from multiple canonical vectors.

## Coordinate profile
List the contributing vectors and weights.

## Weight table
| vector_id | weight |
|---|---:|
| vec_optical_softness | 0.71 |
| vec_shadow_density | 0.63 |
| vec_halation | 0.41 |

## Interaction notes
Important pairwise or higher-order interactions.

## Example references
- obs_0103
- obs_0221

## Reconstruction notes
Prompt guidance for rebuilding the aesthetic.
```

---

## Observation page template

```md
# observation {id}

## Metadata
- id: obs_0001
- source_type: generated
- study_id: study_optical_softness_001
- anchor_subject: portrait
- prompt_version: v1
- seed: ...
- date: ...

## Image
Reference to image artifact.

## Vector scores
| vector_id | score | confidence |
|---|---:|---:|
| vec_optical_softness | 0.82 | 0.90 |
| vec_shadow_density | 0.64 | 0.77 |

## Notes
What was intended, what actually happened, what was learned.
```

---

## Grok Build agent loop

The agent should run this loop repeatedly.

### Loop

1. Load current canonical vectors, aliases, and open questions
2. Choose one unresolved candidate vector or ambiguous cluster
3. Design a controlled study
4. Use Grok Imagine to generate evidence
5. Score results
6. Compare against existing vectors
7. Decide:

   * create new canonical vector
   * merge with existing vector
   * relabel as alias
   * relabel as composite aesthetic
   * reject as noise
8. Write or update markdown pages
9. Update data files and matrices
10. Add cross-links and summary notes

---

## Decision rules for duplicate or near-duplicate terms

When two terms look similar, the agent must decide whether they are:

* exact aliases
* near-aliases
* parent-child concepts
* overlapping but distinct vectors
* one vector and one composite aesthetic
* ambiguous noisy language

### Example

"telecine softness" and "old TV blur" may be:

* aliases in some contexts
* not identical in stricter contexts

The agent must record that distinction.

---

## Human navigation requirements

The library must work like a small internal Wikipedia.

Every page should support:

* clear title
* short plain-English definition
* aliases
* cross-links
* examples
* evidence
* comparison notes
* related vectors
* machine-readable metadata

Recommended indexes:

* by family
* by alias
* by composite aesthetic
* by observation study
* by confidence
* by unresolved questions

---

## AI navigation requirements

Each page must include structured metadata so an agent can:

* map raw prompt language to canonical IDs
* retrieve definitions and examples
* assemble coordinate vectors for synthesis
* compare close concepts
* understand confidence and uncertainty
* distinguish atomic vectors from composite aesthetics

Use both:

* readable markdown
* structured companion data

---

## Scoring guidance

Use continuous scores when possible.

Suggested meaning of scores:

* `0.00` = absent
* `0.25` = weak
* `0.50` = moderate
* `0.75` = strong
* `1.00` = dominant

For bipolar vectors, use signed scores.

Example:

* `-1.00` = one pole
* `0.00` = neutral
* `1.00` = opposite pole

Always record confidence separately.

---

## Initial starter set

Start with a practical seed set, then expand.

Suggested initial candidates:

* optical softness
* edge softness
* microcontrast
* highlight roll-off
* black level
* shadow density
* chroma density
* color separation
* halation
* telecine softness
* analog video texture
* practical-material feel
* miniature-set feel
* theatrical lighting feel
* matte-painting feel

---

## Critical rule

The agent must never confuse:

* **atomic vector**
* **alias**
* **family label**
* **composite aesthetic**
* **cultural moodboard phrase**

Those are different ontology levels.

---

## Final mission statement

Build a durable ontology of visual style by discovering and validating **visual basis vectors**, organizing them into a wiki-style library, mapping aliases to canonical concepts, and storing evidence in matrices that support both human understanding and agent reasoning.

The result should make it easy to answer questions such as:

* What exactly is this look made of?
* Which parts are atomic and which are composite?
* Which labels are synonyms?
* Which vectors commonly co-occur?
* How can an agent reconstruct a target aesthetic from basis vectors?

