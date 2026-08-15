"""Searchable static site generated from the same records as the wiki."""

from __future__ import annotations

import json
import shutil
from math import acos, degrees
from pathlib import Path

from PIL import Image

from vslib.matrices import nearest_aesthetics
from vslib.site_chamber import build_chamber_payload
from vslib.site_explorer import build_explorer_payload
from vslib.site_media import write_evidence_atlases
from vslib.store import Library


SITE_ORIGIN = "https://atlas.agenc.ag"
SITE_NAME = "Visual Basis Atlas"
HOME_TITLE = "Visual Basis Atlas — Grok Imagine Under Observation"
SITE_DESCRIPTION = (
    "Controlled image studies showing how specific visual directions change Grok Imagine "
    "outputs—and which other properties move with them."
)
SOCIAL_IMAGE = f"{SITE_ORIGIN}/assets/social-card-v5.jpg"
SOCIAL_IMAGE_ALT = (
    "Visual Basis Atlas social preview showing a luminous optical observatory and the line "
    "Change one thing. Watch the image answer."
)

HOME_MEDIA_IDS = (
    "obs_0077", "obs_0078", "obs_0079",
    "obs_0162", "obs_0177",
    "obs_0052", "obs_0055",
)

def generate_site(lib: Library) -> None:
    site = lib.root / "site"
    css_source = lib.root / "assets" / "app.css"
    home_css_source = lib.root / "assets" / "home.css"
    js_source = lib.root / "assets" / "app.js"
    required_sources = (
        css_source,
        home_css_source,
        js_source,
        lib.root / "assets" / "chamber.js",
        lib.root / "assets" / "chamber-audio.js",
        lib.root / "assets" / "audio" / "signal-to-noise.opus",
        lib.root / "assets" / "audio" / "signal-to-noise.m4a",
        lib.root / "assets" / "audio" / "atlas-room.opus",
        lib.root / "assets" / "audio" / "atlas-room.m4a",
        lib.root / "assets" / "audio" / "CREDITS.md",
        lib.root / "assets" / "vendor" / "three.module.min.js",
        lib.root / "assets" / "vendor" / "three.LICENSE.txt",
        lib.root / "assets" / "art" / "optical-observatory-wide.webp",
        lib.root / "assets" / "art" / "optical-observatory-wide-depth.webp",
        lib.root / "assets" / "art" / "optical-observatory-mobile.webp",
        lib.root / "assets" / "art" / "optical-observatory-mobile-depth.webp",
        lib.root / "assets" / "art" / "optical-observatory-room-wide.webp",
        lib.root / "assets" / "art" / "optical-observatory-room-mobile.webp",
        lib.root / "assets" / "art" / "optical-observatory-instrument-wide.webp",
        lib.root / "assets" / "art" / "optical-observatory-instrument-mobile.webp",
        lib.root / "assets" / "fonts" / "instrument-sans-latin.woff2",
        lib.root / "assets" / "fonts" / "instrument-serif-regular-latin.woff2",
        lib.root / "assets" / "fonts" / "instrument-serif-italic-latin.woff2",
        lib.root / "assets" / "fonts" / "Instrument-OFL.txt",
        lib.root / "assets" / "social-card-v5.jpg",
    )
    missing_sources = [
        source.relative_to(lib.root).as_posix()
        for source in required_sources
        if not source.exists()
    ]
    if missing_sources:
        raise FileNotFoundError(
            "required site sources are missing: " + ", ".join(missing_sources)
        )
    search_index = _search_index(lib)
    explorer = build_explorer_payload(lib)
    chamber = build_chamber_payload(lib)
    if site.exists():
        shutil.rmtree(site)
    site.mkdir(parents=True)
    (site / "assets").mkdir()
    (site / "assets" / "app.css").write_text(css_source.read_text(encoding="utf-8"), encoding="utf-8")
    (site / "assets" / "home.css").write_text(
        home_css_source.read_text(encoding="utf-8"), encoding="utf-8"
    )
    (site / "assets" / "app.js").write_text(js_source.read_text(encoding="utf-8"), encoding="utf-8")
    (site / "assets" / "index.json").write_text(
        json.dumps(search_index, separators=(",", ":")), encoding="utf-8"
    )
    (site / "assets" / "atlas-explorer.json").write_text(
        json.dumps(explorer, separators=(",", ":")), encoding="utf-8"
    )
    (site / "assets" / "atlas-chamber.json").write_text(
        json.dumps(chamber, separators=(",", ":"), allow_nan=False), encoding="utf-8"
    )
    _write_presentation_assets(lib, site)
    write_evidence_atlases(
        lib,
        site,
        chamber["field"]["observations"],
        chamber["field"]["atlas"],
    )
    _page(
        site / "index.html",
        "Atlas",
        _home(lib, chamber, explorer),
        nav="home",
        hero=True,
        description=SITE_DESCRIPTION,
    )
    _page(
        site / "vectors.html", "Vectors", _vector_index(lib), nav="vectors",
        description="The full catalog of tested and candidate visual basis vectors.",
    )
    _page(
        site / "families.html", "Families", _family_index(lib), nav="families",
        description="Visual basis vectors grouped into provisional perceptual families.",
    )
    _page(
        site / "aesthetics.html", "Coordinates", _aesthetic_index(lib), nav="aesthetics",
        description="Named visual looks expressed as weighted coordinates over the basis.",
    )
    _page(
        site / "aliases.html", "Aliases", _alias_index(lib), nav="aliases",
        description="Common visual-language phrases mapped to operational vectors and looks.",
    )
    _page(
        site / "studies.html", "Studies", _study_index(lib), nav="studies",
        description="Controlled image studies used to test visual basis-vector candidates.",
    )
    _page(
        site / "questions.html", "Open questions", _questions(lib), nav="questions",
        description="Unresolved questions and next experiments in the visual basis atlas.",
    )
    _page(
        site / "matrices.html", "Matrices", _matrices(lib), nav="matrices",
        description="Similarity, confidence, interaction, and reconstruction matrices for the atlas.",
    )
    for folder in ("vectors", "aesthetics", "studies", "families", "observations"):
        (site / folder).mkdir()
    for vec in lib.vectors.values():
        _page(
            site / "vectors" / f"{vec.id}.html", vec.canonical_name,
            _vector_page(lib, vec.id), nav="vectors", description=vec.definition,
        )
    for aes in lib.aesthetics.values():
        _page(
            site / "aesthetics" / f"{aes.id}.html", aes.canonical_name,
            _aesthetic_page(lib, aes.id), nav="aesthetics", description=aes.definition,
        )
    for study in lib.studies.values():
        _page(
            site / "studies" / f"{study.id}.html", study.title,
            _study_page(lib, study.id), nav="studies",
            description=study.protocol or study.decision_reason or SITE_DESCRIPTION,
        )
    for fam in lib.families.values():
        _page(
            site / "families" / f"{fam.id}.html", fam.name,
            _family_page(lib, fam.id), nav="families", description=fam.definition,
        )
    for obs in lib.observations.values():
        intended = obs.intended_vector_id or "a visual property"
        level = obs.intended_level or "controlled"
        _page(
            site / "observations" / f"{obs.id}.html", obs.id,
            _obs_page(lib, obs.id), nav="studies",
            description=f"A {level} observation of {intended} from the Visual Basis Atlas.",
        )
    _copy_artifacts(lib, site)


