# film emulation

## Metadata
- id: aes_film_emulation
- status: composite
- aliases: film emulation, filmic
- confidence: 0.24
- revision: 1

## Definition
Usually a finishing-layer stand-in for photochemical behavior. Incomplete unless capture and optics are specified.

## Coordinate profile
Linear first-order model: a = sum w_i v_i. Nonlinear terms are not used until evidence requires them.

## Weight table
| vector_id | weight | hypothesized |
|---|---:|:---:|
| [highlight roll-off](../vectors/vec_highlight_rolloff.md) | 0.60 | true |
| [grain structure](../vectors/vec_grain_structure.md) | 0.55 | true |
| [chroma density](../vectors/vec_chroma_density.md) | 0.45 | true |
| [halation](../vectors/vec_halation.md) | 0.30 | true |

## Interaction notes
- none recorded

## Nearest-neighbor aesthetics
- [1980s fantasy television](aes_80s_fantasy_tv.md) (cosine 0.169)
- [soft halated shadow](aes_soft_halated_shadow.md) (cosine 0.149)
- [analog (unresolved)](aes_analog_generic.md) (cosine 0.000)
- [cinematic (unresolved)](aes_cinematic_generic.md) (cosine 0.000)
- [VHS look](aes_vhs_look.md) (cosine 0.000)

## Example references
- none yet

## Reconstruction notes
No reconstruction notes.
