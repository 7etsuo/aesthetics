import copy
import json
import re
from hashlib import sha256
from inspect import getsource
from pathlib import Path

import pytest
from PIL import Image

from vslib.build import default_root
from vslib.site import (
    SITE_ORIGIN,
    WORLD_BEATS,
    WORLD_MANIFEST,
    _page,
    _validate_world_manifest,
    generate_site,
)
from vslib.store import Library


def _inline_chamber_payload(html: str) -> dict:
    marker = '<script type="application/json" id="chamber-data">'
    encoded = html.split(marker, 1)[1].split("</script>", 1)[0]
    return json.loads(encoded)


def _write_scene_plate_fixture(root: Path) -> dict:
    variants = {}
    for viewport, size in (("desktop", (12, 8)), ("mobile", (8, 12))):
        variant = {}
        for index, beat in enumerate(WORLD_BEATS):
            plate = {}
            for role, mode in (("color", "RGB"), ("depth", "L")):
                suffix = "-depth" if role == "depth" else ""
                relative = Path(
                    f"assets/world-v5/plates/{viewport}/{beat}{suffix}.webp"
                )
                output = root / relative
                output.parent.mkdir(parents=True, exist_ok=True)
                value = 24 + index * 18
                fill = (value, value + 1, value + 2) if mode == "RGB" else value
                Image.new(mode, size, fill).save(output, "WEBP", lossless=True)
                encoded = output.read_bytes()
                plate[role] = {
                    "path": relative.as_posix(),
                    "sha256": sha256(encoded).hexdigest(),
                    "bytes": len(encoded),
                    "width": size[0],
                    "height": size[1],
                    "mime": "image/webp",
                }
            plate["focalPoint"] = [0.5, 0.5]
            variant[beat] = plate
        variants[viewport] = variant

    manifest = {
        "format": "atlas-world/v2",
        "version": 2,
        "generator": {"name": "test-fixture"},
        "scenePlates": {
            "renderer": "depth-parallax-v1",
            "order": list(WORLD_BEATS),
            "interaction": {
                "firstResponseMs": 48,
                "settleMs": 240,
                "maxParallaxPx": {"desktop": 18, "mobile": 10},
                "maxRelightEv": 0.6,
                "transitionMs": 900,
            },
            "depthEstimator": {
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
            },
            "depthEncoding": {
                "kind": "relative-inverse-depth",
                "bitDepth": 8,
                "channels": 1,
                "near": 255,
                "far": 0,
                "normalization": "per-plate-min-max",
                "resampling": "bicubic-align-corners-false",
                "lossless": True,
            },
            "focalPointConvention": {
                "coordinates": "normalized-[x,y]",
                "origin": "top-left",
                "space": "intrinsic-plate-pixels",
                "use": "authored-cover-alignment",
            },
            "variants": variants,
        },
    }
    manifest_path = root / WORLD_MANIFEST
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
    return manifest


def test_page_shell_has_social_metadata_and_semantics(tmp_path: Path):
    site = tmp_path / "site"
    site.mkdir()

    output = site / "index.html"
    _page(
        output,
        "Atlas",
        "<p>Body</p>",
        nav="home",
        hero=True,
        description="A field guide to visual style.",
    )
    html = output.read_text(encoding="utf-8")

    assert "<head>" in html
    assert '<main id="main"' in html
    assert 'class="skip-link"' in html
    assert '<meta name="color-scheme" content="light">' in html
    assert '<meta name="theme-color" content="#DBE7E6">' in html
    assert '<link rel="canonical" href="https://atlas.agenc.ag/">' in html
    assert '<meta property="og:image" content="https://atlas.agenc.ag/assets/social-card-v5.jpg">' in html
    assert 'illustrative coastal optical depth field' in html
    assert '<link rel="preload" as="image" href="assets/world-v5/plates/desktop/control.webp"' in html
    assert '<link rel="preload" as="image" href="assets/world-v5/plates/mobile/control.webp"' in html
    assert '<link rel="preload" as="fetch" href="assets/world-v5/atlas-world-v2.json"' in html
    assert '<link rel="preload" as="font" href="assets/fonts/instrument-serif-regular-latin.woff2"' in html
    assert '<link rel="preload" as="font" href="assets/fonts/inter-tight-latin.woff2"' in html
    assert '<link rel="preload" as="font" href="assets/fonts/ibm-plex-mono-regular-latin.woff2"' in html
    assert '<link rel="modulepreload" href="assets/chamber.js">' in html
    assert '<link rel="modulepreload" href="assets/chamber-audio.js">' in html
    image_preloads = re.findall(r'<link rel="preload" as="image"[^>]*>', html)
    assert len(image_preloads) == 2
    assert all("crossorigin" not in preload for preload in image_preloads)
    file_branch = 'if(location.protocol==="file:"){document.documentElement.classList.remove("has-js");}'
    http_branch = 'else{document.documentElement.classList.add("has-js","is-entry-open");'
    assert file_branch in html
    assert http_branch in html
    assert html.index(file_branch) < html.index(http_branch) < html.index("window.setTimeout")
    assert 'root.dataset.ready!=="true"' in html
    assert 'root.dataset.bootTimedOut="true"' in html
    assert 'entry.dataset.entryState="dismissed"' in html
    assert 'entry.setAttribute("aria-hidden","true")' in html
    assert 'doc.classList.remove("has-js","is-entry-open")' in html
    assert 'document.body?.classList.remove("is-entry-open")' in html
    assert 'root.querySelectorAll("[data-entry-inert]")' in html
    assert 'node.inert=false' in html
    assert '<meta name="twitter:card" content="summary_large_image">' in html
    assert '<meta property="og:image:width" content="1200">' in html
    assert '<meta property="og:image:height" content="630">' in html