def _search_index(lib: Library) -> list[dict]:
    rows = []
    for vec in lib.vectors.values():
        rows.append({
            "id": vec.id, "name": vec.canonical_name, "kind": "vector",
            "href": f"vectors/{vec.id}.html", "status": vec.status,
            "evidence": "studied" if vec.study_ids else vec.status,
            "text": " ".join([vec.canonical_name, *vec.aliases, vec.definition, vec.low_pole, vec.high_pole]),
        })
    for aes in lib.aesthetics.values():
        rows.append({
            "id": aes.id, "name": aes.canonical_name, "kind": "aesthetic",
            "href": f"aesthetics/{aes.id}.html", "status": aes.status,
            "evidence": "studied" if aes.observation_ids else "hypothesis",
            "text": " ".join([aes.canonical_name, *aes.aliases, aes.definition]),
        })
    for alias in lib.aliases.values():
        rows.append({
            "id": alias.id, "name": alias.raw_phrase, "kind": "alias",
            "href": "aliases.html", "status": alias.mapping_type,
            "evidence": alias.mapping_type,
            "text": f"{alias.raw_phrase} {alias.target_id} {alias.notes}",
        })
    for study in lib.studies.values():
        rows.append({
            "id": study.id, "name": study.title, "kind": "study",
            "href": f"studies/{study.id}.html", "status": study.status,
            "evidence": "studied",
            "text": f"{study.title} {study.decision} {study.protocol}",
        })
    for family in lib.families.values():
        rows.append({
            "id": family.id, "name": family.name, "kind": "family",
            "href": f"families/{family.id}.html", "status": "provisional",
            "evidence": "hypothesis",
            "text": f"{family.name} {family.definition} {' '.join(family.vector_ids)}",
        })
    return rows


def _search_dialog(prefix: str) -> str:
    return f"""
<dialog class="search-dialog" data-search-dialog aria-labelledby="site-search-title">
  <div class="search-dialog-head">
    <div>
      <p class="eyebrow">Research index</p>
      <h2 id="site-search-title">Find a visible property.</h2>
    </div>
    <button type="button" data-search-close aria-label="Close search">Close</button>
  </div>
  <form class="search-form" role="search" data-atlas-search data-prefix="{prefix}">
    <label for="site-search-q">Search vectors, studies, coordinates, and aliases</label>
    <div class="search-input-row">
      <input id="site-search-q" name="q" type="search" placeholder="Try halation or shadow density" autocomplete="off">
      <button type="submit">Search</button>
    </div>
    <div class="search-results" data-search-results role="status" aria-live="polite"></div>
  </form>
</dialog>
"""


def _page(
    path: Path,
    title: str,
    body: str,
    nav: str,
    hero: bool = False,
    description: str = SITE_DESCRIPTION,
) -> None:
    site_root = path
    while site_root.name != "site" and site_root.parent != site_root:
        site_root = site_root.parent
    rel = Path(*([".."] * len(path.parent.relative_to(site_root).parts)))
    prefix = (str(rel) + "/") if rel.parts else ""
    wrap_open = "" if hero else '<div class="sheet">'
    wrap_close = "" if hero else "</div>"
    relative_path = path.relative_to(site_root).as_posix()
    canonical_path = "/" if relative_path == "index.html" else f"/{relative_path}"
    canonical_url = f"{SITE_ORIGIN}{canonical_path}"
    page_title = HOME_TITLE if hero else f"{title} — {SITE_NAME}"
    page_description = " ".join(str(description or SITE_DESCRIPTION).split())
    home_current = ' aria-current="page"' if nav == "home" else ""
    body_class = "is-home" if hero else f"is-record page-{_esc(nav)}"
    og_type = "website" if hero else "article"
    hero_preload = (
        '<link rel="preload" as="image" href="assets/art/optical-observatory-room-wide.webp" '
        'type="image/webp" media="(min-width: 768px)" fetchpriority="high" crossorigin="anonymous">'
        '<link rel="preload" as="image" href="assets/art/optical-observatory-instrument-wide.webp" '
        'type="image/webp" media="(min-width: 768px)" fetchpriority="high" crossorigin="anonymous">'
        '<link rel="preload" as="image" href="assets/art/optical-observatory-room-mobile.webp" '
        'type="image/webp" media="(max-width: 767px)" fetchpriority="high" crossorigin="anonymous">'
        '<link rel="preload" as="image" href="assets/art/optical-observatory-instrument-mobile.webp" '
        'type="image/webp" media="(max-width: 767px)" fetchpriority="high" crossorigin="anonymous">'
        '<link rel="preload" as="font" href="assets/fonts/instrument-sans-latin.woff2" '
        'type="font/woff2" crossorigin>'
        '<link rel="preload" as="font" href="assets/fonts/instrument-serif-regular-latin.woff2" '
        'type="font/woff2" crossorigin>'
        '<link rel="preload" as="font" href="assets/fonts/instrument-serif-italic-latin.woff2" '
        'type="font/woff2" crossorigin>'
        '<link rel="modulepreload" href="assets/chamber.js">'
        '<link rel="modulepreload" href="assets/vendor/three.module.min.js">'
        '<link rel="modulepreload" href="assets/chamber-audio.js">'
        if hero else ""
    )
    home_styles = '<link rel="stylesheet" href="assets/home.css">' if hero else ""
    home_script = (
        '\n<script type="module" src="assets/chamber.js"></script>'
        if hero else ""
    )
    early_gate_script = (
        '<script>document.documentElement.classList.add("has-js");'
        'window.setTimeout(()=>{const root=document.querySelector("[data-chamber]");'
        'if(!root||!root.hasAttribute("data-ready")){document.documentElement.classList.remove("has-js");'
        'root?.removeAttribute("data-ready");}},10000);</script>'
        if hero else ""
    )
    theme_color = "#d8d4ca" if hero else "#0a0a09"
    color_scheme = "light dark" if hero else "dark"
    structured_data = ""
    if hero:
        data = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": SITE_NAME,
            "url": f"{SITE_ORIGIN}/",
            "description": page_description,
        }
        structured_data = f'<script type="application/ld+json">{json.dumps(data)}</script>'
    shell_header = "" if hero else f"""
<header class="site-header">
  <nav class="site-nav float" aria-label="Primary navigation">
    <a class="mark" href="{prefix}index.html" aria-label="Visual Basis Atlas — Home"{home_current}>
      <span class="mark-index" aria-hidden="true">VBA/01</span>
      <span class="mark-name">Visual Basis Atlas</span>
    </a>
    <div class="nav-links">{_nav(nav, prefix)}</div>
    <a class="search-trigger" href="{prefix}index.html#atlas-search" data-search-open>Search <kbd>/</kbd></a>
  </nav>
</header>
"""
    shell_search = "" if hero else _search_dialog(prefix)
    shell_footer = "" if hero else _site_footer(prefix)
    html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
{early_gate_script}
<meta name="color-scheme" content="{color_scheme}">
<title>{_esc(page_title)}</title>
<meta name="description" content="{_esc(page_description)}">
<meta name="theme-color" content="{theme_color}">
<link rel="canonical" href="{_esc(canonical_url)}">
<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="{SITE_NAME}">
<meta property="og:title" content="{_esc(page_title)}">
<meta property="og:description" content="{_esc(page_description)}">
<meta property="og:url" content="{_esc(canonical_url)}">
<meta property="og:image" content="{SOCIAL_IMAGE}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{SOCIAL_IMAGE_ALT}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{_esc(page_title)}">
<meta name="twitter:description" content="{_esc(page_description)}">
<meta name="twitter:image" content="{SOCIAL_IMAGE}">
<meta name="twitter:image:alt" content="{SOCIAL_IMAGE_ALT}">
<link rel="icon" href="{prefix}assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="{prefix}assets/app.css">
{home_styles}
{hero_preload}
{structured_data}
</head>
<body class="{body_class}" data-prefix="{prefix}">
<a class="skip-link" href="#main">Skip to content</a>
{shell_header}
{shell_search}
<main id="main" tabindex="-1">{wrap_open}{body}{wrap_close}</main>
{shell_footer}
<script src="{prefix}assets/app.js"></script>{home_script}
</body>
</html>
"""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(html, encoding="utf-8")


def _nav(active: str, prefix: str) -> str:
    links = [
        ("vectors", "vectors.html", "Vectors", False),
        ("studies", "studies.html", "Studies", False),
        ("aesthetics", "aesthetics.html", "Coordinates", False),
        ("matrices", "matrices.html", "Matrices", True),
    ]
    out = []
    for key, href, label, more in links:
        mark = ' aria-current="page"' if key == active else ""
        extra = ' class="nav-more"' if more else ""
        aria = ""
        out.append(f'<a href="{prefix}{href}"{extra}{aria}{mark}>{label}</a>')
    return "\n".join(out)


def _site_footer(prefix: str) -> str:
    return f"""
