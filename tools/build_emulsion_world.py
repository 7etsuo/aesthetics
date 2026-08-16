#!/usr/bin/env python3
"""Build Atlas V5's deterministic cinematic scene-plate package.

The production world is twelve authored color plates (six narrative beats in
desktop and mobile compositions) plus aligned relative inverse-depth maps.
Depth is inferred with one pinned, locally cached Depth Anything V2 revision;
the build never downloads or silently substitutes a model.

Typical use::

    python tools/build_emulsion_world.py --control-checkpoint
    python tools/build_emulsion_world.py
    python tools/build_emulsion_world.py --verify-only
    python tools/build_emulsion_world.py --determinism-check
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import sys
import tempfile
from typing import Any, Iterable

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / "tools" / "world_v5"
SOURCE_CONFIG = TOOLS / "plate_sources.json"
OUTPUT = ROOT / "assets" / "world-v5"
MANIFEST = OUTPUT / "atlas-world-v2.json"
CHECKPOINT = Path("/tmp/atlas-scene-plates-control-checkpoint.json")

FORMAT = "atlas-world/v2"
VERSION = 2
GENERATOR_VERSION = "3.0.0"
BEATS = ("control", "response", "comparison", "association", "reconstruction", "archive")
VARIANTS = ("desktop", "mobile")

MODEL_ID = "depth-anything/Depth-Anything-V2-Small-hf"
MODEL_REVISION = "5426e4f0f36572d16453bbda7a8389317b1bef99"
MODEL_LICENSE = "Apache-2.0"
MODEL_CARD = f"https://huggingface.co/{MODEL_ID}/tree/{MODEL_REVISION}"
MODEL_LICENSE_URL = "https://www.apache.org/licenses/LICENSE-2.0"

COLOR_QUALITY = 88
INITIAL_PAIR_CEILING = 1_500_000
PACKAGE_TARGET = 10_000_000
PACKAGE_CEILING = 12_000_000
SOCIAL_SIZE = (1200, 630)

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

# These are outputs from the retired GLB experiment.  They are known generated
# files, not source media; a production build removes them explicitly.
RETIRED_FILES = (
    "atlas-world-v1.json",
    "emulsion-world-desktop.glb",
    "emulsion-world-mobile.glb",
    "field-station-0161.glb",
    "field-station-marine-backplate.webp",
    "poster-desktop.webp",
    "poster-mobile.webp",
)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def json_bytes(value: Any) -> bytes:
    return (json.dumps(value, indent=2, ensure_ascii=False, sort_keys=False) + "\n").encode("utf-8")


def atomic_write(path: Path, payload: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.part")
    temporary.write_bytes(payload)
    temporary.replace(path)


def save_webp(image: Image.Image, path: Path, *, lossless: bool) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.part")
    options: dict[str, Any] = {"format": "WEBP", "method": 6}
    if lossless:
        options["lossless"] = True
        options["exact"] = True
    else:
        options["quality"] = COLOR_QUALITY
    image.save(temporary, **options)
    temporary.replace(path)


def asset_record(path: Path, *, output_root: Path) -> dict[str, Any]:
    with Image.open(path) as image:
        width, height = image.size
        if image.format != "WEBP":
            raise RuntimeError(f"Expected WebP output, got {image.format}: {path}")
    relative = path.relative_to(output_root)
    return {
        "path": (Path("assets/world-v5") / relative).as_posix(),
        "sha256": sha256(path),
        "bytes": path.stat().st_size,
        "width": width,
        "height": height,
        "mime": "image/webp",
    }


def resolve_source_root(config: dict[str, Any]) -> Path:
    variable = config.get("sourceRootEnv")
    if variable != "ATLAS_PLATE_SOURCE_ROOT":
        raise SystemExit(
            "Scene-plate registry must declare sourceRootEnv=ATLAS_PLATE_SOURCE_ROOT; "
            "committed registries may not contain a workstation path."
        )
    configured = os.environ.get(variable)
    if not configured:
        raise SystemExit(
            "ATLAS_PLATE_SOURCE_ROOT is required for source-backed scene-plate builds. "
            "Set it to the directory containing the 12 approved PNG source IDs from "
            "tools/world_v5/plate_sources.json. Committed-output verification does not "
            "need this variable; use --verify-only."
        )
    root = Path(configured).expanduser()
    if not root.is_dir():
        raise SystemExit(
            "ATLAS_PLATE_SOURCE_ROOT does not name a readable directory containing the "
            "approved PNG source IDs."
        )
    return root


def load_sources() -> dict[str, Any]:
    try:
        config = json.loads(SOURCE_CONFIG.read_text(encoding="utf-8"))
    except FileNotFoundError as error:
        raise SystemExit(f"Missing scene-plate source registry: {SOURCE_CONFIG}") from error
    if config.get("schema") != "atlas-scene-plate-sources/v1":
        raise SystemExit(f"Unsupported source registry schema in {SOURCE_CONFIG}")
    if config.get("order") != list(BEATS):
        raise SystemExit("Source registry beat order does not match the frozen contract")
    if set(config.get("variants", {})) != set(VARIANTS):
        raise SystemExit("Source registry must contain exactly desktop and mobile variants")

    source_root = resolve_source_root(config)
    for variant in VARIANTS:
        records = config["variants"][variant]
        if set(records) != set(BEATS):
            raise SystemExit(f"Source registry has the wrong beats for {variant}")
        for beat in BEATS:
            record = records[beat]
            path = source_root / record["file"]
            if not path.is_file():
                raise SystemExit(f"Missing approved {variant}/{beat} source: {path}")
            actual_hash = sha256(path)
            if actual_hash != record["sha256"]:
                raise SystemExit(
                    f"Source hash mismatch for {variant}/{beat}: expected {record['sha256']}, got {actual_hash}"
                )
            with Image.open(path) as image:
                if image.size != (record["width"], record["height"]):
                    raise SystemExit(
                        f"Source dimensions changed for {variant}/{beat}: expected "
                        f"{record['width']}x{record['height']}, got {image.width}x{image.height}"
                    )
            focal = record.get("focalPoint")
            if not isinstance(focal, list) or len(focal) != 2 or not all(0 <= value <= 1 for value in focal):
                raise SystemExit(f"Invalid focalPoint for {variant}/{beat}")
    return config


def configure_torch() -> tuple[Any, ...]:
    # CUBLAS_WORKSPACE_CONFIG must be present before CUDA context creation for
    # deterministic cuBLAS kernels.
    os.environ.setdefault("CUBLAS_WORKSPACE_CONFIG", ":4096:8")
    try:
        import numpy as np
        import torch
        import torch.nn.functional as functional
        from transformers import AutoImageProcessor, AutoModelForDepthEstimation
    except ImportError as error:
        raise SystemExit(
            "Depth build dependencies are unavailable. Install the pinned project "
            "environment with torch, transformers, numpy, and Pillow."
        ) from error

    torch.manual_seed(161)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(161)
    torch.use_deterministic_algorithms(True)
    torch.backends.cudnn.benchmark = False
    torch.backends.cudnn.deterministic = True
    if hasattr(torch.backends.cuda.matmul, "allow_tf32"):
        torch.backends.cuda.matmul.allow_tf32 = False
    if hasattr(torch.backends.cudnn, "allow_tf32"):
        torch.backends.cudnn.allow_tf32 = False

    requested_device = os.environ.get("ATLAS_DEPTH_DEVICE")
    device = requested_device or ("cuda" if torch.cuda.is_available() else "cpu")
    try:
        processor = AutoImageProcessor.from_pretrained(
            MODEL_ID,
            revision=MODEL_REVISION,
            local_files_only=True,
            use_fast=False,
        )
        model = AutoModelForDepthEstimation.from_pretrained(
            MODEL_ID,
            revision=MODEL_REVISION,
            local_files_only=True,
        )
    except Exception as error:
        raise SystemExit(
            "Pinned Depth Anything V2 snapshot is unavailable or invalid. The build "
            f"requires local cache {MODEL_ID}@{MODEL_REVISION}; it will not download "
            "or substitute another revision."
        ) from error
    try:
        model = model.to(device).eval()
    except Exception as error:
        raise SystemExit(f"Cannot place the pinned depth estimator on device {device!r}") from error
    return (np, torch, functional, processor, model, device)


def infer_depth(image: Image.Image, runtime: tuple[Any, ...]) -> Image.Image:
    np, torch, functional, processor, model, device = runtime
    width, height = image.size
    inputs = processor(images=image, return_tensors="pt")
    inputs = {key: value.to(device) for key, value in inputs.items()}
    with torch.inference_mode():
        prediction = model(**inputs).predicted_depth
    # Interpolation on CPU avoids backend-specific CUDA resize kernels while
    # following the model card's bicubic, align_corners=False recipe exactly.
    prediction = prediction.detach().cpu().float().unsqueeze(1)
    prediction = functional.interpolate(
        prediction,
        size=(height, width),
        mode="bicubic",
        align_corners=False,
    ).squeeze()
    values = prediction.numpy()
    finite = np.isfinite(values)
    if not finite.all():
        raise RuntimeError("Depth estimator returned non-finite values")
    minimum = float(values.min())
    maximum = float(values.max())
    if maximum - minimum <= 1e-8:
        raise RuntimeError("Depth estimator returned a degenerate depth field")
    normalized = (values - minimum) / (maximum - minimum)
    encoded = np.floor(normalized * 255.0 + 0.5).clip(0, 255).astype(np.uint8)
    return Image.fromarray(encoded)


def source_provenance(config: dict[str, Any]) -> dict[str, Any]:
    variants: dict[str, Any] = {}
    for variant in VARIANTS:
        variants[variant] = {}
        for beat in BEATS:
            item = config["variants"][variant][beat]
            source = {
                "sourceId": item["file"],
                "sha256": item["sha256"],
                "width": item["width"],
                "height": item["height"],
                "focalPoint": item["focalPoint"],
            }
            if "note" in item:
                source["note"] = item["note"]
            variants[variant][beat] = source
    return {
        "generator": config["generator"],
        "sourceRegistry": "tools/world_v5/plate_sources.json",
        "sourceRegistrySha256": sha256(SOURCE_CONFIG),
        "variants": variants,
    }


def build_variant(
    config: dict[str, Any],
    variant: str,
    beats: Iterable[str],
    runtime: tuple[Any, ...],
    output_root: Path,
) -> dict[str, Any]:
    source_root = resolve_source_root(config)
    result: dict[str, Any] = {}
    target_dir = output_root / "plates" / variant
    for beat in beats:
        source = config["variants"][variant][beat]
        source_path = source_root / source["file"]
        color_path = target_dir / f"{beat}.webp"
        depth_path = target_dir / f"{beat}-depth.webp"
        with Image.open(source_path) as opened:
            color = opened.convert("RGB")
        depth = infer_depth(color, runtime)
        if color.size != depth.size:
            raise RuntimeError(f"Depth/color alignment failed for {variant}/{beat}")
        save_webp(color, color_path, lossless=False)
        save_webp(depth, depth_path, lossless=True)
        result[beat] = {
            "color": asset_record(color_path, output_root=output_root),
            "depth": asset_record(depth_path, output_root=output_root),
            "focalPoint": source["focalPoint"],
        }
        print(
            f"built {variant}/{beat}: color={color_path.stat().st_size:,} B, "
            f"depth={depth_path.stat().st_size:,} B",
            flush=True,
        )
    return result


def build_social_source(config: dict[str, Any], output_root: Path) -> dict[str, Any]:
    source = config["variants"]["desktop"]["control"]
    source_path = resolve_source_root(config) / source["file"]
    with Image.open(source_path) as opened:
        color = opened.convert("RGB")
    social = ImageOps.fit(
        color,
        SOCIAL_SIZE,
        method=Image.Resampling.LANCZOS,
        centering=tuple(source["focalPoint"]),
    )
    path = output_root / "social-source.webp"
    save_webp(social, path, lossless=False)
    record = asset_record(path, output_root=output_root)
    record.update(
        {
            "sourceVariant": "desktop",
            "sourceBeat": "control",
            "transform": "cover-crop-1200x630-lanczos-at-authored-focal-point",
        }
    )
    return record


def dependency_versions() -> dict[str, str]:
    import PIL
    import numpy
    import torch
    import transformers

    return {
        "python": ".".join(str(value) for value in sys.version_info[:3]),
        "pillow": PIL.__version__,
        "numpy": numpy.__version__,
        "torch": torch.__version__,
        "transformers": transformers.__version__,
    }


def make_manifest(
    config: dict[str, Any],
    variants: dict[str, Any],
    social_source: dict[str, Any],
) -> dict[str, Any]:
    control_bytes = {
        variant: variants[variant]["control"]["color"]["bytes"]
        + variants[variant]["control"]["depth"]["bytes"]
        for variant in VARIANTS
    }
    unique_records = [
        variants[variant][beat][kind]
        for variant in VARIANTS
        for beat in BEATS
        for kind in ("color", "depth")
    ] + [social_source]
    package_bytes = sum(record["bytes"] for record in unique_records)
    if any(value > INITIAL_PAIR_CEILING for value in control_bytes.values()):
        raise RuntimeError(f"Control pair exceeds {INITIAL_PAIR_CEILING:,} bytes: {control_bytes}")
    if package_bytes > PACKAGE_CEILING:
        raise RuntimeError(f"Scene-plate package exceeds {PACKAGE_CEILING:,} bytes: {package_bytes:,}")

    poster = {
        variant: variants[variant]["control"]["color"]["path"] for variant in VARIANTS
    }
    return {
        "format": FORMAT,
        "version": VERSION,
        "generator": {
            "name": "tools/build_emulsion_world.py",
            "version": GENERATOR_VERSION,
            "deterministic": True,
            "dependencies": dependency_versions(),
        },
        "scenePlates": {
            "renderer": "depth-parallax-v1",
            "order": list(BEATS),
            "interaction": INTERACTION,
            "depthEstimator": {
                "model": MODEL_ID,
                "revision": MODEL_REVISION,
                "license": MODEL_LICENSE,
                "modelCard": MODEL_CARD,
                "licenseUrl": MODEL_LICENSE_URL,
                "localFilesOnly": True,
            },
            "colorEncoding": {
                "mime": "image/webp",
                "quality": COLOR_QUALITY,
                "method": 6,
                "channels": 3,
            },
            "depthEncoding": DEPTH_ENCODING,
            "focalPointConvention": {
                "coordinates": "normalized-[x,y]",
                "origin": "top-left",
                "space": "intrinsic-plate-pixels",
                "use": "authored-cover-alignment",
            },
            "loading": {
                "poster": poster,
                "fallback": "plate-color-no-duplicate-assets",
                "saveData": {
                    "preload": "color-only",
                    "preloadDepth": False,
                },
            },
            "variants": variants,
            "socialSource": social_source,
            "provenance": source_provenance(config),
            "budgets": {
                "initialControlPairBytes": control_bytes,
                "initialControlPairByteCeiling": INITIAL_PAIR_CEILING,
                "packageBytes": package_bytes,
                "packageTargetBytes": PACKAGE_TARGET,
                "packageByteCeiling": PACKAGE_CEILING,
            },
        },
    }


def make_checkpoint(config: dict[str, Any], variants: dict[str, Any]) -> dict[str, Any]:
    return {
        "format": FORMAT,
        "version": VERSION,
        "checkpoint": "control-only",
        "scenePlates": {
            "renderer": "depth-parallax-v1",
            "order": list(BEATS),
            "interaction": INTERACTION,
            "depthEstimator": {
                "model": MODEL_ID,
                "revision": MODEL_REVISION,
                "license": MODEL_LICENSE,
            },
            "depthEncoding": DEPTH_ENCODING,
            "focalPointConvention": {
                "coordinates": "normalized-[x,y]",
                "origin": "top-left",
                "space": "intrinsic-plate-pixels",
            },
            "variants": variants,
            "provenance": source_provenance(config),
        },
    }


def remove_retired_outputs(output_root: Path) -> None:
    for name in RETIRED_FILES:
        path = output_root / name
        if path.is_file():
            path.unlink()
    for pattern in ("fallback-*.webp", "material-gate-*.webp", "hybrid-gate-*.webp"):
        for path in output_root.glob(pattern):
            if path.is_file():
                path.unlink()
    for path in output_root.rglob("*.glb"):
        if path.is_file():
            path.unlink()


def verify_record(record: dict[str, Any], output_root: Path, *, depth: bool) -> int:
    required = {"path", "sha256", "bytes", "width", "height", "mime"}
    if set(record) != required:
        raise RuntimeError(f"Asset record has unexpected keys: {record}")
    prefix = "assets/world-v5/"
    if not record["path"].startswith(prefix):
        raise RuntimeError(f"Asset path escapes package: {record['path']}")
    path = output_root / record["path"][len(prefix) :]
    if not path.is_file():
        raise RuntimeError(f"Missing packaged asset: {path}")
    if path.stat().st_size != record["bytes"] or sha256(path) != record["sha256"]:
        raise RuntimeError(f"Packaged asset digest/size mismatch: {path}")
    if record["mime"] != "image/webp":
        raise RuntimeError(f"Wrong MIME for {path}")
    with Image.open(path) as image:
        if image.format != "WEBP" or image.size != (record["width"], record["height"]):
            raise RuntimeError(f"Image metadata mismatch: {path}")
        if depth:
            if image.mode == "RGB":
                red, green, blue = image.split()
                if red.tobytes() != green.tobytes() or red.tobytes() != blue.tobytes():
                    raise RuntimeError(f"Depth WebP channels are not identical grayscale: {path}")
            elif image.mode != "L":
                raise RuntimeError(f"Unexpected decoded depth mode {image.mode}: {path}")
            grayscale = image.convert("L")
            low, high = grayscale.getextrema()
            histogram = grayscale.histogram()
            populated = sum(1 for count in histogram if count)
            if low > 8 or high < 247 or populated < 64:
                raise RuntimeError(f"Depth map has insufficient range/variance: {path}")
    return record["bytes"]


def verify_manifest(path: Path = MANIFEST, output_root: Path = OUTPUT) -> dict[str, Any]:
    manifest = json.loads(path.read_text(encoding="utf-8"))
    if manifest.get("format") != FORMAT or manifest.get("version") != VERSION:
        raise RuntimeError("Manifest identity does not match atlas-world/v2 version 2")
    for forbidden in (
        "control",
        "fieldStation",
        "requiredNodes",
        "models",
        "evidenceBindings",
        "archiveBindings",
    ):
        if forbidden in manifest:
            raise RuntimeError(f"Retired top-level manifest key is present: {forbidden}")
    scene = manifest.get("scenePlates")
    if scene.get("renderer") != "depth-parallax-v1" or scene.get("order") != list(BEATS):
        raise RuntimeError("Scene-plate renderer/order does not match the frozen contract")
    if scene.get("interaction") != INTERACTION or scene.get("depthEncoding") != DEPTH_ENCODING:
        raise RuntimeError("Scene-plate interaction/depth encoding changed")
    estimator = scene.get("depthEstimator", {})
    if (estimator.get("model"), estimator.get("revision"), estimator.get("license")) != (
        MODEL_ID,
        MODEL_REVISION,
        MODEL_LICENSE,
    ):
        raise RuntimeError("Depth estimator pin changed")
    variants = scene.get("variants", {})
    if set(variants) != set(VARIANTS):
        raise RuntimeError("Manifest variants changed")
    seen: set[str] = set()
    package_bytes = 0
    for variant in VARIANTS:
        if set(variants[variant]) != set(BEATS):
            raise RuntimeError(f"Manifest beats changed for {variant}")
        for beat in BEATS:
            plate = variants[variant][beat]
            if set(plate) != {"color", "depth", "focalPoint"}:
                raise RuntimeError(f"Plate schema changed for {variant}/{beat}")
            color = plate["color"]
            depth = plate["depth"]
            if (color["width"], color["height"]) != (depth["width"], depth["height"]):
                raise RuntimeError(f"Color/depth dimensions differ for {variant}/{beat}")
            for kind, record in (("color", color), ("depth", depth)):
                expected = f"assets/world-v5/plates/{variant}/{beat}{'-depth' if kind == 'depth' else ''}.webp"
                if record["path"] != expected or record["path"] in seen:
                    raise RuntimeError(f"Wrong or duplicate asset path: {record['path']}")
                seen.add(record["path"])
                package_bytes += verify_record(record, output_root, depth=kind == "depth")
    social_source = scene["socialSource"]
    social_core = {
        key: social_source[key] for key in ("path", "sha256", "bytes", "width", "height", "mime")
    }
    package_bytes += verify_record(social_core, output_root, depth=False)
    if (social_source["width"], social_source["height"]) != SOCIAL_SIZE:
        raise RuntimeError("Social source dimensions changed")
    budgets = scene["budgets"]
    if package_bytes != budgets["packageBytes"] or package_bytes > PACKAGE_CEILING:
        raise RuntimeError("Package byte accounting or hard ceiling failed")
    for variant in VARIANTS:
        pair = variants[variant]["control"]
        pair_bytes = pair["color"]["bytes"] + pair["depth"]["bytes"]
        if pair_bytes != budgets["initialControlPairBytes"][variant] or pair_bytes > INITIAL_PAIR_CEILING:
            raise RuntimeError(f"Initial Control budget failed for {variant}")
    if any(output_root.rglob("*.glb")):
        raise RuntimeError("Retired GLB remains in production package")
    if len(seen) != 24:
        raise RuntimeError("Expected exactly 24 unique color/depth assets")
    return manifest


def run_control_checkpoint(config: dict[str, Any]) -> None:
    runtime = configure_torch()
    partial: dict[str, Any] = {}
    for variant in VARIANTS:
        partial[variant] = build_variant(config, variant, ("control",), runtime, OUTPUT)
    checkpoint = make_checkpoint(config, partial)
    atomic_write(CHECKPOINT, json_bytes(checkpoint))
    print(f"control checkpoint: {CHECKPOINT}")


def run_build(config: dict[str, Any], output_root: Path = OUTPUT, *, write_manifest: bool = True) -> dict[str, Any]:
    runtime = configure_torch()
    variants = {
        variant: build_variant(config, variant, BEATS, runtime, output_root) for variant in VARIANTS
    }
    social_source = build_social_source(config, output_root)
    manifest = make_manifest(config, variants, social_source)
    if write_manifest:
        atomic_write(output_root / MANIFEST.name, json_bytes(manifest))
    return manifest


def determinism_check(config: dict[str, Any]) -> None:
    with tempfile.TemporaryDirectory(prefix="atlas-plates-a-") as first_dir, tempfile.TemporaryDirectory(
        prefix="atlas-plates-b-"
    ) as second_dir:
        first_root = Path(first_dir)
        second_root = Path(second_dir)
        first = run_build(config, first_root, write_manifest=False)
        second = run_build(config, second_root, write_manifest=False)
        for variant in VARIANTS:
            for beat in BEATS:
                for kind in ("color", "depth"):
                    left = first["scenePlates"]["variants"][variant][beat][kind]["sha256"]
                    right = second["scenePlates"]["variants"][variant][beat][kind]["sha256"]
                    if left != right:
                        raise RuntimeError(f"Nondeterministic output: {variant}/{beat}/{kind}")
        if first["scenePlates"]["socialSource"]["sha256"] != second["scenePlates"]["socialSource"]["sha256"]:
            raise RuntimeError("Nondeterministic social source output")
    print("determinism check passed")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--control-checkpoint", action="store_true", help="build only the two Control pairs")
    mode.add_argument("--verify-only", action="store_true", help="verify committed outputs without loading the model")
    mode.add_argument("--determinism-check", action="store_true", help="rebuild twice and compare every output hash")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.verify_only:
        verify_manifest()
        print(f"verified {MANIFEST}")
        return 0
    config = load_sources()
    if args.control_checkpoint:
        run_control_checkpoint(config)
        return 0
    if args.determinism_check:
        determinism_check(config)
        return 0

    OUTPUT.mkdir(parents=True, exist_ok=True)
    remove_retired_outputs(OUTPUT)
    run_build(config)
    verify_manifest()
    if (OUTPUT / "plates").is_dir():
        print(f"built and verified {MANIFEST}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
