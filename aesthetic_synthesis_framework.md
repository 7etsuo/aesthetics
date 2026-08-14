# aesthetic_synthesis_framework.md

## Purpose

Define how to construct complex aesthetics from visual basis vectors.

The first model is linear:

> Find the visual basis vectors, then construct complex aesthetics through weighted linear combinations in their span.

Later models may need nonlinear terms, interactions, and tensor products.

This document defines the mathematical framework, the data structures, and the agent workflow needed to do that.

---

## Core model

Let the canonical visual basis vectors be:

[
V = {v_1, v_2, \dots, v_n}
]

Each (v_i) is an atomic controllable visual dimension.

A complex aesthetic is represented by a weight vector:

[
w = [w_1, w_2, \dots, w_n]^T
]

The aesthetic is then modeled as a weighted linear combination:

[
a = \sum_{i=1}^{n} w_i v_i
]

or, in matrix form,

[
a = B w
]

where:

* (B) is the basis matrix whose columns are the canonical basis vectors
* (w) is the coordinate vector of the aesthetic in that basis
* (a) is the resulting composite aesthetic representation

In plain language:

* the **basis vectors** are the atomic ingredients
* the **weights** say how much of each ingredient is present
* the **aesthetic** is the resulting mixture

---

## Interpretation

### Canonical vector

An atomic visual control dimension.

### Coordinate vector

The list of weights that describes a complex aesthetic in basis space.

### Span

The set of all aesthetics that can be formed by linear combinations of the current basis set.

### Basis expansion

The expression of a composite aesthetic in basis coordinates.

### Reconstruction

Approximating a target aesthetic using the available basis vectors and weights.

---

## Practical meaning

If the basis set includes:

* optical softness
* shadow density
* telecine softness
* chroma density
* practical-material feel

Then a composite such as "80s fantasy TV look" might be represented as:

[
w =
\begin{bmatrix}
0.72 \
0.63 \
0.79 \
0.40 \
0.68
\end{bmatrix}
]

This means the aesthetic draws strongly from:

* telecine softness
* optical softness
* practical-material feel

and moderately from:

* shadow density
* chroma density

---

## Weight semantics

Use interpretable weight ranges.

### Recommended default

Use nonnegative weights in the range:

[
0.00 \leq w_i \leq 1.00
]

Meaning:

* `0.00` = absent
* `0.25` = weak
* `0.50` = moderate
* `0.75` = strong
* `1.00` = dominant

### Bipolar vectors

If a vector naturally has two poles, use a signed range:

[
-1.00 \leq w_i \leq 1.00
]

Example:

* `-1.00` = one pole
* `0.00` = neutral
* `1.00` = opposite pole

---

## Core matrices

### 1. Basis matrix `B`

Columns are canonical basis vectors.

[
B = [v_1 ; v_2 ; \dots ; v_n]
]

### 2. Aesthetic weight matrix `W`

Rows are named composite aesthetics.
Columns are canonical basis vectors.

[
W =
\begin{bmatrix}
w^{(1)} \
w^{(2)} \
\vdots \
w^{(m)}
\end{bmatrix}
]

where each row (w^{(k)}) is the coordinate vector of one named aesthetic.

### 3. Observation matrix `X`

Rows are images or studies.
Columns are canonical vectors.
Entries are measured or assigned scores.

### 4. Reconstruction error table `R`

Tracks how well a proposed weight vector reproduces the intended aesthetic.

Example fields:

* target_aesthetic_id
* candidate_weight_vector
* reconstruction_score
* human_rating
* agent_notes

### 5. Interaction matrix `H`

Tracks pairwise interaction strengths between basis vectors.

[
H_{ij}
]

represents the importance of interaction between (v_i) and (v_j).

---

## Aesthetic page schema

Each named aesthetic should have:

* canonical name
* aliases
* summary description
* coordinate vector
* weight table
* interaction notes
* example references
* reconstruction guidance
* confidence score
* revision history

### Example template

```md
# aes_80s_fantasy_tv

## Summary
Composite aesthetic with soft optics, dense shadows, analog transfer softness, restrained chroma, and strong practical-material feel.

## Coordinate vector
| vector_id | weight |
|---|---:|
| vec_optical_softness | 0.72 |
| vec_shadow_density | 0.63 |
| vec_telecine_softness | 0.79 |
| vec_chroma_density | 0.40 |
| vec_practical_material_feel | 0.68 |

## Interaction notes
- telecine softness and optical softness reinforce each other
- practical-material feel becomes more legible when microcontrast is reduced

## Example references
- obs_1021
- obs_1188

## Reconstruction prompt notes
Preserve content. Increase optical softness, telecine softness, and practical-material feel while keeping halation restrained.
```

---

## How to estimate weights

Use several methods.

### 1. Manual expert assignment

A human or agent assigns weights from judgment and visual comparison.

Best for:

* early bootstrapping
* canonical prototype definitions
* sparse interpretable profiles

### 2. Comparative fitting

Compare a target reference against basis exemplars and estimate weights by similarity.

### 3. Least squares fitting

Estimate weights by minimizing reconstruction error.

Conceptually:

[
\hat{w} = \arg\min_w |a_{\text{target}} - B w|^2
]

### 4. Constrained least squares

Useful when weights should stay bounded or nonnegative.

### 5. Sparse fitting

Encourage simpler coordinate vectors so aesthetics use fewer dominant basis vectors.

Examples:

* L1 regularization
* top-k truncation

---

## Agent workflow for aesthetic construction

### Phase 1: retrieve basis

Load the current canonical vector library.

### Phase 2: choose target

Target can be:

