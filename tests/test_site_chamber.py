import copy
import json
import re

import pytest

from vslib.build import default_root
from vslib.site import _home
from vslib.site_chamber import (
    CHAMBER_SCHEMA,
    COMPARISON_OBSERVATION_IDS,
    CONTROLLED_STUDY_IDS,
    FIELD_ANCHOR_IDS,
    build_chamber_payload,
)
from vslib.store import Library


@pytest.fixture(scope="module")
def library() -> Library:
    return Library(default_root()).load()


@pytest.fixture(scope="module")
def payload(library: Library) -> dict:
    return build_chamber_payload(library)


def _observations(payload: dict) -> dict[str, dict]:
    return {row["id"]: row for row in payload["field"]["observations"]}


def _scores(row: dict) -> dict[str, tuple[float, float]]:
    return {vector_id: (value, confidence) for vector_id, value, confidence in row["scores"]}


def test_chamber_contract_is_compact_normalized_and_explicit(payload: dict):
    assert payload["schema"] == CHAMBER_SCHEMA == "visual-basis-atlas/chamber-v1"
    assert payload["model_label"] == "Grok Imagine"
    assert payload["score_method"] == "agent_visual"
    assert payload["observed_at"] == "2026-08-14"
    assert payload["semantics"] == {
        "coordinates": "not_provided",
        "projection_basis": "observed_scores_only",
        "missing_scores": "omitted",
        "status_source": "study.status",
    }
    assert payload["field"]["score_tuple"] == ["vector_id", "value", "confidence"]
    assert "coordinates" not in payload["field"]

    serialized = json.dumps(payload, separators=(",", ":"), allow_nan=False)
    assert len(serialized.encode("utf-8")) < 125_000


def test_contract_is_deterministic_and_home_embeds_the_same_payload(
    library: Library,
    payload: dict,
):
    encoded = json.dumps(payload, separators=(",", ":"), allow_nan=False)
    rebuilt = json.dumps(
        build_chamber_payload(library),
        separators=(",", ":"),
        allow_nan=False,
    )
    assert rebuilt == encoded

    html = _home(library)
    marker = '<script type="application/json" id="chamber-data">'
    embedded = html.split(marker, 1)[1].split("</script>", 1)[0]
    assert json.loads(embedded) == payload


def test_home_v5_has_three_acts_six_beats_and_separates_footer_utility(
    library: Library,
):
    html = _home(library)

    assert 'data-world="coastal-optical-atlas"' in html
    assert 'data-world-version="5"' in html
    assert 'data-world-manifest="assets/world-v5/atlas-world-v2.json"' in html
    assert 'data-world-entry' in html
    assert 'data-world-viewport' in html
    assert '<span data-world-loader-label>Loading the observation chamber</span>' in html
    assert '<span data-enter-label>Preparing the observation chamber…</span>' in html
    assert html.count('type="button" data-enter disabled aria-disabled="true">') == 1
    assert "Entry begins the experience with music" not in html
    assert 'class="entry-sound-note"' not in html
    assert 'data-sound-label data-sound-disable-label="Mute music">Play music</span>' in html
    assert "data-enter-silent" not in html
    assert html.count("data-world-act=") == 3
    assert [
        html.index(f'data-world-act="{name}"')
        for name in ("control", "entanglement", "residual-atlas")
    ] == sorted(
        html.index(f'data-world-act="{name}"')
        for name in ("control", "entanglement", "residual-atlas")
    )
    beats = ("control", "response", "comparison", "association", "reconstruction", "archive")
    assert [
        html.index(f'data-world-beat="{beat}"') for beat in beats
    ] == sorted(html.index(f'data-world-beat="{beat}"') for beat in beats)
    assert html.count('data-world-fallback-frame="') == 6
    assert '--plate-x:69.000%;--plate-y:43.000%;--plate-mobile-x:67.000%;--plate-mobile-y:35.000%' in html
    assert '--plate-x:83.000%;--plate-y:46.000%;--plate-mobile-x:67.000%;--plate-mobile-y:36.000%' in html
    for beat in beats:
        assert f'assets/world-v5/plates/desktop/{beat}.webp' in html
        assert f'assets/world-v5/plates/mobile/{beat}.webp' in html
    fallback_start = html.index('class="world-fallback"')
    fallback_end = html.index('class="world-loader"', fallback_start)
    fallback = html[fallback_start:fallback_end]
    assert fallback.count('alt=""') == 6
    assert "-depth.webp" not in fallback
    assert "data-exact-evidence" not in fallback
    assert "data-documentary-evidence" not in fallback
    assert "data-observation-id" not in fallback
    assert all(
        "crossorigin" not in image
        for image in re.findall(r"<img\b[^>]*>", html)
    )

    assert "<noscript" not in html
    assert "origin-static-edition" not in html
    assert html.count('class="control-proof" data-control-proof') == 1
    proof_start = html.index('class="control-proof" data-control-proof')
    proof_end = html.index("</figure>", proof_start)
    proof = html[proof_start:proof_end]
    proof_mapping = {
        "low": "obs_0160",
        "medium": "obs_0161",
        "high": "obs_0162",
    }
    for level, observation_id in proof_mapping.items():
        assert f'id="control-proof-{level}"' in proof
        assert f'href="observations/{observation_id}.html"' in proof
        assert f'data-control-proof-state="{level}"' in proof
        assert f'data-observation-id="{observation_id}"' in proof
        assert f'alt="night path with street lamp, {level} requested halation"' in proof
        assert f'Registered derivative · ungraded · {observation_id}' in proof
        control = re.search(
            rf'<button type="button" data-chamber-state="{level}"[^>]*>',
            html,
        )
        assert control
        assert f'data-world-target="halation-{level}"' in control.group(0)
        assert f'data-observation-id="{observation_id}"' in control.group(0)
        assert f'aria-controls="control-proof-{level}"' in control.group(0)
    assert proof.count("data-documentary-evidence") == 3
    assert "data-exact-evidence" not in proof
    assert proof.count('aria-current="true"') == 1
    assert (
        'data-observation-id="obs_0161" aria-current="true"'
        in proof
    )
    assert (
        'data-chamber-state="medium" data-world-target="halation-medium" '
        'data-observation-id="obs_0161" aria-controls="control-proof-medium" '
        'aria-pressed="true" class="is-active"'
        in html
    )
    assert (
        'data-chamber-state="low" data-world-target="halation-low" '
        'data-observation-id="obs_0160" aria-controls="control-proof-low" '
        'aria-pressed="false" class=""'
        in html
    )
    assert (
        'data-chamber-state="medium" data-selected-observation="obs_0161"'
        in html
    )
    truth = (
        "Control, Comparison, and Reconstruction use registered, ungraded evidence "
        "derivatives. Archive is a registered atlas contact-sheet preview linking to "
        "canonical observations. The cinematic depth field is illustrative, not a model "
        "output."
    )
    assert html.count(truth) == 2

    finale_start = html.index('data-world-finale')
    finale_end = html.index('</section>', finale_start)
    finale = html[finale_start:finale_end]
    assert "All 126 records remain open." in finale
    assert "registered atlas contact-sheet preview" in finale
    assert "canonical observation" in finale
    assert "Explore all 210 observations" in finale
    assert 'data-archive-bypass' in finale
    assert 'data-world-portal-link' in finale
    assert 'href="observations.html"' in finale
    assert finale.index('data-archive-bypass') < finale.index('data-archive-preview')
    assert 'id="atlas-search"' not in finale
    assert 'class="archive-secondary"' not in finale
    assert 'class="chamber-credits"' not in finale

    footer_start = html.index('data-world-footer')
    footer = html[footer_start:]
    assert footer_start > finale_end
    assert 'id="atlas-search"' in footer
    assert 'class="archive-secondary"' in footer
    assert 'class="chamber-credits"' in footer
    assert 'class="chamber-colophon"' in footer
    assert 'data-world-plates="reconstruction"' in html
    assert 'data-world-control="correlation-axis"' in html
    assert 'class="chamber-hud"' not in html


