# bokeh softness

## Metadata
- id: vec_bokeh_softness
- family: [optical character](../families/family_optical_character.md)
- status: provisional
- canonical_name: bokeh softness
- aliases: none
- opposite_or_low_pole: hard nervous bokeh
- high_pole: creamy soft bokeh
- polarity: unipolar
- range: low to high
- confidence: 0.62

## Definition
How smoothly out-of-focus areas dissolve while the focus plane stays sharp.

## Why it matters
Raising bokeh softness should melt only the out-of-focus field. The subject plane stays sharp. No disks on in-focus surfaces.

## Observable effects
- background disks cream out
- busy out-of-focus edges melt
- in-focus subject stays sharp

## Nearby vectors
- [optical softness](vec_optical_softness.md)
- [edge softness](vec_edge_softness.md)
- [focal-length feel](vec_focal_length_feel.md)

## Not the same as
- [vec_edge_softness](vec_edge_softness.md): Edge softness is contour width on the subject. Bokeh is background dissolve.
- [vec_optical_softness](vec_optical_softness.md): Optical softness melts the whole image. Bokeh softness is only the defocused field.

## Controlled studies
- [study_bokeh_softness_001](../studies/study_bokeh_softness_001.md)

## Evidence images
- [obs_0086](../observations/obs_0086.md)
- [obs_0087](../observations/obs_0087.md)
- [obs_0088](../observations/obs_0088.md)
- [obs_0089](../observations/obs_0089.md)
- [obs_0090](../observations/obs_0090.md)
- [obs_0091](../observations/obs_0091.md)
- [obs_0092](../observations/obs_0092.md)
- [obs_0093](../observations/obs_0093.md)
- [obs_0094](../observations/obs_0094.md)
- [obs_0095](../observations/obs_0095.md)
- [obs_0096](../observations/obs_0096.md)
- [obs_0097](../observations/obs_0097.md)
- [obs_0098](../observations/obs_0098.md)
- [obs_0099](../observations/obs_0099.md)
- [obs_0100](../observations/obs_0100.md)

## Scoring guidance
0.00 hard busy bokeh, 0.50 moderate cream, 1.00 fully dissolved field with sharp subject.

## Prompt phrases
- low: hard, nervous out-of-focus field, busy background edges, subject plane sharp
- medium: moderately creamy background dissolve, subject plane still sharp
- high: very creamy bokeh, out-of-focus field fully dissolved, keep the subject plane sharp, no blur disks on in-focus surfaces

## Open questions
- Should architecture be excluded from bokeh tests, or is failure itself evidence?
