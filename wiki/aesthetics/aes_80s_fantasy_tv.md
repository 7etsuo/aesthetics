# 1980s fantasy television

## Metadata
- id: aes_80s_fantasy_tv
- status: composite
- aliases: 1980s fantasy, 80s fantasy TV look, 80s fantasy
- confidence: 0.34
- revision: 1

## Definition
A named production look, not an atom. Hypothesized mixture of optical softness, telecine transfer, dense shadows, restrained chroma separation, practical materials, and theatrical lighting. Several weights remain untested.

## Coordinate profile
Linear first-order model: a = sum w_i v_i. Nonlinear terms are not used until evidence requires them.

## Weight table
| vector_id | weight | hypothesized |
|---|---:|:---:|
| [telecine softness](../vectors/vec_telecine_softness.md) | 0.79 | true |
| [optical softness](../vectors/vec_optical_softness.md) | 0.72 | true |
| [practical-material feel](../vectors/vec_practical_material_feel.md) | 0.68 | true |
| [shadow density](../vectors/vec_shadow_density.md) | 0.63 | true |
| [key-to-fill ratio](../vectors/vec_key_to_fill_ratio.md) | 0.58 | true |
| [theatrical blocking](../vectors/vec_theatrical_blocking.md) | 0.52 | true |
| [miniature-set feel](../vectors/vec_miniature_set_feel.md) | 0.46 | true |
| [halation](../vectors/vec_halation.md) | 0.41 | true |
| [chroma density](../vectors/vec_chroma_density.md) | 0.40 | true |
| [color separation](../vectors/vec_color_separation.md) | 0.35 | true |
| [microcontrast](../vectors/vec_microcontrast.md) | 0.28 | true |

## Interaction notes
- Telecine softness plus low microcontrast may read more analog than either alone.
- Practical materials become more legible when optical softness is moderate, not extreme.

## Nearest-neighbor aesthetics
- [soft halated shadow](aes_soft_halated_shadow.md) (cosine 0.566)
- [film emulation](aes_film_emulation.md) (cosine 0.169)
- [VHS look](aes_vhs_look.md) (cosine 0.046)
- [analog (unresolved)](aes_analog_generic.md) (cosine 0.000)
- [cinematic (unresolved)](aes_cinematic_generic.md) (cosine 0.000)

## Example references
- none yet

## Reconstruction notes
Do not prompt 80s fantasy as a lump. Translate dominant hypothesized weights into tested phrases where they exist, and mark untested weights as hypotheses.