<footer class="site-footer">
  <div class="site-footer-statement">
    <div class="site-footer-mark">Visual Basis Atlas</div>
    <p>Operational dimensions for visual style. Useful, provisional, and not assumed orthogonal.</p>
  </div>
  <div class="site-footer-ledger" aria-label="Evidence summary">
    <span><strong>Observed</strong> categorical outputs</span>
    <span><strong>Measured</strong> paired responses</span>
    <span><strong>Provisional</strong> operational basis</span>
  </div>
  <div class="site-footer-links" aria-label="Secondary navigation">
    <a href="{prefix}families.html">Families</a>
    <a href="{prefix}aliases.html">Aliases</a>
    <a href="{prefix}questions.html">Open questions</a>
  </div>
  <p class="site-footer-note">Research target: Grok Imagine · Scores: agent-visual · No model-native coefficients.</p>
</footer>
"""


def _esc(text: str) -> str:
    return (
        str(text).replace("&", "&amp;").replace("<", "&lt;")
        .replace(">", "&gt;").replace('"', "&quot;")
    )


def _chip(status: str, css: str | None = None) -> str:
    klass = css or status.split()[0]
    return f'<span class="chip {_esc(klass)}">{_esc(status)}</span>'


def _bar(value: float) -> str:
    pct = max(0, min(100, abs(value) * 100))
    return f'<span class="bar"><span style="width:{pct:.0f}%"></span></span> {value:.2f}'


def _short_v(vector_id: str) -> str:
    return vector_id.removeprefix("vec_")


def _equation(lib: Library, aesthetic_id: str, href_prefix: str = "") -> str:
    aes = lib.aesthetics.get(aesthetic_id)
    if not aes or not aes.weights:
        return '<p class="eq-live"><span class="sum">a</span> = Σ w<sub>i</sub> v<sub>i</sub></p>'
    terms = []
    for i, item in enumerate(sorted(aes.weights, key=lambda w: abs(w.weight), reverse=True)):
        name = lib.vectors[item.vector_id].canonical_name if item.vector_id in lib.vectors else item.vector_id
        op = "" if i == 0 else " + "
        terms.append(
            f'{op}<a href="{href_prefix}vectors/{item.vector_id}.html" title="{_esc(name)}">'
            f'<span class="w">{item.weight:.2f}</span> '
            f'<span class="v">v<sub>{_esc(_short_v(item.vector_id))}</sub></span></a>'
        )
    return f'<p class="eq-live">{"".join(terms)}</p>'


def _home_media(
    lib: Library,
    observation_id: str,
    *,
    alt: str,
    class_name: str = "",
    loading: str = "lazy",
    decoding: str = "async",
    fetchpriority: str = "auto",
    extra: str = "",
) -> str:
    observation = lib.observations[observation_id]
    classes = f' class="{_esc(class_name)}"' if class_name else ""
    return (
        f'<img{classes} src="{_esc(observation.image_path)}" '
        f'srcset="{_presentation_path(observation_id, 640)} 640w, '
        f'{_presentation_path(observation_id, 1024)} 1024w" '
        f'sizes="(max-width: 767px) 100vw, 50vw" alt="{_esc(alt)}" '
        f'width="1024" height="1024" loading="{loading}" decoding="{decoding}" '
        f'fetchpriority="{fetchpriority}" crossorigin="anonymous" {extra}>'
    )


def _score_text(value: float | None) -> str:
    return "—" if value is None else f"{value:.2f}".removeprefix("0")


def _correlation_rows(payload: dict, axis_id: str, *, limit: int = 6) -> list[dict]:
    found = []
    for row in payload["correlations"]:
        if row["a"] == axis_id:
            found.append({"id": row["b"], "name": row["b_name"], "r": row["r"], "n": row["n"]})
        elif row["b"] == axis_id:
            found.append({"id": row["a"], "name": row["a_name"], "r": row["r"], "n": row["n"]})
    return sorted(found, key=lambda item: (-abs(item["r"]), item["name"]))[:limit]


def _home(
    lib: Library,
    chamber_payload: dict | None = None,
    explorer_payload: dict | None = None,
) -> str:
    """Render the semantic and fallback edition of the Observation Chamber."""
    payload = (
        explorer_payload
        if explorer_payload is not None
        else build_explorer_payload(lib)
    )
    chamber = (
        chamber_payload
        if chamber_payload is not None
        else build_chamber_payload(lib)
    )

    hero_ids = {
        item["requested_level"]: item["observation_id"]
        for item in chamber["hero"]["levels"]
    }
    comparison_by_vector = {
        item["vector_id"]: item["observation_id"]
        for item in chamber["comparison"]["items"]
    }
    comparison_ids = {
        "halation": comparison_by_vector["vec_halation"],
        "bloom": comparison_by_vector["vec_highlight_bloom"],
    }

    def observed_score(observation_id: str, vector_id: str) -> float | None:
        for score in lib.observations[observation_id].scores:
            if score.method == "agent_visual" and score.vector_id == vector_id:
                return float(score.score)
        return None

    hero_vector_id = chamber["hero"]["vector_id"]
    hero_vector_name = chamber["vectors"][hero_vector_id]["name"]
    state_names = {"low": "Low", "medium": "Medium", "high": "High"}
    hero_layers = []
    hero_static = []
    state_controls = []
    for level_name in ("low", "medium", "high"):
        observation_id = hero_ids[level_name]
        active = level_name == "low"
        hero_layers.append(
            _home_media(
                lib,
                observation_id,
                alt=(
                    f"Architecture study with {level_name} requested "
                    f"{hero_vector_name.lower()}, exact Grok Imagine output"
                ),
                class_name=f'chamber-fallback-layer{" is-active" if active else ""}',
                loading="eager",
                decoding="sync" if active else "async",
                fetchpriority="high" if active else "low",
                extra=(
                    f'data-chamber-fallback-layer data-state="{level_name}" '
                    f'data-observation-id="{observation_id}" '
                    f'aria-hidden="{"false" if active else "true"}"'
                ),
            )
        )
        score = observed_score(observation_id, hero_vector_id)
        hero_static.append(
            f'<a href="observations/{observation_id}.html">'
            f'{_home_media(lib, observation_id, alt=f"Architecture study with {level_name} requested {hero_vector_name.lower()}", loading="eager")}'
            f'<span><b>{_esc(state_names[level_name])}</b>'
            f'<small>{observation_id} · {_score_text(score)}</small></span></a>'
        )
        state_controls.append(
            f'<button type="button" data-chamber-state="{level_name}" '
            f'data-observation-id="{observation_id}" '
            f'aria-pressed="{str(active).lower()}" '
            f'class="{"is-active" if active else ""}">'
            f'<span>{_esc(state_names[level_name])}</span>'
            f'<small>{_esc(observation_id.removeprefix("obs_"))} · {_score_text(score)}</small>'
            f'</button>'
        )

    response = next(
        item for item in payload["responses"] if item["vector_id"] == hero_vector_id
    )
    response_rows = []
    nonzero_responses = [
        item
        for item in response["mean_response_delta"]
        if abs(float(item["value"])) > 1e-12
    ]
    for item in nonzero_responses:
        value = float(item["value"])
        response_rows.append(
            f'<li data-sign="{"negative" if value < 0 else "positive"}" '
            f'style="--response:{min(1.0, abs(value)):.4f}">'
            f'<span>{_esc(item["name"])}</span>'
            f'<i aria-hidden="true"></i>'
            f'<strong><span class="sr-only">Mean high minus low: </span>{value:+.2f}</strong>'
            f'</li>'
        )

    correlations = _correlation_rows(payload, "vec_optical_softness", limit=5)
    angle_rows = []
    for item in correlations:
        value = float(item["r"])
        angle = degrees(acos(max(-1.0, min(1.0, value))))
        angle_rows.append(
            f'<tr style="--angle:{angle:.1f}deg" '
            f'data-sign="{"negative" if value < 0 else "positive"}">'
            f'<th scope="row"><i aria-hidden="true"></i>{_esc(item["name"])}</th>'
            f'<td>{value:+.2f}</td><td>{angle:.0f}°</td></tr>'
        )
    correlation_n = correlations[0]["n"] if correlations else 0

    axis_ids = ("vec_optical_softness", "vec_halation", "vec_shadow_density")
    axis_controls = []
    for index, vector_id in enumerate(axis_ids):
        active = index == 0
        axis_controls.append(
            f'<button type="button" data-chamber-axis="{vector_id}" '
            f'aria-pressed="{str(active).lower()}" class="{"is-active" if active else ""}">'
            f'{_esc(lib.vectors[vector_id].canonical_name)}</button>'
        )

    reconstruction = payload["reconstruction"]
    chamber_reconstruction = chamber["reconstruction"]
    reconstruction_terms = []
    reconstruction_labels = []
    for weight in chamber_reconstruction["weights"]:
        vector_id = weight["vector_id"]
        vector_name = chamber["vectors"][vector_id]["name"]
        value = f'{float(weight["weight"]):.2f}'.removeprefix("0")
        operator = '<i aria-hidden="true">+</i>' if reconstruction_terms else ""
        reconstruction_terms.append(
            f'<span class="equation-term">{operator}'
            f'<b>{value}</b><var>v<sub>{_esc(vector_name.lower())}</sub></var></span>'
        )
        reconstruction_labels.append(f"{value} {vector_name.lower()}")
    reconstruction_equation = "".join(reconstruction_terms)
    reconstruction_aria = " plus ".join(reconstruction_labels)

    reconstruction_by_anchor = {
        item["anchor_id"]: item for item in reconstruction["selected_plates"]
    }
    reconstruction_media = []
    for anchor_id in ("anchor_object", "anchor_landscape"):
        item = reconstruction_by_anchor[anchor_id]
        reconstruction_media.append(
            f'<a href="observations/{item["observation_id"]}.html" '
            f'data-observation-id="{item["observation_id"]}">'
            f'{_home_media(lib, item["observation_id"], alt=f"{item["anchor_name"]} reconstruction result")}'
            f'<span><b>{_esc(item["anchor_name"])}</b>'
            f'<small>{item["observation_id"]} · score {item["score"]:.2f}</small></span></a>'
        )

    residual = " · ".join(
        f'{item["name"]} {item["count"]}/{item["n"]}'
        for item in reconstruction["residual_counts"][:3]
    )
    chamber_json = json.dumps(
        chamber, separators=(",", ":"), allow_nan=False
    ).replace("</", "<\\/")
    halation_halation = observed_score(comparison_ids["halation"], "vec_halation")
    halation_bloom = observed_score(comparison_ids["halation"], "vec_highlight_bloom")
    bloom_halation = observed_score(comparison_ids["bloom"], "vec_halation")
    bloom_bloom = observed_score(comparison_ids["bloom"], "vec_highlight_bloom")

    return f"""
