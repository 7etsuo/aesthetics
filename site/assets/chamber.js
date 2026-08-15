// Vendored Three.js 0.164.1 (r164), MIT; see vendor/three.LICENSE.txt.
import * as THREE from "./vendor/three.module.min.js";

/**
 * Atlas Optical Observatory
 *
 * This canvas is deliberately presentational. The readable evidence, controls,
 * and fallbacks remain ordinary HTML. The WebGL layer is a full-viewport optical
 * stage: production artwork, exact generated plates, and geometry derived only
 * from recorded response/correlation values. Nothing here is presented as
 * model-native latent space.
 */

const ROOT_SELECTOR = "[data-chamber]";
const HOST_SELECTOR = "[data-chamber-canvas]";
const DATA_SELECTOR = "#chamber-data";
const SCENES = [
  "origin",
  "response",
  "discriminate",
  "association",
  "reconstruct",
  "archive",
];
const SCENE_LABELS = {
  origin: "Origin",
  response: "Response field",
  discriminate: "Discrimination",
  association: "Association geometry",
  reconstruct: "Reconstruction",
  archive: "Atlas",
};
const LEVELS = ["low", "medium", "high"];
const MAX_OBSERVATIONS = 210;
const STATE_SHUTTER_DURATION_MS = 720;
const MOBILE_RECONSTRUCTION_EXACT_START = 0.3;
const MOBILE_RECONSTRUCTION_RESIDUAL_START = 0.62;
const MOBILE_SCENE_TRANSITION_START = 0.86;
const MOBILE_SCENE_TRANSITION_END = 0.985;
const OPTICAL_PROBE_FOLLOW_RATE = 13.5;
const OPTICAL_PROBE_RELEASE_RATE = 6.4;
const RECONSTRUCTION_PROBE_FOLLOW_RATE = 22;
const RECONSTRUCTION_PROBE_RELEASE_RATE = 8.2;
const OPTICAL_HOVER_COOLDOWN_MS = 180;
const OBSERVATORY_ART = Object.freeze({
  desktop: Object.freeze({
    color: "assets/art/optical-observatory-wide.webp",
    room: "assets/art/optical-observatory-room-wide.webp",
    instrument: "assets/art/optical-observatory-instrument-wide.webp",
    depth: "assets/art/optical-observatory-wide-depth.webp",
    size: Object.freeze([1672, 941]),
    // Image-space measurement of the generated apparatus lens.
    portal: Object.freeze([0.681, 0.447, 0.203]),
  }),
  mobile: Object.freeze({
    color: "assets/art/optical-observatory-mobile.webp",
    room: "assets/art/optical-observatory-room-mobile.webp",
    instrument: "assets/art/optical-observatory-instrument-mobile.webp",
    depth: "assets/art/optical-observatory-mobile-depth.webp",
    size: Object.freeze([941, 1672]),
    portal: Object.freeze([0.663, 0.375, 0.198]),
  }),
});
const OBSERVATORY_SHOTS = Object.freeze({
  desktop: Object.freeze([
    Object.freeze({ center: Object.freeze([0.5, 0.5]), zoom: 1 }),
    Object.freeze({ center: Object.freeze([0.56, 0.48]), zoom: 1.08 }),
    Object.freeze({ center: Object.freeze([0.63, 0.46]), zoom: 1.24 }),
    Object.freeze({ center: Object.freeze([0.57, 0.46]), zoom: 1.12 }),
    Object.freeze({ center: Object.freeze([0.6, 0.49]), zoom: 1.18 }),
    Object.freeze({ center: Object.freeze([0.53, 0.5]), zoom: 1.02 }),
  ]),
  mobile: Object.freeze([
    Object.freeze({ center: Object.freeze([0.5, 0.5]), zoom: 1 }),
    Object.freeze({ center: Object.freeze([0.61, 0.42]), zoom: 1.13 }),
    Object.freeze({ center: Object.freeze([0.65, 0.39]), zoom: 1.28 }),
    Object.freeze({ center: Object.freeze([0.63, 0.42]), zoom: 1.17 }),
    Object.freeze({ center: Object.freeze([0.63, 0.43]), zoom: 1.21 }),
    Object.freeze({ center: Object.freeze([0.6, 0.44]), zoom: 1.08 }),
  ]),
});
const fallbackSceneRoots = new WeakSet();
let eventSequence = 0;
const PALETTE = {
  black: 0x070808,
  register: 0xc8c3b7,
  quiet: 0x5d605d,
  paper: 0xe5e0d5,
  warm: 0xc59b72,
  halation: 0xb24c40,
  cool: 0x74828a,
};

const root = document.querySelector(ROOT_SELECTOR);
const host = root?.querySelector(HOST_SELECTOR) ?? document.querySelector(HOST_SELECTOR);

if (root && host) {
  void boot(root, host);
}

async function boot(chamberRoot, canvasHost) {
  const payload = readPayload();
  const model = normalizePayload(payload);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(pointer: coarse)");
  const performanceProfile = getPerformanceProfile(coarsePointer.matches);
  const controls = createSemanticControls(chamberRoot, model);
  const pendingEntry = chamberRoot.querySelector(
    "[data-chamber-entry] [data-enter], [data-chamber-entry] [data-enter-sound]",
  );
  if (pendingEntry && "disabled" in pendingEntry) pendingEntry.disabled = true;

  chamberRoot.classList.add("is-chamber-loading");
  chamberRoot.dataset.chamberStatus = "loading";
  chamberRoot.dataset.ready = "false";
  chamberRoot.dataset.failed = "false";

  // Audio owns its own consent gate and listens to the document-level events
  // emitted below. A missing or blocked audio module must never block the page.
  const audioReady = import("./chamber-audio.js")
    .then((module) => {
      if (typeof module.createAtlasAudio === "function") {
        return module.createAtlasAudio(chamberRoot);
      }
      return null;
    })
    .catch(() => null);
  // The entry becomes actionable only after the audio listener exists. This
  // preserves the trusted click required by media autoplay policy without
  // allowing an unavailable audio module to block access to the atlas.
  void audioReady.then(() => bindEntryGate(chamberRoot, reducedMotion));

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: performanceProfile.antialias,
      // Every observatory layer is explicitly ordered and opts out of depth
      // reads/writes. Do not allocate a full-size depth attachment that can
      // never affect the authored composition.
      depth: false,
      powerPreference: performanceProfile.powerPreference,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      stencil: false,
    });
  } catch (error) {
    controls.activateFallback("webgl-unavailable");
    bindFallbackSceneTracking(chamberRoot);
    return;
  }

  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.setAttribute("role", "presentation");
  canvas.tabIndex = -1;
  canvas.dataset.chamberRenderer = "three-r164";
  canvas.dataset.observationCount = String(model.count);
  chamberRoot.dataset.chamberObservationCount = String(model.count);
  canvasHost.append(canvas);

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setClearColor(PALETTE.black, 1);
  renderer.setPixelRatio(
    backingPixelRatio(
      canvasHost.clientWidth || window.innerWidth,
      canvasHost.clientHeight || window.innerHeight,
      performanceProfile,
    ),
  );
  renderer.shadowMap.enabled = false;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PALETTE.black);

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 4);
  camera.position.z = 1;
  const engine = createEngine({
    camera,
    chamberRoot,
    controls,
    model,
    reducedMotion,
    renderer,
    performanceProfile,
    scene,
  });

  let resizeObserver = null;
  let readyTimer = 0;
  let entryCommitHandler = null;
  const handleContextLost = (event) => {
    event.preventDefault();
    engine.destroy("webgl-context-lost");
    controls.activateFallback("webgl-context-lost");
  };
  const resize = () => engine.resize(canvasHost.clientWidth, canvasHost.clientHeight);
  const handlePageHide = (event) => {
    if (event.persisted) {
      engine.stop();
      return;
    }
    engine.destroy("pagehide");
  };
  const handlePageShow = (event) => {
    if (!event.persisted || engine.destroyed) return;
    resize();
    engine.start();
  };
  canvas.addEventListener("webglcontextlost", handleContextLost, false);
  resizeObserver = typeof ResizeObserver === "function" ? new ResizeObserver(resize) : null;
  resizeObserver?.observe(canvasHost);
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pagehide", handlePageHide);
  window.addEventListener("pageshow", handlePageShow);
  engine.addCleanup(() => {
    resizeObserver?.disconnect();
    canvas.removeEventListener("webglcontextlost", handleContextLost, false);
    window.removeEventListener("resize", resize);
    window.removeEventListener("pagehide", handlePageHide);
    window.removeEventListener("pageshow", handlePageShow);
    if (entryCommitHandler) document.removeEventListener("atlas:commit", entryCommitHandler);
    window.clearTimeout(readyTimer);
  });
  resize();

  engine.bind();
  engine.start();

  // The first visible plate is loaded before the lower-priority evidence plates.
  // A state change swaps the shader's exact texture sampler only while the iris
  // is fully closed, so there is no interpolated image state between outputs.
  const initialPlateReady = await engine.loadInitialPlate();
  if (!initialPlateReady) {
    if (engine.destroyed) return;
    chamberRoot.classList.add("has-chamber-image-error");
    engine.destroy("hero-image-unavailable");
    controls.activateFallback("hero-image-unavailable");
    return;
  }

  chamberRoot.dataset.chamberLoadPhase = "deferred";

  if (!engine.renderCommitFrame()) {
    engine.destroy("webgl-render-failed");
    controls.activateFallback("webgl-render-failed");
    return;
  }

  chamberRoot.classList.remove("is-chamber-loading", "is-chamber-fallback");
  chamberRoot.classList.add("is-chamber-webgl", "is-chamber-ready");
  chamberRoot.dataset.chamberStatus = "ready";
  chamberRoot.dataset.ready = "true";
  chamberRoot.dataset.failed = "false";
  controls.setCanvasReady(true);

  await audioReady;
  if (engine.destroyed) return;
  emit("atlas:scene", {
    id: engine.activeScene,
    scene: engine.activeScene,
    previous: null,
    index: SCENES.indexOf(engine.activeScene),
    progress: 0,
    velocity: 0,
    source: "initial",
  });

  const commitDelay = reducedMotion.matches ? 0 : 640;
  readyTimer = window.setTimeout(() => {
    if (engine.destroyed) return;
    emit("atlas:commit", {
      kind: "ready",
      scene: engine.activeScene,
      state: controls.state,
      observationId: controls.activeLevel?.observationId ?? "",
    });
  }, commitDelay);

  const entry = chamberRoot.querySelector("[data-chamber-entry]");
  let deferredStarted = false;
  const beginDeferredLoading = () => {
    if (deferredStarted || engine.destroyed) return;
    deferredStarted = true;
    chamberRoot.dataset.chamberLoadPhase = "evidence";
    engine.loadDeferredPlates();
  };
  if (!entry || entry.dataset.entryState === "dismissed") {
    beginDeferredLoading();
  } else {
    entryCommitHandler = (event) => {
      if (event.detail?.kind !== "entry" || event.detail?.phase !== "commit") return;
      document.removeEventListener("atlas:commit", entryCommitHandler);
      entryCommitHandler = null;
      beginDeferredLoading();
    };
    document.addEventListener("atlas:commit", entryCommitHandler);
  }
}

function readPayload() {
  const node = document.querySelector(DATA_SELECTOR);
  if (!node) return {};
  try {
    const value = JSON.parse(node.textContent || "{}");
    return isRecord(value) ? value : {};
  } catch (_error) {
    return {};
  }
}

function normalizePayload(payload) {
  const fieldSource = isRecord(payload.field) ? payload.field : {};
  const observations = normalizeObservations(
    fieldSource.observations ?? payload.observations,
  );
  const observationsById = new Map(observations.map((item) => [item.id, item]));
  const heroSource = isRecord(payload.hero) ? payload.hero : {};
  const payloadHeroLevels = LEVELS.map((state) => {
    const source = asArray(heroSource.levels).find(
      (item) => levelName(item) === state,
    );
    return resolvePlate(normalizePlate(source, state), observationsById);
  }).filter(Boolean);

  // The payload owns the hero study. This deliberately does not pin observation
  // IDs: a rebuilt atlas can change the controlled study without changing the
  // visual runtime.
  const heroLevels = payloadHeroLevels;

  const analysis = isRecord(payload.analysis) ? payload.analysis : {};
  const responseSource = isRecord(analysis.responses)
    ? analysis.responses.studies
    : payload.responses;
  const studyById = new Map(
    asArray(payload.studies).map((study) => [firstString(study?.study_id, study?.id), study]),
  );
  const responses = asArray(responseSource)
    .map(normalizeResponse)
    .map((response) => {
      const study = studyById.get(firstString(response.source?.study_id, response.source?.id));
      const levels = asArray(study?.levels)
        .map((item) => resolvePlate(normalizePlate(item), observationsById))
        .filter(Boolean);
      return levels.length ? { ...response, architectureLevels: levels } : response;
    })
    .filter((item) => item.vectorId);
  const correlationSource = isRecord(analysis.correlations)
    ? analysis.correlations.pairs
    : payload.correlations;
  const correlationCohort = isRecord(analysis.correlations)
    ? finiteNumber(analysis.correlations.observation_count)
    : NaN;
  const correlations = asArray(correlationSource)
    .map(normalizeCorrelation)
    .map((item) => ({
      ...item,
      n: Number.isFinite(item.n) ? item.n : correlationCohort,
    }))
    .filter((item) => item.a && item.b && Number.isFinite(item.r));
  const reconstructionSource = isRecord(payload.reconstruction)
    ? payload.reconstruction
    : {};
  let reconstructionPlates = asArray(
    reconstructionSource.selected_plates ??
      reconstructionSource.plates ??
      reconstructionSource.images,
  )
    .map((item) => resolvePlate(normalizePlate(item), observationsById))
    .filter(Boolean);
  if (!reconstructionPlates.length) {
    reconstructionPlates = observations
      .filter(
        (item) =>
          item.imageUrl &&
          item.studyId.includes("reconstruction") &&
          ["anchor_object", "anchor_landscape"].includes(item.anchorId),
      )
      .slice(0, 2)
      .map(observationPlate);
  }
  const comparison = normalizeComparison(payload.comparison, responses, observationsById);
  const weights = asArray(reconstructionSource.weights)
    .map((item) => ({
      vectorId: firstString(item?.vector_id, item?.vectorId, item?.id),
      weight: finiteNumber(item?.weight),
    }))
    .filter((item) => item.vectorId && Number.isFinite(item.weight));
  const residuals = asArray(
    reconstructionSource.residual_counts ?? reconstructionSource.residualCounts,
  )
    .map((item) => ({
      vectorId: firstString(item?.vector_id, item?.vectorId, item?.id),
      name: firstString(item?.name, item?.label, item?.vector_id, item?.vectorId),
      count: finiteNumber(item?.count),
      n: finiteNumber(item?.n),
    }))
    .filter(
      (item) =>
        item.vectorId &&
        Number.isFinite(item.count) &&
        Number.isFinite(item.n) &&
        item.count >= 0 &&
        item.n > 0,
    );

  return {
    raw: payload,
    atlas: normalizeAtlas(fieldSource.atlas),
    hero: {
      vectorId: firstString(heroSource.vector_id, heroSource.vectorId, "vec_halation"),
      levels: heroLevels,
    },
    studies: asArray(payload.studies)
      .map((study, index) => ({
        id: firstString(study?.study_id, study?.id, `study_${index + 1}`),
        vectorId: firstString(study?.vector_id, study?.vectorId),
        anchorId: firstString(study?.anchor_id, study?.anchorId),
        index,
        source: study,
      }))
      .filter((study) => study.id),
    responses,
    correlations,
    comparison,
    reconstruction: {
      plates: reconstructionPlates,
      residuals,
      weights,
    },
    observations,
    count: observations.length,
  };
}

function normalizePlate(source, state = "") {
  if (!isRecord(source)) return null;
  const canonicalImageUrl = normalizeAssetUrl(
    firstString(
      source.image_url,
      source.imageUrl,
      source.image_path,
      source.imagePath,
      source.src,
      source.url,
      source.image,
    ),
  );
  const observationId = firstString(
    source.observation_id,
    source.observationId,
    source.id,
  );
  const { imageUrl, compactImageUrl, fallbackImageUrl } = preferredMediaUrls(
    observationId,
    canonicalImageUrl,
  );
  if (!imageUrl && !observationId) return null;
  return {
    imageUrl,
    compactImageUrl,
    fallbackImageUrl,
    observationId,
    state: levelName(source) || state,
    scores: scoreMap(source.scores ?? source.values),
    scoreConfidence: confidenceMap(source.scores),
    source,
  };
}

function normalizeResponse(source) {
  if (!isRecord(source)) return { vectorId: "", name: "", deltas: [] };
  const deltas = asArray(
    source.mean_response_delta ??
      source.meanResponseDelta ??
      source.deltas ??
      source.values ??
      source.components,
  )
    .map((item) =>
      Array.isArray(item)
        ? {
            vectorId: firstString(item[0]),
            name: firstString(item[0]),
            value: finiteNumber(item[1]),
            n: firstFinite(item[2], source.n_pairs),
          }
        : {
            vectorId: firstString(item?.vector_id, item?.vectorId, item?.id),
            name: firstString(item?.name, item?.label, item?.vector_id),
            value: firstFinite(item?.value, item?.delta, item?.mean),
            n: firstFinite(item?.n_pairs, item?.n, source.n_pairs),
          },
    )
    .filter((item) => item.vectorId && Number.isFinite(item.value));
  return {
    vectorId: firstString(source.vector_id, source.vectorId, source.id),
    name: firstString(source.name, source.label, source.vector_id),
    deltas,
    architectureLevels: asArray(
      source.architecture_levels ?? source.architectureLevels ?? source.levels,
    )
      .map((item) => normalizePlate(item))
      .filter(Boolean),
    source,
  };
}

function normalizeCorrelation(source) {
  if (Array.isArray(source)) {
    return {
      a: firstString(source[0]),
      b: firstString(source[1]),
      aName: firstString(source[0]),
      bName: firstString(source[1]),
      r: finiteNumber(source[2]),
      n: finiteNumber(source[3]),
    };
  }
  if (!isRecord(source)) return { a: "", b: "", r: NaN, n: NaN };
  return {
    a: firstString(source.a, source.vector_a, source.vectorA),
    b: firstString(source.b, source.vector_b, source.vectorB),
    aName: firstString(source.a_name, source.aName, source.a),
    bName: firstString(source.b_name, source.bName, source.b),
    r: firstFinite(source.r, source.value, source.correlation),
    n: firstFinite(source.n, source.count),
  };
}

function normalizeComparison(source, responses, observationsById) {
  const record = isRecord(source) ? source : {};
  const array = Array.isArray(source)
    ? source
    : asArray(record.items ?? record.plates ?? record.images ?? record.outputs);
  const byKey = new Map();

  for (const key of ["halation", "bloom", "highlight_bloom"]) {
    const plate = resolvePlate(
      normalizePlate(record[key], key === "highlight_bloom" ? "bloom" : key),
      observationsById,
    );
    if (plate) byKey.set(plate.state || key, plate);
  }
  for (const item of array) {
    const key = firstString(
      item?.key,
      item?.kind,
      item?.state,
      item?.vector_id,
      item?.vectorId,
      item?.label,
    );
    const normalizedKey = key.includes("bloom") ? "bloom" : key.includes("halation") ? "halation" : key;
    const plate = resolvePlate(normalizePlate(item, normalizedKey), observationsById);
    if (plate && normalizedKey) byKey.set(normalizedKey, plate);
  }

  // Existing explorer payloads carry the two exact high plates inside their
  // response studies, so the chamber remains backwards-compatible.
  for (const response of responses) {
    const key = response.vectorId.includes("highlight_bloom")
      ? "bloom"
      : response.vectorId.includes("halation")
        ? "halation"
        : "";
    if (!key || byKey.has(key)) continue;
    const high = response.architectureLevels.find((plate) => plate.state === "high");
    if (high) byKey.set(key, { ...high, state: key });
  }

  return {
    halation: byKey.get("halation") ?? null,
    bloom: byKey.get("bloom") ?? byKey.get("highlight_bloom") ?? null,
  };
}

function normalizeObservations(source) {
  const observations = asArray(source)
    .slice(0, MAX_OBSERVATIONS)
    .map((item, index) => normalizeObservation(item, index));
  // Never fabricate observations to satisfy a headline count. The rendered
  // engine is a view of the concrete field array and nothing else.
  return observations.slice(0, MAX_OBSERVATIONS);
}

function normalizeAtlas(source) {
  if (!isRecord(source)) return null;
  const columns = clampInteger(firstFinite(source.columns, 1), 1, 64);
  const rows = clampInteger(firstFinite(source.rows, 1), 1, 64);
  const normalizeGeometry = (geometrySource, fallbackSize = 1) => {
    const geometry = isRecord(geometrySource) ? geometrySource : {};
    const width = clampInteger(
      firstFinite(geometry.width, source.canvas_size, source.canvasSize, fallbackSize),
      1,
      16384,
    );
    const height = clampInteger(
      firstFinite(geometry.height, source.canvas_size, source.canvasSize, width),
      1,
      16384,
    );
    const cellSize = clampInteger(
      firstFinite(
        geometry.cell_size,
        geometry.cellSize,
        source.tile_size,
        source.tileSize,
        Math.min(width / columns, height / rows),
      ),
      1,
      Math.min(width, height),
    );
    return {
      cellSize,
      gutter: clampInteger(firstFinite(geometry.gutter, 0), 0, cellSize),
      height,
      offsetX: clampInteger(firstFinite(geometry.offset_x, geometry.offsetX, 0), 0, width),
      offsetY: clampInteger(firstFinite(geometry.offset_y, geometry.offsetY, 0), 0, height),
      width,
    };
  };
  const desktop = normalizeGeometry(source.desktop, 2048);
  const mobile = normalizeGeometry(source.mobile, 1024);
  const entries = new Map();
  if (isRecord(source.entries)) {
    for (const [id, rawIndex] of Object.entries(source.entries)) {
      const index = finiteNumber(rawIndex);
      if (!id || !Number.isInteger(index) || index < 0 || index >= columns * rows) continue;
      entries.set(id, index);
    }
  }
  const desktopUrl = normalizeAssetUrl(
    firstString(source.desktop_path, source.desktopPath, source.path, source.image_path),
  );
  const mobileUrl = normalizeAssetUrl(
    firstString(source.mobile_path, source.mobilePath, source.desktop_path, source.desktopPath),
  );
  if ((!desktopUrl && !mobileUrl) || !entries.size) return null;
  return { columns, desktop, desktopUrl, entries, mobile, mobileUrl, rows };
}

