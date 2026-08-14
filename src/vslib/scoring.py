"""Apply visual-audit scores to the milestone studies."""

from __future__ import annotations

from vslib.models import ReconstructionEval, Score
from vslib.store import Library

WATCH = [
    "vec_optical_softness",
    "vec_edge_softness",
    "vec_microcontrast",
    "vec_diffusion",
    "vec_halation",
    "vec_highlight_bloom",
    "vec_bokeh_softness",
    "vec_shadow_density",
    "vec_black_level",
    "vec_key_to_fill_ratio",
    "vec_source_hardness",
    "vec_highlight_rolloff",
]


def _s(vector_id: str, score: float, confidence: float, method: str = "agent_visual") -> Score:
    return Score(vector_id=vector_id, score=round(score, 2), confidence=round(confidence, 2), method=method)


def _pack(values: dict[str, tuple[float, float]]) -> list[Score]:
    return [_s(k, v, c) for k, (v, c) in values.items()]


def score_baseline() -> list[Score]:
    return _pack({
        "vec_optical_softness": (0.18, 0.72),
        "vec_edge_softness": (0.16, 0.68),
        "vec_microcontrast": (0.64, 0.70),
        "vec_diffusion": (0.08, 0.60),
        "vec_halation": (0.04, 0.70),
        "vec_highlight_bloom": (0.06, 0.66),
        "vec_bokeh_softness": (0.10, 0.55),
        "vec_shadow_density": (0.30, 0.68),
        "vec_black_level": (0.22, 0.60),
        "vec_key_to_fill_ratio": (0.28, 0.58),
        "vec_source_hardness": (0.32, 0.55),
        "vec_highlight_rolloff": (0.35, 0.50),
    })


def score_optical(obs) -> tuple[list[Score], list[str], str]:
    level = obs.intended_level
    target = {"low": 0.14, "medium": 0.46, "high": 0.84}[level]
    values = {
        "vec_optical_softness": (target, 0.78),
        "vec_edge_softness": (target * 0.88, 0.70),
        "vec_microcontrast": (max(0.08, 0.70 - target * 0.62), 0.66),
        "vec_diffusion": (target * 0.45, 0.55),
        "vec_halation": (0.08, 0.60),
        "vec_highlight_bloom": (0.10, 0.60),
        "vec_bokeh_softness": (0.10, 0.50),
        "vec_shadow_density": (0.28, 0.50),
        "vec_black_level": (0.22, 0.45),
        "vec_key_to_fill_ratio": (0.28, 0.45),
        "vec_source_hardness": (0.30, 0.40),
        "vec_highlight_rolloff": (0.38 + target * 0.15, 0.45),
    }
    leaks: list[str] = []
    note = f"Intended optical softness {level}."
    if level == "medium":
        note += " Medium is only a small step from the anchor on most subjects."
        values["vec_optical_softness"] = (0.40, 0.62)
    if level == "high":
        if obs.anchor_id == "anchor_object":
            values["vec_highlight_bloom"] = (0.88, 0.82)
            values["vec_bokeh_softness"] = (0.80, 0.78)
            values["vec_halation"] = (0.35, 0.50)
            leaks += ["invented circular bloom orbs on the pot", "global defocus beyond lens softness"]
            note += " High pole leaked into fake bokeh balls."
        elif obs.anchor_id == "anchor_character":
            values["vec_halation"] = (0.70, 0.76)
            values["vec_highlight_bloom"] = (0.68, 0.74)
            leaks += ["glass eyes became light sources"]
            note += " Softness dragged glowing-eye bloom."
        elif obs.anchor_id == "anchor_landscape":
            values["vec_bokeh_softness"] = (0.58, 0.70)
            values["vec_highlight_bloom"] = (0.50, 0.66)
            leaks += ["tilt-shift / DOF pattern", "invented sun glints on water"]
            note += " High pole looks like shallow focus plus bloom, not only optical melt."
        elif obs.anchor_id == "anchor_architecture":
            values["vec_highlight_bloom"] = (0.42, 0.64)
            leaks += ["skylight bloom"]
            note += " Stone joints melt; skylight spreads."
        elif obs.anchor_id == "anchor_portrait":
            values["vec_highlight_bloom"] = (0.28, 0.60)
            values["vec_edge_softness"] = (0.80, 0.76)
            note += " Cleanest high pole: knit and hair melt, identity held."
    return _pack(values), leaks, note