<div class="observation-chamber" data-chamber data-prefix="" data-world="observatory">
  <script type="application/json" id="chamber-data">{chamber_json}</script>

  <header class="chamber-masthead">
    <a class="chamber-mark" href="index.html" aria-label="Visual Basis Atlas home">
      <b>Visual Basis Atlas</b>
      <span>Grok Imagine under observation</span>
    </a>
    <button class="sound-toggle" type="button" data-sound-toggle aria-pressed="false" aria-label="Sound control">
      <span class="sound-glyph" aria-hidden="true"><i></i><i></i><i></i></span>
      <span data-sound-label>Enable sound</span>
    </button>
  </header>

  <div class="chamber-entry" data-chamber-entry data-entry-state="open" data-world-entry role="status" aria-live="polite" aria-busy="true" aria-labelledby="chamber-entry-title" aria-describedby="chamber-entry-note">
    <picture class="entry-environment" data-world-fallback aria-hidden="true">
      <source media="(max-width: 767px)" srcset="assets/art/optical-observatory-mobile.webp">
      <img src="assets/art/optical-observatory-wide.webp" alt="" width="1672" height="941" decoding="sync" fetchpriority="high">
    </picture>
    <div class="entry-copy" data-world-copy>
      <p class="entry-overline">Visual Basis Atlas · Grok Imagine</p>
      <h2 id="chamber-entry-title">Change one thing.<br>Watch the image answer.</h2>
      <p id="chamber-entry-note">A living atlas of controlled Grok Imagine studies, built to isolate visual properties—and expose what moves with them.</p>
      <div class="entry-actions">
        <button type="button" data-enter disabled aria-disabled="true"><span data-enter-label>Preparing the atlas…</span></button>
      </div>
    </div>
  </div>

  <div class="chamber-viewport" data-chamber-canvas data-world-viewport>
    <picture class="chamber-environment" aria-hidden="true">
      <source media="(max-width: 767px)" srcset="assets/art/optical-observatory-mobile.webp">
      <img src="assets/art/optical-observatory-wide.webp" alt="" width="1672" height="941" decoding="async">
    </picture>
    <div class="chamber-fallback" data-chamber-fallback>
      {"".join(hero_layers)}
    </div>
  </div>

  <aside class="chamber-hud" data-world-hud aria-label="Active observation">
    <p class="hud-reading">
      <span data-chamber-observation>{hero_ids["low"]}</span>
      <span>{_esc(hero_vector_name)} <b data-chamber-level>low</b></span>
      <em data-chamber-score>{_score_text(observed_score(hero_ids["low"], hero_vector_id))}</em>
    </p>
    <p class="hud-scene">
      <b data-chamber-scene-label>Origin</b>
      <span data-chamber-scene-count>1 / 6</span>
      <i aria-hidden="true"></i>
    </p>
  </aside>

  <div class="chamber-status sr-only" data-chamber-status role="status" aria-live="polite"></div>

  <article class="chamber-sequence">
    <section class="chamber-scene scene-origin" data-chamber-scene="origin" data-world-scene="origin" aria-labelledby="chamber-origin-title">
      <div class="origin-thesis" data-world-copy>
        <p class="scene-kicker">Controlled architecture study · requested diffusion</p>
        <h1 id="chamber-origin-title">One direction.<br><em>More than one change.</em></h1>
        <p>The anchor, framing, and every constraint except the requested diffusion state remain fixed.</p>
      </div>
      <fieldset class="specimen-switch" data-world-control="diffusion">
        <legend>Requested {_esc(hero_vector_name)} <span>exact samples</span></legend>
        <div>{"".join(state_controls)}</div>
        <p>Three exact outputs. No interpolation.</p>
      </fieldset>
      <noscript>
        <figure class="origin-static-edition" aria-label="Three exact requested diffusion outputs">
          {"".join(hero_static)}
        </figure>
      </noscript>
      <p class="scroll-cue"><span>Scroll to enter the study</span><i aria-hidden="true"></i></p>
    </section>

    <section class="chamber-scene scene-response" data-chamber-scene="response" data-world-scene="response" aria-labelledby="chamber-response-title">
      <div class="scene-caption" data-world-copy>
        <p class="scene-kicker">Paired response</p>
        <h2 id="chamber-response-title">Ask for {_esc(hero_vector_name.lower())}.<br>{len(nonzero_responses)} properties answer.</h2>
        <p>Across {response["n_pairs"]} locked anchors, these were the only non-zero mean shifts from low to high.</p>
      </div>
      <figure class="response-key" data-world-ledger="response">
        <figcaption><span>Mean high − low</span><b>{response["n_pairs"]} paired anchors</b></figcaption>
        <ol>{"".join(response_rows)}</ol>
        <p class="evidence-note">Agent-visual scores. Missing scores are omitted; zero deltas are not shown.</p>
      </figure>
    </section>

    <section class="chamber-scene scene-discriminate" data-chamber-scene="discriminate" data-world-scene="discriminate" aria-labelledby="chamber-discriminate-title">
      <div class="scene-caption" data-world-copy>
        <p class="scene-kicker">Exact-output comparison</p>
        <h2 id="chamber-discriminate-title">Halation is not bloom.</h2>
        <p>Halation carries edge color. Bloom spreads pale luminance. Both are exact high-state outputs from the same night-path anchor.</p>
      </div>
      <fieldset class="compare-switch" data-world-control="comparison">
        <legend>Recorded high outputs</legend>
        <button type="button" data-chamber-compare="halation" aria-pressed="true" class="is-active">
          <span>Halation</span>
          <small>{comparison_ids["halation"]} · h {_score_text(halation_halation)} / b {_score_text(halation_bloom)}</small>
        </button>
        <button type="button" data-chamber-compare="bloom" aria-pressed="false">
          <span>Highlight bloom</span>
          <small>{comparison_ids["bloom"]} · b {_score_text(bloom_bloom)} / h {_score_text(bloom_halation)}</small>
        </button>
      </fieldset>
      <figure class="comparison-edition" data-chamber-comparison-fallback>
        {_home_media(
            lib,
            comparison_ids["halation"],
            alt="Night path with a coastal lamp showing high requested halation",
            class_name="is-active",
            extra='data-chamber-compare-layer="halation" data-chamber-compare="halation" aria-hidden="false"',
        )}
        {_home_media(
            lib,
            comparison_ids["bloom"],
            alt="Night path with a coastal lamp showing high requested highlight bloom",
            extra='data-chamber-compare-layer="bloom" data-chamber-compare="bloom"',
        )}
        <figcaption>
          <span>Halation · {_esc(comparison_ids["halation"])}</span>
          <span>Highlight bloom · {_esc(comparison_ids["bloom"])}</span>
        </figcaption>
      </figure>
    </section>

    <section class="chamber-scene scene-association" data-chamber-scene="association" data-world-scene="association" aria-labelledby="chamber-association-title">
      <div class="scene-caption" data-world-copy>
        <p class="scene-kicker">Association geometry</p>
        <h2 id="chamber-association-title">Nothing moves alone.</h2>
        <p>Pearson r becomes a literal angle: θ = arccos(r).</p>
        <p class="evidence-note">Scored observation-space association—not causality, and not Grok latent space.</p>
      </div>
      <fieldset class="axis-switch" data-world-control="correlation-axis">
        <legend>Correlation axis</legend>
        {"".join(axis_controls)}
      </fieldset>
      <figure class="angle-key" data-world-ledger="association">
        <figcaption><span>r = cos θ</span><b>n={correlation_n}</b></figcaption>
        <table>
          <caption class="sr-only">Strongest recorded relationships to optical softness</caption>
          <thead class="sr-only"><tr><th scope="col">Property</th><th scope="col">Pearson r</th><th scope="col">Angle theta</th></tr></thead>
          <tbody>{"".join(angle_rows)}</tbody>
        </table>
        <a href="matrices.html">Inspect the complete matrices <span aria-hidden="true">↗</span></a>
      </figure>
    </section>

    <section class="chamber-scene scene-reconstruct" data-chamber-scene="reconstruct" data-world-scene="reconstruct" aria-labelledby="chamber-reconstruct-title">
      <div class="scene-caption" data-world-copy>
        <p class="scene-kicker">Reconstruction test</p>
        <h2 id="chamber-reconstruct-title">A coordinate explains only part of the picture.</h2>
        <p class="reconstruction-equation" aria-label="Estimated aesthetic equals {_esc(reconstruction_aria)}"><span>â =</span>{reconstruction_equation}</p>
        <p class="evidence-note">Manual first-order hypothesis—not fitted coefficients or hidden model settings.</p>
      </div>
      <figure class="reconstruction-edition" data-world-plates="reconstruction">
        {"".join(reconstruction_media)}
      </figure>
      <aside class="residual-caption" data-world-residual>
        <span>a = â + r</span>
        <h3>The residual remains visible.</h3>
        <p>{_esc(residual)} · recorded flags, not a pixel-error map.</p>
      </aside>
    </section>

    <section class="chamber-scene scene-archive" data-chamber-scene="archive" data-world-scene="archive" data-world-finale id="chamber-archive" aria-labelledby="chamber-archive-title">
      <div class="scene-caption archive-caption" data-world-copy>
        <h2 id="chamber-archive-title">The experiment<br>continues.</h2>
      </div>
      <a class="archive-primary" data-world-portal-link href="vectors.html"><span>Enter the evidence</span><i aria-hidden="true">↗</i></a>
    </section>
  </article>

  <footer class="chamber-footer" data-world-footer aria-labelledby="chamber-footer-title">
    <div class="chamber-footer-lead">
      <p class="scene-kicker">The working atlas</p>
      <h2 id="chamber-footer-title">{payload["stats"]["observations"]} controlled observations.</h2>
      <p>Their studies, exact outputs, and provisional relationships remain open for inspection.</p>
    </div>
    <nav class="archive-secondary" aria-label="Atlas sections">
        <a href="studies.html">Studies</a>
        <a href="matrices.html">Matrices</a>
        <a href="aesthetics.html">Coordinates</a>
    </nav>
    <form class="aperture-search search-form" id="atlas-search" role="search" data-atlas-search data-prefix="">
      <label for="atlas-search-q">Search the atlas</label>
      <div>
        <input id="atlas-search-q" name="q" type="search" placeholder="Try halation or shadow density" autocomplete="off">
        <button type="submit" aria-label="Search"><span aria-hidden="true">→</span></button>
      </div>
      <div class="search-results" data-search-results role="status" aria-live="polite"></div>
    </form>
    <div class="chamber-credits">
      <p><a href="https://www.scottbuckley.com.au/library/signal-to-noise/" rel="external">'Signal to Noise' by Scott Buckley</a> - released under <a href="https://creativecommons.org/licenses/by/4.0/" rel="license external">CC-BY 4.0</a>. <a href="https://www.scottbuckley.com.au/" rel="external">www.scottbuckley.com.au</a></p>
      <p>Atlas adaptation: transcoded to Opus and AAC-LC; playback level and interface ducking are applied non-destructively at runtime.</p>
      <p>Entrance artwork derived from obs_0079; presentation only, not evidence.</p>
    </div>
    <p class="chamber-colophon">{chamber["field"]["observation_count"]} displayed / {payload["stats"]["observations"]} registered · 11 controlled axes · Grok Imagine outputs · agent-visual scoring · no affiliation with xAI</p>
  </footer>
