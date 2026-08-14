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
- confidence: 0.61

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
- [study_shadow_density_002](../studies/study_shadow_density_002.md)

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
- [obs_0101](../observations/obs_0101.md)
- [obs_0102](../observations/obs_0102.md)
- [obs_0103](../observations/obs_0103.md)
- [obs_0104](../observations/obs_0104.md)
- [obs_0105](../observations/obs_0105.md)
- [obs_0106](../observations/obs_0106.md)
- [obs_0107](../observations/obs_0107.md)
- [obs_0108](../observations/obs_0108.md)
- [obs_0109](../observations/obs_0109.md)
- [obs_0110](../observations/obs_0110.md)
- [obs_0111](../observations/obs_0111.md)
- [obs_0112](../observations/obs_0112.md)
- [obs_0113](../observations/obs_0113.md)
- [obs_0114](../observations/obs_0114.md)
- [obs_0115](../observations/obs_0115.md)

## Scoring guidance
0.00 open, 0.50 natural, 1.00 crushed murky shadow mass.

## Prompt phrases
- low: open readable shadow interiors, same key, same highlight cores
- medium: naturalistic shadow mass, same lighting as the source
- high: heavy inky shadow mass in recesses and dark cloth only, keep highlight cores, no new lights

## Open questions
- Can object density rise without recoloring props?
- How much fill drop is allowed before this is key-to-fill?
