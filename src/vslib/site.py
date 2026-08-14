"""Searchable static site generated from the same records as the wiki."""

from __future__ import annotations

import json
import shutil
from math import acos, cos, degrees, radians, sin
from pathlib import Path

from PIL import Image

from vslib.matrices import nearest_aesthetics
from vslib.site_explorer import build_explorer_payload
from vslib.store import Library


SITE_ORIGIN = "https://atlas.agenc.ag"
SITE_NAME = "Visual Basis Atlas"
HOME_TITLE = "Visual Basis Atlas — Grok Imagine Under Observation"
SITE_DESCRIPTION = (
    "Controlled image studies showing how specific visual directions change Grok Imagine "
    "outputs—and which other properties move with them."
)
SOCIAL_IMAGE = f"{SITE_ORIGIN}/assets/social-card-v3.jpg"
SOCIAL_IMAGE_ALT = "Visual Basis Atlas title beside a lamp-present room under observation"

HOME_MEDIA_IDS = (
    "obs_0157", "obs_0158", "obs_0159", "obs_0174",
    "obs_0052", "obs_0055",
)

def generate_site(lib: Library) -> None:
    site = lib.root / "site"
    if site.exists():
        shutil.rmtree(site)
    site.mkdir(parents=True)
    (site / "assets").mkdir()
    css_source = lib.root / "assets" / "app.css"
    home_css_source = lib.root / "assets" / "home.css"
    js_source = lib.root / "assets" / "app.js"
    if not css_source.exists() or not home_css_source.exists() or not js_source.exists():
        raise FileNotFoundError(
            "assets/app.css, assets/home.css, and assets/app.js are required site sources"
        )
    (site / "assets" / "app.css").write_text(css_source.read_text(encoding="utf-8"), encoding="utf-8")
    (site / "assets" / "home.css").write_text(
        home_css_source.read_text(encoding="utf-8"), encoding="utf-8"
    )
    (site / "assets" / "app.js").write_text(js_source.read_text(encoding="utf-8"), encoding="utf-8")
    (site / "assets" / "index.json").write_text(
        json.dumps(_search_index(lib), separators=(",", ":")), encoding="utf-8"
    )
    explorer = build_explorer_payload(lib)
    (site / "assets" / "atlas-explorer.json").write_text(
        json.dumps(explorer, separators=(",", ":")), encoding="utf-8"
    )
    _write_presentation_assets(lib, site)
    _page(site / "index.html", "Atlas", _home(lib), nav="home", hero=True, description=SITE_DESCRIPTION)
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
        '<link rel="preload" as="image" href="assets/studies/obs_0159-1024.webp" '
        'imagesrcset="assets/studies/obs_0159-640.webp 640w, assets/studies/obs_0159-1024.webp 1024w" '
        'imagesizes="(max-width: 767px) 100vw, 58vw">'
        if hero else ""
    )
    home_styles = '<link rel="stylesheet" href="assets/home.css">' if hero else ""
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
    html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="dark">
<title>{_esc(page_title)}</title>
<meta name="description" content="{_esc(page_description)}">
<meta name="theme-color" content="#0a0a09">
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
{_search_dialog(prefix)}
<main id="main" tabindex="-1">{wrap_open}{body}{wrap_close}</main>
{_site_footer(prefix)}
<script src="{prefix}assets/app.js"></script>
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
        f'fetchpriority="{fetchpriority}" {extra}>'
    )


def _score_value(lib: Library, observation_id: str, vector_id: str) -> float | None:
    observation = lib.observations.get(observation_id)
    if not observation:
        return None
    return observation.score_map().get(vector_id)


def _score_text(value: float | None) -> str:
    return "—" if value is None else f"{value:.2f}".removeprefix("0")


def _response_rows(response: dict, *, limit: int = 7) -> str:
    rows = []
    meaningful = [
        component for component in response["mean_response_delta"]
        if abs(component["value"]) >= 0.0005
    ]
    for component in meaningful[:limit]:
        value = component["value"]
        sign = "negative" if value < 0 else "positive"
        rows.append(
            f'<li class="response-row" data-sign="{sign}" style="--magnitude:{min(abs(value), 1) * 50:.1f}%">'
            f'<span class="response-name">{_esc(component["name"])}</span>'
            f'<span class="response-track" aria-hidden="true"><span class="response-fill"></span></span>'
            f'<strong class="response-value">{value:+.3f}</strong></li>'
        )
    return f'<ol class="response-chart-list">{"".join(rows)}</ol>'