def test_site_build_requires_the_chamber_runtime(tmp_path: Path):
    assets = tmp_path / "assets"
    assets.mkdir()
    for name in ("app.css", "home.css", "app.js"):
        (assets / name).write_text("", encoding="utf-8")

    existing_site = tmp_path / "site"
    existing_site.mkdir()
    sentinel = existing_site / "keep-on-validation-error.txt"
    sentinel.write_text("preserve the last good build", encoding="utf-8")
    library = Library(tmp_path).load()
    with pytest.raises(FileNotFoundError, match="assets/chamber.js"):
        generate_site(library)
    assert sentinel.read_text(encoding="utf-8") == "preserve the last good build"


def test_nested_page_canonical_keeps_html_suffix_and_escapes_metadata(tmp_path: Path):
    site = tmp_path / "site"
    output = site / "vectors" / "vec_example.html"

    _page(
        output,
        "A & B",
        "<p>Body</p>",
        nav="vectors",
        description="Less < more & exact.",
    )
    html = output.read_text(encoding="utf-8")

    assert f'<link rel="canonical" href="{SITE_ORIGIN}/vectors/vec_example.html">' in html
    assert "<title>A &amp; B — Visual Basis Atlas</title>" in html
    assert 'content="Less &lt; more &amp; exact."' in html
    assert 'href="../assets/favicon.svg"' in html
    assert '<span class="mark-context">Grok Imagine / evidence atlas</span>' in html
    assert 'class="site-footer"' in html
    assert 'class="site-footer-ledger"' not in html
    assert 'class="mark-index"' not in html


def test_generated_pages_have_unique_absolute_canonicals():
    pages = sorted((default_root() / "site").rglob("*.html"))
    assert pages

    canonicals = set()
    for page in pages:
        html = page.read_text(encoding="utf-8")
        marker = '<link rel="canonical" href="'
        assert html.count(marker) == 1
        canonical = html.split(marker, 1)[1].split('"', 1)[0]
        assert canonical.startswith("https://atlas.agenc.ag/")
        assert canonical not in canonicals
        canonicals.add(canonical)
        assert html.count('<meta name="description"') == 1
        assert html.count('<meta property="og:image"') == 1
        assert html.count('<meta name="twitter:card"') == 1


def test_social_card_is_share_card_size():
    card = default_root() / "assets" / "social-card-v5.jpg"
    assert card.exists()
    with Image.open(card) as image:
        assert image.size == (1200, 630)
        assert image.format == "JPEG"


def test_bundled_three_has_a_complete_mit_notice():
    vendor = default_root() / "assets" / "vendor"
    three_notice = (vendor / "three.LICENSE.txt").read_text(encoding="utf-8")

    assert "Copyright © 2010-2026 three.js authors" in three_notice
    assert "Permission is hereby granted, free of charge" in three_notice
    assert "THE SOFTWARE IS PROVIDED \"AS IS\"" in three_notice


def test_frontend_toolchain_declares_vites_supported_node_floor():
    root = default_root()
    package = json.loads((root / "package.json").read_text(encoding="utf-8"))
    lock = json.loads((root / "package-lock.json").read_text(encoding="utf-8"))
    readme = (root / "README.md").read_text(encoding="utf-8")

    assert package["packageManager"] == "npm@11.17.0"
    assert package["engines"]["node"] == "^20.19.0 || >=22.12.0"
    assert lock["packages"][""]["engines"] == package["engines"]
    assert "Node.js `^20.19.0 || >=22.12.0` with npm `11.17.0`" in readme


def test_world_manifest_matches_its_versioned_asset_package():
    sources = _validate_world_manifest(default_root())
    assert len(sources) == len(set(sources)) == 24