function normalizeObservation(source, index) {
  const record = isRecord(source) ? source : {};
  const id = firstString(
    record.observation_id,
    record.observationId,
    record.id,
    `obs_${String(index + 1).padStart(4, "0")}`,
  );
  const canonicalImageUrl = normalizeAssetUrl(
    firstString(record.image_url, record.image_path, record.image, record.src),
  );
  const { imageUrl, compactImageUrl, fallbackImageUrl } = preferredMediaUrls(
    id,
    canonicalImageUrl,
  );
  return {
    id,
    index,
    scores: scoreMap(record.scores ?? record.values ?? record.score),
    confidence: confidenceMap(record.scores),
    imageUrl,
    compactImageUrl,
    fallbackImageUrl,
    reconstructionScore: firstFinite(
      record.reconstruction_score,
      record.reconstructionScore,
    ),
    studyId: firstString(record.study_id, record.studyId),
    anchorId: firstString(record.anchor_id, record.anchorId),
    vectorId: firstString(record.vector_id, record.vectorId),
    requestedLevel: normalizeLevel(
      firstString(record.requested_level, record.requestedLevel, record.level),
    ),
    source: record,
  };
}

function resolvePlate(plate, observationsById) {
  if (!plate) return null;
  const observation = observationsById.get(plate.observationId);
  if (!observation) return plate.imageUrl ? plate : null;
  return {
    ...plate,
    imageUrl: plate.imageUrl || observation.imageUrl,
    compactImageUrl: plate.compactImageUrl || observation.compactImageUrl,
    fallbackImageUrl: plate.fallbackImageUrl || observation.fallbackImageUrl || "",
    scores: plate.scores.size ? plate.scores : observation.scores,
    scoreConfidence: plate.scoreConfidence.size
      ? plate.scoreConfidence
      : observation.confidence,
  };
}

function observationPlate(observation) {
  return {
    imageUrl: observation.imageUrl,
    compactImageUrl: observation.compactImageUrl,
    fallbackImageUrl: observation.fallbackImageUrl,
    observationId: observation.id,
    state: observation.requestedLevel,
    scores: observation.scores,
    scoreConfidence: observation.confidence,
    source: observation.source,
  };
}

function createSemanticControls(chamberRoot, model) {
  const stateControls = [...chamberRoot.querySelectorAll("[data-chamber-state]")];
  const compareControls = [...chamberRoot.querySelectorAll("[data-chamber-compare]")];
  const axisControls = [...chamberRoot.querySelectorAll("[data-chamber-axis]")];
  const fallbackLayers = [
    ...chamberRoot.querySelectorAll("[data-chamber-fallback-layer][data-state]"),
  ];
  const compareFallbackLayers = [
    ...chamberRoot.querySelectorAll(
      "[data-chamber-compare-layer], [data-chamber-comparison-layer]",
    ),
  ];
  const comparisonFallback = chamberRoot.querySelector(
    "[data-chamber-comparison-fallback]",
  );
  const comparisonFallbackImages = comparisonFallback
    ? [...comparisonFallback.querySelectorAll("img")]
    : [];
  const associationLedger = chamberRoot.querySelector(
    '[data-world-ledger="association"]',
  );
  const associationTable = associationLedger?.querySelector("table") ?? null;
  const associationCaption = associationLedger?.querySelector("figcaption span") ?? null;
  const associationCount = associationLedger?.querySelector("figcaption b") ?? null;
  const associationTableCaption = associationLedger?.querySelector("table caption") ?? null;
  const associationRows = associationLedger?.querySelector("tbody") ?? null;
  const responseLedger = chamberRoot.querySelector('[data-world-ledger="response"]');
  const responseList = responseLedger?.querySelector("ol") ?? null;
  const responseNote = responseLedger?.querySelector(".evidence-note") ?? null;
  const responseCaption = responseLedger?.querySelector("figcaption span") ?? null;
  const responseCount = responseLedger?.querySelector("figcaption b") ?? null;
  const responseCaptionOriginal = responseCaption?.textContent ?? "Mean high − low";
  const responseCountOriginal = responseCount?.textContent ?? "";
  const initialControl = stateControls.find((control) =>
    control.matches(":checked, [aria-pressed='true'], .is-active"),
  );
  let state = normalizeLevel(controlValue(initialControl)) ||
    normalizeLevel(chamberRoot.dataset.chamberState) ||
    (model.hero.levels.some((item) => item.state === "high") ? "high" : model.hero.levels[0]?.state) ||
    "high";
  let comparison = normalizeCompare(
    controlValue(
      compareControls.find((control) =>
        control.matches(":checked, [aria-pressed='true'], .is-active"),
      ),
    ),
  ) || "halation";
  let axis = firstString(
    controlValue(
      axisControls.find((control) =>
        control.matches(":checked, [aria-pressed='true'], .is-active"),
      ),
    ),
    chamberRoot.dataset.chamberAxis,
    model.hero.vectorId,
    model.responses[0]?.vectorId,
  );
  let stateHandler = () => {};
  let compareHandler = () => {};
  let axisHandler = () => {};
  let canvasReady = false;

  const activeLevel = () =>
    model.hero.levels.find((item) => item.state === state) ?? null;

  const updateStateDOM = () => {
    chamberRoot.dataset.chamberState = state;
    for (const control of stateControls) {
      const active = normalizeLevel(controlValue(control)) === state;
      setControlActive(control, active);
    }
    for (const layer of fallbackLayers) {
      const active = normalizeLevel(layer.dataset.state) === state;
      layer.classList.toggle("is-active", active);
      layer.setAttribute("aria-hidden", active ? "false" : "true");
    }
    const plate = activeLevel();
    for (const node of chamberRoot.querySelectorAll("[data-chamber-observation]")) {
      node.textContent = plate?.observationId || "unavailable";
    }
    for (const node of chamberRoot.querySelectorAll("[data-chamber-level]")) {
      node.textContent = state;
    }
    updateScoreDOM(chamberRoot, plate, model.hero.vectorId);
  };

  const updateCompareDOM = () => {
    chamberRoot.dataset.chamberCompare = comparison;
    for (const control of compareControls) {
      setControlActive(control, normalizeCompare(controlValue(control)) === comparison);
    }
    for (const layer of compareFallbackLayers) {
      const key = normalizeCompare(
        firstString(
          layer.dataset.chamberCompareLayer,
          layer.dataset.chamberComparisonLayer,
          layer.dataset.compare,
        ),
      );
      const active = key === comparison;
      layer.classList.toggle("is-active", active);
      layer.setAttribute("aria-hidden", active ? "false" : "true");
    }
    comparisonFallbackImages.forEach((image, index) => {
      const inferred = index === 0 ? "halation" : "bloom";
      const key = normalizeCompare(
        firstString(image.dataset.chamberCompare, image.dataset.compare, inferred),
      );
      const active = key === comparison;
      image.hidden = !active;
      image.style.clipPath = active ? "none" : "";
      image.setAttribute("aria-hidden", active ? "false" : "true");
    });
  };

  const updateAxisDOM = () => {
    chamberRoot.dataset.chamberAxis = axis;
    for (const control of axisControls) {
      setControlActive(control, controlValue(control) === axis);
    }
    const relationships = model.correlations
      .filter((item) => item.a === axis || item.b === axis)
      .sort((left, right) => Math.abs(right.r) - Math.abs(left.r))
      .slice(0, 5);
    const vectorRecord = isRecord(model.raw?.vectors) ? model.raw.vectors[axis] : null;
    const axisName = firstString(vectorRecord?.name, vectorRecord?.label, axis)
      .replace(/^vec_/, "")
      .replaceAll("_", " ");
    const cohort = relationships.find((item) => Number.isFinite(item.n))?.n;
    const strongest = relationships[0] ?? null;
    const strongestId = strongest
      ? strongest.a === axis ? strongest.b : strongest.a
      : "";
    const strongestRecord = strongestId && isRecord(model.raw?.vectors)
      ? model.raw.vectors[strongestId]
      : null;
    const strongestName = firstString(
      strongestRecord?.name,
      strongestRecord?.label,
      strongestId,
    )
      .replace(/^vec_/, "")
      .replaceAll("_", " ");
    const strongestTheta = strongest
      ? Math.acos(clamp(strongest.r, -1, 1)) * (180 / Math.PI)
      : NaN;
    if (associationCaption) {
      associationCaption.textContent = canvasReady && strongest
        ? `${strongestName} · ${strongest.r >= 0 ? "+" : ""}${strongest.r.toFixed(2)} · ${strongestTheta.toFixed(0)}°`
        : `r = cos θ · ${axisName}`;
    }
    if (associationCount) {
      const n = Number.isFinite(cohort) ? `n=${cohort}` : "n=—";
      associationCount.textContent = canvasReady ? `r = cos θ · ${n}` : n;
    }
    if (associationTableCaption) {
      associationTableCaption.textContent = `Strongest recorded relationships to ${axisName}`;
    }
    if (associationRows) {
      const fragment = document.createDocumentFragment();
      relationships.forEach((item, index) => {
        const otherId = item.a === axis ? item.b : item.a;
        const otherRecord = isRecord(model.raw?.vectors) ? model.raw.vectors[otherId] : null;
        const otherName = firstString(otherRecord?.name, otherRecord?.label, otherId)
          .replace(/^vec_/, "")
          .replaceAll("_", " ");
        const theta = Math.acos(clamp(item.r, -1, 1)) * (180 / Math.PI);
        const row = document.createElement("tr");
        row.dataset.chamberAxisRow = String(index);
        row.dataset.sign = item.r < 0 ? "negative" : "positive";
        row.style.setProperty("--angle", `${theta.toFixed(1)}deg`);
        const name = document.createElement("th");
        name.scope = "row";
        const mark = document.createElement("i");
        mark.setAttribute("aria-hidden", "true");
        name.append(mark, document.createTextNode(otherName));
        const correlation = document.createElement("td");
        correlation.textContent = `${item.r >= 0 ? "+" : ""}${item.r.toFixed(2)}`;
        const angle = document.createElement("td");
        angle.textContent = `${theta.toFixed(0)}°`;
        row.append(name, correlation, angle);
        fragment.append(row);
      });
      associationRows.replaceChildren(fragment);
    }
  };

  const setInstrumentLedgerMode = (enabled) => {
    responseList?.classList.toggle("sr-only", enabled);
    responseNote?.classList.toggle("sr-only", enabled);
    associationTable?.classList.toggle("sr-only", enabled);
    if (responseCaption) {
      const response = findResponse(model.responses, model.hero.vectorId);
      const strongest = [...(response?.deltas ?? [])]
        .filter((item) => Number.isFinite(item.value))
        .sort((left, right) => Math.abs(right.value) - Math.abs(left.value))[0];
      const strongestRecord = strongest && isRecord(model.raw?.vectors)
        ? model.raw.vectors[strongest.vectorId]
        : null;
      const strongestName = firstString(
        strongestRecord?.name,
        strongestRecord?.label,
        strongest?.name,
        strongest?.vectorId,
      )
        .replace(/^vec_/, "")
        .replaceAll("_", " ");
      responseCaption.textContent = enabled && strongest
        ? `${strongestName} ${strongest.value >= 0 ? "+" : ""}${strongest.value.toFixed(2)}`
        : responseCaptionOriginal;
      if (responseCount) {
        responseCount.textContent = enabled && strongest
          ? `mean high − low · ${Number.isFinite(strongest.n) ? strongest.n : "—"} paired`
          : responseCountOriginal;
      }
    }
    updateAxisDOM();
  };

  const selectState = (nextState, source = "control", force = false) => {
    const normalized = normalizeLevel(nextState);
    if (!normalized || !model.hero.levels.some((item) => item.state === normalized)) return;
    const previous = state;
    state = normalized;
    updateStateDOM();
    stateHandler(state, previous);
    if (!force && state === previous) return;
    const plate = activeLevel();
    emit("atlas:state", {
      state,
      index: LEVELS.indexOf(state),
      previous,
      source,
      observationId: plate?.observationId ?? "",
      exact: true,
    });
    emit("atlas:commit", {
      kind: "state",
      state,
      observationId: plate?.observationId ?? "",
      exact: true,
    });
  };

  const selectComparison = (nextComparison, source = "control", force = false) => {
    const normalized = normalizeCompare(nextComparison);
    if (!normalized || !model.comparison[normalized]) return;
    const previous = comparison;
    comparison = normalized;
    updateCompareDOM();
    compareHandler(comparison, previous);
    if (!force && comparison === previous) return;
    emit("atlas:commit", {
      kind: "comparison",
      comparison,
      previous,
      source,
      observationId: model.comparison[comparison]?.observationId ?? "",
      exact: true,
    });
  };

  const selectAxis = (nextAxis, source = "control", force = false) => {
    const normalized = firstString(nextAxis);
    if (!normalized) return;
    const previous = axis;
    axis = normalized;
    updateAxisDOM();
    axisHandler(axis, previous);
    if (!force && axis === previous) return;
    emit("atlas:commit", {
      kind: "axis",
      axis,
      previous,
      source,
    });
  };

  for (const control of stateControls) {
    const apply = () => selectState(controlValue(control));
    control.addEventListener("click", apply);
    if (control.matches("input, select")) control.addEventListener("change", apply);
  }
  for (const control of compareControls) {
    const apply = () => selectComparison(controlValue(control));
    control.addEventListener("click", apply);
    if (control.matches("input, select")) control.addEventListener("change", apply);
  }
  for (const control of axisControls) {
    const apply = () => selectAxis(controlValue(control));
    control.addEventListener("click", apply);
    if (control.matches("input, select")) control.addEventListener("change", apply);
  }

  updateStateDOM();
  updateCompareDOM();
  updateAxisDOM();

  return {
    get state() {
      return state;
    },
    get comparison() {
      return comparison;
    },
    get axis() {
      return axis;
    },
    get activeLevel() {
      return activeLevel();
    },
    selectState,
    selectComparison,
    selectAxis,
    onState(handler) {
      stateHandler = handler;
    },
    onCompare(handler) {
      compareHandler = handler;
    },
    onAxis(handler) {
      axisHandler = handler;
    },
    setCanvasReady(ready) {
      canvasReady = ready;
      chamberRoot.dataset.chamberCanvasReady = ready ? "true" : "false";
      setInstrumentLedgerMode(ready);
    },
    activateFallback(reason) {
      canvasReady = false;
      setInstrumentLedgerMode(false);
      chamberRoot.classList.remove("is-chamber-loading", "is-chamber-ready");
      chamberRoot.classList.add("is-chamber-fallback");
      chamberRoot.dataset.chamberStatus = "fallback";
      chamberRoot.dataset.chamberFallback = reason;
      chamberRoot.dataset.ready = "false";
      chamberRoot.dataset.failed = "true";
      chamberRoot.classList.remove("is-chamber-webgl");
      // The renderer is opaque and appended after the semantic fallback. Hide
      // it on every terminal failure so the exact HTML plate cannot be covered
      // by a frozen or incomplete WebGL surface.
      for (const canvas of chamberRoot.querySelectorAll("canvas[data-chamber-renderer]")) {
        canvas.hidden = true;
      }
      updateStateDOM();
      updateCompareDOM();
    },
    get canvasReady() {
      return canvasReady;
    },
  };
}

