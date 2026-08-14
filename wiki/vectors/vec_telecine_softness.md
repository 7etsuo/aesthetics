# telecine softness

## Metadata
- id: vec_telecine_softness
- family: [capture and transfer](../families/family_capture_and_transfer.md)
- status: candidate
- canonical_name: telecine softness
- aliases: old-tv softness, film-to-tape softness, telecine smear
- opposite_or_low_pole: no transfer smear
- high_pole: heavy telecine smear
- polarity: unipolar
- range: low to high
- confidence: 0.22

## Definition
A flat, slightly smeared softness associated with film-to-video transfer, often with reduced fine detail and mild chroma smear.

## Why it matters
Increasing telecine softness should look like transfer bandwidth loss, not like a portrait diffusion filter.

## Observable effects
- not yet observed

## Nearby vectors
- [optical softness](vec_optical_softness.md)
- [VHS bandwidth loss](vec_vhs_bandwidth_loss.md)
- [fine-detail roll-off](vec_fine_detail_rolloff.md)
- [analog video texture](vec_analog_video_texture.md)

## Not the same as
- [vec_optical_softness](vec_optical_softness.md): Optical softness is lens-like. Telecine softness is flatter and more electronic.

## Controlled studies
- none

## Evidence images
- none

## Scoring guidance
0.00 absent, 0.50 moderate, 1.00 dominant.

## Prompt phrases
- low: n/a
- medium: n/a
- high: n/a

## Open questions
- Needs a controlled study against optical softness and VHS bandwidth loss.