def test_scene_plate_manifest_fixture_validates_all_twenty_four_records(tmp_path: Path):
    _write_scene_plate_fixture(tmp_path)

    sources = _validate_world_manifest(tmp_path)

    assert sources == tuple(
        Path(f"assets/world-v5/plates/{viewport}/{beat}{suffix}.webp")
        for viewport in ("desktop", "mobile")
        for beat in WORLD_BEATS
        for suffix in ("", "-depth")
    )


def test_scene_plate_manifest_rejects_every_retired_top_level_contract(tmp_path: Path):
    manifest = _write_scene_plate_fixture(tmp_path)
    manifest_path = tmp_path / WORLD_MANIFEST

    for stale_key in (
        "archiveBindings",
        "chapters",
        "control",
        "evidenceBindings",
        "fieldStation",
        "models",
        "requiredNodes",
        "variants",
    ):
        stale = copy.deepcopy(manifest)
        stale[stale_key] = {}
        manifest_path.write_text(json.dumps(stale), encoding="utf-8")
        with pytest.raises(ValueError, match=rf"retired scene fields: {stale_key}"):
            _validate_world_manifest(tmp_path)


def test_scene_plate_manifest_rejects_stale_motion_and_depth_contracts(tmp_path: Path):
    manifest = _write_scene_plate_fixture(tmp_path)
    manifest_path = tmp_path / WORLD_MANIFEST

    stale_order = copy.deepcopy(manifest)
    stale_order["scenePlates"]["order"][0:2] = ["response", "control"]
    manifest_path.write_text(json.dumps(stale_order), encoding="utf-8")
    with pytest.raises(ValueError, match="six semantic beats"):
        _validate_world_manifest(tmp_path)

    stale_interaction = copy.deepcopy(manifest)
    stale_interaction["scenePlates"]["interaction"]["transitionMs"] = 901
    manifest_path.write_text(json.dumps(stale_interaction), encoding="utf-8")
    with pytest.raises(ValueError, match="interaction bounds"):
        _validate_world_manifest(tmp_path)

    stale_depth = copy.deepcopy(manifest)
    stale_depth["scenePlates"]["depthEncoding"]["bits"] = 8
    stale_depth["scenePlates"]["depthEncoding"].pop("bitDepth")
    manifest_path.write_text(json.dumps(stale_depth), encoding="utf-8")
    with pytest.raises(ValueError, match="depthEncoding"):
        _validate_world_manifest(tmp_path)

    stale_focal = copy.deepcopy(manifest)
    stale_focal["scenePlates"]["focalPointConvention"]["origin"] = "bottom-left"
    manifest_path.write_text(json.dumps(stale_focal), encoding="utf-8")
    with pytest.raises(ValueError, match="focalPointConvention"):
        _validate_world_manifest(tmp_path)


def test_scene_plate_manifest_rejects_mismatched_color_depth_records(tmp_path: Path):
    manifest = _write_scene_plate_fixture(tmp_path)
    manifest_path = tmp_path / WORLD_MANIFEST
    depth = manifest["scenePlates"]["variants"]["desktop"]["control"]["depth"]
    depth["width"] += 1
    manifest_path.write_text(json.dumps(manifest), encoding="utf-8")

    with pytest.raises(ValueError, match="dimensions or mime are stale"):
        _validate_world_manifest(tmp_path)


def test_site_source_requirements_are_dynamic_scene_plates_not_retired_assets():
    source = getsource(generate_site)

    assert "scene_plate_sources = _validate_world_manifest(lib.root)" in source
    assert "*(lib.root / source for source in scene_plate_sources)" in source
    for retired in (
        "emulsion-world-desktop.glb",
        "emulsion-world-mobile.glb",
        "poster-desktop.webp",
        "poster-mobile.webp",
        "fallback-",
        "field-station-marine-backplate.webp",
        "social-source.webp",
    ):
        assert retired not in source
    assert 'lib.root / "assets" / "social-card-v5.jpg"' in source


def test_world_manifest_rejects_a_stale_v1_contract_before_asset_checks(tmp_path: Path):
    manifest = tmp_path / WORLD_MANIFEST
    manifest.parent.mkdir(parents=True)
    manifest.write_text(
        json.dumps({"format": "atlas-world/v1", "version": 1}),
        encoding="utf-8",
    )

    with pytest.raises(ValueError, match="atlas-world/v2"):
        _validate_world_manifest(tmp_path)


