import json
from pathlib import Path

import pytest
from PIL import Image

from vslib.build import default_root
from vslib.site import SITE_ORIGIN, _page, generate_site
from vslib.store import Library


def _inline_chamber_payload(html: str) -> dict:
    marker = '<script type="application/json" id="chamber-data">'
    encoded = html.split(marker, 1)[1].split("</script>", 1)[0]
    return json.loads(encoded)


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
    assert '<link rel="canonical" href="https://atlas.agenc.ag/">' in html
    assert '<meta property="og:image" content="https://atlas.agenc.ag/assets/social-card-v5.jpg">' in html
    assert 'Change one thing. Watch the image answer.' in html
    assert '<link rel="preload" as="image" href="assets/art/optical-observatory-room-wide.webp"' in html
    assert '<link rel="preload" as="image" href="assets/art/optical-observatory-instrument-wide.webp"' in html
    assert '<link rel="preload" as="image" href="assets/art/optical-observatory-room-mobile.webp"' in html
    assert '<link rel="preload" as="image" href="assets/art/optical-observatory-instrument-mobile.webp"' in html
    assert '<link rel="preload" as="font" href="assets/fonts/instrument-sans-latin.woff2"' in html
    assert '<link rel="preload" as="font" href="assets/fonts/instrument-serif-regular-latin.woff2"' in html
    assert '<link rel="preload" as="font" href="assets/fonts/instrument-serif-italic-latin.woff2"' in html
    assert '<link rel="modulepreload" href="assets/chamber.js">' in html
    assert '<link rel="modulepreload" href="assets/vendor/three.module.min.js">' in html
    assert '<link rel="modulepreload" href="assets/chamber-audio.js">' in html
    assert 'document.documentElement.classList.add("has-js")' in html
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


def test_homepage_uses_nonhuman_evidence_and_real_discrete_states():
    html = (default_root() / "site" / "index.html").read_text(encoding="utf-8")

    assert "One direction" in html
    assert "More than one change" in html
    assert "obs_0077" in html
    assert "obs_0078" in html
    assert "obs_0079" in html
    assert 'data-chamber-state="low"' in html
    assert "Three exact outputs. No interpolation." in html
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


def test_explorer_and_presentation_assets_are_generated():
    root = default_root() / "site" / "assets"
    assert (root / "atlas-explorer.json").exists()
    assert (root / "atlas-chamber.json").exists()
    assert (root / "chamber.js").exists()
    assert (root / "chamber-audio.js").exists()
    assert (root / "art" / "optical-observatory-wide.webp").exists()
    assert (root / "art" / "optical-observatory-wide-depth.webp").exists()
    assert (root / "art" / "optical-observatory-mobile.webp").exists()
    assert (root / "art" / "optical-observatory-mobile-depth.webp").exists()
    assert (root / "art" / "optical-observatory-room-wide.webp").exists()
    assert (root / "art" / "optical-observatory-room-mobile.webp").exists()
    assert (root / "art" / "optical-observatory-instrument-wide.webp").exists()
    assert (root / "art" / "optical-observatory-instrument-mobile.webp").exists()
    assert (root / "fonts" / "instrument-sans-latin.woff2").exists()
    assert (root / "fonts" / "instrument-serif-regular-latin.woff2").exists()
    assert (root / "fonts" / "instrument-serif-italic-latin.woff2").exists()
    font_license = root / "fonts" / "Instrument-OFL.txt"
    assert font_license.exists()
    license_text = font_license.read_text(encoding="utf-8")
    assert "Instrument Serif Project Authors" in license_text
    assert "Instrument Sans Project Authors" in license_text
    assert (root / "audio" / "signal-to-noise.opus").exists()
    assert (root / "audio" / "signal-to-noise.m4a").exists()
    assert (root / "audio" / "atlas-room.opus").exists()
    assert (root / "audio" / "atlas-room.m4a").exists()
    assert (root / "audio" / "CREDITS.md").exists()
    assert (root / "social-card-v5.jpg").exists()
    assert (root / "evidence-atlas-2048.webp").exists()
    assert (root / "evidence-atlas-1024.webp").exists()
    for observation_id in (
        "obs_0077", "obs_0078", "obs_0079", "obs_0162", "obs_0177",
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
    assert "Pearson r becomes a literal angle" in html
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
    assert "playback level and interface ducking are applied non-destructively" in html
    assert "Entrance artwork derived from obs_0079; presentation only, not evidence." in html
