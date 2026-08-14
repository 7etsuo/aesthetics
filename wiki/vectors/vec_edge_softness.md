# edge softness

## Metadata
- id: vec_edge_softness
- family: [spatial definition](../families/family_spatial_definition.md)
- status: provisional
- canonical_name: edge softness
- aliases: soft edges, edge melt
- opposite_or_low_pole: hard razor edges
- high_pole: melted wide edges
- polarity: unipolar
- range: low to high
- confidence: 0.36

## Definition
Width and melt of edges, independent of highlight glow.

## Why it matters
Increasing edge softness thickens and dissolves contours without requiring a veil, highlight spread, or background disk melt.

## Observable effects
- contours thicken
- hair and fabric edges lose snap
- highlight cores stay relatively tight

## Nearby vectors
- [optical softness](vec_optical_softness.md)
- [fine-detail roll-off](vec_fine_detail_rolloff.md)
- [acutance](vec_acutance.md)
- [diffusion](vec_diffusion.md)
- [bokeh softness](vec_bokeh_softness.md)

## Not the same as
- [vec_bokeh_softness](vec_bokeh_softness.md): Bokeh softness is the out-of-focus field. Edge softness can sit on an in-focus subject.
- [vec_diffusion](vec_diffusion.md): Diffusion is a veil over the whole field. Edge softness is contour width.
- [vec_optical_softness](vec_optical_softness.md): Optical softness includes highlight spread and micro-detail melt, not only edge width.

## Controlled studies
- [study_edge_softness_001](../studies/study_edge_softness_001.md)

## Evidence images
- [obs_0056](../observations/obs_0056.md)
- [obs_0057](../observations/obs_0057.md)
- [obs_0058](../observations/obs_0058.md)
- [obs_0059](../observations/obs_0059.md)
- [obs_0060](../observations/obs_0060.md)
- [obs_0061](../observations/obs_0061.md)
- [obs_0062](../observations/obs_0062.md)
- [obs_0063](../observations/obs_0063.md)
- [obs_0064](../observations/obs_0064.md)
- [obs_0065](../observations/obs_0065.md)
- [obs_0066](../observations/obs_0066.md)
- [obs_0067](../observations/obs_0067.md)
- [obs_0068](../observations/obs_0068.md)
- [obs_0069](../observations/obs_0069.md)
- [obs_0070](../observations/obs_0070.md)

## Scoring guidance
0.00 razor edges, 0.50 mild contour melt, 1.00 wide melted outlines.

## Prompt phrases
- low: razor-hard contours, high acutance, no edge melt, tight subject outline
- medium: slightly widened edges, mild contour melt, highlight cores still tight
- high: heavy edge softness only: wide melted contours, dissolved outlines, highlight cores remain tight, no haze

## Open questions
- Is there any prompt that thickens contours without defocusing the subject?