</div>
"""
def _weight_rows(lib: Library, aesthetic_id: str, prefix: str = "") -> str:
    aesthetic = lib.aesthetics.get(aesthetic_id)
    if not aesthetic:
        return ""
    rows = []
    for item in sorted(aesthetic.weights, key=lambda weight: abs(weight.weight), reverse=True):
        vector = lib.vectors.get(item.vector_id)
        name = vector.canonical_name if vector else item.vector_id
        width = max(2, min(100, abs(item.weight) * 100))
        rows.append(
            f'<li><a href="{prefix}vectors/{item.vector_id}.html"><span>{_esc(name)}</span>'
            f'<strong>{item.weight:.2f}</strong></a><i><b style="width:{width:.0f}%"></b></i></li>'
        )
    return f'<ol class="weight-list">{"".join(rows)}</ol>'


def _vector_index(lib: Library) -> str:
    rows = []
    for vec in sorted(lib.vectors.values(), key=lambda v: (v.family_id, v.canonical_name)):
        fam = lib.families.get(vec.family_id)
        rows.append(
            f"<tr><td><a href='vectors/{vec.id}.html'>{_esc(vec.canonical_name)}</a></td>"
            f"<td class='mono'>{vec.id}</td><td>{_chip(vec.status)}</td>"
            f"<td>{_esc(fam.name if fam else '')}</td><td>{_bar(vec.confidence)}</td></tr>"
        )
    return f"""