def score_shadow(obs) -> tuple[list[Score], list[str], str]:
    level = obs.intended_level
    target = {"low": 0.16, "medium": 0.42, "high": 0.86}[level]
    values = {
        "vec_shadow_density": (target, 0.80),
        "vec_black_level": (0.20 + target * 0.45, 0.62),
        "vec_key_to_fill_ratio": (0.26 + target * 0.35, 0.58),
        "vec_source_hardness": (0.30, 0.48),
        "vec_optical_softness": (0.18, 0.55),
        "vec_edge_softness": (0.16, 0.50),
        "vec_microcontrast": (0.55, 0.50),
        "vec_halation": (0.05, 0.55),
        "vec_highlight_bloom": (0.06, 0.50),
        "vec_bokeh_softness": (0.08, 0.40),
        "vec_diffusion": (0.08, 0.40),
        "vec_highlight_rolloff": (0.32, 0.40),
    }
    leaks: list[str] = []
    note = f"Intended shadow density {level}."
    if level == "low":
        values["vec_key_to_fill_ratio"] = (0.18, 0.55)
        note += " Opened shadows, sometimes by flattening lighting contrast."
    if level == "high":
        if obs.anchor_id == "anchor_object":
            values["vec_key_to_fill_ratio"] = (0.84, 0.82)
            values["vec_source_hardness"] = (0.72, 0.78)
            leaks += ["restaged to a hard window-like key", "new handle shadow on the napkin"]
            note += " Imagine relit the still life instead of only inking the darks."
        elif obs.anchor_id == "anchor_portrait":
            values["vec_key_to_fill_ratio"] = (0.78, 0.80)
            leaks += ["fill removed; lighting ratio rose with density"]
            note += " Face key survives; fill and backdrop crush."
        elif obs.anchor_id == "anchor_architecture":
            values["vec_key_to_fill_ratio"] = (0.46, 0.55)
            note += " Room darkens while the skylight stays. Cleaner isolation than the object."
        elif obs.anchor_id == "anchor_landscape":
            values["vec_key_to_fill_ratio"] = (0.40, 0.52)
            note += " Ground and cliff ink up; sky stays. Some global underexposure."
        elif obs.anchor_id == "anchor_character":
            values["vec_key_to_fill_ratio"] = (0.62, 0.60)
            note += " Contact shadow and form shadow both deepen."
    return _pack(values), leaks, note


