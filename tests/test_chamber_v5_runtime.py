from __future__ import annotations

import copy
import hashlib
import json
import math
import re
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RUNTIME_PATH = ROOT / "src" / "web" / "chamber-v5.js"
MANIFEST_PATH = ROOT / "assets" / "world-v5" / "atlas-world-v2.json"

BEATS = (
    "control",
    "response",
    "comparison",
    "association",
    "reconstruction",
    "archive",
)
RESPONSE_COMPONENTS = (
    ("vec_halation", 0.72, 5),
    ("vec_highlight_bloom", 0.176, 5),
    ("vec_diffusion", 0.0, 5),
    ("vec_final_bloom", 0.0, 5),
    ("vec_highlight_rolloff", 0.0, 5),
    ("vec_key_to_fill_ratio", 0.0, 5),
)
RETIRED_WORLD_KEYS = (
    "control",
    "fieldStation",
    "requiredNodes",
    "models",
    "evidenceBindings",
    "archiveBindings",
)


def _runtime() -> str:
    return RUNTIME_PATH.read_text(encoding="utf-8")


def _section(source: str, start: str, end: str) -> str:
    start_index = source.index(start)
    end_index = source.index(end, start_index + len(start))
    return source[start_index:end_index]


def _run_node(script: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["node", "--input-type=module"],
        input=script,
        text=True,
        capture_output=True,
        check=False,
        cwd=ROOT,
    )


def _contract_fixture() -> tuple[dict, dict]:
    required = [
        "obs_0160",
        "obs_0161",
        "obs_0162",
        "obs_0177",
        "obs_0052",
        "obs_0055",
    ]
    observations = list(required)
    serial = 2000
    while len(observations) < 126:
        candidate = f"obs_{serial:04d}"
        serial += 1
        if candidate not in observations:
            observations.append(candidate)

    atlas_entries = {
        observation_id: index for index, observation_id in enumerate(observations)
    }
    geometry = {
        "width": 768,
        "height": 704,
        "cell_size": 64,
        "gutter": 2,
        "offset_x": 0,
        "offset_y": 0,
    }
    payload = {
        "field": {
            "observations": [{"id": observation_id} for observation_id in observations],
            "atlas": {
                "entries": atlas_entries,
                "columns": 12,
                "rows": 11,
                "desktop_path": "assets/evidence-atlas-2048.webp",
                "mobile_path": "assets/evidence-atlas-1024.webp",
                "desktop": geometry,
                "mobile": geometry,
            },
        },
        "hero": {
            "vector_id": "vec_halation",
            "levels": [
                {"requested_level": "low", "observation_id": "obs_0160"},
                {"requested_level": "medium", "observation_id": "obs_0161"},
                {"requested_level": "high", "observation_id": "obs_0162"},
            ],
        },
        "comparison": {
            "items": [
                {"vector_id": "vec_halation", "observation_id": "obs_0162"},
                {"vector_id": "vec_highlight_bloom", "observation_id": "obs_0177"},
            ],
        },
        "reconstruction": {
            "selected_plates": [
                {"anchor_id": "anchor_object", "observation_id": "obs_0052"},
                {"anchor_id": "anchor_landscape", "observation_id": "obs_0055"},
            ],
            "weights": [
                {"vector_id": "vec_optical_softness", "weight": 0.78},
                {"vector_id": "vec_shadow_density", "weight": 0.70},
                {"vector_id": "vec_halation", "weight": 0.58},
            ],
        },
        "analysis": {
            "responses": {
                "studies": [
                    {
                        "vector_id": "vec_halation",
                        "components": [list(item) for item in RESPONSE_COMPONENTS]
                        + [
                            ["vec_optical_softness", 0.0, 5],
                            ["vec_shadow_density", 0.0, 5],
                            ["vec_veiling_glare", 0.0, 5],
                        ],
                    }
                ]
            },
            "correlations": {"pairs": []},
        },
        "vectors": {
            "vec_optical_softness": {"name": "Optical softness"},
            "vec_shadow_density": {"name": "Shadow density"},
            "vec_halation": {"name": "Halation"},
        },
    }
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    return payload, manifest


def _validator_program(body: str) -> str:
    source = _runtime()
    contract_source = _section(
        source,
        "const BEATS = Object.freeze",
        "function vectorName",
    )
    payload, manifest = _contract_fixture()
    return (
        contract_source
        + "\nconst payload = "
        + json.dumps(payload)
        + ";\nconst manifest = "
        + json.dumps(manifest)
        + ";\n"
        + body
    )


def test_runtime_is_valid_javascript_and_has_no_retired_3d_loader() -> None:
    syntax = subprocess.run(
        ["node", "--check", str(RUNTIME_PATH)],
        text=True,
        capture_output=True,
        check=False,
        cwd=ROOT,
    )
    assert syntax.returncode == 0, syntax.stderr

    source = _runtime()
    assert 'import * as THREE from "three"' in source
    for retired in (
        "GLTFLoader",
        "MeshoptDecoder",
        "PMREMGenerator",
        "Raycaster",
        "SpotLight",
        "PointLight",
        "DirectionalLight",
        "FieldStationWorld",
        "CatmullRomCurve3",
    ):
        assert retired not in source