function createEngine({
  camera,
  chamberRoot,
  controls,
  model,
  reducedMotion,
  renderer,
  performanceProfile,
  scene,
}) {
  const clock = new THREE.Clock(false);
  const placeholder = createSolidTexture([6, 8, 9, 255]);
  const neutralDepth = createSolidTexture([128, 128, 128, 255], false);
  const stage = createObservatoryWorld(model, performanceProfile, placeholder, neutralDepth);
  const textureLoader = new THREE.TextureLoader();
  const textureCache = new Map();
  const plateCache = new Map();
  const artworkCache = new Map();
  const idleHandles = new Set();
  const cleanupCallbacks = [];
  const listenerCleanups = [];
  const pointerTarget = new THREE.Vector2();
  const pointerCurrent = new THREE.Vector2();
  const chamberMasthead = chamberRoot.querySelector(".chamber-masthead");
  const associationSceneCaption = chamberRoot.querySelector(
    '.scene-association .scene-caption',
  );
  const associationAxisSwitch = chamberRoot.querySelector(
    ".scene-association .axis-switch",
  );
  const associationEvidence = chamberRoot.querySelector(
    ".scene-association .angle-key",
  );
  const reconstructionSceneCaption = chamberRoot.querySelector(
    '.scene-reconstruct .scene-caption',
  );
  const reconstructionResidual = chamberRoot.querySelector(
    ".scene-reconstruct .residual-caption",
  );
  const archivePrimary = chamberRoot.querySelector(
    ".scene-archive .archive-primary",
  );

  scene.add(stage.group);

  let activeScene = "origin";
  let activeSceneProgress = 0;
  let journeyTarget = 0;
  let journeyCurrent = 0;
  let previousJourney = 0;
  let previousTransitionPath = 0;
  let journeyTransition = null;
  let visualHeroState = controls.state;
  let stateSwap = null;
  let stateSwapToken = 0;
  let resizeWidth = 1;
  let resizeHeight = 1;
  let compact = performanceProfile.mobile;
  let activeArtworkKey = "";
  let requestedArtworkKey = "";
  let artworkToken = 0;
  let activeAtlasTexture = null;
  let activeAtlasUrl = "";
  let requestedAtlasUrl = "";
  let pendingAtlasPromise = null;
  let pendingAtlasUrl = "";
  let atlasToken = 0;
  let probeActive = false;
  let probeDirect = false;
  let probeFocusPinned = false;
  let probePointerId = null;
  let probePressed = false;
  let probeSource = "pointer";
  let probeSpeed = 0;
  let probeSpeedTarget = 0;
  let probeStrength = 0;
  let probeSurface = "";
  let probeReleaseSurface = "";
  let lastProbeClientX = 0;
  let lastProbeClientY = 0;
  let lastProbeInputAt = 0;
  let lastOpticalHoverAt = 0;
  let pendingOpticalHover = null;
  let opticalHoverTimer = 0;
  let probeDownClientX = 0;
  let probeDownClientY = 0;
  let probeDividerDragging = false;
  const emittedOpticalTargets = new Set();
  let initialReady = false;
  let intro = reducedMotion.matches ? 1 : 0;
  let running = false;
  let destroyed = false;
  let frameRequest = 0;
  let scrollFrameRequest = 0;
  let scrollTicking = false;
  let lastFrameAt = 0;
  let lastCameraEvent = 0;
  let lastCameraEventTime = 0;
  let lastCameraSpeed = 0;
  let slowFrames = 0;
  let performanceReduced = false;

  // The response proof always belongs to the payload-owned hero request. The
  // association-axis control appears later in the story and must not silently
  // change this scene's measured deltas.
  stage.composeResponse(findResponse(model.responses, model.hero.vectorId));
  stage.composeAssociation(controls.axis, model.correlations, model.raw?.vectors);
  stage.setCompareSelection(controls.comparison, true);
  updateSceneDOM(chamberRoot, activeScene);
  updateReconstructionBeatDOM();

  controls.onState((state, previous) => {
    if (destroyed) return;
    void prepareHeroSwap(state, previous);
  });
  controls.onCompare((comparison) => {
    if (destroyed) return;
    stage.setCompareSelection(comparison, reducedMotion.matches);
    emit("atlas:interaction", {
      kind: "comparison-slide",
      value: comparison,
      pan: comparison === "bloom" ? 0.24 : -0.24,
      interactionId: nextEventId("comparison"),
    });
    requestRender();
  });
  controls.onAxis((axis) => {
    if (destroyed) return;
    stage.composeAssociation(axis, model.correlations, model.raw?.vectors);
    emit("atlas:interaction", {
      kind: "axis-collet",
      value: axis,
      pan: 0,
      interactionId: nextEventId("axis"),
    });
    requestRender();
  });

  function listen(target, type, listener, options) {
    if (destroyed || typeof target?.addEventListener !== "function") return;
    target.addEventListener(type, listener, options);
    listenerCleanups.push(() => target.removeEventListener(type, listener, options));
  }

  function queueIdle(callback) {
    if (destroyed) return null;
    let handle = null;
    handle = scheduleIdle((deadline) => {
      idleHandles.delete(handle);
      if (!destroyed) callback(deadline);
    });
    idleHandles.add(handle);
    return handle;
  }

  function textureCacheKey(url, color = true) {
    const normalized = normalizeAssetUrl(url);
    return normalized ? `${color ? "color" : "data"}:${normalized}` : "";
  }

  function loadTexture(url, color = true) {
    const normalized = normalizeAssetUrl(url);
    if (!normalized || destroyed) return Promise.resolve(null);
    const key = textureCacheKey(normalized, color);
    if (textureCache.has(key)) return textureCache.get(key);
    let promise;
    promise = new Promise((resolve) => {
      textureLoader.load(
        normalized,
        (texture) => {
          if (destroyed) {
            texture.dispose();
            resolve(null);
            return;
          }
          texture.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.anisotropy = Math.min(
            performanceProfile.constrained ? 2 : 4,
            renderer.capabilities.getMaxAnisotropy(),
          );
          resolve(texture);
        },
        undefined,
        () => {
          // A network/decode miss is retryable for deferred evidence. Keep a
          // newer request if one already replaced this promise.
          if (textureCache.get(key) === promise) textureCache.delete(key);
          resolve(null);
        },
      );
    });
    textureCache.set(key, promise);
    return promise;
  }

  function releaseTexture(url, color = true) {
    const key = textureCacheKey(url, color);
    if (!key) return;
    const promise = textureCache.get(key);
    textureCache.delete(key);
    void promise?.then((texture) => texture?.dispose?.());
  }

  async function loadFirstTexture(urls, color = true) {
    for (const url of urls) {
      const texture = await loadTexture(url, color);
      if (texture) return texture;
    }
    return null;
  }

  function plateKey(plate, tier, preferredUrl) {
    const identity = firstString(
      plate?.observationId,
      plate?.imageUrl,
      plate?.compactImageUrl,
      plate?.fallbackImageUrl,
    );
    return identity && preferredUrl ? `${identity}:${tier}:${preferredUrl}` : "";
  }

  function loadPlateTexture(plate) {
    if (destroyed || !plate) return Promise.resolve(null);
    const useCompactDerivative = compact || performanceProfile.constrained;
    const urls = useCompactDerivative
      ? [plate.compactImageUrl, plate.imageUrl, plate.fallbackImageUrl]
      : [plate.imageUrl, plate.compactImageUrl, plate.fallbackImageUrl];
    const candidates = [...new Set(urls.filter(Boolean))];
    const tier = useCompactDerivative ? "640" : "1024";
    const key = plateKey(plate, tier, candidates[0]);
    if (!key) return Promise.resolve(null);
    if (plateCache.has(key)) return plateCache.get(key);
    let promise;
    promise = loadFirstTexture(candidates, true).then((texture) => {
      if (!texture && plateCache.get(key) === promise) plateCache.delete(key);
      return texture;
    });
    plateCache.set(key, promise);
    return promise;
  }

  function releaseArtwork(key) {
    if (!key || key === activeArtworkKey) return;
    artworkCache.delete(key);
    const specification = OBSERVATORY_ART[key];
    if (!specification) return;
    releaseTexture(specification.room, true);
    releaseTexture(specification.instrument, true);
    releaseTexture(specification.depth, false);
    releaseTexture(specification.color, true);
  }

  async function ensureArtwork(useMobile = compact) {
    const key = useMobile ? "mobile" : "desktop";
    if (activeArtworkKey === key && artworkCache.has(key)) return artworkCache.get(key);
    requestedArtworkKey = key;
    const token = ++artworkToken;
    let promise = artworkCache.get(key);
    if (!promise) {
      const specification = OBSERVATORY_ART[key];
      promise = Promise.all([
        loadTexture(specification.room, true),
        loadTexture(specification.instrument, true),
        loadTexture(specification.depth, false),
      ]).then(async ([room, instrument, depth]) => {
        // The composite is a recovery asset, not a fourth production layer.
        // Decode it only if the aligned room/instrument pair failed.
        const fallback = room && instrument
          ? null
          : await loadTexture(specification.color, true);
        return {
          room: room || fallback,
          instrument,
          depth: depth || neutralDepth,
          specification,
        };
      });
      artworkCache.set(key, promise);
    }
    const artwork = await promise;
    if (
      (!artwork?.room || !artwork?.instrument) &&
      artworkCache.get(key) === promise
    ) artworkCache.delete(key);
    if (destroyed || token !== artworkToken || !artwork?.room || !artwork?.instrument) {
      if (
        !destroyed &&
        key !== activeArtworkKey &&
        key !== requestedArtworkKey
      ) releaseArtwork(key);
      return artwork;
    }
    const previousKey = activeArtworkKey;
    activeArtworkKey = key;
    stage.setArtwork(
      artwork.room,
      artwork.instrument,
      artwork.depth,
      artwork.specification,
    );
    if (previousKey && previousKey !== key) releaseArtwork(previousKey);
    requestRender();
    return artwork;
  }

  async function ensureAtlasTexture() {
    if (!model.atlas || destroyed) return null;
    const url = compact
      ? model.atlas.mobileUrl || model.atlas.desktopUrl
      : model.atlas.desktopUrl || model.atlas.mobileUrl;
    if (!url) return null;
    if (activeAtlasTexture && activeAtlasUrl === url) return activeAtlasTexture;
    if (pendingAtlasPromise && pendingAtlasUrl === url) return pendingAtlasPromise;
    requestedAtlasUrl = url;
    const token = ++atlasToken;
    const promise = loadTexture(url, true);
    pendingAtlasPromise = promise;
    pendingAtlasUrl = url;
    const texture = await promise;
    if (pendingAtlasPromise === promise) {
      pendingAtlasPromise = null;
      pendingAtlasUrl = "";
    }
    if (!texture || destroyed || token !== atlasToken) {
      if (
        texture &&
        !destroyed &&
        url !== activeAtlasUrl &&
        url !== requestedAtlasUrl
      ) releaseTexture(url, true);
      return texture;
    }
    const previousTexture = activeAtlasTexture;
    const previousUrl = activeAtlasUrl;
    activeAtlasTexture = texture;
    activeAtlasUrl = url;
    stage.setAtlasTexture(texture);
    if (previousTexture && previousTexture !== texture && previousUrl !== url) {
      releaseTexture(previousUrl, true);
    }
    emit("atlas:commit", {
      kind: "atlas",
      observations: model.atlas.entries.size,
      scene: activeScene,
    });
    requestRender();
    return texture;
  }

  async function prepareHeroSwap(state, previous) {
    if (destroyed) return;
    const plate = model.hero.levels.find((item) => item.state === state);
    if (!plate) return;
    const token = ++stateSwapToken;
    const texture = await loadPlateTexture(plate);
    if (!texture || destroyed || token !== stateSwapToken) return;

    emit("atlas:interaction", {
      kind: "state-detent",
      value: state,
      pan: 0.16,
      interactionId: nextEventId("state"),
    });

    if (reducedMotion.matches || state === visualHeroState) {
      visualHeroState = state;
      stage.setHeroTexture(texture);
      stage.setStateShutter(0);
      requestRender();
      return;
    }

    stateSwap = {
      from: previous || visualHeroState,
      start: performance.now(),
      swapped: false,
      texture,
      to: state,
    };
    requestRender();
  }

  async function loadInitialPlate() {
    const plate = model.hero.levels.find((item) => item.state === controls.state) ??
      model.hero.levels[0];
    if (!plate) return false;
    const [artwork, heroTexture] = await Promise.all([
      ensureArtwork(compact),
      loadPlateTexture(plate),
    ]);
    if (!artwork?.room || !artwork?.instrument || !heroTexture || destroyed) return false;
    visualHeroState = plate.state || controls.state;
    stage.setHeroTexture(heroTexture);
    initialReady = true;
    requestRender();
    return true;
  }

  function loadDeferredPlates() {
    if (destroyed) return;
    const queue = [
      ...model.hero.levels,
      model.comparison.halation,
      model.comparison.bloom,
      ...model.reconstruction.plates.slice(0, 2),
    ].filter(Boolean);
    let index = 0;
    const next = async () => {
      if (destroyed || index >= queue.length) return;
      const plate = queue[index];
      index += 1;
      const texture = await loadPlateTexture(plate);
      if (texture) {
        if (plate === model.comparison.halation) stage.setComparisonTexture("halation", texture);
        if (plate === model.comparison.bloom) stage.setComparisonTexture("bloom", texture);
        const reconstructionIndex = model.reconstruction.plates.indexOf(plate);
        if (reconstructionIndex >= 0 && reconstructionIndex < 2) {
          stage.setReconstructionTexture(reconstructionIndex, texture);
        }
        requestRender();
      }
      queueIdle(next);
    };
    queueIdle(next);

  }

  function ensureSceneAssets(sceneName) {
    if (destroyed) return;
    if (sceneName === "discriminate" || sceneName === "association") {
      void Promise.all([
        loadPlateTexture(model.comparison.halation),
        loadPlateTexture(model.comparison.bloom),
      ]).then(([halation, bloom]) => {
        if (halation) stage.setComparisonTexture("halation", halation);
        if (bloom) stage.setComparisonTexture("bloom", bloom);
        requestRender();
      });
    }
    if (sceneName === "reconstruct") {
      void Promise.all(model.reconstruction.plates.slice(0, 2).map(loadPlateTexture)).then(
        (textures) => {
          textures.forEach((texture, index) => {
            if (texture) stage.setReconstructionTexture(index, texture);
          });
          requestRender();
        },
      );
    }
    if (sceneName === "archive" && model.atlas) {
      void ensureAtlasTexture();
    }
  }

  function pointerPoint(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    return {
      point: new THREE.Vector2(
        ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1,
        -(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1),
      ),
      rect,
    };
  }

  function semanticProbeTarget(target) {
    if (!(target instanceof Element)) return null;
    const stateControl = target.closest(
      "button[data-chamber-state], input[data-chamber-state], select[data-chamber-state]",
    );
    if (stateControl && activeScene === "origin") {
      return stage.probeAnchor("origin", controlValue(stateControl));
    }
    const compareControl = target.closest(
      "button[data-chamber-compare], input[data-chamber-compare], select[data-chamber-compare]",
    );
    if (compareControl && activeScene === "discriminate") {
      return stage.probeAnchor("discriminate", normalizeCompare(controlValue(compareControl)));
    }
    const axisControl = target.closest(
      "button[data-chamber-axis], input[data-chamber-axis], select[data-chamber-axis]",
    );
    if (axisControl && activeScene === "association") {
      return stage.probeAnchor("association", controlValue(axisControl));
    }
    const archiveControl = target.closest(
      ".archive-primary, .archive-secondary a, .aperture-search input, " +
        ".aperture-search button, .angle-key a",
    );
    if (archiveControl) {
      if (archiveControl.closest(".angle-key") && activeScene === "association") {
        return stage.probeAnchor("association", "collet");
      }
      if (activeScene === "archive") return stage.probeAnchor("archive", "portal");
    }
    return null;
  }

  function isOpticalSurface(surface) {
    return /^(origin:portal|response:beam:\d+|discriminate:divider|association:(ray:\d+|collet)|reconstruct:plate:\d+|archive:(cell:\d+:\d+|portal))$/.test(
      surface,
    );
  }

  function emitOpticalHover(surface, source, x) {
    if (!isOpticalSurface(surface) || emittedOpticalTargets.has(surface)) return;
    pendingOpticalHover = { source, surface, x };
    const deliver = () => {
      opticalHoverTimer = 0;
      const pending = pendingOpticalHover;
      if (!pending || emittedOpticalTargets.has(pending.surface)) {
        pendingOpticalHover = null;
        return;
      }
      if (!probeActive || probeSurface !== pending.surface) {
        pendingOpticalHover = null;
        return;
      }
      pendingOpticalHover = null;
      emittedOpticalTargets.add(pending.surface);
      lastOpticalHoverAt = performance.now();
      const id = `optical-${pending.surface}`;
      emit("atlas:interaction", {
        id,
        interactionId: id,
        kind: "optical-hover",
        pan: clamp(pending.x * 0.15, -0.15, 0.15),
        scene: activeScene,
        surface: pending.surface,
        value: pending.source === "focus" ? "focus" : "pointer",
      });
    };
    const delay = Math.max(0, OPTICAL_HOVER_COOLDOWN_MS - (performance.now() - lastOpticalHoverAt));
    if (!delay) deliver();
    else if (!opticalHoverTimer) opticalHoverTimer = window.setTimeout(deliver, delay);
  }

  function acquireProbe(
    point,
    {
      direct = false,
      pressed = probePressed,
      source = "pointer",
      speed = 0,
      surface = "",
    } = {},
  ) {
    const wasActive = probeActive;
    pointerTarget.copy(point);
    if (!wasActive) {
      pointerCurrent.lerp(point, reducedMotion.matches ? 1 : 0.28);
      probeStrength = Math.max(probeStrength, reducedMotion.matches ? 1 : 0.28);
    }
    probeActive = true;
    probeReleaseSurface = "";
    probeDirect = direct;
    probePressed = pressed;
    probeSource = source;
    probeSpeedTarget = Math.max(0, speed);
    probeSurface = surface || `${activeScene}:world`;
    lastProbeInputAt = performance.now();
    lastCameraEvent = 0;
    emitOpticalHover(probeSurface, source, point.x);
    requestRender();
  }

  function releaseProbe(_reason = "release") {
    if (destroyed) return;
    probeActive = false;
    probeDirect = false;
    probeFocusPinned = false;
    probePressed = false;
    probeSpeed = 0;
    probeSpeedTarget = 0;
    probeReleaseSurface = probeSurface;
    probeSurface = "";
    pointerTarget.set(0, 0);
    chamberRoot.style.cursor = "";
    lastCameraEvent = 0;
    requestRender();
  }

  function updateProbeCursor(surface, eventTarget) {
    const interactiveTarget = eventTarget instanceof Element
      ? eventTarget.closest("a, button, input, select, textarea, label, summary")
      : null;
    if (interactiveTarget) {
      chamberRoot.style.cursor = "";
    } else if (surface === "discriminate:divider") {
      chamberRoot.style.cursor = "col-resize";
    } else if (
      surface.startsWith("response:beam:") ||
      surface.startsWith("association:ray:") ||
      surface === "association:collet"
    ) {
      chamberRoot.style.cursor = "crosshair";
    } else if (surface.startsWith("reconstruct:plate:")) {
      chamberRoot.style.cursor = "zoom-in";
    } else if (surface === "origin:portal" || surface.startsWith("archive:")) {
      chamberRoot.style.cursor = "pointer";
    } else {
      chamberRoot.style.cursor = "";
    }
  }

  function bind() {
    const sceneSections = [...chamberRoot.querySelectorAll("[data-chamber-scene]")]
      .map((element) => ({ element, scene: normalizeScene(element.dataset.chamberScene) }))
      .filter((item) => item.scene);
    let previousScrollY = window.scrollY;
    let previousScrollTime = performance.now();

    const updateScrollState = () => {
      scrollFrameRequest = 0;
      scrollTicking = false;
      if (destroyed || !sceneSections.length) return;
      const viewportAnchor = window.innerHeight * 0.46;
      const { item, rect } = activeSceneSection(sceneSections, viewportAnchor);
      const now = performance.now();
      const elapsedSeconds = Math.max(0.016, (now - previousScrollTime) / 1000);
      const velocity = reducedMotion.matches
        ? 0
        : clamp(
            ((window.scrollY - previousScrollY) / Math.max(window.innerHeight, 1)) /
              elapsedSeconds,
            -2,
            2,
          );
      const progress = clamp(
        (viewportAnchor - rect.top) / Math.max(rect.height, 1),
        0,
        1,
      );
      previousScrollY = window.scrollY;
      previousScrollTime = now;
      activateScene(item.scene, "scroll", { progress, velocity, emitProgress: true });
      requestRender();
    };

    listen(
      window,
      "scroll",
      () => {
        if (destroyed || scrollTicking) return;
        scrollTicking = true;
        scrollFrameRequest = window.requestAnimationFrame(updateScrollState);
      },
      { passive: true },
    );
    updateScrollState();

    chamberRoot.style.touchAction = "pan-y pinch-zoom";
    listen(
      chamberRoot,
      "pointermove",
      (event) => {
        if (event.pointerType !== "mouse" && event.pointerId !== probePointerId) return;
        const { point } = pointerPoint(event);
        const semantic = semanticProbeTarget(event.target);
        const resolved = semantic || stage.resolveProbe(point, activeScene);
        const now = performance.now();
        const elapsed = Math.max(16, now - lastProbeInputAt) / 1000;
        const speed = lastProbeInputAt
          ? Math.hypot(event.clientX - lastProbeClientX, event.clientY - lastProbeClientY) / elapsed
          : 0;
        lastProbeClientX = event.clientX;
        lastProbeClientY = event.clientY;

        let direct = resolved?.direct ?? activeScene === "discriminate";
        if (event.pointerType !== "mouse" && activeScene === "discriminate") {
          const dx = event.clientX - probeDownClientX;
          const dy = event.clientY - probeDownClientY;
          if (!probeDividerDragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.1) {
            probeDividerDragging = true;
          }
          direct = probeDividerDragging;
          if (probeDividerDragging) event.preventDefault();
        }

        acquireProbe(semantic?.point || point, {
          direct,
          pressed: event.buttons > 0 || probePressed,
          source: "pointer",
          speed,
          surface: resolved?.surface,
        });
        updateProbeCursor(resolved?.surface || "", event.target);
      },
      { passive: false },
    );
    listen(chamberRoot, "pointerover", (event) => {
      if (event.pointerType !== "mouse") return;
      const semantic = semanticProbeTarget(event.target);
      if (!semantic) return;
      acquireProbe(semantic.point, {
        direct: semantic.direct,
        source: "pointer",
        surface: semantic.surface,
      });
      updateProbeCursor(semantic.surface, event.target);
    });
    listen(chamberRoot, "pointerleave", () => releaseProbe("pointer-leave"));

    listen(chamberRoot, "focusin", (event) => {
      const semantic = semanticProbeTarget(event.target);
      if (!semantic) return;
      probeFocusPinned = true;
      acquireProbe(semantic.point, {
        direct: semantic.direct,
        source: "focus",
        surface: semantic.surface,
      });
    });
    listen(chamberRoot, "focusout", () => {
      window.queueMicrotask(() => {
        const semantic = semanticProbeTarget(document.activeElement);
        if (semantic) return;
        releaseProbe("focus-out");
      });
    });

    listen(chamberRoot, "pointerdown", (event) => {
      if (event.button !== 0 || event.defaultPrevented) return;
      probePointerId = event.pointerId;
      probePressed = true;
      probeFocusPinned = false;
      probeDividerDragging = event.pointerType === "mouse" && activeScene === "discriminate";
      probeDownClientX = event.clientX;
      probeDownClientY = event.clientY;
      lastProbeClientX = event.clientX;
      lastProbeClientY = event.clientY;
      const { point } = pointerPoint(event);
      const semantic = semanticProbeTarget(event.target);
      const resolved = semantic || stage.resolveProbe(point, activeScene);
      acquireProbe(semantic?.point || point, {
        direct: semantic?.direct || probeDividerDragging,
        pressed: true,
        source: "pointer",
        surface: resolved?.surface,
      });
      if (!semantic && activeScene === "discriminate") {
        chamberRoot.setPointerCapture?.(event.pointerId);
      }
    });

    const finishPointer = (event) => {
      if (probePointerId !== null && event.pointerId !== probePointerId) return;
      probePressed = false;
      probeDirect = false;
      probeDividerDragging = false;
      if (chamberRoot.hasPointerCapture?.(event.pointerId)) {
        chamberRoot.releasePointerCapture(event.pointerId);
      }
      probePointerId = null;
      lastCameraEvent = 0;
      if (event.pointerType !== "mouse") releaseProbe("pointer-release");
      requestRender();
    };
    listen(window, "pointerup", finishPointer);
    listen(window, "pointercancel", (event) => {
      probePointerId = null;
      probeDividerDragging = false;
      releaseProbe("pointer-cancel");
    });
    listen(window, "blur", () => releaseProbe("window-blur"));

    listen(chamberRoot, "pointerdown", (event) => {
      if (activeScene !== "archive" || event.button !== 0 || event.defaultPrevented) return;
      const interactiveTarget = event.target instanceof Element
        ? event.target.closest("a, button, input, select, textarea, label, summary")
        : null;
      // Preserve every native control. Non-interactive copy may overlap the
      // generated apparatus on narrow screens, but the visible lens remains a
      // reliable hit target through the chamber root.
      if (interactiveTarget) return;
      const rect = renderer.domElement.getBoundingClientRect();
      if (!stage.portalHit(event.clientX, event.clientY, rect)) return;
      emit("atlas:interaction", {
        kind: "archive-open",
        value: "atlas",
        pan: 0.18,
        interactionId: nextEventId("archive"),
      });
      emit("atlas:commit", {
        kind: "observation-index",
        scene: activeScene,
        observations: model.atlas?.entries.size ?? model.count,
      });
      const prefix = chamberRoot.dataset.prefix || "";
      const firstAtlasLink = chamberRoot.querySelector(".aperture-index a[href]");
      const target = firstAtlasLink?.getAttribute("href") || `${prefix}vectors.html`;
      window.location.assign(new URL(target, document.baseURI));
    });

    listen(document, "visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    listen(reducedMotion, "change", () => {
      intro = reducedMotion.matches ? 1 : intro;
      if (reducedMotion.matches) {
        stateSwap = null;
        journeyCurrent = journeyTarget;
        pointerCurrent.copy(pointerTarget);
        probeStrength = probeActive ? 1 : 0;
        probeSpeed = probeActive ? probeSpeedTarget : 0;
        stage.setStateShutter(0);
        const plate = model.hero.levels.find((item) => item.state === controls.state);
        void loadPlateTexture(plate).then((texture) => {
          if (texture) stage.setHeroTexture(texture);
          requestRender();
        });
      }
      requestRender();
    });
  }

  function activateScene(nextScene, source = "system", telemetry = {}) {
    if (destroyed) return;
    const normalized = normalizeScene(nextScene);
    if (!normalized) return;
    const previous = activeScene;
    const changed = normalized !== activeScene;
    if (changed) {
      activeScene = normalized;
      updateSceneDOM(chamberRoot, normalized);
      ensureSceneAssets(normalized);
      chamberRoot.style.cursor = "";
    }
    activeSceneProgress = Number.isFinite(telemetry.progress) ? telemetry.progress : 0;
    // The atlas is a large final-scene texture. Warm it only once the reader
    // reaches the reconstruction tail, not beside entry audio/hero decoding.
    if (normalized === "reconstruct" && activeSceneProgress >= 0.76) {
      void ensureAtlasTexture();
    }
    updateReconstructionBeatDOM();
    // Hold each proof long enough to read. Compact layouts reserve nearly the
    // entire scroll field for copy before crossing; desktop keeps its broader
    // camera transition.
    const index = SCENES.indexOf(normalized);
    journeyTarget = sceneJourneyTarget(normalized, activeSceneProgress);
    if (reducedMotion.matches) journeyCurrent = journeyTarget;
    if (!changed && !telemetry.emitProgress) return;
    const detail = {
      id: normalized,
      scene: normalized,
      previous: changed ? previous : normalized,
      index,
      source,
    };
    if (Number.isFinite(telemetry.progress)) detail.progress = telemetry.progress;
    if (Number.isFinite(telemetry.velocity)) detail.velocity = telemetry.velocity;
    emit("atlas:scene", detail);
  }

  function resize(width, height) {
    if (destroyed) return;
    resizeWidth = Math.max(1, Math.floor(width || window.innerWidth || 1));
    resizeHeight = Math.max(1, Math.floor(height || window.innerHeight || 1));
    const nextPixelRatio = performanceReduced
      ? Math.min(
          1,
          backingPixelRatio(resizeWidth, resizeHeight, performanceProfile),
        )
      : backingPixelRatio(resizeWidth, resizeHeight, performanceProfile);
    if (Math.abs(renderer.getPixelRatio() - nextPixelRatio) > 0.01) {
      renderer.setPixelRatio(nextPixelRatio);
    }
    renderer.setSize(resizeWidth, resizeHeight, false);
    const nextCompact = resizeWidth / resizeHeight < 0.82;
    const changed = nextCompact !== compact;
    compact = nextCompact;
    stage.resize(resizeWidth, resizeHeight, compact);
    updateReconstructionBeatDOM();
    if (changed) {
      journeyTarget = sceneJourneyTarget(activeScene, activeSceneProgress);
      if (reducedMotion.matches) journeyCurrent = journeyTarget;
    }
    if (changed || !activeArtworkKey) void ensureArtwork(compact);
    if (changed && activeScene === "archive") void ensureAtlasTexture();
    requestRender();
  }

  function sceneJourneyTarget(sceneName, progress) {
    const index = Math.max(0, SCENES.indexOf(sceneName));
    const transitionStart = compact ? MOBILE_SCENE_TRANSITION_START : 0.5;
    const transitionEnd = compact ? MOBILE_SCENE_TRANSITION_END : 0.98;
    return clamp(
      index +
        (index < SCENES.length - 1
          ? smootherStep(transitionStart, transitionEnd, progress)
          : 0),
      0,
      SCENES.length - 1,
    );
  }

  function updateReconstructionBeatDOM() {
    let beat = "inactive";
    if (compact && activeScene === "reconstruct") {
      beat = activeSceneProgress < MOBILE_RECONSTRUCTION_EXACT_START
        ? "hypothesis"
        : activeSceneProgress < MOBILE_RECONSTRUCTION_RESIDUAL_START
          ? "exact-object"
          : "residual-landscape";
    }
    if (chamberRoot.dataset.chamberReconstructionBeat !== beat) {
      chamberRoot.dataset.chamberReconstructionBeat = beat;
    }
    const mobileAssociation = compact && activeScene === "association";
    const associationPhase = mobileAssociation
      ? activeSceneProgress < 0.26
        ? "intertitle"
        : activeSceneProgress < 0.56
          ? "instrument"
          : "evidence"
      : "inactive";
    chamberRoot.dataset.chamberAssociationPhase = associationPhase;
    if (associationSceneCaption instanceof HTMLElement) {
      const visible = !compact || (mobileAssociation && associationPhase === "intertitle");
      associationSceneCaption.style.opacity = compact ? (visible ? "1" : "0") : "";
      associationSceneCaption.style.visibility = compact && !visible ? "hidden" : "";
      associationSceneCaption.style.paddingTop = mobileAssociation ? "80px" : "";
    }
    if (associationAxisSwitch instanceof HTMLElement) {
      const visible = !compact || (mobileAssociation && associationPhase === "instrument");
      associationAxisSwitch.style.visibility = compact && !visible ? "hidden" : "";
      associationAxisSwitch.style.pointerEvents = compact && !visible ? "none" : "";
    }
    if (associationEvidence instanceof HTMLElement) {
      const visible = !compact || (mobileAssociation && associationPhase === "evidence");
      associationEvidence.style.visibility = compact && !visible ? "hidden" : "";
      associationEvidence.style.pointerEvents = compact && !visible ? "none" : "";
    }
    const mobileReconstruction = compact && activeScene === "reconstruct";
    if (reconstructionSceneCaption instanceof HTMLElement) {
      const visible = !compact || (mobileReconstruction && beat === "hypothesis");
      reconstructionSceneCaption.style.opacity = compact ? (visible ? "1" : "0") : "";
      reconstructionSceneCaption.style.visibility = compact && !visible ? "hidden" : "";
      reconstructionSceneCaption.style.paddingTop = mobileReconstruction ? "80px" : "";
    }
    if (reconstructionResidual instanceof HTMLElement) {
      const visible = !compact || (mobileReconstruction && beat === "residual-landscape");
      reconstructionResidual.style.visibility = compact && !visible ? "hidden" : "";
      reconstructionResidual.style.pointerEvents = compact && !visible ? "none" : "";
    }
    const archivePhase = activeScene === "archive"
      ? activeSceneProgress < 0.52 ? "projection" : "portal"
      : "inactive";
    chamberRoot.dataset.chamberArchivePhase = archivePhase;
    if (archivePrimary instanceof HTMLElement) {
      const visible = archivePhase !== "projection";
      archivePrimary.style.opacity = archivePhase === "projection" ? "0" : "";
      archivePrimary.style.visibility = !visible ? "hidden" : "";
      archivePrimary.style.pointerEvents = !visible ? "none" : "";
    }
    if (chamberMasthead instanceof HTMLElement) {
      const hidden = mobileAssociation && associationPhase === "intertitle";
      chamberMasthead.style.opacity = hidden ? "0" : "";
      chamberMasthead.style.visibility = hidden ? "hidden" : "";
    }
  }

  function renderCommitFrame() {
    if (destroyed) return false;
    try {
      stage.setJourney(journeyCurrent, activeScene, activeSceneProgress);
      stage.setIntro(1);
      stage.update(0, 1 / 60, true);
      renderer.render(scene, camera);
      return true;
    } catch (_error) {
      return false;
    }
  }

  function requestRender() {
    if (!destroyed && !running && !document.hidden) start();
  }

  function start() {
    if (running || destroyed || document.hidden) return;
    running = true;
    lastFrameAt = performance.now();
    clock.start();
    frameRequest = window.requestAnimationFrame(frame);
  }

  function stop() {
    if (!running) return;
    running = false;
    window.cancelAnimationFrame(frameRequest);
    frameRequest = 0;
    clock.stop();
  }

  function addCleanup(callback) {
    if (typeof callback !== "function") return;
    if (destroyed) {
      callback();
      return;
    }
    cleanupCallbacks.push(callback);
  }

  function destroy(reason = "terminal") {
    if (destroyed) return;
    // This is a terminal state, not the ordinary visibility pause. Set it
    // before touching listeners/resources so resize, focus, and pending image
    // callbacks cannot restart the renderer during teardown.
    destroyed = true;
    running = false;
    artworkToken += 1;
    atlasToken += 1;
    stateSwapToken += 1;
    window.cancelAnimationFrame(frameRequest);
    window.cancelAnimationFrame(scrollFrameRequest);
    frameRequest = 0;
    scrollFrameRequest = 0;
    window.clearTimeout(opticalHoverTimer);
    opticalHoverTimer = 0;
    for (const handle of idleHandles) cancelScheduledIdle(handle);
    idleHandles.clear();
    clock.stop();

    for (const cleanup of listenerCleanups.splice(0).reverse()) cleanup();
    for (const cleanup of cleanupCallbacks.splice(0).reverse()) cleanup();

    const geometries = new Set();
    const materials = new Set();
    stage.group.traverse((node) => {
      if (node.geometry) geometries.add(node.geometry);
      const nodeMaterials = Array.isArray(node.material) ? node.material : [node.material];
      for (const material of nodeMaterials) {
        if (material) materials.add(material);
      }
    });
    scene.remove(stage.group);
    for (const geometry of geometries) geometry.dispose?.();
    for (const material of materials) material.dispose?.();

    const pendingTextures = new Set(textureCache.values());
    textureCache.clear();
    plateCache.clear();
    artworkCache.clear();
    for (const promise of pendingTextures) {
      void promise?.then((texture) => texture?.dispose?.());
    }
    placeholder.dispose();
    neutralDepth.dispose();
    activeAtlasTexture = null;
    activeAtlasUrl = "";
    pendingAtlasPromise = null;
    pendingAtlasUrl = "";
    activeArtworkKey = "";

    renderer.renderLists?.dispose?.();
    renderer.dispose();
    if (reason !== "webgl-context-lost" && reason !== "pagehide") {
      // Only terminal teardown intentionally loses the context. Normal
      // visibility changes continue to use stop()/start(), and pagehide lets
      // the browser retire its own context after explicit renderer disposal.
      try {
        renderer.forceContextLoss();
      } catch (_error) {
        // Some drivers have already discarded the context during pagehide.
      }
    }
    renderer.domElement.remove();
    chamberRoot.style.cursor = "";
  }

  function frame(now) {
    if (!running || destroyed) return;
    const delta = Math.min(clock.getDelta() || (now - lastFrameAt) / 1000 || 1 / 60, 0.05);
    lastFrameAt = now;
    const still = reducedMotion.matches;
    const journeyEase = still ? 1 : 1 - Math.exp(-delta * 5.2);
    const visualProbeSurface = probeActive ? probeSurface : probeReleaseSurface;
    const reconstructionProbe = visualProbeSurface.startsWith("reconstruct:plate:");
    const probeRate = probeActive
      ? reconstructionProbe
        ? RECONSTRUCTION_PROBE_FOLLOW_RATE
        : OPTICAL_PROBE_FOLLOW_RATE
      : reconstructionProbe
        ? RECONSTRUCTION_PROBE_RELEASE_RATE
        : OPTICAL_PROBE_RELEASE_RATE;
    const pointerEase = still ? 1 : 1 - Math.exp(-delta * probeRate);
    intro = still ? 1 : initialReady ? Math.min(1, intro + delta / 1.1) : 0;
    previousJourney = journeyCurrent;
    journeyCurrent += (journeyTarget - journeyCurrent) * journeyEase;
    if (still) journeyCurrent = journeyTarget;
    pointerCurrent.lerp(pointerTarget, pointerEase);
    probeStrength += ((probeActive ? 1 : 0) - probeStrength) * pointerEase;
    probeSpeedTarget *= still ? 0 : Math.exp(-delta * 12);
    probeSpeed += (probeSpeedTarget - probeSpeed) * (still ? 1 : 1 - Math.exp(-delta * 18));
    if (!probeActive && probeStrength < 0.001) {
      probeStrength = 0;
      probeSpeed = 0;
      probeReleaseSurface = "";
    }

    updateStateSwap(now);
    stage.setJourney(journeyCurrent, activeScene, activeSceneProgress);
    stage.setProbe({
      active: probeActive,
      direct: probeDirect,
      pressed: probePressed,
      scene: activeScene,
      source: probeSource,
      speed: probeActive ? probeSpeed : 0,
      strength: probeStrength,
      surface: visualProbeSurface,
      targetX: pointerTarget.x,
      x: pointerCurrent.x,
      y: pointerCurrent.y,
    });
    stage.setIntro(smootherStep(0, 1, intro));
    stage.update(now / 1000, delta, still);
    renderer.render(scene, camera);

    updateJourneyEvents();
    emitOpticalCamera(now);

    if (!performanceReduced && delta > 0.025) slowFrames += 1;
    else slowFrames = Math.max(0, slowFrames - 2);
    if (!performanceReduced && slowFrames > 90) {
      performanceReduced = true;
      renderer.setPixelRatio(Math.min(1, renderer.getPixelRatio()));
      renderer.setSize(resizeWidth, resizeHeight, false);
      stage.setPerformanceReduced(true);
      emit("atlas:commit", { kind: "performance-tier", tier: "reduced" });
    }

    if (still) {
      emitOpticalCamera(now, true);
      running = false;
      clock.stop();
      return;
    }
    frameRequest = window.requestAnimationFrame(frame);
  }

  function updateStateSwap(now) {
    if (!stateSwap) {
      stage.setStateShutter(0);
      return;
    }
    const progress = clamp((now - stateSwap.start) / STATE_SHUTTER_DURATION_MS, 0, 1);
    const shutter = progress < 0.4
      ? smootherStep(0, 0.4, progress)
      : progress < 0.62
        ? 1
        : 1 - smootherStep(0.62, 1, progress);
    stage.setStateShutter(shutter);
    if (!stateSwap.swapped && progress >= 0.5) {
      stateSwap.swapped = true;
      visualHeroState = stateSwap.to;
      stage.setHeroTexture(stateSwap.texture);
      emit("atlas:commit", {
        kind: "state-occluded-swap",
        from: stateSwap.from,
        to: stateSwap.to,
        exact: true,
        shutter: 1,
        scene: activeScene,
      });
    }
    if (progress >= 1) {
      const completed = stateSwap;
      stateSwap = null;
      stage.setStateShutter(0);
      emit("atlas:commit", {
        kind: "state-shutter",
        phase: "complete",
        from: completed.from,
        to: completed.to,
        exact: true,
        scene: activeScene,
      });
    }
  }

  function emitOpticalCamera(now, settled = false) {
    if (!settled && now - lastCameraEvent < 90) return;
    const elapsedSeconds = lastCameraEventTime
      ? Math.max(0.001, (now - lastCameraEventTime) / 1000)
      : 1 / 60;
    const rawSpeed = lastCameraEventTime
      ? Math.abs(journeyCurrent - previousJourney) / elapsedSeconds
      : 0;
    const speed = settled ? 0 : clamp(rawSpeed / 14, 0, 0.3);
    const acceleration = settled
      ? clamp(-lastCameraSpeed / elapsedSeconds, -1, 1)
      : clamp(((speed - lastCameraSpeed) / elapsedSeconds) * 0.4, -1, 1);
    const direction = Math.sign(journeyTarget - journeyCurrent) ||
      Math.sign(journeyCurrent - previousTransitionPath);
    const x = pointerCurrent.x * 0.08;
    const z = 1 - (journeyCurrent / Math.max(1, SCENES.length - 1)) * 0.14;
    emit("atlas:camera", {
      journey: Number((journeyCurrent / Math.max(1, SCENES.length - 1)).toFixed(5)),
      scene: activeScene,
      localProgress: Number(activeSceneProgress.toFixed(4)),
      speed: Number(speed.toFixed(5)),
      acceleration: Number(acceleration.toFixed(5)),
      x: Number(x.toFixed(4)),
      z: Number(z.toFixed(4)),
      direction,
      path: Number(journeyCurrent.toFixed(4)),
      progress: Number(activeSceneProgress.toFixed(4)),
      position: [Number(x.toFixed(4)), 0, Number(z.toFixed(4))],
      target: [0, 0, 0],
      fov: 0,
      probeActive,
      probePitchDegrees: Number((pointerCurrent.y * 1.1).toFixed(4)),
      probePressed,
      probeSpeed: Number((probeActive ? probeSpeed : 0).toFixed(2)),
      probeSurface: probeActive ? probeSurface : "",
      probeX: Number(pointerCurrent.x.toFixed(4)),
      probeY: Number(pointerCurrent.y.toFixed(4)),
      probeYawDegrees: Number((pointerCurrent.x * 2.2).toFixed(4)),
      renderedAt: Math.round(now),
    });
    lastCameraEvent = now;
    lastCameraEventTime = now;
    lastCameraSpeed = speed;
  }

  function updateJourneyEvents() {
    const previous = previousTransitionPath;
    const current = journeyCurrent;
    const direction = Math.sign(current - previous);
    if (!direction) return;
    for (let boundary = 0; boundary < SCENES.length - 1; boundary += 1) {
      const departThreshold = direction > 0 ? boundary + 0.08 : boundary + 0.92;
      const crossThreshold = boundary + 0.5;
      const arriveThreshold = direction > 0 ? boundary + 0.92 : boundary + 0.08;
      const crossed = (threshold) => direction > 0
        ? previous < threshold && current >= threshold
        : previous > threshold && current <= threshold;
      const from = direction > 0 ? SCENES[boundary] : SCENES[boundary + 1];
      const to = direction > 0 ? SCENES[boundary + 1] : SCENES[boundary];
      if (crossed(departThreshold)) beginJourneyTransition(from, to, direction);
      if (crossed(crossThreshold)) {
        if (!journeyTransition || journeyTransition.from !== from || journeyTransition.to !== to) {
          beginJourneyTransition(from, to, direction);
        }
        if (!journeyTransition.crossed) {
          journeyTransition.crossed = true;
          emitJourneyPhase(journeyTransition, "cross");
        }
      }
      if (crossed(arriveThreshold)) {
        if (!journeyTransition || journeyTransition.from !== from || journeyTransition.to !== to) {
          beginJourneyTransition(from, to, direction);
        }
        if (!journeyTransition.crossed) {
          journeyTransition.crossed = true;
          emitJourneyPhase(journeyTransition, "cross");
        }
        emitJourneyPhase(journeyTransition, "arrive");
        journeyTransition = null;
      }
    }
    previousTransitionPath = current;
  }

  function beginJourneyTransition(from, to, direction) {
    journeyTransition = {
      crossed: false,
      direction,
      from,
      id: nextEventId(`journey-${from}-${to}`),
      to,
    };
    emitJourneyPhase(journeyTransition, "depart");
  }

  function emitJourneyPhase(transition, phase) {
    emit("atlas:transition", {
      from: transition.from,
      to: transition.to,
      direction: transition.direction,
      phase,
      transitionId: transition.id,
    });
  }

  return {
    addCleanup,
    bind,
    destroy,
    loadInitialPlate,
    loadDeferredPlates,
    renderCommitFrame,
    resize,
    start,
    stop,
    get activeScene() {
      return activeScene;
    },
    get destroyed() {
      return destroyed;
    },
  };
}
function updateSceneDOM(chamberRoot, scene) {
  const index = Math.max(0, SCENES.indexOf(scene));
  const label = SCENE_LABELS[scene] ?? scene;
  chamberRoot.dataset.chamberActiveScene = scene;
  for (const node of chamberRoot.querySelectorAll("[data-chamber-scene-label]")) {
    node.textContent = label;
  }
  for (const node of chamberRoot.querySelectorAll("[data-chamber-scene-count]")) {
    node.textContent = `${String(index + 1).padStart(2, "0")} / ${String(SCENES.length).padStart(2, "0")}`;
  }
  const status = chamberRoot.querySelector("[data-chamber-status]");
  if (status) status.textContent = `Scene ${index + 1} of ${SCENES.length}: ${label}.`;
}

