"""Authoritative seed catalog. Materialized into registry JSON."""

from __future__ import annotations

from vslib.ids import interaction_id, mint_id, slugify
from vslib.models import (
    Aesthetic,
    Alias,
    Anchor,
    Family,
    Interaction,
    Weight,
)

HOLD_CONSTANT = [
    "subject identity",
    "pose and blocking",
    "framing and crop",
    "camera height and distance",
    "key light direction",
    "scene content",
    "source image when editing",
]

DAYLIGHT_ANCHOR_IDS = [
    "anchor_architecture",
    "anchor_character",
    "anchor_landscape",
    "anchor_object",
    "anchor_portrait",
]


def families() -> list[Family]:
    rows = [
        ("tonal_response", "tonal response",
         "How brightness is mapped: blacks, shadows, midtones, highlights, contrast, and range."),
        ("color_response", "color response",
         "How color is mapped independent of object identity: chroma, hue bias, separation, palette."),
        ("spatial_definition", "spatial definition",
         "How detail and edges are resolved: acutance, micro-detail, softness, frequency roll-off."),
        ("optical_character", "optical character",
         "Lens and optical-path behavior: diffusion, halation, glare, bokeh, field curvature."),
        ("texture_and_noise", "texture and noise",
         "Texture laid into the image: grain, noise, compression, analog video texture."),
        ("capture_and_transfer", "capture and transfer",
         "Recording and reproduction path. Many items here are systems, not atomic vectors."),
        ("lighting_response", "lighting response",
         "How light is shaped on the subject: hardness, ratio, practicals, atmosphere."),
        ("material_response", "material response",
         "How surfaces respond: roughness, gloss, subsurface, handmade irregularity."),
        ("physical_production", "physical production method",
         "What was physically built or performed in front of the camera."),
        ("compositional_grammar", "compositional grammar",
         "Framing and staging grammar that transfers across subjects."),
        ("finishing_behavior", "finishing behavior",
         "Final grade, sharpening, bloom, cleanup, and intentional degradation."),
        ("temporal_behavior", "temporal behavior",
         "Video-only dimensions: cadence, shutter, smear, weave, flicker."),
    ]
    return [
        Family(id=mint_id("fam", key), name=name, definition=defn, provisional=True)
        for key, name, defn in rows
    ]


def _v(
    slug: str,
    name: str,
    family: str,
    definition: str,
    claim: str,
    low: str,
    high: str,
    *,
    status: str = "candidate",
    polarity: str = "unipolar",
    aliases: list[str] | None = None,
    nearby: list[str] | None = None,
    not_same: dict[str, str] | None = None,
    effects: list[str] | None = None,
    phrases: dict[str, str] | None = None,
    scoring: str = "",
    questions: list[str] | None = None,
    confidence: float = 0.22,
    notes: str = "",
) -> dict:
    return {
        "id": mint_id("vec", slug),
        "canonical_name": name,
        "family_id": mint_id("fam", family),
        "status": status,
        "definition": definition,
        "testable_claim": claim,
        "low_pole": low,
        "high_pole": high,
        "polarity": polarity,
        "aliases": aliases or [],
        "nearby_ids": [mint_id("vec", x) for x in (nearby or [])],
        "not_the_same_as": {mint_id("vec", k): v for k, v in (not_same or {}).items()},
        "observable_effects": effects or [],
        "prompt_phrases": phrases or {},
        "scoring_guidance": scoring,
        "open_questions": questions or [],
        "confidence": confidence,
        "notes": notes,
    }