def test_production_scene_plate_manifest_and_files_are_integral() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    plates = manifest["scenePlates"]
    assert manifest["format"] == "atlas-world/v2"
    assert manifest["version"] == 2
    assert plates["renderer"] == "depth-parallax-v1"
    assert tuple(plates["order"]) == BEATS
    assert plates["interaction"] == {
        "firstResponseMs": 48,
        "settleMs": 240,
        "maxParallaxPx": {"desktop": 18, "mobile": 10},
        "maxRelightEv": 0.6,
        "transitionMs": 900,
    }
    paths: set[str] = set()
    for variant_name in ("desktop", "mobile"):
        assert set(plates["variants"][variant_name]) == set(BEATS)
        for beat in BEATS:
            pair = plates["variants"][variant_name][beat]
            assert len(pair["focalPoint"]) == 2
            assert all(0 <= value <= 1 for value in pair["focalPoint"])
            assert pair["color"]["width"] == pair["depth"]["width"]
            assert pair["color"]["height"] == pair["depth"]["height"]
            for record in (pair["color"], pair["depth"]):
                assert record["path"] not in paths
                paths.add(record["path"])
                path = ROOT / record["path"]
                data = path.read_bytes()
                assert len(data) == record["bytes"]
                assert hashlib.sha256(data).hexdigest() == record["sha256"]
                assert record["mime"] == "image/webp"
    assert len(paths) == 24


def test_validator_executes_against_real_manifest_and_retains_truth() -> None:
    script = _validator_program(
        """
const contract = validateDocumentaryEvidenceContract(payload, manifest);
if (contract.scenePlates.renderer !== "depth-parallax-v1") {
  throw new Error("scene renderer was not retained");
}
if (contract.response.length !== 6) throw new Error("six responses were not retained");
if (contract.response.filter((item) => item.delta === 0).length !== 4) {
  throw new Error("measured zeros were discarded");
}
if (contract.archive.count !== 126) throw new Error("archive count drifted");
if (contract.scenePlates.order.join(",") !== BEATS.join(",")) {
  throw new Error("chapter order drifted");
}
"""
    )
    result = _run_node(script)
    assert result.returncode == 0, result.stderr


def test_validator_rejects_legacy_schema_and_scene_plate_mutations() -> None:
    script = _validator_program(
        """
function rejects(label, mutate) {
  const candidate = structuredClone(manifest);
  mutate(candidate);
  try {
    validateDocumentaryEvidenceContract(payload, candidate);
  } catch {
    return;
  }
  throw new Error(label + " was accepted");
}
for (const key of RETIRED_WORLD_KEYS) {
  rejects("retired key " + key, (candidate) => { candidate[key] = {}; });
}
rejects("renderer drift", (candidate) => {
  candidate.scenePlates.renderer = "flat-crossfade";
});
rejects("chapter reordering", (candidate) => {
  candidate.scenePlates.order.reverse();
});
rejects("missing mobile beat", (candidate) => {
  delete candidate.scenePlates.variants.mobile.archive;
});
rejects("bad sha", (candidate) => {
  candidate.scenePlates.variants.desktop.control.color.sha256 = "A".repeat(64);
});
rejects("bad byte count", (candidate) => {
  candidate.scenePlates.variants.desktop.control.color.bytes = 0;
});
rejects("bad mime", (candidate) => {
  candidate.scenePlates.variants.desktop.control.depth.mime = "image/png";
});
rejects("unaligned dimensions", (candidate) => {
  candidate.scenePlates.variants.desktop.control.depth.width += 1;
});
rejects("bad focal point", (candidate) => {
  candidate.scenePlates.variants.mobile.control.focalPoint = [1.2, 0.5];
});
rejects("evidence-looking path", (candidate) => {
  candidate.scenePlates.variants.desktop.control.color.path =
    "assets/world-v5/obs_0161.webp";
});
rejects("extra asset field", (candidate) => {
  candidate.scenePlates.variants.desktop.control.color.quality = 99;
});
rejects("depth polarity drift", (candidate) => {
  candidate.scenePlates.depthEncoding.near = 0;
});
rejects("interaction drift", (candidate) => {
  candidate.scenePlates.interaction.maxParallaxPx.desktop = 19;
});
rejects("top-level model key", (candidate) => {
  candidate.model = {};
});
rejects("nested retired fieldStation", (candidate) => {
  candidate.scenePlates.fieldStation = {};
});
rejects("tablet variant", (candidate) => {
  candidate.scenePlates.variants.tablet = structuredClone(
    candidate.scenePlates.variants.mobile,
  );
});
rejects("missing focal point", (candidate) => {
  delete candidate.scenePlates.variants.desktop.control.focalPoint;
});
"""
    )
    result = _run_node(script)
    assert result.returncode == 0, result.stderr


def test_validator_rejects_truncated_payload_response() -> None:
    script = _validator_program(
        """
const truncated = structuredClone(payload);
truncated.analysis.responses.studies[0].components.length = 5;
let rejected = false;
try { validateDocumentaryEvidenceContract(truncated, manifest); } catch { rejected = true; }
if (!rejected) throw new Error("truncated response was accepted");
"""
    )
    result = _run_node(script)
    assert result.returncode == 0, result.stderr