def score_halation(obs) -> tuple[list[Score], list[str], str]:
    level = obs.intended_level
    target = {"low": 0.08, "medium": 0.38, "high": 0.72}[level]
    values = {
        "vec_halation": (target, 0.62),
        "vec_highlight_bloom": (target * 0.85, 0.64),
        "vec_optical_softness": (0.20 + target * 0.15, 0.55),
        "vec_edge_softness": (0.16, 0.50),
        "vec_microcontrast": (0.58, 0.48),
        "vec_diffusion": (0.12 + target * 0.2, 0.45),
        "vec_shadow_density": (0.30, 0.45),
        "vec_black_level": (0.22, 0.40),
        "vec_key_to_fill_ratio": (0.28, 0.40),
        "vec_source_hardness": (0.30, 0.40),
        "vec_bokeh_softness": (0.08, 0.35),
        "vec_highlight_rolloff": (0.40 + target * 0.2, 0.45),
    }
    leaks: list[str] = []
    note = f"Intended halation {level}."
    if level == "low":
        note += " Highlights stay local. Closest to a true low pole."
        values["vec_halation"] = (0.06, 0.72)
        values["vec_highlight_bloom"] = (0.06, 0.70)
    if level == "high":
        if obs.anchor_id == "anchor_architecture":
            values["vec_halation"] = (0.74, 0.72)
            values["vec_highlight_bloom"] = (0.60, 0.68)
            note += " Warm bleed from the skylight into the ceiling is the closest film-like result."
        elif obs.anchor_id == "anchor_portrait":
            values["vec_halation"] = (0.58, 0.60)
            values["vec_highlight_bloom"] = (0.55, 0.62)
            values["vec_key_to_fill_ratio"] = (0.40, 0.48)
            leaks += ["warm halo around the hairline reads as invented rim light"]
            note += " Glow sits on the silhouette, not on existing speculars."
        elif obs.anchor_id == "anchor_object":
            values["vec_halation"] = (0.66, 0.64)
            values["vec_highlight_bloom"] = (0.70, 0.70)
            values["vec_key_to_fill_ratio"] = (0.48, 0.55)
            leaks += ["silhouette glow", "new shadow band on the napkin"]
            note += " Object outline glows; lighting also shifted."
        elif obs.anchor_id == "anchor_character":
            values["vec_halation"] = (0.60, 0.58)
            values["vec_highlight_bloom"] = (0.64, 0.66)
            values["vec_key_to_fill_ratio"] = (0.52, 0.58)
            leaks += ["invented backlight / rim", "warm patch on vest"]
            note += " Added a light that was not in the anchor."
        elif obs.anchor_id == "anchor_landscape":
            values["vec_halation"] = (0.45, 0.50)
            values["vec_highlight_bloom"] = (0.78, 0.74)
            values["vec_highlight_color_bias"] = (0.55, 0.55)
            leaks += ["invented sun disc", "time-of-day / grade change"]
            note += " Became a sunset, not local highlight bleed."
    return _pack(values), leaks, note


def score_reconstruction(obs) -> tuple[list[Score], list[str], str, float, list[str]]:
    values = {
        "vec_optical_softness": (0.72, 0.70),
        "vec_shadow_density": (0.48, 0.62),
        "vec_halation": (0.52, 0.58),
        "vec_highlight_bloom": (0.58, 0.66),
        "vec_edge_softness": (0.64, 0.60),
        "vec_microcontrast": (0.28, 0.58),
        "vec_diffusion": (0.40, 0.50),
        "vec_bokeh_softness": (0.22, 0.45),
        "vec_black_level": (0.40, 0.50),
        "vec_key_to_fill_ratio": (0.42, 0.48),
        "vec_source_hardness": (0.30, 0.40),
        "vec_highlight_rolloff": (0.50, 0.45),
    }
    leaks: list[str] = []
    residual = ["vec_highlight_bloom"]
    score = 0.58
    note = "Linear reconstruction from optical softness, shadow density, and mild halation."
    if obs.anchor_id == "anchor_portrait":
        values["vec_optical_softness"] = (0.80, 0.76)
        values["vec_shadow_density"] = (0.55, 0.64)
        values["vec_halation"] = (0.50, 0.60)
        values["vec_highlight_bloom"] = (0.62, 0.70)
        score = 0.62
        note += " Softness and a dark surround landed. Halation became face bloom. Shadow mass is weaker than the isolated high pole."
    elif obs.anchor_id == "anchor_object":
        values["vec_optical_softness"] = (0.60, 0.66)
        values["vec_shadow_density"] = (0.40, 0.58)
        values["vec_highlight_bloom"] = (0.72, 0.74)
        leaks += ["hot bloom on the pot body"]
        score = 0.52
        residual += ["vec_shadow_density"]
        note += " Bloom overshot. Darks did not reach the isolated high-density still life."
    elif obs.anchor_id == "anchor_character":
        values["vec_optical_softness"] = (0.58, 0.64)
        values["vec_shadow_density"] = (0.38, 0.56)
        values["vec_halation"] = (0.78, 0.72)
        values["vec_highlight_bloom"] = (0.76, 0.74)
        leaks += ["eyes became lamps"]
        score = 0.48
        residual += ["vec_halation"]
        note += " Softness and glow landed. Eyes overfired. Shadow density stayed mild."
    elif obs.anchor_id == "anchor_architecture":
        values["vec_optical_softness"] = (0.88, 0.78)
        values["vec_bokeh_softness"] = (0.55, 0.60)
        values["vec_shadow_density"] = (0.48, 0.58)
        values["vec_highlight_bloom"] = (0.74, 0.72)
        leaks += ["whole-frame defocus", "orb glow in the skylight"]
        score = 0.50
        residual += ["vec_optical_softness"]
        note += " Softness overshot into defocus. Warm skylight orbs appeared."
    elif obs.anchor_id == "anchor_landscape":
        values["vec_optical_softness"] = (0.70, 0.60)
        values["vec_shadow_density"] = (0.52, 0.58)
        values["vec_highlight_bloom"] = (0.55, 0.55)
        score = 0.54
        note += " Combined darkening and melt. Residual bloom risk from the isolated high poles."
    return _pack(values), leaks, note, score, residual