def test_home_shell_uses_truthful_six_part_copy_and_keeps_theta_in_the_ledger(
    library: Library,
):
    html = _home(library)
    kickers = (
        "I / Control",
        "II / Response",
        "III / Comparison",
        "IV / Association",
        "V / Reconstruction",
        "VI / Archive · 126 nonhuman observations",
    )
    assert [html.index(f'>{kicker}</p>') for kicker in kickers] == sorted(
        html.index(f'>{kicker}</p>') for kicker in kickers
    )

    assert "One requested variable changes. Across locked anchors, the rest of the image answers." in html
    assert "The rest of the image moves." in html
    assert "Sign sets the lateral bend. |r| sets each vein’s reach." in html
    assert "Pearson r becomes a literal angle" not in html

    association_start = html.index('class="world-beat beat-association"')
    association_end = html.index('</div>\n    </section>', association_start)
    association = html[association_start:association_end]
    association_copy_end = association.index('</div>')
    assert "θ = arccos(r)" not in association[:association_copy_end]
    assert "Open the correlation ledger" in association[association_copy_end:]
    assert "θ = arccos(r)" in association[association_copy_end:]
    assert "not causality" in association


def test_archive_contact_sheet_maps_the_126_nonhuman_entries_once(
    library: Library,
    payload: dict,
):
    html = _home(library)
    start = html.index('class="archive-contact-sheet" data-archive-preview')
    end = html.index("</ol>", start)
    contact_sheet = html[start:end]

    assert 'data-archive-preview-kind="registered-atlas"' in contact_sheet
    assert 'data-archive-atlas-desktop="assets/evidence-atlas-2048.webp"' in contact_sheet
    assert 'data-archive-atlas-mobile="assets/evidence-atlas-1024.webp"' in contact_sheet
    assert '--atlas-size-x:1312.820513%;--atlas-size-y:1312.820513%' in contact_sheet
    links = re.findall(
        r'<a href="observations/(obs_\d{4})\.html" data-archive-preview-entry '
        r'data-archive-index="(\d+)" data-observation-id="(obs_\d{4})">',
        contact_sheet,
    )
    expected_ids = [item["id"] for item in payload["field"]["observations"]]
    assert len(links) == payload["field"]["observation_count"] == 126
    assert [observation_id for observation_id, _, _ in links] == expected_ids
    assert [linked_id for _, _, linked_id in links] == expected_ids
    assert [int(index) for _, index, _ in links] == list(range(126))
    assert len(set(expected_ids)) == 126
    assert contact_sheet.count('class="archive-contact-crop"') == 126
    assert contact_sheet.count("data-archive-preview-crop") == 126
    assert "data-exact-evidence" not in contact_sheet
    assert "data-documentary-evidence" not in contact_sheet
    assert "data-archive-exact" not in contact_sheet
    assert "data-archive-contact" not in contact_sheet
    assert contact_sheet.count('class="archive-contact-id"') == 126
    assert contact_sheet.count('class="sr-only"') == 126
    assert "<img" not in contact_sheet
    assert "artifacts/" not in contact_sheet
    crop_fixtures = {
        ("obs_0001", 0): "--atlas-x:3.488372%;--atlas-y:7.716702%",
        ("obs_0107", 63): "--atlas-x:28.858351%;--atlas-y:50.000000%",
        ("obs_0209", 125): "--atlas-x:45.771670%;--atlas-y:92.283298%",
    }
    for (observation_id, index), expected_style in crop_fixtures.items():
        entry = re.search(
            rf'href="observations/{observation_id}\.html" '
            rf'data-archive-preview-entry data-archive-index="{index}" '
            rf'data-observation-id="{observation_id}">.*?'
            rf'data-archive-preview-crop style="([^"]+)"',
            contact_sheet,
            re.S,
        )
        assert entry and entry.group(1) == expected_style
    assert not {
        "anchor_portrait",
        "anchor_character",
    } & set(payload["field"]["anchor_ids"])