* a named aesthetic to define
* a reference image set
* a user-described look

### Phase 3: infer candidate weights

Use manual or fitting methods to estimate the coordinate vector.

### Phase 4: synthesize a reconstruction profile

Produce a candidate vector profile of the form:

| vector_id             | weight |
| --------------------- | -----: |
| vec_optical_softness  |   0.72 |
| vec_shadow_density    |   0.63 |
| vec_telecine_softness |   0.79 |

### Phase 5: generate and test

Use Grok Imagine to render controlled examples from the coordinate profile.

### Phase 6: compare against target

Evaluate:

* perceptual similarity
* human judgment
* consistency across subjects
* overfitting to one content type

### Phase 7: refine weights

Adjust the coordinate vector and repeat.

### Phase 8: publish

Write a composite aesthetic page and update the weight matrix `W`.

---

## Prompt synthesis from weights

The agent should not dump raw math into the final image prompt.

Instead, it should translate weighted coordinates into structured prompt language.

### Example

If the vector profile has high weights for:

* optical softness
* telecine softness
* practical-material feel

The prompt layer becomes something like:

* soft vintage optical definition
* analog transfer softness
* physically fabricated material response

### Prompt construction rule

Only include vector language for weights above a threshold.

Suggested thresholds:

* `>= 0.70` = dominant phrase
* `0.40 to 0.69` = supporting phrase
* `< 0.40` = omit unless specifically needed

---

## Linear combination example

Suppose a basis set contains:

* (v_1): optical softness
* (v_2): shadow density
* (v_3): telecine softness
* (v_4): chroma density
* (v_5): practical-material feel

Then:

[
a =
0.72v_1 + 0.63v_2 + 0.79v_3 + 0.40v_4 + 0.68v_5
]

This coordinate vector is a compact, interpretable definition of the aesthetic.

---

## Why linear first

Start linear because it gives:

* interpretability
* editability
* sparse profiles
* easy storage
* simple retrieval
* easy comparison between aesthetics

Linear models are good first-order approximations.

They let the system answer:

* Which ingredients matter most?
* Which aesthetics are similar?
* Which vectors are doing the heavy lifting?
* What changes if one coefficient increases?

---

## Why linear is not enough forever

Real visual style is not fully linear.

Some qualities only emerge when two or more vectors interact.

Examples:

* halation is more visible when highlights are strong
* practical-material feel interacts with optical softness
* telecine softness and low microcontrast together produce a stronger analog impression than either alone
* theatrical lighting and miniature-set feel often reinforce each other

That means the richer model will eventually need **interaction terms** and **nonlinear composition**.

---

## Nonlinear extension

### Pairwise interaction model

Add interaction terms for vector pairs.

[
a = B w + \sum_{i<j} h_{ij}(v_i \odot v_j)
]

where:

* (h_{ij}) is the interaction strength
* (v_i \odot v_j) is a joint feature or paired effect

### Quadratic form

A compact view:

[
a = B w + w^T H w
]

where `H` stores pairwise interaction strengths.

### Tensor-product extension

For richer higher-order interactions:

[
a = B w + T(w \otimes w) + U(w \otimes w \otimes w) + \dots
]

where:

* (T) captures second-order interactions
* (U) captures third-order interactions
* (\otimes) is the tensor product

### Practical meaning

This lets the system represent aesthetics where the whole is more than the sum of parts.

---

## Recommended model progression

### Stage 1

Canonical vectors only.
Linear combinations only.

### Stage 2

Add pairwise interaction notes manually.

### Stage 3

Add an explicit interaction matrix `H`.

### Stage 4

Add sparse nonlinear fitting and interaction-aware reconstruction.

### Stage 5

Optional latent-space or manifold methods for higher-dimensional structure.

---

## Similarity between aesthetics

Two composite aesthetics can be compared by distance between their coordinate vectors.

### Common measures

* Euclidean distance
* cosine similarity
* weighted cosine similarity
* Mahalanobis distance if covariance becomes important

This lets the system answer:

* which aesthetics are nearest neighbors
* which vectors distinguish two looks
* how far a generated result deviates from the intended profile

---

## Library outputs needed

The system should maintain:

1. **Canonical basis vector library**
2. **Composite aesthetic library**
3. **Aesthetic weight matrix `W`**
4. **Interaction matrix `H`**
5. **Similarity reports**
6. **Reconstruction studies**
7. **Prompt-construction rules**

---

## Deliverables for each composite aesthetic

Every composite aesthetic page should include:

* canonical name
* aliases
* concise plain-English definition
* basis coordinate vector
* weight table
* dominant vectors
* supporting vectors
* interaction notes
* nearest-neighbor aesthetics
* representative observation set
* reconstruction prompt notes
* confidence
* revision history

---

## Minimum viable agent specification

For each target aesthetic, the agent must:

1. map user language to known vectors and aliases
2. infer an initial weight vector
3. build a candidate composite profile
4. generate test reconstructions
5. score the result against the intended target
6. update weights
7. store the final coordinate vector in `W`
8. publish a markdown page with evidence and notes

---

## Final mission statement

Represent visual style as a compositional system.

First, discover atomic visual basis vectors.

Second, express named aesthetics as **weighted linear combinations** of those vectors.

Third, expand the model with **pairwise interactions, nonlinear terms, and tensor products** when linear combinations alone fail to capture the result.

This gives the agent a framework that is:

* interpretable
* extensible
* machine-usable
* human-readable
* mathematically coherent

The end state is a real style library where both agents and people can move from:

* vague aesthetic labels

to:

* explicit coordinate vectors
* structured reconstructions
* explainable style synthesis