def _cluster_base(level: str) -> dict[str, tuple[float, float]]:
    return {
        "vec_optical_softness": (0.18, 0.55),
        "vec_edge_softness": (0.16, 0.55),
        "vec_diffusion": (0.08, 0.55),
        "vec_bokeh_softness": (0.10, 0.50),
        "vec_microcontrast": (0.60, 0.50),
        "vec_halation": (0.06, 0.50),
        "vec_highlight_bloom": (0.08, 0.50),
        "vec_veiling_glare": (0.08, 0.45),
        "vec_shadow_density": (0.28, 0.40),
        "vec_black_level": (0.22, 0.40),
        "vec_key_to_fill_ratio": (0.28, 0.35),
        "vec_source_hardness": (0.30, 0.35),
        "vec_highlight_rolloff": (0.35, 0.35),
    }


def score_edge(obs) -> tuple[list[Score], list[str], str]:
    level = obs.intended_level
    target = {"low": 0.12, "medium": 0.40, "high": 0.72}[level]
    values = _cluster_base(level)
    values["vec_edge_softness"] = (target, 0.62)
    values["vec_optical_softness"] = (0.16 + target * 0.55, 0.60)
    values["vec_microcontrast"] = (max(0.12, 0.64 - target * 0.40), 0.50)
    leaks: list[str] = []
    note = f"Intended edge softness {level}."
    if level == "high":
        if obs.anchor_id == "anchor_object":
            values["vec_optical_softness"] = (0.78, 0.74)
            values["vec_edge_softness"] = (0.70, 0.58)
            values["vec_bokeh_softness"] = (0.22, 0.45)
            leaks += ["whole-subject defocus, not contour width only"]
            note += " Teapot high is optical melt. Isolation failed."
        elif obs.anchor_id == "anchor_portrait":
            values["vec_optical_softness"] = (0.62, 0.68)
            values["vec_edge_softness"] = (0.70, 0.64)
            note += " Hair outline melts. Face and knit still read. Near optical softness."
        elif obs.anchor_id == "anchor_character":
            values["vec_edge_softness"] = (0.58, 0.62)
            values["vec_optical_softness"] = (0.40, 0.58)
            note += " Mild contour melt. Stitches survive. Closest to an edge-only result."
        elif obs.anchor_id == "anchor_architecture":
            values["vec_edge_softness"] = (0.48, 0.50)
            values["vec_optical_softness"] = (0.45, 0.50)
            note += " Stone joints lose a little snap. Weak step."
        elif obs.anchor_id == "anchor_landscape":
            values["vec_edge_softness"] = (0.52, 0.52)
            values["vec_optical_softness"] = (0.48, 0.52)
            note += " Grass and cliff edges soften with the whole field."
    return _pack(values), leaks, note


