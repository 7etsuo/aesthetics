# Milestone 01: vertical slice

Date: 2026-08-13

This report covers the first working library: schemas, registries, Imagine studies, matrices, wiki, and one linear reconstruction.

## What was built

- 88 candidate vectors across 12 provisional families
- 36 alias / vague / composite mappings
- 7 named aesthetics, including one reconstructed profile and several rejected lumps (`cinematic`, `vintage`, `analog`)
- 5 locked anchors: portrait, object, architecture, landscape, stylized creature
- 3 controlled vector studies, each 5 subjects x 3 levels
- 1 linear reconstruction of `aes_soft_halated_shadow` on all five anchors
- 55 scored observations
- Generated Markdown wiki in `wiki/`
- Searchable HTML lab in `site/`
- Agent CLI: `map`, `profile`, `reconstruct`, `compare`, `explain`, `next`, `query`

Grok Imagine does not expose a seed. Control is the locked source still plus `image_edit`. That limitation is stored on every job as `seed_control: unavailable`.

## Decisions

None of the three studied terms is canonical yet.

| id | decision | confidence | why |
| --- | --- | --- | --- |
| `vec_optical_softness` | provisional | 0.63 | Low vs high is visible on every subject. High often adds bloom, fake bokeh, or glowing speculars. |
| `vec_shadow_density` | provisional | 0.58 | Darks get heavier, but Imagine often restages lighting to do it. |
| `vec_halation` | provisional | 0.49 | A glow appears, usually as invented rim light, sunset, or silhouette aura, not film-base bleed. |

`cinematic`, `vintage`, `analog`, and `1980s fantasy` stay out of the vector table. They map to vague or composite records.

## What worked

Subject lock via `image_edit` is good enough to run the protocol. Pose, wardrobe, teapot, gallery, fox, and cliff survive most edits.

Optical softness is the most transferable of the three. Portrait high melts knit and hair without changing identity. Architecture high spreads the skylight and softens stone joints. The low pole stays clinically sharp.

Shadow density is directional. Portrait high crushes the backdrop and the unlit cheek. Landscape high inks the cliff while the sky stays. Architecture high darkens the room around a still-bright skylight.

Halation is at least promptable. Architecture high is the best local result: warm bleed from the skylight into the ceiling. Object and portrait high produce a visible glow, even if the mechanism is wrong.

The linear reconstruction moved every anchor toward the intended mixture without using the words cinematic, vintage, analog, or 1980s. That is the point of the first-order model: `a = 0.78 optical_softness + 0.70 shadow_density + 0.58 halation`.

Comparison grids assembled in code (not Imagine) make the three-stop rows inspectable.

## What stayed entangled

Optical softness at high is not a single axis in this instrument:

- Teapot high grew circular bloom orbs on the pot body.
- Fox high turned glass eyes into lamps.
- Landscape high looks like tilt-shift / shallow focus plus invented sun glints.
- Medium is a weak step. Most mediums sit too close to the anchors.

Shadow density is mixed with lighting:

- Teapot high grew a hard window-like key and a new handle shadow on the napkin.
- Portrait high removed fill. That is key-to-fill, not only a tone curve.
- Low sometimes flattens lighting instead of lifting only the toe.

Halation is mixed with bloom and invented light:

- Portrait high put a warm halo on the hairline, like a rim light that was not in the anchor.
- Landscape high became a sunset.
- Fox high added a backlight.
- True red-edge film bleed around existing speculars was not cleanly produced.

Reconstruction residuals:

- Softness often overshoots into whole-frame defocus (gallery).
- Shadow density under-expresses versus its isolated high pole.
- Bloom / glowing eyes come along for the ride.

These are pairwise interaction notes, not a reason to add tensor terms yet. The linear model is incomplete and still the right first model.

## Correlation caveat

`data/vector_correlation_matrix.csv` shows strong pairs:

- optical softness ~ edge softness (0.97)
- optical softness ~ diffusion (0.93)
- optical softness ~ microcontrast (-0.95)
- shadow density ~ black level (0.92)
- halation ~ highlight bloom (0.89)

Treat these as mixed evidence. Some of the coupling is real in the pictures. Some is built into the scoring functions, which lower microcontrast when softness rises and raise bloom when glow is visible. Do not read the matrix as an independent psychometric result.

## Reconstruction scores

Target: `aes_soft_halated_shadow`

| observation | anchor | score | residual |
| --- | --- | ---: | --- |
| obs_0053 | portrait | 0.62 | bloom |
| obs_0055 | landscape | 0.54 | bloom |
| obs_0052 | object | 0.52 | bloom, weak density |
| obs_0054 | architecture | 0.50 | over-softness, orbs |
| obs_0051 | character | 0.48 | glowing eyes |

Mean reconstruction score: 0.53. Usable first-order control. Not a locked look.

## What the instrument taught

Imagine will change extra dimensions to satisfy a single phrase. That is useful data, not a failed run. The library should keep recording unintended changes as first-class fields.

A scene with no lamps cannot show honest halation. The next halation study needs practicals already in the frame.

A still-life with a hard glaze invites the model to invent bokeh discs when asked for softness. Prompt language has to forbid discs, not only mention softness.

## Experiments to run next

1. Optical softness vs edge softness vs diffusion vs bokeh softness on the same five anchors.
2. Shadow density vs key-to-fill vs black level, with an explicit hold on key and fill.
3. Halation on a night interior that already contains lamps. Compare to highlight bloom and final bloom.
4. Optical softness vs telecine softness. This is the main alias risk for "old TV" language.
5. Sequential reconstruction: apply softness, then density, then halation, instead of all three at once.
6. Add a 0.65 step. The current medium stop is too close to the anchors.

Do not promote any of the three vectors to canonical until the discrimination studies exist.

## How to browse

```bash
PYTHONPATH=src python3 -m vslib serve --port 8765
```

Or open `site/index.html`. Markdown pages live under `wiki/`. Machine tables live under `data/`.