def test_cover_parallax_relight_and_transition_math_execute_at_bounds() -> None:
    source = _runtime()
    math_source = _section(
        source,
        "function cubicBezierProgress",
        "function resolveURL",
    )
    script = (
        math_source
        + """
for (const sample of [
  [1672, 941, 1440, 900, [0.69, 0.43], 18],
  [941, 1672, 390, 844, [0.67, 0.35], 10],
  [853, 1844, 430, 760, [0.67, 0.36], 10],
]) {
  const [iw, ih, vw, vh, focal, maximum] = sample;
  const cover = coverUvTransform(iw, ih, vw, vh, focal, maximum);
  const [sx, sy] = cover.scale;
  const [ox, oy] = cover.offset;
  const shiftX = sx * maximum / vw;
  const shiftY = sy * maximum / vh;
  if (ox - shiftX < -1e-9 || ox + sx + shiftX > 1 + 1e-9) {
    throw new Error("cover exposed a horizontal edge");
  }
  if (oy - shiftY < -1e-9 || oy + sy + shiftY > 1 + 1e-9) {
    throw new Error("cover exposed a vertical edge");
  }
}
const desktop = clampParallaxPixels(18, 18, 18);
const mobile = clampParallaxPixels(10, -10, 10);
if (Math.hypot(...desktop) > 18 + 1e-9) throw new Error("desktop parallax escaped");
if (Math.hypot(...mobile) > 10 + 1e-9) throw new Error("mobile parallax escaped");
const far = clampParallaxPixels(18 * 0, 18 * 0, 18);
if (far[0] !== 0 || far[1] !== 0) throw new Error("far depth moved");
for (const local of [0, 0.25, 1]) {
  for (const rake of [0, 0.5, 1]) {
    for (const presence of [0, 0.4, 1]) {
      const ev = boundedRelightEv(local, rake, presence, 0.6);
      const gain = Math.pow(2, ev);
      if (ev < 0 || ev > 0.6 || gain < 1 || gain > Math.pow(2, 0.6) + 1e-9) {
        throw new Error("relight bound escaped");
      }
    }
  }
}
let previous = -1;
for (let index = 0; index <= 100; index += 1) {
  const progress = index / 100;
  const value = premiumTransitionEase(progress);
  if (value < previous || value < 0 || value > 1) {
    throw new Error("transition is not monotonic");
  }
  previous = value;
}
if (premiumTransitionEase(0) !== 0 || premiumTransitionEase(1) !== 1) {
  throw new Error("transition endpoints are not exact");
}
if (transitionEndpoint(0) !== "current" || transitionEndpoint(1) !== "next") {
  throw new Error("endpoint identity drifted");
}
"""
    )
    result = _run_node(script)
    assert result.returncode == 0, result.stderr


def test_shader_is_depth_aware_cover_safe_and_not_a_flat_fade() -> None:
    source = _runtime()
    shader = _section(source, "const PLATE_FRAGMENT_SHADER", "function resolveURL")
    for contract in (
        "uniform sampler2D uColorCurrent",
        "uniform sampler2D uDepthCurrent",
        "uniform sampler2D uColorNext",
        "uniform sampler2D uDepthNext",
        "boundedParallax((uPointer - 0.5) * 2.0, 1.0)",
        "* inverseDepth",
        "* uMaxParallaxPx",
        "texel * 0.5",
        "vec2(1.0) - texel * 0.5",
        "sobelNormal",
        "gradientX",
        "gradientY",
        "uMaxRelightEv",
        "exp2(max(0.0, liftEv))",
        "opticalWipeMask",
        "depthRidge",
        "uDirection",
        "fwidth(axis)",
    ):
        assert contract in shader
    assert "(inverseDepth - 0.5)" not in shader
    assert "mix(currentColor, nextColor, uTransition)" not in shader
    assert "if (uTransition <= 0.0)" in shader
    assert "if (uTransition >= 1.0)" in shader


def test_scene_uses_one_fullscreen_subdivided_shader_plane() -> None:
    source = _runtime()
    material = _section(source, "  createPlateMaterial()", "  applyPairUniforms(")
    assert "new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)" in source
    assert "new THREE.PlaneGeometry(2, 2, 32, 18)" in material
    assert "new THREE.ShaderMaterial" in material
    assert 'name: "V5_Depth_Parallax_Plate"' in material
    assert "depthTest: false" in material
    assert "depthWrite: false" in material
    assert "toneMapped: false" in material
    assert "this.plane.frustumCulled = false" in material
    assert "THREE.Points" not in source
    assert "PointsMaterial" not in source


def test_loader_verifies_bytes_hash_dimensions_and_flip_alignment() -> None:
    source = _runtime()
    loader = _section(
        source,
        "async function loadScenePlateTexture",
        "class ScenePlateWorld",
    )
    for contract in (
        "signal,",
        'cache: "force-cache"',
        "response.arrayBuffer()",
        "buffer.byteLength !== record.bytes",
        "await sha256Hex(buffer)",
        "digest !== record.sha256.toLowerCase()",
        'imageOrientation: "flipY"',
        'colorSpaceConversion: "none"',
        "bitmap.width !== record.width",
        "bitmap.height !== record.height",
        "texture.flipY = false",
        "THREE.SRGBColorSpace",
        "THREE.NoColorSpace",
        "ownedTextures.add(texture)",
        "bitmap?.close?.()",
    ):
        assert contract in loader


def test_pair_loading_aborts_siblings_and_never_commits_partial_pair() -> None:
    source = _runtime()
    pair = _section(source, "  async loadPlatePair(beat, signal)", "  disposePair(pair)")
    request = _section(source, "  createPairRequest(beat, purpose)", "  ensurePlate(")
    for contract in (
        "new AbortController()",
        "pairController.abort(error)",
        "Promise.allSettled([colorPromise, depthPromise])",
        'item.status === "fulfilled"',
        "if (failed || signal.aborted || this.destroyed)",
        "disposeTexture(texture)",
    ):
        assert contract in pair
    assert "if (this.destroyed || controller.signal.aborted)" in request
    assert "this.disposePair(pair)" in request
    assert "this.plateCache.set(beat, pair)" in request