def score_diffusion(obs) -> tuple[list[Score], list[str], str]:
    level = obs.intended_level
    target = {"low": 0.08, "medium": 0.42, "high": 0.82}[level]
    values = _cluster_base(level)
    values["vec_diffusion"] = (target, 0.76)
    values["vec_optical_softness"] = (0.18 + target * 0.18, 0.58)
    values["vec_edge_softness"] = (0.16 + target * 0.12, 0.52)
    values["vec_veiling_glare"] = (0.10 + target * 0.35, 0.55)
    values["vec_black_level"] = (0.22 + target * 0.20, 0.50)
    leaks: list[str] = []
    note = f"Intended diffusion {level}."
    if level == "high":
        if obs.anchor_id == "anchor_architecture":
            values["vec_diffusion"] = (0.88, 0.82)
            values["vec_atmospheric_haze_response"] = (0.80, 0.74)
            values["vec_edge_softness"] = (0.22, 0.60)
            leaks += ["volumetric god rays", "atmosphere occupies the room"]
            note += " Strong veil with the bench still edged. Best isolation in the cluster."
        elif obs.anchor_id == "anchor_portrait":
            values["vec_diffusion"] = (0.84, 0.80)
            values["vec_atmospheric_haze_response"] = (0.70, 0.70)
            leaks += ["invented light shafts around the head"]
            note += " Scattering mist around a still-readable face and knit."
        elif obs.anchor_id == "anchor_object":
            values["vec_diffusion"] = (0.80, 0.76)
            leaks += ["volumetric light, some contrast shift"]
            note += " Haze around the pot. Highlight cores stay tighter than optical-softness high."
        elif obs.anchor_id == "anchor_landscape":
            values["vec_diffusion"] = (0.78, 0.70)
            values["vec_highlight_bloom"] = (0.62, 0.68)
            leaks += ["invented sun and flare orbs"]
            note += " Atmosphere lands. Time-of-day and flare leak."
        elif obs.anchor_id == "anchor_character":
            values["vec_diffusion"] = (0.72, 0.70)
            note += " Veil over a still-stitched creature."
    return _pack(values), leaks, note


def score_bokeh(obs) -> tuple[list[Score], list[str], str]:
    level = obs.intended_level
    target = {"low": 0.14, "medium": 0.46, "high": 0.80}[level]
    values = _cluster_base(level)
    values["vec_bokeh_softness"] = (target, 0.74)
    values["vec_optical_softness"] = (0.16, 0.55)
    values["vec_edge_softness"] = (0.14, 0.50)
    leaks: list[str] = []
    note = f"Intended bokeh softness {level}."
    if level == "high":
        if obs.anchor_id == "anchor_object":
            values["vec_bokeh_softness"] = (0.88, 0.84)
            values["vec_optical_softness"] = (0.18, 0.70)
            note += " Pot stays sharp. Wall creams. Cleanest isolation."
        elif obs.anchor_id == "anchor_character":
            values["vec_bokeh_softness"] = (0.86, 0.82)
            values["vec_optical_softness"] = (0.20, 0.68)
            leaks += ["invented backdrop folds so the field could dissolve"]
            note += " Fox stays sharp. Field creams. Eyes do not become lamps."
        elif obs.anchor_id == "anchor_portrait":
            values["vec_bokeh_softness"] = (0.80, 0.78)
            values["vec_optical_softness"] = (0.22, 0.64)
            leaks += ["backdrop given more drape so it could go out of focus"]
            note += " Face stays sharp. Seamless goes creamy."
        elif obs.anchor_id == "anchor_landscape":
            values["vec_bokeh_softness"] = (0.70, 0.68)
            values["vec_optical_softness"] = (0.28, 0.55)
            note += " Path and near grass hold. Sea and horizon cream."
        elif obs.anchor_id == "anchor_architecture":
            values["vec_bokeh_softness"] = (0.42, 0.50)
            values["vec_optical_softness"] = (0.78, 0.76)
            leaks += ["no subject plane; whole gallery defocuses"]
            note += " Isolation failed. Deep-focus room becomes global softness."
    return _pack(values), leaks, note


