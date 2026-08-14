# Milestone 04: honest halation

Date: 2026-08-14

`study_halation_001` failed because the original anchors barely contained lamps. Imagine invented rims, sunsets, and glowing eyes.

This campaign built five night stills that already have practicals, then swept `vec_halation` and `vec_highlight_bloom` on those stills. 5 lamp anchors + 30 edits. 001 stays as the contaminated prior.

## Decisions

| id | study | decision | confidence | why |
| --- | --- | --- | ---: | --- |
| `vec_halation` | `study_halation_002` | provisional | 0.68 | Red/warm leak from existing lamps. No invented sun. Distinct from bloom. |
| `vec_highlight_bloom` | `study_highlight_bloom_001` | provisional | 0.64 | Pale broader glow on the same lamps. Not a red lip. |

None is canonical. Honest bleed requires lamps already in the frame.

## What separated

Halation portrait high: red leak from the existing table lamp into the wall. Same lamp. No hair-rim invented as a new source.

Halation landscape high: red/pink leak around the existing street lamp. Still night. Not a sunset.

Halation bar high: red leak around the existing pendants. Same fixtures.

Bloom on those same three: pale or warm-white glow, broader, not red-edged. Same practicals.

That is the discrimination 001 could not make.

## What leaked

Some halation frames add a secondary red wash at the far edge of the frame.

Bar bloom can read as haze between pendants.

Eyes stayed glass on the fox.

## High-pole read

| intended | halation | bloom |
| --- | --- | --- |
| halation 002 | high, often red | low-mid |
| bloom 001 | low | high, pale |

Agent-visual scores. Pictures are the evidence.

## What this does to the basis

- `vec_halation` stays. It is conditional on practicals in frame.
- `vec_highlight_bloom` stays.
- Do not prompt "halation" on a sunless daylight plate and expect a real test.
- Linear model unchanged.

## Next

Optical versus telecine on the original daylight anchors.

Then sequential reconstruction using the vectors that earned a coefficient.