def vector_records() -> list[dict]:
    return [
        # --- tonal ---
        _v("black_level", "black level", "tonal_response",
           "The floor of the tone scale: how close the darkest values sit to true black.",
           "Raising black level lifts the floor without necessarily opening mid-shadows the same way.",
           "true black floor", "lifted or milky blacks",
           aliases=["lifted blacks", "crushed blacks", "black crush"],
           nearby=["shadow_density", "dynamic_range_compression", "global_contrast", "key_to_fill_ratio"],
           not_same={
               "shadow_density": "Shadow density is how heavy the shadow masses feel, not only the black floor.",
               "key_to_fill_ratio": "Ratio changes the lights. Black level lifts or sets the floor on the same lighting.",
               "veiling_glare": "Glare is a lens haze. Black lift is a tone-floor change without a required veil.",
           },
           effects=["blacks lift or sit dense", "shadow floor fog or ink"],
           phrases={
               "low": "true dense black floor, no milk, no fog, no raised floor",
               "medium": "natural black floor",
               "high": "lifted milky black floor, raised darkest values, no new fill light, no atmospheric haze",
           },
           scoring="0.00 true black floor, 0.50 natural, 1.00 strongly lifted milky floor. High is lift, not crush.",
           questions=["Can black lift be isolated from haze, veiling glare, and added fill?"],
           confidence=0.28),
        _v("shadow_density", "shadow density", "tonal_response",
           "How heavy, inky, or open the shadow masses are, independent of highlight behavior.",
           "Increasing shadow density darkens and fills shadow masses while subject, key direction, and highlight structure stay fixed.",
           "open shadows with readable detail", "murky, dense, inked shadows",
           aliases=["murky shadows", "dense shadows", "inky shadows", "open shadows"],
           nearby=["black_level", "global_contrast", "key_to_fill_ratio", "dynamic_range_compression"],
           not_same={
               "black_level": "Black level is the floor. Shadow density is the mass of the darks.",
               "key_to_fill_ratio": "Lighting ratio is a scene lighting change. Shadow density can be a tone-mapping change on the same lighting.",
               "global_contrast": "Global contrast moves lights and darks together. Shadow density targets the darks.",
           },
           effects=["shadow masses fill or open", "dark clothing and recesses gain or lose interior detail",
                    "midtones may stay closer to constant than in a contrast sweep"],
           phrases={
               "low": "open readable shadow interiors, same key, same highlight cores",
               "medium": "naturalistic shadow mass, same lighting as the source",
               "high": "heavy inky shadow mass in recesses and dark cloth only, keep highlight cores, no new lights",
           },
           scoring="0.00 open, 0.50 natural, 1.00 crushed murky shadow mass.",
           questions=["How cleanly can this separate from key-to-fill ratio when Imagine restages light?"],
           confidence=0.35),
        _v("shadow_toe", "shadow toe", "tonal_response",
           "Shape of the descent into black: gradual toe versus abrupt cutoff.",
           "Changing only the toe alters how quickly values fall into black without relocating the midtones as a global contrast change would.",
           "abrupt cutoff into black", "long gradual toe",
           aliases=["shadow roll-off", "toe"],
           nearby=["shadow_density", "black_level", "highlight_rolloff"]),
        _v("midtone_placement", "midtone placement", "tonal_response",
           "Where the average midtones sit on the scale: dark, neutral, or bright.",
           "Sliding midtones brightens or darkens the body of the picture with less change at the extremes than a contrast change.",
           "dark midtones", "bright midtones", polarity="bipolar",
           aliases=["midtone bias", "exposure of mids"]),
        _v("highlight_rolloff", "highlight roll-off", "tonal_response",
           "How highlights compress toward white: soft shoulder versus hard clip.",
           "A softer shoulder holds highlight texture and spreads highlight cores; a hard shoulder clips them.",
           "hard clipped highlights", "soft glowing shoulder",
           aliases=["highlight shoulder", "soft shoulder", "highlight clip"],
           nearby=["halation", "highlight_bloom", "dynamic_range_compression", "optical_softness"],
           not_same={"halation": "Roll-off is a tone curve. Halation is a spatial bleed around lights."}),
        _v("dynamic_range_compression", "dynamic range compression", "tonal_response",
           "How much of the scene's luminance range is squeezed into the display range.",
           "Compressing range reduces extreme separation between brightest and darkest values.",
           "expansive range", "heavily compressed range",
           aliases=["compressed dynamic range", "print-range squeeze"]),
        _v("global_contrast", "global contrast", "tonal_response",
           "Overall separation between lights and darks across the frame.",
           "Raising global contrast pushes lights and darks apart together.",
           "flat low contrast", "hard high contrast",
           aliases=["overall contrast"],
           nearby=["local_contrast", "microcontrast", "shadow_density"]),
        _v("local_contrast", "local contrast", "tonal_response",
           "Contrast of mid-sized forms, larger than microcontrast and smaller than the whole frame.",
           "Raising local contrast pops object volumes without a full global contrast swing.",
           "flat local volumes", "punched local volumes",
           nearby=["microcontrast", "clarity", "global_contrast"]),
        _v("microcontrast", "microcontrast", "tonal_response",
           "Tiny-scale contrast that makes pores, fibers, and surface grit snap.",
           "Raising microcontrast increases bite in fine texture without a required change in edge width.",
           "dead, soapy microcontrast", "biting microcontrast",
           aliases=["surface bite", "micro-contrast"],
           nearby=["clarity", "acutance", "texture_resolution", "optical_softness"],
           not_same={"acutance": "Acutance is edge crispness. Microcontrast is fine tonal bite inside surfaces.",
                     "optical_softness": "Optical softness can reduce microcontrast, but it also spreads highlights and defocuses."}),
        _v("gamma_response", "gamma response", "tonal_response",
           "Nonlinear tone mapping shape beyond a simple lift or contrast swing.",
           "Changing gamma redistributes midtones relative to ends without a pure contrast interpretation.",
           "dark receded mids", "lifted opened mids"),
        _v("exposure_bias", "exposure bias", "tonal_response",
           "Overall placement of the exposure, independent of contrast shape.",
           "A global exposure shift moves the whole scale.",
           "underexposed", "overexposed", polarity="bipolar"),

        # --- color ---
        _v("white_balance", "white balance", "color_response",
           "Neutral axis of the color system.",
           "Sliding white balance warms or cools neutrals without a required saturation change.",
           "cool neutrals", "warm neutrals", polarity="bipolar",
           aliases=["color temperature of neutrals"]),
        _v("temperature", "temperature", "color_response",
           "Warm-cool axis of the illuminant or grade.",
           "Temperature can move independently of magenta-green tint.",
           "cool", "warm", polarity="bipolar"),
        _v("green_magenta_tint", "green-magenta tint", "color_response",
           "Tint axis orthogonal to temperature.",
           "Tint can go green or magenta with temperature held.",
           "green tint", "magenta tint", polarity="bipolar"),
        _v("saturation", "saturation", "color_response",
           "Global chroma gain.",
           "Raising saturation intensifies hues without a required change in hue angles.",
           "desaturated", "highly saturated",
           nearby=["chroma_density", "color_separation"]),
        _v("chroma_density", "chroma density", "color_response",
           "How heavy and inky color feels, distinct from simple saturation gain.",
           "Increasing chroma density makes colors feel thicker and more dye-like rather than just louder.",
           "thin digital color", "thick dense chroma",
           aliases=["color density", "dye density", "thin digital color"],
           nearby=["saturation", "palette_compression", "color_separation"],
           not_same={"saturation": "Saturation is gain. Density is the thickness and inkiness of the colorant."}),
        _v("hue_bias", "hue bias", "color_response",
           "A systematic shift of hues in one direction.",
           "A hue bias rotates or leans the palette without a required density change.",
           "no systematic hue lean", "strong hue lean"),
        _v("shadow_color_bias", "shadow color bias", "color_response",
           "Hue and chroma lean that appears primarily in shadows.",
           "Shadow color can move while highlights stay nearer to neutral.",
           "neutral shadows", "strongly tinted shadows",
           aliases=["shadow color", "split tone shadows"]),
        _v("highlight_color_bias", "highlight color bias", "color_response",
           "Hue and chroma lean that appears primarily in highlights.",
           "Highlight color can move while shadows stay nearer to neutral.",
           "neutral highlights", "strongly tinted highlights"),
        _v("midtone_color_bias", "midtone color bias", "color_response",
           "Hue lean concentrated in midtones, including skin.",
           "Midtone color can move with ends held nearer to constant.",
           "neutral mids", "tinted mids"),
        _v("color_separation", "color separation", "color_response",
           "How distinctly neighboring hues stay apart versus blending together.",
           "Lowering separation blends adjacent hues; raising it keeps them cleanly distinct.",
           "blended, cross-talking color", "cleanly separated hues",
           aliases=["hue separation", "color crosstalk"],
           nearby=["chroma_density", "channel_crosstalk", "palette_compression"],
           not_same={"chroma_density": "Density is thickness. Separation is whether hues stay distinct."}),
        _v("channel_crosstalk", "channel crosstalk", "color_response",
           "Leakage between color channels that muddies primaries.",
           "Increasing crosstalk contaminates reds with green or blue, and so on.",
           "clean channels", "heavy crosstalk"),
        _v("palette_compression", "palette compression", "color_response",
           "Reduction of the working palette toward fewer dye-like hues.",
           "Compressing the palette collapses variety toward a smaller set of colors.",
           "full varied palette", "narrow dye palette",
           aliases=["limited palette", "dye set"]),
        _v("skin_tone_response", "skin-tone response", "color_response",
           "How skin hues are protected, shifted, or degraded.",
           "Skin response can change while background hues stay closer to constant.",
           "untreated skin mapping", "strongly biased skin mapping"),
        _v("gamut_extent", "gamut extent", "color_response",
           "How far colors are allowed to go toward spectral extremes.",
           "A smaller gamut pulls extrema inward.",
           "wide gamut", "narrow gamut"),

        # --- spatial ---
        _v("acutance", "acutance", "spatial_definition",
           "Apparent edge crispness, including haloed edge contrast.",
           "Raising acutance makes edges snap even if true resolution is unchanged.",
           "dull edges", "biting edge snap",
           nearby=["edge_softness", "sharpening_intensity", "microcontrast"],
           not_same={"edge_softness": "Softness is edge width. Acutance is edge contrast."}),
        _v("edge_softness", "edge softness", "spatial_definition",
           "Width and melt of edges, independent of highlight glow.",
           "Increasing edge softness thickens and dissolves contours without requiring a veil, highlight spread, or background disk melt.",
           "hard razor edges", "melted wide edges",
           aliases=["soft edges", "edge melt"],
           nearby=["optical_softness", "fine_detail_rolloff", "acutance", "diffusion", "bokeh_softness"],
           not_same={
               "optical_softness": "Optical softness includes highlight spread and micro-detail melt, not only edge width.",
               "diffusion": "Diffusion is a veil over the whole field. Edge softness is contour width.",
               "bokeh_softness": "Bokeh softness is the out-of-focus field. Edge softness can sit on an in-focus subject.",
           },
           effects=["contours thicken", "hair and fabric edges lose snap", "highlight cores stay relatively tight"],
           phrases={
               "low": "razor-hard contours, high acutance, no edge melt, tight subject outline",
               "medium": "slightly widened edges, mild contour melt, highlight cores still tight",
               "high": "heavy edge softness only: wide melted contours, dissolved outlines, highlight cores remain tight, no haze",
           },
           scoring="0.00 razor edges, 0.50 mild contour melt, 1.00 wide melted outlines.",
           questions=["Can Imagine widen edges without adding a diffusion veil or bokeh disks?"],
           confidence=0.28),
        _v("micro_detail_retention", "micro-detail retention", "spatial_definition",
           "How much of the finest texture survives.",
           "Lowering retention erases pores, fibers, and distant grit while large forms remain.",
           "fine texture gone", "fine texture fully kept",
           nearby=["texture_resolution", "fine_detail_rolloff"]),
        _v("texture_resolution", "texture resolution", "spatial_definition",
           "The finest spatial scale at which surface texture is still resolved.",
           "Lower texture resolution makes cloth and skin read as broader masses.",
           "broad unresolving texture", "highly resolved texture"),
        _v("clarity", "clarity", "spatial_definition",
           "Mid-frequency structure punch often used as a finishing control.",
           "Raising clarity punches volumes and mid-size texture.",
           "soapy low clarity", "harsh high clarity",
           nearby=["local_contrast", "microcontrast"]),
        _v("fine_detail_rolloff", "fine-detail roll-off", "spatial_definition",
           "How quickly high spatial frequencies die, the MTF-like slope.",
           "A steeper roll-off keeps large forms and loses only the finest detail.",
           "extended fine detail", "early fine-detail death",
           aliases=["mtf roll-off", "high-frequency roll-off"]),
        _v("digital_oversharpening", "digital oversharpening", "spatial_definition",
           "Haloed, crunchy edge enhancement typical of digital sharpening.",
           "Increasing it adds white/dark edge halos rather than true resolution.",
           "no sharpening halo", "crunchy haloed sharpening",
           nearby=["acutance", "sharpening_intensity"]),

        # --- optical ---
        _v("optical_softness", "optical softness", "optical_character",
           "Overall lens-like softening: reduced bite, slight highlight spread, and melted fine detail from the optical path.",
           "Increasing optical softness while holding subject, pose, framing, and key direction should melt fine detail and gently spread highlight cores without requiring a grain, color, or lighting-ratio change.",
           "clinical optical crispness", "heavy optical diffusion",
           aliases=["vintage softness", "lens softness", "old-cinema softness", "optical diffusion feel"],
           nearby=["edge_softness", "diffusion", "halation", "microcontrast", "telecine_softness", "veiling_glare"],
           not_same={
               "edge_softness": "Edge softness is contour width only. Optical softness also changes highlight cores and micro-detail.",
               "halation": "Halation is a colored or bright bleed around lights, not a global melt.",
               "telecine_softness": "Telecine softness is a transfer-path bandwidth loss, often flatter and more video-like.",
               "diffusion": "Diffusion is the filter or atmosphere mechanism. Optical softness is the observed image property.",
               "veiling_glare": "Veiling glare lifts contrast with a haze. Optical softness can exist with contrast intact.",
           },
           effects=["pores and fabric weave melt", "specular cores widen slightly",
                    "edges lose bite", "image feels lens-like rather than sharpened-digital"],
           phrases={
               "low": "clinically sharp optical path, high acutance, crisp micro-detail, tight highlight cores",
               "medium": "moderate vintage optical softness, slight highlight spread, natural fine-detail loss",
               "high": "heavy optical softness, melted fine detail, diffused highlight cores, lens-like bloom of definition",
           },
           scoring="0.00 clinical crisp, 0.50 moderate lens softness, 1.00 heavy optical melt.",
           questions=["Can Imagine raise optical softness without also adding halation or changing depth of field?"],
           confidence=0.35),
        _v("diffusion", "diffusion", "optical_character",
           "A scattering layer that veils the image, often from filters or atmosphere.",
           "Increasing diffusion adds a veil and lifts contrast slightly while edge width stays closer to the source than in an optical-softness sweep.",
           "no diffusion veil", "heavy diffusion veil",
           nearby=["optical_softness", "veiling_glare", "atmospheric_haze_response", "edge_softness"],
           not_same={
               "optical_softness": "Optical softness melts definition. Diffusion is a scattering veil that can sit on still-edged forms.",
               "veiling_glare": "Veiling glare is internal lens scatter that fogs blacks. Diffusion is a filter or atmosphere layer.",
               "edge_softness": "Edge softness is contour width. Diffusion is a field veil.",
           },
           effects=["whites and midtones gain a veil", "contrast lowers slightly", "lights spread into a mist"],
           phrases={
               "low": "clear air, no diffusion filter, no atmospheric veil",
               "medium": "mild diffusion filter, slight scattering veil, modest contrast lift in the blacks",
               "high": "heavy diffusion veil, strong scattering mist, lights bloom into haze, keep subject edges closer to the source than a defocus",
           },
           scoring="0.00 no veil, 0.50 mild filter, 1.00 heavy scattering veil.",
           questions=["Does high diffusion stay distinct from optical softness and veiling glare?"],
           confidence=0.28),
        _v("halation", "halation", "optical_character",
           "A spatial bleed of light, often warm or reddish, around bright sources into adjacent darker areas.",
           "Increasing only halation should make bright edges glow and leak into neighboring darks without a required global softness or grade change.",
           "clean unbled highlights", "strong highlight bleed",
           aliases=["highlight bleed", "red-edge glow", "film halation"],
           nearby=["highlight_bloom", "highlight_rolloff", "optical_softness", "veiling_glare", "final_bloom"],
           not_same={
               "highlight_bloom": "Bloom is a general glow. Halation is a more local, often reddish, bleed around speculars and lamps.",
               "optical_softness": "Softness melts the whole image. Halation can sit on an otherwise sharper picture.",
               "veiling_glare": "Glare is a global contrast-lowering haze. Halation is local to bright features.",
               "final_bloom": "Finishing bloom is a grade/filter layer. Halation is the optical or film-base phenomenon.",
           },
           effects=["lamps and catchlights grow a halo", "bright edges leak into adjacent darks",
                    "halo is often warmer than the source"],
           phrases={
               "low": "clean existing lamp edges, no bleed into adjacent darks, no new lights",
               "medium": "mild warm local bleed around existing lamps only, lamps stay in place",
               "high": "strong film-like halation, warm or reddish leak from existing lamps into neighboring darks only, no new lamps",
           },
           scoring="0.00 no bleed, 0.50 mild local glow, 1.00 strong colored or bright leak.",
           questions=["Does Imagine produce true local bleed or only global bloom and softness?"],
           confidence=0.35),
        _v("veiling_glare", "veiling glare", "optical_character",
           "A global haze from internal lens scatter that lifts blacks and lowers contrast.",
           "Increasing glare should fog the whole frame, especially against bright fields.",
           "clean contrasty glass", "heavy veiling haze",
           nearby=["diffusion", "black_level", "optical_softness"]),
        _v("field_curvature_feel", "field curvature feel", "optical_character",
           "Focus that does not sit on a flat plane, so corners or mid-field drift.",
           "Changing only this should defocus parts of a flat subject while the focus aim stays put.",
           "flat field", "strongly curved field"),
        _v("bokeh_softness", "bokeh softness", "optical_character",
           "How smoothly out-of-focus areas dissolve while the focus plane stays sharp.",
           "Raising bokeh softness should melt only the out-of-focus field. The subject plane stays sharp. No disks on in-focus surfaces.",
           "hard nervous bokeh", "creamy soft bokeh",
           nearby=["optical_softness", "edge_softness", "focal_length_feel"],
           not_same={
               "optical_softness": "Optical softness melts the whole image. Bokeh softness is only the defocused field.",
               "edge_softness": "Edge softness is contour width on the subject. Bokeh is background dissolve.",
           },
           effects=["background disks cream out", "busy out-of-focus edges melt", "in-focus subject stays sharp"],
           phrases={
               "low": "hard, nervous out-of-focus field, busy background edges, subject plane sharp",
               "medium": "moderately creamy background dissolve, subject plane still sharp",
               "high": "very creamy bokeh, out-of-focus field fully dissolved, keep the subject plane sharp, no blur disks on in-focus surfaces",
           },
           scoring="0.00 hard busy bokeh, 0.50 moderate cream, 1.00 fully dissolved field with sharp subject.",
           questions=["Can Imagine cream the field without defocusing the subject or painting orbs onto the teapot?"],
           confidence=0.28),
        _v("corner_softness", "corner softness", "optical_character",
           "Definition loss toward the frame corners.",
           "Raising it softens corners while the center stays nearer to sharp.",
           "even corner sharpness", "heavy corner melt"),
        _v("focal_length_feel", "focal-length feel", "optical_character",
           "Perspective and spatial compression associated with lens length, not just crop.",
           "A longer-feel image compresses planes; a wider-feel image expands them.",
           "wide expanded space", "long compressed space", polarity="bipolar",
           nearby=["lens_distance_feel", "subject_scale"]),
        _v("chromatic_aberration", "chromatic aberration", "optical_character",
           "Color fringing at high-contrast edges.",
           "Increasing it adds opposing color edges without a required softness change.",
           "no fringe", "strong color fringe"),
        _v("vignetting", "vignetting", "optical_character",
           "Peripheral darkening from the optical path or finishing.",
           "Raising vignetting darkens corners with the center held.",
           "even illumination", "heavy corner falloff"),
        _v("highlight_bloom", "highlight bloom", "optical_character",
           "A general glow around bright regions, broader and less colored than classic halation.",
           "Bloom enlarges bright regions softly; it need not be reddish or tightly local.",
           "tight unbloomed highlights", "broad highlight glow",
           aliases=["glow", "highlight glow"],
           nearby=["halation", "final_bloom", "optical_softness"],
           not_same={
               "halation": "Halation is a local, often reddish, bleed at the lamp lip. Bloom is a broader glow.",
           },
           effects=["bright regions enlarge softly", "glow can be white or pale", "need not hug the lamp edge"],
           phrases={
               "low": "tight unbloomed highlights on the existing lamps, no extra glow",
               "medium": "mild general highlight glow around existing bright regions",
               "high": "broad highlight glow around existing bright regions, not required to be red-edged, no new lamps",
           },
           scoring="0.00 tight highlights, 0.50 mild glow, 1.00 broad bloom.",
           questions=["Can bloom stay general without becoming a rim light or sunset?"],
           confidence=0.28),

        # --- texture ---
        _v("grain_structure", "grain structure", "texture_and_noise",
           "The size, clump, and shape of photochemical-like grain.",
           "Changing grain structure should add or alter grain without a required softness or color change.",
           "no grain", "heavy clumped grain",
           aliases=["film grain", "grain size"],
           nearby=["noise_character", "analog_video_texture"],
           not_same={"analog_video_texture": "Video texture is scan-like, often chroma-noisy and less filmlike in clump."}),
        _v("noise_character", "noise character", "texture_and_noise",
           "Electronic or digital noise personality, distinct from dye-cloud grain.",
           "Noise can be luminance, chroma, or fixed-pattern without looking like film grain.",
           "clean", "heavy electronic noise"),
        _v("texture_uniformity", "texture uniformity", "texture_and_noise",
           "How even the texture field is across the frame.",
           "Low uniformity clumps or varies the texture field.",
           "even field", "uneven clumped field"),
        _v("compression_texture", "compression texture", "texture_and_noise",
           "Block, mosquito, or ringing texture from compression.",
           "Increasing it should add codec structure, not grain.",
           "no codec texture", "heavy compression texture",
           aliases=["mosquito noise", "macroblocking"]),
        _v("analog_video_texture", "analog video texture", "texture_and_noise",
           "The specific instability of analog video: chroma crawl, luma grain, mild banding, scan-like texture.",
           "Raising it should read as tape or tube texture, not as film grain.",
           "clean digital field", "heavy analog video texture",
           aliases=["VHS texture", "tape texture", "tube texture"],
           nearby=["vhs_bandwidth_loss", "crt_bloom_feel", "grain_structure", "telecine_softness"],
           not_same={
               "grain_structure": "Film grain clumps. Analog video texture is scan-like and often chroma-noisy.",
               "telecine_softness": "Telecine is bandwidth smear. This is a texture field, not a softness.",
               "vhs_bandwidth_loss": "Bandwidth loss smears chroma and luma. Texture is the crawl and scan grain.",
           },
           effects=["scan-like luma grain", "chroma crawl on edges", "mild banding"],
           phrases={
               "low": "clean digital field, no scan texture, no chroma crawl, no tape grain",
               "medium": "mild analog video texture, faint scan-like grain, slight chroma crawl, keep subject edges",
               "high": "heavy analog video texture, visible scan-like luma grain, chroma crawl, mild banding, keep subject edges, no extra lens melt",
           },
           scoring="0.00 clean digital, 0.50 mild crawl, 1.00 heavy tape/tube texture.",
           questions=["Can texture land without also smearing bandwidth or adding a CRT bezel?"],
           confidence=0.28),

        # --- capture / transfer (many are systems) ---
        _v("photochemical_feel", "photochemical feel", "capture_and_transfer",
           "A cluster of dye, grain, and tone behaviors associated with film origination. Treated as a system label until decomposed.",
           "This is a system, not a single isolatable axis.",
           "non-photochemical", "strongly photochemical",
           status="system",
           notes="Decompose into grain, chroma density, roll-off, halation, print density."),
        _v("telecine_softness", "telecine softness", "capture_and_transfer",
           "A flat, slightly smeared softness associated with film-to-video transfer, often with reduced fine detail and mild chroma smear.",
           "Increasing telecine softness should look like transfer bandwidth loss, not like a portrait diffusion filter.",
           "no transfer smear", "heavy telecine smear",
           aliases=["old-tv softness", "film-to-tape softness", "telecine smear"],
           nearby=["optical_softness", "vhs_bandwidth_loss", "fine_detail_rolloff", "analog_video_texture"],
           not_same={
               "optical_softness": "Optical softness is lens-like melt of pores and highlight cores. Telecine is flatter, more electronic smear.",
               "analog_video_texture": "Texture is scan grain and chroma crawl. Telecine is bandwidth loss without a required texture field.",
               "vhs_bandwidth_loss": "VHS loss is consumer-tape chroma collapse. Telecine is a film-to-tape transfer smear.",
           },
           effects=["fine detail smears flat", "edges lose bandwidth not bite",
                    "mild chroma smear", "image reads transferred, not lens-diffused"],
           phrases={
               "low": "full transfer bandwidth, no film-to-tape smear, fine detail intact, no chroma smear",
               "medium": "mild film-to-tape transfer smear, slightly reduced fine detail, slight chroma softness",
               "high": "heavy telecine transfer smear, flat electronic softness, fine detail lost to bandwidth, mild chroma smear across edges, still a photograph",
           },
           scoring="0.00 full bandwidth, 0.50 mild transfer smear, 1.00 heavy flat telecine smear.",
           questions=["Can transfer smear stay distinct from optical melt and from analog video texture?"],
           confidence=0.28),
        _v("optical_print_softness", "optical-print softness", "capture_and_transfer",
           "Softness and contrast from an optical print generation, denser and more photographic than telecine smear.",
           "Should thicken the print, not add scanlines.",
           "contact-sharp print", "dupe-print softness"),
        _v("release_print_density", "release-print density", "capture_and_transfer",
           "The thicker, dyed density of a theatrical print.",
           "Raising it should ink up the print, especially in color and shadows.",
           "thin scan", "thick print density",
           nearby=["chroma_density", "print_density_bias", "shadow_density"]),
        _v("vhs_bandwidth_loss", "VHS bandwidth loss", "capture_and_transfer",
           "Chroma smear, luma blur, and lost high frequencies typical of consumer tape.",
           "Should degrade chroma resolution more than a lens would.",
           "full bandwidth", "heavy VHS loss",
           aliases=["VHS softness", "tape bandwidth"]),
        _v("crt_bloom_feel", "CRT bloom feel", "capture_and_transfer",
           "Phosphor glow, scan bloom, and slight persistence associated with CRT display.",
           "Should bloom on a scan-like field, not like film halation.",
           "no phosphor bloom", "heavy CRT bloom",
           nearby=["halation", "highlight_bloom", "analog_video_texture"]),

        # --- lighting ---
        _v("key_to_fill_ratio", "key-to-fill ratio", "lighting_response",
           "The lighting contrast between key and fill, a scene-light property.",
           "Raising the ratio deepens lighting shadows without a required tone-curve change.",
           "flat fill", "hard unfilled key",
           aliases=["lighting ratio", "contrasty lighting"],
           nearby=["shadow_density", "source_hardness", "black_level"],
           not_same={
               "shadow_density": "Ratio is how the scene is lit. Density can be a grade on the same lighting.",
               "source_hardness": "Hardness is the shadow-edge transfer. Ratio is fill strength versus key.",
               "black_level": "Black level is the floor. Ratio is lighting contrast.",
           },
           effects=["fill rises or dies", "lighting-shadow shape deepens", "key side stays the same"],
           phrases={
               "low": "strong fill, flat lighting ratio, key still from the same side",
               "medium": "naturalistic key-to-fill, same key direction",
               "high": "weak fill, high key-to-fill ratio, key still from the same side, no new lamps",
           },
           scoring="0.00 flat fill, 0.50 natural ratio, 1.00 unfilled key.",
           questions=["Can ratio rise without hardening the key into a new window?"],
           confidence=0.28),
        _v("source_hardness", "source hardness", "lighting_response",
           "How hard or soft the key source is, visible in shadow-edge transfer.",
           "Harder sources make sharper shadow edges and tighter speculars.",
           "very soft source", "hard point source"),
        _v("practical_light_dominance", "practical-light dominance", "lighting_response",
           "How much visible practicals appear to author the lighting.",
           "Raising it makes lamps in frame feel like the real sources.",
           "invisible motivated light", "practicals dominate"),
        _v("rim_light_character", "rim-light character", "lighting_response",
           "Strength and quality of edge light separating subject from ground.",
           "Can vary without changing key-to-fill on the face.",
           "no rim", "strong rim"),
        _v("atmospheric_haze_response", "atmospheric haze response", "lighting_response",
           "How strongly aerial haze, fog, or scatter reads in depth.",
           "Raising it separates planes with veiling, not with lens diffusion alone.",
           "clear air", "heavy atmospheric veil",
           nearby=["diffusion", "practical_fog_feel", "veiling_glare"]),

        # --- material ---
        _v("gloss_response", "gloss response", "material_response",
           "Strength and tightness of specular response on surfaces.",
           "Raising gloss tightens and brightens speculars without a required roughness map inversion if isolated poorly; test carefully.",
           "matte", "high gloss",
           nearby=["roughness", "specular_intensity"]),
        _v("roughness", "roughness", "material_response",
           "Micro-surface irregularity that spreads speculars.",
           "Raising roughness breaks tight speculars into broader sheen.",
           "optically smooth", "very rough",
           aliases=["surface roughness"]),
        _v("subsurface_feel", "subsurface feel", "material_response",
           "Light traveling through a volume before exiting, as in skin, wax, or silicone.",
           "Raising it makes thin forms glow internally.",
           "opaque surface-only", "strong subsurface"),
        _v("fabric_heaviness", "fabric heaviness", "material_response",
           "How heavy, coarse, or physically present cloth reads.",
           "Heavier fabric hangs and catches light as real cloth, not as a shader sheet.",
           "thin digital cloth", "heavy physical cloth"),
        _v("latex_foam_feel", "latex or foam feel", "material_response",
           "The slightly rubbery, painted-foam quality of physical creature effects.",
           "Raising it should look fabricated, not like living skin or hard CGI plastic.",
           "no latex/foam cue", "strong latex/foam cue"),
        _v("hand_painted_surface", "hand-painted surface quality", "material_response",
           "Visible brush, pigment, and irregular paint thickness.",
           "Raising it shows handmade paint, not a tiled material.",
           "factory-smooth finish", "clearly hand-painted"),
        _v("practical_material_feel", "practical-material feel", "material_response",
           "The general sense that surfaces were physically built, painted, and handled.",
           "This may be a parent of several material vectors and needs decomposition.",
           "digital-smooth materials", "strongly fabricated materials",
           aliases=["practical puppet feel", "handmade material feel", "physical fabrication feel"],
           nearby=["hand_painted_surface", "latex_foam_feel", "roughness", "fabric_heaviness"],
           notes="Likely a parent/composite. Keep as a working vector until child studies exist.",
           questions=["Parent or composite? Split into roughness, paint, latex, fabric?"]),
        _v("specular_intensity", "specular intensity", "material_response",
           "How bright the specular highlights are, apart from their width.",
           "Intensity can rise while roughness stays fixed.",
           "dull speculars", "hot speculars"),

        # --- production method ---
        _v("puppetry_feel", "puppetry feel", "physical_production",
           "Jointing, scale, and performance cues of a puppet.",
           "Should change construction and motion cues, not only the grade.",
           "no puppet cue", "strong puppet cue"),
        _v("animatronic_feel", "animatronic feel", "physical_production",
           "Mechanical creature presence: seams, weight, limited articulation.",
           "Distinct from a digital creature or a simple puppet.",
           "no animatronic cue", "strong animatronic cue"),
        _v("miniature_set_feel", "miniature-set feel", "physical_production",
           "Scale cues of a crafted miniature: forced texture, depth, and lighting scale.",
           "Should look small-scale and built, not like a full-size location or a CG set.",
           "full-scale or CG space", "clear miniature scale"),
        _v("matte_painting_feel", "matte-painting feel", "physical_production",
           "Painted or composited backdrop with a graphic depth plane.",
           "Backgrounds read as painted planes rather than photographed space.",
           "photographed space", "painted plane"),
        _v("practical_fog_feel", "practical fog feel", "physical_production",
           "Physical atmosphere with volume and catchlights, not a 2D haze overlay.",
           "Fog should occupy space and wrap lights.",
           "no practical fog", "dense practical fog"),
        _v("optical_composite_feel", "optical-composite feel", "physical_production",
           "Generation-loss, matte lines, and dupe contrast of an optical composite.",
           "Should look printed-together, not like a clean digital key.",
           "clean digital composite", "optical dupe composite"),

        # --- composition ---
        _v("lens_distance_feel", "lens distance feel", "compositional_grammar",
           "Apparent camera-to-subject distance, independent of crop.",
           "Closer-feel images enlarge perspective; farther-feel images flatten it.",
           "distant", "close", polarity="bipolar"),
        _v("subject_scale", "subject scale", "compositional_grammar",
           "How large the subject sits in the frame.",
           "Scale can change with lens distance held only if the crop changes; treat carefully.",
           "small in frame", "large in frame"),
        _v("frame_density", "frame density", "compositional_grammar",
           "How packed the frame is with information.",
           "Dense frames fill; sparse frames breathe.",
           "sparse", "dense"),
        _v("theatrical_blocking", "theatrical blocking", "compositional_grammar",
           "Stage-like arrangement facing an implied audience plane.",
           "Raising it should look staged rather than casually observed.",
           "observational blocking", "stage blocking",
           aliases=["television-stage blocking", "locked-off theatrical framing"]),
        _v("negative_space_bias", "negative-space bias", "compositional_grammar",
           "How much empty field is left around the subject.",
           "Higher bias leaves more unused field.",
           "tight field", "large negative space"),

        # --- finishing ---
        _v("print_density_bias", "print-density bias", "finishing_behavior",
           "A finishing lean toward thicker or thinner print.",
           "Can be applied after capture as a grade.",
           "thin", "thick",
           nearby=["release_print_density", "chroma_density"]),
        _v("final_bloom", "final bloom", "finishing_behavior",
           "A finishing glow applied in grade, not claimed as film-base halation.",
           "Should look like a filter layer.",
           "no finishing bloom", "heavy finishing bloom",
           nearby=["highlight_bloom", "halation"]),
        _v("sharpening_intensity", "sharpening intensity", "finishing_behavior",
           "Amount of finishing sharpening.",
           "Raises edge contrast and often halos.",
           "unsharpened", "heavily sharpened",
           nearby=["acutance", "digital_oversharpening"]),
        _v("cleanup_level", "cleanup level", "finishing_behavior",
           "How retouched, denoised, and perfected the image is.",
           "High cleanup removes defects and also life.",
           "raw and uncleaned", "heavily cleaned",
           aliases=["digital cleanup", "beauty cleanup"]),
        _v("stylized_degradation", "stylized degradation", "finishing_behavior",
           "Intentional damage used as style: scratches, dirt, wear.",
           "This is a family of effects and may not stay atomic.",
           "clean", "heavily degraded",
           status="candidate",
           notes="Likely composite. Keep only if a single axis proves useful."),

        # --- temporal ---
        _v("frame_cadence_feel", "frame cadence feel", "temporal_behavior",
           "The stepping rhythm of motion from frame rate and pulldown.",
           "Still frames can hint at 24 vs 30 vs 60 origins only weakly.",
           "smooth high-rate cadence", "stepped cinematic cadence"),
        _v("shutter_angle_feel", "shutter-angle feel", "temporal_behavior",
           "Motion-blur length associated with shutter opening.",
           "Needs video. Stills show only residual smear.",
           "crisp frozen motion", "long smeared shutter"),
        _v("temporal_smear", "temporal smear", "temporal_behavior",
           "Display or tape persistence that smears motion in time.",
           "Distinct from optical defocus.",
           "no temporal smear", "heavy temporal smear"),
        _v("gate_weave", "gate weave", "temporal_behavior",
           "Slow positional jitter of a film gate.",
           "A still cannot show this; video only.",
           "locked registration", "visible weave"),
        _v("flicker", "flicker", "temporal_behavior",
           "Frame-to-frame exposure pumping or lamp flicker.",
           "Video only.",
           "stable exposure", "visible flicker"),
    ]


