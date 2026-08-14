# VHS look

## Metadata
- id: aes_vhs_look
- status: system
- aliases: VHS
- confidence: 0.28
- revision: 1

## Definition
A capture and transfer system. Decompose into bandwidth loss, analog video texture, chroma smear, and CRT bloom.

## Coordinate profile
Linear first-order model: a = sum w_i v_i. Nonlinear terms are not used until evidence requires them.

## Weight table
| vector_id | weight | hypothesized |
|---|---:|:---:|
| [VHS bandwidth loss](../vectors/vec_vhs_bandwidth_loss.md) | 0.82 | true |
| [analog video texture](../vectors/vec_analog_video_texture.md) | 0.74 | true |
| [CRT bloom feel](../vectors/vec_crt_bloom_feel.md) | 0.48 | true |
| [color separation](../vectors/vec_color_separation.md) | 0.30 | true |

## Interaction notes
- none recorded

## Nearest-neighbor aesthetics
- [1980s fantasy television](aes_80s_fantasy_tv.md) (cosine 0.046)
- [analog (unresolved)](aes_analog_generic.md) (cosine 0.000)
- [cinematic (unresolved)](aes_cinematic_generic.md) (cosine 0.000)
- [film emulation](aes_film_emulation.md) (cosine 0.000)
- [soft halated shadow](aes_soft_halated_shadow.md) (cosine 0.000)

## Example references
- none yet

## Reconstruction notes
No reconstruction notes.
