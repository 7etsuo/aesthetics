import hashlib
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys

from PIL import Image, ImageStat
import pytest


ROOT = Path(__file__).resolve().parents[1]
PACKAGE = ROOT / "assets" / "world-v5"
MANIFEST_PATH = PACKAGE / "atlas-world-v2.json"
SOURCE_REGISTRY = ROOT / "tools" / "world_v5" / "plate_sources.json"
BUILDER = ROOT / "tools" / "build_emulsion_world.py"
SOCIAL_BUILDER = ROOT / "tools" / "generate_social_card_v5.py"
SOCIAL_CARD = ROOT / "assets" / "social-card-v5.jpg"

BEATS = ("control", "response", "comparison", "association", "reconstruction", "archive")
VARIANTS = ("desktop", "mobile")
MODEL_ID = "depth-anything/Depth-Anything-V2-Small-hf"
MODEL_REVISION = "5426e4f0f36572d16453bbda7a8389317b1bef99"

INTERACTION = {
    "firstResponseMs": 48,
    "settleMs": 240,
    "maxParallaxPx": {"desktop": 18, "mobile": 10},
    "maxRelightEv": 0.6,
    "transitionMs": 900,
}

DEPTH_ENCODING = {
    "kind": "relative-inverse-depth",
    "bitDepth": 8,
    "channels": 1,
    "near": 255,
    "far": 0,
    "normalization": "per-plate-min-max",
    "resampling": "bicubic-align-corners-false",
    "lossless": True,
}


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _manifest() -> dict:
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))


def _asset_path(record: dict) -> Path:
    path = record["path"]
    assert path.startswith("assets/world-v5/")
    return ROOT / path


def _assert_record(record: dict, *, expected_path: str, dimensions: tuple[int, int]) -> Path:
    assert set(record) == {"path", "sha256", "bytes", "width", "height", "mime"}
    assert record["path"] == expected_path
    assert record["mime"] == "image/webp"
    assert (record["width"], record["height"]) == dimensions
    path = _asset_path(record)
    assert path.is_file()
    assert path.stat().st_size == record["bytes"]
    assert _sha256(path) == record["sha256"]
    with Image.open(path) as image:
        assert image.format == "WEBP"
        assert image.size == dimensions
    return path


def _assert_grayscale_depth(path: Path) -> None:
    with Image.open(path) as image:
        if image.mode == "RGB":
            red, green, blue = image.split()
            assert red.tobytes() == green.tobytes() == blue.tobytes()
        else:
            assert image.mode == "L"
        grayscale = image.convert("L")
        low, high = grayscale.getextrema()
        assert low <= 8
        assert high >= 247
        assert ImageStat.Stat(grayscale).var[0] > 100
        sample = grayscale.resize((128, 128), Image.Resampling.BILINEAR)
        assert len(set(sample.get_flattened_data())) >= 48


def test_scene_plate_manifest_identity_and_frozen_contract():
    manifest = _manifest()
    assert manifest["format"] == "atlas-world/v2"
    assert manifest["version"] == 2
    assert manifest["generator"]["deterministic"] is True
    assert set(manifest) == {"format", "version", "generator", "scenePlates"}

    for retired in (
        "control",
        "fieldStation",
        "requiredNodes",
        "models",
        "evidenceBindings",
        "archiveBindings",
    ):
        assert retired not in manifest

    scene = manifest["scenePlates"]
    assert scene["renderer"] == "depth-parallax-v1"
    assert scene["order"] == list(BEATS)
    assert scene["interaction"] == INTERACTION
    assert scene["depthEncoding"] == DEPTH_ENCODING
    assert scene["focalPointConvention"] == {
        "coordinates": "normalized-[x,y]",
        "origin": "top-left",
        "space": "intrinsic-plate-pixels",
        "use": "authored-cover-alignment",
    }
    assert scene["depthEstimator"] == {
        "model": MODEL_ID,
        "revision": MODEL_REVISION,
        "license": "Apache-2.0",
        "modelCard": f"https://huggingface.co/{MODEL_ID}/tree/{MODEL_REVISION}",
        "licenseUrl": "https://www.apache.org/licenses/LICENSE-2.0",
        "localFilesOnly": True,
    }


def test_all_twelve_color_depth_pairs_are_unique_aligned_webps():
    variants = _manifest()["scenePlates"]["variants"]
    assert set(variants) == set(VARIANTS)
    paths: set[str] = set()
    hashes: set[str] = set()
    pair_count = 0

    for variant in VARIANTS:
        assert set(variants[variant]) == set(BEATS)
        for beat in BEATS:
            plate = variants[variant][beat]
            assert set(plate) == {"color", "depth", "focalPoint"}
            assert len(plate["focalPoint"]) == 2
            assert all(0 <= coordinate <= 1 for coordinate in plate["focalPoint"])
            color = plate["color"]
            depth = plate["depth"]
            dimensions = (color["width"], color["height"])
            assert dimensions == (depth["width"], depth["height"])
            color_path = _assert_record(
                color,
                expected_path=f"assets/world-v5/plates/{variant}/{beat}.webp",
                dimensions=dimensions,
            )
            depth_path = _assert_record(
                depth,
                expected_path=f"assets/world-v5/plates/{variant}/{beat}-depth.webp",
                dimensions=dimensions,
            )
            _assert_grayscale_depth(depth_path)
            assert color_path != depth_path
            paths.update((color["path"], depth["path"]))
            hashes.update((color["sha256"], depth["sha256"]))
            pair_count += 1

    assert pair_count == 12
    assert len(paths) == 24
    assert len(hashes) == 24