def apply_scores(lib: Library) -> None:
    for obs in lib.observations.values():
        if obs.study_id == "study_anchor_set_001":
            obs.scores = score_baseline()
            if "Baseline scores" not in (obs.notes or ""):
                obs.notes = ((obs.notes or "") + " Baseline scores for the locked anchor.").strip()
            continue
        if obs.study_id == "study_optical_softness_001":
            scores, leaks, note = score_optical(obs)
        elif obs.study_id == "study_shadow_density_001":
            scores, leaks, note = score_shadow(obs)
        elif obs.study_id == "study_halation_001":
            scores, leaks, note = score_halation(obs)
        elif obs.study_id == "study_edge_softness_001":
            scores, leaks, note = score_edge(obs)
        elif obs.study_id == "study_diffusion_001":
            scores, leaks, note = score_diffusion(obs)
        elif obs.study_id == "study_bokeh_softness_001":
            scores, leaks, note = score_bokeh(obs)
        elif obs.study_id == "study_reconstruction_soft_halated_shadow_001":
            scores, leaks, note, recon, residual = score_reconstruction(obs)
            ev = ReconstructionEval(
                id=f"recon_{obs.id}",
                target_aesthetic_id="aes_soft_halated_shadow",
                observation_id=obs.id,
                method="weighted_prompt_from_W",
                reconstruction_score=recon,
                human_rating=None,
                residual_vectors=residual,
                notes=note,
                date=obs.date,
            )
            lib.reconstructions[ev.id] = ev
        else:
            continue
        obs.scores = scores
        obs.unintended_changes = leaks
        obs.notes = note

    _close_studies(lib)
    _update_vectors(lib)
    aes = lib.aesthetics["aes_soft_halated_shadow"]
    aes.observation_ids = list(lib.studies["study_reconstruction_soft_halated_shadow_001"].observation_ids)
    aes.study_ids = ["study_reconstruction_soft_halated_shadow_001"]
    aes.confidence = 0.56
    aes.revision = 1