def test_home_shell_preserves_entry_lock_fallback_media_and_twelve_pixel_type_floor():
    css = (default_root() / "assets" / "home.css").read_text(encoding="utf-8")

    assert "html.is-entry-open" in css
    assert "body.is-entry-open" in css
    assert "[data-entry-inert][inert]" in css
    dismissed_entry = re.search(
        r'\.chamber-entry\[data-entry-state="dismissed"\]\[aria-hidden="true"\]'
        r"\s*\{([^}]*)\}",
        css,
        re.S,
    )
    assert dismissed_entry and "display: none" in dismissed_entry.group(1)
    assert "rgba(228, 236, 236" not in css
    assert "rgba(5, 10, 13, 0.97)" in css
    assert (
        '.observation-chamber:is(.is-chamber-webgl, .is-chamber-fallback, '
        '[data-failed="true"]) .evidence-controls'
    ) in css
    assert "--world-fog: #DBE7E6" in css
    assert "--world-mineral: #AEB6BA" in css
    assert "--world-horizon: #C8CECA" in css
    assert "--world-graphite: #152226" in css
    assert "--world-slate: #44595D" in css
    assert "--world-warm: #B86148" in css
    enhanced_palette = re.search(
        r'\.observation-chamber:is\(\.is-chamber-webgl, \.is-chamber-fallback, '
        r'\[data-failed="true"\]\)\s*\{([^}]*)\}',
        css,
        re.S,
    )
    assert enhanced_palette
    assert "background: var(--world-fog)" in enhanced_palette.group(1)
    assert "color: var(--world-graphite)" in enhanced_palette.group(1)
    assert "#080e11" not in enhanced_palette.group(1)

    declarations = re.findall(r"font-size:\s*([^;{}]+);", css)
    assert declarations
    for declaration in declarations:
        rem_values = [float(value) for value in re.findall(r"([0-9.]+)rem", declaration)]
        pixel_values = [float(value) for value in re.findall(r"([0-9.]+)px", declaration)]
        assert all(value >= 0.75 for value in rem_values), declaration
        assert all(value >= 12 for value in pixel_values), declaration


def test_direct_file_and_no_js_hide_only_inert_button_groups(library: Library):
    html = _home(library)
    css = (default_root() / "assets" / "home.css").read_text(encoding="utf-8")

    root_tag = html.split(">", 1)[0]
    assert "data-ready" not in root_tag
    assert html.count('class="evidence-controls ') == 3
    hidden_controls = re.search(
        r"\.observation-chamber:not\(\[data-ready\]\)\s+\.evidence-controls\s*"
        r"\{([^}]*)\}",
        css,
        re.S,
    )
    assert hidden_controls and "display: none" in hidden_controls.group(1)

    assert html.count('data-control-proof-state="') == 3
    assert html.count("data-documentary-proof") == 2
    assert html.count("data-archive-preview-entry") == 126
    control_start = html.index('class="control-proof"')
    control_end = html.index("</figure>", control_start)
    control_proof = html[control_start:control_end]
    assert "obs_0160 · halation .08" in control_proof
    assert "obs_0161 · halation .40" in control_proof
    assert "obs_0162 · halation .84" in control_proof
    comparison_start = html.index('class="comparison-edition"')
    comparison_end = html.index("</figure>", comparison_start)
    comparison_proof = html[comparison_start:comparison_end]
    assert "obs_0162 · h .84 / b .36" in comparison_proof
    assert "obs_0177 · b .84 / h .22" in comparison_proof
    for evidence_selector in (
        ".control-proof",
        ".comparison-edition",
        ".reconstruction-edition",
        ".archive-contact-sheet",
    ):
        assert evidence_selector not in hidden_controls.group(0)


def test_focus_ring_has_three_to_one_contrast_across_field_surfaces():
    css = (default_root() / "assets" / "home.css").read_text(encoding="utf-8")

    def contrast_ratio(left: str, right: str) -> float:
        def luminance(value: str) -> float:
            channels = [int(value[index:index + 2], 16) / 255 for index in (1, 3, 5)]
            linear = [
                channel / 12.92
                if channel <= 0.04045
                else ((channel + 0.055) / 1.055) ** 2.4
                for channel in channels
            ]
            return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]

        bright, dark = sorted((luminance(left), luminance(right)), reverse=True)
        return (bright + 0.05) / (dark + 0.05)

    graphite = "#152226"
    for surface in ("#DBE7E6", "#AEB6BA", "#C8CECA"):
        assert contrast_ratio(graphite, surface) >= 3

    focus = re.search(r"\.is-home :focus-visible\s*\{([^}]*)\}", css, re.S)
    assert focus
    assert "outline: 3px solid var(--world-focus-inner)" in focus.group(1)
    assert "box-shadow: 0 0 0 6px var(--world-focus-outer)" in focus.group(1)
    assert "--world-focus-inner: var(--world-graphite)" in css
    assert "--world-focus-outer: var(--world-white)" in css
    assert re.search(
        r"\.chamber-footer\s*\{[^}]*background:\s*var\(--world-horizon\)",
        css,
        re.S,
    )
    bypass_focus = re.search(
        r"\.archive-primary:focus-visible\s*\{([^}]*)\}", css, re.S
    )
    assert bypass_focus
    assert "outline: 3px solid var(--world-focus-inner)" in bypass_focus.group(1)
    assert "box-shadow: 0 0 0 7px var(--world-focus-outer)" in bypass_focus.group(1)