def alias_records() -> list[Alias]:
    rows: list[tuple[str, str, str, float, str]] = [
        ("vintage softness", "vec_optical_softness", "alias", 0.84,
         "Common prompt phrase. Not identical to telecine softness."),
        ("lens softness", "vec_optical_softness", "alias", 0.88, ""),
        ("old-cinema softness", "vec_optical_softness", "alias", 0.78, ""),
        ("clinical crispness", "vec_optical_softness", "alias", 0.70,
         "Names the low pole, not a separate vector."),
        ("murky shadows", "vec_shadow_density", "alias", 0.90, ""),
        ("inky shadows", "vec_shadow_density", "alias", 0.88, ""),
        ("open shadows", "vec_shadow_density", "alias", 0.80, "Low pole."),
        ("crushed blacks", "vec_black_level", "near_alias", 0.72,
         "Sometimes means black floor, sometimes shadow density."),
        ("lifted blacks", "vec_black_level", "alias", 0.90, ""),
        ("soft shoulder", "vec_highlight_rolloff", "alias", 0.86, ""),
        ("highlight bleed", "vec_halation", "near_alias", 0.74,
         "May also mean bloom."),
        ("film halation", "vec_halation", "alias", 0.92, ""),
        ("old-tv softness", "vec_telecine_softness", "alias", 0.82, ""),
        ("film-to-tape softness", "vec_telecine_softness", "alias", 0.88, ""),
        ("VHS texture", "vec_analog_video_texture", "near_alias", 0.70,
         "VHS also includes bandwidth loss."),
        ("VHS softness", "vec_vhs_bandwidth_loss", "alias", 0.80, ""),
        ("practical puppet feel", "vec_practical_material_feel", "near_alias", 0.72, ""),
        ("handmade material feel", "vec_practical_material_feel", "alias", 0.80, ""),
        ("glow", "vec_highlight_bloom", "near_alias", 0.64,
         "Glow is overloaded. Prefer bloom or halation."),
        ("film grain", "vec_grain_structure", "alias", 0.86, ""),
        ("lighting ratio", "vec_key_to_fill_ratio", "alias", 0.90, ""),
        ("television-stage blocking", "vec_theatrical_blocking", "alias", 0.84, ""),
        # composites and vague terms
        ("cinematic", "aes_cinematic_generic", "vague", 0.95,
         "Not atomic. Usually lighting ratio plus contrast plus shallow space plus grade."),
        ("vintage", "aes_vintage_generic", "vague", 0.95,
         "Not atomic. Mixes softness, palette, grain, and transfer."),
        ("analog", "aes_analog_generic", "vague", 0.93,
         "Not atomic. Could be film, tape, or print."),
        ("1980s fantasy", "aes_80s_fantasy_tv", "composite", 0.90, ""),
        ("80s fantasy TV look", "aes_80s_fantasy_tv", "composite", 0.94, ""),
        ("80s fantasy", "aes_80s_fantasy_tv", "composite", 0.90, ""),
        ("VHS", "aes_vhs_look", "system", 0.88, "A capture/transfer system, not a vector."),
        ("film emulation", "aes_film_emulation", "composite", 0.86,
         "Usually only the finishing layer. Incomplete as a look."),
        ("old look", "aes_vintage_generic", "vague", 0.90, ""),
        ("moody", "aes_cinematic_generic", "vague", 0.92, ""),
        ("filmic", "aes_film_emulation", "vague", 0.80, ""),
        ("retro", "aes_vintage_generic", "vague", 0.90, ""),
        ("dreamy", "vec_optical_softness", "vague", 0.55,
         "Often softness plus bloom plus lifted midtones. Do not treat as atomic."),
        ("gritty", "vec_grain_structure", "vague", 0.50,
         "Often grain plus microcontrast plus dirt plus hard light."),
    ]
    out: list[Alias] = []
    for phrase, target, mapping, conf, notes in rows:
        out.append(Alias(
            id=mint_id("alias", phrase),
            raw_phrase=phrase,
            target_id=target,
            mapping_type=mapping,  # type: ignore[arg-type]
            confidence=conf,
            notes=notes,
        ))
    return out