def _close_studies(lib: Library) -> None:
    soft = lib.studies["study_optical_softness_001"]
    soft.status = "complete"
    soft.decision = "provisional"
    soft.decision_reason = (
        "Low versus high is visible on all five anchors. The change is transferable. "
        "It is not cleanly isolated: high settings often add bloom, fake bokeh, glowing speculars, "
        "or a tilt-shift focus pattern. Medium is a weak step. Keep as provisional, not canonical."
    )
    soft.entanglement_notes = [
        "High optical softness co-produces highlight bloom and, on the teapot, circular orbs.",
        "Character high turns glass eyes into lamps (halation leak).",
        "Landscape high behaves like shallow DOF more than like a uniform optical melt.",
        "Microcontrast falls whenever softness rises. Inverse test still needed.",
    ]
    soft.next_experiments = [
        "Treat optical softness as a parent cluster: edge melt plus some bloom. Do not merge it with diffusion or bokeh.",
        "Add a mid-high step (0.65) because medium is too close to the anchor.",
    ]
    if "study_edge_softness_001" in lib.studies:
        soft.entanglement_notes.append(
            "Discrimination 002: edge softness usually collapses into this vector. Diffusion and bokeh do not."
        )

    sh = lib.studies["study_shadow_density_001"]
    sh.status = "complete"
    sh.decision = "provisional"
    sh.decision_reason = (
        "Darks do get heavier across subjects. The instrument often restages lighting to do it, "
        "especially on the teapot (new hard key and cast shadow) and the portrait (fill removed). "
        "Architecture and landscape are closer to a tone-mapping change. Not yet canonical."
    )
    sh.entanglement_notes = [
        "Shadow density and key-to-fill ratio move together in Imagine edits.",
        "Object high changed source hardness, not only density.",
        "Low pole sometimes flattens lighting instead of lifting only the toe.",
    ]
    sh.next_experiments = [
        "Hold lighting by prompting: keep the same key and fill, change only the tone curve of the darks.",
        "Paired study of shadow density vs key-to-fill vs black level on the same anchors.",
    ]

    ha = lib.studies["study_halation_001"]
    ha.status = "complete"
    ha.decision = "provisional"
    ha.decision_reason = (
        "A glow appears at the high pole, but it is rarely film-base bleed around existing highlights. "
        "Imagine invents rim lights, sunsets, or silhouette auras. Architecture around the skylight "
        "is the best local-bleed example. Keep provisional."
    )
    ha.entanglement_notes = [
        "Halation and highlight bloom are not separated by the current prompts.",
        "Scenes without strong practicals grow new lights instead of bleeding old ones.",
        "Landscape high changed time of day.",
    ]
    ha.next_experiments = [
        "Rerun halation on a night interior that already contains lamps.",
        "Discrimination: halation vs highlight bloom vs final bloom vs veiling glare.",
    ]

    rec = lib.studies["study_reconstruction_soft_halated_shadow_001"]
    rec.status = "complete"
    rec.decision = "linear_partial"
    rec.decision_reason = (
        "The weighted prompt moved all five anchors toward softness plus some darkening plus glow. "
        "Linear combination is a usable first-order control. Residual bloom and invented eye/sun lights "
        "show the linear model is incomplete, but not yet enough to require a tensor term. "
        "Record pairwise notes and keep the model linear."
    )
    rec.entanglement_notes = [
        "Softness and bloom still co-occur in the reconstruction.",
        "Shadow density under-expresses relative to its isolated high pole.",
    ]
    rec.next_experiments = [
        "Raise only shadow density after a soft reconstruction (sequential, not simultaneous).",
        "Fit weights by comparing reconstruction scores to isolated high poles.",
    ]

    if "study_edge_softness_001" in lib.studies:
        edge = lib.studies["study_edge_softness_001"]
        edge.status = "complete"
        edge.decision = "near_alias"
        edge.decision_reason = (
            "High edge softness usually melts the whole subject, especially the teapot. "
            "That is optical softness, not contour width. The fox is the only mild edge-only result. "
            "Treat as a near-alias or child of optical softness on this instrument."
        )
        edge.entanglement_notes = [
            "Object high is global defocus.",
            "Portrait high melts hair and face together.",
            "No circular orbs and no glowing eyes. The hold against those leaks worked.",
        ]
        edge.next_experiments = [
            "If kept, test a weaker high phrase: thicken outlines only, keep pores and glaze texture.",
        ]

    if "study_diffusion_001" in lib.studies:
        diff = lib.studies["study_diffusion_001"]
        diff.status = "complete"
        diff.decision = "provisional"
        diff.decision_reason = (
            "High diffusion adds a scattering veil while edges stay closer to the source than in "
            "optical-softness highs. Architecture and portrait isolate it best. Landscape invents a sun. "
            "Distinct enough to stay in the basis as provisional."
        )
        diff.entanglement_notes = [
            "Often co-produces atmospheric haze and god rays.",
            "Landscape high adds flare orbs and a time-of-day shift.",
        ]
        diff.next_experiments = [
            "Diffusion vs veiling glare vs atmospheric haze on the gallery and portrait only.",
        ]

    if "study_bokeh_softness_001" in lib.studies:
        bok = lib.studies["study_bokeh_softness_001"]
        bok.status = "complete"
        bok.decision = "provisional"
        bok.decision_reason = (
            "When a subject plane exists, the field creams and the subject stays sharp: teapot, fox, portrait. "
            "The deep-focus gallery has no plane, so the whole room defocuses. Distinct, conditional on geometry."
        )
        bok.entanglement_notes = [
            "Portrait and fox gained invented backdrop folds so the field could dissolve.",
            "Architecture high is optical softness, not bokeh.",
        ]
        bok.next_experiments = [
            "Bokeh study only on frames that already have a clear subject/field split.",
        ]

    anchors = lib.studies["study_anchor_set_001"]
    anchors.status = "complete"
    anchors.decision = "locked"
    anchors.decision_reason = "Five anchors generated and reused as edit sources. Seed control remains unavailable."