function activeSceneSection(sections, viewportAnchor) {
  let best = sections[0];
  let bestRect = best.element.getBoundingClientRect();
  let bestDistance = Infinity;
  for (const item of sections) {
    const rect = item.element.getBoundingClientRect();
    if (rect.top <= viewportAnchor && rect.bottom > viewportAnchor) {
      return { item, rect };
    }
    const distance = Math.min(
      Math.abs(rect.top - viewportAnchor),
      Math.abs(rect.bottom - viewportAnchor),
    );
    if (distance < bestDistance) {
      bestDistance = distance;
      best = item;
      bestRect = rect;
    }
  }
  return { item: best, rect: bestRect };
}

function bindFallbackSceneTracking(chamberRoot) {
  if (fallbackSceneRoots.has(chamberRoot)) return;
  fallbackSceneRoots.add(chamberRoot);
  const sections = [...chamberRoot.querySelectorAll("[data-chamber-scene]")]
    .map((element) => ({
      element,
      scene: normalizeScene(element.dataset.chamberScene),
    }))
    .filter((item) => item.scene);
  if (!sections.length) return;

  let ticking = false;
  let activeScene = "";
  let previousScrollY = window.scrollY;
  let previousScrollTime = performance.now();
  const update = () => {
    ticking = false;
    const viewportAnchor = window.innerHeight * 0.46;
    const { item: best, rect } = activeSceneSection(sections, viewportAnchor);
    const now = performance.now();
    const elapsedSeconds = Math.max(0.016, (now - previousScrollTime) / 1000);
    const progress = clamp(
      (viewportAnchor - rect.top) / Math.max(rect.height, 1),
      0,
      1,
    );
    const velocity = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : clamp(
          ((window.scrollY - previousScrollY) / Math.max(window.innerHeight, 1)) /
            elapsedSeconds,
          -2,
          2,
        );
    const previous = activeScene || null;
    const changed = best.scene !== activeScene;
    if (changed) {
      activeScene = best.scene;
      updateSceneDOM(chamberRoot, activeScene);
    }
    chamberRoot.dataset.chamberActiveScene = activeScene;
    emit("atlas:scene", {
      id: activeScene,
      scene: activeScene,
      previous: changed ? previous : activeScene,
      index: SCENES.indexOf(activeScene),
      progress,
      velocity,
      source: "fallback-scroll",
    });
    previousScrollY = window.scrollY;
    previousScrollTime = now;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    },
    { passive: true },
  );
  update();
}

/**
 * One persistent, authored optical world.
 *
 * The room and its suspended instrument never leave the frame. Story beats
 * replace only the physical mechanism seated in the instrument: an aperture
 * plate, response harp, knife-edge comparator, correlation goniometer,
 * hypothesis rail, or atlas magazine. Exact evidence is always an ungraded
 * MeshBasicMaterial and is never opacity-blended with another observation.
 */