def test_owned_texture_disposal_closes_shared_bitmap_once() -> None:
    source = _runtime()
    disposal = _section(source, "function textureImageSources(", "function abortError(")
    script = (
        disposal
        + """
let textureDisposals = 0;
let bitmapCloses = 0;
const bitmap = { close() { bitmapCloses += 1; } };
const first = {
  userData: { v5ImageBitmap: bitmap },
  source: { data: bitmap },
  image: bitmap,
  dispose() { textureDisposals += 1; },
};
const second = {
  userData: { v5ImageBitmap: bitmap },
  source: { data: bitmap },
  image: bitmap,
  dispose() { textureDisposals += 1; },
};
disposeOwnedTextures(new Set([first, second]));
if (textureDisposals !== 2 || bitmapCloses !== 1) {
  throw new Error(JSON.stringify({ textureDisposals, bitmapCloses }));
}
"""
    )
    result = _run_node(script)
    assert result.returncode == 0, result.stderr


def test_plate_cache_evicts_distant_pairs_but_never_current_or_next() -> None:
    source = _runtime()
    eviction = _section(source, "function evictPlateCache({", "function transitionEndpoint(")
    disposal = _section(source, "function textureImageSources(", "function abortError(")
    script = (
        'const BEATS = ["control","response","comparison","association","reconstruction","archive"];\n'
        + eviction
        + disposal
        + """
let textureDisposals = 0;
let bitmapCloses = 0;
function makePair(beat) {
  const makeTexture = () => {
    const bitmap = { close() { bitmapCloses += 1; } };
    return {
      userData: { v5ImageBitmap: bitmap },
      image: bitmap,
      dispose() { textureDisposals += 1; },
    };
  };
  return { beat, color: makeTexture(), depth: makeTexture() };
}
const control = makePair("control");
const response = makePair("response");
const comparison = makePair("comparison");
const archive = makePair("archive");
const cache = new Map([
  ["control", control],
  ["response", response],
  ["comparison", comparison],
  ["archive", archive],
]);
const released = [];
const disposePair = (pair) => {
  released.push(pair.beat);
  disposeTexture(pair.color);
  disposeTexture(pair.depth);
};
const first = evictPlateCache({
  cache,
  currentPair: control,
  nextPair: response,
  requestedBeat: "response",
  inflightBeats: [],
  preferredBeat: "response",
  maxPairs: 3,
  disposePair,
});
if (first.join(",") !== "archive") throw new Error("distant pair was not evicted first");
if (!cache.has("control") || !cache.has("response")) {
  throw new Error("current or next pair was evicted");
}
evictPlateCache({
  cache,
  currentPair: control,
  nextPair: response,
  requestedBeat: "response",
  inflightBeats: [],
  preferredBeat: "response",
  maxPairs: 1,
  disposePair,
});
if (!cache.has("control") || !cache.has("response") || cache.size !== 2) {
  throw new Error("protected pairs were evicted to satisfy an impossible cap");
}
if (textureDisposals !== 4 || bitmapCloses !== 4) {
  throw new Error(JSON.stringify({ textureDisposals, bitmapCloses, released }));
}
"""
    )
    result = _run_node(script)
    assert result.returncode == 0, result.stderr

    cache_source = _section(source, "  touchPlate(beat)", "  async preparePlate(beat)")
    assert "maxPairs: 3" in cache_source
    assert "currentPair: this.currentPair" in cache_source
    assert "nextPair: this.nextPair" in cache_source
    assert "disposePair: (pair) => this.disposePair(pair)" in cache_source


def test_pointer_target_commits_in_raw_event_and_stays_within_timing_bounds() -> None:
    source = _runtime()
    pointer = _section(source, "  pointerMove(event, rect)", "  pointerLeave()")
    events = _section(source, "  bindCoreEvents()", "  handleTouchMove(event)")
    assert "const PLATE_POINTER_ATTACK = 0.032;" in source
    assert "const PLATE_POINTER_SETTLE = 0.24;" in source
    assert "const PLATE_FIRST_RESPONSE_MS = 48;" in source
    assert "const PLATE_MAX_RELIGHT_EV = 0.6;" in source
    for contract in (
        "this.pointerTarget.set(",
        "this.pointer.lerp(this.pointerTarget, 0.18)",
        "this.pointerPresenceTarget = 1",
        "this.pointerPresence = Math.max(this.pointerPresence, 0.18)",
        "this.material.uniforms.uPointer.value.copy(this.pointer)",
        "this.material.uniforms.uPointerPresence.value = this.pointerPresence",
        "v5FirstResponseMs = 0",
    ):
        assert contract in pointer
    raw_call = "this.world.pointerMove(event, canvasHost.getBoundingClientRect())"
    assert raw_call in events
    assert "this.pendingPointer = { clientX:" not in events
    assert '"optical-hover"' not in source
    assert "emitHover(" not in source


def test_pointer_damps_at_32ms_attack_and_240ms_release() -> None:
    source = _runtime()
    update = _section(source, "  update(delta)", "  resize(width, height)")
    assert "targetPresence > this.pointerPresence" in update
    assert "PLATE_POINTER_ATTACK" in update
    assert "PLATE_POINTER_SETTLE" in update
    assert "this.pointer.x = damp(" in update
    assert "this.pointerPresence = damp(" in update
    assert "uPointerPresence.value = clamp(this.pointerPresence)" in update