def test_authored_dimensions_and_corrected_three_gate_mobile_source():
    manifest = _manifest()
    variants = manifest["scenePlates"]["variants"]
    for beat in BEATS:
        assert (variants["desktop"][beat]["color"]["width"], variants["desktop"][beat]["color"]["height"]) == (
            1672,
            941,
        )
    for beat in BEATS[:4]:
        assert (variants["mobile"][beat]["color"]["width"], variants["mobile"][beat]["color"]["height"]) == (
            941,
            1672,
        )
    for beat in BEATS[4:]:
        assert (variants["mobile"][beat]["color"]["width"], variants["mobile"][beat]["color"]["height"]) == (
            853,
            1844,
        )

    registry = json.loads(SOURCE_REGISTRY.read_text(encoding="utf-8"))
    reconstruction = registry["variants"]["mobile"]["reconstruction"]
    assert reconstruction["file"] == "exec-867d3818-5463-450b-a01f-1edecd0ab1f4.png"
    assert reconstruction["sha256"] == "8ab349e439ced22951db1d0cd8bdcbd87da57b42be135189169b784ff01bc225"
    assert reconstruction["note"] == "Corrected source with exactly three reconstruction gates"


def test_loading_fallbacks_and_social_source_reuse_control_pixels():
    scene = _manifest()["scenePlates"]
    variants = scene["variants"]
    assert scene["loading"] == {
        "poster": {
            "desktop": variants["desktop"]["control"]["color"]["path"],
            "mobile": variants["mobile"]["control"]["color"]["path"],
        },
        "fallback": "plate-color-no-duplicate-assets",
        "saveData": {"preload": "color-only", "preloadDepth": False},
    }
    assert "socialCard" not in scene
    social = scene["socialSource"]
    core = {key: social[key] for key in ("path", "sha256", "bytes", "width", "height", "mime")}
    _assert_record(core, expected_path="assets/world-v5/social-source.webp", dimensions=(1200, 630))
    assert social["sourceVariant"] == "desktop"
    assert social["sourceBeat"] == "control"
    assert social["transform"] == "cover-crop-1200x630-lanczos-at-authored-focal-point"


def test_byte_budgets_are_exact_and_well_below_hard_limits():
    scene = _manifest()["scenePlates"]
    variants = scene["variants"]
    budgets = scene["budgets"]
    unique_records = [
        variants[variant][beat][kind]
        for variant in VARIANTS
        for beat in BEATS
        for kind in ("color", "depth")
    ] + [scene["socialSource"]]
    exact_bytes = sum(record["bytes"] for record in unique_records)
    assert exact_bytes == budgets["packageBytes"]
    assert exact_bytes <= budgets["packageTargetBytes"] == 10_000_000
    assert exact_bytes <= budgets["packageByteCeiling"] == 12_000_000
    for variant in VARIANTS:
        control = variants[variant]["control"]
        pair_bytes = control["color"]["bytes"] + control["depth"]["bytes"]
        assert pair_bytes == budgets["initialControlPairBytes"][variant]
        assert pair_bytes <= budgets["initialControlPairByteCeiling"] == 1_500_000


def test_provenance_registry_manifest_and_credits_are_complete():
    registry = json.loads(SOURCE_REGISTRY.read_text(encoding="utf-8"))
    provenance = _manifest()["scenePlates"]["provenance"]
    assert registry["schema"] == "atlas-scene-plate-sources/v1"
    assert registry["sourceRootEnv"] == "ATLAS_PLATE_SOURCE_ROOT"
    assert "sourceRoot" not in registry
    assert registry["generator"] == provenance["generator"] == "OpenAI image generation"
    assert provenance["sourceRegistry"] == "tools/world_v5/plate_sources.json"
    assert provenance["sourceRegistrySha256"] == _sha256(SOURCE_REGISTRY)
    credits = (PACKAGE / "CREDITS.md").read_text(encoding="utf-8")
    assert MODEL_REVISION in credits
    assert "Apache-2.0" in credits

    for variant in VARIANTS:
        for beat in BEATS:
            source = registry["variants"][variant][beat]
            recorded = provenance["variants"][variant][beat]
            assert recorded["sha256"] == source["sha256"]
            assert (recorded["width"], recorded["height"]) == (source["width"], source["height"])
            assert recorded["focalPoint"] == source["focalPoint"]
            assert recorded["sourceId"] == source["file"]
            assert source["sha256"] in credits


