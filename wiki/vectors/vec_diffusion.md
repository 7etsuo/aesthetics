# diffusion

## Metadata
- id: vec_diffusion
- family: [optical character](../families/family_optical_character.md)
- status: provisional
- canonical_name: diffusion
- aliases: none
- opposite_or_low_pole: no diffusion veil
- high_pole: heavy diffusion veil
- polarity: unipolar
- range: low to high
- confidence: 0.67

## Definition
A scattering layer that veils the image, often from filters or atmosphere.

## Why it matters
Increasing diffusion adds a veil and lifts contrast slightly while edge width stays closer to the source than in an optical-softness sweep.

## Observable effects
- whites and midtones gain a veil
- contrast lowers slightly
- lights spread into a mist

## Nearby vectors
- [optical softness](vec_optical_softness.md)
- [veiling glare](vec_veiling_glare.md)
- [atmospheric haze response](vec_atmospheric_haze_response.md)
- [edge softness](vec_edge_softness.md)

## Not the same as
- [vec_edge_softness](vec_edge_softness.md): Edge softness is contour width. Diffusion is a field veil.
- [vec_optical_softness](vec_optical_softness.md): Optical softness melts definition. Diffusion is a scattering veil that can sit on still-edged forms.
- [vec_veiling_glare](vec_veiling_glare.md): Veiling glare is internal lens scatter that fogs blacks. Diffusion is a filter or atmosphere layer.

## Controlled studies
- [study_diffusion_001](../studies/study_diffusion_001.md)

## Evidence images
- [obs_0071](../observations/obs_0071.md)
- [obs_0072](../observations/obs_0072.md)
- [obs_0073](../observations/obs_0073.md)
- [obs_0074](../observations/obs_0074.md)
- [obs_0075](../observations/obs_0075.md)
- [obs_0076](../observations/obs_0076.md)
- [obs_0077](../observations/obs_0077.md)
- [obs_0078](../observations/obs_0078.md)
- [obs_0079](../observations/obs_0079.md)
- [obs_0080](../observations/obs_0080.md)
- [obs_0081](../observations/obs_0081.md)
- [obs_0082](../observations/obs_0082.md)
- [obs_0083](../observations/obs_0083.md)
- [obs_0084](../observations/obs_0084.md)
- [obs_0085](../observations/obs_0085.md)

## Scoring guidance
0.00 no veil, 0.50 mild filter, 1.00 heavy scattering veil.

## Prompt phrases
- low: clear air, no diffusion filter, no atmospheric veil
- medium: mild diffusion filter, slight scattering veil, modest contrast lift in the blacks
- high: heavy diffusion veil, strong scattering mist, lights bloom into haze, keep subject edges closer to the source than a defocus

## Open questions
- How much of the high pole is atmospheric haze rather than a filter veil?