<p class="eyebrow">Research ledger / {len(lib.vectors)} records</p>
<h1 class="page">Vectors</h1>
<p class="lede">Eleven controlled directions inside a deliberately provisional visual vocabulary. No vector is canonical yet.</p>
<div class="table-wrap"><table><thead><tr><th>name</th><th>id</th><th>status</th><th>family</th><th>conf</th></tr></thead>
<tbody>{''.join(rows)}</tbody></table></div>
"""


def _family_index(lib: Library) -> str:
    rows = []
    for fam in sorted(lib.families.values(), key=lambda f: f.name):
        n = sum(1 for v in lib.vectors.values() if v.family_id == fam.id)
        rows.append(
            f'<a class="ledger-row" href="families/{fam.id}.html"><span class="status-mark hypothesis"></span>'
            f'<strong>{_esc(fam.name)}</strong><span>{_esc(fam.definition)}</span><span>{n} vectors</span><b>↗</b></a>'
        )
    return f"<p class='eyebrow'>Provisional structure</p><h1 class='page'>Families</h1><p class='lede'>Twelve working shelves, built to be revised as evidence accumulates.</p><div class='atlas-ledger'>{''.join(rows)}</div>"


def _family_page(lib: Library, family_id: str) -> str:
    fam = lib.families[family_id]
    items = [v for v in lib.vectors.values() if v.family_id == family_id]
    items.sort(key=lambda v: v.canonical_name)
    lis = "".join(
        f"<li><a href='../vectors/{v.id}.html'>{_esc(v.canonical_name)}</a> {_chip(v.status)}</li>"
        for v in items
    )
    return f"<h1 class='page'>{_esc(fam.name)}</h1><p class='lede'>{_esc(fam.definition)}</p><ul>{lis}</ul>"


def _aesthetic_index(lib: Library) -> str:
    rows = []
    for aes in sorted(lib.aesthetics.values(), key=lambda a: a.canonical_name):
        evidence = "observed" if aes.observation_ids else "hypothesis"
        rows.append(
            f'<a class="ledger-row" href="aesthetics/{aes.id}.html"><span class="status-mark {evidence}"></span>'
            f'<strong>{_esc(aes.canonical_name)}</strong><span>{_esc(aes.status)}</span>'
            f'<span>confidence {aes.confidence:.2f}</span><b>↗</b></a>'
        )
    return f"<p class='eyebrow'>Weighted coordinates</p><h1 class='page'>Coordinates</h1><p class='lede'>Named aesthetics expressed as inspectable, provisional weights over the basis.</p><div class='atlas-ledger'>{''.join(rows)}</div>"


def _alias_index(lib: Library) -> str:
    rows = []
    for alias in sorted(lib.aliases.values(), key=lambda a: a.raw_phrase.lower()):
        href = "#"
        if alias.target_id.startswith("vec_"):
            href = f"vectors/{alias.target_id}.html"
        elif alias.target_id.startswith("aes_"):
            href = f"aesthetics/{alias.target_id}.html"
        rows.append(
            f"<tr><td>{_esc(alias.raw_phrase)}</td><td><a href='{href}' class='mono'>{alias.target_id}</a></td>"
            f"<td>{_chip(alias.mapping_type)}</td><td>{alias.confidence:.2f}</td>"
            f"<td>{_esc(alias.notes)}</td></tr>"
        )
    return f"""