def test_live_viewport_uses_control_color_plates_below_fallbacks_and_renderer():
    root = default_root()
    css = (root / "assets" / "home.css").read_text(encoding="utf-8")
    for viewport in ("desktop", "mobile"):
        assert (root / f"assets/world-v5/plates/{viewport}/control.webp").is_file()

    viewport = re.search(r"\.chamber-viewport\s*\{([^}]*)\}", css, re.S)
    assert viewport
    declarations = viewport.group(1)
    assert 'background-image: url("world-v5/plates/desktop/control.webp")' in declarations
    assert "background-position: 69% 43%" in declarations
    assert "background-repeat: no-repeat" in declarations
    assert "background-size: cover" in declarations
    assert "filter: none" in declarations
    mobile = css.split("@media (max-width: 767px)", 1)[1]
    assert re.search(
        r"\.chamber-viewport\s*\{[^}]*"
        r'background-image:\s*url\("world-v5/plates/mobile/control\.webp"\)[^}]*'
        r"background-position:\s*67% 35%",
        mobile,
        re.S,
    )
    assert "object-position: var(--plate-x, 50%) var(--plate-y, 50%)" in css
    assert "object-position: var(--plate-mobile-x, 50%) var(--plate-mobile-y, 50%)" in mobile
    assert "field-station-marine-backplate.webp" not in css

    fallback = re.search(r"\.world-fallback\s*\{([^}]*)\}", css, re.S)
    canvas = re.search(r"\.chamber-viewport canvas\s*\{([^}]*)\}", css, re.S)
    assert fallback and "z-index: 0" in fallback.group(1)
    assert canvas and "z-index: 2" in canvas.group(1)


def test_control_registered_derivatives_are_ungraded_small_and_state_driven():
    css = (default_root() / "assets" / "home.css").read_text(encoding="utf-8")

    exact_image = re.search(
        r"\.control-proof img\[data-documentary-evidence\]\s*\{([^}]*)\}",
        css,
        re.S,
    )
    assert exact_image
    declarations = exact_image.group(1)
    required = {
        "object-fit": "contain",
        "filter": "none",
        "mix-blend-mode": "normal",
        "opacity": "1",
        "transform": "none",
        "clip-path": "none",
        "mask": "none",
        "-webkit-mask": "none",
        "perspective": "none",
        "backdrop-filter": "none",
        "-webkit-backdrop-filter": "none",
        "border-radius": "0",
        "box-shadow": "none",
    }
    for property_name, value in required.items():
        assert re.search(
            rf"(?:^|\s){re.escape(property_name)}:\s*{re.escape(value)}\s*;",
            declarations,
        ), property_name

    base_links = re.search(
        r"\.control-proof > a,\s*"
        r'\.observation-chamber:is\(\.is-chamber-fallback, \[data-failed="true"\]\) '
        r"\.control-proof > a\s*\{([^}]*)\}",
        css,
        re.S,
    )
    assert base_links and "display: grid" in base_links.group(1)

    hidden = re.search(
        r"\.observation-chamber\.is-chamber-webgl \.control-proof > a\s*"
        r"\{([^}]*)\}",
        css,
        re.S,
    )
    current = re.search(
        r'\.observation-chamber\.is-chamber-webgl \.control-proof > a'
        r'\[aria-current="true"\]\s*\{([^}]*)\}',
        css,
        re.S,
    )
    assert hidden and "display: none" in hidden.group(1)
    assert current and "display: grid" in current.group(1)
    assert "transition" not in hidden.group(1) + current.group(1)
    fallback_links = list(re.finditer(
        r'\.observation-chamber:is\(\.is-chamber-fallback, \[data-failed="true"\]\) '
        r"\.control-proof > a\s*\{([^}]*)\}",
        css,
        re.S,
    ))
    assert fallback_links
    assert "display: grid" in fallback_links[-1].group(1)
    assert fallback_links[-1].start() > hidden.start()

    desktop = re.search(
        r"\.observation-chamber\.is-chamber-webgl \.control-proof\s*"
        r"\{([^}]*)\}",
        css,
        re.S,
    )
    assert desktop
    assert "width: clamp(180px, 18vw, 260px)" in desktop.group(1)
    assert "max-width: 25.49vmin" in desktop.group(1)
    assert 25.49**2 / 100**2 <= 0.065

    mobile = css.split("@media (max-width: 767px)", 1)[1]
    mobile_proof = re.search(
        r"\.observation-chamber\.is-chamber-webgl \.control-proof\s*"
        r"\{([^}]*)\}",
        mobile,
        re.S,
    )
    assert mobile_proof
    assert "width: clamp(132px, 36vw, 168px)" in mobile_proof.group(1)
    assert "align-self: flex-start" in mobile_proof.group(1)
    assert re.search(r"\.evidence-controls button\s*\{[^}]*min-height:\s*48px", mobile, re.S)

    focus = re.search(r"\.control-proof > a:focus-visible\s*\{([^}]*)\}", css, re.S)
    assert focus
    assert "outline: 3px solid var(--world-focus-inner)" in focus.group(1)
    assert "box-shadow: 0 0 0 8px var(--world-focus-outer)" in focus.group(1)