def _update_vectors(lib: Library) -> None:
    soft = lib.vectors["vec_optical_softness"]
    soft.status = "provisional"
    soft.confidence = 0.64
    soft.validation = {
        "isolatable": "partial",
        "transferable": True,
        "legible": True,
        "describable": True,
        "non_redundant": "distinct_from_diffusion_and_bokeh",
        "directional": True,
        "useful": True,
        "n_subjects": 5,
        "n_levels": 3,
        "parent_of": ["vec_edge_softness"],
    }
    soft.open_questions = [
        "Can high softness be produced without bloom orbs or glowing eyes?",
        "Is the landscape high pole DOF or optical softness?",
        "Should edge softness be retired as a near-alias?",
    ]

    if "vec_edge_softness" in lib.vectors:
        ev = lib.vectors["vec_edge_softness"]
        ev.status = "provisional"
        ev.confidence = 0.36
        ev.validation = {
            "isolatable": "weak",
            "transferable": "partial",
            "legible": True,
            "describable": True,
            "non_redundant": False,
            "decision": "near_alias_of_optical_softness",
            "directional": True,
            "useful": "low",
            "n_subjects": 5,
            "n_levels": 3,
        }
        ev.open_questions = [
            "Is there any prompt that thickens contours without defocusing the subject?",
        ]

    if "vec_diffusion" in lib.vectors:
        dv = lib.vectors["vec_diffusion"]
        dv.status = "provisional"
        dv.confidence = 0.67
        dv.validation = {
            "isolatable": "partial",
            "transferable": True,
            "legible": True,
            "describable": True,
            "non_redundant": True,
            "directional": True,
            "useful": True,
            "n_subjects": 5,
            "n_levels": 3,
        }
        dv.open_questions = [
            "How much of the high pole is atmospheric haze rather than a filter veil?",
        ]

    if "vec_bokeh_softness" in lib.vectors:
        bv = lib.vectors["vec_bokeh_softness"]
        bv.status = "provisional"
        bv.confidence = 0.62
        bv.validation = {
            "isolatable": "conditional",
            "transferable": "when_subject_plane_exists",
            "legible": True,
            "describable": True,
            "non_redundant": True,
            "directional": True,
            "useful": True,
            "n_subjects": 5,
            "n_levels": 3,
        }
        bv.open_questions = [
            "Should architecture be excluded from bokeh tests, or is failure itself evidence?",
        ]

    sh = lib.vectors["vec_shadow_density"]
    sh.status = "provisional"
    sh.confidence = 0.58
    sh.validation = {
        "isolatable": "partial",
        "transferable": True,
        "legible": True,
        "describable": True,
        "non_redundant": "pending_vs_key_to_fill",
        "directional": True,
        "useful": True,
        "n_subjects": 5,
        "n_levels": 3,
    }
    sh.open_questions = [
        "Can density move with lighting ratio held?",
        "Where does black level end and shadow density begin on these anchors?",
    ]

    ha = lib.vectors["vec_halation"]
    ha.status = "provisional"
    ha.confidence = 0.49
    ha.validation = {
        "isolatable": "weak",
        "transferable": "partial",
        "legible": True,
        "describable": True,
        "non_redundant": "pending_vs_bloom",
        "directional": True,
        "useful": "conditional",
        "n_subjects": 5,
        "n_levels": 3,
    }
    ha.open_questions = [
        "Does Imagine ever produce red-edge film bleed without inventing a new light?",
        "Should the working definition split into local bleed vs silhouette aura?",
    ]
