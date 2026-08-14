from pathlib import Path

from PIL import Image

from vslib.build import default_root
from vslib.site import SITE_ORIGIN, _page


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
    assert '<meta property="og:image" content="https://atlas.agenc.ag/assets/social-card-v3.jpg">' in html
    assert '<meta name="twitter:card" content="summary_large_image">' in html
    assert '<meta property="og:image:width" content="1200">' in html
    assert '<meta property="og:image:height" content="630">' in html


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
    card = default_root() / "assets" / "social-card-v3.jpg"
    assert card.exists()
    with Image.open(card) as image:
        assert image.size == (1200, 630)
        assert image.format == "JPEG"


def test_homepage_uses_nonhuman_evidence_and_real_discrete_states():
    html = (default_root() / "site" / "index.html").read_text(encoding="utf-8")

    assert "Hold the room" in html
    assert "Move the light" in html
    assert "obs_0157" in html
    assert "obs_0158" in html
    assert "obs_0159" in html
    assert 'type="radio"' in html
    assert "Register 3 outputs" in html
    assert "0 interpolated frames" in html
    assert "Association geometry" in html
    assert "anchor_portrait" not in html
    assert "anchor_character" not in html
    assert "<canvas" not in html
    assert "prompt builder" not in html.lower()


def test_explorer_and_presentation_assets_are_generated():
    root = default_root() / "site" / "assets"
    assert (root / "atlas-explorer.json").exists()
    for observation_id in ("obs_0157", "obs_0158", "obs_0159", "obs_0174"):
        assert (root / "studies" / f"{observation_id}-640.webp").exists()
        assert (root / "studies" / f"{observation_id}-1024.webp").exists()


def test_homepage_distinguishes_total_observations_from_correlation_cohort():
    html = (default_root() / "site" / "index.html").read_text(encoding="utf-8")
    assert "210</dt><dd>registry observations" in html
    assert "100</dt><dd>complete-score cohort" in html
    assert "11</dt><dd>controlled axes" in html
    assert "not Grok latent space" in html


def test_homepage_correlation_table_is_complete_for_default_axis():
    html = (default_root() / "site" / "index.html").read_text(encoding="utf-8")
    table = html.split('<table data-correlation-table>', 1)[1].split("</table>", 1)[0]
    body = table.split("<tbody>", 1)[1].split("</tbody>", 1)[0]
    assert body.count("<tr>") == 11
