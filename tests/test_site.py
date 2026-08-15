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
    assert '<meta property="og:image" content="https://atlas.agenc.ag/assets/social-card-v4.jpg">' in html
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
    card = default_root() / "assets" / "social-card-v4.jpg"
    assert card.exists()
    with Image.open(card) as image:
        assert image.size == (1200, 630)
        assert image.format == "JPEG"


def test_homepage_uses_nonhuman_evidence_and_real_discrete_states():
    html = (default_root() / "site" / "index.html").read_text(encoding="utf-8")

    assert "One direction" in html
    assert "More than one change" in html
    assert "obs_0160" in html
    assert "obs_0161" in html
    assert "obs_0162" in html
    assert 'data-chamber-state="low"' in html
    assert "Three outputs · zero interpolation" in html
    assert "Nothing moves alone" in html
    assert 'data-chamber-canvas' in html
    assert 'data-sound-toggle' in html
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
    assert (root / "evidence-atlas-2048.webp").exists()
    assert (root / "evidence-atlas-1024.webp").exists()
    for observation_id in ("obs_0160", "obs_0161", "obs_0162", "obs_0177"):
        assert (root / "studies" / f"{observation_id}-640.webp").exists()
        assert (root / "studies" / f"{observation_id}-1024.webp").exists()


def test_homepage_distinguishes_total_observations_from_correlation_cohort():
    html = (default_root() / "site" / "index.html").read_text(encoding="utf-8")
    assert "210 observations" in html
    assert "11 controlled axes" in html
    assert "Scored observation-space · n=100" in html
    assert "not Grok latent space" in html


def test_homepage_keeps_precise_correlation_semantics_in_the_dom():
    html = (default_root() / "site" / "index.html").read_text(encoding="utf-8")
    assert "Pearson correlation becomes literal angle" in html
    assert "θ = arccos(r)" in html
    assert "not causality" in html
    assert "Inspect the complete matrices" in html