def test_transition_is_900ms_depth_wipe_and_last_requested_beat_wins() -> None:
    source = _runtime()
    request = _section(source, "  requestPlate(beat, immediate = false)", "  beginPlateTransition(")
    transition = _section(source, "  beginPlateTransition(", "  updateTransition(")
    update = _section(source, "  updateTransition(", "  commitHeroEvidenceDOM(")
    assert "const revision = ++this.transitionRevision" in request
    assert "this.abortForegroundLoad(requested)" in request
    assert "revision !== this.transitionRevision" in request
    assert "requested !== this.requestedBeat" in request
    assert "this.beginPlateTransition(requested, pair, immediate)" in request
    assert "this.plateContract.interaction.transitionMs" in transition
    assert "premiumTransitionEase(raw)" in update
    assert 'transitionEndpoint(raw) !== "next"' in update
    assert "this.currentPair = finished.pair" in update
    assert "this.material.uniforms.uTransition.value = 0" in update
    assert 'phase: "optical-wipe"' in source


def test_same_target_scroll_samples_do_not_restart_active_wipe() -> None:
    source = _runtime()
    math_source = _section(source, "function cubicBezierProgress", "function resolveURL")
    methods = _section(
        source,
        "  requestPlate(beat, immediate = false)",
        "  commitHeroEvidenceDOM(state",
    )
    script = (
        'const BEATS = ["control","response","comparison","association","reconstruction","archive"];\n'
        + "let clockNow = 100; const performance = { now: () => clockNow };\n"
        + math_source
        + "class Harness {\n"
        + "constructor() {\n"
        + "  this.destroyed = false; this.transitionRevision = 0;\n"
        + "  this.currentPair = { beat: 'control' }; this.nextPair = this.currentPair;\n"
        + "  this.currentBeat = 'control'; this.requestedBeat = 'control';\n"
        + "  this.transition = null; this.queuedTransition = null; this.reduced = false;\n"
        + "  this.domActive = true; this.root = { dataset: {} };\n"
        + "  this.onRequestFrame = () => {};\n"
        + "  this.plateContract = { interaction: { transitionMs: 900 } };\n"
        + "  this.material = { uniforms: { uTransition: { value: 0 }, uDirection: { value: 1 } } };\n"
        + "  this.plateCache = new Map([['response',{beat:'response'}],['association',{beat:'association'}]]);\n"
        + "}\n"
        + "touchPlate(beat) { return this.plateCache.get(beat) || null; }\n"
        + "abortForegroundLoad() {}\n"
        + "ensurePlate() { throw new Error('unexpected async load'); }\n"
        + "applyPairUniforms() {}\n"
        + "evictDistantPlates() {}\n"
        + "prefetchNeighbors() {}\n"
        + methods
        + "}\n"
        + """
const world = new Harness();
await world.requestPlate("response");
const original = world.transition;
const originalStart = original.startTime;
world.updateTransition(originalStart + 675);
const progressAtThreeQuarters = world.material.uniforms.uTransition.value;
if (!(progressAtThreeQuarters > 0 && progressAtThreeQuarters < 1)) {
  throw new Error("transition did not advance");
}
clockNow = 800;
for (let index = 0; index < 4; index += 1) await world.requestPlate("response");
if (world.transition !== original || world.transition.startTime !== originalStart) {
  throw new Error("same-target scroll sample restarted the transition");
}
if (world.material.uniforms.uTransition.value < progressAtThreeQuarters) {
  throw new Error("same-target request moved progress backwards");
}
await world.requestPlate("association");
if (world.transition !== original || world.queuedTransition?.beat !== "association") {
  throw new Error("different target did not queue transactionally");
}
if (world.material.uniforms.uTransition.value < progressAtThreeQuarters) {
  throw new Error("different target flashed back to the resting plate");
}
clockNow = 1100;
world.updateTransition(originalStart + 900);
if (world.currentBeat !== "response" || world.transition?.beat !== "association") {
  throw new Error("queued last target did not start after the active wipe settled");
}
if (world.transition === original || world.transition.startTime !== clockNow) {
  throw new Error("queued target did not receive a clean transaction");
}
"""
    )
    result = _run_node(script)
    assert result.returncode == 0, result.stderr


def test_control_and_neighbors_follow_bounded_loading_policy() -> None:
    source = _runtime()
    load = _section(source, "  async load(onProgress", "  createPlateMaterial()")
    prefetch = _section(source, "  prefetchNeighbors(beat)", "  async preparePlate(")
    assert 'this.ensurePlate("control", { purpose: "foreground" })' in load
    assert 'this.prefetchNeighbors("control")' in load
    assert "BEATS[index - 1]" in prefetch
    assert "BEATS[index + 1]" in prefetch
    assert "this.ensurePlate(neighbor, { purpose: \"prefetch\" })" in prefetch
    assert "Promise.all(BEATS" not in source


def test_reduced_motion_zeroes_interaction_and_snaps_requested_plate() -> None:
    source = _runtime()
    reduced = _section(source, "  setReducedMotion(value)", "  setArchiveObservation(")
    for contract in (
        "this.pointer.set(0.5, 0.5)",
        "this.pointerTarget.set(0.5, 0.5)",
        "this.pointerPresence = 0",
        "this.pointerPresenceTarget = 0",
        "uPointerPresence.value = 0",
        "this.beginPlateTransition(pending.beat, pending.pair, true)",
        "this.plateCache.get(this.requestedBeat)",
    ):
        assert contract in reduced
    assert 'setCameraAt("control"' not in reduced
    assert "pointerMove" not in reduced


def test_save_data_requests_no_audio_webgl_or_depth_plate() -> None:
    source = _runtime()
    boot = _section(source, "  async boot()", "  async loadManifest()")
    assert "if (this.saveData)" in boot
    assert "this.saveData ? Promise.resolve() : this.loadAudio()" in boot
    assert "if (!hasWebGL2() || this.saveData)" in boot
    assert boot.index("if (!hasWebGL2() || this.saveData)") < boot.index(
        "await this.loadWorld(this.variantName)"
    )
    assert "loadScenePlateTexture" not in boot


