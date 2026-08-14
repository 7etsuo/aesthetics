# Milestone 03: tone versus light

Date: 2026-08-14

Three studies on the same five locked anchors: a clean shadow-density rerun, black level, and key-to-fill. 45 new observations. `study_shadow_density_001` stays in the library as the contaminated prior. It is not the density column here.

Black-level polarity is lift. High means a raised milky floor, not crush.

## Decisions

| id | study | decision | confidence | why |
| --- | --- | --- | ---: | --- |
| `vec_shadow_density` | `study_shadow_density_002` | provisional | 0.61 | Inks masses with key still on the same side. Cleaner than 001. Napkin recolor leak. |
| `vec_black_level` | `study_black_level_001` | provisional | 0.60 | High lifts the floor. Opposite direction of density. Weak on the teapot. |
| `vec_key_to_fill_ratio` | `study_key_to_fill_ratio_001` | provisional | 0.58 | Portrait sculpts fill off the far cheek. Teapot still hardens into a window. |

None is canonical.

## What separated

Density 002 portrait high inks the sweater and the far cheek. The key is still camera-left. Highlight on the near cheek survives. Density 002 low opens the same face. That is a transferable grade on one lighting.

Black-level portrait high lifts the backdrop and the sweater floor. The face stays. That is the opposite of density high. No new lamps. Polarity held.

Key-to-fill portrait high kills fill on the far cheek and keeps the knit readable. Density high had inked the knit. Those two pictures are the discrimination.

Teapot density 002 high does not invent the handle shadow that 001 invented. The lighting stays nearer to the anchor. The napkin turned black. Content leak, not a restage.

Teapot key-to-fill high does invent the hard window and the handle shadow. That failure now sits on the lighting axis, where it belongs.

## What stayed entangled

Density still drops fill a little on the portrait.

Density object high recolored the napkin. The hold said no new lights. It did not say keep the linen the same color.

Key-to-fill object high is also source hardness. Ratio and hardness still travel together on the still life.

Black-level object high is a small step. The axis is real on the portrait and weaker on the pot.

## High-pole discrimination (agent-visual)

Intended vector × cluster read on portrait and object, then the rest:

| intended | density | black level | key-to-fill |
| --- | --- | --- | --- |
| density 002 | high | low | low-mid |
| black level | low | high (lift) | low |
| key-to-fill | mid | low | high |

Scoring is agent-visual. Some coupling is in the pictures. Some is in the score functions.

## What this does to the basis

The dark cluster is no longer one knob.

- `vec_black_level` stays. High is lift.
- `vec_key_to_fill_ratio` stays. It is lighting.
- `vec_shadow_density` stays, scored from 002. 001 is the failed prior.
- Do not treat crushed blacks as black-level high.

No tensor term. Linear model unchanged.

## Next

1. Honest halation: night interior that already contains lamps.
2. Optical versus telecine.
3. Sequential reconstruction using diffusion, bokeh, and this cleaner density.

Do not harvest more dark-look synonyms.
