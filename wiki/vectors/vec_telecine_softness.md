# telecine softness

## Metadata
- id: vec_telecine_softness
- family: [capture and transfer](../families/family_capture_and_transfer.md)
- status: provisional
- canonical_name: telecine softness
- aliases: old-tv softness, film-to-tape softness, telecine smear
- opposite_or_low_pole: no transfer smear
- high_pole: heavy telecine smear
- polarity: unipolar
- range: low to high
- confidence: 0.56

## Definition
A flat, slightly smeared softness associated with film-to-video transfer, often with reduced fine detail and mild chroma smear.

## Why it matters
Increasing telecine softness should look like transfer bandwidth loss, not like a portrait diffusion filter.

## Observable effects
- fine detail smears flat
- edges lose bandwidth not bite
- mild chroma smear
- image reads transferred, not lens-diffused

## Nearby vectors
- [optical softness](vec_optical_softness.md)
- [VHS bandwidth loss](vec_vhs_bandwidth_loss.md)
- [fine-detail roll-off](vec_fine_detail_rolloff.md)
- [analog video texture](vec_analog_video_texture.md)

## Not the same as
- [vec_analog_video_texture](vec_analog_video_texture.md): Texture is scan grain and chroma crawl. Telecine is bandwidth loss without a required texture field.
- [vec_optical_softness](vec_optical_softness.md): Optical softness is lens-like melt of pores and highlight cores. Telecine is flatter, more electronic smear.
- [vec_vhs_bandwidth_loss](vec_vhs_bandwidth_loss.md): VHS loss is consumer-tape chroma collapse. Telecine is a film-to-tape transfer smear.

## Controlled studies
- [study_telecine_softness_001](../studies/study_telecine_softness_001.md)

## Evidence images
- [obs_0181](../observations/obs_0181.md)
- [obs_0182](../observations/obs_0182.md)
- [obs_0183](../observations/obs_0183.md)
- [obs_0184](../observations/obs_0184.md)
- [obs_0185](../observations/obs_0185.md)
- [obs_0191](../observations/obs_0191.md)
- [obs_0192](../observations/obs_0192.md)
- [obs_0193](../observations/obs_0193.md)
- [obs_0194](../observations/obs_0194.md)
- [obs_0195](../observations/obs_0195.md)
- [obs_0201](../observations/obs_0201.md)
- [obs_0202](../observations/obs_0202.md)
- [obs_0203](../observations/obs_0203.md)
- [obs_0204](../observations/obs_0204.md)
- [obs_0205](../observations/obs_0205.md)

## Scoring guidance
0.00 full bandwidth, 0.50 mild transfer smear, 1.00 heavy flat telecine smear.

## Prompt phrases
- low: full transfer bandwidth, no film-to-tape smear, fine detail intact, no chroma smear
- medium: mild film-to-tape transfer smear, slightly reduced fine detail, slight chroma softness
- high: heavy telecine transfer smear, flat electronic softness, fine detail lost to bandwidth, mild chroma smear across edges, still a photograph

## Open questions
- Can object high be raised without becoming optical melt?
- How much of the gallery chroma fringe is VHS bandwidth rather than telecine?