def test_archive_contact_sheet_stays_registered_ungraded_visible_and_touch_safe():
    css = (default_root() / "assets" / "home.css").read_text(encoding="utf-8")

    sheet = re.search(r"\.archive-contact-sheet\s*\{([^}]*)\}", css, re.S)
    assert sheet
    assert "grid-column: 6 / -1" in sheet.group(1)
    assert "display: grid" in sheet.group(1)
    assert "background: transparent" in sheet.group(1)
    assert "border: 0" in sheet.group(1)
    assert "box-shadow" not in sheet.group(1)
    assert "backdrop-filter" not in sheet.group(1)
    assert "border-radius" not in sheet.group(1)

    link = re.search(r"\.archive-contact-sheet a\s*\{([^}]*)\}", css, re.S)
    assert link
    assert "min-width: 44px" in link.group(1)
    assert "min-height: 44px" in link.group(1)
    assert "background: transparent" in link.group(1)

    crop = re.search(
        r"\.archive-contact-crop\[data-archive-preview-crop\]\s*\{([^}]*)\}",
        css,
        re.S,
    )
    assert crop
    declarations = crop.group(1)
    assert 'background-image: url("evidence-atlas-2048.webp")' in declarations
    assert "background-size: var(--atlas-size-x) var(--atlas-size-y)" in declarations
    for property_name, value in {
        "filter": "none",
        "mix-blend-mode": "normal",
        "opacity": "1",
        "transform": "none",
        "clip-path": "none",
        "mask": "none",
        "-webkit-mask": "none",
        "perspective": "none",
        "backdrop-filter": "none",
        "-webkit-backdrop-filter": "none",
        "border-radius": "0",
        "box-shadow": "none",
    }.items():
        assert re.search(
            rf"(?:^|\s){re.escape(property_name)}:\s*{re.escape(value)}\s*;",
            declarations,
        ), property_name

    enhanced = re.search(
        r"\.observation-chamber\.is-chamber-webgl \.archive-contact-sheet\s*"
        r"\{([^}]*)\}",
        css,
        re.S,
    )
    assert enhanced
    assert "display: grid" in enhanced.group(1)
    assert "visibility: visible" in enhanced.group(1)
    assert "opacity: 1" in enhanced.group(1)
    assert "clip" not in enhanced.group(1)

    hover = re.search(
        r"@media \(hover: hover\) and \(pointer: fine\)\s*\{\s*"
        r"\.archive-contact-sheet a:hover,\s*"
        r"\[data-documentary-proof\]\s*>\s*a:hover\s*\{([^}]*)\}",
        css,
        re.S,
    )
    assert hover and "transform: translateY(-2px)" in hover.group(1)
    mobile = css.split("@media (max-width: 767px)", 1)[1]
    assert 'background-image: url("evidence-atlas-1024.webp")' in mobile


def test_coastal_atlas_type_system_separates_headlines_prose_and_ids():
    css = (default_root() / "assets" / "home.css").read_text(encoding="utf-8")

    assert '@font-face' in css
    assert 'font-family: "Instrument Serif"' in css
    assert 'url("fonts/instrument-serif-regular-latin.woff2")' in css
    home = re.search(r"\.is-home\s*\{([^}]*)\}", css, re.S)
    assert home and 'font-family: "Inter Tight"' in home.group(1)
    for selector in (
        ".entry-copy h2",
        ".beat-copy h1,\n.beat-copy h2",
        ".residual-caption h3",
        ".chamber-footer-lead h2",
    ):
        block = re.search(rf"{re.escape(selector)}\s*\{{([^}}]*)\}}", css, re.S)
        assert block, selector
        assert 'font-family: "Instrument Serif", Georgia, serif' in block.group(1)
    archive_id = re.search(r"\.archive-contact-id\s*\{([^}]*)\}", css, re.S)
    assert archive_id
    assert 'font-family: "IBM Plex Mono"' in archive_id.group(1)
    assert "font-size: 0.75rem" in archive_id.group(1)


def test_cinematic_shell_reserves_the_world_and_stages_each_scroll_beat():
    css = (default_root() / "assets" / "home.css").read_text(encoding="utf-8")

    assert ".beat-copy::before" not in css
    assert ".entry-sound-note" not in css

    establishment = re.search(
        r"\.observation-chamber\[data-ready\]\s+\.chamber-sequence::before\s*"
        r"\{([^}]*)\}",
        css,
        re.S,
    )
    assert establishment
    assert "height: 50svh" in establishment.group(1)
    assert 'content: ""' in establishment.group(1)

    desktop = css.split("@media (max-width: 767px)", 1)[0]
    desktop_heights = {
        "control": 120,
        "response": 125,
        "comparison": 135,
        "association": 140,
        "reconstruction": 145,
        "archive": 130,
    }
    for beat, height in desktop_heights.items():
        assert (
            f".observation-chamber[data-ready] .beat-{beat} "
            f"{{ min-height: {height}svh; }}"
        ) in desktop

    desktop_staging = re.search(
        r"@media \(min-width: 768px\)\s*\{\s*"
        r"\.observation-chamber\[data-ready\]\s+:is\((.*?)\)\s*\{([^}]*)\}",
        css,
        re.S,
    )
    assert desktop_staging
    for selector in (
        ".evidence-controls",
        ".beat-evidence",
        ".residual-caption",
        ".archive-primary",
    ):
        assert selector in desktop_staging.group(1)
    assert "grid-column: 1 / 5" in desktop_staging.group(2)

    headings = re.search(
        r"\.beat-copy h1,\s*\.beat-copy h2\s*\{([^}]*)\}",
        css,
        re.S,
    )
    assert headings
    assert "max-width: 9ch" in headings.group(1)
    assert "font-size: clamp(3.25rem, 5.6vw, 6.4rem)" in headings.group(1)
    assert 'font-family: "Instrument Serif", Georgia, serif' in headings.group(1)
    assert "font-weight: 400" in headings.group(1)
    assert "line-height: 0.9" in headings.group(1)
    assert "letter-spacing: -0.045em" in headings.group(1)

    mobile = css.split("@media (max-width: 767px)", 1)[1]
    mobile_heights = {
        "control": 135,
        "response": 145,
        "comparison": 150,
        "association": 165,
        "reconstruction": 165,
        "archive": 145,
    }
    for beat, height in mobile_heights.items():
        assert (
            f".observation-chamber[data-ready] .beat-{beat} "
            f"{{ min-height: {height}svh; }}"
        ) in mobile
    mobile_beat = re.search(r"\.world-beat\s*\{([^}]*)\}", mobile, re.S)
    assert mobile_beat
    assert "justify-content: space-between" in mobile_beat.group(1)
    assert "gap: clamp(3.5rem, 12svh, 7rem)" in mobile_beat.group(1)
    assert "margin-top: auto" in mobile
    assert "font-size: clamp(3rem, 14vw, 4.2rem)" in mobile

    cue = re.search(
        r'\.observation-chamber\[data-ready\]\[data-world-active-beat="control"\]'
        r"\s+\.scroll-cue\s*\{([^}]*)\}",
        css,
        re.S,
    )
    assert cue
    assert "opacity: 1" in cue.group(1)
    assert "visibility: visible" in cue.group(1)