def _correlation_rows(payload: dict, axis_id: str, *, limit: int = 6) -> list[dict]:
    found = []
    for row in payload["correlations"]:
        if row["a"] == axis_id:
            found.append({"id": row["b"], "name": row["b_name"], "r": row["r"], "n": row["n"]})
        elif row["b"] == axis_id:
            found.append({"id": row["a"], "name": row["a_name"], "r": row["r"], "n": row["n"]})
    return sorted(found, key=lambda item: (-abs(item["r"]), item["name"]))[:limit]


def _correlation_fallback(rows: list[dict]) -> tuple[str, str]:
    marks = []
    table_rows = []
    for row in rows:
        position = (row["r"] + 1) * 50
        sign = "negative" if row["r"] < 0 else "positive"
        marks.append(
            f'<li class="correlation-mark" data-sign="{sign}" style="--position:{position:.2f}%">'
            f'<span class="correlation-name">{_esc(row["name"])}</span>'
            f'<span class="correlation-line" aria-hidden="true"><span class="correlation-dot"></span></span>'
            f'<strong class="correlation-value">{row["r"]:+.3f}</strong></li>'
        )
        table_rows.append(
            f'<tr><th scope="row">{_esc(row["name"])}</th><td>{row["r"]:+.4f}</td><td>{row["n"]}</td></tr>'
        )
    return (
        f'<ol class="correlation-list">{"".join(marks)}</ol>',
        "".join(table_rows),
    )


