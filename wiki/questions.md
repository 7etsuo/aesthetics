# Unresolved research questions

## black level (`vec_black_level`)
- Can black lift be isolated from haze and veiling glare?

## bokeh softness (`vec_bokeh_softness`)
- Should architecture be excluded from bokeh tests, or is failure itself evidence?

## diffusion (`vec_diffusion`)
- How much of the high pole is atmospheric haze rather than a filter veil?

## edge softness (`vec_edge_softness`)
- Is there any prompt that thickens contours without defocusing the subject?

## halation (`vec_halation`)
- Does Imagine ever produce red-edge film bleed without inventing a new light?
- Should the working definition split into local bleed vs silhouette aura?

## optical softness (`vec_optical_softness`)
- Can high softness be produced without bloom orbs or glowing eyes?
- Is the landscape high pole DOF or optical softness?
- Should edge softness be retired as a near-alias?

## practical-material feel (`vec_practical_material_feel`)
- Parent or composite? Split into roughness, paint, latex, fabric?

## shadow density (`vec_shadow_density`)
- Can density move with lighting ratio held?
- Where does black level end and shadow density begin on these anchors?

## telecine softness (`vec_telecine_softness`)
- Needs a controlled study against optical softness and VHS bandwidth loss.

## From study_bokeh_softness_001
- Bokeh study only on frames that already have a clear subject/field split.

## From study_diffusion_001
- Diffusion vs veiling glare vs atmospheric haze on the gallery and portrait only.

## From study_edge_softness_001
- If kept, test a weaker high phrase: thicken outlines only, keep pores and glaze texture.

## From study_halation_001
- Rerun halation on a night interior that already contains lamps.
- Discrimination: halation vs highlight bloom vs final bloom vs veiling glare.

## From study_optical_softness_001
- Treat optical softness as a parent cluster: edge melt plus some bloom. Do not merge it with diffusion or bokeh.
- Add a mid-high step (0.65) because medium is too close to the anchor.

## From study_reconstruction_soft_halated_shadow_001
- Raise only shadow density after a soft reconstruction (sequential, not simultaneous).
- Fit weights by comparing reconstruction scores to isolated high poles.

## From study_shadow_density_001
- Hold lighting by prompting: keep the same key and fill, change only the tone curve of the darks.
- Paired study of shadow density vs key-to-fill vs black level on the same anchors.