<h1 class="page">Aliases</h1>
<p class="lede">Map a raw phrase onto the basis.</p>
<div class="table-wrap"><table><thead><tr><th>phrase</th><th>target</th><th>mapping</th><th>conf</th><th>notes</th></tr></thead>
<tbody>{''.join(rows)}</tbody></table></div>
"""


def _study_index(lib: Library) -> str:
    rows = []
    for s in sorted(lib.studies.values(), key=lambda x: x.id):
        rows.append(
            f'<a class="ledger-row" href="studies/{s.id}.html"><span class="status-mark observed"></span>'
            f'<strong>{_esc(s.title)}</strong><span>{_esc(s.decision or s.status)}</span>'
            f'<span>{len(s.observation_ids)} observations</span><b>↗</b></a>'
        )
    return f"<p class='eyebrow'>Controlled evidence</p><h1 class='page'>Studies</h1><p class='lede'>Fixed anchors, categorical requests, and recorded spill into neighboring properties.</p><div class='atlas-ledger'>{''.join(rows)}</div>"


def _questions(lib: Library) -> str:
    blocks = ["<h1 class='page'>Open questions</h1>"]
    for vec in sorted(lib.vectors.values(), key=lambda v: v.id):
        if not vec.open_questions:
            continue
        items = "".join(f"<li>{_esc(q)}</li>" for q in vec.open_questions)
        blocks.append(f"<h2><a href='vectors/{vec.id}.html'>{_esc(vec.canonical_name)}</a></h2><ul>{items}</ul>")
    for study in lib.studies.values():
        if study.next_experiments:
            items = "".join(f"<li>{_esc(q)}</li>" for q in study.next_experiments)
            blocks.append(f"<h2><a href='studies/{study.id}.html'>{study.id}</a></h2><ul>{items}</ul>")
    return "\n".join(blocks)


def _matrices(lib: Library) -> str:
    files = [
        "observation_matrix.csv", "confidence_matrix.csv", "composite_weight_matrix.csv",
        "alias_mapping.csv", "cooccurrence_matrix.csv", "vector_similarity_matrix.csv",
        "aesthetic_similarity_matrix.csv", "vector_correlation_matrix.csv",
        "interaction_candidates.csv", "reconstruction_evaluations.csv",
    ]
    payload = build_explorer_payload(lib)
    cohort_n = payload["correlations"][0]["n"] if payload["correlations"] else 0
    dimensions = sorted(
        {row["a"] for row in payload["correlations"]} | {row["b"] for row in payload["correlations"]},
        key=lambda vector_id: lib.vectors[vector_id].canonical_name,
    )
    values: dict[tuple[str, str], float] = {}
    for row in payload["correlations"]:
        values[(row["a"], row["b"])] = row["r"]
        values[(row["b"], row["a"])] = row["r"]
    head = "".join(
        f'<th scope="col"><abbr title="{_esc(lib.vectors[vector_id].canonical_name)}">'
        f'{_esc(_short_v(vector_id)[:8])}</abbr></th>'
        for vector_id in dimensions
    )
    body_rows = []
    for row_id in dimensions:
        cells = []
        for column_id in dimensions:
            value = 1.0 if row_id == column_id else values[(row_id, column_id)]
            sign = "negative" if value < 0 else "positive"
            cells.append(
                f'<td data-sign="{sign}" style="--magnitude:{abs(value):.4f}" '
                f'title="{_esc(lib.vectors[row_id].canonical_name)} × {_esc(lib.vectors[column_id].canonical_name)}: {value:+.4f}">'
                f'<span>{value:+.2f}</span></td>'
            )
        body_rows.append(
            f'<tr><th scope="row">{_esc(lib.vectors[row_id].canonical_name)}</th>{"".join(cells)}</tr>'
        )
    downloads = "".join(f'<li><a href="data/{f}" download>{_esc(f)} <span>CSV ↓</span></a></li>' for f in files)
    return f"""
<p class="eyebrow">Machine-readable evidence</p>
<h1 class="page">Matrices</h1>
<p class="lede">The primary view uses only the twelve dimensions scored throughout the complete {cohort_n}-observation cohort. Pearson association describes observed coupling; it does not establish causality.</p>
<div class="matrix-legend"><span>−1 inverse</span><span>0 no linear association</span><span>+1 together</span></div>
<div class="table-wrap matrix-wrap"><table class="matrix-table"><thead><tr><th>dimension</th>{head}</tr></thead><tbody>{"".join(body_rows)}</tbody></table></div>
<h2>Download the working matrices</h2><ul class="download-ledger">{downloads}</ul>
"""


def _vector_page(lib: Library, vector_id: str) -> str:
    vec = lib.vectors[vector_id]
    fam = lib.families.get(vec.family_id)
    nearby = "".join(
        f"<li><a href='{nid}.html'>{_esc(lib.vectors[nid].canonical_name if nid in lib.vectors else nid)}</a></li>"
        for nid in vec.nearby_ids
    ) or "<li>none</li>"
    not_same = "".join(
        f"<li><a href='{k}.html'>{k}</a>: {_esc(v)}</li>" for k, v in vec.not_the_same_as.items()
    ) or "<li>no notes</li>"
    studies = "".join(f"<li><a href='../studies/{s}.html'>{s}</a></li>" for s in vec.study_ids) or "<li>none</li>"
    effects = "".join(f"<li>{_esc(e)}</li>" for e in vec.observable_effects) or "<li>not yet observed</li>"
    qs = "".join(f"<li>{_esc(q)}</li>" for q in vec.open_questions) or "<li>none</li>"
    high = None
    for obs in lib.observations.values():
        if obs.intended_vector_id == vector_id and obs.intended_level == "high" and obs.anchor_id == "anchor_architecture":
            high = obs
            break
    if not high:
        for obs in lib.observations.values():
            if (
                obs.intended_vector_id == vector_id
                and obs.intended_level == "high"
                and obs.anchor_id in {"anchor_object", "anchor_landscape"}
            ):
                high = obs
                break
    mast = ""
    if high:
        mast = (
            f'<div class="mast"><img src="../{high.image_path}" alt="">'
            f'<div class="shade"></div><div class="in">'
            f'<p class="kicker">v<sub>{_esc(_short_v(vec.id))}</sub> · high</p>'
            f'<h1 class="page">{_esc(vec.canonical_name)}</h1></div></div>'
        )
    else:
        mast = f'<h1 class="page">{_esc(vec.canonical_name)}</h1>'
    return f"""
{mast}
<div class="meta">
  {_chip(vec.status)}
  <span class="chip mono">{vec.id}</span>
  <span class="chip">conf {vec.confidence:.2f}</span>
  <span class="chip"><a href="../families/{vec.family_id}.html">{_esc(fam.name if fam else vec.family_id)}</a></span>
</div>
<p class="lede">{_esc(vec.definition)}</p>
<p class="eq-live"><span class="w">{_esc(vec.low_pole)}</span> → <span class="v">{_esc(vec.high_pole)}</span></p>
<div class="grid-2">
  <div class="card"><h3>What it changes</h3><p>{_esc(vec.testable_claim)}</p><ul>{effects}</ul></div>
  <div class="card"><h3>Aliases</h3><p>{_esc(", ".join(vec.aliases) or "none")}</p></div>