def _basis_fan_svg(rows: list[dict], axis_name: str) -> str:
    """Render Pearson correlation as literal angle in scored observation-space."""
    origin_x, origin_y, ray_length = 500.0, 570.0, 400.0
    spacing, minimum_y, maximum_y = 46.0, 54.0, 594.0
    geometry = []
    for index, row in enumerate(rows[:6]):
        coefficient = max(-1.0, min(1.0, float(row["r"])))
        angle = degrees(acos(coefficient))
        theta = radians(angle)
        endpoint_x = origin_x + ray_length * cos(theta)
        endpoint_y = origin_y - ray_length * sin(theta)
        geometry.append({
            "index": index,
            "row": row,
            "coefficient": coefficient,
            "angle": angle,
            "endpoint_x": endpoint_x,
            "endpoint_y": endpoint_y,
            "side": "left" if endpoint_x < origin_x else "right",
        })

    label_positions: dict[int, float] = {}
    for side in ("left", "right"):
        entries = []
        for item in geometry:
            if item["side"] != side:
                continue
            entries.append({
                **item,
                "desired_y": max(minimum_y, min(maximum_y, item["endpoint_y"] - 10)),
            })
        entries.sort(key=lambda item: (
            item["desired_y"],
            str(item["row"].get("id") or item["row"].get("name") or ""),
            item["index"],
        ))
        if not entries:
            continue

        def pack(cluster_items: list[dict]) -> dict:
            center = sum(item["desired_y"] for item in cluster_items) / len(cluster_items)
            span = spacing * (len(cluster_items) - 1)
            start = max(minimum_y, min(maximum_y - span, center - span / 2))
            return {"items": cluster_items, "start": start, "end": start + span}

        clusters = [pack([entry]) for entry in entries]
        merged = True
        while merged and len(clusters) > 1:
            merged = False
            next_clusters = []
            cluster_index = 0
            while cluster_index < len(clusters):
                current = clusters[cluster_index]
                following = clusters[cluster_index + 1] if cluster_index + 1 < len(clusters) else None
                if following and current["end"] + spacing > following["start"]:
                    next_clusters.append(pack([*current["items"], *following["items"]]))
                    cluster_index += 2
                    merged = True
                else:
                    next_clusters.append(current)
                    cluster_index += 1
            clusters = next_clusters

        for cluster in clusters:
            for position, item in enumerate(cluster["items"]):
                label_positions[item["index"]] = cluster["start"] + position * spacing

    rays = []
    for item in geometry:
        index = item["index"]
        row = item["row"]
        coefficient = item["coefficient"]
        angle = item["angle"]
        endpoint_x = item["endpoint_x"]
        endpoint_y = item["endpoint_y"]
        on_left = item["side"] == "left"
        label_x = (
            max(210.0, min(470.0, endpoint_x - 16))
            if on_left else min(790.0, max(530.0, endpoint_x + 16))
        )
        label_y = label_positions.get(
            index, max(minimum_y, min(maximum_y, endpoint_y - 10))
        )
        anchor = "end" if on_left else "start"
        leader_x = label_x + (7 if on_left else -7)
        leader_y = label_y - 5
        sign = "negative" if coefficient < 0 else "positive"
        rays.append(
            f'<g class="basis-fan-ray" data-sign="{sign}" data-label-side="{item["side"]}" '
            f'data-r="{coefficient:.6f}" data-theta-degrees="{angle:.4f}" '
            f'style="--fan-delay:{index * 45}ms">'
            f'<line class="basis-fan-line" x1="{origin_x:.0f}" y1="{origin_y:.0f}" '
            f'x2="{endpoint_x:.2f}" y2="{endpoint_y:.2f}" pathLength="1"></line>'
            f'<circle class="basis-fan-endpoint" cx="{endpoint_x:.2f}" cy="{endpoint_y:.2f}" r="5"></circle>'
            f'<path class="basis-fan-label-leader" d="M {endpoint_x:.2f} {endpoint_y:.2f} '
            f'L {leader_x:.2f} {leader_y:.2f}" aria-hidden="true"></path>'
            f'<text class="basis-fan-label" x="{label_x:.2f}" y="{label_y:.2f}" '
            f'text-anchor="{anchor}" data-label-y="{label_y:.2f}">'
            f'<tspan class="basis-fan-label-name">{_esc(row["name"])}</tspan>'
            f'<tspan class="basis-fan-label-value" x="{label_x:.2f}" dy="18">r {coefficient:+.3f} · θ {angle:.1f}°</tspan>'
            f'</text></g>'
        )
    fallback_key = "".join(
        f'<li data-sign="{"negative" if item["coefficient"] < 0 else "positive"}">'
        f'<span>{_esc(item["row"]["name"])}</span><strong>{item["coefficient"]:+.4f}</strong></li>'
        for item in geometry
    )
    return (
        '<svg class="basis-fan-svg is-drawn is-fallback" viewBox="0 0 1000 640" role="img" '
        f'aria-label="Strongest Pearson relationships with {_esc(axis_name)}, drawn at their literal correlation angle">'
        f'<title>Association geometry for {_esc(axis_name)}</title>'
        '<path class="basis-fan-guide" d="M100 570 A400 400 0 0 1 900 570"></path>'
        '<line class="basis-fan-orthogonal" x1="500" y1="570" x2="500" y2="170"></line>'
        '<text class="basis-fan-guide-label" x="512" y="184">90° / r 0</text>'
        '<g class="basis-fan-origin">'
        '<line class="basis-fan-origin-line" x1="500" y1="570" x2="900" y2="570"></line>'
        f'<text class="basis-fan-origin-label" x="892" y="558" text-anchor="end">{_esc(axis_name)} · r +1</text>'
        '<circle cx="500" cy="570" r="7"></circle>'
        '</g>'
        f'{"".join(rays)}</svg>'
        f'<ol class="basis-fan-fallback-key" aria-label="Strongest observed relationships">{fallback_key}</ol>'
    )


