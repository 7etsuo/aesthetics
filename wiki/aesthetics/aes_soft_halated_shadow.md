# soft halated shadow

## Metadata
- id: aes_soft_halated_shadow
- status: composite
- aliases: soft shadowed glow, diffused night still
- confidence: 0.56
- revision: 1

## Definition
A first-order composite built only from the three studied vectors: optical softness, shadow density, and halation.

## Coordinate profile
Linear first-order model: a = sum w_i v_i. Nonlinear terms are not used until evidence requires them.

## Weight table
| vector_id | weight | hypothesized |
|---|---:|:---:|
| [optical softness](../vectors/vec_optical_softness.md) | 0.78 | false |
| [shadow density](../vectors/vec_shadow_density.md) | 0.70 | false |
| [halation](../vectors/vec_halation.md) | 0.58 | false |

## Interaction notes
- Halation becomes more visible once highlights survive; dense shadows can hide it.
- Optical softness and halation often co-move in Imagine edits.

## Nearest-neighbor aesthetics
- [1980s fantasy television](aes_80s_fantasy_tv.md) (cosine 0.566)
- [film emulation](aes_film_emulation.md) (cosine 0.149)
- [analog (unresolved)](aes_analog_generic.md) (cosine 0.000)
- [cinematic (unresolved)](aes_cinematic_generic.md) (cosine 0.000)
- [VHS look](aes_vhs_look.md) (cosine 0.000)

## Example references
- [obs_0051](../observations/obs_0051.md)
- [obs_0052](../observations/obs_0052.md)
- [obs_0053](../observations/obs_0053.md)
- [obs_0054](../observations/obs_0054.md)
- [obs_0055](../observations/obs_0055.md)

## Reconstruction notes
Preserve subject and framing. Raise optical softness and shadow density as dominant phrases. Add supporting halation. Do not mention cinematic, vintage, or analog.
