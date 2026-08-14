# Unresolved research questions

## analog video texture (`vec_analog_video_texture`)
- Can texture land on the fox without a letterbox?

## black level (`vec_black_level`)
- Is the still-life high too weak to keep this as a working axis?

## bokeh softness (`vec_bokeh_softness`)
- Should architecture be excluded from bokeh tests, or is failure itself evidence?

## diffusion (`vec_diffusion`)
- How much of the high pole is atmospheric haze rather than a filter veil?

## edge softness (`vec_edge_softness`)
- Is there any prompt that thickens contours without defocusing the subject?

## halation (`vec_halation`)
- Is the leftover far-edge red wash bloom, grade, or a second bleed?

## highlight bloom (`vec_highlight_bloom`)
- How much bar bloom is actually atmospheric haze?

## key-to-fill ratio (`vec_key_to_fill_ratio`)
- Can ratio rise on the teapot without a new hard window?

## optical softness (`vec_optical_softness`)
- Can high softness be produced without bloom orbs or glowing eyes?
- Is the landscape high pole DOF or optical softness?
- Should edge softness be retired as a near-alias?

## practical-material feel (`vec_practical_material_feel`)
- Parent or composite? Split into roughness, paint, latex, fabric?

## shadow density (`vec_shadow_density`)
- Can object density rise without recoloring props?
- How much fill drop is allowed before this is key-to-fill?

## telecine softness (`vec_telecine_softness`)
- Can object high be raised without becoming optical melt?
- How much of the gallery chroma fringe is VHS bandwidth rather than telecine?

## From study_analog_video_texture_001
- VHS bandwidth loss versus this texture if a tape-only look is needed.

## From study_black_level_001
- Black level vs veiling glare on the gallery only.

## From study_bokeh_softness_001
- Bokeh study only on frames that already have a clear subject/field split.

## From study_diffusion_001
- Diffusion vs veiling glare vs atmospheric haze on the gallery and portrait only.

## From study_edge_softness_001
- If kept, test a weaker high phrase: thicken outlines only, keep pores and glaze texture.

## From study_halation_001
- See study_halation_002 for the lamp-present sweep.

## From study_halation_002
- Optical versus telecine on the original daylight anchors.

## From study_highlight_bloom_001
- Bloom versus final bloom versus veiling glare if a finishing layer is needed.

## From study_key_to_fill_ratio_001
- Key-to-fill vs source hardness on the teapot only, with an explicit hold against new window edges.

## From study_optical_softness_001
- Treat optical softness as a parent cluster: edge melt plus some bloom. Do not merge it with diffusion or bokeh.
- Add a mid-high step (0.65) because medium is too close to the anchor.

## From study_reconstruction_soft_halated_shadow_001
- Raise only shadow density after a soft reconstruction (sequential, not simultaneous).
- Fit weights by comparing reconstruction scores to isolated high poles.

## From study_shadow_density_001
- See study_shadow_density_002 for the clean density sweep.

## From study_shadow_density_002
- Retry object high with an explicit hold: keep the napkin the same linen color.

## From study_telecine_softness_001
- Sequential reconstruction using vectors that earned a coefficient.