def test_homepage_uses_nonhuman_evidence_and_real_discrete_states():
    html = (default_root() / "site" / "index.html").read_text(encoding="utf-8")

    assert "Change one variable" in html
    assert "The image answers" in html
    assert "A basis is not the image" in html
    assert "obs_0160" in html
    assert "obs_0161" in html
    assert "obs_0162" in html
    assert 'data-chamber-state="low"' in html
    assert "Three discrete states. No interpolation." in html
    assert "Nothing moves alone" in html
    assert 'data-chamber-canvas' in html
    assert 'data-sound-toggle' in html
    bloom_fallback = html.split('data-chamber-compare-layer="bloom"', 1)[1].split(">", 1)[0]
    assert 'aria-hidden="true"' not in bloom_fallback
    assert html.count('type="button" data-enter disabled aria-disabled="true">') == 1
    assert 'data-world-entry role="status" aria-live="polite" aria-busy="true"' in html
    assert "data-enter-sound" not in html
    assert "data-enter-silent" not in html
    assert '<script type="module" src="assets/chamber.js"></script>' in html
    chamber = _inline_chamber_payload(html)
    field_anchors = {
        observation["anchor_id"]
        for observation in chamber["field"]["observations"]
    }
    assert field_anchors == {
        "anchor_architecture",
        "anchor_object",
        "anchor_landscape",
        "anchor_lamp_architecture",
        "anchor_lamp_object",
        "anchor_lamp_landscape",
    }
    response_anchors = {
        anchor_id
        for study in chamber["analysis"]["responses"]["studies"]
        for anchor_id in study["paired_anchor_ids"]
    }
    assert "anchor_portrait" in response_anchors
    assert "anchor_character" in response_anchors
    assert "<canvas" not in html
    assert "prompt builder" not in html.lower()
    assert 'data-world="coastal-optical-atlas"' in html
    assert html.count('data-world-act="') == 3
    assert html.count('data-world-beat="') == 6
    assert 'class="chamber-hud"' not in html


def test_explorer_and_presentation_assets_are_generated():
    root = default_root() / "site" / "assets"
    assert (root / "atlas-explorer.json").exists()
    assert (root / "atlas-chamber.json").exists()
    assert (root / "chamber.js").exists()
    assert (root / "chamber-audio.js").exists()
    world = root / "world-v5"
    assert (world / "atlas-world-v2.json").exists()
    for viewport in ("desktop", "mobile"):
        for beat in ("control", "response", "comparison", "association", "reconstruction", "archive"):
            assert (world / "plates" / viewport / f"{beat}.webp").exists()
            assert (world / "plates" / viewport / f"{beat}-depth.webp").exists()
    assert (root / "fonts" / "inter-tight-latin.woff2").exists()
    assert (root / "fonts" / "instrument-serif-regular-latin.woff2").exists()
    assert (root / "fonts" / "Instrument-OFL.txt").exists()
    assert (root / "fonts" / "ibm-plex-mono-regular-latin.woff2").exists()
    assert (root / "fonts" / "ibm-plex-mono-medium-latin.woff2").exists()
    assert (root / "audio" / "signal-to-noise.opus").exists()
    assert (root / "audio" / "signal-to-noise.m4a").exists()
    assert (root / "audio" / "CREDITS.md").exists()
    assert not (root / "vendor" / "meshoptimizer.LICENSE.txt").exists()
    assert not (root / "vendor" / "three.module.min.js").exists()
    assert (root / "social-card-v5.jpg").exists()
    assert (root / "evidence-atlas-2048.webp").exists()
    assert (root / "evidence-atlas-1024.webp").exists()
    for observation_id in (
        "obs_0160", "obs_0161", "obs_0162", "obs_0177",
    ):
        assert (root / "studies" / f"{observation_id}-640.webp").exists()
        assert (root / "studies" / f"{observation_id}-1024.webp").exists()


def test_homepage_distinguishes_total_observations_from_correlation_cohort():
    html = (default_root() / "site" / "index.html").read_text(encoding="utf-8")
    assert "210 controlled observations" in html
    assert "11 controlled axes" in html
    assert "<b>n=100</b>" in html
    assert "observation-space association—not causality" in html
    assert "not Grok latent space" in html


def test_homepage_keeps_precise_correlation_semantics_in_the_dom():
    html = (default_root() / "site" / "index.html").read_text(encoding="utf-8")
    assert "Pearson r becomes a literal angle" not in html
    assert "Sign sets the lateral bend. |r| sets each vein’s reach." in html
    assert "Open the correlation ledger" in html
    assert "θ = arccos(r)" in html
    assert "not causality" in html
    assert "Inspect the complete matrices" in html


def test_homepage_credits_music_and_presentation_art_honestly():
    html = (default_root() / "site" / "index.html").read_text(encoding="utf-8")

    assert "'Signal to Noise' by" in html
    assert "Scott Buckley</a> - released under" in html
    assert "CC-BY 4.0" in html
    assert 'href="https://www.scottbuckley.com.au/library/signal-to-noise/"' in html
    assert 'href="https://creativecommons.org/licenses/by/4.0/"' in html
    assert 'href="https://www.scottbuckley.com.au/" rel="external">www.scottbuckley.com.au</a>' in html
    assert "playback level is applied non-destructively" in html
    assert "The cinematic depth field is illustrative, not a model output" in html
