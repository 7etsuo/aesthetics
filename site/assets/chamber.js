// Vendored Three.js 0.164.1 (r164), MIT; see vendor/three.LICENSE.txt.
import * as THREE from "./vendor/three.module.min.js";

/**
 * Atlas Observation Chamber
 *
 * This canvas is deliberately presentational. The readable evidence, controls,
 * and fallbacks remain ordinary HTML. Geometry is limited to three things the
 * registry can support: exact generated plates, registry order, and recorded
 * score/response values. Nothing here is presented as model-native latent space.
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
const HERO_OBSERVATION_IDS = Object.freeze({
  low: "obs_0160",
  medium: "obs_0161",
  high: "obs_0162",
});
const COMPARISON_OBSERVATION_IDS = Object.freeze({
  halation: "obs_0162",
  bloom: "obs_0177",
});
// Responsive derivatives for plates shown at inspection scale. Canonical
// artifact URLs remain the error fallback, and the field atlas owns thumbnails.
const HOME_MEDIA_DERIVATIVES = Object.freeze({
  obs_0052: "assets/studies/obs_0052-1024.webp",
  obs_0055: "assets/studies/obs_0055-1024.webp",
  obs_0160: "assets/studies/obs_0160-1024.webp",
  obs_0161: "assets/studies/obs_0161-1024.webp",
  obs_0162: "assets/studies/obs_0162-1024.webp",
  obs_0177: "assets/studies/obs_0177-1024.webp",
});
const fallbackSceneRoots = new WeakSet();
let eventSequence = 0;
const PALETTE = {
  black: 0x070808,
  chamber: 0x0a0b0b,
  floor: 0x101110,
  register: 0xc8c3b7,
  quiet: 0x5d605d,
  paper: 0xe5e0d5,
  warm: 0xc59b72,
  halation: 0xb24c40,
  cool: 0x74828a,
};

const CAMERA_STOPS = Object.freeze({
  origin: { position: [4.2, 0.5, 12.2], target: [1.6, 0, 3.2], fov: 29 },
  response: { position: [-10.2, 1.8, 7.4], target: [-3.7, 0.2, 0.5], fov: 32 },
  discriminate: { position: [10, 0.8, 6.6], target: [3.8, 0, 0.9], fov: 30 },
  association: { position: [-8.8, 4.2, -7.6], target: [-2.5, 0.3, -2.7], fov: 34 },
  reconstruct: { position: [8, 1.6, -9.2], target: [2.6, -1.1, -3.2], fov: 31 },
  archive: { position: [0, 12.8, 14.5], target: [0, 0, 0], fov: 37 },
});

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

  bindEntryGate(chamberRoot, reducedMotion);

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

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: performanceProfile.antialias,
      depth: true,
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
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.setClearColor(PALETTE.black, 1);
  renderer.setPixelRatio(performanceProfile.pixelRatio);
  renderer.shadowMap.enabled = !performanceProfile.constrained;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PALETTE.black);
  scene.fog = new THREE.FogExp2(PALETTE.black, 0.034);

  const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 80);
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

  canvas.addEventListener(
    "webglcontextlost",
    (event) => {
      event.preventDefault();
      engine.stop();
      controls.activateFallback("webgl-context-lost");
    },
    false,
  );

  const resize = () => engine.resize(canvasHost.clientWidth, canvasHost.clientHeight);
  const resizeObserver = typeof ResizeObserver === "function" ? new ResizeObserver(resize) : null;
  resizeObserver?.observe(canvasHost);
  window.addEventListener("resize", resize, { passive: true });
  resize();

  engine.bind();
  engine.start();

  // The first visible plate is loaded before the lower-priority evidence plates.
  // Every state is a separate persistent texture-backed mesh; state changes only
  // toggle visibility and therefore cannot create interpolated frames.
  const initialPlateReady = await engine.loadInitialPlate();
  if (!initialPlateReady) {
    chamberRoot.classList.add("has-chamber-image-error");
    engine.stop();
    controls.activateFallback("hero-image-unavailable");
    return;
  }

  chamberRoot.dataset.chamberLoadPhase = "deferred";

  if (!engine.renderCommitFrame()) {
    engine.stop();
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
  window.setTimeout(() => {
    emit("atlas:commit", {
      kind: "ready",
      scene: engine.activeScene,
      state: controls.state,
      observationId: controls.activeLevel?.observationId ?? "",
    });
  }, commitDelay);

  engine.loadDeferredPlates();
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
  const requestedObservationCount = clampInteger(
    firstFinite(
      fieldSource.observation_count,
      fieldSource.observationCount,
      fieldSource.count,
      isRecord(payload.stats) ? payload.stats.observations : undefined,
      asArray(fieldSource.observations).length,
      1,
    ),
    1,
    MAX_OBSERVATIONS,
  );
  const observations = normalizeObservations(
    fieldSource.observations ?? payload.observations,
    requestedObservationCount,
  );
  const observationsById = new Map(observations.map((item) => [item.id, item]));
  const heroSource = isRecord(payload.hero) ? payload.hero : {};
  const payloadHeroLevels = LEVELS.map((state) => {
    const source = asArray(heroSource.levels).find(
      (item) => levelName(item) === state,
    );
    return resolvePlate(normalizePlate(source, state), observationsById);
  }).filter(Boolean);

  // Chamber v2 deliberately uses the night-path lamp landscape study. Resolve
  // those registry IDs first, while retaining payload-driven compatibility for
  // partially deployed documents.
  const heroLevels = LEVELS.map((state) => {
    const preferred = observationsById.get(HERO_OBSERVATION_IDS[state]);
    if (preferred?.imageUrl) return { ...observationPlate(preferred), state };
    return payloadHeroLevels.find((item) => item.state === state) ?? null;
  }).filter(Boolean);

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
  const correlations = asArray(correlationSource)
    .map(normalizeCorrelation)
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
  for (const key of ["halation", "bloom"]) {
    const preferred = observationsById.get(COMPARISON_OBSERVATION_IDS[key]);
    if (preferred?.imageUrl) comparison[key] = { ...observationPlate(preferred), state: key };
  }
  const weights = asArray(reconstructionSource.weights)
    .map((item) => ({
      vectorId: firstString(item?.vector_id, item?.vectorId, item?.id),
      weight: finiteNumber(item?.weight),
    }))
    .filter((item) => item.vectorId && Number.isFinite(item.weight));

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
  const { imageUrl, fallbackImageUrl } = preferredMediaUrls(
    observationId,
    canonicalImageUrl,
  );
  if (!imageUrl && !observationId) return null;
  return {
    imageUrl,
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

function normalizeObservations(source, requestedCount) {
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
  const { imageUrl, fallbackImageUrl } = preferredMediaUrls(id, canonicalImageUrl);
  return {
    id,
    index,
    scores: scoreMap(record.scores ?? record.values ?? record.score),
    confidence: confidenceMap(record.scores),
    imageUrl,
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
    },
    activateFallback(reason) {
      canvasReady = false;
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
  const cameraRig = new THREE.Group();
  const journeyPivot = new THREE.Group();
  const pointerLookRig = new THREE.Group();
  cameraRig.name = "camera-rig";
  journeyPivot.name = "journey-pivot";
  pointerLookRig.name = "pointer-look-rig";
  scene.add(cameraRig);
  cameraRig.add(journeyPivot);
  journeyPivot.add(pointerLookRig);
  pointerLookRig.add(camera);

  const environment = createChamberShell(scene, performanceProfile);
  const instrument = createEvidenceInstrument(model, performanceProfile);
  scene.add(instrument.group);

  const textureLoader = new THREE.TextureLoader();
  textureLoader.crossOrigin = "anonymous";
  const textureCache = new Map();
  const heroMeshes = instrument.inspection.meshes;
  const compareMeshes = instrument.comparator.meshes;
  const reconstructionMeshes = instrument.reconstruction.meshes;
  const pointer = new THREE.Vector2();
  const pointerSmoothed = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const renderedCameraPosition = new THREE.Vector3();
  const renderedCameraTarget = new THREE.Vector3();
  const desiredCameraPosition = new THREE.Vector3();
  const desiredCameraTarget = new THREE.Vector3();
  const currentCameraPosition = new THREE.Vector3();
  const currentCameraTarget = new THREE.Vector3();
  let activeScene = "origin";
  let activeSceneProgress = 0;
  let pathTarget = 0;
  let pathCurrent = 0;
  let running = false;
  let frameRequest = 0;
  let resizeWidth = 1;
  let resizeHeight = 1;
  let scrollTicking = false;
  let intro = reducedMotion.matches ? 1 : 0;
  let initialReady = false;
  let destroyed = false;
  let visualHeroState = controls.state;
  let visualComparison = controls.comparison;
  let heroSwap = null;
  let comparisonSwap = null;
  let heroSwapToken = 0;
  let comparisonSwapToken = 0;
  let comparatorDrag = null;
  let hoverObservationId = "";
  let hoverTimer = 0;
  let stableFrames = 0;
  let slowFrames = 0;
  let performanceReduced = false;
  let lastCameraEvent = 0;
  let lastCameraEventTime = 0;
  let lastCameraSpeed = 0;
  let previousTransitionPath = 0;
  let cameraJourneyTransition = null;

  const initialCamera = sampleCameraPath(0, performanceProfile.mobile);
  currentCameraPosition.copy(initialCamera.position);
  currentCameraTarget.copy(initialCamera.target);
  applyCameraTransform(initialCamera, 1, true);

  hardSwitch(heroMeshes, visualHeroState);
  hardSwitch(compareMeshes, visualComparison);
  instrument.setHeroObservation(heroMeshes.get(visualHeroState)?.userData.observationId);

  controls.onState((state, previous) => {
    void prepareHeroSwap(state, previous);
  });
  controls.onCompare((comparison, previous) => {
    void prepareComparisonSwap(comparison, previous);
  });
  controls.onAxis((axis) => {
    instrument.response.compose(findResponse(model.responses, axis));
    instrument.compass.compose(axis, model.correlations);
    instrument.lattice.setAxis(axis);
    emit("atlas:interaction", {
      kind: "axis-collet",
      value: axis,
      pan: 0,
      interactionId: nextEventId("axis"),
    });
    requestRender();
  });

  instrument.response.compose(findResponse(model.responses, controls.axis));
  instrument.compass.compose(controls.axis, model.correlations);
  instrument.lattice.setAxis(controls.axis);
  updateSceneDOM(chamberRoot, activeScene);

  function loadTexture(url) {
    if (!url) return Promise.resolve(null);
    if (textureCache.has(url)) return textureCache.get(url);
    const promise = new Promise((resolve) => {
      textureLoader.load(
        url,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.anisotropy = Math.min(
            performanceProfile.mobile ? 2 : 4,
            renderer.capabilities.getMaxAnisotropy(),
          );
          resolve(texture);
        },
        undefined,
        () => resolve(null),
      );
    });
    textureCache.set(url, promise);
    return promise;
  }

  async function loadMeshTexture(mesh) {
    if (!mesh) return false;
    if (mesh.userData.ready) return true;
    let texture = await loadTexture(mesh.userData.imageUrl);
    if (
      !texture &&
      mesh.userData.fallbackImageUrl &&
      mesh.userData.fallbackImageUrl !== mesh.userData.imageUrl
    ) {
      texture = await loadTexture(mesh.userData.fallbackImageUrl);
    }
    if (!texture || destroyed) return false;
    mesh.material.map = texture;
    mesh.material.color.set(0xffffff);
    mesh.material.needsUpdate = true;
    const width = texture.image?.naturalWidth ?? texture.image?.videoWidth ?? texture.image?.width ?? 1;
    const height = texture.image?.naturalHeight ?? texture.image?.videoHeight ?? texture.image?.height ?? 1;
    const aspect = clamp(width / Math.max(1, height), 0.56, 1.9);
    const baseHeight = mesh.userData.baseHeight;
    mesh.scale.set(baseHeight * aspect, baseHeight, 1);
    mesh.userData.ready = true;
    requestRender();
    return true;
  }

  async function prepareHeroSwap(state, previous) {
    const mesh = heroMeshes.get(state);
    if (!mesh) return;
    const token = ++heroSwapToken;
    if (!(await loadMeshTexture(mesh)) || destroyed || token !== heroSwapToken) return;
    if (reducedMotion.matches || state === visualHeroState) {
      visualHeroState = state;
      hardSwitch(heroMeshes, visualHeroState);
      instrument.setHeroObservation(mesh.userData.observationId);
      instrument.inspection.setShutter(0);
      emit("atlas:interaction", {
        kind: "state-detent",
        value: state,
        pan: 0.16,
        interactionId: nextEventId("state"),
      });
      requestRender();
      return;
    }
    heroSwap = {
      from: visualHeroState,
      start: performance.now(),
      swapped: false,
      to: state,
    };
    emit("atlas:interaction", {
      kind: "state-detent",
      value: state,
      pan: 0.16,
      interactionId: nextEventId("state"),
    });
    requestRender();
  }

  async function prepareComparisonSwap(comparison, previous) {
    const mesh = compareMeshes.get(comparison);
    if (!mesh) return;
    const token = ++comparisonSwapToken;
    if (!(await loadMeshTexture(mesh)) || destroyed || token !== comparisonSwapToken) return;
    if (reducedMotion.matches || comparison === visualComparison) {
      visualComparison = comparison;
      hardSwitch(compareMeshes, visualComparison);
      instrument.comparator.setAngle(0);
      requestRender();
      return;
    }
    comparisonSwap = {
      from: visualComparison,
      start: performance.now(),
      startAngle: Math.abs(instrument.comparator.angle),
      swapped: false,
      to: comparison,
    };
    emit("atlas:interaction", {
      kind: "comparison-slide",
      value: comparison,
      pan: 0.28,
      interactionId: nextEventId("comparison"),
    });
    requestRender();
  }

  async function loadInitialPlate() {
    const active = heroMeshes.get(controls.state) ?? heroMeshes.values().next().value;
    if (!active) return false;
    const loaded = await loadMeshTexture(active);
    if (loaded) {
      initialReady = true;
      visualHeroState = active.userData.plate.state || controls.state;
      hardSwitch(heroMeshes, visualHeroState);
      instrument.setHeroObservation(active.userData.observationId);
    }
    return loaded;
  }

  function loadDeferredPlates() {
    const queue = [
      ...[...heroMeshes.values()].filter((mesh) => !mesh.userData.ready),
      ...compareMeshes.values(),
      ...reconstructionMeshes,
    ];
    let index = 0;
    const next = async () => {
      if (destroyed || index >= queue.length) return;
      await loadMeshTexture(queue[index]);
      index += 1;
      scheduleIdle(next);
    };
    scheduleIdle(next);

    const atlasUrl = performanceProfile.mobile
      ? model.atlas?.mobileUrl || model.atlas?.desktopUrl
      : model.atlas?.desktopUrl || model.atlas?.mobileUrl;
    if (atlasUrl) {
      scheduleIdle(async () => {
        const texture = await loadTexture(atlasUrl);
        if (!texture || destroyed) return;
        texture.flipY = false;
        texture.needsUpdate = true;
        instrument.lattice.setAtlasTexture(texture);
        emit("atlas:commit", {
          kind: "atlas",
          observations: instrument.lattice.atlasEntryCount,
          scene: activeScene,
        });
        requestRender();
      });
    }
  }

  function renderCommitFrame() {
    try {
      hardSwitch(heroMeshes, visualHeroState);
      hardSwitch(compareMeshes, visualComparison);
      applyCameraTransform(sampleCameraPath(pathCurrent, performanceProfile.mobile), 1, true);
      renderer.render(scene, camera);
      return true;
    } catch (_error) {
      return false;
    }
  }

  function hardSwitch(meshes, selected) {
    // Exact categorical outputs: never tween map, opacity, shader state, or UVs.
    for (const [key, mesh] of meshes) mesh.visible = key === selected && mesh.userData.ready;
  }

  function bind() {
    const sceneSections = [...chamberRoot.querySelectorAll("[data-chamber-scene]")]
      .map((section) => ({
        element: section,
        scene: normalizeScene(section.dataset.chamberScene),
      }))
      .filter((item) => item.scene);
    let previousScrollY = window.scrollY;
    let previousScrollTime = performance.now();

    const updateScrollState = () => {
      scrollTicking = false;
      if (!sceneSections.length) return;
      const viewportAnchor = window.innerHeight * 0.46;
      const { item: best, rect } = activeSceneSection(sceneSections, viewportAnchor);
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
      activateScene(best.scene, "scroll", { progress, velocity, emitProgress: true });
      requestRender();
    };

    const onScroll = () => {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(updateScrollState);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateScrollState();

    if (!reducedMotion.matches && !performanceProfile.coarse) {
      window.addEventListener(
        "pointermove",
        (event) => {
          pointer.x = (event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
          pointer.y = -((event.clientY / Math.max(window.innerHeight, 1)) * 2 - 1);
          requestRender();
        },
        { passive: true },
      );
      document.documentElement.addEventListener("pointerleave", () => {
        pointer.set(0, 0);
        requestRender();
      });
    }

    bindInstrumentInteractions();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    reducedMotion.addEventListener?.("change", () => {
      intro = reducedMotion.matches ? 1 : intro;
      if (reducedMotion.matches) {
        heroSwap = null;
        comparisonSwap = null;
        visualHeroState = controls.state;
        visualComparison = controls.comparison;
        hardSwitch(heroMeshes, visualHeroState);
        hardSwitch(compareMeshes, visualComparison);
        instrument.setHeroObservation(heroMeshes.get(visualHeroState)?.userData.observationId);
        instrument.inspection.setShutter(0);
        instrument.comparator.setAngle(0);
      }
      requestRender();
    });
  }

  function activateScene(nextScene, source = "system", telemetry = {}) {
    const normalized = normalizeScene(nextScene);
    if (!normalized) return;
    const previous = activeScene;
    const changed = normalized !== activeScene;
    if (changed) {
      activeScene = normalized;
      chamberRoot.dataset.chamberActiveScene = normalized;
      updateSceneDOM(chamberRoot, normalized);
    }
    activeSceneProgress = Number.isFinite(telemetry.progress) ? telemetry.progress : 0;
    const index = SCENES.indexOf(normalized);
    pathTarget = clamp(
      index + (index < SCENES.length - 1 ? smootherStep(0.18, 0.82, activeSceneProgress) : 0),
      0,
      SCENES.length - 1,
    );
    if (reducedMotion.matches) pathCurrent = index;
    if (!changed && !telemetry.emitProgress) return;
    const detail = {
      id: normalized,
      scene: normalized,
      previous: changed ? previous : normalized,
      index: SCENES.indexOf(normalized),
      source,
    };
    if (Number.isFinite(telemetry.progress)) detail.progress = telemetry.progress;
    if (Number.isFinite(telemetry.velocity)) detail.velocity = telemetry.velocity;
    emit("atlas:scene", detail);
  }

  function bindInstrumentInteractions() {
    const canvas = renderer.domElement;
    const compareHandle = chamberRoot.querySelector("[data-chamber-compare-handle]");

    const beginComparatorDrag = (event) => {
      if (activeScene !== "discriminate" || reducedMotion.matches) return;
      comparatorDrag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        distance: 0,
      };
      event.currentTarget?.setPointerCapture?.(event.pointerId);
      requestRender();
    };

    const onCanvasPointerDown = (event) => {
      if (activeScene === "discriminate" && !performanceProfile.coarse) {
        updateRaycaster(event);
        if (raycaster.intersectObject(instrument.comparator.hitTarget, true).length) {
          beginComparatorDrag(event);
          return;
        }
      }
      if (activeScene === "archive") {
        updateArchiveHover(event, true);
        if (hoverObservationId) {
          selectArchiveObservation(hoverObservationId, "pointer");
        }
      }
    };

    const onPointerMove = (event) => {
      if (comparatorDrag && comparatorDrag.pointerId === event.pointerId) {
        const width = Math.max(180, resizeWidth * 0.22);
        comparatorDrag.distance = clamp(event.clientX - comparatorDrag.startX, -width, width);
        const amount = Math.min(1, Math.abs(comparatorDrag.distance) / (width * 0.52));
        instrument.comparator.setAngle(amount * Math.PI * 0.5 * Math.sign(comparatorDrag.distance || 1));
        requestRender();
        return;
      }
      if (activeScene === "archive" && !performanceProfile.coarse) updateArchiveHover(event);
    };

    const finishComparatorDrag = (event) => {
      if (!comparatorDrag || comparatorDrag.pointerId !== event.pointerId) return;
      const distance = comparatorDrag.distance;
      const commit = Math.abs(instrument.comparator.angle) >= Math.PI * 0.34;
      const previousDrag = comparatorDrag;
      comparatorDrag = null;
      event.currentTarget?.releasePointerCapture?.(event.pointerId);
      if (commit) {
        const next = visualComparison === "halation" ? "bloom" : "halation";
        controls.selectComparison(next, "drag");
      } else {
        comparisonSwap = {
          from: visualComparison,
          start: performance.now(),
          startAngle: Math.abs(instrument.comparator.angle),
          swapped: true,
          to: visualComparison,
        };
      }
      emit("atlas:commit", {
        kind: "comparator-drag",
        phase: commit ? "commit" : "cancel",
        comparison: controls.comparison,
        distance,
        direction: Math.sign(previousDrag.distance),
        scene: activeScene,
      });
      requestRender();
    };

    canvas.addEventListener("pointerdown", onCanvasPointerDown);
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerup", finishComparatorDrag);
    canvas.addEventListener("pointercancel", finishComparatorDrag);
    canvas.addEventListener("pointerleave", (event) => {
      if (comparatorDrag) finishComparatorDrag(event);
      clearArchiveHover();
    });
    compareHandle?.addEventListener("pointerdown", beginComparatorDrag);
    compareHandle?.addEventListener("pointermove", onPointerMove, { passive: true });
    compareHandle?.addEventListener("pointerup", finishComparatorDrag);
    compareHandle?.addEventListener("pointercancel", finishComparatorDrag);
  }

  function updateRaycaster(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1,
      -(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1),
    );
    raycaster.setFromCamera(pointer, camera);
  }

  function updateArchiveHover(event, immediate = false) {
    updateRaycaster(event);
    const hit = instrument.lattice.raycastTargets
      .flatMap((target) => raycaster.intersectObject(target, false))
      .sort((left, right) => left.distance - right.distance)[0];
    const observationId = hit
      ? instrument.lattice.observationIdForInstance(hit.instanceId, hit.object)
      : "";
    if (observationId === hoverObservationId) return;
    clearTimeout(hoverTimer);
    hoverObservationId = observationId;
    instrument.lattice.setHovered(observationId);
    renderer.domElement.style.cursor = observationId ? "pointer" : "";
    if (observationId) {
      emit("atlas:commit", {
        kind: "observation-hover",
        observationId,
        phase: "start",
        scene: activeScene,
      });
      hoverTimer = window.setTimeout(
        () => void previewArchiveObservation(observationId),
        immediate ? 0 : 160,
      );
    }
    requestRender();
  }

  function clearArchiveHover() {
    clearTimeout(hoverTimer);
    if (hoverObservationId) {
      emit("atlas:commit", {
        kind: "observation-hover",
        observationId: hoverObservationId,
        phase: "end",
        scene: activeScene,
      });
    }
    hoverObservationId = "";
    instrument.lattice.setHovered("");
    renderer.domElement.style.cursor = "";
    requestRender();
  }

  async function previewArchiveObservation(observationId) {
    if (observationId !== hoverObservationId) return;
    const observation = model.observations.find((item) => item.id === observationId);
    if (!observation?.imageUrl) return;
    const plate = instrument.selection.setObservation(observationPlate(observation));
    if (!(await loadMeshTexture(plate)) || observationId !== hoverObservationId) return;
    instrument.selection.show(observationId);
    emit("atlas:commit", {
      kind: "observation-preview",
      observationId,
      scene: activeScene,
    });
    requestRender();
  }

  function selectArchiveObservation(observationId, source) {
    const position = instrument.lattice.positionForObservation(observationId);
    emit("atlas:interaction", {
      kind: "archive-open",
      value: observationId,
      pan: clamp((position?.x ?? 0) / 16, -0.3, 0.3),
      interactionId: nextEventId("archive"),
    });
    emit("atlas:commit", {
      kind: "observation",
      observationId,
      scene: activeScene,
    });
    const prefix = chamberRoot.dataset.prefix || "";
    window.location.assign(
      new URL(`${prefix}observations/${encodeURIComponent(observationId)}.html`, document.baseURI),
    );
  }

  function resize(width, height) {
    resizeWidth = Math.max(1, Math.floor(width || window.innerWidth || 1));
    resizeHeight = Math.max(1, Math.floor(height || window.innerHeight || 1));
    renderer.setSize(resizeWidth, resizeHeight, false);
    camera.aspect = resizeWidth / resizeHeight;
    instrument.setCompact(camera.aspect < 0.82);
    requestRender();
  }

  function requestRender() {
    if (!running && !document.hidden) start();
  }

  function start() {
    if (running || destroyed || document.hidden) return;
    running = true;
    clock.start();
    frameRequest = window.requestAnimationFrame(frame);
  }

  function stop() {
    if (!running) return;
    running = false;
    window.cancelAnimationFrame(frameRequest);
    clock.stop();
  }

  function frame() {
    if (!running || destroyed) return;
    const delta = Math.min(clock.getDelta() || 1 / 60, 0.05);
    const still = reducedMotion.matches;
    const transformEase = still ? 1 : 1 - Math.exp(-delta * 5.2);
    const pointerEase = still ? 1 : 1 - Math.exp(-delta * 4.1);

    intro = still ? 1 : initialReady ? Math.min(1, intro + delta / 1.2) : 0;
    pointerSmoothed.lerp(pointer, pointerEase);
    pathCurrent += (pathTarget - pathCurrent) * transformEase;
    if (still) pathCurrent = pathTarget;

    const cameraSample = sampleCameraPath(pathCurrent, performanceProfile.mobile);
    applyCameraTransform(cameraSample, transformEase, still);
    const entrance = smootherStep(0, 1, intro);
    camera.position.z += (1 - entrance) * 2.2;
    pointerLookRig.rotation.y = still || performanceProfile.coarse ? 0 : pointerSmoothed.x * 0.0384;
    pointerLookRig.rotation.x = still || performanceProfile.coarse ? 0 : -pointerSmoothed.y * 0.021;

    updateStateShutter(performance.now(), entrance);
    updateComparator(performance.now());
    instrument.update(pathCurrent, delta, still);
    environment.update(pathCurrent, pointerSmoothed, entrance);

    if (initialReady) {
      hardSwitch(heroMeshes, visualHeroState);
      hardSwitch(compareMeshes, visualComparison);
    }

    renderer.render(scene, camera);
    updateJourneyEvents();
    emitRenderedCamera(performance.now());

    const cameraSettled = Math.abs(pathTarget - pathCurrent) < 0.0015;

    if (!performanceReduced && delta > 0.022) slowFrames += 1;
    else slowFrames = Math.max(0, slowFrames - 2);
    if (!performanceReduced && slowFrames > 90) {
      performanceReduced = true;
      renderer.setPixelRatio(Math.min(1, renderer.getPixelRatio()));
      renderer.shadowMap.enabled = false;
      resize(resizeWidth, resizeHeight);
      emit("atlas:commit", { kind: "performance-tier", tier: "reduced" });
    }

    if (still) {
      running = false;
      clock.stop();
      return;
    }

    const moving =
      !cameraSettled ||
      intro < 1 ||
      Boolean(heroSwap || comparisonSwap || comparatorDrag) ||
      instrument.isMoving();
    stableFrames = moving ? 0 : stableFrames + 1;
    if (stableFrames > 24) {
      emitRenderedCamera(performance.now(), true);
      running = false;
      clock.stop();
      return;
    }
    frameRequest = window.requestAnimationFrame(frame);
  }

  function applyCameraTransform(sample, ease, immediate = false) {
    desiredCameraPosition.copy(sample.position);
    desiredCameraTarget.copy(sample.target);
    if (immediate) {
      currentCameraPosition.copy(desiredCameraPosition);
      currentCameraTarget.copy(desiredCameraTarget);
    } else {
      currentCameraPosition.lerp(desiredCameraPosition, ease);
      currentCameraTarget.lerp(desiredCameraTarget, ease);
    }
    journeyPivot.position.copy(currentCameraTarget);
    camera.position.copy(currentCameraPosition).sub(currentCameraTarget);
    camera.lookAt(0, 0, 0);
    const nextFov = camera.fov + (sample.fov - camera.fov) * (immediate ? 1 : ease);
    if (Math.abs(camera.fov - nextFov) > 0.001) {
      camera.fov = nextFov;
      camera.updateProjectionMatrix();
    }
  }

  function updateStateShutter(now, entrance) {
    if (!heroSwap) {
      instrument.inspection.setShutter(1 - smootherStep(0.12, 0.72, entrance));
      return;
    }
    const progress = clamp((now - heroSwap.start) / 640, 0, 1);
    let shutter = 0;
    if (progress < 0.36) shutter = smootherStep(0, 0.36, progress);
    else if (progress < 0.48) shutter = 1;
    else shutter = 1 - smootherStep(0.48, 1, progress);
    instrument.inspection.setShutter(shutter);
    if (!heroSwap.swapped && progress >= 0.4) {
      heroSwap.swapped = true;
      visualHeroState = heroSwap.to;
      hardSwitch(heroMeshes, visualHeroState);
      instrument.setHeroObservation(heroMeshes.get(visualHeroState)?.userData.observationId);
      emit("atlas:commit", {
        kind: "state-occluded-swap",
        from: heroSwap.from,
        to: heroSwap.to,
        exact: true,
        shutter,
        scene: activeScene,
      });
    }
    if (progress >= 1) {
      const completed = heroSwap;
      heroSwap = null;
      instrument.inspection.setShutter(0);
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

  function updateComparator(now) {
    if (comparatorDrag || !comparisonSwap) return;
    const progress = clamp((now - comparisonSwap.start) / 560, 0, 1);
    let angle;
    if (comparisonSwap.to === comparisonSwap.from) {
      angle = comparisonSwap.startAngle * (1 - smootherStep(0, 1, progress));
    } else if (progress < 0.5) {
      angle = mapRange(
        smootherStep(0, 0.5, progress),
        0,
        1,
        comparisonSwap.startAngle,
        Math.PI * 0.5,
      );
    } else {
      angle = Math.PI * 0.5 * (1 - smootherStep(0.5, 1, progress));
    }
    instrument.comparator.setAngle(angle);
    if (!comparisonSwap.swapped && progress >= 0.5) {
      comparisonSwap.swapped = true;
      visualComparison = comparisonSwap.to;
      hardSwitch(compareMeshes, visualComparison);
      emit("atlas:commit", {
        kind: "comparator-edge-swap",
        phase: "edge-swap",
        from: comparisonSwap.from,
        to: comparisonSwap.to,
        angle: Math.PI * 0.5,
        exact: true,
        scene: activeScene,
      });
    }
    if (progress >= 1) {
      const completed = comparisonSwap;
      comparisonSwap = null;
      instrument.comparator.setAngle(0);
      emit("atlas:commit", {
        kind: "comparator-bearing",
        phase: "complete",
        from: completed.from,
        to: completed.to,
        exact: true,
        scene: activeScene,
      });
    }
  }

  function emitRenderedCamera(now, forceSettled = false) {
    if (!forceSettled && now - lastCameraEvent < 90 && running) return;
    lastCameraEvent = now;
    camera.getWorldPosition(renderedCameraPosition);
    renderedCameraTarget.copy(journeyPivot.position);
    const elapsedSeconds = lastCameraEventTime
      ? Math.max(0.001, (now - lastCameraEventTime) / 1000)
      : 1 / 60;
    const rawSpeed = lastCameraEventTime
      ? renderedCameraPosition.distanceTo(emitRenderedCamera.lastPosition) / elapsedSeconds
      : 0;
    const speed = forceSettled ? 0 : clamp(rawSpeed / 60, 0, 0.3);
    const acceleration = forceSettled
      ? clamp(-lastCameraSpeed / elapsedSeconds, -1, 1)
      : clamp(((speed - lastCameraSpeed) / elapsedSeconds) * 0.4, -1, 1);
    const direction = Math.sign(pathTarget - pathCurrent) || Math.sign(pathCurrent - previousTransitionPath);
    emit("atlas:camera", {
      journey: Number((pathCurrent / Math.max(1, SCENES.length - 1)).toFixed(5)),
      scene: activeScene,
      localProgress: Number(activeSceneProgress.toFixed(4)),
      speed: Number(speed.toFixed(5)),
      acceleration: Number(acceleration.toFixed(5)),
      x: Number(renderedCameraPosition.x.toFixed(4)),
      z: Number(renderedCameraPosition.z.toFixed(4)),
      direction,
      path: Number(pathCurrent.toFixed(4)),
      progress: Number(activeSceneProgress.toFixed(4)),
      position: vectorArray(renderedCameraPosition),
      target: vectorArray(renderedCameraTarget),
      fov: Number(camera.fov.toFixed(3)),
      renderedAt: Math.round(now),
    });
    emitRenderedCamera.lastPosition.copy(renderedCameraPosition);
    lastCameraEventTime = now;
    lastCameraSpeed = speed;
  }
  emitRenderedCamera.lastPosition = new THREE.Vector3();

  function updateJourneyEvents() {
    const previous = previousTransitionPath;
    const current = pathCurrent;
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
        if (!cameraJourneyTransition || cameraJourneyTransition.from !== from || cameraJourneyTransition.to !== to) {
          beginJourneyTransition(from, to, direction);
        }
        if (!cameraJourneyTransition.crossed) {
          cameraJourneyTransition.crossed = true;
          emitJourneyPhase(cameraJourneyTransition, "cross");
        }
      }
      if (crossed(arriveThreshold)) {
        if (!cameraJourneyTransition || cameraJourneyTransition.from !== from || cameraJourneyTransition.to !== to) {
          beginJourneyTransition(from, to, direction);
        }
        if (!cameraJourneyTransition.crossed) {
          cameraJourneyTransition.crossed = true;
          emitJourneyPhase(cameraJourneyTransition, "cross");
        }
        emitJourneyPhase(cameraJourneyTransition, "arrive");
        cameraJourneyTransition = null;
      }
    }
    previousTransitionPath = current;
  }

  function beginJourneyTransition(from, to, direction) {
    cameraJourneyTransition = {
      crossed: false,
      direction,
      from,
      id: nextEventId(`journey-${from}-${to}`),
      to,
    };
    emitJourneyPhase(cameraJourneyTransition, "depart");
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
    bind,
    loadInitialPlate,
    loadDeferredPlates,
    renderCommitFrame,
    resize,
    start,
    stop,
    get activeScene() {
      return activeScene;
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

function createChamberShell(scene, profile) {
  const group = new THREE.Group();
  group.name = "chamber-shell";
  scene.add(group);

  const hemisphere = new THREE.HemisphereLight(0xe7e0d3, 0x151815, 1.38);
  const key = new THREE.DirectionalLight(0xffe2bd, 2.7);
  key.position.set(-4.5, 7.2, 8.5);
  key.castShadow = !profile.constrained;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -11;
  key.shadow.camera.right = 11;
  key.shadow.camera.top = 8;
  key.shadow.camera.bottom = -8;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 32;
  key.shadow.bias = -0.0004;
  const rim = new THREE.DirectionalLight(0x9bafb6, 1.08);
  rim.position.set(7.5, 3.4, -8.2);
  const fill = new THREE.PointLight(0xd7c4aa, 15, 18, 2);
  fill.position.set(6.4, 3.8, 5.8);
  group.add(hemisphere, key, rim, fill);

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x101211,
    metalness: 0.11,
    roughness: 0.91,
    side: THREE.BackSide,
  });
  const shell = new THREE.Mesh(
    new THREE.CylinderGeometry(17, 17, 13, profile.constrained ? 32 : 64, 1, true, -1.42, 2.84),
    wallMaterial,
  );
  shell.name = "continuous-cyclorama";
  shell.position.y = 1.1;
  shell.receiveShadow = !profile.constrained;
  group.add(shell);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(17, profile.constrained ? 32 : 64),
    new THREE.MeshStandardMaterial({
      color: PALETTE.floor,
      metalness: 0.24,
      roughness: 0.76,
      side: THREE.DoubleSide,
    }),
  );
  floor.name = "instrument-floor";
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -4.15;
  floor.receiveShadow = !profile.constrained;
  group.add(floor);

  const datumMaterial = new THREE.LineBasicMaterial({
    color: 0x353733,
    opacity: 0.32,
    transparent: true,
  });
  const datumGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-11, -4.11, 0),
    new THREE.Vector3(11, -4.11, 0),
    new THREE.Vector3(0, -4.11, -10),
    new THREE.Vector3(0, -4.11, 10),
  ]);
  group.add(new THREE.LineSegments(datumGeometry, datumMaterial));

  return {
    update(path, pointer, entrance) {
      key.position.x = -4.5 + pointer.x * 0.55;
      key.intensity = 1.65 + entrance * 1.05;
      rim.intensity = 0.78 + clamp(path / 5, 0, 1) * 0.3;
    },
  };
}

function createEvidenceInstrument(model, profile) {
  const group = new THREE.Group();
  group.name = "evidence-engine";

  const lattice = createEvidenceLattice(model, profile);
  const inspection = createInspectionDock(model.hero.levels);
  const response = createResponseWake();
  const comparator = createComparator(model.comparison);
  const compass = createCorrelationCompass();
  const reconstruction = createReconstructionRails(model.reconstruction);
  const selection = createSelectionDock();
  const structuralFrame = createStructuralFrame();

  lattice.group.name = "controlled-lattice-and-secondary-registry";
  inspection.group.name = "inspection-dock";
  response.group.name = "response-wake";
  comparator.group.name = "comparator-bearing";
  compass.group.name = "correlation-compass";
  reconstruction.group.name = "reconstruction-tray";
  selection.group.name = "selection-dock";
  structuralFrame.name = "structural-frame";

  const desktopPositions = {
    inspection: new THREE.Vector3(2.15, 0.05, 3.2),
    response: new THREE.Vector3(-4.15, 0.12, 0.72),
    comparator: new THREE.Vector3(3.85, 0.12, 0.7),
    compass: new THREE.Vector3(-2.8, 0.2, -3.1),
    reconstruction: new THREE.Vector3(2.7, -1.0, -3.3),
    selection: new THREE.Vector3(0, 3.55, -0.2),
  };
  const compactPositions = {
    inspection: new THREE.Vector3(0.55, 0.05, 3.45),
    response: new THREE.Vector3(-3.5, 0.12, 0.8),
    comparator: new THREE.Vector3(3.15, 0.12, 0.9),
    compass: new THREE.Vector3(-2.35, 0.2, -3.05),
    reconstruction: new THREE.Vector3(1.15, -1.0, -3.35),
    selection: new THREE.Vector3(0, 3.35, 0),
  };
  let compact = false;
  let returnAmount = 0;
  let desiredReturnAmount = 0;
  let activeHeroObservationId = model.hero.levels.find((plate) => plate.state === "high")?.observationId ?? "";

  group.add(
    structuralFrame,
    lattice.group,
    inspection.group,
    response.group,
    comparator.group,
    compass.group,
    reconstruction.group,
    selection.group,
  );
  applyLayout();

  function applyLayout() {
    const positions = compact ? compactPositions : desktopPositions;
    if (returnAmount < 0.001) inspection.group.position.copy(positions.inspection);
    response.group.position.copy(positions.response);
    comparator.group.position.copy(positions.comparator);
    compass.group.position.copy(positions.compass);
    reconstruction.group.position.copy(positions.reconstruction);
    reconstruction.group.scale.setScalar(compact ? 0.64 : 1);
    selection.group.position.copy(positions.selection);
    lattice.group.scale.setScalar(compact ? 0.9 : 1);
    structuralFrame.scale.x = compact ? 0.86 : 1;
  }

  return {
    group,
    lattice,
    inspection,
    response,
    comparator,
    compass,
    reconstruction,
    selection,
    setCompact(nextCompact) {
      if (compact === nextCompact) return;
      compact = nextCompact;
      applyLayout();
    },
    setHeroObservation(observationId) {
      activeHeroObservationId = observationId || activeHeroObservationId;
    },
    update(path, delta, still) {
      desiredReturnAmount = smootherStep(4.5, 5, path);
      const ease = still ? 1 : 1 - Math.exp(-delta * 5.2);
      returnAmount += (desiredReturnAmount - returnAmount) * ease;
      const positions = compact ? compactPositions : desktopPositions;
      const returnTarget = lattice.positionForObservation(activeHeroObservationId) ?? new THREE.Vector3();
      group.updateMatrixWorld(true);
      lattice.group.updateMatrixWorld(true);
      lattice.group.localToWorld(returnTarget);
      group.worldToLocal(returnTarget);
      returnTarget.z += 0.48;
      inspection.group.position.lerpVectors(positions.inspection, returnTarget, returnAmount);
      const returnScale = 1 - returnAmount * 0.86;
      inspection.group.scale.setScalar(returnScale);
      inspection.group.rotation.y = returnAmount * -0.16;

      response.setReveal(smootherStep(0.7, 1.08, path), delta, still);
      comparator.setPresence(smootherStep(1.6, 2.05, path), delta, still);
      compass.setReveal(smootherStep(2.65, 3.08, path), delta, still);
      reconstruction.setReveal(smootherStep(3.65, 4.08, path), delta, still);
      lattice.setArchiveReveal(smootherStep(4.45, 5, path), delta, still);
      lattice.update(delta, still);
    },
    isMoving() {
      return (
        Math.abs(returnAmount - desiredReturnAmount) > 0.001 ||
        lattice.isMoving() ||
        response.isMoving() ||
        comparator.isMoving() ||
        compass.isMoving() ||
        reconstruction.isMoving()
      );
    },
  };
}

function createStructuralFrame() {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color: 0x565b51,
    metalness: 0.74,
    roughness: 0.39,
  });
  const rails = [
    [-5.7, -3.1, -0.35, 0.055, 6.2, 0.055],
    [5.7, -3.1, -0.35, 0.055, 6.2, 0.055],
    [0, -3.65, -0.4, 11.45, 0.055, 0.055],
    [0, 3.15, -0.4, 11.45, 0.055, 0.055],
    [-4.55, -3.84, 1.1, 0.055, 0.055, 7.4],
    [4.55, -3.84, 1.1, 0.055, 0.055, 7.4],
  ];
  for (const [x, y, z, sx, sy, sz] of rails) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material);
    rail.position.set(x, y, z);
    rail.castShadow = true;
    group.add(rail);
  }
  return group;
}

function createInspectionDock(levels) {
  const group = new THREE.Group();
  const plateLayer = new THREE.Group();
  const meshes = new Map();
  const width = 3.48;
  const height = 3.48;
  const frame = createPlateFrame(width, height, 0.11);
  const backlight = new THREE.Mesh(
    new THREE.PlaneGeometry(width + 0.34, height + 0.34),
    new THREE.MeshBasicMaterial({ color: 0x2b2119, toneMapped: false }),
  );
  backlight.position.z = -0.08;
  group.add(backlight, plateLayer, frame);

  for (const plate of levels) {
    const mesh = createExactPlate(plate, 3.34);
    mesh.visible = false;
    plateLayer.add(mesh);
    meshes.set(plate.state, mesh);
  }

  const shutterMaterial = new THREE.MeshStandardMaterial({
    color: 0x111312,
    metalness: 0.8,
    roughness: 0.31,
  });
  const left = new THREE.Mesh(new THREE.BoxGeometry(width * 0.5 + 0.04, height + 0.04, 0.055), shutterMaterial);
  const right = left.clone();
  left.position.z = 0.09;
  right.position.z = 0.09;
  left.castShadow = true;
  right.castShadow = true;
  group.add(left, right);

  let shutterAmount = 1;
  function setShutter(amount) {
    shutterAmount = clamp(amount, 0, 1);
    const openCenter = width * 0.83;
    const closedCenter = width * 0.25;
    left.position.x = -mapRange(shutterAmount, 0, 1, openCenter, closedCenter);
    right.position.x = mapRange(shutterAmount, 0, 1, openCenter, closedCenter);
  }
  setShutter(1);
  return { group, meshes, setShutter, get shutterAmount() { return shutterAmount; } };
}

function createComparator(comparison) {
  const group = new THREE.Group();
  const bearing = new THREE.Group();
  const plates = new THREE.Group();
  const meshes = new Map();
  const size = 3.05;
  bearing.name = "edge-on-exact-switch-bearing";
  group.add(bearing);
  group.rotation.y = 0.82;
  bearing.add(plates, createPlateFrame(size, size, 0.1));

  for (const key of ["halation", "bloom"]) {
    const plate = comparison[key];
    if (!plate) continue;
    const mesh = createExactPlate({ ...plate, state: key }, size - 0.14);
    // The bearing deliberately rotates through both hemispheres. Sampling the
    // same exact texture from either side avoids a black back-face during a
    // reversed camera approach; the map itself is never blended or processed.
    mesh.material.side = THREE.DoubleSide;
    mesh.visible = false;
    plates.add(mesh);
    meshes.set(key, mesh);
  }

  const spine = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, size + 0.5, 12),
    new THREE.MeshStandardMaterial({ color: 0x4c4d48, metalness: 0.82, roughness: 0.28 }),
  );
  spine.position.x = -size * 0.58;
  bearing.add(spine);
  const hitTarget = new THREE.Mesh(
    new THREE.PlaneGeometry(size + 0.5, size + 0.5),
    new THREE.MeshBasicMaterial({ color: 0, opacity: 0, transparent: true, depthWrite: false }),
  );
  hitTarget.position.z = 0.13;
  bearing.add(hitTarget);
  let angle = 0;
  let presence = 0;
  let desiredPresence = 0;

  return {
    group,
    meshes,
    hitTarget,
    get angle() { return angle; },
    setAngle(nextAngle) {
      angle = clamp(nextAngle, -Math.PI * 0.5, Math.PI * 0.5);
      bearing.rotation.y = angle;
    },
    setPresence(nextPresence, delta, still) {
      desiredPresence = nextPresence;
      const ease = still ? 1 : 1 - Math.exp(-delta * 5.4);
      presence += (desiredPresence - presence) * ease;
      bearing.position.z = (1 - presence) * -0.42;
      bearing.rotation.z = (1 - presence) * 0.07;
      spine.rotation.y = (1 - presence) * 0.34;
    },
    isMoving() { return Math.abs(presence - desiredPresence) > 0.001; },
  };
}

function createExactPlate(plate, baseHeight) {
  const material = new THREE.MeshBasicMaterial({
    color: 0x0d0e0e,
    depthTest: true,
    depthWrite: true,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
  mesh.name = `exact-plate-${plate.observationId || plate.state || "unknown"}`;
  mesh.renderOrder = 6;
  mesh.scale.set(baseHeight, baseHeight, 1);
  mesh.userData = {
    ...mesh.userData,
    baseHeight,
    imageUrl: plate.imageUrl,
    fallbackImageUrl: plate.fallbackImageUrl || "",
    observationId: plate.observationId,
    plate,
    ready: false,
  };
  return mesh;
}

function createPlateFrame(width, height, depth) {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color: 0x676b60,
    metalness: 0.82,
    roughness: 0.32,
  });
  const horizontalGeometry = new THREE.BoxGeometry(width + 0.18, 0.055, depth);
  const verticalGeometry = new THREE.BoxGeometry(0.055, height + 0.18, depth);
  for (const y of [-height * 0.5 - 0.07, height * 0.5 + 0.07]) {
    const edge = new THREE.Mesh(horizontalGeometry, material);
    edge.position.set(0, y, 0.015);
    edge.castShadow = true;
    group.add(edge);
  }
  for (const x of [-width * 0.5 - 0.07, width * 0.5 + 0.07]) {
    const edge = new THREE.Mesh(verticalGeometry, material);
    edge.position.set(x, 0, 0.015);
    edge.castShadow = true;
    group.add(edge);
  }
  const registration = makeCornerRegistration(width, height);
  registration.position.z = 0.09;
  group.add(registration);
  return group;
}

function makeCornerRegistration(width, height) {
  const x = width * 0.5 + 0.14;
  const y = height * 0.5 + 0.14;
  const length = 0.22;
  const vertices = [];
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      vertices.push(
        sx * x, sy * y, 0,
        sx * (x - length), sy * y, 0,
        sx * x, sy * y, 0,
        sx * x, sy * (y - length), 0,
      );
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  return new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({ color: PALETTE.register, opacity: 0.66, transparent: true }),
  );
}

function createEvidenceLattice(model, profile) {
  const group = new THREE.Group();
  const observations = model.observations;
  const studyIds = model.studies.map((study) => study.id);
  if (!studyIds.length) {
    for (const observation of observations) {
      if (observation.studyId && !studyIds.includes(observation.studyId)) {
        studyIds.push(observation.studyId);
      }
    }
  }
  const anchorRows = [
    "anchor_architecture",
    "anchor_object",
    "anchor_landscape",
    "anchor_lamp_architecture",
    "anchor_lamp_object",
    "anchor_lamp_landscape",
  ];
  const levelDepth = new Map(LEVELS.map((level, index) => [level, (index - 1) * 0.3]));
  const slotPositions = new Map();
  const usedSlots = new Set();
  const positionById = new Map();
  const observationIndexById = new Map(observations.map((item, index) => [item.id, index]));
  const columnCount = Math.max(1, studyIds.length);
  const slotDescriptors = [];
  studyIds.forEach((studyId, studyIndex) => {
    const applicableAnchors = anchorRows.filter((anchorId) =>
      observations.some(
        (observation) =>
          observation.studyId === studyId &&
          observation.anchorId === anchorId &&
          LEVELS.includes(observation.requestedLevel),
      ),
    );
    for (const anchorId of applicableAnchors) {
      for (const level of LEVELS) slotDescriptors.push({ anchorId, level, studyId, studyIndex });
    }
  });
  const slotCount = slotDescriptors.length;
  // Each register is backed by a quiet, self-lit silver reveal. The image
  // remains an unprocessed MeshBasic face; this narrow physical surround is
  // what keeps the matrix readable when the camera reaches its dark side.
  const slotGeometry = new THREE.BoxGeometry(0.68, 0.68, 0.035);
  const slotMaterial = new THREE.MeshStandardMaterial({
    color: 0x73776d,
    emissive: 0x24251f,
    emissiveIntensity: 0.72,
    metalness: 0.62,
    roughness: 0.42,
  });
  const slots = new THREE.InstancedMesh(slotGeometry, slotMaterial, Math.max(1, slotCount));
  slots.count = slotCount;
  slots.name = `${slotCount}-truthful-study-slots`;
  // Dense rows casting into one another produced broad black masks rather
  // than useful depth. The chamber rails still cast the authored shadows.
  slots.castShadow = false;
  slots.receiveShadow = false;
  const matrix = new THREE.Matrix4();
  const identityQuaternion = new THREE.Quaternion();
  const unitScale = new THREE.Vector3(1, 1, 1);
  let slotIndex = 0;

  for (const descriptor of slotDescriptors) {
    const { anchorId, level, studyId, studyIndex } = descriptor;
    const normalizedColumn = columnCount === 1 ? 0 : studyIndex / (columnCount - 1) - 0.5;
    const arc = -0.72 + Math.cos(normalizedColumn * Math.PI) * 0.42;
    const anchorIndex = anchorRows.indexOf(anchorId);
    const position = new THREE.Vector3(
      (studyIndex - (columnCount - 1) * 0.5) * 0.92,
      2.34 - Math.max(0, anchorIndex) * 0.86,
      arc + (levelDepth.get(level) ?? 0),
    );
    const key = latticeSlotKey(studyId, anchorId, level);
    slotPositions.set(key, position);
    matrix.compose(position, identityQuaternion, unitScale);
    slots.setMatrixAt(slotIndex, matrix);
    slotIndex += 1;
  }
  slots.instanceMatrix.needsUpdate = true;
  group.add(slots);

  const registerPoints = [];
  const left = -((columnCount - 1) * 0.5) * 0.92 - 0.42;
  const right = ((columnCount - 1) * 0.5) * 0.92 + 0.42;
  for (let index = 0; index < columnCount; index += 1) {
    const x = (index - (columnCount - 1) * 0.5) * 0.92;
    registerPoints.push(new THREE.Vector3(x, -2.38, -1.13), new THREE.Vector3(x, 2.76, -1.13));
  }
  for (let index = 0; index < anchorRows.length; index += 1) {
    const y = 2.34 - index * 0.86;
    registerPoints.push(new THREE.Vector3(left, y, -1.13), new THREE.Vector3(right, y, -1.13));
  }
  const rackRegister = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(registerPoints),
    new THREE.LineBasicMaterial({
      color: 0xaaa28d,
      opacity: 0.22,
      transparent: true,
    }),
  );
  rackRegister.name = "measured-matrix-register";
  group.add(rackRegister);

  const secondary = [];
  for (const observation of observations) {
    const slotKey = latticeSlotKey(observation.studyId, observation.anchorId, observation.requestedLevel);
    const slotPosition = slotPositions.get(slotKey);
    if (slotPosition && !usedSlots.has(slotKey)) {
      usedSlots.add(slotKey);
      positionById.set(observation.id, slotPosition.clone());
    } else {
      secondary.push(observation);
    }
  }
  const secondaryColumns = Math.min(14, Math.max(1, secondary.length));
  secondary.forEach((observation, index) => {
    const column = index % secondaryColumns;
    const row = Math.floor(index / secondaryColumns);
    positionById.set(
      observation.id,
      new THREE.Vector3(
        (column - (secondaryColumns - 1) * 0.5) * 0.7,
        -3.02 - row * 0.55,
        -0.66 + row * 0.42,
      ),
    );
  });

  const carrierGeometry = new THREE.BoxGeometry(0.58, 0.58, 0.11);
  const carrierMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x1c1e19,
    emissiveIntensity: 0.65,
    metalness: 0.62,
    roughness: 0.4,
    vertexColors: true,
  });
  const carriers = new THREE.InstancedMesh(carrierGeometry, carrierMaterial, observations.length);
  carriers.name = `${observations.length}-physical-observation-carriers`;
  carriers.castShadow = false;
  carriers.receiveShadow = false;
  carriers.userData.observationIds = observations.map((item) => item.id);

  const hoverAmounts = new Float32Array(observations.length);
  const thumbnailIndexByObservationIndex = new Map();
  const atlasObservations = model.atlas
    ? observations.filter((observation) => model.atlas.entries.has(observation.id))
    : [];
  const thumbnailGeometry = new THREE.PlaneGeometry(0.52, 0.52);
  const atlasRects = new Float32Array(Math.max(1, atlasObservations.length) * 4);
  const atlasMaterial = createAtlasMaterial();
  const thumbnails = new THREE.InstancedMesh(
    thumbnailGeometry,
    atlasMaterial,
    Math.max(1, atlasObservations.length),
  );
  thumbnails.name = `${atlasObservations.length}-exact-atlas-thumbnails`;
  thumbnails.renderOrder = 4;
  thumbnails.visible = false;
  thumbnails.userData.observationIds = atlasObservations.map((item) => item.id);
  thumbnailGeometry.setAttribute("atlasRect", new THREE.InstancedBufferAttribute(atlasRects, 4));

  const atlasLayout = profile.mobile ? model.atlas?.mobile : model.atlas?.desktop;
  atlasObservations.forEach((observation, thumbnailIndex) => {
    const observationIndex = observationIndexById.get(observation.id);
    thumbnailIndexByObservationIndex.set(observationIndex, thumbnailIndex);
    const entryIndex = model.atlas.entries.get(observation.id);
    const rect = atlasUvRect(entryIndex, model.atlas, atlasLayout);
    atlasRects.set(rect, thumbnailIndex * 4);
  });
  thumbnailGeometry.attributes.atlasRect.needsUpdate = true;

  let hoveredId = "";
  let archiveReveal = 0;
  let desiredArchiveReveal = 0;
  let moving = false;

  function writeMatrices() {
    moving = false;
    for (let index = 0; index < observations.length; index += 1) {
      const observation = observations[index];
      const base = positionById.get(observation.id) ?? new THREE.Vector3();
      const targetHover = observation.id === hoveredId ? 1 : 0;
      if (Math.abs(hoverAmounts[index] - targetHover) > 0.001) moving = true;
      const position = base.clone();
      position.z += hoverAmounts[index] * 0.12;
      const scale = 1 + hoverAmounts[index] * 0.035;
      matrix.compose(position, identityQuaternion, new THREE.Vector3(scale, scale, scale));
      carriers.setMatrixAt(index, matrix);

      const thumbnailIndex = thumbnailIndexByObservationIndex.get(index);
      if (!Number.isInteger(thumbnailIndex)) continue;
      const facePosition = position.clone();
      facePosition.z += 0.063 + archiveReveal * (secondary.includes(observation) ? 0.06 : 0.025);
      matrix.compose(facePosition, identityQuaternion, new THREE.Vector3(scale, scale, scale));
      thumbnails.setMatrixAt(thumbnailIndex, matrix);
    }
    carriers.instanceMatrix.needsUpdate = true;
    thumbnails.instanceMatrix.needsUpdate = true;
  }

  function setAxis(axis) {
    const range = scoreRange(observations, axis);
    const unmeasured = new THREE.Color(0x777b72);
    const measured = new THREE.Color(PALETTE.paper);
    for (let index = 0; index < observations.length; index += 1) {
      const observation = observations[index];
      const score = observation.scores.get(axis);
      const confidence = observation.confidence.get(axis);
      const amount = Number.isFinite(score) ? normalizeScore(score, range) : NaN;
      const color = Number.isFinite(amount)
        ? unmeasured.clone().lerp(measured, 0.18 + amount * 0.7)
        : unmeasured;
      if (Number.isFinite(confidence)) color.multiplyScalar(0.76 + clamp(confidence, 0, 1) * 0.24);
      carriers.setColorAt(index, color);
    }
    if (carriers.instanceColor) carriers.instanceColor.needsUpdate = true;
  }

  writeMatrices();
  setAxis(model.hero.vectorId);
  group.add(carriers, thumbnails);

  const secondaryRail = new THREE.Mesh(
    new THREE.BoxGeometry(Math.max(1, secondaryColumns * 0.7), 0.045, 0.045),
    new THREE.MeshStandardMaterial({
      color: 0x6a6e63,
      emissive: 0x21221d,
      emissiveIntensity: 0.6,
      metalness: 0.68,
      roughness: 0.4,
    }),
  );
  secondaryRail.position.set(0, -3.36, -0.72);
  group.add(secondaryRail);

  return {
    group,
    raycastTargets: [carriers, thumbnails],
    atlasEntryCount: atlasObservations.length,
    setAtlasTexture(texture) {
      atlasMaterial.map = texture;
      atlasMaterial.needsUpdate = true;
      thumbnails.visible = atlasObservations.length > 0;
    },
    setAxis,
    setHovered(observationId) {
      hoveredId = observationId;
    },
    setArchiveReveal(value, delta, still) {
      desiredArchiveReveal = value;
      const ease = still ? 1 : 1 - Math.exp(-delta * 5.2);
      archiveReveal += (desiredArchiveReveal - archiveReveal) * ease;
      group.rotation.x = -archiveReveal * 0.7;
      group.position.y = archiveReveal * 0.22;
      secondaryRail.position.z = -0.72 + archiveReveal * 0.2;
    },
    update(delta, still) {
      const ease = still ? 1 : 1 - Math.exp(-delta * 11);
      for (let index = 0; index < hoverAmounts.length; index += 1) {
        const target = observations[index].id === hoveredId ? 1 : 0;
        hoverAmounts[index] += (target - hoverAmounts[index]) * ease;
      }
      writeMatrices();
    },
    observationIdForInstance(instanceId, object) {
      return object?.userData?.observationIds?.[instanceId] ?? "";
    },
    positionForObservation(observationId) {
      return positionById.get(observationId)?.clone() ?? null;
    },
    isMoving() {
      return moving || Math.abs(archiveReveal - desiredArchiveReveal) > 0.001;
    },
  };
}

function latticeSlotKey(studyId, anchorId, level) {
  if (!studyId || !anchorId || !LEVELS.includes(level)) return "";
  return `${studyId}|${anchorId}|${level}`;
}

function atlasUvRect(entryIndex, atlas, layout) {
  if (!atlas || !layout || !Number.isInteger(entryIndex)) return [0, 0, 1, 1];
  const column = entryIndex % atlas.columns;
  const row = Math.floor(entryIndex / atlas.columns);
  const inset = layout.gutter + 0.5;
  const pixelX = layout.offsetX + column * layout.cellSize + inset;
  const pixelY = layout.offsetY + row * layout.cellSize + inset;
  const sampledSize = Math.max(1, layout.cellSize - layout.gutter * 2 - 1);
  return [
    pixelX / layout.width,
    pixelY / layout.height,
    sampledSize / layout.width,
    sampledSize / layout.height,
  ];
}

function createAtlasMaterial() {
  const pixel = new Uint8Array([18, 19, 18, 255]);
  const placeholder = new THREE.DataTexture(pixel, 1, 1, THREE.RGBAFormat);
  placeholder.needsUpdate = true;
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: placeholder,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <uv_pars_vertex>",
        "#include <uv_pars_vertex>\nattribute vec4 atlasRect;\nvarying vec4 vAtlasRect;\nvarying vec2 vAtlasLocalUv;",
      )
      .replace(
        "#include <uv_vertex>",
        "#include <uv_vertex>\nvAtlasRect = atlasRect;\nvAtlasLocalUv = uv;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <uv_pars_fragment>",
        "#include <uv_pars_fragment>\nvarying vec4 vAtlasRect;\nvarying vec2 vAtlasLocalUv;",
      )
      .replace(
        "#include <map_fragment>",
        [
          "vec2 atlasUv = vec2(",
          "  vAtlasRect.x + vAtlasLocalUv.x * vAtlasRect.z,",
          "  vAtlasRect.y + (1.0 - vAtlasLocalUv.y) * vAtlasRect.w",
          ");",
          "vec4 sampledDiffuseColor = texture2D(map, atlasUv);",
          "diffuseColor *= sampledDiffuseColor;",
        ].join("\n"),
      );
  };
  material.customProgramCacheKey = () => "atlas-evidence-v2";
  return material;
}

function createResponseWake() {
  const group = new THREE.Group();
  const maximum = 12;
  const geometry = new THREE.BoxGeometry(1, 0.055, 0.09);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.45,
    roughness: 0.42,
    vertexColors: true,
  });
  const ribbons = new THREE.InstancedMesh(geometry, material, maximum);
  ribbons.name = "twelve-measured-response-ribbons";
  ribbons.castShadow = true;
  const baseline = new THREE.Mesh(
    new THREE.BoxGeometry(0.045, 4.8, 0.07),
    new THREE.MeshStandardMaterial({ color: 0x555750, metalness: 0.7, roughness: 0.4 }),
  );
  group.add(baseline, ribbons);
  group.rotation.y = 0.24;
  const lengths = new Float32Array(maximum);
  const signs = new Float32Array(maximum);
  let count = 0;
  let reveal = 0;
  let desiredReveal = 0;
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();

  function write() {
    for (let index = 0; index < maximum; index += 1) {
      const itemReveal = smootherStep(index * 0.032, 0.6 + index * 0.032, reveal);
      const signedLength = lengths[index] * signs[index] * itemReveal;
      const y = 2.2 - index * 0.4;
      const visibleLength = index < count ? Math.max(0.0001, Math.abs(signedLength)) : 0.0001;
      matrix.compose(
        new THREE.Vector3(signedLength * 0.5, y, 0),
        quaternion,
        new THREE.Vector3(visibleLength, index < count ? 1 : 0.0001, 1),
      );
      ribbons.setMatrixAt(index, matrix);
    }
    ribbons.instanceMatrix.needsUpdate = true;
  }

  return {
    group,
    compose(response) {
      const deltas = response?.deltas?.slice(0, maximum) ?? [];
      count = deltas.length;
      const limit = Math.max(0.25, ...deltas.map((item) => Math.abs(item.value)));
      for (let index = 0; index < maximum; index += 1) {
        const delta = deltas[index]?.value;
        lengths[index] = Number.isFinite(delta) ? clamp(Math.abs(delta) / limit, 0, 1) * 3.25 : 0;
        signs[index] = Number.isFinite(delta) && delta < 0 ? -1 : 1;
        ribbons.setColorAt(
          index,
          new THREE.Color(signs[index] < 0 ? PALETTE.cool : PALETTE.warm),
        );
      }
      if (ribbons.instanceColor) ribbons.instanceColor.needsUpdate = true;
      write();
    },
    setReveal(value, delta, still) {
      desiredReveal = value;
      const ease = still ? 1 : 1 - Math.exp(-delta * 6.1);
      reveal += (desiredReveal - reveal) * ease;
      write();
    },
    isMoving() { return Math.abs(reveal - desiredReveal) > 0.001; },
  };
}

function createCorrelationCompass() {
  const group = new THREE.Group();
  const rayPivot = new THREE.Group();
  const ringPoints = [];
  for (let index = 0; index <= 96; index += 1) {
    const angle = (index / 96) * Math.PI * 2;
    ringPoints.push(new THREE.Vector3(Math.cos(angle) * 3.05, Math.sin(angle) * 3.05, -0.03));
  }
  const ring = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(ringPoints),
    new THREE.LineBasicMaterial({ color: 0x474944, opacity: 0.58, transparent: true }),
  );
  const axes = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3.3, 0, 0), new THREE.Vector3(3.3, 0, 0),
      new THREE.Vector3(0, -3.3, 0), new THREE.Vector3(0, 3.3, 0),
    ]),
    new THREE.LineBasicMaterial({ color: 0x393b37, opacity: 0.55, transparent: true }),
  );
  group.add(ring, axes, rayPivot);
  group.rotation.y = -0.18;
  let rays = null;
  let reveal = 0;
  let desiredReveal = 0;

  return {
    group,
    compose(axis, correlations) {
      if (rays) {
        rayPivot.remove(rays);
        rays.geometry.dispose();
        rays.material.dispose();
      }
      const relevant = correlations
        .filter((item) => item.a === axis || item.b === axis)
        .sort((left, right) => Math.abs(right.r) - Math.abs(left.r))
        .slice(0, 9);
      const vertices = [];
      const colors = [];
      relevant.forEach((item, index) => {
        const r = clamp(item.r, -1, 1);
        const theta = Math.acos(r);
        const side = index % 2 === 0 ? 1 : -1;
        const z = (index % 3 - 1) * 0.035;
        const endpoint = new THREE.Vector3(
          Math.cos(theta) * 2.9,
          Math.sin(theta) * 2.9 * side,
          z,
        );
        const color = new THREE.Color(r < 0 ? PALETTE.cool : PALETTE.warm);
        vertices.push(0, 0, z, endpoint.x, endpoint.y, endpoint.z);
        colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
      });
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      rays = new THREE.LineSegments(
        geometry,
        new THREE.LineBasicMaterial({ vertexColors: true, opacity: 0.9, transparent: true }),
      );
      rays.userData.angleSemantics = "theta = acos(pearson_r); z offsets prevent collisions only";
      rayPivot.add(rays);
    },
    setReveal(value, delta, still) {
      desiredReveal = value;
      const ease = still ? 1 : 1 - Math.exp(-delta * 5.4);
      reveal += (desiredReveal - reveal) * ease;
      rayPivot.scale.setScalar(0.12 + reveal * 0.88);
      rayPivot.rotation.z = (1 - reveal) * 0.1;
    },
    isMoving() { return Math.abs(reveal - desiredReveal) > 0.001; },
  };
}

function createReconstructionRails(reconstruction) {
  const group = new THREE.Group();
  const plateHolders = [];
  const meshes = [];
  const railMaterial = new THREE.MeshStandardMaterial({
    color: 0x41423e,
    metalness: 0.75,
    roughness: 0.37,
  });
  const rail = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.055, 0.08), railMaterial);
  rail.position.y = -1.35;
  group.add(rail);
  reconstruction.plates.slice(0, 2).forEach((plate, index) => {
    const holder = new THREE.Group();
    const mesh = createExactPlate(plate, 2.02);
    const frame = createPlateFrame(2.12, 2.12, 0.09);
    holder.position.x = index === 0 ? -1.22 : 1.22;
    holder.add(mesh, frame);
    group.add(holder);
    plateHolders.push(holder);
    meshes.push(mesh);

    if (Number.isFinite(plate.source?.score)) {
      const residual = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.42 + Math.abs(plate.source.score) * 0.55, 0.06),
        new THREE.MeshStandardMaterial({ color: PALETTE.warm, metalness: 0.4, roughness: 0.5 }),
      );
      residual.position.set(index === 0 ? -2.48 : 2.48, -0.74, 0.04);
      residual.userData.measuredScore = plate.source.score;
      group.add(residual);
    }
  });

  group.rotation.y = 2.36;

  reconstruction.weights.slice(0, 5).forEach((item, index) => {
    const length = clamp(Math.abs(item.weight), 0.02, 1) * 2.25;
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(length, 0.045, 0.055),
      new THREE.MeshStandardMaterial({
        color: item.weight < 0 ? PALETTE.cool : PALETTE.warm,
        metalness: 0.5,
        roughness: 0.46,
      }),
    );
    bar.position.set((item.weight < 0 ? -1 : 1) * length * 0.5, 1.42 - index * 0.16, -0.04);
    bar.userData.manualWeight = item.weight;
    bar.userData.vectorId = item.vectorId;
    group.add(bar);
  });

  let reveal = 0;
  let desiredReveal = 0;
  return {
    group,
    meshes,
    setReveal(value, delta, still) {
      desiredReveal = value;
      const ease = still ? 1 : 1 - Math.exp(-delta * 5.2);
      reveal += (desiredReveal - reveal) * ease;
      plateHolders.forEach((holder, index) => {
        holder.position.y = -0.48 + (1 - reveal) * (index === 0 ? -0.72 : 0.72);
        holder.rotation.y = (1 - reveal) * (index === 0 ? 0.12 : -0.12);
      });
    },
    isMoving() { return Math.abs(reveal - desiredReveal) > 0.001; },
  };
}

function createSelectionDock() {
  const group = new THREE.Group();
  const plates = new Map();
  let selectedId = "";
  group.visible = false;
  group.scale.setScalar(0.74);
  group.add(createPlateFrame(2.15, 2.15, 0.08));
  return {
    group,
    setObservation(plate) {
      selectedId = plate.observationId;
      if (!plates.has(selectedId)) {
        const mesh = createExactPlate(plate, 2.04);
        mesh.visible = false;
        plates.set(selectedId, mesh);
        group.add(mesh);
      }
      return plates.get(selectedId);
    },
    show(observationId) {
      selectedId = observationId;
      group.visible = true;
      for (const [id, mesh] of plates) mesh.visible = id === observationId && mesh.userData.ready;
    },
  };
}

function sampleCameraPath(path, mobile) {
  const index = clamp(Math.floor(path), 0, SCENES.length - 1);
  const nextIndex = Math.min(SCENES.length - 1, index + 1);
  const amount = smootherStep(0, 1, path - index);
  const from = cameraStop(SCENES[index], mobile);
  const to = cameraStop(SCENES[nextIndex], mobile);
  const target = from.target.clone().lerp(to.target, amount);
  const fromRelative = from.position.clone().sub(from.target);
  const toRelative = to.position.clone().sub(to.target);
  const fromSpherical = new THREE.Spherical().setFromVector3(fromRelative);
  const toSpherical = new THREE.Spherical().setFromVector3(toRelative);
  const thetaDelta = shortestAngle(toSpherical.theta - fromSpherical.theta);
  const spherical = new THREE.Spherical(
    THREE.MathUtils.lerp(fromSpherical.radius, toSpherical.radius, amount) + Math.sin(amount * Math.PI) * 0.38,
    THREE.MathUtils.lerp(fromSpherical.phi, toSpherical.phi, amount),
    fromSpherical.theta + thetaDelta * amount,
  );
  spherical.makeSafe();
  const position = new THREE.Vector3().setFromSpherical(spherical).add(target);
  return {
    position,
    target,
    fov: THREE.MathUtils.lerp(from.fov, to.fov, amount),
  };
}

function cameraStop(sceneName, mobile) {
  const stop = CAMERA_STOPS[sceneName] ?? CAMERA_STOPS.origin;
  if (!mobile) {
    return {
      position: new THREE.Vector3(...stop.position),
      target: new THREE.Vector3(...stop.target),
      fov: stop.fov,
    };
  }
  const mobileStops = {
    origin: [[0.9, 0.25, 13.4], [0.7, 0, 3.2], 36],
    response: [[-7.1, 2, 9.4], [-3.55, 0.25, 0.65], 38],
    discriminate: [[7.2, 1, 8.8], [3.2, 0.1, 0.9], 37],
    association: [[-6.8, 4, -8.8], [-2.35, 0.25, -2.85], 40],
    reconstruct: [[6.5, 2, -10], [2.1, -1, -3.35], 38],
    archive: [[0, 13.5, 17.2], [0, -0.1, 0], 43],
  };
  const [position, target, fov] = mobileStops[sceneName] ?? mobileStops.origin;
  return { position: new THREE.Vector3(...position), target: new THREE.Vector3(...target), fov };
}

function shortestAngle(angle) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

function vectorArray(vector) {
  return [
    Number(vector.x.toFixed(4)),
    Number(vector.y.toFixed(4)),
    Number(vector.z.toFixed(4)),
  ];
}

function bindEntryGate(chamberRoot, reducedMotion) {
  const entry = chamberRoot.querySelector("[data-chamber-entry]");
  if (!entry) return;
  const soundButton = entry.querySelector("[data-enter-sound], [data-chamber-enter='sound']");
  const silentButton = entry.querySelector("[data-enter-silent], [data-chamber-enter='silent']");
  const actions = [soundButton, silentButton].filter(Boolean);
  let dismissed = entry.dataset.entryState === "dismissed";

  const trapFocus = (event) => {
    if (dismissed) return;
    if (event.key === "Escape") {
      event.preventDefault();
      dismiss("off", "escape-key");
      return;
    }
    if (event.key !== "Tab" || actions.length < 2) return;
    const currentIndex = actions.indexOf(document.activeElement);
    const nextIndex = event.shiftKey
      ? (currentIndex <= 0 ? actions.length - 1 : currentIndex - 1)
      : (currentIndex + 1) % actions.length;
    event.preventDefault();
    actions[nextIndex].focus();
  };
  entry.addEventListener("keydown", trapFocus);

  if (!dismissed && entry.dataset.entryState !== "dismissing") {
    entry.dataset.entryState = "open";
    window.queueMicrotask(() => {
      if (document.activeElement === document.body || !document.activeElement) soundButton?.focus();
    });
  }

  const dismiss = (audioRequest, source) => {
    if (dismissed) return;
    dismissed = true;
    chamberRoot.dataset.audioRequest = audioRequest;
    entry.dataset.entryState = "dismissing";
    emit("atlas:commit", {
      kind: "entry",
      audio: audioRequest,
      phase: "commit",
      source,
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
        audio: audioRequest,
      });
    }, reducedMotion.matches ? 0 : 560);
  };

  soundButton?.addEventListener("click", () => dismiss("on", "sound-button"));
  silentButton?.addEventListener("click", () => dismiss("off", "silent-button"));
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
  const derivative = HOME_MEDIA_DERIVATIVES[observationId];
  if (!derivative) {
    return { imageUrl: canonicalImageUrl, fallbackImageUrl: "" };
  }
  const imageUrl = normalizeAssetUrl(derivative);
  return {
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
    pixelRatio: Math.min(window.devicePixelRatio || 1, constrained ? 1.25 : 1.75),
    powerPreference: constrained ? "low-power" : "high-performance",
  };
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
    window.requestIdleCallback(callback, { timeout: 900 });
  } else {
    window.setTimeout(callback, 80);
  }
}

function smootherStep(edge0, edge1, value) {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const amount = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return amount * amount * amount * (amount * (amount * 6 - 15) + 10);
}

function mapRange(value, sourceMin, sourceMax, targetMin, targetMax) {
  const amount = (value - sourceMin) / Math.max(0.00001, sourceMax - sourceMin);
  return targetMin + amount * (targetMax - targetMin);
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
