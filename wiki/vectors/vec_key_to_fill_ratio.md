# key-to-fill ratio

## Metadata
- id: vec_key_to_fill_ratio
- family: [lighting response](../families/family_lighting_response.md)
- status: provisional
- canonical_name: key-to-fill ratio
- aliases: lighting ratio, contrasty lighting
- opposite_or_low_pole: flat fill
- high_pole: hard unfilled key
- polarity: unipolar
- range: low to high
- confidence: 0.58

## Definition
The lighting contrast between key and fill, a scene-light property.

## Why it matters
Raising the ratio deepens lighting shadows without a required tone-curve change.

## Observable effects
- fill rises or dies
- lighting-shadow shape deepens
- key side stays the same

## Nearby vectors
- [shadow density](vec_shadow_density.md)
- [source hardness](vec_source_hardness.md)
- [black level](vec_black_level.md)

## Not the same as
- [vec_black_level](vec_black_level.md): Black level is the floor. Ratio is lighting contrast.
- [vec_shadow_density](vec_shadow_density.md): Ratio is how the scene is lit. Density can be a grade on the same lighting.
- [vec_source_hardness](vec_source_hardness.md): Hardness is the shadow-edge transfer. Ratio is fill strength versus key.

## Controlled studies
- [study_key_to_fill_ratio_001](../studies/study_key_to_fill_ratio_001.md)

## Evidence images
- [obs_0131](../observations/obs_0131.md)
- [obs_0132](../observations/obs_0132.md)
- [obs_0133](../observations/obs_0133.md)
- [obs_0134](../observations/obs_0134.md)
- [obs_0135](../observations/obs_0135.md)
- [obs_0136](../observations/obs_0136.md)
- [obs_0137](../observations/obs_0137.md)
- [obs_0138](../observations/obs_0138.md)
- [obs_0139](../observations/obs_0139.md)
- [obs_0140](../observations/obs_0140.md)
- [obs_0141](../observations/obs_0141.md)
- [obs_0142](../observations/obs_0142.md)
- [obs_0143](../observations/obs_0143.md)
- [obs_0144](../observations/obs_0144.md)
- [obs_0145](../observations/obs_0145.md)

## Scoring guidance
0.00 flat fill, 0.50 natural ratio, 1.00 unfilled key.

## Prompt phrases
- low: strong fill, flat lighting ratio, key still from the same side
- medium: naturalistic key-to-fill, same key direction
- high: weak fill, high key-to-fill ratio, key still from the same side, no new lamps

## Open questions
- Can ratio rise on the teapot without a new hard window?