def test_first_canvas_frame_is_hidden_until_loaded_and_rendered() -> None:
    source = _runtime()
    renderer = _section(source, "  async createRenderer()", "  async loadWorld(")
    boot = _section(source, "  async boot()", "  async loadManifest()")
    render = _section(source, "  render()", "  destroy()")
    load_world = _section(source, "  async loadWorld(", "  releaseRenderer()")
    assert 'renderer.domElement.style.visibility = "hidden"' in renderer
    assert renderer.index("renderer.setClearColor(0x000000, 0)") < renderer.index(
        "this.viewport.append(renderer.domElement)"
    )
    assert boot.index("this.world.render()") < boot.index(
        'this.root.classList.add("is-chamber-webgl")'
    )
    assert render.index("this.renderer.render(this.scene, this.camera)") < render.index(
        'style.visibility = "visible"'
    )
    assert "await candidate.prime()" in load_world
    assert load_world.index("await candidate.prime()") < load_world.index(
        "candidate.domActive = true"
    )


def test_renderer_is_transparent_bounded_and_context_loss_fails_safe() -> None:
    source = _runtime()
    renderer = _section(source, "  async createRenderer()", "  async loadWorld(")
    resize = _section(source, "  resize(width, height)", "  pointerMove(event, rect)")
    for contract in (
        "alpha: true",
        "renderer.setClearColor(0x000000, 0)",
        "renderer.outputColorSpace = THREE.SRGBColorSpace",
        "renderer.toneMapping = THREE.NoToneMapping",
        'renderer.domElement.style.background = "transparent"',
        '"webglcontextlost"',
        'this.activateFallback("WebGL context lost")',
    ):
        assert contract in renderer
    assert "alpha: false" not in renderer
    assert "MAX_MOBILE_PIXELS" in resize
    assert "MAX_DESKTOP_PIXELS" in resize
    assert "Math.sqrt(cap / cssPixels)" in resize


def test_render_loop_stops_when_idle_and_resumes_on_demand() -> None:
    source = _runtime()
    start = _section(source, "  start()", "  stop()")
    script = (
        """
const document = { hidden: false };
const performance = { now: () => 100 };
const frames = [];
let nextId = 0;
function requestAnimationFrame(callback) { frames.push(callback); return ++nextId; }
function cancelAnimationFrame() {}
class Harness {
  constructor() {
    this.running = false;
    this.destroyed = false;
    this.world = {
      activeChecks: 0,
      updates: 0,
      renders: 0,
      update() { this.updates += 1; },
      render() { this.renders += 1; },
      needsFrame() { return this.activeChecks-- > 0; },
    };
    this.renderer = {};
    this.lastFrame = 0;
    this.elapsed = 0;
    this.raf = 0;
  }
"""
        + start
        + """
}
const director = new Harness();
director.start();
if (frames.length !== 1) throw new Error("idle render was not requested");
frames.shift()(116);
if (director.running || director.raf !== 0 || frames.length !== 0) {
  throw new Error("idle director scheduled another RAF");
}
director.world.activeChecks = 1;
director.start();
frames.shift()(132);
if (!director.running || frames.length !== 1) {
  throw new Error("active motion did not retain RAF");
}
frames.shift()(148);
if (director.running || frames.length !== 0) {
  throw new Error("settled motion did not return to idle");
}
director.start();
if (frames.length !== 1) throw new Error("demand event did not resume rendering");
frames.shift()(164);
if (director.running) throw new Error("reduced/idle frame did not settle");
"""
    )
    result = _run_node(script)
    assert result.returncode == 0, result.stderr

    events = _section(source, "  bindCoreEvents()", "  handleTouchMove(event)")
    measured = _section(source, "  commitMeasuredScene(", "  syncMeasuredFallback(")
    world_update = _section(source, "  update(delta)", "  resize(width, height)")
    shader = _section(source, "const PLATE_FRAGMENT_SHADER", "function resolveURL")
    assert events.count("this.start()") >= 5
    assert "this.start()" in measured
    assert "return this.needsFrame()" in world_update
    assert "if (this.transition) return true" in world_update
    assert "if (this.reduced || !this.material) return false" in world_update
    assert "if (uPointerPresence <= 0.001) return color;" in shader
    assert shader.index("if (uPointerPresence <= 0.001) return color;") < shader.index(
        "sobelNormal(depthMap, uv, texel)"
    )


def test_responsive_swap_preserves_state_and_is_transactional() -> None:
    source = _runtime()
    load = _section(source, "  async loadWorld(", "  releaseRenderer()")
    for contract in (
        "heroState: this.world.heroState",
        "comparisonState: this.world.comparisonState",
        "axisId: this.world.axisId",
        "archiveObservation: this.world.archiveObservation",
        "candidate.setHeroState(liveState.heroState",
        "candidate.setComparison(liveState.comparisonState",
        "candidate.setAxis(liveState.axisId",
        "candidate.setArchiveObservation(liveState.archiveObservation",
        "await candidate.prepareScene(preparedBeat)",
        "await candidate.prime()",
        "candidate.domActive = true",
        "this.world = candidate",
        "previous?.destroy()",
    ):
        assert contract in load
    assert load.index("candidate.domActive = true") < load.index(
        "candidate.commitHeroEvidenceDOM"
    )
    assert load.index("await candidate.prime()") < load.index(
        "candidate.domActive = true"
    )