def test_cinematic_title_plane_does_not_block_world_pointer_interactions():
    css = (default_root() / "assets" / "home.css").read_text(encoding="utf-8")

    narrative_rules = re.findall(r"\.chamber-sequence\s*\{([^}]*)\}", css, re.S)
    assert narrative_rules
    assert any("pointer-events: none" in rule for rule in narrative_rules)

    semantic_targets = re.search(
        r"\.world-beat\s+:is\(\s*a,\s*button,\s*input,\s*select,\s*textarea,"
        r"\s*summary,\s*label,\s*\[role=\"button\"\],"
        r"\s*\[contenteditable=\"true\"\]\s*\)\s*\{([^}]*)\}",
        css,
        re.S,
    )
    assert semantic_targets
    assert "pointer-events: auto" in semantic_targets.group(1)


def test_webgl_comparison_and_reconstruction_are_visible_registered_derivatives(
    library: Library,
):
    html = _home(library)
    css = (default_root() / "assets" / "home.css").read_text(encoding="utf-8")

    comparison_start = html.index('class="comparison-edition"')
    comparison_end = html.index("</figure>", comparison_start)
    comparison = html[comparison_start:comparison_end]
    assert "data-documentary-proof" in comparison
    assert 'href="observations/obs_0162.html"' in comparison
    assert 'href="observations/obs_0177.html"' in comparison
    assert 'data-observation-id="obs_0162"' in comparison
    assert 'data-observation-id="obs_0177"' in comparison
    assert comparison.count("data-documentary-evidence") == 2
    assert "data-exact-evidence" not in comparison
    assert 'alt="Night path with a coastal lamp showing high requested halation"' in comparison
    assert 'alt="Night path with a coastal lamp showing high requested highlight bloom"' in comparison

    reconstruction_start = html.index('class="reconstruction-edition"')
    reconstruction_end = html.index("</figure>", reconstruction_start)
    reconstruction = html[reconstruction_start:reconstruction_end]
    assert "data-documentary-proof" in reconstruction
    assert 'href="observations/obs_0052.html"' in reconstruction
    assert 'href="observations/obs_0055.html"' in reconstruction
    assert 'data-observation-id="obs_0052"' in reconstruction
    assert 'data-observation-id="obs_0055"' in reconstruction
    assert reconstruction.count("data-documentary-evidence") == 2
    assert "data-exact-evidence" not in reconstruction
    assert (
        "highlight bloom 5/5 · halation 1/5 · optical softness 1/5 · shadow density 1/5"
        in html
    )
    assert "registered, ungraded high-state evidence derivatives" in html

    editions = re.search(
        r"\.comparison-edition,\s*\.reconstruction-edition\s*\{([^}]*)\}",
        css,
        re.S,
    )
    assert editions
    assert "grid-column: 6 / -1" in editions.group(1)
    assert "display: grid" in editions.group(1)
    assert "border: 0" in editions.group(1)
    assert "background: transparent" in editions.group(1)
    assert "box-shadow" not in editions.group(1)
    assert "backdrop-filter" not in editions.group(1)
    assert "border-radius" not in editions.group(1)

    exact_images = re.search(
        r"\[data-documentary-proof\]\s+img\[data-documentary-evidence\]\s*\{([^}]*)\}",
        css,
        re.S,
    )
    assert exact_images
    declarations = exact_images.group(1)
    for property_name, value in {
        "object-fit": "contain",
        "filter": "none",
        "mix-blend-mode": "normal",
        "opacity": "1",
        "transform": "none",
        "clip-path": "none",
        "mask": "none",
        "-webkit-mask": "none",
        "perspective": "none",
        "backdrop-filter": "none",
        "-webkit-backdrop-filter": "none",
        "border-radius": "0",
        "box-shadow": "none",
        "background": "transparent",
    }.items():
        assert re.search(
            rf"(?:^|;)\s*{re.escape(property_name)}\s*:\s*{re.escape(value)}\s*;",
            declarations,
        ), property_name
    assert "object-fit: cover" not in declarations

    visible = re.search(
        r"\.observation-chamber\.is-chamber-webgl\s+\.comparison-edition,\s*"
        r"\.observation-chamber\.is-chamber-webgl\s+\.reconstruction-edition\s*"
        r"\{([^}]*)\}",
        css,
        re.S,
    )
    assert visible
    assert "display: grid" in visible.group(1)
    assert "visibility: visible" in visible.group(1)
    assert "opacity: 1" in visible.group(1)
    assert "position: absolute" not in visible.group(1)
    assert "clip:" not in visible.group(1)
    assert "width: 1px" not in visible.group(1)

    links = re.search(
        r"\.comparison-edition\s*>\s*a,\s*"
        r"\.reconstruction-edition\s*>\s*a\s*\{([^}]*)\}",
        css,
        re.S,
    )
    assert links
    assert "min-width: 44px" in links.group(1)
    assert "min-height: 44px" in links.group(1)
    assert "background: transparent" in links.group(1)

    assert not re.search(
        r":is\(\s*\.comparison-edition,\s*\.reconstruction-edition\s*"
        r"\):focus-within",
        css,
        re.S,
    )
    assert re.search(
        r"\.comparison-edition\s*>\s*a:focus-visible,\s*"
        r"\.reconstruction-edition\s*>\s*a:focus-visible\s*\{[^}]*"
        r"outline:\s*3px solid var\(--world-focus-inner\)",
        css,
        re.S,
    )
    assert re.search(
        r"\[data-documentary-proof\]\s*>\s*a:hover\s*\{[^}]*"
        r"transform:\s*translateY\(-2px\)",
        css,
        re.S,
    )

    fallback_evidence = re.search(
        r'\.observation-chamber:is\(\.is-chamber-fallback, \[data-failed="true"\]\)\s+'
        r":is\(\s*\.control-proof,\s*\.comparison-edition,\s*"
        r"\.reconstruction-edition\s*\)\s*\{([^}]*)\}",
        css,
        re.S,
    )
    assert fallback_evidence
    assert "--world-slate: #44595D" in fallback_evidence.group(1)
    assert "color: var(--world-graphite)" in fallback_evidence.group(1)