def test_committed_manifest_docs_and_tooling_registries_do_not_leak_local_paths():
    audited = [
        MANIFEST_PATH,
        PACKAGE / "README.md",
        PACKAGE / "CREDITS.md",
        *sorted((ROOT / "tools" / "world_v5").glob("*.json")),
    ]
    committed_text = "\n".join(path.read_text(encoding="utf-8") for path in audited)
    assert "/home/" not in committed_text
    assert "/Users/" not in committed_text
    assert "file://" not in committed_text
    provenance = _manifest()["scenePlates"]["provenance"]["variants"]
    for variant in VARIANTS:
        for beat in BEATS:
            assert "path" not in provenance[variant][beat]
            assert provenance[variant][beat]["sourceId"].startswith("exec-")


def test_package_has_no_retired_glb_or_duplicate_fallback_assets():
    files = {path.relative_to(PACKAGE).as_posix() for path in PACKAGE.rglob("*") if path.is_file()}
    expected = {"README.md", "CREDITS.md", "atlas-world-v2.json", "social-source.webp"}
    expected.update(
        f"plates/{variant}/{beat}{suffix}.webp"
        for variant in VARIANTS
        for beat in BEATS
        for suffix in ("", "-depth")
    )
    assert files == expected
    assert not list(PACKAGE.rglob("*.glb"))
    serialized = MANIFEST_PATH.read_text(encoding="utf-8")
    assert ".glb" not in serialized.lower()
    assert "fieldStation" not in serialized
    assert "requiredNodes" not in serialized
    assert "evidenceBindings" not in serialized
    assert "archiveBindings" not in serialized
    assert "assets/social-card-v5.jpg" not in serialized


def test_builder_verify_only_checks_committed_hashes_and_depth_variance():
    result = subprocess.run(
        [sys.executable, str(BUILDER), "--verify-only"],
        cwd=ROOT,
        check=False,
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0, result.stderr + result.stdout
    assert "verified" in result.stdout


def test_source_backed_build_fails_precisely_without_explicit_source_root():
    environment = os.environ.copy()
    environment.pop("ATLAS_PLATE_SOURCE_ROOT", None)
    environment.pop("ATLAS_RUN_WORLD_REPRO", None)
    result = subprocess.run(
        [sys.executable, str(BUILDER), "--control-checkpoint"],
        cwd=ROOT,
        env=environment,
        check=False,
        capture_output=True,
        text=True,
    )
    output = result.stderr + result.stdout
    assert result.returncode != 0
    assert "ATLAS_PLATE_SOURCE_ROOT is required for source-backed scene-plate builds" in output
    assert "use --verify-only" in output


def test_committed_webps_have_deterministic_lightweight_encodes(tmp_path: Path):
    spec = importlib.util.spec_from_file_location("atlas_world_builder_test", BUILDER)
    assert spec is not None and spec.loader is not None
    builder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(builder)

    sources = (
        (PACKAGE / "plates" / "desktop" / "control.webp", False, "RGB"),
        (PACKAGE / "plates" / "desktop" / "control-depth.webp", True, "L"),
    )
    for source, lossless, mode in sources:
        with Image.open(source) as opened:
            image = opened.convert(mode)
        first = tmp_path / f"first-{source.name}"
        second = tmp_path / f"second-{source.name}"
        builder.save_webp(image, first, lossless=lossless)
        builder.save_webp(image, second, lossless=lossless)
        assert first.read_bytes() == second.read_bytes()
        assert _sha256(first) == _sha256(second)


def test_social_card_uses_control_source_and_rebuilds_deterministically():
    assert SOCIAL_CARD.is_file()
    before = _sha256(SOCIAL_CARD)
    result = subprocess.run(
        [sys.executable, str(SOCIAL_BUILDER)],
        cwd=ROOT,
        check=False,
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0, result.stderr + result.stdout
    assert _sha256(SOCIAL_CARD) == before
    assert SOCIAL_CARD.stat().st_size < 300_000
    with Image.open(SOCIAL_CARD) as image:
        assert image.format == "JPEG"
        assert image.size == (1200, 630)
    source = SOCIAL_BUILDER.read_text(encoding="utf-8")
    assert "assets\" / \"world-v5\" / \"social-source.webp" in source
    assert "optical-observatory" not in source.lower()


@pytest.mark.skipif(
    os.environ.get("ATLAS_RUN_WORLD_REPRO") != "1",
    reason="full Depth Anything reproduction requires ATLAS_RUN_WORLD_REPRO=1 and private build inputs",
)
def test_opt_in_rebuild_is_deterministic_for_every_color_depth_pair():
    assert os.environ.get("ATLAS_PLATE_SOURCE_ROOT"), (
        "ATLAS_RUN_WORLD_REPRO=1 also requires ATLAS_PLATE_SOURCE_ROOT to name "
        "the verified source directory"
    )
    result = subprocess.run(
        [sys.executable, str(BUILDER), "--determinism-check"],
        cwd=ROOT,
        check=False,
        capture_output=True,
        text=True,
        timeout=180,
    )
    assert result.returncode == 0, result.stderr + result.stdout
    assert "determinism check passed" in result.stdout
