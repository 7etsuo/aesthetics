# Milestone 02: softness discrimination

Date: 2026-08-14

Three new studies on the same five locked anchors: edge softness, diffusion, bokeh softness. Compared against existing optical-softness highs. 45 new observations. No new composite. Linear model unchanged.

## Decisions

| id | decision | confidence | why |
| --- | --- | --- | --- |
| `vec_diffusion` | provisional | 0.67 | High adds a scattering veil while edges stay closer to the source. Distinct. |
| `vec_bokeh_softness` | provisional | 0.62 | Subject stays sharp, field creams, when a subject plane exists. Distinct, conditional. |
| `vec_edge_softness` | near-alias | 0.36 | High usually melts the whole subject. That is optical softness. |
| `vec_optical_softness` | provisional | 0.64 | Still the parent melt. No longer assumed identical to diffusion or bokeh. |

None is canonical.

## What separated

Diffusion is a real control on this instrument. Gallery high puts god rays through haze and leaves the bench edged. Portrait and teapot get a mist without the circular orbs of optical-softness high. Landscape high works as atmosphere and then invents a sun.

Bokeh softness is a real control when the frame has a plane. Teapot high: pot sharp, wall cream. Fox high: creature sharp, sweep cream, eyes stay glass. Portrait high: face sharp, seamless cream. Landscape high: near grass holds, sea goes soft.

The known optical-softness leaks (orbs on glaze, glowing eyes) did not appear in these three studies. The tighter holds worked.

## What collapsed

Edge softness did not isolate. Teapot high is global defocus. Portrait high melts hair and face together. Architecture and landscape barely move. The fox is the only mild contour-only result. On this instrument, edge softness is a child or near-alias of optical softness.

Bokeh fails when there is no subject plane. The gallery is deep focus. Asking for creamy bokeh defocuses the whole room. That is optical softness again. Geometry is part of the vector, not a footnote.

## Discrimination at high (agent-visual)

Mean intended-vs-neighbor scores at the high pole, five anchors:

| intended | optical | edge | diffusion | bokeh |
| --- | ---: | ---: | ---: | ---: |
| optical (study 001, prior) | high | high | low-mid | leaky |
| edge | high | mid-high | low | low |
| diffusion | low-mid | low | high | low |
| bokeh | low except gallery | low | low | high except gallery |

Scoring is still agent-visual. Some coupling is built into the score functions. The pictures are the evidence. The table is a compact reading of them.

## What this does to the basis

The softness cluster is no longer one axis.

- `vec_diffusion` stays.
- `vec_bokeh_softness` stays, with a geometry condition.
- `vec_edge_softness` stays in the catalog as a near-alias so agents can map the phrase, not as a second independent coefficient.
- `vec_optical_softness` is the residual melt: definition loss that is not a veil and not a field dissolve.

Do not add a tensor term. The linear model now has two extra usable coefficients (diffusion, bokeh) and one phrase to stop treating as atomic (edge softness).

## Next

1. Tone vs light: shadow density vs black level vs key-to-fill, key locked.
2. Honest halation: night interior that already contains lamps.
3. Optical vs telecine.
4. Sequential reconstruction using the new diffusion and bokeh coefficients where they help.

Do not harvest more softness synonyms.