def aesthetic_records() -> list[Aesthetic]:
    return [
        Aesthetic(
            id="aes_soft_halated_shadow",
            canonical_name="soft halated shadow",
            status="composite",
            definition=(
                "A first-order composite built only from the three studied vectors: "
                "optical softness, shadow density, and halation."
            ),
            weights=[
                Weight("vec_optical_softness", 0.78, "manual", 0.72, False),
                Weight("vec_shadow_density", 0.70, "manual", 0.70, False),
                Weight("vec_halation", 0.58, "manual", 0.66, False),
            ],
            aliases=["soft shadowed glow", "diffused night still"],
            interaction_notes=[
                "Halation becomes more visible once highlights survive; dense shadows can hide it.",
                "Optical softness and halation often co-move in Imagine edits.",
            ],
            reconstruction_notes=(
                "Preserve subject and framing. Raise optical softness and shadow density as dominant "
                "phrases. Add supporting halation. Do not mention cinematic, vintage, or analog."
            ),
            confidence=0.62,
            notes="Milestone reconstruction target.",
        ),
        Aesthetic(
            id="aes_80s_fantasy_tv",
            canonical_name="1980s fantasy television",
            status="composite",
            definition=(
                "A named production look, not an atom. Hypothesized mixture of optical softness, "
                "telecine transfer, dense shadows, restrained chroma separation, practical materials, "
                "and theatrical lighting. Several weights remain untested."
            ),
            weights=[
                Weight("vec_optical_softness", 0.72, "manual", 0.55, True),
                Weight("vec_shadow_density", 0.63, "manual", 0.50, True),
                Weight("vec_halation", 0.41, "manual", 0.48, True),
                Weight("vec_telecine_softness", 0.79, "manual", 0.36, True),
                Weight("vec_chroma_density", 0.40, "manual", 0.30, True),
                Weight("vec_color_separation", 0.35, "manual", 0.28, True),
                Weight("vec_practical_material_feel", 0.68, "manual", 0.34, True),
                Weight("vec_miniature_set_feel", 0.46, "manual", 0.30, True),
                Weight("vec_theatrical_blocking", 0.52, "manual", 0.32, True),
                Weight("vec_key_to_fill_ratio", 0.58, "manual", 0.30, True),
                Weight("vec_microcontrast", 0.28, "manual", 0.30, True),
            ],
            aliases=["1980s fantasy", "80s fantasy TV look", "80s fantasy"],
            interaction_notes=[
                "Telecine softness plus low microcontrast may read more analog than either alone.",
                "Practical materials become more legible when optical softness is moderate, not extreme.",
            ],
            reconstruction_notes=(
                "Do not prompt 80s fantasy as a lump. Translate dominant hypothesized weights into "
                "tested phrases where they exist, and mark untested weights as hypotheses."
            ),
            confidence=0.34,
            notes="Hypothesis only. Do not treat as validated.",
        ),
        Aesthetic(
            id="aes_cinematic_generic",
            canonical_name="cinematic (unresolved)",
            status="vague",
            definition=(
                "A vague cultural label. Usually some mix of lighting ratio, shallow space, "
                "contrast, and a finishing grade. Rejected as an atom."
            ),
            weights=[],
            aliases=["cinematic", "moody", "filmic"],
            reconstruction_notes="Refuse to treat as atomic. Ask which vectors are intended.",
            confidence=0.15,
        ),
        Aesthetic(
            id="aes_vintage_generic",
            canonical_name="vintage (unresolved)",
            status="vague",
            definition="Vague period label. Could mean softness, palette, grain, damage, or transfer.",
            weights=[],
            aliases=["vintage", "retro", "old look"],
            confidence=0.12,
        ),
        Aesthetic(
            id="aes_analog_generic",
            canonical_name="analog (unresolved)",
            status="vague",
            definition="Vague medium label. Could mean film, tape, print, or all three.",
            weights=[],
            aliases=["analog"],
            confidence=0.12,
        ),
        Aesthetic(
            id="aes_vhs_look",
            canonical_name="VHS look",
            status="system",
            definition="A capture and transfer system. Decompose into bandwidth loss, analog video texture, chroma smear, and CRT bloom.",
            weights=[
                Weight("vec_vhs_bandwidth_loss", 0.82, "manual", 0.40, True),
                Weight("vec_analog_video_texture", 0.74, "manual", 0.40, True),
                Weight("vec_crt_bloom_feel", 0.48, "manual", 0.30, True),
                Weight("vec_color_separation", 0.30, "manual", 0.25, True),
            ],
            aliases=["VHS"],
            confidence=0.28,
        ),
        Aesthetic(
            id="aes_film_emulation",
            canonical_name="film emulation",
            status="composite",
            definition="Usually a finishing-layer stand-in for photochemical behavior. Incomplete unless capture and optics are specified.",
            weights=[
                Weight("vec_grain_structure", 0.55, "manual", 0.30, True),
                Weight("vec_highlight_rolloff", 0.60, "manual", 0.30, True),
                Weight("vec_chroma_density", 0.45, "manual", 0.28, True),
                Weight("vec_halation", 0.30, "manual", 0.25, True),
            ],
            aliases=["film emulation", "filmic"],
            confidence=0.24,
        ),
    ]


