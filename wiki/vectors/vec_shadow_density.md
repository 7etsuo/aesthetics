# shadow density

## Metadata
- id: vec_shadow_density
- family: [tonal response](../families/family_tonal_response.md)
- status: provisional
- canonical_name: shadow density
- aliases: murky shadows, dense shadows, inky shadows, open shadows
- opposite_or_low_pole: open shadows with readable detail
- high_pole: murky, dense, inked shadows
- polarity: unipolar
- range: low to high
- confidence: 0.58

## Definition
How heavy, inky, or open the shadow masses are, independent of highlight behavior.

## Why it matters
Increasing shadow density darkens and fills shadow masses while subject, key direction, and highlight structure stay fixed.

## Observable effects
- shadow masses fill or open
- dark clothing and recesses gain or lose interior detail
- midtones may stay closer to constant than in a contrast sweep

## Nearby vectors
- [black level](vec_black_level.md)
- [global contrast](vec_global_contrast.md)
- [key-to-fill ratio](vec_key_to_fill_ratio.md)
- [dynamic range compression](vec_dynamic_range_compression.md)

## Not the same as
- [vec_black_level](vec_black_level.md): Black level is the floor. Shadow density is the mass of the darks.
- [vec_global_contrast](vec_global_contrast.md): Global contrast moves lights and darks together. Shadow density targets the darks.
- [vec_key_to_fill_ratio](vec_key_to_fill_ratio.md): Lighting ratio is a scene lighting change. Shadow density can be a tone-mapping change on the same lighting.

## Controlled studies
- [study_shadow_density_001](../studies/study_shadow_density_001.md)

## Evidence images
- [obs_0021](../observations/obs_0021.md)
- [obs_0022](../observations/obs_0022.md)
- [obs_0023](../observations/obs_0023.md)
- [obs_0024](../observations/obs_0024.md)
- [obs_0025](../observations/obs_0025.md)
- [obs_0026](../observations/obs_0026.md)
- [obs_0027](../observations/obs_0027.md)
- [obs_0028](../observations/obs_0028.md)
- [obs_0029](../observations/obs_0029.md)
- [obs_0030](../observations/obs_0030.md)
- [obs_0031](../observations/obs_0031.md)
- [obs_0032](../observations/obs_0032.md)
- [obs_0033](../observations/obs_0033.md)
- [obs_0034](../observations/obs_0034.md)
- [obs_0035](../observations/obs_0035.md)

## Scoring guidance
0.00 open, 0.50 natural, 1.00 crushed murky shadow mass.

## Prompt phrases
- low: open, readable shadows with visible interior detail
- medium: naturalistic shadow density
- high: heavy inky shadow density, murky recesses, compressed shadow detail

## Open questions
- Can density move with lighting ratio held?
- Where does black level end and shadow density begin on these anchors?
