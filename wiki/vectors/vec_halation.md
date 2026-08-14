# halation

## Metadata
- id: vec_halation
- family: [optical character](../families/family_optical_character.md)
- status: provisional
- canonical_name: halation
- aliases: highlight bleed, red-edge glow, film halation
- opposite_or_low_pole: clean unbled highlights
- high_pole: strong highlight bleed
- polarity: unipolar
- range: low to high
- confidence: 0.68

## Definition
A spatial bleed of light, often warm or reddish, around bright sources into adjacent darker areas.

## Why it matters
Increasing only halation should make bright edges glow and leak into neighboring darks without a required global softness or grade change.

## Observable effects
- lamps and catchlights grow a halo
- bright edges leak into adjacent darks
- halo is often warmer than the source

## Nearby vectors
- [highlight bloom](vec_highlight_bloom.md)
- [highlight roll-off](vec_highlight_rolloff.md)
- [optical softness](vec_optical_softness.md)
- [veiling glare](vec_veiling_glare.md)
- [final bloom](vec_final_bloom.md)

## Not the same as
- [vec_final_bloom](vec_final_bloom.md): Finishing bloom is a grade/filter layer. Halation is the optical or film-base phenomenon.
- [vec_highlight_bloom](vec_highlight_bloom.md): Bloom is a general glow. Halation is a more local, often reddish, bleed around speculars and lamps.
- [vec_optical_softness](vec_optical_softness.md): Softness melts the whole image. Halation can sit on an otherwise sharper picture.
- [vec_veiling_glare](vec_veiling_glare.md): Glare is a global contrast-lowering haze. Halation is local to bright features.

## Controlled studies
- [study_halation_001](../studies/study_halation_001.md)
- [study_halation_002](../studies/study_halation_002.md)

## Evidence images
- [obs_0036](../observations/obs_0036.md)
- [obs_0037](../observations/obs_0037.md)
- [obs_0038](../observations/obs_0038.md)
- [obs_0039](../observations/obs_0039.md)
- [obs_0040](../observations/obs_0040.md)
- [obs_0041](../observations/obs_0041.md)
- [obs_0042](../observations/obs_0042.md)
- [obs_0043](../observations/obs_0043.md)
- [obs_0044](../observations/obs_0044.md)
- [obs_0045](../observations/obs_0045.md)
- [obs_0046](../observations/obs_0046.md)
- [obs_0047](../observations/obs_0047.md)
- [obs_0048](../observations/obs_0048.md)
- [obs_0049](../observations/obs_0049.md)
- [obs_0050](../observations/obs_0050.md)
- [obs_0151](../observations/obs_0151.md)
- [obs_0152](../observations/obs_0152.md)
- [obs_0153](../observations/obs_0153.md)
- [obs_0154](../observations/obs_0154.md)
- [obs_0155](../observations/obs_0155.md)
- [obs_0156](../observations/obs_0156.md)
- [obs_0157](../observations/obs_0157.md)
- [obs_0158](../observations/obs_0158.md)
- [obs_0159](../observations/obs_0159.md)
- [obs_0160](../observations/obs_0160.md)
- [obs_0161](../observations/obs_0161.md)
- [obs_0162](../observations/obs_0162.md)
- [obs_0163](../observations/obs_0163.md)
- [obs_0164](../observations/obs_0164.md)
- [obs_0165](../observations/obs_0165.md)

## Scoring guidance
0.00 no bleed, 0.50 mild local glow, 1.00 strong colored or bright leak.

## Prompt phrases
- low: clean existing lamp edges, no bleed into adjacent darks, no new lights
- medium: mild warm local bleed around existing lamps only, lamps stay in place
- high: strong film-like halation, warm or reddish leak from existing lamps into neighboring darks only, no new lamps

## Open questions
- Is the leftover far-edge red wash bloom, grade, or a second bleed?