function createObservatoryWorld(model, profile, placeholder, neutralDepth) {
  const group = new THREE.Group();
  group.name = "persistent-optical-observatory";

  const world = createPersistentObservatoryLayers(placeholder, neutralDepth);
  const atmosphere = createAtmosphericField(profile);
  const aperture = createApertureCarousel(placeholder);
  const response = createResponseHarp(profile);
  const comparator = createKnifeEdgeComparator(placeholder);
  const association = createCorrelationGoniometer(profile);
  const reconstruction = createHypothesisRail(model.reconstruction, placeholder);
  const archive = createAtlasMagazine(model.atlas, placeholder);

  group.add(
    world.room,
    atmosphere.group,
    aperture.exactGroup,
    comparator.exactGroup,
    reconstruction.exactGroup,
    archive.exactGroup,
    aperture.shutterGroup,
    world.instrument,
    aperture.mechanismGroup,
    response.group,
    comparator.mechanismGroup,
    association.group,
    reconstruction.mechanismGroup,
    archive.mechanismGroup,
  );

  let width = 1;
  let height = 1;
  let compact = profile.mobile;
  let journey = 0;
  let activeScene = "origin";
  let activeProgress = 0;
  let reconstructionProgress = 0;
  let intro = 0;
  let stateShutter = 0;
  let mechanismIndex = 0;
  let mechanismTarget = 0;
  let mechanismTransition = 1;
  let performanceReduced = false;
  let artworkSpecification = OBSERVATORY_ART.desktop;
  let currentShot = sampleObservatoryShot(0, compact);
  let currentPortal = {
    radius: 1,
    radiusX: 0.1,
    radiusY: 0.1,
    x: 0.5,
    xNdc: 0,
    y: 0.5,
    yNdc: 0,
  };
  let lastLayout = null;
  let probe = {
    active: false,
    direct: false,
    pressed: false,
    scene: "origin",
    speed: 0,
    strength: 0,
    surface: "",
    targetX: 0,
    x: 0,
    y: 0,
  };

  function layout(force = false) {
    const nextPortal = observatoryPortalGeometry(
      artworkSpecification,
      currentShot,
      width,
      height,
    );
    const changed = force || !lastLayout ||
      lastLayout.width !== width ||
      lastLayout.height !== height ||
      lastLayout.compact !== compact ||
      Math.abs(lastLayout.x - nextPortal.x) > 0.05 ||
      Math.abs(lastLayout.y - nextPortal.y) > 0.05 ||
      Math.abs(lastLayout.radius - nextPortal.radius) > 0.05;
    currentPortal = nextPortal;
    if (!changed) return;
    aperture.layout(currentPortal, width, height, compact);
    response.layout(currentPortal, width, height, compact);
    comparator.layout(currentPortal, width, height, compact);
    association.layout(currentPortal, width, height, compact);
    reconstruction.layout(currentPortal, width, height, compact);
    archive.layout(currentPortal, width, height, compact);
    lastLayout = {
      compact,
      height,
      radius: currentPortal.radius,
      width,
      x: currentPortal.x,
      y: currentPortal.y,
    };
  }

  function pointFromPixels(x, y) {
    return new THREE.Vector2((x / width) * 2 - 1, 1 - (y / height) * 2);
  }

  function portalProbe(point, sceneName) {
    const pixel = chamberPointPixels(point, width, height);
    const distance = Math.hypot(pixel.x - currentPortal.x, pixel.y - currentPortal.y);
    const influence = compact ? 64 : 92;
    if (sceneName === "archive") {
      const resolved = archive.resolveProbe(point);
      if (resolved) return resolved;
      return distance <= currentPortal.radius + influence
        ? { point, surface: "archive:portal" }
        : null;
    }
    if (distance > currentPortal.radius + influence) return null;
    return { point, surface: `${sceneName}:portal` };
  }

  return {
    group,
    composeResponse(responseValue) {
      response.compose(responseValue);
    },
    composeAssociation(axis, correlations, vectors) {
      association.compose(axis, correlations, vectors);
      layout(true);
    },
    probeAnchor(sceneName, value = "") {
      if (sceneName === "origin") {
        return {
          point: pointFromPixels(currentPortal.x, currentPortal.y),
          surface: "origin:portal",
        };
      }
      if (sceneName === "discriminate") return comparator.probeAnchor(value);
      if (sceneName === "association") return association.probeAnchor(value);
      if (sceneName === "archive") {
        return {
          point: pointFromPixels(currentPortal.x, currentPortal.y),
          surface: "archive:portal",
        };
      }
      return null;
    },
    resolveProbe(point, sceneName) {
      if (sceneName === "origin") return portalProbe(point, "origin");
      if (sceneName === "response") return response.resolveProbe(point, 44);
      if (sceneName === "discriminate") return comparator.resolveProbe(point);
      if (sceneName === "association") return association.resolveProbe(point);
      if (sceneName === "reconstruct") return reconstruction.resolveProbe(point);
      if (sceneName === "archive") return portalProbe(point, "archive");
      return null;
    },
    portalHit(clientX, clientY, rect) {
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      return Math.hypot(x - currentPortal.x, y - currentPortal.y) <=
        currentPortal.radius * (activeScene === "archive" ? 1.72 : 1.08);
    },
    resize(nextWidth, nextHeight, nextCompact) {
      width = Math.max(1, nextWidth);
      height = Math.max(1, nextHeight);
      compact = nextCompact;
      world.resize(width, height);
      currentShot = sampleObservatoryShot(journey, compact);
      world.setView(currentShot, artworkSpecification);
      layout(true);
    },
    setArtwork(room, instrument, depth, specification) {
      artworkSpecification = specification;
      world.setArtwork(room, instrument, depth, specification);
      currentShot = sampleObservatoryShot(journey, compact);
      world.setView(currentShot, artworkSpecification);
      layout(true);
    },
    setAtlasTexture(texture) {
      archive.setTexture(texture);
    },
    setCompareSelection(comparison, immediate = false) {
      comparator.setSelection(comparison, immediate);
    },
    setComparisonTexture(key, texture) {
      comparator.setTexture(key, texture);
    },
    setHeroTexture(texture) {
      aperture.setTexture(texture);
    },
    setIntro(value) {
      intro = clamp(value, 0, 1);
      world.setIntro(intro);
    },
    setJourney(value, sceneName, progress) {
      journey = clamp(value, 0, SCENES.length - 1);
      activeScene = sceneName;
      activeProgress = clamp(progress, 0, 1);
      if (activeScene === "reconstruct") reconstructionProgress = activeProgress;
      const nextTarget = Math.max(0, SCENES.indexOf(activeScene));
      if (nextTarget !== mechanismTarget) {
        mechanismTarget = nextTarget;
        mechanismTransition = 0;
      }
    },
    setPerformanceReduced(value) {
      performanceReduced = Boolean(value);
      atmosphere.setReduced(performanceReduced);
    },
    setProbe(nextProbe) {
      probe = { ...probe, ...nextProbe };
      const strength = clamp(probe.strength, 0, 1);
      // An acquired physical surface is a positive mechanical detent. Hold it
      // fully engaged while the pointer is stationary; the engine's eased
      // strength remains the release envelope after an actual leave/blur.
      const interactionStrength = probe.active ? 1 : strength;
      world.setProbe(probe.x, probe.y, strength);
      aperture.setProbe(
        probe.surface === "origin:portal" ? interactionStrength : 0,
        probe.pressed,
      );
      const responseMatch = /^response:beam:(\d+)$/.exec(probe.surface);
      response.setProbe(
        responseMatch ? Number(responseMatch[1]) : -1,
        interactionStrength,
        probe.pressed,
      );
      const mechanismProbe = { ...probe, strength: interactionStrength };
      comparator.setProbe(mechanismProbe);
      const associationMatch = /^association:ray:(\d+)$/.exec(probe.surface);
      association.setProbe(
        associationMatch ? Number(associationMatch[1]) : -1,
        probe.surface === "association:collet",
        interactionStrength,
        probe.pressed,
      );
      reconstruction.setProbe(mechanismProbe, interactionStrength);
      archive.setProbe(mechanismProbe, interactionStrength);
    },
    setReconstructionTexture(index, texture) {
      reconstruction.setTexture(index, texture);
    },
    setStateShutter(value) {
      stateShutter = clamp(value, 0, 1);
    },
    update(time, delta, still) {
      currentShot = sampleObservatoryShot(journey, compact);
      world.setView(currentShot, artworkSpecification);
      layout();

      if (still && mechanismIndex !== mechanismTarget) {
        mechanismIndex = mechanismTarget;
        mechanismTransition = 1;
      } else if (mechanismIndex !== mechanismTarget || mechanismTransition < 1) {
        mechanismTransition = Math.min(1, mechanismTransition + delta / 0.72);
        if (mechanismTransition >= 0.5) mechanismIndex = mechanismTarget;
      }
      const mechanismShutter = mechanismIndex === mechanismTarget && mechanismTransition >= 1
        ? 0
        : mechanismTransition < 0.5
          ? smootherStep(0.08, 0.46, mechanismTransition)
          : 1 - smootherStep(0.56, 0.94, mechanismTransition);
      const reconstructionShutter = mechanismIndex === 4
        ? reconstruction.shutter("reconstruct", reconstructionProgress, still)
        : 0;
      const introShutter = 1 - smootherStep(0.46, 0.92, intro);
      const closure = Math.max(
        stateShutter,
        mechanismShutter,
        reconstructionShutter,
        introShutter,
      );

      aperture.setMode(mechanismIndex === 0 || mechanismIndex === 1 || mechanismIndex === 3);
      comparator.setMode(mechanismIndex === 2);
      reconstruction.setMode(
        mechanismIndex === 4,
        mechanismIndex === 4 ? "reconstruct" : activeScene,
        reconstructionProgress,
        still,
      );
      archive.setMode(mechanismIndex === 5);
      aperture.setShutter(closure);

      const transitionPresence = mechanismTransition < 0.5
        ? 1 - smootherStep(0.04, 0.42, mechanismTransition)
        : smootherStep(0.58, 0.96, mechanismTransition);
      const settledPresence = mechanismTransition >= 1 ? 1 : transitionPresence;
      const localPresence = (index) => mechanismIndex === index ? settledPresence : 0;
      const originPresence = localPresence(0);
      const responsePresence = localPresence(1);
      const comparisonPresence = localPresence(2);
      const mobileAssociationReveal = compact && activeScene === "association"
        ? smootherStep(0.28, 0.36, activeProgress)
        : 1;
      const associationPresence = localPresence(3) * mobileAssociationReveal;
      const reconstructionPresence = localPresence(4);
      const archivePresence = localPresence(5);

      world.update(time, still || performanceReduced);
      atmosphere.update(journey, time, still || performanceReduced);
      aperture.update(time, delta, still, originPresence, closure);
      response.update(responsePresence, time, still);
      comparator.update(comparisonPresence, delta, still);
      association.update(associationPresence, time, still);
      reconstruction.update(
        reconstructionPresence,
        time,
        still,
        mechanismIndex === 4 ? "reconstruct" : activeScene,
        reconstructionProgress,
      );
      const archiveClimax = archive.update(
        archivePresence,
        time,
        delta,
        still,
        activeScene,
        activeProgress,
      );
      world.setArchiveClimax(
        archiveClimax,
        currentPortal,
        width,
        height,
      );
    },
  };
}

function sampleObservatoryShot(journey, compact) {
  const shots = compact ? OBSERVATORY_SHOTS.mobile : OBSERVATORY_SHOTS.desktop;
  const value = clamp(journey, 0, shots.length - 1);
  const index = Math.min(shots.length - 1, Math.floor(value));
  const nextIndex = Math.min(shots.length - 1, index + 1);
  const amount = smootherStep(0, 1, value - index);
  const from = shots[index];
  const to = shots[nextIndex];
  return {
    centerX: from.center[0] + (to.center[0] - from.center[0]) * amount,
    centerY: from.center[1] + (to.center[1] - from.center[1]) * amount,
    zoom: Math.exp(Math.log(from.zoom) + (Math.log(to.zoom) - Math.log(from.zoom)) * amount),
  };
}

function observatoryPortalGeometry(specification, shot, width, height) {
  const [sourceWidth, sourceHeight] = specification.size;
  const imageAspect = sourceWidth / sourceHeight;
  const viewAspect = width / Math.max(height, 1);
  const portalBottomY = 1 - specification.portal[1];
  const centerBottomY = 1 - shot.centerY;
  let coveredX = 0.5 + (specification.portal[0] - shot.centerX) * shot.zoom;
  let coveredBottomY = 0.5 + (portalBottomY - centerBottomY) * shot.zoom;
  let screenX = coveredX;
  let screenBottomY = coveredBottomY;
  if (viewAspect > imageAspect) {
    screenBottomY = 0.5 + (coveredBottomY - 0.5) * viewAspect / imageAspect;
  } else {
    screenX = 0.5 + (coveredX - 0.5) * imageAspect / viewAspect;
  }
  const sourceRadius = specification.portal[2] * Math.min(sourceWidth, sourceHeight);
  const displayScale = Math.max(width / sourceWidth, height / sourceHeight);
  const radius = sourceRadius * displayScale * shot.zoom;
  const x = screenX * width;
  const y = (1 - screenBottomY) * height;
  return {
    radius,
    radiusX: (radius / width) * 2,
    radiusY: (radius / height) * 2,
    x,
    xNdc: (x / width) * 2 - 1,
    y,
    yNdc: 1 - (y / height) * 2,
  };
}

function createPersistentObservatoryLayers(placeholder, neutralDepth) {
  const sharedUniforms = {
    uArtSize: { value: new THREE.Vector2(1672, 941) },
    uArchiveCenter: { value: new THREE.Vector2(0.5, 0.5) },
    uArchiveClimax: { value: 0 },
    uArchiveRadius: { value: 0.1 },
    uDepth: { value: neutralDepth },
    uForegroundShift: { value: new THREE.Vector2() },
    uInstrument: { value: placeholder },
    uIntro: { value: 0 },
    uPointer: { value: new THREE.Vector2() },
    uPortalCenter: { value: new THREE.Vector2(0.681, 1 - 0.447) },
    uPortalRadius: { value: 0.203 },
    uProbeStrength: { value: 0 },
    uReducedMotion: { value: 0 },
    uRoom: { value: placeholder },
    uTime: { value: 0 },
    uViewCenter: { value: new THREE.Vector2(0.5, 0.5) },
    uViewZoom: { value: 1 },
    uViewport: { value: new THREE.Vector2(1, 1) },
  };
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `;
  const commonFragment = `
    precision highp float;
    uniform vec2 uArtSize;
    uniform vec2 uViewCenter;
    uniform vec2 uViewport;
    uniform float uViewZoom;
    varying vec2 vUv;

    vec2 coverUv(vec2 uv) {
      float imageAspect = uArtSize.x / max(uArtSize.y, 1.0);
      float viewAspect = uViewport.x / max(uViewport.y, 1.0);
      vec2 result = uv;
      if (viewAspect > imageAspect) {
        result.y = (uv.y - 0.5) * imageAspect / viewAspect + 0.5;
      } else {
        result.x = (uv.x - 0.5) * viewAspect / imageAspect + 0.5;
      }
      return result;
    }

    vec2 cameraUv() {
      vec2 covered = coverUv(vUv);
      return uViewCenter + (covered - 0.5) / max(uViewZoom, 0.001);
    }
  `;

  const roomMaterial = new THREE.ShaderMaterial({
    uniforms: sharedUniforms,
    vertexShader,
    fragmentShader: `
      ${commonFragment}
      uniform sampler2D uDepth;
      uniform sampler2D uRoom;
      uniform vec2 uArchiveCenter;
      uniform vec2 uPointer;
      uniform float uArchiveClimax;
      uniform float uArchiveRadius;
      uniform float uIntro;
      uniform float uProbeStrength;
      uniform float uReducedMotion;
      uniform float uTime;

      void main() {
        vec2 uv = cameraUv();
        float depth = texture2D(uDepth, clamp(uv, vec2(0.001), vec2(0.999))).r;
        float depthShift = (depth - 0.5) * 0.0045;
        vec2 drift = uPointer * vec2(depthShift, depthShift * 0.56);
        if (uReducedMotion < 0.5) {
          drift += vec2(sin(uTime * 0.11), cos(uTime * 0.09)) * 0.00022;
        }
        vec3 color = texture2D(uRoom, clamp(uv + drift, vec2(0.001), vec2(0.999))).rgb;
        float reveal = smoothstep(0.0, 1.0, uIntro);
        color = mix(vec3(0.055, 0.052, 0.047), color, reveal);
        vec2 archiveDelta = (vUv - uArchiveCenter) * vec2(
          uViewport.x / max(uViewport.y, 1.0),
          1.0
        );
        float archiveDistance = length(archiveDelta) / max(uArchiveRadius, 0.001);
        float archiveField = 1.0 - smoothstep(0.34, 2.7, archiveDistance);
        vec3 projectedRoom = color * vec3(1.045, 1.027, 0.988);
        projectedRoom += mix(
          vec3(0.010, 0.018, 0.022),
          vec3(0.075, 0.046, 0.018),
          archiveField
        );
        color = mix(
          color,
          projectedRoom,
          uArchiveClimax * (0.2 + archiveField * 0.52)
        );
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });

  const instrumentMaterial = new THREE.ShaderMaterial({
    uniforms: sharedUniforms,
    vertexShader,
    fragmentShader: `
      ${commonFragment}
      uniform sampler2D uInstrument;
      uniform vec2 uForegroundShift;
      uniform vec2 uPortalCenter;
      uniform float uIntro;
      uniform float uPortalRadius;

      void main() {
        vec2 uv = cameraUv() + uForegroundShift;
        vec4 instrument = texture2D(
          uInstrument,
          clamp(uv, vec2(0.001), vec2(0.999))
        );
        vec2 metric = (uv - uPortalCenter) * uArtSize /
          max(1.0, min(uArtSize.x, uArtSize.y));
        float innerRadius = uPortalRadius * 0.785;
        float hole = 1.0 - smoothstep(innerRadius - 0.003, innerRadius + 0.003, length(metric));
        instrument.a *= 1.0 - hole;
        instrument.a *= smoothstep(0.12, 0.8, uIntro);
        gl_FragColor = vec4(instrument.rgb, instrument.a);
        #include <colorspace_fragment>
      }
    `,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });

  const room = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), roomMaterial);
  room.name = "continuous-limestone-observatory";
  room.frustumCulled = false;
  room.renderOrder = 0;
  const instrument = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), instrumentMaterial);
  instrument.name = "independent-optical-instrument-occluder";
  instrument.frustumCulled = false;
  instrument.renderOrder = 10;

  return {
    room,
    instrument,
    resize(width, height) {
      sharedUniforms.uViewport.value.set(width, height);
    },
    setArtwork(roomTexture, instrumentTexture, depthTexture, specification) {
      sharedUniforms.uRoom.value = roomTexture;
      sharedUniforms.uInstrument.value = instrumentTexture;
      sharedUniforms.uDepth.value = depthTexture;
      sharedUniforms.uArtSize.value.set(...specification.size);
      sharedUniforms.uPortalCenter.value.set(
        specification.portal[0],
        1 - specification.portal[1],
      );
      sharedUniforms.uPortalRadius.value = specification.portal[2];
    },
    setIntro(value) {
      sharedUniforms.uIntro.value = value;
    },
    setProbe(x, y, strength) {
      sharedUniforms.uPointer.value.set(clamp(x, -1, 1), clamp(y, -1, 1));
      sharedUniforms.uProbeStrength.value = clamp(strength, 0, 1);
      sharedUniforms.uForegroundShift.value.set(
        clamp(x, -1, 1) * -0.00125 * strength,
        clamp(y, -1, 1) * -0.00072 * strength,
      );
    },
    setArchiveClimax(value, portal, width, height) {
      sharedUniforms.uArchiveClimax.value = clamp(value, 0, 1);
      sharedUniforms.uArchiveCenter.value.set(
        portal.x / Math.max(width, 1),
        1 - portal.y / Math.max(height, 1),
      );
      sharedUniforms.uArchiveRadius.value = portal.radius / Math.max(height, 1);
    },
    setView(shot) {
      sharedUniforms.uViewCenter.value.set(shot.centerX, 1 - shot.centerY);
      sharedUniforms.uViewZoom.value = shot.zoom;
    },
    update(time, still) {
      sharedUniforms.uTime.value = still ? 0 : time;
      sharedUniforms.uReducedMotion.value = still ? 1 : 0;
    },
  };
}