def test_destroy_aborts_fetches_and_disposes_only_owned_resources() -> None:
    source = _runtime()
    destroy = _section(source, "  destroy()", "class ChamberDirector")
    invalidation = _section(source, "  invalidateWorldLoads()", "  updateLoader(")
    for contract in (
        "if (this.destroyed) return",
        "this.lifecycleController.abort(",
        "request.controller.abort(",
        "this.geometry?.dispose?.()",
        "this.material?.dispose?.()",
        "disposeOwnedTextures(this.ownedTextures)",
        "this.plateCache.clear()",
    ):
        assert contract in destroy
    assert "this.renderer.dispose" not in destroy
    assert "this.loadAbortController.abort()" in invalidation
    assert "pendingWorld.destroy()" in invalidation


def test_semantic_evidence_failure_is_memoized_and_routes_to_fallback() -> None:
    source = _runtime()
    degrade = _section(source, "  degradeEvidence(beat, error)", "  validateDocumentaryNode(")
    prepare = _section(source, "  async prepareSceneEvidence(beat)", "  async prepareScene(beat)")
    events = _section(source, "  bindCoreEvents()", "  handleTouchMove(event)")

    assert "if (this.evidenceFailures.has(beat)) return null" in degrade
    assert "this.evidenceFailures.add(beat)" in degrade
    assert '"atlas:evidence-failure"' in degrade
    assert "if (this.evidenceFailures.has(beat))" in prepare
    assert "this.activateFallback" in events
    assert '"atlas:plate-failure"' in events


def test_documentary_images_must_decode_before_scene_commit() -> None:
    source = _runtime()
    readiness = _section(source, "function abortError(", "async function sha256Hex(")
    script = (
        "const DOCUMENTARY_IMAGE_TIMEOUT_MS = 50;\n"
        + readiness
        + """
const broken = { complete: true, naturalWidth: 0, naturalHeight: 0 };
let rejected = false;
try { await awaitDocumentaryImage(broken, null, 50); } catch { rejected = true; }
if (!rejected) throw new Error("broken complete image was accepted");

let resolveDecode;
const listeners = new Map();
const deferred = {
  complete: false,
  naturalWidth: 0,
  naturalHeight: 0,
  addEventListener(name, callback) { listeners.set(name, callback); },
  removeEventListener(name) { listeners.delete(name); },
  decode() { return new Promise((resolve) => { resolveDecode = resolve; }); },
};
let settled = false;
const pending = awaitDocumentaryImage(deferred, null, 50).then(() => { settled = true; });
await Promise.resolve();
await Promise.resolve();
if (settled) throw new Error("deferred image committed before decode");
deferred.complete = true;
deferred.naturalWidth = 960;
deferred.naturalHeight = 640;
resolveDecode();
await pending;
if (!settled) throw new Error("decoded image did not commit");

const fallbackListeners = new Map();
const failed = {
  complete: false,
  naturalWidth: 0,
  naturalHeight: 0,
  addEventListener(name, callback) { fallbackListeners.set(name, callback); },
  removeEventListener(name) { fallbackListeners.delete(name); },
};
const failure = awaitDocumentaryImage(failed, null, 50).then(
  () => false,
  () => true,
);
fallbackListeners.get("error")();
if (!await failure) throw new Error("image error fallback was accepted");
"""
    )
    result = _run_node(script)
    assert result.returncode == 0, result.stderr

    validation = _section(
        source,
        "  validateDocumentaryNode(node, beat)",
        "  async ensureComparisonEvidence()",
    )
    assert 'image.hasAttribute("data-documentary-evidence")' in validation
    assert "await Promise.all(images.map((image) => awaitDocumentaryImage(" in validation
    assert "this.lifecycleController.signal" in validation
    assert validation.count("this.validateDocumentaryNode(node, beat)") >= 2
    assert "naturalWidth <= 0" in validation
    assert "naturalHeight <= 0" in validation


def test_documentary_hook_retires_old_exact_marker_but_archive_rejects_both() -> None:
    source = _runtime()
    semantic = _section(
        source,
        "  validateDocumentaryNode(node, beat)",
        "  async ensureComparisonEvidence()",
    )
    archive = _section(source, "  async ensureAtlas()", "  async prepareSceneEvidence(beat)")
    assert 'hasAttribute("data-documentary-evidence")' in semantic
    assert 'hasAttribute("data-exact-evidence")' not in semantic
    for forbidden_claim in (
        "[data-exact-evidence]",
        "[data-documentary-evidence]",
        "[data-archive-exact]",
    ):
        assert forbidden_claim in archive


def test_comparison_keeps_both_registered_dom_proofs_visible() -> None:
    source = _runtime()
    evidence = _section(
        source,
        "  async ensureComparisonEvidence()",
        "  async ensureReconstructionEvidence()",
    )
    comparison = _section(source, "  setComparison(state", "  setAxis(")
    assert '"[data-chamber-comparison-fallback] [data-observation-id]"' in evidence
    assert "this.evidenceContract.comparison.map((item) => item.observation)" in evidence
    assert 'layer.removeAttribute("hidden")' in comparison
    assert 'layer.removeAttribute("aria-hidden")' in comparison
    assert 'layer.setAttribute("aria-current", "true")' in comparison
    assert 'layer.hidden = !selected' not in comparison
    assert 'layer.setAttribute("aria-hidden", String(!selected))' not in comparison
    assert source.count('layer.removeAttribute("hidden")') == 2
    assert source.count('layer.removeAttribute("aria-hidden")') == 2