def interaction_records() -> list[Interaction]:
    pairs = [
        ("vec_halation", "vec_highlight_rolloff", 0.62,
         "Halation is more visible when highlight values survive a soft shoulder."),
        ("vec_practical_material_feel", "vec_optical_softness", 0.55,
         "Often co-produce an analog fantasy impression."),
        ("vec_telecine_softness", "vec_optical_softness", 0.68,
         "Easy to confuse. Needs a discrimination study."),
        ("vec_shadow_density", "vec_key_to_fill_ratio", 0.70,
         "Imagine may restage lighting when asked only for denser shadows."),
        ("vec_halation", "vec_optical_softness", 0.64,
         "High optical softness often drags bloom/halation along."),
        ("vec_microcontrast", "vec_optical_softness", 0.66,
         "Softness usually lowers microcontrast. Inverse test needed."),
    ]
    out = []
    for a, b, strength, note in pairs:
        out.append(Interaction(
            id=interaction_id(a, b),
            vector_i=min(a, b),
            vector_j=max(a, b),
            strength=strength,
            note=note,
        ))
    return out


def anchor_records() -> list[Anchor]:
    return [
        Anchor(
            id="anchor_portrait",
            kind="portrait",
            name="human portrait",
            lock_prompt=(
                "A 34-year-old woman with medium-brown skin, a narrow gold nose ring, "
                "shoulder-length black hair parted off-center, and a calm closed-mouth expression. "
                "She faces the camera in a three-quarter pose, body turned slightly left, eyes to lens. "
                "She wears a plain charcoal knit sweater. Seated in a quiet studio against a medium gray seamless backdrop. "
                "Even soft key light from camera left, gentle fill from the right, no colored gels, no haze. "
                "Clean contemporary reference photograph: natural color, moderate contrast, sharp focus on the near eye, "
                "no film effects, no glow, no grain, no stylization. Medium close-up, 85mm-equivalent, eye-level, "
                "square 1:1 frame, subject centered."
            ),
        ),
        Anchor(
            id="anchor_object",
            kind="object",
            name="ordinary physical object",
            lock_prompt=(
                "A glazed stoneware teapot with a warm gray-green glaze, unglazed clay handle and lid knob, "
                "sitting on a raw pale oak table. A single linen napkin lies folded to the right. "
                "Pale plaster wall behind. Neutral daylight from a window at camera left. "
                "Clean contemporary still-life photograph: natural color, moderate contrast, sharp focus on the spout, "
                "no film effects, no glow, no grain, no stylization. Three-quarter view, 50mm-equivalent, "
                "camera at pot height, square 1:1 frame."
            ),
        ),
        Anchor(
            id="anchor_architecture",
            kind="architecture",
            name="architecture or interior",
            lock_prompt=(
                "An empty museum gallery with pale limestone walls, a smooth concrete floor, "
                "one rectangular skylight centered above, and a dark walnut bench in the middle of the room. "
                "No people, no art on the walls. Quiet daylight from the skylight. "
                "Clean contemporary architectural photograph: natural color, moderate contrast, deep focus, "
                "no film effects, no glow, no grain, no stylization. 24mm-equivalent, centered symmetry, "
                "eye-level, square 1:1 frame."
            ),
        ),
        Anchor(
            id="anchor_landscape",
            kind="landscape",
            name="landscape",
            lock_prompt=(
                "A grassy coastal cliff dropping to a calm gray-blue sea, late afternoon, "
                "a single dirt path in the lower left, no people, no buildings. Clear air, natural daylight. "
                "Clean contemporary landscape photograph: natural color, moderate contrast, sharp focus, "
                "no film effects, no glow, no added haze, no grain, no stylization. 35mm-equivalent, "
                "eye-level, horizon on the upper third, square 1:1 frame."
            ),
        ),
        Anchor(
            id="anchor_character",
            kind="character",
            name="stylized character or creature",
            lock_prompt=(
                "A small standing fox creature made of painted wood and stitched fabric, large amber glass eyes, "
                "a tiny brown corduroy vest, visible seams and brush marks in the paint. "
                "Standing on a gray studio sweep. Even soft studio light from camera left. "
                "Clean contemporary character reference photograph: natural color, moderate contrast, sharp focus, "
                "no film effects, no glow, no grain, no extra stylization beyond the subject's own materials. "
                "Full body, 50mm-equivalent, camera at the creature's eye level, square 1:1 frame."
            ),
        ),
        Anchor(
            id="anchor_lamp_portrait",
            kind="portrait",
            name="night portrait with practical",
            lock_prompt=(
                "A 34-year-old woman with medium-brown skin, a narrow gold nose ring, "
                "shoulder-length black hair parted off-center, and a calm closed-mouth expression. "
                "Three-quarter pose, body turned slightly left, eyes to lens, charcoal knit sweater. "
                "Night interior. One warm practical table lamp sits in frame to camera left, visible shade and warm bulb glow, "
                "and that lamp is the key light. Dark plaster wall behind. No other lamps. "
                "Clean contemporary photograph: natural night color, moderate contrast, sharp focus on the near eye, "
                "no film effects, no extra glow, no grain, no stylization. Medium close-up, 85mm-equivalent, "
                "eye-level, square 1:1 frame."
            ),
        ),
        Anchor(
            id="anchor_lamp_object",
            kind="object",
            name="night still life with desk lamp",
            lock_prompt=(
                "A glazed stoneware teapot with a warm gray-green glaze, unglazed clay handle and lid knob, "
                "on a raw pale oak table. A linen napkin to the right. "
                "Night. One metal desk lamp in frame at camera left, visible shade, lighting the pot. Dark plaster wall. "
                "Clean contemporary still-life: natural night color, moderate contrast, sharp focus on the spout, "
                "no film effects, no extra glow, no grain. Three-quarter view, 50mm-equivalent, square 1:1 frame."
            ),
        ),
        Anchor(
            id="anchor_lamp_architecture",
            kind="architecture",
            name="night interior with practicals",
            lock_prompt=(
                "A small empty night bar interior: dark wood bar, two stools, no people. "
                "Two warm pendant lamps already on above the bar, and one wall sconce, all visible in frame. "
                "Those practicals light the room. No daylight. "
                "Clean contemporary architectural photograph: natural night color, moderate contrast, deep focus, "
                "no film effects, no extra glow, no grain. 24mm-equivalent, eye-level, square 1:1 frame."
            ),
        ),
        Anchor(
            id="anchor_lamp_landscape",
            kind="landscape",
            name="night path with street lamp",
            lock_prompt=(
                "A night coastal path along a grassy cliff, dark sea beyond, no people. "
                "One tall street lamp already in frame beside the path, its warm bulb visible, lighting the near grass. "
                "Clear night air. Clean contemporary landscape: natural night color, moderate contrast, sharp focus, "
                "no film effects, no extra glow, no added haze, no grain. 35mm-equivalent, eye-level, square 1:1 frame."
            ),
        ),
        Anchor(
            id="anchor_lamp_character",
            kind="character",
            name="night creature with practical",
            lock_prompt=(
                "A small standing fox creature of painted wood and stitched fabric, large amber glass eyes that are not light sources, "
                "tiny brown corduroy vest. Standing on a wooden table at night. "
                "One warm table lamp in frame at camera left, visible shade, lighting the creature. "
                "Clean contemporary character photograph: natural night color, moderate contrast, sharp focus, "
                "no film effects, no extra glow, no grain. Eyes stay glass. Full body, 50mm-equivalent, square 1:1 frame."
            ),
        ),
    ]


