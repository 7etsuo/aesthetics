# analog video texture

## Metadata
- id: vec_analog_video_texture
- family: [texture and noise](../families/family_texture_and_noise.md)
- status: provisional
- canonical_name: analog video texture
- aliases: VHS texture, tape texture, tube texture
- opposite_or_low_pole: clean digital field
- high_pole: heavy analog video texture
- polarity: unipolar
- range: low to high
- confidence: 0.63

## Definition
The specific instability of analog video: chroma crawl, luma grain, mild banding, scan-like texture.

## Why it matters
Raising it should read as tape or tube texture, not as film grain.

## Observable effects
- scan-like luma grain
- chroma crawl on edges
- mild banding

## Nearby vectors
- [VHS bandwidth loss](vec_vhs_bandwidth_loss.md)
- [CRT bloom feel](vec_crt_bloom_feel.md)
- [grain structure](vec_grain_structure.md)
- [telecine softness](vec_telecine_softness.md)

## Not the same as
- [vec_grain_structure](vec_grain_structure.md): Film grain clumps. Analog video texture is scan-like and often chroma-noisy.
- [vec_telecine_softness](vec_telecine_softness.md): Telecine is bandwidth smear. This is a texture field, not a softness.
- [vec_vhs_bandwidth_loss](vec_vhs_bandwidth_loss.md): Bandwidth loss smears chroma and luma. Texture is the crawl and scan grain.

## Controlled studies
- [study_analog_video_texture_001](../studies/study_analog_video_texture_001.md)

## Evidence images
- [obs_0186](../observations/obs_0186.md)
- [obs_0187](../observations/obs_0187.md)
- [obs_0188](../observations/obs_0188.md)
- [obs_0189](../observations/obs_0189.md)
- [obs_0190](../observations/obs_0190.md)
- [obs_0196](../observations/obs_0196.md)
- [obs_0197](../observations/obs_0197.md)
- [obs_0198](../observations/obs_0198.md)
- [obs_0199](../observations/obs_0199.md)
- [obs_0200](../observations/obs_0200.md)
- [obs_0206](../observations/obs_0206.md)
- [obs_0207](../observations/obs_0207.md)
- [obs_0208](../observations/obs_0208.md)
- [obs_0209](../observations/obs_0209.md)
- [obs_0210](../observations/obs_0210.md)

## Scoring guidance
0.00 clean digital, 0.50 mild crawl, 1.00 heavy tape/tube texture.

## Prompt phrases
- low: clean digital field, no scan texture, no chroma crawl, no tape grain
- medium: mild analog video texture, faint scan-like grain, slight chroma crawl, keep subject edges
- high: heavy analog video texture, visible scan-like luma grain, chroma crawl, mild banding, keep subject edges, no extra lens melt

## Open questions
- Can texture land on the fox without a letterbox?