</div>
<h2>Controlled examples</h2>
{_vector_evidence(lib, vec.id)}
<h2>Nearby</h2><ul>{nearby}</ul>
<h2>Commonly confused with</h2><ul>{not_same}</ul>
<h2>Studies</h2><ul>{studies}</ul>
<h2>Open questions</h2><ul>{qs}</ul>
"""


def _vector_evidence(lib: Library, vector_id: str) -> str:
    rows: dict[str, dict] = {}
    for obs in lib.observations.values():
        if (
            obs.intended_vector_id != vector_id
            or obs.anchor_id not in {"anchor_object", "anchor_architecture", "anchor_landscape"}
        ):
            continue
        rows.setdefault(obs.anchor_id, {})[obs.intended_level or ""] = obs
    if not rows:
        return "<p>No controlled examples yet.</p>"
    html = ["<div>"]
    html.append("<div class='anchor-row'><div></div><div class='caption'>low</div><div class='caption'>medium</div><div class='caption'>high</div></div>")
    for anchor_id, levels in rows.items():
        name = lib.anchors[anchor_id].name if anchor_id in lib.anchors else anchor_id
        cells = [f"<div class='an'>{_esc(name)}</div>"]
        for level in ("low", "medium", "high"):
            obs = levels.get(level)
            if obs:
                cells.append(
                    f"<div class='thumb'><a href='../observations/{obs.id}.html'>"
                    f"<img src='../{obs.image_path}' alt='{_esc(name)}, {level} {_esc(lib.vectors[vector_id].canonical_name)}'></a></div>"
                )
            else:
                cells.append("<div></div>")
        html.append(f"<div class='anchor-row'>{''.join(cells)}</div>")
    html.append("</div>")
    return "\n".join(html)


def _aesthetic_page(lib: Library, aesthetic_id: str) -> str:
    aes = lib.aesthetics[aesthetic_id]
    nearest = nearest_aesthetics(lib, aes.id)
    near = "".join(
        f"<li><a href='{i}.html'>{_esc(lib.aesthetics[i].canonical_name)}</a> cosine {s:.3f}</li>"
        for i, s in nearest
    ) or "<li>none</li>"
    notes = "".join(f"<li>{_esc(n)}</li>" for n in aes.interaction_notes) or "<li>none</li>"
    hero_obs = None
    plates = []
    for oid in aes.observation_ids:
        obs = lib.observations.get(oid)
        if not obs or obs.anchor_id not in {"anchor_object", "anchor_architecture", "anchor_landscape"}:
            continue
        if hero_obs is None:
            hero_obs = obs
        plates.append(
            f'<a class="plate" href="../observations/{obs.id}.html">'
            f'<img src="../{obs.image_path}" alt="{_esc(lib.anchors[obs.anchor_id].name if obs.anchor_id in lib.anchors else obs.anchor_id or "Study plate")}">'
            f'<div class="cap">{_esc(obs.anchor_id or "")}</div></a>'
        )
    mast = ""
    if hero_obs:
        mast = (
            f'<div class="mast" style="height:58vh"><img src="../{hero_obs.image_path}" alt="">'
            f'<div class="shade"></div><div class="in">'
            f'<p class="kicker">{aes.id}</p><h1 class="page">{_esc(aes.canonical_name)}</h1>'
            f'{_equation(lib, aes.id, "../")}</div></div>'
        )
    else:
        mast = f'<h1 class="page">{_esc(aes.canonical_name)}</h1>{_equation(lib, aes.id, "../")}'
    return f"""
{mast}
<div class="meta">{_chip(aes.status)}<span class="chip mono">{aes.id}</span>{_chip("conf "+f"{aes.confidence:.2f}")}</div>
<p class="lede">{_esc(aes.definition)}</p>
<h2>Coordinate</h2>
{_equation(lib, aes.id, "../")}
{_weight_rows(lib, aes.id, "../")}
<h2>Plates</h2>
<div class="rail">{''.join(plates) or "<p>None yet.</p>"}</div>
<h2>Interactions</h2><ul>{notes}</ul>
<h2>Nearest</h2><ul>{near}</ul>
<p class="lede">{_esc(aes.reconstruction_notes)}</p>
"""


def _study_page(lib: Library, study_id: str) -> str:
    study = lib.studies[study_id]
    grid = f"<p><img src='../artifacts/grids/{study.id}.jpg' alt='grid' style='width:100%;border-radius:14px'></p>" if (lib.root / "artifacts" / "grids" / f"{study.id}.jpg").exists() else ""
    by_anchor: dict[str, dict] = {}
    for obs_id in study.observation_ids:
        obs = lib.observations.get(obs_id)
        if not obs or not obs.anchor_id:
            continue
        by_anchor.setdefault(obs.anchor_id, {})[obs.intended_level or "x"] = obs
    blocks = []
    levels = study.levels or ["low", "medium", "high"]
    for anchor_id, levels_map in by_anchor.items():
        name = lib.anchors[anchor_id].name if anchor_id in lib.anchors else anchor_id
        cells = []
        for level in levels:
            obs = levels_map.get(level)
            if not obs:
                continue
            cells.append(
                f"<div><a href='../observations/{obs.id}.html'><img src='../{obs.image_path}' alt='{_esc(name)}, {level} requested state'></a>"
                f"<div class='caption'>{level}</div></div>"
            )
        blocks.append(f"<h3>{_esc(name)}</h3><div class='strip levels'>{''.join(cells)}</div>")
    ents = "".join(f"<li>{_esc(e)}</li>" for e in study.entanglement_notes) or "<li>none</li>"
    nxt = "".join(f"<li>{_esc(e)}</li>" for e in study.next_experiments) or "<li>none</li>"
    return f"""
<h1 class="page">{_esc(study.title)}</h1>
<div class="meta">{_chip(study.status)} {_chip(study.decision or "undecided")}
<a class="chip" href="../vectors/{study.candidate_vector_id}.html">{study.candidate_vector_id}</a></div>
<p class="lede">{_esc(study.protocol)}</p>
<p>{_esc(study.decision_reason)}</p>
{grid}
{''.join(blocks)}
<h2>Entanglement</h2><ul>{ents}</ul>
<h2>Next</h2><ul>{nxt}</ul>
"""


def _obs_page(lib: Library, observation_id: str) -> str:
    obs = lib.observations[observation_id]
    scores = "".join(
        f"<tr><td><a href='../vectors/{s.vector_id}.html'>{s.vector_id}</a></td>"
        f"<td>{_bar(s.score)}</td><td>{s.confidence:.2f}</td></tr>"
        for s in obs.scores
    )
    unintended = "".join(f"<li>{_esc(u)}</li>" for u in obs.unintended_changes) or "<li>none</li>"
    return f"""
<div class="mast" style="height:70vh"><img src="../{obs.image_path}" alt="{_esc((lib.anchors[obs.anchor_id].name if obs.anchor_id in lib.anchors else obs.anchor_id or "Generated observation") + ", " + (obs.intended_level or "controlled") + " requested state")}"><div class="shade"></div>
<div class="in"><p class="kicker">{obs.id}</p><h1 class="page">{_esc(obs.anchor_id or "")} · {_esc(obs.intended_level or "")}</h1></div></div>
<div class="meta">
  <a class="chip" href="../studies/{obs.study_id}.html">{obs.study_id}</a>
</div>
<h2>Prompt</h2>
<p class="mono" style="white-space:pre-wrap;font-size:0.8rem">{_esc(obs.prompt)}</p>
<h2>Scores</h2>
<div class="table-wrap"><table><thead><tr><th>vector</th><th>score</th><th>conf</th></tr></thead><tbody>{scores}</tbody></table></div>
<h2>Unintended</h2><ul>{unintended}</ul>
<p>{_esc(obs.notes)}</p>
"""


def _presentation_path(observation_id: str, width: int) -> str:
    return f"assets/studies/{observation_id}-{width}.webp"


def _write_presentation_assets(lib: Library, site: Path) -> None:
    """Create display derivatives without modifying the canonical evidence plates."""
    destination = site / "assets" / "studies"
    destination.mkdir(parents=True, exist_ok=True)
    for observation_id in HOME_MEDIA_IDS:
        observation = lib.observations.get(observation_id)
        if not observation or not observation.image_path:
            continue
        source = lib.root / observation.image_path
        if not source.exists():
            continue
        with Image.open(source) as original:
            rgb = original.convert("RGB")
            for width in (640, 1024):
                display = rgb.copy()
                display.thumbnail((width, width), Image.Resampling.LANCZOS)
                display.save(
                    site / _presentation_path(observation_id, width),
                    "WEBP",
                    quality=84,
                    method=6,
                )


def _copy_artifacts(lib: Library, site: Path) -> None:
    src = lib.root / "artifacts"
    dest = site / "artifacts"
    if dest.exists():
        shutil.rmtree(dest)
    if src.exists():
        shutil.copytree(src, dest)
    source_data = lib.root / "data"
    if source_data.exists():
        shutil.copytree(source_data, site / "data")
    source_assets = lib.root / "assets"
    if source_assets.exists():
        shutil.copytree(source_assets, site / "assets", dirs_exist_ok=True)