def study_vector_ids() -> list[str]:
    return ["vec_optical_softness", "vec_shadow_density", "vec_halation"]


def edit_prompt(lock_reminder: str, vector_name: str, phrase: str, extra_hold: str) -> str:
    return (
        f"Preserve the same subject, identity, pose, framing, crop, camera position, "
        f"and key-light direction. Do not change wardrobe, props, or scene content. "
        f"Do not restyle the picture into a period look, a movie still, or a genre. "
        f"{lock_reminder} "
        f"Change only {vector_name}. Set {vector_name} to: {phrase}. "
        f"{extra_hold}"
    )


def extra_hold_for(vector_id: str) -> str:
    holds = {
        "vec_optical_softness": (
            "Do not add grain, do not change color grade, do not change lighting ratio, "
            "and do not add colored highlight bleed."
        ),
        "vec_shadow_density": (
            "Change only the mass of the darks as a grade. Do not move the key. "
            "Do not add or remove fill as a lamp. Do not harden the key into a new window. "
            "Do not invent a new cast-shadow edge. Do not lift or crush the black floor as fog. "
            "Do not add haze, grain, softness, hue, time of day, or a genre."
        ),
        "vec_black_level": (
            "Change only the black floor. High means lifted milky blacks, not crushed blacks. "
            "Do not add fill light. Do not change key direction. Do not add haze or diffusion. "
            "Do not ink mid-shadows as a density sweep. Do not change sharpness, grain, hue, or time of day."
        ),
        "vec_key_to_fill_ratio": (
            "Change only fill strength versus key. Keep the key on the same side. "
            "Do not rotate the key. Do not harden it into a new sun or window. "
            "Do not add lamps, rims, or glowing eyes. Do not add grain, softness, hue, time of day, or a genre."
        ),
        "vec_halation": (
            "Bleed only lamps and speculars already in the source image. "
            "Do not add lamps, rims, suns, or glowing eyes. Do not globally soften. "
            "Do not change time of day. Do not move the key. Do not add grain or a genre."
        ),
        "vec_highlight_bloom": (
            "Glow only existing bright regions. Do not add lamps, rims, suns, or glowing eyes. "
            "Do not turn the scene into a sunset. Do not globally soften the whole frame. "
            "Do not add grain, hue shift, or a genre."
        ),
        "vec_edge_softness": (
            "Change only edge width. Do not add a diffusion veil, do not spread highlight cores, "
            "do not add circular bokeh orbs, do not glow the eyes, do not change lighting, "
            "do not change time of day, do not add grain, and do not restyle into a genre."
        ),
        "vec_diffusion": (
            "Change only the scattering veil. Do not defocus the subject, do not add circular bokeh "
            "orbs on in-focus surfaces, do not glow the eyes, do not change lighting direction, "
            "do not change time of day, do not add grain, and do not restyle into a genre."
        ),
        "vec_bokeh_softness": (
            "Change only the out-of-focus field. Keep the subject plane sharp. "
            "Do not paint bokeh disks onto in-focus surfaces, do not melt the whole frame, "
            "do not glow the eyes, do not change lighting, do not change time of day, "
            "and do not restyle into a genre."
        ),
        "vec_telecine_softness": (
            "Change only transfer-path smear. Do not add scanlines, tracking bars, a CRT bezel, "
            "or a television set. Do not add film grain. Do not melt like a portrait lens. "
            "Do not add a diffusion veil. Do not change lighting, time of day, hue, or restyle into a decade or genre."
        ),
        "vec_analog_video_texture": (
            "Change only analog video texture. Do not add extra optical softness or diffusion. "
            "Do not add a CRT bezel, letterbox, or tracking-error bars. "
            "Do not change lighting, time of day, or restyle into a decade or genre. "
            "Do not add photochemical grain clumps."
        ),
    }
    return holds.get(vector_id, "Do not change any other visual dimension.")
