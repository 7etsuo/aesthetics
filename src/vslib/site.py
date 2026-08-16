"""Searchable static site generated from the same records as the wiki."""

from __future__ import annotations

import json
import shutil
from hashlib import sha256
from math import acos, degrees
from pathlib import Path

from PIL import Image

from vslib.matrices import nearest_aesthetics
from vslib.site_chamber import HERO_OBSERVATION_IDS as CHAMBER_HERO_OBSERVATION_IDS
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
    "Visual Basis Atlas social preview showing an illustrative coastal optical "
    "depth field."
)

WORLD_MANIFEST = "assets/world-v5/atlas-world-v2.json"
WORLD_BEATS = (
    "control",
    "response",
    "comparison",
    "association",
    "reconstruction",
    "archive",
)
WORLD_EVIDENCE_DISCLOSURE = (
    "Control, Comparison, and Reconstruction use registered, ungraded evidence "
    "derivatives. Archive is a registered atlas contact-sheet preview linking to "
    "canonical observations. The cinematic depth field is illustrative, not a model "
    "output."
)

HOME_MEDIA_IDS = (
    *CHAMBER_HERO_OBSERVATION_IDS,
    "obs_0177",
    "obs_0052", "obs_0055",
)


def _scene_plate_path(viewport: str, beat: str, *, depth: bool = False) -> str:
    suffix = "-depth" if depth else ""
    return f"assets/world-v5/plates/{viewport}/{beat}{suffix}.webp"

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
        lib.root / "assets" / "audio" / "CREDITS.md",
        lib.root / "assets" / "vendor" / "three.LICENSE.txt",
        lib.root / WORLD_MANIFEST,
        lib.root / "assets" / "fonts" / "inter-tight-latin.woff2",
        lib.root / "assets" / "fonts" / "instrument-serif-regular-latin.woff2",
        lib.root / "assets" / "fonts" / "Instrument-OFL.txt",
        lib.root / "assets" / "fonts" / "ibm-plex-mono-regular-latin.woff2",
        lib.root / "assets" / "fonts" / "ibm-plex-mono-medium-latin.woff2",
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
    scene_plate_sources = _validate_world_manifest(lib.root)
    required_sources = (
        *required_sources,
        *(lib.root / source for source in scene_plate_sources),
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
        site / "observations.html", "Observations", _observation_index(lib), nav="studies",
        description="The complete index of registered generated observations in the Visual Basis Atlas.",
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


def _validate_world_manifest(root: Path) -> tuple[Path, ...]:
    """Validate the frozen depth-parallax scene-plate package before site mutation."""
    manifest_path = root / WORLD_MANIFEST
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if manifest.get("format") != "atlas-world/v2" or manifest.get("version") != 2:
        raise ValueError("world manifest must use atlas-world/v2")

    retired_keys = {
        "archiveBindings",
        "chapters",
        "control",
        "evidenceBindings",
        "fieldStation",
        "models",
        "requiredNodes",
        "variants",
    }
    stale_keys = sorted(retired_keys.intersection(manifest))
    if stale_keys:
        raise ValueError(
            "world manifest contains retired scene fields: " + ", ".join(stale_keys)
        )

    scene_plates = manifest.get("scenePlates")
    if not isinstance(scene_plates, dict):
        raise ValueError("world manifest must define scenePlates")
    if scene_plates.get("renderer") != "depth-parallax-v1":
        raise ValueError("world manifest renderer must be depth-parallax-v1")
    if scene_plates.get("order") != list(WORLD_BEATS):
        raise ValueError("world manifest scene-plate order must match the six semantic beats")

    expected_interaction = {
        "firstResponseMs": 48,
        "settleMs": 240,
        "maxParallaxPx": {"desktop": 18, "mobile": 10},
        "maxRelightEv": 0.6,
        "transitionMs": 900,
    }
    if scene_plates.get("interaction") != expected_interaction:
        raise ValueError("world manifest scene-plate interaction bounds are stale")

    expected_depth_estimator = {
        "model": "depth-anything/Depth-Anything-V2-Small-hf",
        "revision": "5426e4f0f36572d16453bbda7a8389317b1bef99",
        "license": "Apache-2.0",
        "modelCard": (
            "https://huggingface.co/depth-anything/"
            "Depth-Anything-V2-Small-hf/tree/"
            "5426e4f0f36572d16453bbda7a8389317b1bef99"
        ),
        "licenseUrl": "https://www.apache.org/licenses/LICENSE-2.0",
        "localFilesOnly": True,
    }
    if scene_plates.get("depthEstimator") != expected_depth_estimator:
        raise ValueError("world manifest depthEstimator is stale or incomplete")

    expected_depth_encoding = {
        "kind": "relative-inverse-depth",
        "bitDepth": 8,
        "channels": 1,
        "near": 255,
        "far": 0,
        "normalization": "per-plate-min-max",
        "resampling": "bicubic-align-corners-false",
        "lossless": True,
    }
    if scene_plates.get("depthEncoding") != expected_depth_encoding:
        raise ValueError("world manifest depthEncoding is stale or incomplete")

    expected_focal_convention = {
        "coordinates": "normalized-[x,y]",
        "origin": "top-left",
        "space": "intrinsic-plate-pixels",
    }
    focal_convention = scene_plates.get("focalPointConvention")
    if not isinstance(focal_convention, dict) or any(
        focal_convention.get(key) != value
        for key, value in expected_focal_convention.items()
    ):
        raise ValueError("world manifest focalPointConvention is stale or incomplete")

    variants = scene_plates.get("variants")
    if not isinstance(variants, dict) or tuple(variants) != ("desktop", "mobile"):
        raise ValueError("world manifest must define ordered desktop and mobile scene plates")

    record_keys = {"path", "sha256", "bytes", "width", "height", "mime"}
    sources: list[Path] = []
    for viewport, variant in variants.items():
        if not isinstance(variant, dict) or tuple(variant) != WORLD_BEATS:
            raise ValueError(
                f"world manifest {viewport} scene plates must follow the six-beat order"
            )
        for beat, plate in variant.items():
            if not isinstance(plate, dict) or set(plate) != {"color", "depth", "focalPoint"}:
                raise ValueError(
                    f"world manifest {viewport} {beat} scene plate is incomplete"
                )
            focal_point = plate["focalPoint"]
            if (
                not isinstance(focal_point, list)
                or len(focal_point) != 2
                or any(
                    isinstance(value, bool)
                    or not isinstance(value, (int, float))
                    or not 0 <= value <= 1
                    for value in focal_point
                )
            ):
                raise ValueError(
                    f"world manifest {viewport} {beat} focalPoint must be normalized [x,y]"
                )

            for role in ("color", "depth"):
                record = plate[role]
                if not isinstance(record, dict) or set(record) != record_keys:
                    raise ValueError(
                        f"world manifest {viewport} {beat} {role} record is incomplete"
                    )
                expected_path = _scene_plate_path(
                    viewport, beat, depth=role == "depth"
                )
                if record["path"] != expected_path:
                    raise ValueError(
                        f"world manifest {viewport} {beat} {role} path must be {expected_path}"
                    )
                digest = record["sha256"]
                if (
                    not isinstance(digest, str)
                    or len(digest) != 64
                    or digest != digest.lower()
                    or any(character not in "0123456789abcdef" for character in digest)
                ):
                    raise ValueError(
                        f"world manifest {viewport} {beat} {role} checksum is invalid"
                    )
                for dimension in ("bytes", "width", "height"):
                    value = record[dimension]
                    if isinstance(value, bool) or not isinstance(value, int) or value <= 0:
                        raise ValueError(
                            f"world manifest {viewport} {beat} {role} {dimension} is invalid"
                        )
                if record["mime"] != "image/webp":
                    raise ValueError(
                        f"world manifest {viewport} {beat} {role} mime must be image/webp"
                    )

                relative = Path(record["path"])
                asset = root / relative
                if not asset.is_file():
                    raise FileNotFoundError(f"world manifest asset is missing: {relative}")
                encoded = asset.read_bytes()
                if len(encoded) != record["bytes"]:
                    raise ValueError(f"world manifest byte count is stale: {relative}")
                if sha256(encoded).hexdigest() != digest:
                    raise ValueError(f"world manifest checksum is stale: {relative}")
                try:
                    with Image.open(asset) as image:
                        actual_format = image.format
                        actual_size = image.size
                except OSError as error:
                    raise ValueError(
                        f"world manifest asset is not a readable WebP: {relative}"
                    ) from error
                if actual_format != "WEBP" or actual_size != (
                    record["width"],
                    record["height"],
                ):
                    raise ValueError(
                        f"world manifest dimensions or mime are stale: {relative}"
                    )
                sources.append(relative)

            color = plate["color"]
            depth = plate["depth"]
            if (
                color["width"],
                color["height"],
                color["mime"],
            ) != (
                depth["width"],
                depth["height"],
                depth["mime"],
            ):
                raise ValueError(
                    f"world manifest {viewport} {beat} color/depth records must match"
                )

    if len(sources) != 24 or len(set(sources)) != 24:
        raise ValueError("world manifest must reference 24 unique scene-plate assets")
    return tuple(sources)


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
        f'<link rel="preload" as="image" href="{_scene_plate_path("desktop", "control")}" '
        'type="image/webp" media="(min-width: 768px)" fetchpriority="high">'
        f'<link rel="preload" as="image" href="{_scene_plate_path("mobile", "control")}" '
        'type="image/webp" media="(max-width: 767px)" fetchpriority="high">'
        f'<link rel="preload" as="fetch" href="{WORLD_MANIFEST}" '
        'type="application/json" crossorigin="anonymous">'
        '<link rel="preload" as="font" href="assets/fonts/instrument-serif-regular-latin.woff2" '
        'type="font/woff2" crossorigin>'
        '<link rel="preload" as="font" href="assets/fonts/inter-tight-latin.woff2" '
        'type="font/woff2" crossorigin>'
        '<link rel="preload" as="font" href="assets/fonts/ibm-plex-mono-regular-latin.woff2" '
        'type="font/woff2" crossorigin>'
        '<link rel="modulepreload" href="assets/chamber.js">'
        '<link rel="modulepreload" href="assets/chamber-audio.js">'
        if hero else ""
    )
    home_styles = '<link rel="stylesheet" href="assets/home.css">' if hero else ""
    home_script = (
        '\n<script type="module" src="assets/chamber.js"></script>'
        if hero else ""
    )
    early_gate_script = (
        '<script>if(location.protocol==="file:"){document.documentElement.classList.remove("has-js");}'
        'else{document.documentElement.classList.add("has-js","is-entry-open");'
        'window.setTimeout(()=>{const root=document.querySelector("[data-chamber]");'
        'if(!root||root.dataset.ready!=="true"){const doc=document.documentElement;'
        'doc.classList.remove("has-js","is-entry-open");document.body?.classList.remove("is-entry-open");'
        'if(root){root.dataset.bootTimedOut="true";root.removeAttribute("data-ready");'
        'root.__atlasDirector?.leaveSemanticEdition?.("Boot timed out");'
        'const entry=root.querySelector("[data-chamber-entry]");'
        'if(entry){entry.dataset.entryState="dismissed";entry.setAttribute("aria-hidden","true");'
        'entry.setAttribute("aria-busy","false");entry.removeAttribute("aria-modal");}'
        'root.querySelectorAll("[data-entry-inert]").forEach(node=>{node.inert=false;'
        'node.removeAttribute("data-entry-inert");});}'
        'document.getElementById("main")?.focus({preventScroll:true});}},10000);}</script>'
        if hero else ""
    )
    theme_color = "#DBE7E6" if hero else "#edf2f1"
    color_scheme = "light"
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
      <span class="mark-name">Visual Basis Atlas</span>
      <span class="mark-context">Grok Imagine / evidence atlas</span>
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
    <p>A public record of controlled Grok Imagine studies: registered output records, measured responses, and provisional visual coordinates.</p>
  </div>
  <nav class="site-footer-links" aria-label="Secondary navigation">
    <a href="{prefix}vectors.html">Vectors</a>
    <a href="{prefix}studies.html">Studies</a>
    <a href="{prefix}families.html">Families</a>
    <a href="{prefix}aliases.html">Aliases</a>
    <a href="{prefix}questions.html">Open questions</a>
  </nav>
  <p class="site-footer-note">Observed output space · agent-visual scoring · no model-native coefficients · no affiliation with xAI</p>
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
    """Render the semantic and static-fallback edition of the V5 world."""
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
    world_manifest = json.loads(
        (lib.root / WORLD_MANIFEST).read_text(encoding="utf-8")
    )
    scene_plate_variants = world_manifest["scenePlates"]["variants"]

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
    hero_anchor = lib.anchors[chamber["hero"]["anchor_id"]].name
    state_names = {"low": "Low", "medium": "Medium", "high": "High"}
    hero_static = []
    state_controls = []
    for level_name in ("low", "medium", "high"):
        observation_id = hero_ids[level_name]
        # The chamber opens at the registered medium request. Keep the semantic
        # proof and the illustrative depth field aligned at boot.
        active = level_name == "medium"
        score = observed_score(observation_id, hero_vector_id)
        proof_image = _home_media(
            lib,
            observation_id,
            alt=(
                f"{hero_anchor}, {level_name} requested "
                f"{hero_vector_name.lower()}"
            ),
            loading="eager",
            extra="data-documentary-evidence",
        )
        hero_static.append(
            f'<a id="control-proof-{level_name}" '
            f'href="observations/{observation_id}.html" '
            f'data-control-proof-state="{level_name}" data-observation-id="{observation_id}"'
            f'{" aria-current=\"true\"" if active else ""}>'
            f'{proof_image}'
            f'<span><b>{_esc(state_names[level_name])}</b>'
            f'<small>Registered derivative · ungraded · {observation_id} · '
            f'{_esc(hero_vector_name.lower())} {_score_text(score)}</small></span></a>'
        )
        state_controls.append(
            f'<button type="button" data-chamber-state="{level_name}" '
            f'data-world-target="halation-{level_name}" '
            f'data-observation-id="{observation_id}" aria-controls="control-proof-{level_name}" '
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
            f'<li data-vector-id="{_esc(item["vector_id"])}" '
            f'data-sign="{"negative" if value < 0 else "positive"}" '
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
            f'<tr data-vector-id="{_esc(item["id"])}" style="--angle:{angle:.1f}deg" '
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
        item["anchor_id"]: item for item in chamber_reconstruction["selected_plates"]
    }
    reconstruction_media = []
    for anchor_id in ("anchor_object", "anchor_landscape"):
        item = reconstruction_by_anchor[anchor_id]
        reconstruction_media.append(
            f'<a href="observations/{item["observation_id"]}.html" '
            f'data-observation-id="{item["observation_id"]}">'
            f'{_home_media(lib, item["observation_id"], alt=f"{item["anchor_name"]} reconstruction result", extra="data-documentary-evidence")}'
            f'<span><b>{_esc(item["anchor_name"])}</b>'
            f'<small>{item["observation_id"]} · score {item["score"]:.2f}</small></span></a>'
        )

    archive_observations = chamber["field"]["observations"]
    if len(archive_observations) != chamber["field"]["observation_count"]:
        raise ValueError("archive contact sheet must match the nonhuman field cohort")
    archive_atlas = chamber["field"]["atlas"]
    archive_atlas_spec = archive_atlas["desktop"]
    archive_columns = archive_atlas["columns"]
    archive_cell_size = archive_atlas_spec["cell_size"]
    archive_gutter = archive_atlas_spec["gutter"]
    archive_tile_size = archive_cell_size - (2 * archive_gutter)
    archive_position_width = archive_atlas_spec["width"] - archive_tile_size
    archive_position_height = archive_atlas_spec["height"] - archive_tile_size
    archive_background_width = archive_atlas_spec["width"] / archive_tile_size * 100
    archive_background_height = archive_atlas_spec["height"] / archive_tile_size * 100
    archive_contacts = []
    for item in archive_observations:
        observation_id = item["id"]
        index = archive_atlas["entries"][observation_id]
        row, column = divmod(index, archive_columns)
        cell_x = (
            archive_atlas_spec["offset_x"]
            + column * archive_cell_size
            + archive_gutter
        )
        cell_y = (
            archive_atlas_spec["offset_y"]
            + row * archive_cell_size
            + archive_gutter
        )
        position_x = cell_x / archive_position_width * 100
        position_y = cell_y / archive_position_height * 100
        anchor = lib.anchors.get(item["anchor_id"])
        anchor_name = anchor.name if anchor else item["anchor_id"]
        vector = lib.vectors.get(item["vector_id"]) if item["vector_id"] else None
        if vector:
            direction = f'{item["requested_level"]} requested {vector.canonical_name.lower()}'
        elif item["requested_level"] == "baseline":
            direction = "registered baseline"
        else:
            direction = f'registered {item["requested_level"]} observation'
        alt = f"{anchor_name}, {direction}"
        archive_contacts.append(
            f'<li><a href="observations/{observation_id}.html" '
            f'data-archive-preview-entry data-archive-index="{index}" '
            f'data-observation-id="{observation_id}">'
            f'<span class="archive-contact-crop" aria-hidden="true" '
            f'data-archive-preview-crop '
            f'style="--atlas-x:{position_x:.6f}%;--atlas-y:{position_y:.6f}%"></span>'
            f'<span class="archive-contact-id" aria-hidden="true">'
            f'{_esc(observation_id)}</span>'
            f'<span class="sr-only">{_esc(observation_id)} · {_esc(alt)}</span>'
            f'</a></li>'
        )

    residual = " · ".join(
        f'{item["name"]} {item["count"]}/{item["n"]}'
        for item in chamber_reconstruction["residual_counts"]
    )
    chamber_json = json.dumps(
        chamber, separators=(",", ":"), allow_nan=False
    ).replace("</", "<\\/")
    halation_halation = observed_score(comparison_ids["halation"], "vec_halation")
    halation_bloom = observed_score(comparison_ids["halation"], "vec_highlight_bloom")
    bloom_halation = observed_score(comparison_ids["bloom"], "vec_halation")
    bloom_bloom = observed_score(comparison_ids["bloom"], "vec_highlight_bloom")

    def fallback_frame(beat: str, *, active: bool = False) -> str:
        priority = "high" if active else "low"
        loading = "eager" if active else "lazy"
        desktop_plate = _scene_plate_path("desktop", beat)
        mobile_plate = _scene_plate_path("mobile", beat)
        desktop_focal = scene_plate_variants["desktop"][beat]["focalPoint"]
        mobile_focal = scene_plate_variants["mobile"][beat]["focalPoint"]
        focal_style = (
            f"--plate-x:{desktop_focal[0] * 100:.3f}%;"
            f"--plate-y:{desktop_focal[1] * 100:.3f}%;"
            f"--plate-mobile-x:{mobile_focal[0] * 100:.3f}%;"
            f"--plate-mobile-y:{mobile_focal[1] * 100:.3f}%"
        )
        return f"""
      <picture class="world-fallback-frame{' is-active' if active else ''}"
        data-world-fallback-frame="{beat}" aria-hidden="{'false' if active else 'true'}"
        style="{focal_style}">
        <source media="(max-width: 767px)" srcset="{mobile_plate}">
        <img src="{desktop_plate}" alt="" loading="{loading}"
          decoding="async" fetchpriority="{priority}">
      </picture>"""

    fallback_frames = "".join(
        fallback_frame(beat, active=beat == "control") for beat in WORLD_BEATS
    )

    return f"""
<div class="observation-chamber" data-chamber data-prefix="" data-world="coastal-optical-atlas"
  data-world-version="5" data-world-manifest="{WORLD_MANIFEST}"
  data-chamber-state="medium" data-selected-observation="{hero_ids['medium']}">
  <script type="application/json" id="chamber-data">{chamber_json}</script>

  <header class="chamber-masthead">
    <a class="chamber-mark" href="index.html" aria-label="Visual Basis Atlas home">
      <b>Visual Basis Atlas</b>
      <span>Grok Imagine / observed output space</span>
    </a>
    <button class="sound-toggle" type="button" data-sound-toggle aria-pressed="false" aria-label="Sound control">
      <span class="sound-glyph" aria-hidden="true"><i></i><i></i><i></i></span>
      <span data-sound-label data-sound-disable-label="Mute music">Play music</span>
    </button>
  </header>

  <div class="chamber-entry" data-chamber-entry data-entry-state="open" data-world-entry role="status" aria-live="polite" aria-busy="true" aria-labelledby="chamber-entry-title" aria-describedby="chamber-entry-note">
    <div class="entry-copy" data-world-copy>
      <p class="entry-overline">Visual Basis Atlas <span>Grok Imagine under observation</span></p>
      <h2 id="chamber-entry-title">The image<br>answers back.</h2>
      <p id="chamber-entry-note">One requested variable changes. Across locked anchors, the rest of the image answers.</p>
      <div class="entry-actions">
        <button type="button" data-enter disabled aria-disabled="true"><span data-enter-label>Preparing the observation chamber…</span></button>
      </div>
    </div>
  </div>

  <div class="chamber-viewport" data-chamber-canvas data-world-viewport>
    <div class="world-fallback" data-chamber-fallback data-world-fallback aria-hidden="true">
      {fallback_frames}
    </div>
    <div class="world-loader" data-world-loader role="status" aria-live="polite">
      <span data-world-loader-label>Loading the observation chamber</span>
      <progress data-world-load-progress max="1" value="0">0%</progress>
    </div>
  </div>

  <div class="chamber-status sr-only" data-chamber-status role="status" aria-live="polite"></div>

  <article class="chamber-sequence" data-world-narrative>
    <section class="world-act act-control" data-world-act="control" aria-labelledby="act-control-title">
      <div class="world-beat beat-control" data-world-beat="control">
        <div class="beat-copy" data-world-copy>
          <p class="scene-kicker">I / Control</p>
          <h1 id="act-control-title">Change one variable.</h1>
          <p>The anchor, frame, and constraints stay fixed. Only requested {_esc(hero_vector_name.lower())} changes.</p>
        </div>
        <fieldset class="evidence-controls specimen-switch" data-world-control="halation">
          <legend>Requested {_esc(hero_vector_name)} <span>registered derivatives</span></legend>
          <div>{"".join(state_controls)}</div>
          <p>Three discrete states. No interpolation.</p>
        </fieldset>
        <figure class="control-proof" data-control-proof aria-labelledby="control-proof-note">
          {"".join(hero_static)}
          <figcaption id="control-proof-note">{WORLD_EVIDENCE_DISCLOSURE}</figcaption>
        </figure>
        <p class="scroll-cue"><span>Move through the study</span><i aria-hidden="true"></i></p>
      </div>
    </section>

    <section class="world-act act-entanglement" data-world-act="entanglement" aria-labelledby="act-entanglement-title">
      <div class="world-beat beat-response" data-world-beat="response">
        <div class="beat-copy" data-world-copy>
          <p class="scene-kicker">II / Response</p>
          <h2 id="act-entanglement-title">The rest of the image moves.</h2>
          <p>Request {_esc(hero_vector_name.lower())}; {len(nonzero_responses)} measured properties shift across {response["n_pairs"]} locked anchors.</p>
        </div>
        <details class="beat-evidence response-key" data-world-ledger="response">
          <summary>Read the paired response</summary>
          <p class="evidence-heading"><span>Mean high − low</span><b>{response["n_pairs"]} paired anchors</b></p>
          <ol>{"".join(response_rows)}</ol>
          <p class="evidence-note">Agent-visual scores. Missing scores are omitted; zero deltas are not shown.</p>
        </details>
      </div>

      <div class="world-beat beat-comparison" data-world-beat="comparison">
        <div class="beat-copy" data-world-copy>
          <p class="scene-kicker">III / Comparison</p>
          <h2>Halation is not bloom.</h2>
          <p>Halation carries colored edge spill; bloom spreads pale luminance. These are registered, ungraded high-state evidence derivatives from one locked night-path anchor.</p>
        </div>
        <fieldset class="evidence-controls compare-switch" data-world-control="comparison">
          <legend>Recorded high outputs</legend>
          <button type="button" data-chamber-compare="halation" data-world-target="comparison-halation" aria-pressed="true" class="is-active">
            <span>Halation</span>
            <small>{comparison_ids["halation"]} · h {_score_text(halation_halation)} / b {_score_text(halation_bloom)}</small>
          </button>
          <button type="button" data-chamber-compare="bloom" data-world-target="comparison-bloom" aria-pressed="false">
            <span>Highlight bloom</span>
            <small>{comparison_ids["bloom"]} · b {_score_text(bloom_bloom)} / h {_score_text(bloom_halation)}</small>
          </button>
        </fieldset>
        <figure class="comparison-edition" data-documentary-proof data-chamber-comparison-fallback>
          <a href="observations/{comparison_ids["halation"]}.html" class="is-active"
            data-chamber-compare-layer="halation" data-chamber-compare="halation"
            data-observation-id="{comparison_ids["halation"]}">
            {_home_media(
              lib,
              comparison_ids["halation"],
              alt="Night path with a coastal lamp showing high requested halation",
              extra="data-documentary-evidence",
            )}
          </a>
          <a href="observations/{comparison_ids["bloom"]}.html"
            data-chamber-compare-layer="bloom" data-chamber-compare="bloom"
            data-observation-id="{comparison_ids["bloom"]}">
            {_home_media(
              lib,
              comparison_ids["bloom"],
              alt="Night path with a coastal lamp showing high requested highlight bloom",
              extra="data-documentary-evidence",
            )}
          </a>
          <figcaption><span>Halation · {_esc(comparison_ids["halation"])} · h {_score_text(halation_halation)} / b {_score_text(halation_bloom)}</span><span>Highlight bloom · {_esc(comparison_ids["bloom"])} · b {_score_text(bloom_bloom)} / h {_score_text(bloom_halation)}</span></figcaption>
        </figure>
      </div>

      <div class="world-beat beat-association" data-world-beat="association">
        <div class="beat-copy" data-world-copy>
          <p class="scene-kicker">IV / Association</p>
          <h2>Nothing moves alone.</h2>
          <p>Sign sets the lateral bend. |r| sets each vein’s reach.</p>
          <p class="evidence-note">Scored observation-space association—not causality, and not Grok latent space.</p>
        </div>
        <fieldset class="evidence-controls axis-switch" data-world-control="correlation-axis">
          <legend>Correlation axis</legend>
          {"".join(axis_controls)}
        </fieldset>
        <details class="beat-evidence angle-key" data-world-ledger="association">
          <summary>Open the correlation ledger</summary>
          <p class="evidence-heading"><span>θ = arccos(r)</span><b>n={correlation_n}</b></p>
          <table>
            <caption class="sr-only">Strongest recorded relationships to optical softness</caption>
            <thead class="sr-only"><tr><th scope="col">Property</th><th scope="col">Pearson r</th><th scope="col">Angle theta</th></tr></thead>
            <tbody>{"".join(angle_rows)}</tbody>
          </table>
          <a href="matrices.html">Inspect the complete matrices <span aria-hidden="true">↗</span></a>
        </details>
      </div>
    </section>

    <section class="world-act act-residual" data-world-act="residual-atlas" aria-labelledby="act-residual-title">
      <div class="world-beat beat-reconstruction" data-world-beat="reconstruction">
        <div class="beat-copy" data-world-copy>
          <p class="scene-kicker">V / Reconstruction</p>
          <h2 id="act-residual-title">A basis is not the image.</h2>
          <p class="reconstruction-equation" aria-label="Estimated aesthetic equals {_esc(reconstruction_aria)}"><span>â =</span>{reconstruction_equation}</p>
          <p class="evidence-note">Manual first-order hypothesis—not fitted coefficients or hidden model settings.</p>
        </div>
        <figure class="reconstruction-edition" data-documentary-proof data-world-plates="reconstruction">
          {"".join(reconstruction_media)}
        </figure>
        <aside class="residual-caption" data-world-residual>
          <span>a = â + r</span>
          <h3>The residual remains visible.</h3>
          <p>{_esc(residual)} · recorded flags, not a pixel-error map.</p>
        </aside>
      </div>

      <div class="world-beat beat-archive" data-world-beat="archive" data-world-finale id="chamber-archive">
        <div class="beat-copy archive-caption" data-world-copy>
          <p class="scene-kicker">VI / Archive · {chamber["field"]["observation_count"]} nonhuman observations</p>
          <h2 id="archive-contact-title">All {chamber["field"]["observation_count"]} records remain open.</h2>
          <p>This registered atlas contact-sheet preview links to each canonical observation, including its prompt, intended direction, recorded scores, and study.</p>
        </div>
        <a class="archive-primary" data-archive-bypass data-world-portal-link
          href="observations.html"
          aria-label="Explore all {payload["stats"]["observations"]} observations; skip the {chamber["field"]["observation_count"]}-entry contact-sheet preview"><span>Explore all {payload["stats"]["observations"]} observations</span><i aria-hidden="true">↗</i></a>
        <ol class="archive-contact-sheet" data-archive-preview
          data-archive-preview-kind="registered-atlas"
          data-archive-atlas-desktop="{_esc(archive_atlas["desktop_path"])}"
          data-archive-atlas-mobile="{_esc(archive_atlas["mobile_path"])}"
          style="--atlas-size-x:{archive_background_width:.6f}%;--atlas-size-y:{archive_background_height:.6f}%"
          aria-labelledby="archive-contact-title">
          {"".join(archive_contacts)}
        </ol>
      </div>
    </section>
  </article>

  <footer class="chamber-footer" data-world-footer aria-labelledby="chamber-footer-title">
    <div class="chamber-footer-lead">
      <p class="scene-kicker">Visual Basis Atlas</p>
      <h2 id="chamber-footer-title">Evidence, left open.</h2>
      <p>{payload["stats"]["observations"]} controlled observations. Registered evidence derivatives, provisional relationships, and the studies behind them.</p>
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
      <p>Atlas adaptation: transcoded to Opus and AAC-LC; playback level is applied non-destructively at runtime.</p>
      <p>{WORLD_EVIDENCE_DISCLOSURE}</p>
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


def _observation_index(lib: Library) -> str:
    rows = []
    for observation in sorted(lib.observations.values(), key=lambda item: item.id):
        anchor = lib.anchors.get(observation.anchor_id) if observation.anchor_id else None
        vector = lib.vectors.get(observation.intended_vector_id) if observation.intended_vector_id else None
        anchor_name = anchor.name if anchor else observation.anchor_id or "Unregistered anchor"
        direction = vector.canonical_name if vector else observation.intended_vector_id or "Unscoped output"
        level = observation.intended_level or "controlled"
        rows.append(
            f'<a class="ledger-row" href="observations/{observation.id}.html">'
            f'<span class="status-mark observed"></span><strong>{_esc(observation.id)}</strong>'
            f'<span>{_esc(anchor_name)}</span><span>{_esc(direction)} · {_esc(level)}</span><b>↗</b></a>'
        )
    return (
        f"<p class='eyebrow'>Registered-output record / {len(rows)} observations</p>"
        "<h1 class='page'>Observations</h1>"
        "<p class='lede'>Every registered generated output, linked to its anchor, requested direction, "
        "study record, and scored evidence.</p>"
        f"<div class='atlas-ledger'>{''.join(rows)}</div>"
    )


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