def test_shared_shell_keeps_interactive_filter_and_chip_targets_at_least_44px():
    css = (default_root() / "assets" / "app.css").read_text(encoding="utf-8")

    filters = re.search(
        r"\.archive-filters button,\s*\.search-filters button\s*\{([^}]*)\}",
        css,
        re.S,
    )
    assert filters and "min-height: 44px" in filters.group(1)
    assert re.search(r"a\.chip\s*\{[^}]*min-height:\s*44px", css, re.S)
    assert re.search(r"\.chip\s*>\s*a\s*\{[^}]*min-height:\s*44px", css, re.S)


def test_fixed_hero_resolves_to_exact_canonical_scores(payload: dict):
    hero = payload["hero"]
    assert hero == {
        "study_id": "study_halation_002",
        "vector_id": "vec_halation",
        "anchor_id": "anchor_lamp_landscape",
        "levels": [
            {"requested_level": "low", "observation_id": "obs_0160"},
            {"requested_level": "medium", "observation_id": "obs_0161"},
            {"requested_level": "high", "observation_id": "obs_0162"},
        ],
    }

    observations = _observations(payload)
    assert [
        _scores(observations[level["observation_id"]])["vec_halation"][0]
        for level in hero["levels"]
    ] == [0.08, 0.4, 0.84]
    assert all(
        observations[level["observation_id"]]["image_path"].endswith(
            f"anchor_lamp_landscape_{level['requested_level']}.jpg"
        )
        for level in hero["levels"]
    )


def test_every_controlled_study_has_one_architecture_triplet(payload: dict):
    assert [study["study_id"] for study in payload["studies"]] == list(CONTROLLED_STUDY_IDS)
    assert len(payload["studies"]) == 11
    observations = _observations(payload)

    for study in payload["studies"]:
        expected_anchor = (
            "anchor_lamp_architecture"
            if study["study_id"] in {"study_halation_002", "study_highlight_bloom_001"}
            else "anchor_architecture"
        )
        assert study["anchor_id"] == expected_anchor
        assert [level["requested_level"] for level in study["levels"]] == [
            "low",
            "medium",
            "high",
        ]
        assert len({level["observation_id"] for level in study["levels"]}) == 3
        for level in study["levels"]:
            observation = observations[level["observation_id"]]
            assert observation["study_id"] == study["study_id"]
            assert observation["vector_id"] == study["vector_id"]
            assert observation["requested_level"] == level["requested_level"]
            assert observation["anchor_id"] == expected_anchor


def test_halation_and_bloom_comparison_is_same_scene_and_level(payload: dict):
    comparison = payload["comparison"]
    assert comparison == {
        "anchor_id": "anchor_lamp_landscape",
        "requested_level": "high",
        "items": [
            {"vector_id": "vec_halation", "observation_id": "obs_0162"},
            {"vector_id": "vec_highlight_bloom", "observation_id": "obs_0177"},
        ],
    }
    assert tuple(item["observation_id"] for item in comparison["items"]) == (
        COMPARISON_OBSERVATION_IDS
    )

    observations = _observations(payload)
    halation_scores = _scores(observations["obs_0162"])
    bloom_scores = _scores(observations["obs_0177"])
    assert halation_scores["vec_halation"][0] == 0.84
    assert halation_scores["vec_highlight_bloom"][0] == 0.36
    assert bloom_scores["vec_halation"][0] == 0.22
    assert bloom_scores["vec_highlight_bloom"][0] == 0.84


def test_reconstruction_is_an_explicit_manual_hypothesis(payload: dict):
    reconstruction = payload["reconstruction"]
    assert reconstruction["study_id"] == "study_reconstruction_soft_halated_shadow_001"
    assert reconstruction["target_aesthetic_id"] == "aes_soft_halated_shadow"
    assert reconstruction["interpretation"] == "manual_first_order_hypothesis"
    assert reconstruction["weight_method"] == "manual_not_fitted"
    assert reconstruction["n_evaluations"] == 5
    assert reconstruction["human_rated"] is False
    assert reconstruction["n_human_ratings"] == 0
    assert [weight["weight"] for weight in reconstruction["weights"]] == [0.78, 0.7, 0.58]
    assert [weight["name"] for weight in reconstruction["weights"]] == [
        "optical softness",
        "shadow density",
        "halation",
    ]
    assert [plate["observation_id"] for plate in reconstruction["selected_plates"]] == [
        "obs_0052",
        "obs_0055",
    ]
    assert [plate["anchor_name"] for plate in reconstruction["selected_plates"]] == [
        "ordinary physical object",
        "landscape",
    ]
    assert [plate["score"] for plate in reconstruction["selected_plates"]] == [0.52, 0.54]
    assert reconstruction["residual_counts"] == [
        {
            "vector_id": "vec_highlight_bloom",
            "name": "highlight bloom",
            "count": 5,
            "n": 5,
        },
        {
            "vector_id": "vec_halation",
            "name": "halation",
            "count": 1,
            "n": 5,
        },
        {
            "vector_id": "vec_optical_softness",
            "name": "optical softness",
            "count": 1,
            "n": 5,
        },
        {
            "vector_id": "vec_shadow_density",
            "name": "shadow density",
            "count": 1,
            "n": 5,
        },
    ]
    assert all(
        plate["observation_id"] in _observations(payload)
        for plate in reconstruction["selected_plates"]
    )