def test_control_dom_truth_commits_synchronously_without_webgl_evidence() -> None:
    source = _runtime()
    dom = _section(source, "function commitHeroEvidenceDOM(", "function hasWebGL2()")
    state = _section(source, "  setHeroState(state", "  setComparison(")
    for contract in (
        "root.dataset.chamberState = state",
        "root.dataset.selectedObservation = observation",
        'button.setAttribute("aria-pressed", String(selected))',
        'link.setAttribute("aria-current", "true")',
    ):
        assert contract in dom
    assert "this.commitHeroEvidenceDOM(state" in state
    assert "texture" not in state.lower()
    assert "material.uniforms" not in state
    assert "requestPlate" not in state


def test_response_keeps_six_explicit_items_including_zeros() -> None:
    source = _runtime()
    validator = _section(
        source,
        "function validateDocumentaryEvidenceContract(payload, manifest)",
        "function vectorName",
    )
    response = _section(source, "  responseComponents()", "  correlationRows(")
    assert "responseTuples.slice(0, RESPONSE_COMPONENT_IDS.length)" in validator
    assert "item[0] !== RESPONSE_COMPONENT_IDS[index]" in validator
    assert "return this.evidenceContract.response" in response
    assert "filter(Boolean)" not in response


def test_association_ledger_uses_five_literal_acos_correlations() -> None:
    source = _runtime()
    rows = _section(source, "  correlationRows(axisId)", "  updateAssociationLedger(")
    ledger = _section(source, "  updateAssociationLedger(", "  async ensureAtlas()")
    assert ".slice(0, 5)" in rows
    assert "Math.acos(clamp(r, -1, 1))" in ledger
    assert "THREE.MathUtils.radToDeg" in ledger
    assert 'row.style.setProperty("--angle"' in ledger


def test_archive_is_registered_preview_with_126_ordered_canonical_links() -> None:
    source = _runtime()
    archive = _section(source, "  async ensureAtlas()", "  async prepareSceneEvidence(beat)")
    assert '[data-archive-preview][data-archive-preview-kind="registered-atlas"]' in archive
    assert "this.evidenceContract.archive.desktopPath" in archive
    assert "this.evidenceContract.archive.mobilePath" in archive
    assert "[data-exact-evidence], [data-documentary-evidence], [data-archive-exact]" in archive
    assert "registered archive preview makes a false exact-image claim" in archive
    assert '"[data-archive-preview-entry][data-observation-id][data-archive-index]"' in archive
    assert "entries.length !== this.archiveEntries.length" in archive
    assert "entry.dataset.observationId !== observationId" in archive
    assert "Number(entry.dataset.archiveIndex) !== index" in archive
    assert 'entry.matches("a[href]")' in archive
    assert "assertSemanticEvidence(" not in archive


def test_archive_hover_maps_to_deterministic_bounded_relight_point() -> None:
    source = _runtime()
    method = _section(source, "  setArchiveObservation(observationId)", "  update(delta)")
    events = _section(source, "  bindCoreEvents()", "  handleTouchMove(event)")
    for contract in (
        "let hash = 0x811c9dc5",
        "hash = Math.imul(hash, 0x01000193) >>> 0",
        "const x = 0.5 + ((hash & 0xffff) / 0xffff - 0.5) * 0.72",
        "const y = 0.5 + (((hash >>> 16) & 0xffff) / 0xffff - 0.5) * 0.72",
        "this.pointerTarget.set(x, 1 - y)",
        "this.pointerPresenceTarget = this.reduced ? 0 : 0.72",
    ):
        assert contract in method
    for event_name in ("pointerover", "pointerout", "focusin", "focusout"):
        assert event_name in events
    assert "[data-archive-preview-entry][data-observation-id]" in events


def test_scene_evidence_prepares_with_plate_without_mutating_dom_proof() -> None:
    source = _runtime()
    prepare = _section(source, "  async prepareScene(beat)", "  setCameraJourney(")
    assert "this.prepareSceneEvidence(beat)" in prepare
    assert "this.preparePlate(beat)" in prepare
    assert "Promise.all" in prepare
    assert "querySelector" not in _section(
        source,
        "  requestPlate(beat, immediate = false)",
        "  beginPlateTransition(",
    )


def test_entry_audio_and_static_fallback_paths_remain_fail_open() -> None:
    source = _runtime()
    enter = _section(source, "  async enter()", "  measureActiveScroll()")
    fallback = _section(source, "  activateFallback(reason)", "  leaveSemanticEdition(reason)")
    assert "Music could not start" in enter
    assert "this.activateFallback" in enter
    assert "this.maybeEnableEntry()" in fallback
    assert 'this.root.classList.add("is-chamber-fallback")' in fallback


def test_chapter_order_and_documentary_prefetch_share_one_truth_contract() -> None:
    source = _runtime()
    beats = re.search(
        r"const BEATS = Object\.freeze\(\[(.*?)\]\);",
        source,
        flags=re.DOTALL,
    )
    assert beats
    assert tuple(re.findall(r'"([a-z]+)"', beats.group(1))) == BEATS
    prepare = _section(source, "  async prepareSceneEvidence(beat)", "  async prepareScene(beat)")
    assert 'beat === "comparison"' in prepare
    assert 'beat === "reconstruction"' in prepare
    assert 'beat === "archive"' in prepare
    load_manifest = _section(source, "  async loadManifest()", "  bootInactive()")
    assert "World chapter order mismatch" in load_manifest


def test_runtime_diff_has_no_whitespace_errors() -> None:
    result = subprocess.run(
        ["git", "diff", "--check", "--", str(RUNTIME_PATH), __file__],
        text=True,
        capture_output=True,
        check=False,
        cwd=ROOT,
    )
    assert result.returncode == 0, result.stdout + result.stderr