def _home(lib: Library) -> str:
    payload = build_explorer_payload(lib)
    hero = payload["hero"]
    levels = {level["requested_level"]: level for level in hero["levels"]}
    state_labels = {
        "low": ("Restrained", "tight practical edges"),
        "medium": ("Visible", "warm edge spread"),
        "high": ("Pronounced", "red emulsion-like leak"),
    }
    state_tokens = {"low": "xL", "medium": "xM", "high": "xH"}
    hero_layers = []
    hero_controls = []
    for index, level_name in enumerate(("low", "medium", "high"), start=1):
        level = levels[level_name]
        observation_id = level["observation_id"]
        active = level_name == "high"
        hero_layers.append(
            _home_media(
                lib,
                observation_id,
                alt="",
                class_name=f'hero-layer{" is-active" if active else ""}',
                loading="eager",
                decoding="sync" if active else "async",
                fetchpriority="high" if active else "low",
                extra=(
                    f'data-hero-layer data-state="{level_name}" '
                    f'data-observation-id="{observation_id}" '
                    f'aria-hidden="{"false" if active else "true"}"'
                ),
            )
        )
        label, note = state_labels[level_name]
        hero_controls.append(
            f'<label class="hero-state-option{" is-active" if active else ""}">'
            f'<input type="radio" name="hero-state" value="{level_name}" data-hero-state '
            f'{"checked" if active else ""}>'
            f'<span class="state-code">0{index} / {state_tokens[level_name]}</span>'
            f'<span class="state-name">{label}</span><small>{note}</small></label>'
        )

    hero_metric_ids = (
        "vec_halation",
        "vec_highlight_bloom",
        "vec_optical_softness",
        "vec_diffusion",
    )
    low_scores = {score["vector_id"]: score for score in levels["low"]["scores"]}
    high_scores = {score["vector_id"]: score for score in levels["high"]["scores"]}
    hero_metrics = []
    for vector_id in hero_metric_ids:
        score = high_scores[vector_id]
        hero_metrics.append(
            f'<div class="hero-metric" style="--score:{score["value"]:.3f}">'
            f'<dt>{_esc(score["name"])}</dt><dd data-score="{vector_id}">{score["value"]:.2f}</dd>'
            f'<i aria-hidden="true"><b></b></i></div>'
        )
    hero_delta = high_scores["vec_halation"]["value"] - low_scores["vec_halation"]["value"]

    responses = payload["responses"]
    default_response = next(row for row in responses if row["vector_id"] == "vec_halation")
    response_buttons = []
    for response in responses:
        active = response["vector_id"] == default_response["vector_id"]
        qualifier = "near-alias" if response["vector_id"] == "vec_edge_softness" else "n=5"
        response_buttons.append(
            f'<button type="button" data-response-axis="{response["vector_id"]}" '
            f'data-label="{_esc(response["name"])}" '
            f'aria-pressed="{"true" if active else "false"}" class="{"is-active" if active else ""}">'
            f'<span>{_esc(response["name"])}</span><small>{qualifier}</small></button>'
        )

    correlations = _correlation_rows(payload, "vec_optical_softness", limit=99)
    correlation_n = correlations[0]["n"] if correlations else 0
    correlation_marks, _ = _correlation_fallback(correlations[:6])
    _, correlation_table = _correlation_fallback(correlations)
    correlation_axes = (
        "vec_optical_softness",
        "vec_edge_softness",
        "vec_halation",
        "vec_shadow_density",
        "vec_highlight_bloom",
        "vec_black_level",
    )
    correlation_buttons = []
    for vector_id in correlation_axes:
        vector = lib.vectors[vector_id]
        active = vector_id == "vec_optical_softness"
        correlation_buttons.append(
            f'<button type="button" data-correlation-axis="{vector_id}" '
            f'data-label="{_esc(vector.canonical_name)}" '
            f'aria-pressed="{"true" if active else "false"}" class="{"is-active" if active else ""}">'
            f'{_esc(vector.canonical_name)}</button>'
        )

    reconstruction = payload["reconstruction"]
    selected_plates = {plate["anchor_id"]: plate for plate in reconstruction["selected_plates"]}
    recon_cards = []
    for anchor_id in ("anchor_object", "anchor_landscape"):
        plate = selected_plates[anchor_id]
        recon_cards.append(
            f'<a class="recon-card" href="observations/{plate["observation_id"]}.html">'
            f'{_home_media(lib, plate["observation_id"], alt=f"{plate["anchor_name"]} reconstruction result")}'
            f'<span><b>{_esc(plate["anchor_name"])}</b><em>agent score {plate["score"]:.2f}</em></span></a>'
        )
    residual_items = "".join(
        f'<li><span>{_esc(item["name"])}</span><strong>{item["count"]}/{item["n"]}</strong></li>'
        for item in reconstruction["residual_counts"]
    )

    studied_rows = []
    for response in responses:
        studied_rows.append(
            f'<a class="ledger-row" href="vectors/{response["vector_id"]}.html">'
            f'<span class="status-mark observed" aria-hidden="true"></span>'
            f'<strong>{_esc(response["name"])}</strong><span>{_esc(response["decision"] or response["status"])}</span>'
            f'<span>{response["n_pairs"]} paired scenes</span><b>↗</b></a>'
        )

    halation_high = lib.observations["obs_0159"]
    bloom_high = lib.observations["obs_0174"]
    halation_high_halation = _score_value(lib, halation_high.id, "vec_halation")
    halation_high_bloom = _score_value(lib, halation_high.id, "vec_highlight_bloom")
    bloom_high_halation = _score_value(lib, bloom_high.id, "vec_halation")
    bloom_high_bloom = _score_value(lib, bloom_high.id, "vec_highlight_bloom")

    return f"""
<section class="award-hero" data-hero-instrument data-active-state="high" aria-labelledby="hero-title">
  <div class="hero-manifest">
    <p class="eyebrow">Visual Basis Atlas / Grok Imagine under observation</p>
    <h1 id="hero-title">Hold the room.<br><em>Move the light.</em></h1>
    <p class="hero-definition">Controlled image studies showing how specific visual directions change Grok Imagine outputs—and which other properties move with them.</p>
  </div>

  <div class="hero-origin">
    <figure class="hero-stage" id="hero-registered-stage" data-hero-stage data-hero-view="isolate" style="--gate-a:0%;--gate-b:0%">
      <div class="hero-media" data-hero-scan-stage>{"".join(hero_layers)}
        <div class="hero-scan-guides" aria-hidden="true">
          <span data-scan-boundary="a"></span><span data-scan-boundary="b"></span>
          <span data-scan-label="low">01 / low</span>
          <span data-scan-label="medium">02 / medium</span>
          <span data-scan-label="high">03 / high</span>
        </div>
        <span class="hero-plate-corner corner-a" aria-hidden="true"></span>
        <span class="hero-plate-corner corner-b" aria-hidden="true"></span>
      </div>
      <figcaption id="hero-description">Three categorical outputs from one locked lamp-present room. <strong>3 actual outputs · 0 interpolated frames.</strong></figcaption>
      <p id="hero-scan-help" class="sr-only">The scanner changes only where the three registered outputs are revealed. It does not create an intermediate image or change the requested halation level.</p>
      <div class="hero-scan-toolbar">
        <button type="button" data-hero-scan-toggle aria-pressed="false" aria-controls="hero-registered-stage hero-scan-position" aria-describedby="hero-scan-help" hidden>
          <span data-hero-scan-toggle-label>Register 3 outputs</span><small>hard partitions · no blend</small>
        </button>
        <label id="hero-scan-position" data-hero-scan-control hidden>
          <span>Spatial scan position</span>
          <input type="range" data-hero-scan data-scan-half="8" min="12" max="88" step="1" value="50" aria-describedby="hero-scan-help" aria-valuetext="Comparison centered at 50 percent">
          <output data-hero-scan-output>50%</output>
        </label>
      </div>
    </figure>

    <aside class="hero-measure" aria-describedby="hero-description">
      <p class="sr-only" role="status" aria-live="polite" data-instrument-status></p>
      <div class="instrument-head"><span>Requested direction</span><strong>halation</strong></div>
      <div class="hero-observation"><span>Active output</span><strong data-hero-observation>{levels["high"]["observation_id"]}</strong><b data-hero-label>high</b></div>
      <fieldset class="hero-state-controls"><legend class="sr-only">Requested halation state</legend>{"".join(hero_controls)}</fieldset>
      <div class="hero-delta">
        <span>Observed movement</span><strong data-hero-delta="vec_halation">Δ {hero_delta:+.2f}</strong><small>from low state</small>
      </div>
      <dl class="metric-vector" data-hero-score>{"".join(hero_metrics)}</dl>
      <p class="field-note" data-hero-note><span>Protocol note</span> {_esc(str(levels["high"]["notes"]))}</p>
    </aside>
  </div>

  <dl class="hero-ledger" aria-label="Atlas evidence summary">
    <div><dt>{payload["stats"]["observations"]}</dt><dd>registry observations</dd></div>
    <div><dt>{correlation_n}</dt><dd>complete-score cohort</dd></div>
    <div><dt>{payload["stats"]["controlled_vector_studies"]}</dt><dd>controlled axes</dd></div>
  </dl>
  <p class="hero-method-note">Operational candidate basis · agent-visual scoring · no model-native coefficients</p>
</section>

<section class="home-chapter response-section" id="response" aria-labelledby="response-title">
  <header class="chapter-copy response-copy">
    <p class="chapter-index">01 / Response field</p>
    <h2 id="response-title">A direction leaves a wake.</h2>
    <p>Move one requested property across five locked scenes. Every trace is the mean paired high-minus-low movement that came with it.</p>
  </header>
  <div class="response-stage response-instrument" data-response-instrument data-active-axis="vec_halation">
    <p class="sr-only" role="status" aria-live="polite" data-instrument-status></p>
    <div class="axis-selector" aria-label="Controlled study">{"".join(response_buttons)}</div>
    <div class="response-field">
      <div class="response-equation" aria-label="Mean response delta equals one fifth of the sum of each high state minus its low state">
        <span>Δx̄</span><b>=</b><span class="fraction"><i>1</i><i>5</i></span><span>Σ</span><span>(x<sub>s,H</sub> − x<sub>s,L</sub>)</span>
      </div>
      <div class="response-zero" aria-hidden="true"><span>−</span><b>0</b><span>+</span></div>
      <div class="response-chart" data-response-chart>{_response_rows(default_response)}</div>
    </div>
    <footer class="instrument-foot"><span data-response-meta>n={default_response["n_pairs"]} paired scenes · high − low</span><span>agent-visual scoring</span></footer>
  </div>
</section>

<section class="home-chapter discrimination-section" id="discriminate" aria-labelledby="discriminate-title">
  <header class="chapter-copy discrimination-copy">
    <p class="chapter-index">02 / Discrimination</p>
    <h2 id="discriminate-title">Similar is not the same.</h2>
    <p>Two high-intensity requests. The same lamp-present room. One produces a red edge leak; the other spreads pale luminance.</p>
  </header>
  <figure class="light-compare" data-compare data-compare-clip style="--split:50%">
    <div class="compare-a">
      {_home_media(lib, bloom_high.id, alt="", class_name="compare-image")}
      <span class="compare-label compare-label-right"><b>Highlight bloom</b><small>obs_0174</small></span>
    </div>
    <div class="compare-b">
      {_home_media(lib, halation_high.id, alt="", class_name="compare-image")}
      <span class="compare-label compare-label-left"><b>Halation</b><small>obs_0159</small></span>
    </div>
    <span class="compare-divider" aria-hidden="true"><i></i></span>
    <label class="compare-control"><span>Reveal boundary</span><input class="compare-range" type="range" min="4" max="96" step="1" value="50" aria-label="Reveal halation versus highlight bloom"><output data-compare-value>50%</output></label>
    <figcaption>Same anchor and requested intensity. Drag the boundary to compare two actual outputs.</figcaption>
  </figure>
  <div class="compare-readout" aria-label="High-state comparison scores">
    <div><span>Halation request</span><strong>halation {_score_text(halation_high_halation)}</strong><em>bloom {_score_text(halation_high_bloom)}</em></div>
    <div><span>Bloom request</span><strong>bloom {_score_text(bloom_high_bloom)}</strong><em>halation {_score_text(bloom_high_halation)}</em></div>
    <p><b>Observed distinction</b> Halation retains a colored leak around existing highlights. Bloom expands brightness without the red edge.</p>
  </div>
</section>

<section class="home-chapter coupling-section" id="coupling" data-correlation-instrument data-active-axis="vec_optical_softness" aria-labelledby="coupling-title">
  <header class="chapter-copy coupling-copy">
    <p class="chapter-index">03 / Association geometry</p>
    <h2 id="coupling-title">The basis is operational.<br>Not orthogonal.</h2>
    <p>Correlation becomes literal angle: θ = arccos(r). Close rays move together; rays beyond 90° move inversely.</p>
  </header>
  <div class="coupling-stage">
    <p class="sr-only" role="status" aria-live="polite" data-instrument-status></p>
    <div class="correlation-controls" aria-label="Correlation focus">{"".join(correlation_buttons)}</div>
    <div class="basis-notation"><span>r = cos θ</span><small>centered standardized scores · n={correlation_n}</small></div>
    <div class="basis-fan" data-basis-fan>{_basis_fan_svg(correlations[:6], "optical softness")}</div>
    <div class="correlation-ruler fan-source" data-correlation-ruler aria-hidden="true">{correlation_marks}</div>
    <details class="data-table-disclosure"><summary>Inspect the complete correlation table</summary>
      <div class="table-wrap"><table data-correlation-table><caption>Complete-score relationships with optical softness</caption><thead><tr><th>Dimension</th><th>Pearson r</th><th>n</th></tr></thead><tbody>{correlation_table}</tbody></table></div>
    </details>
    <footer class="instrument-foot"><span>Pearson r over the complete-score cohort only</span><span>association geometry · not Grok latent space · not causality</span></footer>
  </div>
</section>

<section class="home-chapter reconstruction-section" id="reconstruction" aria-labelledby="reconstruction-title">
  <header class="chapter-copy reconstruction-copy">
    <p class="chapter-index">04 / Reconstruction</p>
    <h2 id="reconstruction-title">Build the look. Inspect what escaped.</h2>
    <p>A manual first-order coordinate can organize a visual treatment without pretending to fully explain it.</p>
  </header>
  <div class="reconstruction-stage">
    <div class="recon-equation" aria-label="Estimated aesthetic equals point seven eight optical softness plus point seven zero shadow density plus point five eight halation">
      <span>â</span><b>=</b><span>.78v<sub>optical</sub></span><b>+</b><span>.70v<sub>shadow</sub></span><b>+</b><span>.58v<sub>halation</sub></span>
    </div>
    <p class="hypothesis-note"><span class="status-mark hypothesis" aria-hidden="true"></span> manually assigned first-order hypothesis · not fitted coefficients</p>
    <div class="recon-grid">{"".join(recon_cards)}</div>
    <dl class="recon-stats">
      <div><dt>Mean</dt><dd>{reconstruction["aggregate"]["mean"]:.3f}</dd></div>
      <div><dt>Median</dt><dd>{reconstruction["aggregate"]["median"]:.2f}</dd></div>
      <div><dt>Range</dt><dd>{reconstruction["aggregate"]["range"][0]:.2f}–{reconstruction["aggregate"]["range"][1]:.2f}</dd></div>
      <div><dt>Human ratings</dt><dd>none</dd></div>
    </dl>
  </div>
  <aside class="residual-break" aria-labelledby="residual-title">
    <div><p class="chapter-index">Residual / a = â + r</p><h3 id="residual-title">What escaped.</h3><p>Recorded residual flags—not a pixel-error map or numerical residual norm.</p></div>
    <ul>{residual_items}</ul>
  </aside>
</section>

<section class="atlas-entry archive-stage" id="atlas-search" aria-labelledby="atlas-title">
  <header class="chapter-copy archive-copy">
    <p class="chapter-index">05 / The atlas</p>
    <h2 id="atlas-title">Enter through something you can see.</h2>
    <p>Search the working language, then follow its evidence, status, and unresolved edges.</p>
  </header>
  <div class="archive-search" data-search-scope>
    <form class="search-form" role="search" data-atlas-search data-prefix="">
      <label for="atlas-search-q">Search the research index</label>
      <div class="search-input-row"><input id="atlas-search-q" name="q" type="search" placeholder="Try halation, analog, or shadow density" autocomplete="off"><button type="submit">Search</button></div>
      <div class="search-filters" aria-label="Filter results">
        <button type="button" class="is-active" data-search-filter="all" aria-pressed="true">All</button>
        <button type="button" data-search-filter="studied" aria-pressed="false">Studied</button>
        <button type="button" data-search-filter="provisional" aria-pressed="false">Provisional</button>
        <button type="button" data-search-filter="candidate" aria-pressed="false">Candidate</button>
        <button type="button" data-search-filter="system" aria-pressed="false">System</button>
        <button type="button" data-search-filter="hypothesis" aria-pressed="false">Hypothesis</button>
      </div>
      <div class="search-results" data-search-results role="status" aria-live="polite"></div>
    </form>
    <div class="atlas-ledger" aria-label="Controlled vector studies">{"".join(studied_rows)}</div>
  </div>
  <footer class="entry-footer"><span>{payload["stats"]["vectors"]} vector records</span><span>{payload["stats"]["controlled_vector_studies"]} controlled axes</span><span>{payload["stats"]["observations"]} registry observations</span><span>{correlation_n} in shared-score cohort</span></footer>
</section>
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
