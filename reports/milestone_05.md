# Milestone 05: optical versus telecine

Date: 2026-08-14

"Old TV softness" was the remaining alias trap. Optical softness already had a plate. This campaign swept `vec_telecine_softness` and `vec_analog_video_texture` on the original five daylight anchors. 30 edits. Lamp stills stayed out.

## Decisions

| id | study | decision | confidence | why |
| --- | --- | --- | ---: | --- |
| `vec_telecine_softness` | `study_telecine_softness_001` | provisional | 0.56 | Flatter than optical melt. Knit survives. Object high is weak. |
| `vec_analog_video_texture` | `study_analog_video_texture_001` | provisional | 0.63 | Scan-like grain field with edges held. Fox high added letterbox. |

None is canonical. Optical high remains the lens melt.

## What separated

Optical portrait high melts hair and knit.

Telecine portrait high smears a little and leaves the knit readable. Same face. Same key.

Analog portrait high grains the seamless and keeps the face. Green scan lip on the left edge.

Gallery telecine high is the cleanest transfer tell: stone joints lose bandwidth, rainbow chroma on the side walls.

Gallery analog high grains the stone and keeps the bench edges.

That is the three-way split "old TV" could not make on its own.

## What leaked

Teapot telecine high barely moved.

Fox analog high invented letterbox bars.

Landscape analog high warmed the grade a little.

## High-pole read

| intended | optical | telecine | analog texture |
| --- | --- | --- | --- |
| optical 001 | high, creamy melt | low-mid | low |
| telecine 001 | low-mid | high, flat | low |
| analog texture 001 | low | low-mid | high, grain |

Agent-visual scores. Pictures are the evidence.

## What this does to the basis

- `vec_telecine_softness` stays. It is weaker than optical on this instrument.
- `vec_analog_video_texture` stays. It is a texture, not a softness.
- Do not treat "old TV" as one knob.
- `vec_vhs_bandwidth_loss` is still untested.
- Linear model unchanged.

## Next

Sequential reconstruction using the vectors that earned a coefficient. Apply them one at a time, not as one lumped prompt.