function createExactEvidenceMaterial(texture) {
  return new THREE.MeshBasicMaterial({
    map: texture,
    color: 0xffffff,
    transparent: false,
    opacity: 1,
    blending: THREE.NoBlending,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
}

function chamberPointPixels(point, width, height) {
  return new THREE.Vector2(
    ((point.x + 1) * 0.5) * width,
    ((1 - point.y) * 0.5) * height,
  );
}

function chamberPointNdc(x, y, width, height) {
  return new THREE.Vector2((x / width) * 2 - 1, 1 - (y / height) * 2);
}

function setPixelCircle(mesh, x, y, radius, width, height, z = 0.2) {
  mesh.position.set((x / width) * 2 - 1, 1 - (y / height) * 2, z);
  mesh.scale.set((radius / width) * 2, (radius / height) * 2, 1);
}

function setPixelRectangle(mesh, x, y, pixelWidth, pixelHeight, width, height, z = 0.2) {
  mesh.position.set((x / width) * 2 - 1, 1 - (y / height) * 2, z);
  mesh.scale.set((pixelWidth / width) * 2, (pixelHeight / height) * 2, 1);
}

function createInstrumentBeam(color, opacity = 1) {
  const group = new THREE.Group();
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      color: 0x171713,
      transparent: true,
      opacity: opacity * 0.58,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  const body = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  const glint = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      color: 0xf2d7aa,
      transparent: true,
      opacity: opacity * 0.42,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  shadow.position.y = -0.7;
  body.position.z = 0.001;
  glint.position.y = 0.24;
  glint.position.z = 0.002;
  group.add(shadow, body, glint);
  group.userData.parts = { body, glint, shadow };
  return group;
}

function positionInstrumentBeam(beam, start, end, thicknessPixels, width, height, z = 0.24) {
  if (!beam) return;
  const dxPixels = end.x - start.x;
  const dyPixels = end.y - start.y;
  const lengthPixels = Math.max(0.001, Math.hypot(dxPixels, dyPixels));
  const center = chamberPointNdc(
    (start.x + end.x) * 0.5,
    (start.y + end.y) * 0.5,
    width,
    height,
  );
  beam.position.set(center.x, center.y, z);
  beam.rotation.z = -Math.atan2(dyPixels, dxPixels);
  beam.scale.set((lengthPixels / width) * 2, (thicknessPixels / height) * 2, 1);
  const parts = beam.userData.parts;
  if (parts) {
    parts.shadow.position.y = -Math.max(0.6, 1.2 / Math.max(thicknessPixels, 1));
    parts.glint.scale.y = Math.min(0.28, 1 / Math.max(thicknessPixels, 1));
  }
}

function setInstrumentOpacity(beam, opacity, focus = 0) {
  const parts = beam?.userData?.parts;
  if (!parts) return;
  parts.shadow.material.opacity = opacity * (0.48 + focus * 0.12);
  parts.body.material.opacity = clamp(opacity * (0.8 + focus * 0.28), 0, 1);
  parts.glint.material.opacity = clamp(opacity * (0.3 + focus * 0.48), 0, 1);
}

function createApertureCarousel(placeholder) {
  const exactGroup = new THREE.Group();
  exactGroup.name = "exact-aperture-carousel";
  const shutterGroup = new THREE.Group();
  shutterGroup.name = "ten-blade-evidence-shutter";
  const mechanismGroup = new THREE.Group();
  mechanismGroup.name = "aperture-detent-mechanism";

  const exactPlate = new THREE.Mesh(
    new THREE.CircleGeometry(1, 96),
    createExactEvidenceMaterial(placeholder),
  );
  exactPlate.name = "exact-origin-observation";
  exactPlate.renderOrder = 3;
  exactGroup.add(exactPlate);

  const shutterMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uClosure: { value: 1 },
      uProbe: { value: 0 },
      uRotation: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform float uClosure;
      uniform float uProbe;
      uniform float uRotation;
      varying vec2 vUv;

      void main() {
        vec2 point = (vUv - 0.5) * 2.0;
        float radius = length(point);
        float angle = atan(point.y, point.x) + uRotation;
        float bladeEdge = mix(1.08 + uProbe * 0.018, -0.02, uClosure);
        bladeEdge += cos(angle * 10.0) * 0.022 * uClosure * (1.0 - uClosure * 0.7);
        float blade = smoothstep(bladeEdge - 0.018, bladeEdge + 0.012, radius);
        float disc = 1.0 - smoothstep(0.985, 1.0, radius);
        float facet = 0.5 + 0.5 * cos(angle * 10.0);
        vec3 metal = mix(vec3(0.035, 0.033, 0.029), vec3(0.115, 0.096, 0.067), facet * 0.34);
        float seam = pow(1.0 - abs(cos(angle * 5.0)), 22.0) * uClosure;
        metal += seam * vec3(0.12, 0.075, 0.034);
        gl_FragColor = vec4(metal, blade * disc);
      }
    `,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
  const shutter = new THREE.Mesh(new THREE.CircleGeometry(1, 96), shutterMaterial);
  shutter.name = "fully-occluding-physical-iris";
  shutter.renderOrder = 8;
  shutterGroup.add(shutter);

  const outerRing = new THREE.Mesh(
    new THREE.RingGeometry(0.965, 1, 128),
    new THREE.MeshBasicMaterial({
      color: 0xd1a15a,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  const innerRing = new THREE.Mesh(
    new THREE.RingGeometry(0.925, 0.946, 128),
    new THREE.MeshBasicMaterial({
      color: 0xf0d09b,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  outerRing.renderOrder = 12;
  innerRing.renderOrder = 12;
  mechanismGroup.add(outerRing, innerRing);

  let probe = 0;
  let pressed = false;
  let visible = true;

  return {
    exactGroup,
    shutterGroup,
    mechanismGroup,
    layout(portal, width, height) {
      const radius = portal.radius * 0.785;
      setPixelCircle(exactPlate, portal.x, portal.y, radius, width, height, 0.2);
      setPixelCircle(shutter, portal.x, portal.y, radius * 1.015, width, height, 0.22);
      setPixelCircle(outerRing, portal.x, portal.y, radius * 1.02, width, height, 0.29);
      setPixelCircle(innerRing, portal.x, portal.y, radius * 1.02, width, height, 0.291);
      if (!outerRing.userData.baseScale) {
        outerRing.userData.baseScale = outerRing.scale.clone();
      } else {
        outerRing.userData.baseScale.copy(outerRing.scale);
      }
    },
    setTexture(texture) {
      if (!texture) return;
      exactPlate.material.map = texture;
      exactPlate.material.needsUpdate = true;
    },
    setMode(nextVisible) {
      visible = nextVisible;
      exactPlate.visible = visible;
    },
    setProbe(strength, nextPressed) {
      probe = clamp(strength, 0, 1);
      pressed = nextPressed;
      shutterMaterial.uniforms.uProbe.value = probe;
    },
    setShutter(closure) {
      shutterMaterial.uniforms.uClosure.value = clamp(closure, 0, 1);
      shutter.visible = closure > 0.001;
    },
    update(time, _delta, still, originPresence, closure) {
      const motion = still ? 0 : Math.sin(time * 0.18) * 0.006;
      shutterMaterial.uniforms.uRotation.value =
        motion + probe * (pressed ? 0.12 : 0.075) + closure * 0.18;
      outerRing.material.opacity = 0.12 + originPresence * 0.08 + probe * 0.32;
      innerRing.material.opacity = 0.1 + originPresence * 0.06 + probe * 0.26;
      const baseScale = outerRing.userData.baseScale;
      if (baseScale) {
        outerRing.scale.copy(baseScale).multiplyScalar(
          1 + probe * (pressed ? 0.018 : 0.01),
        );
      }
      void visible;
    },
  };
}

function createResponseHarp(profile) {
  const group = new THREE.Group();
  group.name = "parallel-measured-response-harp";
  group.position.z = 0.3;
  const focusColor = new THREE.Color(0xffdf9a);
  const rods = [];
  const endpoints = [];
  const ticks = [];
  let items = [];
  let width = 1;
  let height = 1;
  let compact = profile.mobile;
  let probeIndex = -1;
  let probeStrength = 0;
  let probePressed = false;
  let baseX = 0;

  function clear() {
    for (const child of [...group.children]) {
      group.remove(child);
      child.traverse?.((node) => {
        node.geometry?.dispose?.();
        node.material?.dispose?.();
      });
    }
    rods.length = 0;
    endpoints.length = 0;
    ticks.length = 0;
  }

  function rebuild() {
    clear();
    items.forEach((item) => {
      const color = item.value < 0 ? PALETTE.cool : PALETTE.warm;
      const rod = createInstrumentBeam(color, 0.84);
      const endpoint = new THREE.Mesh(
        new THREE.RingGeometry(0.62, 1, 24),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.9,
          depthTest: false,
          depthWrite: false,
          toneMapped: false,
        }),
      );
      const tick = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({
          color: 0xb8a98f,
          transparent: true,
          opacity: 0.52,
          depthTest: false,
          depthWrite: false,
          toneMapped: false,
        }),
      );
      rod.renderOrder = 13;
      endpoint.renderOrder = 14;
      tick.renderOrder = 12;
      const parts = rod.userData.parts;
      if (parts) {
        rod.userData.baseBodyColor = parts.body.material.color.clone();
        rod.userData.baseGlintColor = parts.glint.material.color.clone();
      }
      endpoint.userData.baseColor = endpoint.material.color.clone();
      group.add(tick, rod, endpoint);
      rods.push(rod);
      endpoints.push(endpoint);
      ticks.push(tick);
    });
  }

  return {
    group,
    compose(response) {
      items = (response?.deltas ?? [])
        .filter((item) => Number.isFinite(item.value) && Math.abs(item.value) > 0.0001)
        .sort((left, right) => Math.abs(right.value) - Math.abs(left.value))
        .slice(0, 7);
      rebuild();
    },
    layout(portal, nextWidth, nextHeight, nextCompact) {
      width = Math.max(1, nextWidth);
      height = Math.max(1, nextHeight);
      compact = nextCompact;
      const count = compact ? Math.min(5, items.length) : items.length;
      const maximum = Math.max(0.0001, ...items.map((item) => Math.abs(item.value)));
      const spacing = compact ? 17 : 25;
      const maximumLength = compact
        ? Math.min(92, width * 0.25)
        : Math.min(248, width * 0.18);
      const zeroX = compact
        ? portal.x - portal.radius * 0.12
        : portal.x - portal.radius * 1.02;
      const centerY = compact
        ? portal.y + portal.radius * 1.08
        : portal.y + portal.radius * 0.74;
      const firstY = centerY - ((count - 1) * spacing) * 0.5;
      baseX = compact ? 22 : 34;
      items.forEach((item, index) => {
        const amount = Math.abs(item.value) / maximum;
        const direction = item.value < 0 ? -1 : 1;
        const y = firstY + index * spacing;
        const endX = zeroX + direction * Math.max(18, maximumLength * amount);
        const start = new THREE.Vector2(zeroX, y);
        const end = new THREE.Vector2(endX, y);
        positionInstrumentBeam(rods[index], start, end, compact ? 3.2 : 4.2, width, height, 0.31);
        rods[index].userData.basePosition = rods[index].position.clone();
        rods[index].userData.probeStart = chamberPointNdc(start.x, start.y, width, height);
        rods[index].userData.probeEnd = chamberPointNdc(end.x, end.y, width, height);
        setPixelCircle(
          endpoints[index],
          end.x,
          end.y,
          compact ? 4.5 : 5.5,
          width,
          height,
          0.33,
        );
        endpoints[index].userData.basePosition = endpoints[index].position.clone();
        if (!endpoints[index].userData.baseScale) {
          endpoints[index].userData.baseScale = endpoints[index].scale.clone();
        } else {
          endpoints[index].userData.baseScale.copy(endpoints[index].scale);
        }
        setPixelRectangle(
          ticks[index],
          zeroX,
          y,
          compact ? 1.4 : 1.8,
          compact ? 11 : 15,
          width,
          height,
          0.3,
        );
        ticks[index].userData.basePosition = ticks[index].position.clone();
        const isVisible = index < count;
        rods[index].visible = isVisible;
        endpoints[index].visible = isVisible;
        ticks[index].visible = isVisible;
      });
    },
    resolveProbe(point, radiusPixels = 44) {
      let nearestIndex = -1;
      let nearestDistance = Infinity;
      const count = compact ? Math.min(5, rods.length) : rods.length;
      for (let index = 0; index < count; index += 1) {
        const start = rods[index]?.userData.probeStart;
        const end = rods[index]?.userData.probeEnd;
        if (!start || !end) continue;
        const distance = pointSegmentDistancePixels(point, start, end, width, height);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      }
      return nearestIndex >= 0 && nearestDistance <= radiusPixels
        ? { point, surface: `response:beam:${nearestIndex}` }
        : null;
    },
    setProbe(index, strength, pressed) {
      probeIndex = index;
      probeStrength = clamp(strength, 0, 1);
      probePressed = pressed;
    },
    update(presence, _time, _still) {
      group.visible = presence > 0.002;
      group.position.x = (baseX / width) * 2 * (1 - presence);
      rods.forEach((rod, index) => {
        const focus = index === probeIndex ? probeStrength : 0;
        const subordinate = probeIndex >= 0 && index !== probeIndex
          ? 1 - probeStrength * 0.68
          : 1;
        setInstrumentOpacity(
          rod,
          presence * (0.72 + index * 0.025) * subordinate,
          focus * 1.4,
        );
        const basePosition = rod.userData.basePosition;
        if (basePosition) {
          const displacement = (compact ? 7 : 11) * focus;
          rod.position.copy(basePosition);
          rod.position.y += (displacement / height) * 2;
        }
        const parts = rod.userData.parts;
        if (parts && rod.userData.baseBodyColor && rod.userData.baseGlintColor) {
          parts.body.material.color.lerpColors(
            rod.userData.baseBodyColor,
            focusColor,
            focus * 0.76,
          );
          parts.glint.material.color.lerpColors(
            rod.userData.baseGlintColor,
            focusColor,
            focus * 0.9,
          );
        }
      });
      endpoints.forEach((node, index) => {
        const focus = index === probeIndex ? probeStrength : 0;
        const subordinate = probeIndex >= 0 && index !== probeIndex
          ? 1 - probeStrength * 0.72
          : 1;
        node.material.opacity = clamp(
          presence * (0.62 + focus * 0.48) * subordinate,
          0,
          1,
        );
        const basePosition = node.userData.basePosition;
        if (basePosition) {
          const displacement = (compact ? 7 : 11) * focus;
          node.position.copy(basePosition);
          node.position.y += (displacement / height) * 2;
        }
        if (node.userData.baseColor) {
          node.material.color.lerpColors(
            node.userData.baseColor,
            focusColor,
            focus * 0.82,
          );
        }
        const baseScale = node.userData.baseScale;
        if (!baseScale) node.userData.baseScale = node.scale.clone();
        else node.scale.copy(baseScale).multiplyScalar(1 + focus * (probePressed ? 0.82 : 0.58));
      });
      ticks.forEach((tick, index) => {
        const focus = index === probeIndex ? probeStrength : 0;
        const subordinate = probeIndex >= 0 && index !== probeIndex
          ? 1 - probeStrength * 0.7
          : 1;
        tick.material.opacity = presence * (0.38 + focus * 0.42) * subordinate;
      });
    },
  };
}

function buildDiscSliceGeometry(minimumX, maximumX, segments = 56) {
  const minX = clamp(minimumX, -1, 1);
  const maxX = clamp(maximumX, -1, 1);
  const positions = [];
  const uvs = [];
  if (maxX - minX <= 0.0001) {
    return new THREE.BufferGeometry();
  }
  for (let index = 0; index < segments; index += 1) {
    const x0 = minX + ((maxX - minX) * index) / segments;
    const x1 = minX + ((maxX - minX) * (index + 1)) / segments;
    const y0 = Math.sqrt(Math.max(0, 1 - x0 * x0));
    const y1 = Math.sqrt(Math.max(0, 1 - x1 * x1));
    const vertices = [
      [x0, -y0], [x1, -y1], [x1, y1],
      [x0, -y0], [x1, y1], [x0, y0],
    ];
    vertices.forEach(([x, y]) => {
      positions.push(x, y, 0);
      uvs.push(x * 0.5 + 0.5, y * 0.5 + 0.5);
    });
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  return geometry;
}

function createKnifeEdgeComparator(placeholder) {
  const exactGroup = new THREE.Group();
  exactGroup.name = "exact-twin-aperture-comparator";
  const mechanismGroup = new THREE.Group();
  mechanismGroup.name = "physical-comparator-knife-edge";
  const materialA = createExactEvidenceMaterial(placeholder);
  const materialB = createExactEvidenceMaterial(placeholder);
  const plateA = new THREE.Mesh(buildDiscSliceGeometry(-1, 0.18), materialA);
  const plateB = new THREE.Mesh(buildDiscSliceGeometry(0.18, 1), materialB);
  plateA.name = "exact-halation-disc-slice";
  plateB.name = "exact-bloom-disc-slice";
  plateA.renderOrder = 4;
  plateB.renderOrder = 4;
  exactGroup.add(plateA, plateB);

  const divider = createInstrumentBeam(0xd8aa65, 0.9);
  const handle = new THREE.Mesh(
    new THREE.RingGeometry(0.58, 1, 32),
    new THREE.MeshBasicMaterial({
      color: 0xe7bd7d,
      transparent: true,
      opacity: 0.88,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  divider.renderOrder = 14;
  handle.renderOrder = 15;
  mechanismGroup.add(divider, handle);

  let width = 1;
  let height = 1;
  let compact = false;
  let portal = { x: 0.5, y: 0.5, radius: 1 };
  let dividerValue = 0.18;
  let dividerTarget = 0.18;
  let direct = false;
  let directTarget = 0.18;
  let probeStrength = 0;
  let pressed = false;
  let visible = false;
  let geometryDivider = NaN;

  function applyDivider() {
    if (Math.abs(dividerValue - geometryDivider) > 0.002) {
      plateA.geometry.dispose();
      plateB.geometry.dispose();
      plateA.geometry = buildDiscSliceGeometry(-1, dividerValue);
      plateB.geometry = buildDiscSliceGeometry(dividerValue, 1);
      geometryDivider = dividerValue;
    }
    const radius = portal.radius * 0.785;
    const x = portal.x + dividerValue * radius;
    positionInstrumentBeam(
      divider,
      new THREE.Vector2(x, portal.y - radius * 0.93),
      new THREE.Vector2(x, portal.y + radius * 0.93),
      compact ? 2.1 : 2.6,
      width,
      height,
      0.32,
    );
    setPixelCircle(handle, x, portal.y, compact ? 7 : 8.5, width, height, 0.34);
    if (!handle.userData.baseScale) handle.userData.baseScale = handle.scale.clone();
    else handle.userData.baseScale.copy(handle.scale);
  }

  return {
    exactGroup,
    mechanismGroup,
    layout(nextPortal, nextWidth, nextHeight, nextCompact) {
      portal = nextPortal;
      width = Math.max(1, nextWidth);
      height = Math.max(1, nextHeight);
      compact = nextCompact;
      const radius = portal.radius * 0.785;
      setPixelCircle(plateA, portal.x, portal.y, radius, width, height, 0.21);
      setPixelCircle(plateB, portal.x, portal.y, radius, width, height, 0.21);
      applyDivider();
    },
    probeAnchor(value) {
      const selected = value === "bloom" ? -0.18 : 0.18;
      return {
        direct: true,
        point: chamberPointNdc(
          portal.x + selected * portal.radius * 0.785,
          portal.y,
          width,
          height,
        ),
        surface: "discriminate:divider",
      };
    },
    resolveProbe(point) {
      const pixel = chamberPointPixels(point, width, height);
      const radius = portal.radius * 0.8;
      if (Math.hypot(pixel.x - portal.x, pixel.y - portal.y) > radius * 1.08) return null;
      return { direct: true, point, surface: "discriminate:divider" };
    },
    setSelection(selection, immediate) {
      dividerTarget = selection === "bloom" ? -0.18 : 0.18;
      if (immediate) {
        dividerValue = dividerTarget;
        geometryDivider = NaN;
      }
    },
    setTexture(key, texture) {
      if (!texture) return;
      const material = key === "bloom" ? materialB : materialA;
      material.map = texture;
      material.needsUpdate = true;
    },
    setMode(nextVisible) {
      visible = nextVisible;
      exactGroup.visible = visible;
    },
    setProbe(nextProbe) {
      direct = nextProbe.scene === "discriminate" && nextProbe.direct && nextProbe.active;
      if (direct) {
        const targetPixels = chamberPointPixels(
          new THREE.Vector2(nextProbe.targetX, nextProbe.y),
          width,
          height,
        );
        directTarget = clamp(
          (targetPixels.x - portal.x) / Math.max(1, portal.radius * 0.785),
          -0.82,
          0.82,
        );
      }
      probeStrength = nextProbe.surface === "discriminate:divider"
        ? clamp(nextProbe.strength, 0, 1)
        : 0;
      pressed = nextProbe.pressed;
    },
    update(presence, delta, still) {
      const target = direct ? directTarget : dividerTarget;
      dividerValue += (target - dividerValue) * (still ? 1 : 1 - Math.exp(-delta * (direct ? 34 : 8)));
      applyDivider();
      mechanismGroup.visible = presence > 0.002;
      setInstrumentOpacity(divider, presence * 0.9, probeStrength);
      handle.material.opacity = clamp(presence * (0.68 + probeStrength * 0.32), 0, 1);
      const baseScale = handle.userData.baseScale;
      if (!baseScale) handle.userData.baseScale = handle.scale.clone();
      else handle.scale.copy(baseScale).multiplyScalar(1 + probeStrength * (pressed ? 0.3 : 0.16));
      exactGroup.position.y = (1 - presence) * -0.045;
      mechanismGroup.position.y = (1 - presence) * -0.045;
      void visible;
    },
  };
}

function createCorrelationGoniometer(profile) {
  const group = new THREE.Group();
  group.name = "literal-correlation-goniometer";
  group.position.z = 0.31;
  const focusColor = new THREE.Color(0xffdfa0);
  let relevant = [];
  let rays = [];
  let endpoints = [];
  let arcs = [];
  let baseline = null;
  let collet = null;
  let width = 1;
  let height = 1;
  let compact = profile.mobile;
  let originPixels = new THREE.Vector2();
  let probeIndex = -1;
  let probeCollet = false;
  let probeStrength = 0;
  let probePressed = false;
  let enterOffset = 0;

  function clear() {
    for (const child of [...group.children]) {
      group.remove(child);
      child.traverse?.((node) => {
        node.geometry?.dispose?.();
        node.material?.dispose?.();
      });
    }
    rays = [];
    endpoints = [];
    arcs = [];
    baseline = null;
    collet = null;
  }

  function updateArcGeometry(arc, points) {
    const required = points.length * 3;
    let position = arc.geometry.getAttribute("position");
    if (!position || position.array.length !== required) {
      position = new THREE.BufferAttribute(new Float32Array(required), 3);
      position.setUsage(THREE.DynamicDrawUsage);
      arc.geometry.setAttribute("position", position);
    }
    points.forEach((point, index) => {
      position.setXYZ(index, point.x, point.y, point.z);
    });
    position.needsUpdate = true;
    arc.geometry.setDrawRange(0, points.length);
  }

  function rebuild() {
    clear();
    baseline = createInstrumentBeam(0xa99a84, 0.58);
    baseline.renderOrder = 12;
    collet = new THREE.Mesh(
      new THREE.RingGeometry(0.46, 1, 40),
      new THREE.MeshBasicMaterial({
        color: 0xe1b36f,
        transparent: true,
        opacity: 0.88,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    collet.userData.baseColor = collet.material.color.clone();
    collet.renderOrder = 15;
    group.add(baseline, collet);
    relevant.forEach((item) => {
      const color = item.r < 0 ? PALETTE.cool : PALETTE.warm;
      const ray = createInstrumentBeam(color, 0.82);
      const endpoint = new THREE.Mesh(
        new THREE.RingGeometry(0.58, 1, 28),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.82,
          depthTest: false,
          depthWrite: false,
          toneMapped: false,
        }),
      );
      const arc = new THREE.Line(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0.24,
          depthTest: false,
          depthWrite: false,
          toneMapped: false,
        }),
      );
      arc.frustumCulled = false;
      ray.renderOrder = 13;
      arc.renderOrder = 12;
      endpoint.renderOrder = 14;
      const parts = ray.userData.parts;
      if (parts) {
        ray.userData.baseBodyColor = parts.body.material.color.clone();
        ray.userData.baseGlintColor = parts.glint.material.color.clone();
      }
      endpoint.userData.baseColor = endpoint.material.color.clone();
      group.add(arc, ray, endpoint);
      rays.push(ray);
      endpoints.push(endpoint);
      arcs.push(arc);
    });
  }

  return {
    group,
    compose(axis, correlations) {
      relevant = correlations
        .filter((item) => item.a === axis || item.b === axis)
        .sort((left, right) => Math.abs(right.r) - Math.abs(left.r))
        .slice(0, 5);
      rebuild();
    },
    layout(portal, nextWidth, nextHeight, nextCompact) {
      width = Math.max(1, nextWidth);
      height = Math.max(1, nextHeight);
      compact = nextCompact;
      const count = compact ? Math.min(3, relevant.length) : relevant.length;
      const length = compact
        ? Math.min(126, portal.radius * 1.08)
        : Math.min(238, portal.radius * 1.18);
      originPixels.set(
        compact ? portal.x - portal.radius * 0.34 : portal.x - portal.radius * 0.78,
        compact ? portal.y + portal.radius * 0.62 : portal.y + portal.radius * 0.48,
      );
      enterOffset = compact ? 22 : 42;
      positionInstrumentBeam(
        baseline,
        originPixels,
        new THREE.Vector2(originPixels.x + length * 1.04, originPixels.y),
        compact ? 1.5 : 1.8,
        width,
        height,
        0.31,
      );
      setPixelCircle(
        collet,
        originPixels.x,
        originPixels.y,
        compact ? 7 : 9,
        width,
        height,
        0.35,
      );
      collet.userData.basePosition = collet.position.clone();
      if (!collet.userData.baseScale) collet.userData.baseScale = collet.scale.clone();
      else collet.userData.baseScale.copy(collet.scale);
      rays.forEach((ray, index) => {
        const theta = Math.acos(clamp(relevant[index].r, -1, 1));
        const endpoint = new THREE.Vector2(
          originPixels.x + Math.cos(theta) * length,
          originPixels.y - Math.sin(theta) * length,
        );
        positionInstrumentBeam(
          ray,
          originPixels,
          endpoint,
          compact ? 2.4 : 3,
          width,
          height,
          0.33,
        );
        ray.userData.literalStart = originPixels.clone();
        ray.userData.literalDirection = new THREE.Vector2(
          Math.cos(theta),
          -Math.sin(theta),
        );
        ray.userData.literalLength = length;
        ray.userData.literalThickness = compact ? 2.4 : 3;
        ray.userData.probeStart = chamberPointNdc(
          originPixels.x,
          originPixels.y,
          width,
          height,
        );
        ray.userData.probeEnd = chamberPointNdc(endpoint.x, endpoint.y, width, height);
        ray.userData.theta = theta;
        setPixelCircle(
          endpoints[index],
          endpoint.x,
          endpoint.y,
          compact ? 4.5 : 5.5,
          width,
          height,
          0.34,
        );
        if (!endpoints[index].userData.baseScale) {
          endpoints[index].userData.baseScale = endpoints[index].scale.clone();
        } else {
          endpoints[index].userData.baseScale.copy(endpoints[index].scale);
        }

        const arcRadius = (compact ? 26 : 38) + index * (compact ? 4 : 6);
        const arcPoints = [];
        const arcSegments = Math.max(5, Math.ceil(theta / (Math.PI / 24)));
        for (let step = 0; step <= arcSegments; step += 1) {
          const angle = theta * (step / arcSegments);
          arcPoints.push(
            new THREE.Vector3(
              ((originPixels.x + Math.cos(angle) * arcRadius) / width) * 2 - 1,
              1 - ((originPixels.y - Math.sin(angle) * arcRadius) / height) * 2,
              0.32,
            ),
          );
        }
        updateArcGeometry(arcs[index], arcPoints);
        const isVisible = index < count;
        ray.visible = isVisible;
        endpoints[index].visible = isVisible;
        arcs[index].visible = isVisible;
      });
    },
    probeAnchor() {
      return {
        point: chamberPointNdc(originPixels.x, originPixels.y, width, height),
        surface: "association:collet",
      };
    },
    resolveProbe(point) {
      const pixel = chamberPointPixels(point, width, height);
      if (pixel.distanceTo(originPixels) <= (compact ? 28 : 34)) {
        return { point, surface: "association:collet" };
      }
      let nearestIndex = -1;
      let nearestDistance = Infinity;
      const count = compact ? Math.min(3, rays.length) : rays.length;
      for (let index = 0; index < count; index += 1) {
        const start = rays[index]?.userData.probeStart;
        const end = rays[index]?.userData.probeEnd;
        if (!start || !end) continue;
        const distance = pointSegmentDistancePixels(point, start, end, width, height);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      }
      return nearestIndex >= 0 && nearestDistance <= (compact ? 28 : 34)
        ? { point, surface: `association:ray:${nearestIndex}` }
        : null;
    },
    setProbe(index, nextCollet, strength, pressed) {
      probeIndex = index;
      probeCollet = nextCollet;
      probeStrength = clamp(strength, 0, 1);
      probePressed = pressed;
    },
    update(presence, _time, _still) {
      group.visible = presence > 0.002;
      group.position.y = -(enterOffset / height) * 2 * (1 - presence);
      if (baseline) setInstrumentOpacity(baseline, presence * 0.54, 0);
      if (collet) {
        const focus = probeCollet ? probeStrength : 0;
        const rayFocus = probeIndex >= 0 ? probeStrength : 0;
        const mechanicalFocus = Math.max(focus, rayFocus * 0.72);
        collet.material.opacity = clamp(
          presence * (0.68 + mechanicalFocus * 0.5),
          0,
          1,
        );
        if (collet.userData.baseColor) {
          collet.material.color.lerpColors(
            collet.userData.baseColor,
            focusColor,
            mechanicalFocus * 0.84,
          );
        }
        const basePosition = collet.userData.basePosition;
        if (basePosition) collet.position.copy(basePosition);
        collet.position.y += ((compact ? 6 : 9) / height) * 2 * focus;
        const baseScale = collet.userData.baseScale;
        if (!baseScale) collet.userData.baseScale = collet.scale.clone();
        else {
          collet.scale.copy(baseScale).multiplyScalar(
            1 + mechanicalFocus * (probePressed ? 0.78 : 0.58),
          );
        }
      }
      rays.forEach((ray, index) => {
        const focus = index === probeIndex ? probeStrength : 0;
        const colletFocus = probeCollet ? probeStrength : 0;
        const subordinate = probeIndex >= 0 && index !== probeIndex
          ? 1 - probeStrength * 0.88
          : 1;
        // Correlation is encoded only by theta. The probe may run the carriage
        // farther along the same literal ray, but never rotates that ray.
        const start = ray.userData.literalStart;
        const direction = ray.userData.literalDirection;
        const literalLength = ray.userData.literalLength;
        if (start && direction && Number.isFinite(literalLength)) {
          const extension = focus * (compact ? 34 : 68) + colletFocus * (compact ? 10 : 18);
          const endpointPixels = start.clone().addScaledVector(
            direction,
            literalLength + extension,
          );
          positionInstrumentBeam(
            ray,
            start,
            endpointPixels,
            ray.userData.literalThickness * (1 + focus * 0.55),
            width,
            height,
            0.33,
          );
          ray.userData.probeStart = chamberPointNdc(start.x, start.y, width, height);
          ray.userData.probeEnd = chamberPointNdc(
            endpointPixels.x,
            endpointPixels.y,
            width,
            height,
          );
          setPixelCircle(
            endpoints[index],
            endpointPixels.x,
            endpointPixels.y,
            compact ? 4.5 : 5.5,
            width,
            height,
            0.34,
          );
          endpoints[index].scale.multiplyScalar(
            1 + focus * (probePressed ? 1.3 : 1.02) + colletFocus * 0.22,
          );
        }
        setInstrumentOpacity(
          ray,
          presence * (0.68 - index * 0.045) * subordinate,
          focus * 1.5 + colletFocus * 0.3,
        );
        const parts = ray.userData.parts;
        if (parts && ray.userData.baseBodyColor && ray.userData.baseGlintColor) {
          parts.body.material.color.lerpColors(
            ray.userData.baseBodyColor,
            focusColor,
            focus * 0.78 + colletFocus * 0.14,
          );
          parts.glint.material.color.lerpColors(
            ray.userData.baseGlintColor,
            focusColor,
            focus * 0.92 + colletFocus * 0.18,
          );
        }
        endpoints[index].material.opacity = clamp(
          presence * (0.54 + focus * 0.6 + colletFocus * 0.16) * subordinate,
          0,
          1,
        );
        if (endpoints[index].userData.baseColor) {
          endpoints[index].material.color.lerpColors(
            endpoints[index].userData.baseColor,
            focusColor,
            focus * 0.84 + colletFocus * 0.12,
          );
        }
        arcs[index].material.opacity = clamp(
          presence * (0.14 + focus * 0.68 + colletFocus * 0.1) * subordinate,
          0,
          0.84,
        );
      });
    },
  };
}

function createLoupeOverlay(placeholder) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uLoupeRadius: { value: 46 },
      uMap: { value: placeholder },
      uPlateSize: { value: new THREE.Vector2(1, 1) },
      uProbeStrength: { value: 0 },
      uProbeUv: { value: new THREE.Vector2(0.5, 0.5) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform sampler2D uMap;
      uniform vec2 uPlateSize;
      uniform vec2 uProbeUv;
      uniform float uLoupeRadius;
      uniform float uProbeStrength;
      varying vec2 vUv;

      void main() {
        vec2 pixelDelta = (vUv - uProbeUv) * uPlateSize;
        float distanceFromProbe = length(pixelDelta);
        float lens = 1.0 - smoothstep(uLoupeRadius - 1.25, uLoupeRadius + 1.25, distanceFromProbe);
        vec2 sampledUv = uProbeUv + (vUv - uProbeUv) / 1.35;
        vec3 exactMagnified = texture2D(
          uMap,
          clamp(sampledUv, vec2(0.001), vec2(0.999))
        ).rgb;
        float rim = 1.0 - smoothstep(0.55, 2.9, abs(distanceFromProbe - uLoupeRadius));
        float rimGlow = 1.0 - smoothstep(2.0, 5.5, abs(distanceFromProbe - uLoupeRadius));
        float innerShade = smoothstep(
          uLoupeRadius - 5.0,
          uLoupeRadius - 1.0,
          distanceFromProbe
        ) * lens;
        vec3 color = exactMagnified * (1.0 - innerShade * 0.075);
        color += rim * vec3(0.42, 0.255, 0.09);
        color += rimGlow * vec3(0.055, 0.035, 0.015);
        gl_FragColor = vec4(color, max(lens, rimGlow) * uProbeStrength);
        #include <colorspace_fragment>
      }
    `,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(new THREE.CircleGeometry(1, 96), material);
  mesh.name = "ninety-two-pixel-exact-evidence-loupe";
  mesh.renderOrder = 15;
  mesh.visible = false;
  return mesh;
}

function createHypothesisRail(reconstructionModel, placeholder) {
  const exactGroup = new THREE.Group();
  exactGroup.name = "sequential-exact-reconstruction-aperture";
  const mechanismGroup = new THREE.Group();
  mechanismGroup.name = "manual-hypothesis-and-residual-rail";
  const plates = [0, 1].map((index) => {
    const plate = new THREE.Mesh(
      new THREE.CircleGeometry(1, 96),
      createExactEvidenceMaterial(placeholder),
    );
    plate.name = `exact-reconstruction-plate-${index + 1}`;
    plate.renderOrder = 4;
    plate.visible = false;
    exactGroup.add(plate);
    return plate;
  });
  const loupe = createLoupeOverlay(placeholder);
  exactGroup.add(loupe);

  const weights = (reconstructionModel?.weights ?? [])
    .filter((item) => Number.isFinite(item.weight))
    .slice(0, 3);
  const residuals = (reconstructionModel?.residuals ?? [])
    .filter((item) => Number.isFinite(item.count) && Number.isFinite(item.n) && item.n > 0)
    .slice(0, 4);
  const weightRails = [];
  const weightNodes = [];
  const residualRods = [];
  const residualNodes = [];

  weights.forEach((item) => {
    const rail = createInstrumentBeam(0x9f8f78, 0.64);
    const node = new THREE.Mesh(
      new THREE.RingGeometry(0.5, 1, 30),
      new THREE.MeshBasicMaterial({
        color: 0xd8aa63,
        transparent: true,
        opacity: 0.86,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    rail.renderOrder = 12;
    node.renderOrder = 14;
    mechanismGroup.add(rail, node);
    weightRails.push(rail);
    weightNodes.push(node);
  });
  residuals.forEach((item) => {
    const rod = createInstrumentBeam(0x8e9aa0, 0.64);
    const node = new THREE.Mesh(
      new THREE.CircleGeometry(1, 20),
      new THREE.MeshBasicMaterial({
        color: 0xb3c0c4,
        transparent: true,
        opacity: 0.76,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    rod.renderOrder = 12;
    node.renderOrder = 13;
    mechanismGroup.add(rod, node);
    residualRods.push(rod);
    residualNodes.push(node);
  });
  const plaque = createTextSprite("MANUAL HYPOTHESIS · NOT FITTED");
  plaque.name = "hypothesis-disclosure-plate";
  plaque.renderOrder = 14;
  mechanismGroup.add(plaque);

  let width = 1;
  let height = 1;
  let compact = false;
  let portal = { x: 0.5, y: 0.5, radius: 1 };
  let activeIndex = -1;
  let probeIndex = -1;
  let probeStrength = 0;
  const probeUv = new THREE.Vector2(0.5, 0.5);
  let mode = false;
  let railOffset = 0;

  function syncLoupe() {
    if (activeIndex < 0 || !plates[activeIndex]?.visible) {
      loupe.visible = false;
      return;
    }
    const plate = plates[activeIndex];
    loupe.position.copy(plate.position);
    loupe.position.z = 0.36;
    loupe.scale.copy(plate.scale);
    loupe.material.uniforms.uMap.value = plate.material.map;
    loupe.material.uniforms.uPlateSize.value.set(portal.radius * 1.57, portal.radius * 1.57);
    loupe.material.uniforms.uProbeUv.value.copy(probeUv);
    loupe.material.uniforms.uProbeStrength.value = probeStrength;
    loupe.visible = probeIndex === activeIndex && probeStrength > 0.002;
  }

  return {
    exactGroup,
    mechanismGroup,
    layout(nextPortal, nextWidth, nextHeight, nextCompact) {
      portal = nextPortal;
      width = Math.max(1, nextWidth);
      height = Math.max(1, nextHeight);
      compact = nextCompact;
      const apertureRadius = portal.radius * 0.785;
      plates.forEach((plate) => {
        setPixelCircle(plate, portal.x, portal.y, apertureRadius, width, height, 0.21);
      });
      railOffset = compact ? 24 : 44;
      const trackLength = compact
        ? Math.min(104, width * 0.28)
        : Math.min(210, width * 0.16);
      const originX = compact
        ? portal.x - portal.radius * 0.92
        : portal.x - portal.radius * 1.32;
      const originY = compact
        ? portal.y + portal.radius * 0.88
        : portal.y + portal.radius * 0.68;
      const spacing = compact ? 16 : 22;
      weights.forEach((item, index) => {
        const y = originY + index * spacing;
        const start = new THREE.Vector2(originX, y);
        const end = new THREE.Vector2(originX + trackLength, y);
        positionInstrumentBeam(
          weightRails[index],
          start,
          end,
          compact ? 1.5 : 1.8,
          width,
          height,
          0.31,
        );
        const normalizedWeight = clamp(Math.abs(item.weight), 0, 1);
        setPixelCircle(
          weightNodes[index],
          originX + trackLength * normalizedWeight,
          y,
          compact ? 4.5 : 5.5,
          width,
          height,
          0.34,
        );
      });
      const residualOriginX = compact
        ? portal.x + portal.radius * 0.58
        : portal.x + portal.radius * 0.82;
      const residualOriginY = compact
        ? portal.y + portal.radius * 0.95
        : portal.y + portal.radius * 0.78;
      const residualLength = compact
        ? Math.min(74, width * 0.2)
        : Math.min(145, width * 0.11);
      residuals.forEach((item, index) => {
        const y = residualOriginY + index * (compact ? 13 : 17);
        const amount = clamp(item.count / item.n, 0, 1);
        const start = new THREE.Vector2(residualOriginX, y);
        const end = new THREE.Vector2(residualOriginX + residualLength * amount, y);
        positionInstrumentBeam(
          residualRods[index],
          start,
          end,
          compact ? 2.1 : 2.5,
          width,
          height,
          0.32,
        );
        setPixelCircle(
          residualNodes[index],
          end.x,
          end.y,
          compact ? 2.4 : 3.1,
          width,
          height,
          0.33,
        );
      });
      setPixelRectangle(
        plaque,
        compact ? portal.x : originX + trackLength * 0.5,
        compact ? originY + weights.length * spacing + 18 : originY + weights.length * spacing + 20,
        compact ? Math.min(184, width * 0.58) : 228,
        compact ? 18 : 20,
        width,
        height,
        0.35,
      );
      syncLoupe();
    },
    setTexture(index, texture) {
      if (!plates[index] || !texture) return;
      plates[index].material.map = texture;
      plates[index].material.needsUpdate = true;
      if (index === activeIndex) loupe.material.uniforms.uMap.value = texture;
    },
    shutter(sceneName, progress) {
      if (sceneName !== "reconstruct") return 0;
      if (progress < MOBILE_RECONSTRUCTION_EXACT_START) return 1;
      if (progress < 0.37) {
        return 1 - smootherStep(MOBILE_RECONSTRUCTION_EXACT_START, 0.37, progress);
      }
      if (progress < 0.59) return smootherStep(0.54, 0.59, progress);
      if (progress < MOBILE_RECONSTRUCTION_RESIDUAL_START) return 1;
      return 1 - smootherStep(MOBILE_RECONSTRUCTION_RESIDUAL_START, 0.66, progress);
    },
    setMode(nextMode, sceneName, progress) {
      mode = nextMode && sceneName === "reconstruct";
      const nextIndex = mode && progress >= MOBILE_RECONSTRUCTION_EXACT_START
        ? progress >= MOBILE_RECONSTRUCTION_RESIDUAL_START ? 1 : 0
        : -1;
      activeIndex = nextIndex;
      plates.forEach((plate, index) => {
        plate.visible = index === activeIndex;
      });
      exactGroup.visible = activeIndex >= 0;
      syncLoupe();
    },
    resolveProbe(point) {
      if (!mode || activeIndex < 0 || !plates[activeIndex].visible) return null;
      const pixel = chamberPointPixels(point, width, height);
      const radius = portal.radius * 0.785;
      if (Math.hypot(pixel.x - portal.x, pixel.y - portal.y) > radius) return null;
      return { point, surface: `reconstruct:plate:${activeIndex}` };
    },
    setProbe(nextProbe, strength) {
      const match = /^reconstruct:plate:(\d+)$/.exec(nextProbe.surface);
      const nextIndex = match ? Number(match[1]) : -1;
      if (nextIndex !== activeIndex) {
        probeIndex = -1;
        probeStrength = 0;
        syncLoupe();
        return;
      }
      const pixel = chamberPointPixels(new THREE.Vector2(nextProbe.x, nextProbe.y), width, height);
      const diameter = Math.max(1, portal.radius * 1.57);
      const u = (pixel.x - (portal.x - diameter * 0.5)) / diameter;
      const v = 1 - (pixel.y - (portal.y - diameter * 0.5)) / diameter;
      const margin = Math.min(0.48, 46 / diameter);
      probeUv.set(clamp(u, margin, 1 - margin), clamp(v, margin, 1 - margin));
      probeIndex = activeIndex;
      probeStrength = clamp(strength, 0, 1);
      syncLoupe();
    },
    update(presence, _time, _still, sceneName, progress) {
      mechanismGroup.visible = presence > 0.002;
      mechanismGroup.position.x = -(railOffset / width) * 2 * (1 - presence);
      weightRails.forEach((rail) => setInstrumentOpacity(rail, presence * 0.58, 0));
      weightNodes.forEach((node) => {
        node.material.opacity = presence * 0.78;
      });
      const residualReveal = sceneName === "reconstruct"
        ? smootherStep(MOBILE_RECONSTRUCTION_RESIDUAL_START, 0.78, progress)
        : 0;
      residualRods.forEach((rod) => setInstrumentOpacity(rod, presence * residualReveal * 0.7, 0));
      residualNodes.forEach((node) => {
        node.material.opacity = presence * residualReveal * 0.78;
      });
      plaque.material.opacity = presence * 0.82;
      syncLoupe();
    },
  };
}

function setAtlasCellUv(geometry, minimumU, minimumV, maximumU, maximumV) {
  const uv = geometry.attributes.uv;
  if (!uv || uv.count < 4) return;
  uv.setXY(0, minimumU, maximumV);
  uv.setXY(1, maximumU, maximumV);
  uv.setXY(2, minimumU, minimumV);
  uv.setXY(3, maximumU, minimumV);
  uv.needsUpdate = true;
}

function buildAtlasMosaicGeometry(atlasModel, columns, rows) {
  const source = atlasModel?.desktop ?? atlasModel?.mobile;
  const count = atlasModel?.entries?.size ?? 0;
  if (!source || !count || !columns || !rows) return new THREE.BufferGeometry();
  const positions = [];
  const uvs = [];
  const destinationGap = 0.035;
  const sourceStride = source.cellSize + source.gutter;
  const pushVertex = (x, y, u, v) => {
    positions.push(x, y, 0);
    uvs.push(u, v);
  };
  for (let index = 0; index < count; index += 1) {
    const destinationColumn = index % columns;
    const destinationRow = Math.floor(index / columns);
    const sourceColumn = index % atlasModel.columns;
    const sourceRow = Math.floor(index / atlasModel.columns);
    const cellLeft = (destinationColumn + destinationGap) / columns - 0.5;
    const cellRight = (destinationColumn + 1 - destinationGap) / columns - 0.5;
    const cellTop = 0.5 - (destinationRow + destinationGap) / rows;
    const cellBottom = 0.5 - (destinationRow + 1 - destinationGap) / rows;
    const sourceLeft = source.offsetX + sourceColumn * sourceStride;
    const sourceTop = source.offsetY + sourceRow * sourceStride;
    const minimumU = sourceLeft / source.width;
    const maximumU = (sourceLeft + source.cellSize) / source.width;
    const maximumV = 1 - sourceTop / source.height;
    const minimumV = 1 - (sourceTop + source.cellSize) / source.height;
    pushVertex(cellLeft, cellBottom, minimumU, minimumV);
    pushVertex(cellRight, cellBottom, maximumU, minimumV);
    pushVertex(cellRight, cellTop, maximumU, maximumV);
    pushVertex(cellLeft, cellBottom, minimumU, minimumV);
    pushVertex(cellRight, cellTop, maximumU, maximumV);
    pushVertex(cellLeft, cellTop, minimumU, maximumV);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeBoundingSphere();
  return geometry;
}

function createAtlasMagazine(atlasModel, placeholder) {
  const exactGroup = new THREE.Group();
  exactGroup.name = "exact-atlas-magazine";
  const mechanismGroup = new THREE.Group();
  mechanismGroup.name = "atlas-aperture-and-cell-carriage";
  const atlasPlate = new THREE.Mesh(
    new THREE.CircleGeometry(1, 96),
    createExactEvidenceMaterial(placeholder),
  );
  atlasPlate.name = "exact-observation-atlas";
  atlasPlate.renderOrder = 4;
  const entryCount = Math.max(1, atlasModel?.entries?.size ?? 0);
  const mosaicColumns = Math.max(1, Math.ceil(Math.sqrt(entryCount * 1.55)));
  const mosaicRows = Math.max(1, Math.ceil(entryCount / mosaicColumns));
  const mosaicMaterial = createExactEvidenceMaterial(placeholder);
  // NoBlending keeps every atlas pixel literal; transparent sorting simply
  // seats the extracted magazine in front of the RGBA instrument occluder.
  mosaicMaterial.transparent = true;
  const mosaicPlate = new THREE.Mesh(
    buildAtlasMosaicGeometry(atlasModel, mosaicColumns, mosaicRows),
    mosaicMaterial,
  );
  mosaicPlate.name = "room-scale-exact-evidence-magazine";
  mosaicPlate.renderOrder = 12;
  mosaicPlate.visible = false;
  const mosaicBacking = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      color: 0x100e0b,
      transparent: true,
      opacity: 0.92,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  mosaicBacking.name = "evidence-magazine-shadow-plate";
  mosaicBacking.renderOrder = 11;
  mosaicBacking.visible = false;
  const cellGeometry = new THREE.PlaneGeometry(1, 1);
  const selectedCellMaterial = createExactEvidenceMaterial(placeholder);
  selectedCellMaterial.transparent = true;
  const selectedCell = new THREE.Mesh(cellGeometry, selectedCellMaterial);
  selectedCell.name = "physically-separated-exact-atlas-cell";
  selectedCell.renderOrder = 16;
  selectedCell.visible = false;
  const cellBacking = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      color: 0xc29556,
      transparent: true,
      opacity: 0.94,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  cellBacking.name = "extracted-cell-brass-shadow";
  cellBacking.renderOrder = 15;
  cellBacking.visible = false;
  const cellVoid = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      color: 0x100f0d,
      transparent: true,
      opacity: 0.9,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  cellVoid.renderOrder = 15;
  cellVoid.visible = false;
  exactGroup.add(
    atlasPlate,
    mosaicBacking,
    mosaicPlate,
    cellVoid,
    cellBacking,
    selectedCell,
  );

  const magazineRing = new THREE.Mesh(
    new THREE.RingGeometry(0.93, 1, 128),
    new THREE.MeshBasicMaterial({
      color: 0xd5a45c,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  magazineRing.renderOrder = 13;
  const openLabel = createTextSprite("OPEN THE EVIDENCE  ↗");
  openLabel.name = "physical-atlas-portal-label";
  openLabel.renderOrder = 14;
  const mosaicFrame = [0, 1, 2, 3].map(() => {
    const edge = createInstrumentBeam(0xe0b46f, 0.9);
    edge.renderOrder = 14;
    return edge;
  });
  mechanismGroup.add(magazineRing, ...mosaicFrame, openLabel);

  let width = 1;
  let height = 1;
  let compact = false;
  let portal = { x: 0.5, y: 0.5, radius: 1 };
  let mode = false;
  let selected = null;
  let probeStrength = 0;
  let probeSpeed = 0;
  let probePressed = false;
  let separation = new THREE.Vector2();
  let climax = 0;
  let projectionReveal = 0;
  const mosaicRect = { height: 1, width: 1, x: 0.5, y: 0.5 };

  function atlasGeometry() {
    return compact
      ? atlasModel?.mobile ?? atlasModel?.desktop
      : atlasModel?.desktop ?? atlasModel?.mobile;
  }

  function clearCell() {
    selected = null;
    selectedCell.visible = false;
    cellBacking.visible = false;
    cellVoid.visible = false;
  }

  function atlasRadius() {
    return portal.radius * 0.785;
  }

  function layoutCell() {
    if (!selected || !atlasModel) {
      clearCell();
      return;
    }
    const geometry = atlasGeometry();
    if (!geometry) {
      clearCell();
      return;
    }
    const { column, rowTop } = selected;
    const stride = geometry.cellSize + geometry.gutter;
    const left = geometry.offsetX + column * stride;
    const top = geometry.offsetY + rowTop * stride;
    const minimumU = left / geometry.width;
    const maximumU = (left + geometry.cellSize) / geometry.width;
    const maximumV = 1 - top / geometry.height;
    const minimumV = 1 - (top + geometry.cellSize) / geometry.height;
    setAtlasCellUv(cellGeometry, minimumU, minimumV, maximumU, maximumV);

    const centerU = (minimumU + maximumU) * 0.5;
    const centerV = (minimumV + maximumV) * 0.5;
    const sourceIndex = rowTop * atlasModel.columns + column;
    const inMosaic = projectionReveal > 0.08 && sourceIndex < entryCount;
    const radius = atlasRadius();
    const mosaicColumn = sourceIndex % mosaicColumns;
    const mosaicRow = Math.floor(sourceIndex / mosaicColumns);
    const mosaicCellWidth = mosaicRect.width / mosaicColumns;
    const mosaicCellHeight = mosaicRect.height / mosaicRows;
    const baseX = inMosaic
      ? mosaicRect.x - mosaicRect.width * 0.5 + (mosaicColumn + 0.5) * mosaicCellWidth
      : portal.x + (centerU - 0.5) * radius * 2;
    const baseY = inMosaic
      ? mosaicRect.y - mosaicRect.height * 0.5 + (mosaicRow + 0.5) * mosaicCellHeight
      : portal.y - (centerV - 0.5) * radius * 2;
    const cellWidth = inMosaic
      ? mosaicCellWidth * 0.93
      : (maximumU - minimumU) * radius * 2;
    const cellHeight = inMosaic
      ? mosaicCellHeight * 0.93
      : (maximumV - minimumV) * radius * 2;
    setPixelRectangle(
      cellVoid,
      baseX,
      baseY,
      cellWidth,
      cellHeight,
      width,
      height,
      0.24,
    );
    const maximumExtractionScale = Math.max(
      1,
      Math.min(
        compact ? 4.8 : 3.2,
        (compact ? 112 : 158) / Math.max(cellWidth, cellHeight, 1),
      ),
    );
    const extractionScale = 1 + probeStrength * (maximumExtractionScale - 1);
    const extractedWidth = cellWidth * extractionScale;
    const extractedHeight = cellHeight * extractionScale;
    setPixelRectangle(
      cellBacking,
      baseX + separation.x + (compact ? 1.5 : 2),
      baseY + separation.y + (compact ? 2 : 2.5),
      extractedWidth + (compact ? 10 : 16),
      extractedHeight + (compact ? 10 : 16),
      width,
      height,
      0.245,
    );
    setPixelRectangle(
      selectedCell,
      baseX + separation.x,
      baseY + separation.y,
      extractedWidth,
      extractedHeight,
      width,
      height,
      0.25,
    );
    cellVoid.visible = mode && probeStrength > 0.002;
    cellBacking.visible = mode && probeStrength > 0.002;
    selectedCell.visible = mode && probeStrength > 0.002;
  }

  function layoutMagazine() {
    const radius = atlasRadius();
    setPixelCircle(atlasPlate, portal.x, portal.y, radius, width, height, 0.21);
    setPixelCircle(magazineRing, portal.x, portal.y, radius * 1.025, width, height, 0.34);
    magazineRing.userData.baseScale = magazineRing.scale.clone();
    const initialWidth = radius * 1.35;
    const finalWidth = compact
      ? Math.min(width * 0.91, 380)
      : Math.min(width * 0.52, 760);
    const magazineWidth = initialWidth + (finalWidth - initialWidth) * projectionReveal;
    const magazineHeight = magazineWidth * (mosaicRows / mosaicColumns);
    const finalX = compact
      ? width * 0.5
      : clamp(portal.x - portal.radius * 0.04, magazineWidth * 0.5 + 24, width - magazineWidth * 0.5 - 24);
    const finalY = compact
      ? clamp(portal.y + portal.radius * 0.08, magazineHeight * 0.5 + 82, height - magazineHeight * 0.5 - 96)
      : portal.y;
    mosaicRect.x = portal.x + (finalX - portal.x) * projectionReveal;
    mosaicRect.y = portal.y + (finalY - portal.y) * projectionReveal;
    mosaicRect.width = magazineWidth;
    mosaicRect.height = magazineHeight;
    setPixelRectangle(
      mosaicBacking,
      mosaicRect.x + (compact ? 3 : 5),
      mosaicRect.y + (compact ? 4 : 6),
      mosaicRect.width + (compact ? 10 : 14),
      mosaicRect.height + (compact ? 10 : 14),
      width,
      height,
      0.305,
    );
    setPixelRectangle(
      mosaicPlate,
      mosaicRect.x,
      mosaicRect.y,
      mosaicRect.width,
      mosaicRect.height,
      width,
      height,
      0.31,
    );
    const left = mosaicRect.x - mosaicRect.width * 0.5;
    const right = mosaicRect.x + mosaicRect.width * 0.5;
    const top = mosaicRect.y - mosaicRect.height * 0.5;
    const bottom = mosaicRect.y + mosaicRect.height * 0.5;
    positionInstrumentBeam(
      mosaicFrame[0],
      new THREE.Vector2(left, top),
      new THREE.Vector2(right, top),
      compact ? 1.8 : 2.2,
      width,
      height,
      0.35,
    );
    positionInstrumentBeam(
      mosaicFrame[1],
      new THREE.Vector2(right, top),
      new THREE.Vector2(right, bottom),
      compact ? 1.8 : 2.2,
      width,
      height,
      0.35,
    );
    positionInstrumentBeam(
      mosaicFrame[2],
      new THREE.Vector2(right, bottom),
      new THREE.Vector2(left, bottom),
      compact ? 1.8 : 2.2,
      width,
      height,
      0.35,
    );
    positionInstrumentBeam(
      mosaicFrame[3],
      new THREE.Vector2(left, bottom),
      new THREE.Vector2(left, top),
      compact ? 1.8 : 2.2,
      width,
      height,
      0.35,
    );
    const projectionVisible = mode && projectionReveal > 0.003;
    mosaicBacking.visible = projectionVisible;
    mosaicPlate.visible = projectionVisible;
    mosaicFrame.forEach((edge) => {
      edge.visible = projectionVisible;
    });
    setPixelRectangle(
      openLabel,
      projectionVisible ? mosaicRect.x : portal.x,
      projectionVisible ? bottom - (compact ? 12 : 14) : portal.y + radius * 0.82,
      compact ? Math.min(182, width * 0.56) : 226,
      compact ? 19 : 22,
      width,
      height,
      0.35,
    );
    openLabel.userData.basePosition = openLabel.position.clone();
    layoutCell();
  }

  return {
    exactGroup,
    mechanismGroup,
    layout(nextPortal, nextWidth, nextHeight, nextCompact) {
      portal = nextPortal;
      width = Math.max(1, nextWidth);
      height = Math.max(1, nextHeight);
      compact = nextCompact;
      layoutMagazine();
    },
    setTexture(texture) {
      if (!texture) return;
      atlasPlate.material.map = texture;
      atlasPlate.material.needsUpdate = true;
      mosaicPlate.material.map = texture;
      mosaicPlate.material.needsUpdate = true;
      selectedCell.material.map = texture;
      selectedCell.material.needsUpdate = true;
    },
    setMode(nextMode) {
      mode = nextMode;
      exactGroup.visible = mode;
      mechanismGroup.visible = mode;
      if (!mode) {
        mosaicBacking.visible = false;
        mosaicPlate.visible = false;
        mosaicFrame.forEach((edge) => {
          edge.visible = false;
        });
        clearCell();
      }
    },
    resolveProbe(point) {
      if (!mode || !atlasModel) return null;
      const pixel = chamberPointPixels(point, width, height);
      if (projectionReveal > 0.08) {
        const left = mosaicRect.x - mosaicRect.width * 0.5;
        const top = mosaicRect.y - mosaicRect.height * 0.5;
        const localX = (pixel.x - left) / Math.max(mosaicRect.width, 1);
        const localY = (pixel.y - top) / Math.max(mosaicRect.height, 1);
        if (localX >= 0 && localX < 1 && localY >= 0 && localY < 1) {
          const destinationColumn = Math.floor(localX * mosaicColumns);
          const destinationRow = Math.floor(localY * mosaicRows);
          const index = destinationRow * mosaicColumns + destinationColumn;
          if (index < entryCount) {
            const column = index % atlasModel.columns;
            const rowTop = Math.floor(index / atlasModel.columns);
            return { point, surface: `archive:cell:${column}:${rowTop}` };
          }
        }
      }
      const radius = atlasRadius();
      const dx = pixel.x - portal.x;
      const dy = pixel.y - portal.y;
      if (Math.hypot(dx, dy) > radius) return null;
      const localX = clamp(dx / (radius * 2) + 0.5, 0, 0.9999);
      const localY = clamp(dy / (radius * 2) + 0.5, 0, 0.9999);
      const column = Math.floor(localX * atlasModel.columns);
      const rowTop = Math.floor(localY * atlasModel.rows);
      return { point, surface: `archive:cell:${column}:${rowTop}` };
    },
    setProbe(nextProbe, strength) {
      probeStrength = nextProbe.surface.startsWith("archive:")
        ? clamp(strength, 0, 1)
        : 0;
      probeSpeed = nextProbe.speed;
      probePressed = nextProbe.pressed;
      const match = /^archive:cell:(\d+):(\d+)$/.exec(nextProbe.surface);
      if (!match || !atlasModel) {
        clearCell();
        return;
      }
      const column = clampInteger(Number(match[1]), 0, atlasModel.columns - 1);
      const rowTop = clampInteger(Number(match[2]), 0, atlasModel.rows - 1);
      selected = { column, rowTop };
      const centerX = (column + 0.5) / atlasModel.columns - 0.5;
      const centerY = (rowTop + 0.5) / atlasModel.rows - 0.5;
      const direction = new THREE.Vector2(centerX, centerY);
      if (direction.lengthSq() < 0.0001) direction.set(nextProbe.x || 0.4, -nextProbe.y || 0.3);
      direction.normalize();
      const pixels = clamp(
        (compact ? 14 : 20) + Math.min(6, probeSpeed / 220) + (probePressed ? 5 : 0),
        compact ? 14 : 20,
        compact ? 25 : 32,
      );
      separation.copy(direction.multiplyScalar(pixels));
      layoutCell();
    },
    update(presence, time, delta, still, sceneName, progress) {
      const targetClimax = mode && sceneName === "archive"
        ? smootherStep(0.08, 0.58, progress)
        : 0;
      climax += (targetClimax - climax) * (
        still ? 1 : 1 - Math.exp(-Math.max(0, delta) * 5.6)
      );
      if (Math.abs(targetClimax - climax) < 0.0001) climax = targetClimax;
      const projectionChanged = Math.abs(projectionReveal - climax) > 0.0001;
      projectionReveal = climax;
      if (projectionChanged) layoutMagazine();
      exactGroup.position.y = (1 - presence) * 0.045;
      mechanismGroup.position.y = (1 - presence) * 0.045;
      magazineRing.material.opacity = clamp(
        presence * (0.12 + (1 - climax) * 0.08 + probeStrength * 0.46),
        0,
        0.72,
      );
      const openReveal = sceneName === "archive"
        ? smootherStep(0.46, 0.62, progress)
        : 0;
      openLabel.material.opacity = presence * openReveal * (0.72 + probeStrength * 0.24);
      cellBacking.material.opacity = 0.66 + probeStrength * 0.28;
      mosaicFrame.forEach((edge) => {
        setInstrumentOpacity(edge, presence * projectionReveal * 0.88, probeStrength * 0.24);
      });
      const labelBasePosition = openLabel.userData.basePosition;
      if (labelBasePosition) openLabel.position.copy(labelBasePosition);
      if (!still) openLabel.position.y += Math.sin(time * 0.72) * 0.00016;
      const baseScale = magazineRing.userData.baseScale;
      if (!baseScale) magazineRing.userData.baseScale = magazineRing.scale.clone();
      else magazineRing.scale.copy(baseScale).multiplyScalar(1 + probeStrength * 0.055);
      return climax * presence;
    },
  };
}

function createSolidTexture(rgba, color = true) {
  const texture = new THREE.DataTexture(
    new Uint8Array(rgba),
    1,
    1,
    THREE.RGBAFormat,
  );
  texture.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createAtmosphericField(profile) {
  const group = new THREE.Group();
  group.name = "restrained-atmospheric-depth";
  const count = profile.constrained ? 54 : 116;
  const positions = new Float32Array(count * 3);
  let seed = 0x41c64e6d;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = random() * 2 - 1;
    positions[index * 3 + 1] = random() * 2 - 1;
    positions[index * 3 + 2] = random();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const uniforms = {
    uOpacity: { value: 0 },
    uReduced: { value: 0 },
    uTime: { value: 0 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      uniform float uReduced;
      uniform float uTime;
      varying float vDepth;

      void main() {
        vec3 point = position;
        if (uReduced < 0.5) {
          point.y = mod(point.y + 1.0 + uTime * mix(0.004, 0.014, position.z), 2.0) - 1.0;
          point.x += sin(uTime * 0.17 + position.z * 18.0) * 0.006;
        }
        vDepth = position.z;
        gl_Position = vec4(point.xy, 0.18, 1.0);
        gl_PointSize = mix(0.8, 2.2, position.z);
      }
    `,
    fragmentShader: `
      precision mediump float;
      uniform float uOpacity;
      varying float vDepth;

      void main() {
        float radius = length(gl_PointCoord - 0.5);
        float alpha = (1.0 - smoothstep(0.18, 0.5, radius)) * uOpacity;
        gl_FragColor = vec4(vec3(0.92, 0.83, 0.70), alpha * mix(0.22, 0.72, vDepth));
      }
    `,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.renderOrder = 1;
  group.add(points);
  let opacity = 0;
  let reduced = false;
  return {
    group,
    setReduced(value) {
      reduced = value;
      uniforms.uReduced.value = value ? 1 : 0;
    },
    update(journey, time, still) {
      const origin = 1 - smootherStep(0.42, 0.88, journey);
      const archive = smootherStep(4.54, 4.94, journey);
      const target = Math.max(origin, archive) * (reduced ? 0.32 : 1);
      opacity += (target - opacity) * (still ? 1 : 0.045);
      uniforms.uOpacity.value = opacity * 0.18;
      uniforms.uTime.value = still ? 0 : time;
    },
  };
}

function pointSegmentDistancePixels(point, start, end, width, height) {
  const scaleX = Math.max(1, width) * 0.5;
  const scaleY = Math.max(1, height) * 0.5;
  const segmentX = (end.x - start.x) * scaleX;
  const segmentY = (end.y - start.y) * scaleY;
  const pointX = (point.x - start.x) * scaleX;
  const pointY = (point.y - start.y) * scaleY;
  const lengthSquared = segmentX * segmentX + segmentY * segmentY;
  if (lengthSquared < 0.0001) return Math.hypot(pointX, pointY);
  const projection = clamp(
    (pointX * segmentX + pointY * segmentY) / lengthSquared,
    0,
    1,
  );
  return Math.hypot(
    pointX - segmentX * projection,
    pointY - segmentY * projection,
  );
}

function createTextSprite(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = "500 21px 'IBM Plex Mono', ui-monospace, monospace";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "rgba(243, 236, 224, 0.94)";
  context.shadowColor = "rgba(0, 0, 0, 0.9)";
  context.shadowBlur = 8;
  context.fillText(String(text || "").toUpperCase(), canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 1,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
  return new THREE.Sprite(material);
}

function bindEntryGate(chamberRoot, reducedMotion) {
  const entry = chamberRoot.querySelector("[data-chamber-entry]");
  if (!entry) return;
  const enterButton = entry.querySelector("[data-enter], [data-enter-sound]");
  if (!enterButton) return;
  const enterLabel = enterButton.querySelector("[data-enter-label]");
  if (enterLabel) enterLabel.textContent = "Enter the atlas";
  entry.setAttribute("role", "dialog");
  entry.setAttribute("aria-modal", "true");
  entry.removeAttribute("aria-live");
  entry.setAttribute("aria-busy", "false");
  if ("disabled" in enterButton) enterButton.disabled = false;
  enterButton.removeAttribute("aria-disabled");
  let dismissed = entry.dataset.entryState === "dismissed";

  const trapFocus = (event) => {
    if (dismissed) return;
    if (event.key === "Escape") {
      event.preventDefault();
      enterButton.focus();
      return;
    }
    if (event.key !== "Tab") return;
    event.preventDefault();
    enterButton.focus();
  };
  entry.addEventListener("keydown", trapFocus);

  if (!dismissed && entry.dataset.entryState !== "dismissing") {
    entry.dataset.entryState = "open";
    window.queueMicrotask(() => {
      if (document.activeElement === document.body || !document.activeElement) enterButton.focus();
    });
  }

  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    chamberRoot.dataset.audioRequest = "on";
    entry.dataset.entryState = "dismissing";
    emit("atlas:commit", {
      kind: "entry",
      audio: "on",
      phase: "commit",
      source: "entry-button",
    });
    window.setTimeout(() => {
      entry.dataset.entryState = "dismissed";
      entry.setAttribute("aria-hidden", "true");
      if ("inert" in entry) entry.inert = true;
      entry.removeEventListener("keydown", trapFocus);
      const main = document.querySelector("#main, main");
      if (main instanceof HTMLElement) {
        if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
      }
      emit("atlas:commit", {
        kind: "entry-gate",
        phase: "complete",
        audio: "on",
      });
    }, reducedMotion.matches ? 0 : 560);
  };

  enterButton.addEventListener("click", dismiss);
}

function findResponse(responses, axis) {
  return responses.find((item) => item.vectorId === axis) ?? responses[0] ?? null;
}

function scoreRange(observations, axis) {
  if (!axis) return { min: 0, max: 1 };
  const values = observations
    .map((observation) => observation.scores.get(axis))
    .filter(Number.isFinite);
  if (!values.length) return { min: 0, max: 1 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min >= 0 && max <= 1) return { min: 0, max: 1 };
  if (min >= -1 && max <= 1) return { min: -1, max: 1 };
  return min === max ? { min: min - 0.5, max: max + 0.5 } : { min, max };
}

function normalizeScore(value, range) {
  if (!Number.isFinite(value)) return NaN;
  return clamp((value - range.min) / Math.max(0.00001, range.max - range.min), 0, 1);
}


function updateScoreDOM(chamberRoot, plate, defaultVector) {
  const scores = plate?.scores ?? new Map();
  for (const node of chamberRoot.querySelectorAll("[data-chamber-score]")) {
    const vectorId = firstString(
      node.getAttribute("data-chamber-score"),
      node.dataset.vector,
      node.dataset.vectorId,
      defaultVector,
    );
    const score = scores.get(vectorId);
    node.textContent = Number.isFinite(score) ? score.toFixed(2) : "—";
  }
}

function setControlActive(control, active) {
  control.classList.toggle("is-active", active);
  if (control.matches("input[type='radio'], input[type='checkbox']")) control.checked = active;
  if (control.matches("button, [role='button']")) {
    control.setAttribute("aria-pressed", active ? "true" : "false");
  }
}

function controlValue(control) {
  if (!control) return "";
  return firstString(
    control.dataset.chamberState,
    control.dataset.chamberCompare,
    control.dataset.chamberAxis,
    control.value,
    control.getAttribute("value"),
  );
}

function scoreMap(source) {
  const result = new Map();
  if (Array.isArray(source)) {
    for (const item of source) {
      const key = Array.isArray(item)
        ? firstString(item[0])
        : firstString(item?.vector_id, item?.vectorId, item?.id, item?.name);
      const value = Array.isArray(item)
        ? finiteNumber(item[1])
        : firstFinite(item?.value, item?.score, item?.mean);
      if (key && Number.isFinite(value)) result.set(key, value);
    }
  } else if (isRecord(source)) {
    for (const [key, raw] of Object.entries(source)) {
      const value = isRecord(raw)
        ? firstFinite(raw.value, raw.score, raw.mean)
        : finiteNumber(raw);
      if (Number.isFinite(value)) result.set(key, value);
    }
  }
  return result;
}

function confidenceMap(source) {
  const result = new Map();
  for (const item of asArray(source)) {
    const key = Array.isArray(item)
      ? firstString(item[0])
      : firstString(item?.vector_id, item?.vectorId, item?.id, item?.name);
    const value = Array.isArray(item)
      ? finiteNumber(item[2])
      : finiteNumber(item?.confidence);
    if (key && Number.isFinite(value)) result.set(key, value);
  }
  return result;
}

function normalizeAssetUrl(value) {
  if (!value || typeof value !== "string") return "";
  try {
    const url = new URL(value, document.baseURI);
    if (!["http:", "https:", "file:", "blob:", "data:"].includes(url.protocol)) return "";
    return url.href;
  } catch (_error) {
    return "";
  }
}

function preferredMediaUrls(observationId, canonicalImageUrl = "") {
  // The site generator writes inspection-scale derivatives for every plate it
  // exposes on the chamber. Derive the URL from the payload ID so a new hero
  // triplet does not require a JavaScript allowlist; reject anything that could
  // escape the studies directory and retain the canonical artifact as fallback.
  const normalizedId = firstString(observationId);
  const derivative = /^obs_[a-z0-9_-]+$/i.test(normalizedId)
    ? `assets/studies/${normalizedId}-1024.webp`
    : "";
  const compactDerivative = /^obs_[a-z0-9_-]+$/i.test(normalizedId)
    ? `assets/studies/${normalizedId}-640.webp`
    : "";
  if (!derivative) {
    return {
      compactImageUrl: canonicalImageUrl,
      imageUrl: canonicalImageUrl,
      fallbackImageUrl: "",
    };
  }
  const imageUrl = normalizeAssetUrl(derivative);
  const compactImageUrl = normalizeAssetUrl(compactDerivative);
  return {
    compactImageUrl: compactImageUrl || imageUrl || canonicalImageUrl,
    imageUrl: imageUrl || canonicalImageUrl,
    fallbackImageUrl:
      imageUrl && canonicalImageUrl && imageUrl !== canonicalImageUrl
        ? canonicalImageUrl
        : "",
  };
}

function levelName(source) {
  if (!isRecord(source)) return "";
  return normalizeLevel(
    firstString(source.requested_level, source.requestedLevel, source.level, source.state),
  );
}

function normalizeLevel(value) {
  const level = firstString(value).toLowerCase();
  return LEVELS.includes(level) ? level : "";
}

function normalizeCompare(value) {
  const key = firstString(value).toLowerCase().replaceAll("-", "_");
  if (key.includes("halation")) return "halation";
  if (key.includes("bloom")) return "bloom";
  return "";
}

function normalizeScene(value) {
  const scene = firstString(value).toLowerCase();
  return SCENES.includes(scene) ? scene : "";
}

function getPerformanceProfile(coarse) {
  const memory = finiteNumber(navigator.deviceMemory);
  const cores = finiteNumber(navigator.hardwareConcurrency);
  const mobile = coarse || window.innerWidth < 760;
  const constrained =
    mobile ||
    (Number.isFinite(memory) && memory <= 4) ||
    (Number.isFinite(cores) && cores <= 4);
  return {
    antialias: !constrained,
    constrained,
    coarse,
    mobile,
    pixelRatio: Math.min(window.devicePixelRatio || 1, constrained ? 1.25 : 1.5),
    powerPreference: constrained ? "low-power" : "high-performance",
  };
}

function backingPixelRatio(width, height, profile) {
  const cssPixels = Math.max(1, width) * Math.max(1, height);
  const maxBackingPixels = profile.constrained ? 1_200_000 : 3_200_000;
  const cap = profile.constrained ? 1.25 : 1.5;
  return Math.max(
    Number.EPSILON,
    Math.min(profile.pixelRatio, cap, Math.sqrt(maxBackingPixels / cssPixels)),
  );
}

function emit(name, detail) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

function nextEventId(prefix) {
  eventSequence += 1;
  return `${prefix}-${eventSequence.toString(36)}`;
}

function scheduleIdle(callback) {
  if (typeof window.requestIdleCallback === "function") {
    return { id: window.requestIdleCallback(callback, { timeout: 900 }), type: "idle" };
  }
  return { id: window.setTimeout(callback, 80), type: "timeout" };
}

function cancelScheduledIdle(handle) {
  if (!handle) return;
  if (handle.type === "idle" && typeof window.cancelIdleCallback === "function") {
    window.cancelIdleCallback(handle.id);
    return;
  }
  window.clearTimeout(handle.id);
}

function smootherStep(edge0, edge1, value) {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const amount = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return amount * amount * amount * (amount * (amount * 6 - 15) + 10);
}

function firstString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function finiteNumber(value) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : NaN;
}

function firstFinite(...values) {
  for (const value of values) {
    const number = finiteNumber(value);
    if (Number.isFinite(number)) return number;
  }
  return NaN;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function clampInteger(value, min, max) {
  return Math.round(clamp(Number.isFinite(value) ? value : min, min, max));
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