def test_reconstruction_aggregate_is_scoped_to_its_declared_study(library: Library):
    expanded = copy.deepcopy(library)
    outside = copy.deepcopy(next(iter(expanded.reconstructions.values())))
    outside.id = "recon_outside_declared_study"
    outside.observation_id = "obs_0077"
    outside.reconstruction_score = 0.99
    outside.residual_vectors = ["vec_diffusion"]
    expanded.reconstructions[outside.id] = outside

    reconstruction = build_chamber_payload(expanded)["reconstruction"]

    assert reconstruction["n_evaluations"] == 5
    assert all(
        residual["vector_id"] != "vec_diffusion"
        for residual in reconstruction["residual_counts"]
    )

    html = _home(expanded)
    assert "diffusion 1/6" not in html
    assert (
        "highlight bloom 5/5 · halation 1/5 · optical softness 1/5 · shadow density 1/5"
        in html
    )


def test_field_is_exact_canonical_nonhuman_subset(payload: dict, library: Library):
    expected = {
        observation.id
        for observation in library.observations.values()
        if observation.anchor_id in FIELD_ANCHOR_IDS
    }
    observations = _observations(payload)

    assert payload["field"]["anchor_ids"] == list(FIELD_ANCHOR_IDS)
    assert payload["field"]["observation_count"] == len(expected) == 126
    assert set(observations) == expected
    assert {row["anchor_id"] for row in observations.values()} == set(FIELD_ANCHOR_IDS)
    assert {
        payload["anchors"][anchor_id]["kind"]
        for anchor_id in FIELD_ANCHOR_IDS
    } == {"architecture", "object", "landscape"}

    for observation_id, row in observations.items():
        canonical = library.observations[observation_id]
        study = library.studies[canonical.study_id]
        assert row["status"] == study.status
        assert row["decision"] == study.decision
        assert row["study_id"] == canonical.study_id
        assert row["vector_id"] == canonical.intended_vector_id
        assert row["requested_level"] == canonical.intended_level
        assert row["image_path"] == canonical.image_path
        assert (library.root / row["image_path"]).is_file()
        assert row["scores"] == [
            [score.vector_id, score.score, score.confidence]
            for score in sorted(
                (score for score in canonical.scores if score.method == "agent_visual"),
                key=lambda score: score.vector_id,
            )
        ]


def test_missing_scores_are_absent_not_zero_filled(payload: dict):
    observation = _observations(payload)["obs_0160"]
    scores = _scores(observation)
    assert "vec_bokeh_softness" not in scores
    assert len(observation["scores"]) == 9
    assert all(value is not None for _, value, _ in observation["scores"])
    assert all(confidence is not None for _, _, confidence in observation["scores"])


def test_field_atlas_manifest_is_complete_and_stable(payload: dict):
    field = payload["field"]
    atlas = field["atlas"]
    observation_ids = sorted(row["id"] for row in field["observations"])

    assert atlas["desktop_path"] == "assets/evidence-atlas-2048.webp"
    assert atlas["mobile_path"] == "assets/evidence-atlas-1024.webp"
    assert atlas["columns"] == 12
    assert atlas["rows"] == 11
    assert atlas["entries"] == {
        observation_id: index
        for index, observation_id in enumerate(observation_ids)
    }
    assert len(atlas["entries"]) == field["observation_count"] == 126


def test_response_metadata_preserves_pair_support(payload: dict):
    responses = payload["analysis"]["responses"]
    assert responses["method"] == "paired_high_minus_low_mean"
    assert responses["pairing"] == "within_anchor"
    assert responses["endpoint_levels"] == ["low", "high"]
    assert responses["missing_scores"] == "pair_omitted_for_component"
    assert responses["component_tuple"] == ["vector_id", "mean_delta", "n_pairs"]
    assert len(responses["studies"]) == 11

    diffusion = next(row for row in responses["studies"] if row["vector_id"] == "vec_diffusion")
    components = {
        vector_id: (mean_delta, n_pairs)
        for vector_id, mean_delta, n_pairs in diffusion["components"]
    }
    assert len(diffusion["paired_anchor_ids"]) == 5
    assert components["vec_diffusion"] == (pytest.approx(0.724), 5)
    assert components["vec_veiling_glare"] == (pytest.approx(0.26), 5)
    assert "vec_atmospheric_haze_response" not in components


def test_correlation_metadata_declares_complete_column_cohort(payload: dict):
    correlations = payload["analysis"]["correlations"]
    assert correlations["method"] == "pearson_unweighted"
    assert correlations["observation_count"] == 100
    assert correlations["support_rule"] == "score_present_in_every_cohort_observation"
    assert len(correlations["dimension_ids"]) == 12
    assert len(correlations["pairs"]) == 66
    assert "vec_veiling_glare" not in correlations["dimension_ids"]
    assert "vec_atmospheric_haze_response" not in correlations["dimension_ids"]

    edge_microcontrast = next(
        value
        for left, right, value in correlations["pairs"]
        if {left, right} == {"vec_edge_softness", "vec_microcontrast"}
    )
    assert edge_microcontrast == pytest.approx(-0.9592, abs=0.00005)


def test_contract_rejects_a_mislabeled_fixed_hero(library: Library):
    broken = copy.deepcopy(library)
    broken.observations["obs_0161"].intended_level = "high"
    with pytest.raises(ValueError, match="hero observations must be ordered"):
        build_chamber_payload(broken)
