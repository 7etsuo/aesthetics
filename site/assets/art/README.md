# Optical observatory entrance artwork

The entrance artwork is presentation-only. It is not an Atlas observation and
is never used as evidence. The two responsive compositions were generated from
the canonical high-diffusion architecture plate (`obs_0079`) with OpenAI image
generation on 2026-08-15, then compressed to WebP. Their grayscale depth maps
were derived with `depth-anything/Depth-Anything-V2-Small-hf` and are used only
for restrained pointer parallax.

## Independent world layers

The production engine also uses four presentation-only derivatives so the room
and its optical apparatus can move as separate depth planes:

- `optical-observatory-room-wide.webp`
- `optical-observatory-room-mobile.webp`
- `optical-observatory-instrument-wide.webp`
- `optical-observatory-instrument-mobile.webp`

The two room plates were created on 2026-08-15 with OpenAI image editing by
removing only the suspended apparatus and reconstructing the occluded gallery.
Feature registration against the corresponding source plates measured less
than one pixel of translation and approximately 0.05% scale drift. The
instrument layers retain the source artwork pixels and were isolated locally
with `ZhengPeng7/BiRefNet`; no visual content was synthesized into those alpha
layers. All four files remain presentation artwork, never evidence.

### Clean-room edit instruction

> Remove only the complete suspended optical instrument and its supports.
> Reconstruct the occluded skylight, mineral wall, and empty air with identical
> perspective, light, material, framing, and architecture. Preserve the bench,
> floor, doorways, pedestal, caustic, and axial light exactly. Add nothing.

## Wide production prompt

> Use the supplied empty skylit gallery image as the immutable visual DNA for a
> production environment plate used behind a premium interactive website about
> the anatomy of images. Create one ultra-wide cinematic 16:9 environmental
> artwork, no interface and no typography. Expand the same quiet gallery into a
> vast, physically believable optical observatory: pale mineral plaster,
> translucent optical glass, brushed dark nickel, one warm aged-brass iris
> mechanism, soft skylight, subtle suspended atmospheric dust, deep
> architectural scale. The original central bench and skylight should remain
> recognizably echoed in the composition, but the space may extend beyond the
> square source. The single focal object is a monumental precision aperture/lens
> assembly suspended above and slightly behind the bench, elegant and functional
> rather than sci-fi decoration. Its concentric glass elements catch restrained
> spectral caustics; a thin amber light plane passes through the optical axis and
> lands on the floor. The room feels serene, expensive, tactile, and plausible -
> museum architecture plus a giant scientific instrument. Strong foreground,
> midground, and background depth; asymmetric composition; ample negative space
> for later HTML copy on the left; focal apparatus on the right two-thirds.
> Warm limestone, fog-white daylight, smoked optical glass, graphite nickel, and
> restrained amber. High-end architectural visualization, cinematic 35mm lens,
> natural global illumination, fine material detail, subtle bloom only around
> actual light. No fantasy neon, cyberpunk, floating UI, diagrams, people,
> faces, logos, text, borders, or generic spaceship corridor.

## Mobile production prompt

> Use the supplied wide optical-observatory production plate as the strict world
> and material reference. Create a separate vertical 9:16 mobile background
> plate for the same premium interactive website. Preserve the same monumental
> pale-mineral gallery, suspended glass-and-aged-brass precision lens/aperture,
> smoked nickel supports, bench, skylight, warm axial light, restrained spectral
> caustic, and quiet museum atmosphere. Recompose naturally for a tall phone
> viewport: the optical apparatus occupies the upper-middle/right and remains
> fully legible; the bench anchors the lower-middle; a calm darker limestone area
> remains across the lower-left and lower third for HTML copy and enter controls.
> It must feel like the same room photographed moments apart with a vertical
> cinema camera. No interface, typography, people, portraits, logos, charts,
> neon, cyberpunk, added objects, or borders.
