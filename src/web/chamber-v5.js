import * as THREE from "three";

/**
 * Visual Basis Atlas V5 — cinematic evidence director.
 *
 * Six authored scene plates form an illustrative coastal depth field around the
 * Atlas's semantic evidence. Registered, ungraded evidence derivatives remain ordinary DOM
 * images and links; WebGL never turns them into scenery or implied latent
 * coordinates. Nothing here is presented as Grok latent space.
 */

const BEATS = Object.freeze([
  "control",
  "response",
  "comparison",
  "association",
  "reconstruction",
  "archive",
]);
const COMPACT_QUERY = "(max-width: 767px), (pointer: coarse)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const SAVE_DATA_QUERY = "(prefers-reduced-data: reduce)";
const ENTRY_DURATION = 4200;
const ENTRY_DISMISS_DURATION = 620;
const AUDIO_START_TIMEOUT = 12000;
const AUDIO_MODULE_TIMEOUT = 8000;
const DOCUMENTARY_IMAGE_TIMEOUT_MS = 8000;
const MAX_DESKTOP_PIXELS = 3_200_000;
const MAX_MOBILE_PIXELS = 1_200_000;
const PLATE_POINTER_ATTACK = 0.032;
const PLATE_POINTER_SETTLE = 0.24;
const PLATE_FIRST_RESPONSE_MS = 48;
const PLATE_MAX_RELIGHT_EV = 0.6;
const PLATE_TRANSITION_MS = 900;
const TOUCH_THRESHOLD = 12;
const RESPONSE_COMPONENT_IDS = Object.freeze([
  "vec_halation",
  "vec_highlight_bloom",
  "vec_diffusion",
  "vec_final_bloom",
  "vec_highlight_rolloff",
  "vec_key_to_fill_ratio",
]);
const RETIRED_WORLD_KEYS = Object.freeze([
  "control",
  "fieldStation",
  "requiredNodes",
  "models",
  "evidenceBindings",
  "archiveBindings",
]);
const MANIFEST_KEYS = Object.freeze(["format", "version", "generator", "scenePlates"]);
const SCENE_PLATE_KEYS = Object.freeze([
  "budgets",
  "colorEncoding",
  "depthEncoding",
  "depthEstimator",
  "focalPointConvention",
  "interaction",
  "loading",
  "order",
  "provenance",
  "renderer",
  "socialSource",
  "variants",
]);
const DEPTH_ENCODING = Object.freeze({
  kind: "relative-inverse-depth",
  bitDepth: 8,
  channels: 1,
  near: 255,
  far: 0,
  normalization: "per-plate-min-max",
  resampling: "bicubic-align-corners-false",
  lossless: true,
});

function cubicBezierProgress(progress, x1, y1, x2, y2) {
  const target = clamp(progress);
  if (target === 0 || target === 1) return target;
  const sample = (time, first, second) => {
    const inverse = 1 - time;
    return 3 * inverse * inverse * time * first
      + 3 * inverse * time * time * second
      + time * time * time;
  };
  const derivative = (time, first, second) => (
    3 * (1 - time) * (1 - time) * first
    + 6 * (1 - time) * time * (second - first)
    + 3 * time * time * (1 - second)
  );
  let parameter = target;
  for (let iteration = 0; iteration < 8; iteration += 1) {
    const slope = derivative(parameter, x1, x2);
    if (Math.abs(slope) < 1e-7) break;
    parameter = clamp(parameter - (sample(parameter, x1, x2) - target) / slope);
  }
  let lower = 0;
  let upper = 1;
  for (let iteration = 0; iteration < 12; iteration += 1) {
    const estimate = sample(parameter, x1, x2);
    if (Math.abs(estimate - target) < 1e-7) break;
    if (estimate < target) lower = parameter;
    else upper = parameter;
    parameter = (lower + upper) * 0.5;
  }
  return clamp(sample(parameter, y1, y2));
}

function premiumTransitionEase(progress) {
  return cubicBezierProgress(progress, 0.16, 1, 0.3, 1);
}

function clamp(value, minimum = 0, maximum = 1) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(maximum, Math.max(minimum, number)) : minimum;
}

function smoothstep(minimum, maximum, value) {
  const t = clamp((value - minimum) / Math.max(maximum - minimum, 0.000001));
  return t * t * (3 - 2 * t);
}

function smootherstep(minimum, maximum, value) {
  const t = clamp((value - minimum) / Math.max(maximum - minimum, 0.000001));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function damp(current, target, timeConstant, delta) {
  if (!Number.isFinite(current) || !Number.isFinite(target)) return target;
  if (timeConstant <= 0 || delta <= 0) return target;
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-delta / timeConstant));
}

function dampVector(current, target, timeConstant, delta) {
  current.x = damp(current.x, target.x, timeConstant, delta);
  current.y = damp(current.y, target.y, timeConstant, delta);
  current.z = damp(current.z, target.z, timeConstant, delta);
  return current;
}

function coverUvTransform(
  imageWidth,
  imageHeight,
  viewportWidth,
  viewportHeight,
  focalPoint = [0.5, 0.5],
  overscanPx = 0,
) {
  const iw = Math.max(1, Number(imageWidth) || 1);
  const ih = Math.max(1, Number(imageHeight) || 1);
  const vw = Math.max(1, Number(viewportWidth) || 1);
  const vh = Math.max(1, Number(viewportHeight) || 1);
  const imageAspect = iw / ih;
  const viewportAspect = vw / vh;
  let scaleX = 1;
  let scaleY = 1;
  if (imageAspect > viewportAspect) scaleX = viewportAspect / imageAspect;
  else if (imageAspect < viewportAspect) scaleY = imageAspect / viewportAspect;

  // Reserve enough intrinsic-image UV on all four sides for the maximum
  // parallax excursion. Focal alignment is then clamped inside that safe
  // aperture, so a pointer at an extreme can never reveal a plate edge.
  const marginX = Math.min(scaleX * 0.24, scaleX * Math.max(0, overscanPx) / vw);
  const marginY = Math.min(scaleY * 0.24, scaleY * Math.max(0, overscanPx) / vh);
  scaleX = Math.max(0.001, scaleX - 2 * marginX);
  scaleY = Math.max(0.001, scaleY - 2 * marginY);
  const focalX = clamp(focalPoint?.[0] ?? 0.5);
  // Manifest focal points use the image-authoring convention (top-left);
  // WebGL UVs use a bottom-left origin.
  const focalY = 1 - clamp(focalPoint?.[1] ?? 0.5);
  const offsetX = clamp(focalX - scaleX * 0.5, marginX, 1 - marginX - scaleX);
  const offsetY = clamp(focalY - scaleY * 0.5, marginY, 1 - marginY - scaleY);
  return {
    scale: [scaleX, scaleY],
    offset: [offsetX, offsetY],
    safeBounds: [marginX, marginY, 1 - marginX, 1 - marginY],
  };
}

function clampParallaxPixels(x, y, maximum) {
  const limit = Math.max(0, Number(maximum) || 0);
  const px = Number.isFinite(Number(x)) ? Number(x) : 0;
  const py = Number.isFinite(Number(y)) ? Number(y) : 0;
  const length = Math.hypot(px, py);
  if (length <= limit || length === 0) return [px, py];
  return [px * limit / length, py * limit / length];
}

function boundedRelightEv(local, rake, presence, maximum = PLATE_MAX_RELIGHT_EV) {
  const limit = Math.max(0, Number(maximum) || 0);
  return clamp(
    limit * clamp(local) * (0.18 + 0.82 * clamp(rake)) * clamp(presence),
    0,
    limit,
  );
}

function evictPlateCache({
  cache,
  currentPair,
  nextPair,
  requestedBeat,
  inflightBeats,
  preferredBeat,
  maxPairs = 3,
  disposePair,
}) {
  const evicted = [];
  const protectedPairs = new Set([currentPair, nextPair].filter(Boolean));
  const protectedBeats = new Set([requestedBeat, ...(inflightBeats || [])].filter(Boolean));
  const preferredIndex = Math.max(0, BEATS.indexOf(preferredBeat));
  while (cache.size > maxPairs) {
    const candidates = [...cache.entries()].flatMap(([beat, pair], age) => (
      protectedPairs.has(pair) || protectedBeats.has(beat)
        ? []
        : [{
          beat,
          pair,
          age,
          distance: Math.abs(BEATS.indexOf(beat) - preferredIndex),
        }]
    )).sort((first, second) => second.distance - first.distance || first.age - second.age);
    const candidate = candidates[0];
    if (!candidate) break;
    cache.delete(candidate.beat);
    disposePair(candidate.pair);
    evicted.push(candidate.beat);
  }
  return evicted;
}

function transitionEndpoint(progress) {
  const value = clamp(progress);
  if (value === 0) return "current";
  if (value === 1) return "next";
  return "wipe";
}

const PLATE_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const PLATE_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  uniform sampler2D uColorCurrent;
  uniform sampler2D uDepthCurrent;
  uniform sampler2D uColorNext;
  uniform sampler2D uDepthNext;
  uniform vec2 uCurrentScale;
  uniform vec2 uCurrentOffset;
  uniform vec2 uNextScale;
  uniform vec2 uNextOffset;
  uniform vec2 uCurrentTexel;
  uniform vec2 uNextTexel;
  uniform vec2 uViewportPx;
  uniform vec2 uPointer;
  uniform float uPointerPresence;
  uniform float uMaxParallaxPx;
  uniform float uMaxRelightEv;
  uniform float uRelightRadiusPx;
  uniform float uTransition;
  uniform float uDirection;
  varying vec2 vUv;

  vec2 boundedParallax(vec2 value, float maximum) {
    float magnitude = length(value);
    return magnitude > maximum && magnitude > 0.0
      ? value * maximum / magnitude
      : value;
  }

  vec2 plateUv(sampler2D depthMap, vec2 scale, vec2 offset, vec2 texel) {
    vec2 baseUv = vUv * scale + offset;
    float inverseDepth = texture2D(depthMap, baseUv).r;
    vec2 pointerVector = boundedParallax((uPointer - 0.5) * 2.0, 1.0);
    vec2 requestedPx = pointerVector
      * inverseDepth
      * uMaxParallaxPx
      * uPointerPresence;
    vec2 safePx = boundedParallax(requestedPx, uMaxParallaxPx);
    return clamp(
      baseUv + (safePx / max(uViewportPx, vec2(1.0))) * scale,
      texel * 0.5,
      vec2(1.0) - texel * 0.5
    );
  }

  vec3 sobelNormal(sampler2D depthMap, vec2 uv, vec2 texel) {
    float tl = texture2D(depthMap, uv + texel * vec2(-1.0,  1.0)).r;
    float tc = texture2D(depthMap, uv + texel * vec2( 0.0,  1.0)).r;
    float tr = texture2D(depthMap, uv + texel * vec2( 1.0,  1.0)).r;
    float ml = texture2D(depthMap, uv + texel * vec2(-1.0,  0.0)).r;
    float mr = texture2D(depthMap, uv + texel * vec2( 1.0,  0.0)).r;
    float bl = texture2D(depthMap, uv + texel * vec2(-1.0, -1.0)).r;
    float bc = texture2D(depthMap, uv + texel * vec2( 0.0, -1.0)).r;
    float br = texture2D(depthMap, uv + texel * vec2( 1.0, -1.0)).r;
    float gradientX = (tr + 2.0 * mr + br) - (tl + 2.0 * ml + bl);
    float gradientY = (bl + 2.0 * bc + br) - (tl + 2.0 * tc + tr);
    return normalize(vec3(-gradientX * 2.4, -gradientY * 2.4, 1.0));
  }

  vec4 relitPlate(
    sampler2D colorMap,
    sampler2D depthMap,
    vec2 scale,
    vec2 offset,
    vec2 texel,
    out float depthValue
  ) {
    vec2 uv = plateUv(depthMap, scale, offset, texel);
    depthValue = texture2D(depthMap, uv).r;
    vec4 color = texture2D(colorMap, uv);
    if (uPointerPresence <= 0.001) return color;
    vec2 deltaPx = (uPointer - vUv) * uViewportPx;
    float local = 1.0 - smoothstep(0.0, uRelightRadiusPx, length(deltaPx));
    vec2 planar = deltaPx / max(min(uViewportPx.x, uViewportPx.y), 1.0);
    vec3 lightDirection = normalize(vec3(planar * 3.4, 0.72));
    float rake = max(dot(sobelNormal(depthMap, uv, texel), lightDirection), 0.0);
    float liftEv = min(
      uMaxRelightEv,
      uMaxRelightEv * local * (0.18 + 0.82 * rake) * uPointerPresence
    );
    color.rgb *= exp2(max(0.0, liftEv));
    return color;
  }

  float opticalWipeMask(float currentDepth, float nextDepth) {
    if (uTransition <= 0.0) return 0.0;
    if (uTransition >= 1.0) return 1.0;
    float axis = uDirection >= 0.0 ? vUv.x : 1.0 - vUv.x;
    float depthRidge = (mix(currentDepth, nextDepth, 0.5) - 0.5) * 0.20;
    float front = mix(-0.22, 1.22, uTransition);
    float feather = 0.045 + fwidth(axis) * 2.0;
    return 1.0 - smoothstep(front - feather, front + feather, axis + depthRidge);
  }

  void main() {
    float currentDepth = 0.0;
    float nextDepth = 0.0;
    vec4 currentColor = relitPlate(
      uColorCurrent, uDepthCurrent, uCurrentScale, uCurrentOffset,
      uCurrentTexel, currentDepth
    );
    if (uTransition <= 0.0) {
      gl_FragColor = currentColor;
    } else {
      vec4 nextColor = relitPlate(
        uColorNext, uDepthNext, uNextScale, uNextOffset,
        uNextTexel, nextDepth
      );
      gl_FragColor = uTransition >= 1.0
        ? nextColor
        : mix(currentColor, nextColor, opticalWipeMask(currentDepth, nextDepth));
    }
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function resolveURL(value) {
  return new URL(String(value || ""), document.baseURI).href;
}

function dispatch(name, detail) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

function retainLoadedAudio(owner, candidate, revision) {
  if (!candidate) return false;
  if (owner.lifecycleInactive(revision)) {
    candidate.destroy?.();
    return false;
  }
  owner.audio = candidate;
  return true;
}

function parseInlinePayload(root) {
  const node = root.querySelector("#chamber-data");
  if (!node?.textContent) throw new Error("The chamber payload is missing.");
  const payload = JSON.parse(node.textContent);
  if (!payload?.hero?.levels?.length || !payload?.field?.observations?.length) {
    throw new Error("The chamber payload is incomplete.");
  }
  return payload;
}

function observationMap(payload) {
  return new Map((payload?.field?.observations || []).map((item) => [item.id, item]));
}

function validateDocumentaryEvidenceContract(payload, manifest) {
  const fail = (message) => {
    throw new Error(`Documentary evidence contract ${message}`);
  };
  const isRecord = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
  const nonempty = (value) => typeof value === "string" && value.trim().length > 0;
  const assertUnique = (values, label) => {
    if (values.some((value) => !nonempty(value))) fail(`${label} contains an empty value`);
    if (new Set(values).size !== values.length) fail(`${label} contains duplicates`);
  };

  const observations = payload?.field?.observations;
  if (!Array.isArray(observations) || observations.length === 0) {
    fail("requires field observations");
  }
  const observationIds = observations.map((item) => item?.id);
  assertUnique(observationIds, "field observation IDs");
  const knownObservations = new Set(observationIds);
  const requireObservation = (observationId, label) => {
    if (!nonempty(observationId) || !knownObservations.has(observationId)) {
      fail(`${label} references unknown observation ${String(observationId)}`);
    }
  };

  const heroLevels = payload?.hero?.levels;
  if (!Array.isArray(heroLevels) || heroLevels.length === 0) fail("requires hero levels");
  if (payload?.hero?.vector_id !== "vec_halation") {
    fail("requires the registered halation Control vector");
  }
  const heroLevelNames = heroLevels.map((item) => item?.requested_level);
  const heroObservationIds = heroLevels.map((item) => item?.observation_id);
  assertUnique(heroLevelNames, "hero requested levels");
  assertUnique(heroObservationIds, "hero observation IDs");
  const registeredHero = new Map([
    ["low", "obs_0160"],
    ["medium", "obs_0161"],
    ["high", "obs_0162"],
  ]);
  if (
    heroLevels.length !== registeredHero.size
    || heroLevels.some((item) => registeredHero.get(item.requested_level) !== item.observation_id)
  ) {
    fail("hero levels do not match the registered halation proof triplet");
  }
  const hero = heroLevels.map((item) => {
    requireObservation(item.observation_id, `hero level ${item.requested_level}`);
    return {
      requestedLevel: item.requested_level,
      observation: item.observation_id,
    };
  });

  if (manifest?.format !== "atlas-world/v2" || manifest?.version !== 2) {
    fail("requires the version 2 scene-plate manifest");
  }
  if (
    !isRecord(manifest)
    || Object.keys(manifest).length !== MANIFEST_KEYS.length
    || MANIFEST_KEYS.some((key) => !Object.hasOwn(manifest, key))
    || !isRecord(manifest.generator)
  ) fail("top-level manifest keys do not match the scene-plate contract");
  const retiredKey = RETIRED_WORLD_KEYS.find((key) => Object.hasOwn(manifest, key));
  if (retiredKey) fail(`rejects retired world key ${retiredKey}`);
  const scenePlates = manifest?.scenePlates;
  if (!isRecord(scenePlates) || scenePlates.renderer !== "depth-parallax-v1") {
    fail("requires the depth-parallax-v1 scene-plate renderer");
  }
  if (
    Object.keys(scenePlates).length !== SCENE_PLATE_KEYS.length
    || SCENE_PLATE_KEYS.some((key) => !Object.hasOwn(scenePlates, key))
  ) fail("scene-plate manifest fields are stale or unknown");
  if (
    !Array.isArray(scenePlates.order)
    || scenePlates.order.length !== BEATS.length
    || scenePlates.order.some((beat, index) => beat !== BEATS[index])
  ) fail("scene-plate chapter order is stale");
  const depthEncoding = scenePlates.depthEncoding;
  if (
    !isRecord(depthEncoding)
    || Object.keys(depthEncoding).length !== Object.keys(DEPTH_ENCODING).length
    || Object.entries(DEPTH_ENCODING).some(([key, value]) => depthEncoding[key] !== value)
  ) fail("scene-plate inverse-depth encoding is unsupported");
  const interaction = scenePlates.interaction;
  if (
    !isRecord(interaction)
    || Object.keys(interaction).length !== 5
    || interaction.firstResponseMs !== PLATE_FIRST_RESPONSE_MS
    || interaction.settleMs !== PLATE_POINTER_SETTLE * 1000
    || !isRecord(interaction.maxParallaxPx)
    || Object.keys(interaction.maxParallaxPx).length !== 2
    || interaction.maxParallaxPx.desktop !== 18
    || interaction.maxParallaxPx.mobile !== 10
    || interaction.maxRelightEv !== PLATE_MAX_RELIGHT_EV
    || interaction.transitionMs !== PLATE_TRANSITION_MS
  ) fail("scene-plate interaction timing or bounds drifted");

  const assetPaths = [];
  const validateAsset = (record, label) => {
    const keys = ["path", "sha256", "bytes", "width", "height", "mime"];
    if (
      !isRecord(record)
      || Object.keys(record).length !== keys.length
      || keys.some((key) => !Object.hasOwn(record, key))
      || !nonempty(record.path)
      || !/^assets\/world-v5\/[a-z0-9][a-z0-9._/-]*$/i.test(record.path)
      || record.path.includes("..")
      || /obs_[0-9]+|assets\/studies\/|evidence-atlas/i.test(record.path)
      || !/^[a-f0-9]{64}$/.test(record.sha256 || "")
      || !Number.isInteger(record.bytes)
      || record.bytes <= 0
      || !Number.isInteger(record.width)
      || record.width <= 0
      || !Number.isInteger(record.height)
      || record.height <= 0
      || record.mime !== "image/webp"
    ) fail(`${label} asset record is invalid`);
    assetPaths.push(record.path);
    return { ...record };
  };
  const variants = {};
  if (
    !isRecord(scenePlates.variants)
    || Object.keys(scenePlates.variants).length !== 2
    || !Object.hasOwn(scenePlates.variants, "desktop")
    || !Object.hasOwn(scenePlates.variants, "mobile")
  ) fail("scene-plate variants must be exactly desktop and mobile");
  for (const variantName of ["desktop", "mobile"]) {
    const variant = scenePlates.variants?.[variantName];
    if (!isRecord(variant) || Object.keys(variant).length !== BEATS.length) {
      fail(`${variantName} scene-plate variant is incomplete`);
    }
    variants[variantName] = {};
    for (const beat of BEATS) {
      const pair = variant[beat];
      if (!isRecord(pair)) fail(`${variantName} ${beat} scene-plate pair is missing`);
      const pairKeys = Object.keys(pair);
      if (
        pairKeys.some((key) => !["color", "depth", "focalPoint"].includes(key))
        || pairKeys.length !== 3
        || !Object.hasOwn(pair, "color")
        || !Object.hasOwn(pair, "depth")
        || !Object.hasOwn(pair, "focalPoint")
      ) fail(`${variantName} ${beat} scene-plate pair has stale fields`);
      const color = validateAsset(pair.color, `${variantName} ${beat} color`);
      const depth = validateAsset(pair.depth, `${variantName} ${beat} depth`);
      if (color.width !== depth.width || color.height !== depth.height) {
        fail(`${variantName} ${beat} color and depth are not pixel-aligned`);
      }
      const focalPoint = pair.focalPoint;
      if (
        !Array.isArray(focalPoint)
        || focalPoint.length !== 2
        || focalPoint.some((value) => !Number.isFinite(value) || value < 0 || value > 1)
      ) fail(`${variantName} ${beat} focal point is invalid`);
      variants[variantName][beat] = {
        color,
        depth,
        focalPoint: [...focalPoint],
      };
    }
  }
  if (new Set(assetPaths).size !== assetPaths.length) {
    fail("scene-plate asset paths must be unique");
  }

  const responseStudy = (payload?.analysis?.responses?.studies || [])
    .find((item) => item?.vector_id === "vec_halation");
  const responseTuples = responseStudy?.components;
  if (!Array.isArray(responseTuples) || responseTuples.length < RESPONSE_COMPONENT_IDS.length) {
    fail("requires six explicit halation response components");
  }
  const response = responseTuples.slice(0, RESPONSE_COMPONENT_IDS.length).map((item, index) => {
    if (
      !Array.isArray(item)
      || item.length !== 3
      || item[0] !== RESPONSE_COMPONENT_IDS[index]
      || !Number.isFinite(Number(item[1]))
      || !Number.isInteger(Number(item[2]))
      || Number(item[2]) <= 0
    ) fail(`response component ${index + 1} is invalid`);
    return {
      vectorId: item[0],
      delta: Number(item[1]),
      pairs: Number(item[2]),
      slot: index,
    };
  });

  const comparisonSlots = [
    { vectorId: "vec_halation", observation: "obs_0162" },
    { vectorId: "vec_highlight_bloom", observation: "obs_0177" },
  ];
  const comparisonItems = payload?.comparison?.items;
  if (!Array.isArray(comparisonItems) || comparisonItems.length !== comparisonSlots.length) {
    fail("requires exactly the halation and highlight-bloom comparison items");
  }
  assertUnique(comparisonItems.map((item) => item?.vector_id), "comparison vector IDs");
  assertUnique(comparisonItems.map((item) => item?.observation_id), "comparison observation IDs");
  const comparisonByVector = new Map(comparisonItems.map((item) => [item.vector_id, item]));
  const comparison = comparisonSlots.map((slot) => {
    const item = comparisonByVector.get(slot.vectorId);
    if (!item) fail(`is missing comparison vector ${slot.vectorId}`);
    requireObservation(item.observation_id, `comparison vector ${slot.vectorId}`);
    if (item.observation_id !== slot.observation) {
      fail(`comparison vector ${slot.vectorId} is not the registered proof`);
    }
    return { vectorId: slot.vectorId, observation: item.observation_id };
  });

  const reconstructionSlots = [
    { anchorId: "anchor_object" },
    { anchorId: "anchor_landscape" },
  ];
  const reconstructionPlates = payload?.reconstruction?.selected_plates;
  if (!Array.isArray(reconstructionPlates) || reconstructionPlates.length !== reconstructionSlots.length) {
    fail("requires exactly the object and landscape reconstruction plates");
  }
  assertUnique(reconstructionPlates.map((item) => item?.anchor_id), "reconstruction anchor IDs");
  assertUnique(reconstructionPlates.map((item) => item?.observation_id), "reconstruction observation IDs");
  const reconstructionByAnchor = new Map(reconstructionPlates.map((item) => [item.anchor_id, item]));
  const reconstruction = reconstructionSlots.map((slot) => {
    const item = reconstructionByAnchor.get(slot.anchorId);
    if (!item) fail(`is missing reconstruction anchor ${slot.anchorId}`);
    requireObservation(item.observation_id, `reconstruction anchor ${slot.anchorId}`);
    return { anchorId: slot.anchorId, observation: item.observation_id };
  });

  const weights = payload?.reconstruction?.weights;
  if (
    !Array.isArray(weights)
    || weights.length !== 3
    || weights.some((item) => !nonempty(item?.vector_id) || !Number.isFinite(Number(item?.weight)))
  ) fail("requires three explicit reconstruction weights");

  const atlas = payload?.field?.atlas;
  if (!isRecord(atlas)) fail("requires registered archive atlas metadata");
  if (!isRecord(atlas.entries)) fail("requires an atlas entries object");
  const archiveEntries = Object.entries(atlas.entries);
  if (!archiveEntries.length) fail("requires archive atlas entries");
  const archiveObservationIds = archiveEntries.map(([observationId]) => observationId);
  assertUnique(archiveObservationIds, "archive observation IDs");
  archiveObservationIds.forEach((observationId) => {
    requireObservation(observationId, "archive atlas");
  });
  const archiveSlots = archiveEntries.map(([, slot]) => slot);
  if (
    archiveSlots.some((slot) => !Number.isInteger(slot) || slot < 0)
    || new Set(archiveSlots).size !== archiveSlots.length
    || [...archiveSlots].sort((first, second) => first - second)
      .some((slot, index) => slot !== index)
  ) {
    fail("archive atlas slots must be unique contiguous integers from zero");
  }
  const atlasColumns = atlas.columns;
  const atlasRows = atlas.rows;
  if (
    archiveEntries.length !== 126
    || atlasColumns !== 12
    || atlasRows !== 11
    || atlasColumns * atlasRows < archiveEntries.length
  ) {
    fail("archive must expose the 126-entry 12 by 11 semantic contact sheet");
  }
  const validateAtlasGeometry = (label, geometry) => {
    if (!isRecord(geometry)) fail(`${label} atlas geometry is missing`);
    const positive = ["width", "height", "cell_size"];
    const nonnegative = ["gutter", "offset_x", "offset_y"];
    if (
      positive.some((key) => !Number.isInteger(geometry[key]) || geometry[key] <= 0)
      || nonnegative.some((key) => !Number.isInteger(geometry[key]) || geometry[key] < 0)
      || geometry.cell_size - 2 * geometry.gutter <= 0
      || geometry.offset_x + atlasColumns * geometry.cell_size > geometry.width
      || geometry.offset_y + atlasRows * geometry.cell_size > geometry.height
    ) {
      fail(`${label} atlas geometry is invalid or out of bounds`);
    }
  };
  validateAtlasGeometry("desktop", atlas.desktop);
  validateAtlasGeometry("mobile", atlas.mobile);
  if (!nonempty(atlas.desktop_path) || !nonempty(atlas.mobile_path)) {
    fail("archive atlas paths are missing");
  }
  const archive = {
    count: archiveEntries.length,
    entries: [...archiveEntries].sort(([, first], [, second]) => first - second),
    desktopPath: atlas.desktop_path,
    mobilePath: atlas.mobile_path,
  };

  return {
    hero,
    response,
    comparison,
    reconstruction,
    weights: weights.map((item, index) => ({
      vectorId: item.vector_id,
      weight: Number(item.weight),
      slot: index,
    })),
    archive,
    scenePlates: {
      renderer: scenePlates.renderer,
      order: [...scenePlates.order],
      depthEncoding: { ...depthEncoding },
      interaction: {
        ...interaction,
        maxParallaxPx: { ...interaction.maxParallaxPx },
      },
      variants,
    },
  };
}

function vectorName(payload, vectorId) {
  return payload?.vectors?.[vectorId]?.name || String(vectorId || "").replace(/^vec_/, "").replaceAll("_", " ");
}

function commitHeroEvidenceDOM(root, heroIds, state) {
  const observation = heroIds.get(state);
  if (!observation) throw new Error(`Unknown Control evidence state ${state}`);
  root.dataset.chamberState = state;
  root.dataset.selectedObservation = observation;
  root.removeAttribute("data-control-pending-state");
  root.querySelectorAll("[data-chamber-state]").forEach((button) => {
    const selected = button.dataset.chamberState === state;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  root.querySelectorAll(
    "[data-control-proof-state][data-observation-id]",
  ).forEach((link) => {
    const selected = (link.dataset.controlProofState || link.dataset.chamberState) === state
      || link.dataset.observationId === observation;
    // CSS limits the enhanced Control proof to aria-current. Do not add the
    // hidden attribute here: a later WebGL/Save-Data fallback must reveal all
    // three canonical links without reconstructing semantic content.
    link.removeAttribute("hidden");
    link.removeAttribute("aria-hidden");
    if (selected) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
  const proof = root.querySelector("[data-control-proof]");
  if (proof) proof.setAttribute("aria-busy", "false");
  return observation;
}

function hasWebGL2() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: false }));
  } catch {
    return false;
  }
}

function textureImageSources(texture) {
  return new Set([
    texture?.userData?.v5ImageBitmap,
    texture?.source?.data,
    texture?.image,
  ].filter(Boolean));
}

function disposeTexture(
  texture,
  disposedTextures = new Set(),
  disposedImages = new Set(),
) {
  if (!texture || disposedTextures.has(texture) || texture.userData?.v5Disposed) return;
  disposedTextures.add(texture);
  for (const image of textureImageSources(texture)) {
    if (disposedImages.has(image)) continue;
    disposedImages.add(image);
    image.close?.();
  }
  texture.dispose?.();
  texture.userData ||= {};
  texture.userData.v5Disposed = true;
}

function disposeOwnedTextures(textures) {
  const disposedTextures = new Set();
  const disposedImages = new Set();
  for (const texture of textures || []) {
    disposeTexture(texture, disposedTextures, disposedImages);
  }
  textures?.clear?.();
}

function abortError(message = "Scene-plate load aborted") {
  try {
    return new DOMException(message, "AbortError");
  } catch {
    const error = new Error(message);
    error.name = "AbortError";
    return error;
  }
}

function isAbortError(error) {
  return error?.name === "AbortError";
}

function throwIfAborted(signal) {
  if (signal?.aborted) throw signal.reason || abortError();
}

function awaitDocumentaryImage(
  image,
  signal,
  timeoutMs = DOCUMENTARY_IMAGE_TIMEOUT_MS,
) {
  throwIfAborted(signal);
  const decoded = () => Number(image?.naturalWidth) > 0 && Number(image?.naturalHeight) > 0;
  if (image?.complete) {
    return decoded()
      ? Promise.resolve(image)
      : Promise.reject(new Error("Documentary image completed without decoded pixels"));
  }
  return new Promise((resolve, reject) => {
    let settled = false;
    const timerHost = typeof window === "undefined" ? globalThis : window;
    let timeoutId = 0;
    const cleanup = () => {
      timerHost.clearTimeout(timeoutId);
      image?.removeEventListener?.("load", onLoad);
      image?.removeEventListener?.("error", onError);
      signal?.removeEventListener?.("abort", onAbort);
    };
    const finish = (error = null) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (error) reject(error);
      else if (!decoded()) reject(new Error("Documentary image has no decoded dimensions"));
      else resolve(image);
    };
    const onLoad = () => finish();
    const onError = () => finish(new Error("Documentary image failed to load"));
    const onAbort = () => finish(signal.reason || abortError("Documentary image decode aborted"));
    image?.addEventListener?.("load", onLoad, { once: true });
    image?.addEventListener?.("error", onError, { once: true });
    signal?.addEventListener?.("abort", onAbort, { once: true });
    timeoutId = timerHost.setTimeout(
      () => finish(new Error("Documentary image decode timed out")),
      Math.max(1, Number(timeoutMs) || DOCUMENTARY_IMAGE_TIMEOUT_MS),
    );
    if (typeof image?.decode === "function") {
      Promise.resolve().then(() => image.decode()).then(
        () => finish(),
        (error) => {
          if (image.complete) finish(error || new Error("Documentary image decode failed"));
        },
      );
    }
  });
}

async function sha256Hex(buffer) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Subresource integrity is unavailable");
  }
  const digest = await globalThis.crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function loadScenePlateTexture(record, role, signal, ownedTextures) {
  throwIfAborted(signal);
  const response = await fetch(resolveURL(record.path), {
    credentials: "same-origin",
    cache: "force-cache",
    signal,
  });
  if (!response.ok) throw new Error("Scene plate " + response.status + ": " + record.path);
  const buffer = await response.arrayBuffer();
  throwIfAborted(signal);
  if (buffer.byteLength !== record.bytes) {
    throw new Error("Scene plate byte length mismatch: " + record.path);
  }
  const digest = await sha256Hex(buffer);
  throwIfAborted(signal);
  if (digest !== record.sha256.toLowerCase()) {
    throw new Error("Scene plate SHA-256 mismatch: " + record.path);
  }
  const blob = new Blob([buffer], { type: record.mime });
  let bitmap = null;
  try {
    bitmap = await createImageBitmap(blob, {
      imageOrientation: "flipY",
      premultiplyAlpha: "none",
      colorSpaceConversion: "none",
    });
    throwIfAborted(signal);
    if (bitmap.width !== record.width || bitmap.height !== record.height) {
      throw new Error("Scene plate decoded dimensions mismatch: " + record.path);
    }
    const texture = new THREE.Texture(bitmap);
    texture.name = "V5_Plate_" + role + "_" + record.path.split("/").pop();
    texture.flipY = false;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.colorSpace = role === "color" ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    texture.userData.v5ImageBitmap = bitmap;
    texture.userData.v5AssetPath = record.path;
    texture.userData.v5AssetSha256 = record.sha256;
    texture.needsUpdate = true;
    ownedTextures.add(texture);
    bitmap = null;
    return texture;
  } finally {
    bitmap?.close?.();
  }
}

class ScenePlateWorld {
  constructor({
    root,
    viewport,
    payload,
    manifest,
    evidenceContract,
    variant,
    renderer,
    initialState = {},
    domActive = true,
    requestFrame = () => {},
  }) {
    this.root = root;
    this.viewport = viewport;
    this.payload = payload;
    this.manifest = manifest;
    this.evidenceContract = evidenceContract;
    this.plateContract = evidenceContract.scenePlates;
    this.variantName = variant;
    this.variant = this.plateContract.variants[variant];
    this.renderer = renderer;
    this.domActive = domActive;
    this.onRequestFrame = requestFrame;
    this.scene = new THREE.Scene();
    this.scene.background = null;
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.camera.position.z = 1;
    this.geometry = null;
    this.material = null;
    this.plane = null;
    this.width = 1;
    this.height = 1;
    this.currentPair = null;
    this.nextPair = null;
    this.currentBeat = "control";
    this.requestedBeat = "control";
    this.sceneName = "control";
    this.sceneProgress = 0;
    this.sceneIndex = 0;
    this.transition = null;
    this.queuedTransition = null;
    this.transitionRevision = 0;
    this.pairRequests = new Map();
    this.plateCache = new Map();
    this.ownedTextures = new Set();
    this.lifecycleController = new AbortController();
    this.foregroundRequest = null;
    this.heroState = ["low", "medium", "high"].includes(initialState.heroState)
      ? initialState.heroState
      : "medium";
    this.comparisonState = initialState.comparisonState || "halation";
    this.axisId = initialState.axisId || "vec_optical_softness";
    this.archiveEntries = evidenceContract.archive.entries.map(([observationId]) => observationId);
    this.initialArchiveObservation = this.archiveEntries.includes(initialState.archiveObservation)
      ? initialState.archiveObservation
      : "";
    this.observations = observationMap(payload);
    this.heroIds = new Map(
      evidenceContract.hero.map((item) => [item.requestedLevel, item.observation]),
    );
    this.heroStates = new Map(
      evidenceContract.hero.map((item) => [item.observation, item.requestedLevel]),
    );
    this.pointer = new THREE.Vector2(0.5, 0.5);
    this.pointerTarget = new THREE.Vector2(0.5, 0.5);
    this.pointerPresence = 0;
    this.pointerPresenceTarget = 0;
    this.archiveFocusActive = false;
    this.entered = false;
    this.reduced = matchMedia(REDUCED_QUERY).matches;
    this.coarse = matchMedia(COMPACT_QUERY).matches;
    this.destroyed = false;
    this.firstFrameRendered = false;
    this.evidenceFailures = new Set();
    this.archiveObservation = "";
  }

  createPairRequest(beat, purpose) {
    const controller = new AbortController();
    const relayAbort = () => controller.abort(this.lifecycleController.signal.reason || abortError());
    if (this.lifecycleController.signal.aborted) relayAbort();
    else this.lifecycleController.signal.addEventListener("abort", relayAbort, { once: true });
    const request = {
      beat,
      purpose,
      controller,
      cleanup: () => this.lifecycleController.signal.removeEventListener("abort", relayAbort),
      promise: null,
    };
    request.promise = this.loadPlatePair(beat, controller.signal).then((pair) => {
      if (this.destroyed || controller.signal.aborted) {
        this.disposePair(pair);
        throw controller.signal.reason || abortError();
      }
      this.plateCache.set(beat, pair);
      this.touchPlate(beat);
      this.evictDistantPlates(this.requestedBeat || beat);
      return pair;
    }).finally(() => {
      request.cleanup();
      if (this.pairRequests.get(beat) === request) this.pairRequests.delete(beat);
      if (this.foregroundRequest === request) this.foregroundRequest = null;
    });
    this.pairRequests.set(beat, request);
    return request;
  }

  ensurePlate(beat, { purpose = "prefetch" } = {}) {
    if (!BEATS.includes(beat)) return Promise.reject(new Error("Unknown scene plate " + beat));
    const cached = this.plateCache.get(beat);
    if (cached) return Promise.resolve(this.touchPlate(beat));
    let request = this.pairRequests.get(beat);
    if (!request) request = this.createPairRequest(beat, purpose);
    if (purpose === "foreground") {
      request.purpose = "foreground";
      this.foregroundRequest = request;
    }
    return request.promise;
  }

  abortForegroundLoad(exceptBeat = "") {
    const request = this.foregroundRequest;
    if (!request || request.beat === exceptBeat) return;
    request.controller.abort(abortError("Superseded scene-plate request"));
    if (this.pairRequests.get(request.beat) === request) {
      this.pairRequests.delete(request.beat);
    }
    this.foregroundRequest = null;
  }

  async loadPlatePair(beat, signal) {
    const record = this.variant[beat];
    if (!record) throw new Error("Scene-plate variant is missing " + beat);
    const pairController = new AbortController();
    const relayAbort = () => pairController.abort(signal.reason || abortError());
    if (signal.aborted) relayAbort();
    else signal.addEventListener("abort", relayAbort, { once: true });
    const colorPromise = loadScenePlateTexture(
      record.color,
      "color",
      pairController.signal,
      this.ownedTextures,
    ).catch((error) => {
      pairController.abort(error);
      throw error;
    });
    const depthPromise = loadScenePlateTexture(
      record.depth,
      "depth",
      pairController.signal,
      this.ownedTextures,
    ).catch((error) => {
      pairController.abort(error);
      throw error;
    });
    const settled = await Promise.allSettled([colorPromise, depthPromise]);
    signal.removeEventListener("abort", relayAbort);
    const textures = settled
      .filter((item) => item.status === "fulfilled")
      .map((item) => item.value);
    const failed = settled.find((item) => item.status === "rejected");
    if (failed || signal.aborted || this.destroyed) {
      for (const texture of textures) {
        disposeTexture(texture);
        this.ownedTextures.delete(texture);
      }
      throw failed?.reason || signal.reason || abortError();
    }
    return {
      beat,
      color: textures[0],
      depth: textures[1],
      record,
      focalPoint: [...record.focalPoint],
    };
  }

  disposePair(pair) {
    if (!pair) return;
    disposeTexture(pair.color);
    disposeTexture(pair.depth);
    this.ownedTextures.delete(pair.color);
    this.ownedTextures.delete(pair.depth);
  }

  async load(onProgress = () => {}) {
    onProgress(0.04);
    const control = await this.ensurePlate("control", { purpose: "foreground" });
    throwIfAborted(this.lifecycleController.signal);
    if (this.destroyed) throw abortError();
    this.currentPair = control;
    this.nextPair = control;
    this.currentBeat = "control";
    this.requestedBeat = "control";
    this.createPlateMaterial();
    this.applyPairUniforms("Current", control);
    this.applyPairUniforms("Next", control);
    this.setArchiveObservation(this.initialArchiveObservation);
    onProgress(1);
    this.prefetchNeighbors("control");
    return this;
  }

  createPlateMaterial() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 32, 18);
    const maxParallax = this.plateContract.interaction.maxParallaxPx[this.variantName];
    this.material = new THREE.ShaderMaterial({
      name: "V5_Depth_Parallax_Plate",
      vertexShader: PLATE_VERTEX_SHADER,
      fragmentShader: PLATE_FRAGMENT_SHADER,
      depthTest: false,
      depthWrite: false,
      transparent: false,
      toneMapped: false,
      uniforms: {
        uColorCurrent: { value: this.currentPair.color },
        uDepthCurrent: { value: this.currentPair.depth },
        uColorNext: { value: this.currentPair.color },
        uDepthNext: { value: this.currentPair.depth },
        uCurrentScale: { value: new THREE.Vector2(1, 1) },
        uCurrentOffset: { value: new THREE.Vector2(0, 0) },
        uNextScale: { value: new THREE.Vector2(1, 1) },
        uNextOffset: { value: new THREE.Vector2(0, 0) },
        uCurrentTexel: { value: new THREE.Vector2(1, 1) },
        uNextTexel: { value: new THREE.Vector2(1, 1) },
        uViewportPx: { value: new THREE.Vector2(1, 1) },
        uPointer: { value: this.pointer.clone() },
        uPointerPresence: { value: 0 },
        uMaxParallaxPx: { value: maxParallax },
        uMaxRelightEv: { value: this.plateContract.interaction.maxRelightEv },
        uRelightRadiusPx: { value: 96 },
        uTransition: { value: 0 },
        uDirection: { value: 1 },
      },
    });
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.plane.name = "V5_Depth_Parallax_Screen";
    this.plane.frustumCulled = false;
    this.scene.add(this.plane);
  }

  applyPairUniforms(slot, pair) {
    if (!this.material || !pair) return;
    const record = pair.record.color;
    const maximum = this.plateContract.interaction.maxParallaxPx[this.variantName];
    const cover = coverUvTransform(
      record.width,
      record.height,
      this.width,
      this.height,
      pair.focalPoint,
      maximum,
    );
    const uniforms = this.material.uniforms;
    uniforms["uColor" + slot].value = pair.color;
    uniforms["uDepth" + slot].value = pair.depth;
    uniforms["u" + slot + "Scale"].value.fromArray(cover.scale);
    uniforms["u" + slot + "Offset"].value.fromArray(cover.offset);
    uniforms["u" + slot + "Texel"].value.set(1 / record.width, 1 / record.height);
  }

  async prime() {
    if (!this.material || this.destroyed) throw new Error("Scene plate is not ready to prime");
    const previous = this.renderer.getRenderTarget();
    const target = new THREE.WebGLRenderTarget(2, 2, {
      depthBuffer: false,
      stencilBuffer: false,
    });
    try {
      this.renderer.setRenderTarget(target);
      this.renderer.render(this.scene, this.camera);
    } finally {
      this.renderer.setRenderTarget(previous);
      target.dispose();
    }
  }

  prefetchNeighbors(beat) {
    const index = BEATS.indexOf(beat);
    for (const neighbor of [BEATS[index - 1], BEATS[index + 1]]) {
      if (!neighbor || this.plateCache.has(neighbor) || this.pairRequests.has(neighbor)) continue;
      void this.ensurePlate(neighbor, { purpose: "prefetch" }).catch((error) => {
        if (!isAbortError(error) && !this.destroyed) {
          console.warn("Neighbor scene plate could not be prefetched.", error);
        }
      });
    }
  }

  touchPlate(beat) {
    const pair = this.plateCache.get(beat);
    if (!pair) return null;
    this.plateCache.delete(beat);
    this.plateCache.set(beat, pair);
    return pair;
  }

  evictDistantPlates(preferredBeat = this.currentBeat) {
    return evictPlateCache({
      cache: this.plateCache,
      currentPair: this.currentPair,
      nextPair: this.nextPair,
      requestedBeat: this.requestedBeat,
      inflightBeats: this.pairRequests.keys(),
      preferredBeat,
      maxPairs: 3,
      disposePair: (pair) => this.disposePair(pair),
    });
  }

  async preparePlate(beat) {
    await this.ensurePlate(beat, { purpose: "prefetch" });
    if (this.destroyed) throw abortError();
  }

  requestPlate(beat, immediate = false) {
    const requested = BEATS.includes(beat) ? beat : "control";
    this.requestedBeat = requested;
    const revision = ++this.transitionRevision;
    this.abortForegroundLoad(requested);
    if (
      (!immediate && requested === this.transition?.beat)
      || (!this.transition && requested === this.currentBeat)
    ) {
      this.queuedTransition = null;
      this.requestFrame();
      return Promise.resolve(true);
    }
    const commit = (pair) => {
      if (
        this.destroyed
        || revision !== this.transitionRevision
        || requested !== this.requestedBeat
      ) return false;
      this.beginPlateTransition(requested, pair, immediate);
      return true;
    };
    const cached = this.touchPlate(requested);
    if (cached) {
      commit(cached);
      return Promise.resolve(true);
    }
    return this.ensurePlate(requested, { purpose: "foreground" }).then(commit).catch((error) => {
      if (isAbortError(error) || this.destroyed || revision !== this.transitionRevision) return false;
      this.root.dispatchEvent(new CustomEvent("atlas:plate-failure", {
        detail: { beat: requested, error, world: this },
      }));
      return false;
    });
  }

  beginPlateTransition(beat, pair, immediate = false) {
    if (immediate || this.reduced) {
      this.currentPair = pair;
      this.nextPair = pair;
      this.currentBeat = beat;
      this.transition = null;
      this.queuedTransition = null;
      this.applyPairUniforms("Current", pair);
      this.applyPairUniforms("Next", pair);
      this.material.uniforms.uTransition.value = 0;
      if (this.domActive) this.root.dataset.worldTransitioning = "false";
      this.touchPlate(beat);
      this.evictDistantPlates(beat);
      this.prefetchNeighbors(beat);
      this.requestFrame();
      return;
    }
    if (this.transition) {
      if (beat !== this.transition.beat) {
        this.queuedTransition = { beat, pair };
      }
      this.requestFrame();
      return;
    }
    if (beat === this.currentBeat) {
      this.queuedTransition = null;
      this.nextPair = this.currentPair;
      this.applyPairUniforms("Next", this.currentPair);
      this.material.uniforms.uTransition.value = 0;
      if (this.domActive) this.root.dataset.worldTransitioning = "false";
      this.evictDistantPlates(beat);
      this.prefetchNeighbors(beat);
      this.requestFrame();
      return;
    }
    const direction = Math.sign(BEATS.indexOf(beat) - BEATS.indexOf(this.currentBeat)) || 1;
    this.nextPair = pair;
    this.applyPairUniforms("Next", pair);
    this.material.uniforms.uDirection.value = direction;
    this.material.uniforms.uTransition.value = 0;
    this.transition = {
      beat,
      pair,
      direction,
      startTime: performance.now(),
      duration: this.plateContract.interaction.transitionMs,
    };
    if (this.domActive) this.root.dataset.worldTransitioning = "true";
    this.requestFrame();
  }

  updateTransition(now = performance.now()) {
    if (!this.transition || !this.material) return;
    const raw = clamp((now - this.transition.startTime) / this.transition.duration);
    const progress = raw === 0 || raw === 1 ? raw : premiumTransitionEase(raw);
    this.material.uniforms.uTransition.value = progress;
    if (transitionEndpoint(raw) !== "next") return;
    const finished = this.transition;
    this.currentPair = finished.pair;
    this.nextPair = finished.pair;
    this.currentBeat = finished.beat;
    this.transition = null;
    this.applyPairUniforms("Current", finished.pair);
    this.applyPairUniforms("Next", finished.pair);
    this.material.uniforms.uTransition.value = 0;
    if (this.domActive) this.root.dataset.worldTransitioning = "false";
    this.touchPlate(finished.beat);
    this.evictDistantPlates(finished.beat);
    const queued = this.queuedTransition;
    this.queuedTransition = null;
    if (queued && queued.beat === this.requestedBeat && queued.beat !== this.currentBeat) {
      this.beginPlateTransition(queued.beat, queued.pair, false);
    } else {
      this.prefetchNeighbors(finished.beat);
    }
  }

  requestFrame() {
    if (this.domActive) this.onRequestFrame(this);
  }

  commitHeroEvidenceDOM(state, { emit = true, announce = true } = {}) {
    const observation = this.heroIds.get(state);
    if (!observation) throw new Error("Unknown Control evidence state " + state);
    this.heroState = state;
    if (this.domActive) commitHeroEvidenceDOM(this.root, this.heroIds, state);
    if (this.domActive && emit) {
      dispatch("atlas:interaction", {
        kind: "state-detent",
        value: state,
        pan: state === "low" ? -0.5 : state === "high" ? 0.5 : 0,
        interactionId: "state:" + state + ":" + Math.round(performance.now()),
      });
    }
    if (this.domActive && announce) {
      this.announce(
        state + " requested "
        + vectorName(this.payload, this.payload.hero.vector_id).toLowerCase()
        + ", registered evidence " + observation,
      );
    }
  }

  degradeEvidence(beat, error) {
    if (this.evidenceFailures.has(beat)) return null;
    this.evidenceFailures.add(beat);
    const label = beat === "archive"
      ? "registered archive preview"
      : "registered documentary proof";
    console.warn(beat + " " + label + " is unavailable.", error);
    this.root.dispatchEvent(new CustomEvent("atlas:evidence-failure", {
      detail: { beat, error, world: this },
    }));
    return null;
  }

  validateDocumentaryNode(node, beat) {
    const image = node.matches("img") ? node : node.querySelector("img");
    if (!image) {
      throw new Error(beat + " registered proof must be an image in the semantic DOM");
    }
    const observationId = node.dataset.observationId;
    const imageSource = image.currentSrc || image.getAttribute("src") || "";
    if (
      !this.root.contains(node)
      || image.closest("[data-world-canvas]")
      || !image.hasAttribute("data-documentary-evidence")
      || image.style.filter
      || !imageSource.includes(observationId)
    ) throw new Error(beat + " registered proof is not an ungraded DOM image");
    return image;
  }

  async assertSemanticEvidence(selector, expected, beat) {
    const nodes = [...this.root.querySelectorAll(selector)];
    const observed = new Set(nodes.map((node) => node.dataset.observationId).filter(Boolean));
    const missing = expected.filter((observationId) => !observed.has(observationId));
    if (missing.length) {
      throw new Error(
        beat + " semantic proof is missing registered observations: " + missing.join(", "),
      );
    }
    const images = nodes.map((node) => this.validateDocumentaryNode(node, beat));
    await Promise.all(images.map((image) => awaitDocumentaryImage(
      image,
      this.lifecycleController.signal,
    )));
    nodes.forEach((node, index) => {
      if (this.validateDocumentaryNode(node, beat) !== images[index]) {
        throw new Error(beat + " documentary image changed during decode");
      }
      if (images[index].naturalWidth <= 0 || images[index].naturalHeight <= 0) {
        throw new Error(beat + " documentary image decoded without pixels");
      }
    });
    return nodes;
  }

  async ensureComparisonEvidence() {
    try {
      await this.assertSemanticEvidence(
        "[data-chamber-comparison-fallback] [data-observation-id]",
        this.evidenceContract.comparison.map((item) => item.observation),
        "comparison",
      );
      return true;
    } catch (error) {
      return this.degradeEvidence("comparison", error);
    }
  }

  async ensureReconstructionEvidence() {
    try {
      await this.assertSemanticEvidence(
        '[data-world-plates="reconstruction"] [data-observation-id]',
        this.evidenceContract.reconstruction.map((item) => item.observation),
        "reconstruction",
      );
      return true;
    } catch (error) {
      return this.degradeEvidence("reconstruction", error);
    }
  }

  responseComponents() {
    return this.evidenceContract.response;
  }

  correlationRows(axisId) {
    const pairs = this.payload.analysis?.correlations?.pairs || [];
    return pairs.flatMap(([a, b, r]) => {
      if (a === axisId) return [{ id: b, r: Number(r) }];
      if (b === axisId) return [{ id: a, r: Number(r) }];
      return [];
    }).filter((item) => Number.isFinite(item.r))
      .sort((a, b) => Math.abs(b.r) - Math.abs(a.r))
      .slice(0, 5);
  }

  updateAssociationLedger(axisId, rows = this.correlationRows(axisId)) {
    if (!this.domActive) return;
    const ledger = this.root.querySelector('[data-world-ledger="association"]');
    if (!ledger) return;
    const caption = ledger.querySelector("caption");
    if (caption) {
      caption.textContent = "Strongest recorded relationships to "
        + vectorName(this.payload, axisId);
    }
    const body = ledger.querySelector("tbody");
    if (body) {
      body.replaceChildren(...rows.map(({ id, r }) => {
        const angle = THREE.MathUtils.radToDeg(Math.acos(clamp(r, -1, 1)));
        const row = document.createElement("tr");
        row.dataset.vectorId = id;
        row.dataset.sign = r < 0 ? "negative" : "positive";
        row.style.setProperty("--angle", angle.toFixed(1) + "deg");
        const heading = document.createElement("th");
        heading.scope = "row";
        const mark = document.createElement("i");
        mark.setAttribute("aria-hidden", "true");
        heading.append(mark, document.createTextNode(vectorName(this.payload, id)));
        const coefficient = document.createElement("td");
        coefficient.textContent = (r >= 0 ? "+" : "") + r.toFixed(2);
        const degrees = document.createElement("td");
        degrees.textContent = angle.toFixed(0) + "°";
        row.append(heading, coefficient, degrees);
        return row;
      }));
    }
  }

  async ensureAtlas() {
    if (this.archiveEvidencePromise) return this.archiveEvidencePromise;
    this.archiveEvidencePromise = Promise.resolve().then(() => {
      const sheet = this.root.querySelector(
        '[data-archive-preview][data-archive-preview-kind="registered-atlas"]',
      );
      if (!sheet) throw new Error("registered archive preview is missing");
      if (
        resolveURL(sheet.dataset.archiveAtlasDesktop)
          !== resolveURL(this.evidenceContract.archive.desktopPath)
        || resolveURL(sheet.dataset.archiveAtlasMobile)
          !== resolveURL(this.evidenceContract.archive.mobilePath)
      ) throw new Error("registered archive preview paths do not match the payload atlas");
      if (
        sheet.matches(
          "[data-exact-evidence], [data-documentary-evidence], [data-archive-exact]",
        )
        || sheet.querySelector(
          "[data-exact-evidence], [data-documentary-evidence], [data-archive-exact]",
        )
      ) throw new Error("registered archive preview makes a false exact-image claim");

      const entries = [...sheet.querySelectorAll(
        "[data-archive-preview-entry][data-observation-id][data-archive-index]",
      )];
      if (entries.length !== this.archiveEntries.length) {
        throw new Error("registered archive preview count does not match the 126-entry cohort");
      }
      entries.forEach((entry, index) => {
        const observationId = this.archiveEntries[index];
        const canonicalHref = resolveURL("observations/" + observationId + ".html");
        if (
          entry.dataset.observationId !== observationId
          || Number(entry.dataset.archiveIndex) !== index
          || !entry.matches("a[href]")
          || resolveURL(entry.getAttribute("href")) !== canonicalHref
          || !entry.querySelector('[data-archive-preview-crop][aria-hidden="true"]')
        ) throw new Error("registered archive preview entry " + index + " is stale or out of order");
      });
      return true;
    }).catch((error) => this.degradeEvidence("archive", error));
    return this.archiveEvidencePromise;
  }

  async prepareSceneEvidence(beat) {
    if (beat === "comparison") await this.ensureComparisonEvidence();
    else if (beat === "reconstruction") await this.ensureReconstructionEvidence();
    else if (beat === "archive") await this.ensureAtlas();
    if (this.evidenceFailures.has(beat)) {
      throw new Error(beat + " documentary contract could not be prepared");
    }
  }

  async prepareScene(beat) {
    await Promise.all([
      this.prepareSceneEvidence(beat),
      this.preparePlate(beat),
    ]);
    if (this.destroyed) throw abortError();
  }

  setCameraJourney(index, segmentProgress) {
    this.sceneIndex = clamp(index, 0, BEATS.length - 1);
    this.sceneProgress = clamp(segmentProgress);
    // The authored focal point is the plate camera. The fixed orthographic
    // projection prevents a second, synthetic camera move from fighting the
    // depth-aware wipe between photographic landmarks.
  }

  setScene(beat, progress = 0, immediate = false) {
    const next = BEATS.includes(beat) ? beat : "control";
    const changed = next !== this.sceneName;
    const previous = this.sceneName;
    const previousIndex = this.sceneIndex;
    this.sceneName = next;
    this.sceneIndex = BEATS.indexOf(next);
    this.sceneProgress = clamp(progress);
    if (this.domActive) {
      this.root.dataset.chamberActiveScene = next;
      this.root.dataset.worldActiveBeat = next;
      this.root.dataset.worldActiveAct = this.sceneIndex === 0
        ? "control"
        : this.sceneIndex < 4 ? "entanglement" : "residual-atlas";
    }
    if (changed && this.domActive && !immediate) {
      const transitionId = "v5:" + previous + ":" + next + ":" + Math.round(performance.now());
      dispatch("atlas:transition", {
        from: previous,
        to: next,
        direction: this.sceneIndex >= previousIndex ? 1 : -1,
        phase: "optical-wipe",
        transitionId,
      });
      this.announce(next + " scene");
    }
    if (next === "response" && progress >= 0.46) void this.ensureComparisonEvidence();
    if (next === "comparison") void this.ensureComparisonEvidence();
    if (next === "association" && progress >= 0.46) void this.ensureReconstructionEvidence();
    if (next === "reconstruction") void this.ensureReconstructionEvidence();
    if (next === "archive" || (next === "reconstruction" && progress >= 0.72)) {
      void this.ensureAtlas();
    }
    if (this.domActive) this.syncFallbackFrames(next);
    void this.requestPlate(next, immediate || this.reduced);
  }

  syncFallbackFrames(active) {
    this.root.querySelectorAll("[data-world-fallback-frame]").forEach((frame) => {
      const selected = frame.dataset.worldFallbackFrame === active;
      frame.classList.toggle("is-active", selected);
      frame.setAttribute("aria-hidden", String(!selected));
    });
  }

  setHeroState(state, immediate = false) {
    if (!this.heroIds.has(state)) return false;
    if (state === this.heroState) return false;
    // Canonical DOM evidence commits in the input event. The scene-plate
    // renderer never edits or substitutes that evidence.
    this.commitHeroEvidenceDOM(state, {
      emit: !immediate,
      announce: !immediate,
    });
    return true;
  }

  setComparison(state, immediate = false) {
    if (!["halation", "bloom"].includes(state)) return;
    this.comparisonState = state;
    if (this.domActive) {
      this.root.dataset.chamberComparison = state;
      this.root.querySelectorAll("button[data-chamber-compare]").forEach((button) => {
        const selected = button.dataset.chamberCompare === state;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      this.root.querySelectorAll("[data-chamber-compare-layer]").forEach((layer) => {
        const selected = layer.dataset.chamberCompareLayer === state;
        layer.classList.toggle("is-active", selected);
        layer.removeAttribute("hidden");
        layer.removeAttribute("aria-hidden");
        if (selected) layer.setAttribute("aria-current", "true");
        else layer.removeAttribute("aria-current");
      });
    }
    if (this.domActive && !immediate) {
      dispatch("atlas:interaction", {
        kind: "comparison-slide",
        value: state,
        pan: state === "halation" ? -0.42 : 0.42,
        interactionId: "compare:" + state + ":" + Math.round(performance.now()),
      });
      this.announce(
        (state === "halation" ? "Halation" : "Highlight bloom")
        + " registered output in focus",
      );
    }
  }

  setAxis(axisId, immediate = false) {
    if (!this.payload.vectors?.[axisId]) return;
    this.axisId = axisId;
    if (this.domActive) {
      this.root.dataset.chamberAxis = axisId;
      this.root.querySelectorAll("[data-chamber-axis]").forEach((button) => {
        const selected = button.dataset.chamberAxis === axisId;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
    }
    this.updateAssociationLedger(axisId);
    if (this.domActive && !immediate) {
      dispatch("atlas:interaction", {
        kind: "axis-collet",
        value: axisId,
        pan: 0,
        interactionId: "axis:" + axisId + ":" + Math.round(performance.now()),
      });
      this.announce(vectorName(this.payload, axisId) + " correlation axis");
    }
  }

  announce(message) {
    if (!this.domActive) return;
    const status = this.root.querySelector("[data-chamber-status]");
    if (status) status.textContent = message;
  }

  setEntered(value = true) {
    this.entered = value;
    this.requestFrame();
  }

  setReducedMotion(value) {
    this.reduced = Boolean(value);
    this.pointer.set(0.5, 0.5);
    this.pointerTarget.set(0.5, 0.5);
    this.pointerPresence = 0;
    this.pointerPresenceTarget = 0;
    if (this.material) {
      this.material.uniforms.uPointer.value.copy(this.pointer);
      this.material.uniforms.uPointerPresence.value = 0;
    }
    if (this.reduced && this.transition) {
      const pending = this.transition;
      this.beginPlateTransition(pending.beat, pending.pair, true);
    } else if (this.reduced) {
      const requested = this.plateCache.get(this.requestedBeat);
      if (requested) this.beginPlateTransition(this.requestedBeat, requested, true);
    }
    this.viewport.style.cursor = "";
    if (this.domActive) {
      this.root.dataset.probeActive = "false";
      this.root.dataset.probeSurface = "";
    }
    this.requestFrame();
  }

  setArchiveObservation(observationId) {
    const id = this.archiveEntries.includes(observationId) ? observationId : "";
    if (id === this.archiveObservation) return;
    this.archiveObservation = id;
    this.archiveFocusActive = Boolean(id);
    if (!id) {
      this.pointerPresenceTarget = 0;
      this.requestFrame();
      return;
    }
    let hash = 0x811c9dc5;
    for (let index = 0; index < id.length; index += 1) {
      hash ^= id.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    const x = 0.5 + ((hash & 0xffff) / 0xffff - 0.5) * 0.72;
    const y = 0.5 + (((hash >>> 16) & 0xffff) / 0xffff - 0.5) * 0.72;
    this.pointerTarget.set(x, 1 - y);
    this.pointerPresenceTarget = this.reduced ? 0 : 0.72;
    if (this.domActive) this.announce(id + " illuminated at its deterministic archive point");
    this.requestFrame();
  }

  update(delta) {
    this.updateTransition(performance.now());
    if (!this.reduced && this.material) {
      const targetPresence = this.pointerPresenceTarget;
      const timeConstant = targetPresence > this.pointerPresence
        ? PLATE_POINTER_ATTACK
        : PLATE_POINTER_SETTLE;
      this.pointer.x = damp(this.pointer.x, this.pointerTarget.x, timeConstant, delta);
      this.pointer.y = damp(this.pointer.y, this.pointerTarget.y, timeConstant, delta);
      this.pointerPresence = damp(
        this.pointerPresence,
        targetPresence,
        timeConstant,
        delta,
      );
      if (this.pointer.distanceTo(this.pointerTarget) < 0.0001) {
        this.pointer.copy(this.pointerTarget);
      }
      if (Math.abs(this.pointerPresence - targetPresence) < 0.0001) {
        this.pointerPresence = targetPresence;
      }
      this.material.uniforms.uPointer.value.copy(this.pointer);
      this.material.uniforms.uPointerPresence.value = clamp(this.pointerPresence);
    }
    return this.needsFrame();
  }

  needsFrame() {
    if (this.transition) return true;
    if (this.reduced || !this.material) return false;
    return this.pointer.distanceToSquared(this.pointerTarget) > 1e-8
      || Math.abs(this.pointerPresence - this.pointerPresenceTarget) > 0.0001;
  }

  resize(width, height) {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    const cssPixels = Math.max(1, this.width * this.height);
    const cap = this.variantName === "mobile" ? MAX_MOBILE_PIXELS : MAX_DESKTOP_PIXELS;
    const pixelRatio = Math.min(
      this.variantName === "mobile" ? 1.25 : 1.5,
      window.devicePixelRatio || 1,
      Math.sqrt(cap / cssPixels),
    );
    this.renderer.setPixelRatio(Math.max(0.1, pixelRatio));
    this.renderer.setSize(this.width, this.height, false);
    if (!this.material) return;
    this.material.uniforms.uViewportPx.value.set(this.width, this.height);
    const radius = Math.min(180, Math.max(96, Math.min(this.width, this.height) * 0.2));
    this.material.uniforms.uRelightRadiusPx.value = radius;
    this.applyPairUniforms("Current", this.currentPair);
    this.applyPairUniforms("Next", this.nextPair || this.currentPair);
    this.requestFrame();
  }

  pointerMove(event, rect) {
    if (this.reduced || !this.material || rect.width <= 0 || rect.height <= 0) return;
    this.pointerTarget.set(
      clamp((event.clientX - rect.left) / rect.width),
      1 - clamp((event.clientY - rect.top) / rect.height),
    );
    this.pointer.lerp(this.pointerTarget, 0.18);
    this.pointerPresenceTarget = 1;
    this.pointerPresence = Math.max(this.pointerPresence, 0.18);
    // The raw pointer event commits both the target and a visible fraction.
    // The next RAF continues the 32ms attack, well inside the 48ms contract.
    this.material.uniforms.uPointer.value.copy(this.pointer);
    this.material.uniforms.uPointerPresence.value = this.pointerPresence;
    this.material.uniforms.uPointerPresence.v5FirstResponseMs = 0;
    this.viewport.style.cursor = "crosshair";
    if (this.domActive) {
      this.root.dataset.probeActive = "true";
      this.root.dataset.probeSurface = "scene-plate";
    }
    this.requestFrame();
  }

  pointerLeave() {
    this.pointerPresenceTarget = this.archiveFocusActive && !this.reduced ? 0.72 : 0;
    this.viewport.style.cursor = "";
    if (this.domActive) {
      this.root.dataset.probeActive = "false";
      this.root.dataset.probeSurface = "";
    }
    this.requestFrame();
  }

  pointerDown() {
    // Documentary comparison controls remain ordinary semantic buttons.
  }

  activatePointer() {
    // Archive entries remain ordinary links; the canvas never intercepts them.
  }

  pointerUp() {
    // No scene object can be dragged.
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    if (!this.firstFrameRendered) this.firstFrameRendered = true;
    if (this.domActive) {
      this.renderer.domElement.style.visibility = "visible";
      this.renderer.domElement.dataset.firstFrame = "ready";
    }
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.transitionRevision += 1;
    this.lifecycleController.abort(abortError("Scene-plate world destroyed"));
    for (const request of this.pairRequests.values()) {
      request.controller.abort(abortError("Scene-plate world destroyed"));
    }
    this.pairRequests.clear();
    this.foregroundRequest = null;
    this.transition = null;
    this.queuedTransition = null;
    this.onRequestFrame = () => {};
    this.scene.remove(this.plane);
    this.geometry?.dispose?.();
    this.material?.dispose?.();
    disposeOwnedTextures(this.ownedTextures);
    this.plateCache.clear();
    this.scene.clear();
    this.plane = null;
    this.geometry = null;
    this.material = null;
  }
}
class ChamberDirector {
  constructor(root) {
    this.root = root;
    this.viewport = root.querySelector("[data-chamber-canvas]");
    this.entry = root.querySelector("[data-chamber-entry]");
    this.enterButton = root.querySelector("[data-enter]");
    this.enterLabel = root.querySelector("[data-enter-label]");
    this.soundToggle = root.querySelector("[data-sound-toggle]");
    this.soundLabel = root.querySelector("[data-sound-label]");
    this.loader = root.querySelector("[data-world-loader]");
    this.loaderLabel = root.querySelector("[data-world-loader-label]");
    this.loaderProgress = root.querySelector("[data-world-load-progress]");
    this.beatNodes = BEATS.map((beat) => root.querySelector(`[data-world-beat="${beat}"]`));
    this.abortController = new AbortController();
    this.loadAbortController = new AbortController();
    this.lifecycleController = new AbortController();
    this.lifecycleRevision = 0;
    this.compactMedia = matchMedia(COMPACT_QUERY);
    this.reducedMedia = matchMedia(REDUCED_QUERY);
    this.saveData = navigator.connection?.saveData || matchMedia(SAVE_DATA_QUERY).matches;
    this.payload = parseInlinePayload(root);
    this.manifest = null;
    this.evidenceContract = null;
    this.renderer = null;
    this.world = null;
    this.audio = null;
    this.audioSettled = false;
    this.audioReady = false;
    this.worldReady = false;
    this.fallback = false;
    this.entered = false;
    this.running = false;
    this.destroyed = false;
    this.raf = 0;
    this.lastFrame = 0;
    this.elapsed = 0;
    this.activeIndex = 0;
    this.activeProgress = 0;
    this.sceneRequestRevision = 0;
    this.pendingEvidenceScene = null;
    this.scrollTicking = false;
    this.pointerStart = null;
    this.pointerFrame = 0;
    this.pendingPointer = null;
    this.resizeObserver = null;
    this.variantName = this.compactMedia.matches ? "mobile" : "desktop";
    this.reloadTimer = 0;
    this.entryDismissTimer = 0;
    this.worldLoadRevision = 0;
    this.pendingWorlds = new Set();
    this.focusBeforeEntry = document.activeElement;
    this.cleanupCallbacks = [];
    this.entryInertState = new Map();
  }

  async boot() {
    // The inline watchdog may have released a very late module before this
    // class is even constructed. Never resurrect the modal or start network
    // work after that terminal fail-open decision.
    if (this.root.dataset.bootTimedOut === "true") {
      this.leaveSemanticEdition("Boot timed out");
      return;
    }
    this.root.dataset.ready = "false";
    this.root.dataset.failed = "false";
    this.root.dataset.worldVariant = this.variantName;
    this.bindCoreEvents();
    this.applyEntryLock();
    this.updateLoader(0.03, "Loading the world");
    // Honour an explicit reduced-data preference before either scene depth or
    // the multi-megabyte score is requested. This is a failure-mode exception to
    // the normal music-required entrance, not a second user-facing choice.
    if (this.saveData) {
      this.audioSettled = true;
      this.audioReady = false;
    }
    const audioPromise = this.saveData ? Promise.resolve() : this.loadAudio();
    try {
      this.manifest = await this.loadManifest();
      if (this.bootInactive()) throw new Error("Boot was superseded");
      this.updateLoader(0.1, "Opening the field");
      if (!hasWebGL2() || this.saveData) throw new Error(this.saveData ? "Reduced-data fallback" : "WebGL 2 unavailable");
      await this.createRenderer();
      if (this.bootInactive()) throw new Error("Boot was superseded");
      // Scroll restoration and fragment navigation can place the document in
      // any beat before the first plate is prepared. Measure now so the initial
      // candidate decodes that beat's documentary proof while still offscreen.
      this.measureActiveScroll();
      const loaded = await this.loadWorld(this.variantName);
      if (!loaded) throw new Error("World load was superseded");
      // Paint the aligned color/depth pair into the correctly sized backbuffer
      // before CSS is allowed to reveal the canvas. This prevents the browser's
      // default opaque 300x150 buffer from covering the poster.
      this.world.update(0, this.elapsed);
      this.world.render();
      this.worldReady = true;
      this.root.classList.add("is-chamber-webgl");
      this.root.classList.remove("is-chamber-fallback");
      this.root.dataset.chamberStatus = "ready";
      this.updateLoader(1, "World ready");
      this.scheduleVariantReload();
    } catch (error) {
      console.warn("The cinematic world yielded to the semantic edition.", error);
      if (!this.fallback) this.activateFallback(error?.message || "World unavailable");
    }
    if (this.root.dataset.bootTimedOut === "true") this.leaveSemanticEdition("Boot timed out");
    this.sampleScroll();
    this.start();
    await audioPromise;
    if (this.destroyed) return;
    this.maybeEnableEntry();
    this.commitReady();
  }

  async loadManifest() {
    const url = resolveURL(this.root.dataset.worldManifest);
    const response = await fetch(url, {
      credentials: "same-origin",
      signal: this.loadAbortController.signal,
    });
    if (!response.ok) throw new Error(`World manifest ${response.status}`);
    const manifest = await response.json();
    if (manifest.format !== "atlas-world/v2" || manifest.version !== 2) {
      throw new Error("Unsupported world manifest");
    }
    this.evidenceContract = validateDocumentaryEvidenceContract(this.payload, manifest);
    if (this.evidenceContract.scenePlates.order.some(
      (beat, index) => beat !== BEATS[index],
    )) throw new Error("World chapter order mismatch");
    return manifest;
  }

  bootInactive() {
    return this.destroyed
      || this.fallback
      || this.root.dataset.bootTimedOut === "true";
  }

  lifecycleInactive(revision) {
    return this.destroyed
      || revision !== this.lifecycleRevision
      || this.lifecycleController.signal.aborted
      || this.root.dataset.bootTimedOut === "true";
  }

  async loadAudio() {
    const revision = this.lifecycleRevision;
    let timeoutId = 0;
    let removeAbortListener = () => {};
    let candidate = null;
    try {
      const url = resolveURL("assets/chamber-audio.js");
      const timeout = new Promise((_, reject) => {
        timeoutId = window.setTimeout(
          () => reject(new Error("Music module timed out")),
          AUDIO_MODULE_TIMEOUT,
        );
      });
      const aborted = new Promise((resolve) => {
        const onAbort = () => resolve(null);
        if (this.lifecycleController.signal.aborted) onAbort();
        else {
          this.lifecycleController.signal.addEventListener("abort", onAbort, { once: true });
          removeAbortListener = () => this.lifecycleController.signal.removeEventListener(
            "abort",
            onAbort,
          );
        }
      });
      const module = await Promise.race([
        import(/* @vite-ignore */ url),
        timeout,
        aborted,
      ]);
      if (this.lifecycleInactive(revision)) return;
      if (typeof module?.createAtlasAudio === "function") {
        candidate = module.createAtlasAudio(this.root);
        retainLoadedAudio(this, candidate, revision);
        candidate = null;
      }
    } catch (error) {
      if (!this.lifecycleInactive(revision)) console.warn("Music controls are unavailable.", error);
    } finally {
      window.clearTimeout(timeoutId);
      removeAbortListener();
      candidate?.destroy?.();
      if (this.lifecycleInactive(revision)) return;
      this.audioSettled = true;
      this.audioReady = Boolean(this.audio?.available);
      this.maybeEnableEntry();
    }
  }

  async createRenderer() {
    if (this.bootInactive()) throw new Error("Renderer creation was superseded");
    const renderer = new THREE.WebGLRenderer({
      // The WebGL context survives responsive plate swaps, so immutable
      // context attributes must be valid for both variants. The mobile pixel
      // cap bounds MSAA memory while keeping the widened desktop crisp.
      antialias: true,
      alpha: true,
      depth: true,
      stencil: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.dataset.worldCanvas = "true";
    renderer.domElement.style.background = "transparent";
    renderer.domElement.style.visibility = "hidden";
    renderer.domElement.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      this.activateFallback("WebGL context lost");
      this.stop();
    }, { signal: this.abortController.signal });
    try {
      this.viewport.append(renderer.domElement);
      this.renderer = renderer;
    } catch (error) {
      renderer.dispose();
      throw error;
    }
  }

  async loadWorld(variant = this.variantName) {
    if (this.bootInactive() || !this.renderer) return false;
    const revision = ++this.worldLoadRevision;
    for (const pendingWorld of this.pendingWorlds) pendingWorld.destroy();
    this.pendingWorlds.clear();
    const initialState = this.world ? {
      heroState: this.world.heroState,
      comparisonState: this.world.comparisonState,
      axisId: this.world.axisId,
      archiveObservation: this.world.archiveObservation,
    } : {};
    const candidate = new ScenePlateWorld({
      root: this.root,
      viewport: this.viewport,
      payload: this.payload,
      manifest: this.manifest,
      evidenceContract: this.evidenceContract,
      variant,
      renderer: this.renderer,
      initialState,
      domActive: false,
      requestFrame: (world) => {
        if (world === this.world) this.start();
      },
    });
    this.pendingWorlds.add(candidate);
    const isStale = () => revision !== this.worldLoadRevision
      || this.destroyed
      || this.fallback
      || !this.renderer
      || this.root.dataset.bootTimedOut === "true";
    let liveState = null;
    let activeBeat = "control";
    try {
      await candidate.load((progress) => {
        if (revision === this.worldLoadRevision && !this.destroyed) {
          this.updateLoader(0.12 + progress * 0.82, "Opening cinematic scene plates");
        }
      });
    } catch (error) {
      this.pendingWorlds.delete(candidate);
      candidate.destroy();
      if (isStale()) return false;
      throw error;
    }
    if (isStale()) {
      this.pendingWorlds.delete(candidate);
      candidate.destroy();
      return false;
    }
    try {
      const rect = this.viewport.getBoundingClientRect();
      candidate.resize(Math.max(1, rect.width), Math.max(1, rect.height));
      // Accessibility and input media can change while replacement plates
      // is in flight. Commit the current preferences, not the constructor's
      // stale snapshot.
      candidate.setReducedMotion(this.reducedMedia.matches);
      candidate.coarse = this.compactMedia.matches;
      // A responsive replacement remains offscreen until the documentary evidence
      // required by the live beat has decoded. If the user scrolls while it
      // is pending, prepare the latest beat before committing.
      while (true) {
        const preparedBeat = BEATS[this.activeIndex] || "control";
        await candidate.prepareScene(preparedBeat);
        if (isStale()) {
          this.pendingWorlds.delete(candidate);
          candidate.destroy();
          return false;
        }
        if (preparedBeat === (BEATS[this.activeIndex] || "control")) break;
      }
      // Registered atlas/image decode can outlive a resize or an accessibility
      // preference change. Re-snapshot both at the transactional boundary so
      // the winning candidate cannot commit stale projection or motion/input
      // policy after its final await.
      const commitRect = this.viewport.getBoundingClientRect();
      candidate.resize(Math.max(1, commitRect.width), Math.max(1, commitRect.height));
      candidate.setReducedMotion(this.reducedMedia.matches);
      candidate.coarse = this.compactMedia.matches;
      if (isStale()) {
        this.pendingWorlds.delete(candidate);
        candidate.destroy();
        return false;
      }
      if (this.world) {
        liveState = {
          heroState: this.world.heroState,
          comparisonState: this.world.comparisonState,
          axisId: this.world.axisId,
          archiveObservation: this.world.archiveObservation,
        };
      } else liveState = {
        heroState: candidate.heroState,
        comparisonState: candidate.comparisonState,
        axisId: candidate.axisId,
        archiveObservation: candidate.archiveObservation,
      };
      candidate.setHeroState(liveState.heroState || "medium", true);
      candidate.setComparison(liveState.comparisonState || "halation", true);
      candidate.setAxis(liveState.axisId || "vec_optical_softness", true);
      candidate.setArchiveObservation(liveState.archiveObservation || "");
      activeBeat = BEATS[this.activeIndex] || "control";
      candidate.setScene(activeBeat, this.activeProgress, true);
      candidate.setCameraJourney(this.activeIndex, this.activeProgress);
      candidate.setEntered(this.entered, false);
      await candidate.prime();
      if (isStale()) {
        this.pendingWorlds.delete(candidate);
        candidate.destroy();
        return false;
      }
    } catch (error) {
      this.pendingWorlds.delete(candidate);
      candidate.destroy();
      if (isStale()) return false;
      throw error;
    }
    this.pendingWorlds.delete(candidate);
    const previous = this.world;
    this.sceneRequestRevision += 1;
    this.pendingEvidenceScene = null;
    // No awaited or fallible preparation remains beyond this boundary. A
    // losing candidate is never DOM-active; the winner becomes active on the
    // line immediately before its identity commits.
    if (previous) previous.domActive = false;
    candidate.domActive = true;
    this.world = candidate;
    this.variantName = variant;
    this.root.dataset.worldVariant = variant;
    candidate.commitHeroEvidenceDOM(liveState?.heroState || "medium", {
      emit: false,
      announce: false,
    });
    candidate.setComparison(liveState?.comparisonState || "halation", true);
    candidate.setAxis(liveState?.axisId || "vec_optical_softness", true);
    candidate.setArchiveObservation(liveState?.archiveObservation || "");
    candidate.setScene(activeBeat, this.activeProgress, true);
    try {
      previous?.destroy();
    } catch (error) {
      console.warn("The replaced world could not be fully released.", error);
    }
    return true;
  }

  releaseRenderer() {
    this.renderer?.domElement?.remove();
    this.renderer?.dispose?.();
    this.renderer = null;
  }

  activateFallback(reason) {
    this.stop();
    this.syncMeasuredFallback(BEATS[this.activeIndex] || "control");
    this.invalidateWorldLoads();
    this.fallback = true;
    this.worldReady = true;
    this.root.dataset.failed = "true";
    this.root.dataset.chamberStatus = "fallback";
    this.root.dataset.chamberFallback = String(reason || "unavailable").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    this.root.classList.remove("is-chamber-webgl");
    this.root.classList.add("is-chamber-fallback");
    this.world?.destroy();
    this.world = null;
    this.releaseRenderer();
    this.updateLoader(1, "Static edition ready");
    this.maybeEnableEntry();
  }

  leaveSemanticEdition(reason) {
    this.invalidateWorldLoads();
    this.fallback = true;
    this.worldReady = true;
    this.root.classList.remove("is-chamber-webgl", "is-chamber-fallback");
    this.root.dataset.failed = "false";
    this.root.dataset.chamberStatus = "semantic";
    this.root.dataset.chamberFallback = String(reason || "unavailable")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    this.world?.destroy();
    this.world = null;
    this.releaseRenderer();
    this.releaseEntryLock();
    this.stop();
  }

  invalidateWorldLoads() {
    this.worldLoadRevision += 1;
    this.sceneRequestRevision += 1;
    this.pendingEvidenceScene = null;
    this.loadAbortController.abort();
    for (const pendingWorld of this.pendingWorlds) pendingWorld.destroy();
    this.pendingWorlds.clear();
  }

  updateLoader(value, label) {
    if (this.loaderProgress) {
      this.loaderProgress.value = clamp(value);
      this.loaderProgress.textContent = `${Math.round(clamp(value) * 100)}%`;
    }
    if (this.loaderLabel && label) this.loaderLabel.textContent = label;
  }

  maybeEnableEntry() {
    if (this.root.dataset.bootTimedOut === "true") return;
    if (!this.audioSettled || !this.worldReady || !this.enterButton) return;
    if (!this.audioReady) {
      if (!this.fallback) {
        this.activateFallback("Music unavailable");
        return;
      }
      this.root.dataset.audioRequest = "unavailable";
      this.disableSoundControl();
      this.entry.dataset.entryState = "dismissed";
      this.entry.setAttribute("aria-hidden", "true");
      this.entered = true;
      this.world?.setEntered(true);
      this.releaseEntryLock();
      return;
    }
    this.enterButton.disabled = false;
    this.enterButton.setAttribute("aria-disabled", "false");
    if (this.enterLabel) this.enterLabel.textContent = "Enter the atlas";
  }

  disableSoundControl() {
    if (!this.soundToggle) return;
    this.soundToggle.disabled = true;
    this.soundToggle.hidden = true;
    this.soundToggle.setAttribute("aria-disabled", "true");
    if (this.soundLabel) this.soundLabel.textContent = "Music unavailable";
  }

  commitReady() {
    if (this.root.dataset.bootTimedOut === "true") return;
    this.root.dataset.ready = "true";
    if (this.entry.dataset.entryState === "dismissed") return;
    this.entry.setAttribute("role", "dialog");
    this.entry.setAttribute("aria-modal", "true");
    this.entry.setAttribute("aria-busy", "false");
    this.entry.removeAttribute("aria-live");
    requestAnimationFrame(() => this.enterButton?.focus({ preventScroll: true }));
  }

  applyEntryLock() {
    document.documentElement.classList.add("is-entry-open");
    document.body?.classList.add("is-entry-open");
    this.root.querySelectorAll(
      ".chamber-masthead, [data-world-narrative], [data-world-footer]",
    ).forEach((node) => {
      if (!this.entryInertState.has(node)) this.entryInertState.set(node, Boolean(node.inert));
      node.inert = true;
      node.dataset.entryInert = "true";
    });
  }

  releaseEntryLock() {
    document.documentElement.classList.remove("is-entry-open");
    document.body?.classList.remove("is-entry-open");
    for (const [node, wasInert] of this.entryInertState) {
      node.inert = wasInert;
      delete node.dataset.entryInert;
    }
    this.entryInertState.clear();
  }

  bindCoreEvents() {
    const signal = this.abortController.signal;
    this.root.addEventListener("atlas:evidence-failure", (event) => {
      const failedWorld = event.detail?.world;
      if (this.fallback || (this.world && failedWorld && failedWorld !== this.world)) return;
      const beat = event.detail?.beat || "documentary";
      this.activateFallback(`${beat} evidence unavailable`);
      this.announce("Registered evidence could not be loaded. The static edition is now active.");
    }, { signal });
    this.root.addEventListener("atlas:visualization-failure", (event) => {
      const failedWorld = event.detail?.world;
      if (this.fallback || (this.world && failedWorld && failedWorld !== this.world)) return;
      this.announce("The scene illustration could not update. The registered selected proof remains available.");
    }, { signal });
    this.root.addEventListener("atlas:plate-failure", (event) => {
      const failedWorld = event.detail?.world;
      if (this.fallback || (this.world && failedWorld && failedWorld !== this.world)) return;
      const beat = event.detail?.beat || "scene";
      this.activateFallback(beat + " scene plate unavailable");
      this.announce("The cinematic plate could not load. The static evidence edition is now active.");
    }, { signal });
    this.enterButton?.addEventListener("click", () => this.enter(), { signal });
    this.entry?.addEventListener("keydown", (event) => {
      if (event.key === "Tab" || event.key === "Escape") {
        event.preventDefault();
        this.enterButton?.focus({ preventScroll: true });
      }
    }, { signal });

    this.root.querySelectorAll("[data-chamber-state]").forEach((button) => {
      button.addEventListener("click", () => this.setHeroState(button.dataset.chamberState), { signal });
    });
    this.root.querySelectorAll("button[data-chamber-compare]").forEach((button) => {
      button.addEventListener("click", () => this.setComparison(button.dataset.chamberCompare), { signal });
    });
    this.root.querySelectorAll("[data-chamber-axis]").forEach((button) => {
      button.addEventListener("click", () => this.setAxis(button.dataset.chamberAxis), { signal });
    });

    const archiveEntry = (target) => target?.closest?.(
      '[data-archive-preview] '
      + '[data-archive-preview-entry][data-observation-id]',
    );
    const illuminateArchiveEntry = (event) => {
      const entry = archiveEntry(event.target);
      if (entry && this.root.contains(entry)) {
        this.world?.setArchiveObservation(entry.dataset.observationId || "");
        this.start();
      }
    };
    const releaseArchiveEntry = (event) => {
      const entry = archiveEntry(event.target);
      if (!entry || entry.contains(event.relatedTarget)) return;
      this.world?.setArchiveObservation("");
      this.start();
    };
    this.root.addEventListener("pointerover", illuminateArchiveEntry, { signal });
    this.root.addEventListener("pointerout", releaseArchiveEntry, { signal });
    this.root.addEventListener("focusin", illuminateArchiveEntry, { signal });
    this.root.addEventListener("focusout", releaseArchiveEntry, { signal });

    window.addEventListener("scroll", () => {
      if (!this.scrollTicking) {
        this.scrollTicking = true;
        requestAnimationFrame(() => {
          this.scrollTicking = false;
          this.sampleScroll();
        });
      }
    }, { passive: true, signal });

    const canvasHost = this.viewport;
    canvasHost.addEventListener("pointermove", (event) => {
      if (!this.entered || !this.world) return;
      if (this.pointerStart) {
        const distance = Math.hypot(
          event.clientX - this.pointerStart.x,
          event.clientY - this.pointerStart.y,
        );
        if (distance >= TOUCH_THRESHOLD) this.pointerStart.moved = true;
      }
      if (event.pointerType === "touch") {
        if (this.pointerStart) this.handleTouchMove(event);
        return;
      }
      // The target is committed in the raw input event. Rendering remains on
      // RAF, keeping first visible response under the manifest's 48ms budget.
      this.world.pointerMove(event, canvasHost.getBoundingClientRect());
      this.start();
    }, { passive: true, signal });
    canvasHost.addEventListener("pointerleave", () => {
      cancelAnimationFrame(this.pointerFrame);
      this.pointerFrame = 0;
      this.pendingPointer = null;
      this.world?.pointerLeave();
      this.start();
    }, { signal });
    canvasHost.addEventListener("pointerdown", (event) => {
      if (!this.entered || !this.world) return;
      if (event.button !== 0 && !(event.button === 1 && this.world.sceneName === "archive")) return;
      this.pointerStart = {
        x: event.clientX,
        y: event.clientY,
        id: event.pointerId,
        button: event.button,
        acted: false,
        moved: false,
      };
      if (event.pointerType !== "touch") {
        this.world.pointerDown(event, canvasHost.getBoundingClientRect());
      }
      canvasHost.setPointerCapture?.(event.pointerId);
    }, { signal });
    canvasHost.addEventListener("pointerup", (event) => {
      if (
        !this.pointerStart
        || this.pointerStart.id !== event.pointerId
        || this.pointerStart.button !== event.button
      ) return;
      this.flushPointer();
      const pointerStart = this.pointerStart;
      if (pointerStart && !pointerStart.acted && !pointerStart.moved) {
        if (event.pointerType === "touch") {
          this.world?.pointerMove(event, canvasHost.getBoundingClientRect());
        }
        this.world?.activatePointer(event);
      }
      this.world?.pointerUp();
      if (event.pointerType === "touch") this.world?.pointerLeave();
      this.pointerStart = null;
      canvasHost.releasePointerCapture?.(event.pointerId);
    }, { signal });
    canvasHost.addEventListener("pointercancel", () => {
      this.world?.pointerUp();
      this.pointerStart = null;
    }, { signal });

    this.resizeObserver = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box && this.world) {
        this.world.resize(Math.max(1, box.width), Math.max(1, box.height));
        this.start();
      }
    });
    this.resizeObserver.observe(this.viewport);

    this.compactMedia.addEventListener("change", () => this.scheduleVariantReload(), { signal });
    this.reducedMedia.addEventListener("change", (event) => {
      this.world?.setReducedMotion(event.matches);
      this.start();
    }, { signal });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.stop();
      else if (!this.destroyed) this.start();
    }, { signal });
    window.addEventListener("pagehide", (event) => {
      if (event.persisted) this.stop();
      else this.destroy();
    }, { signal });
    window.addEventListener("pageshow", (event) => {
      if (event.persisted && !this.destroyed) {
        this.restoreMeasuredScene();
        this.start();
      }
    }, { signal });
  }

  handleTouchMove(event) {
    if (!this.pointerStart || this.pointerStart.acted) return;
    const dx = event.clientX - this.pointerStart.x;
    const dy = event.clientY - this.pointerStart.y;
    if (Math.abs(dx) < TOUCH_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return;
    this.pointerStart.acted = true;
    const direction = dx > 0 ? -1 : 1;
    if (this.world.sceneName === "control") {
      const states = ["low", "medium", "high"];
      const index = states.indexOf(this.world.heroState);
      this.setHeroState(states[clamp(index + direction, 0, states.length - 1)]);
    } else if (this.world.sceneName === "comparison") {
      this.setComparison(direction > 0 ? "bloom" : "halation");
    } else if (this.world.sceneName === "association") {
      const axes = [...this.root.querySelectorAll("[data-chamber-axis]")].map((button) => button.dataset.chamberAxis);
      const index = axes.indexOf(this.world.axisId);
      this.setAxis(axes[clamp(index + direction, 0, axes.length - 1)]);
    }
  }

  flushPointer() {
    cancelAnimationFrame(this.pointerFrame);
    this.pointerFrame = 0;
    const pointer = this.pendingPointer;
    this.pendingPointer = null;
    if (!pointer || !this.world || !this.entered) return;
    this.world.pointerMove(pointer, this.viewport.getBoundingClientRect());
  }

  syncPressed(selector, dataKey, value) {
    this.root.querySelectorAll(selector).forEach((button) => {
      const selected = button.dataset[dataKey] === value;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  announce(message) {
    const status = this.root.querySelector("[data-chamber-status]");
    if (status) status.textContent = message;
  }

  setHeroState(state, immediate = false) {
    if (this.world) {
      this.world.setHeroState(state, immediate);
      this.start();
      return;
    }
    const heroIds = new Map((this.payload.hero?.levels || []).map((item) => [
      item.requested_level,
      item.observation_id,
    ]));
    commitHeroEvidenceDOM(this.root, heroIds, state);
    if (!immediate) {
      this.announce(
        `${state} requested ${vectorName(this.payload, this.payload.hero.vector_id).toLowerCase()}, registered evidence ${heroIds.get(state)}`,
      );
    }
  }

  setComparison(state, immediate = false) {
    if (this.world) {
      this.world.setComparison(state, immediate);
      this.start();
      return;
    }
    this.root.dataset.chamberComparison = state;
    this.syncPressed("button[data-chamber-compare]", "chamberCompare", state);
    this.root.querySelectorAll("[data-chamber-compare-layer]").forEach((layer) => {
      const selected = layer.dataset.chamberCompareLayer === state;
      layer.classList.toggle("is-active", selected);
      layer.removeAttribute("hidden");
      layer.removeAttribute("aria-hidden");
      if (selected) layer.setAttribute("aria-current", "true");
      else layer.removeAttribute("aria-current");
    });
  }

  setAxis(axisId, immediate = false) {
    if (this.world) {
      this.world.setAxis(axisId, immediate);
      this.start();
      return;
    }
    this.root.dataset.chamberAxis = axisId;
    this.syncPressed("[data-chamber-axis]", "chamberAxis", axisId);
    const pairs = this.payload.analysis?.correlations?.pairs || [];
    const rows = pairs.flatMap(([a, b, r]) => {
      if (a === axisId) return [{ id: b, r: Number(r) }];
      if (b === axisId) return [{ id: a, r: Number(r) }];
      return [];
    }).sort((a, b) => Math.abs(b.r) - Math.abs(a.r)).slice(0, 5);
    const ledger = this.root.querySelector('[data-world-ledger="association"]');
    const caption = ledger?.querySelector("caption");
    if (caption) caption.textContent = `Strongest recorded relationships to ${vectorName(this.payload, axisId)}`;
    const body = ledger?.querySelector("tbody");
    if (body) {
      body.replaceChildren(...rows.map(({ id, r }) => {
        const angle = THREE.MathUtils.radToDeg(Math.acos(clamp(r, -1, 1)));
        const row = document.createElement("tr");
        row.dataset.vectorId = id;
        row.dataset.sign = r < 0 ? "negative" : "positive";
        row.style.setProperty("--angle", `${angle.toFixed(1)}deg`);
        const heading = document.createElement("th");
        heading.scope = "row";
        const mark = document.createElement("i");
        mark.setAttribute("aria-hidden", "true");
        heading.append(mark, document.createTextNode(vectorName(this.payload, id)));
        const coefficient = document.createElement("td");
        coefficient.textContent = `${r >= 0 ? "+" : ""}${r.toFixed(2)}`;
        const degrees = document.createElement("td");
        degrees.textContent = `${angle.toFixed(0)}°`;
        row.append(heading, coefficient, degrees);
        return row;
      }));
    }
  }

  async enter() {
    if (this.entered || this.enterButton?.disabled) return;
    const revision = this.lifecycleRevision;
    const audioAtStart = this.audio;
    this.enterButton.disabled = true;
    this.enterButton.setAttribute("aria-disabled", "true");
    if (this.enterLabel) this.enterLabel.textContent = "Starting the music…";
    this.root.dataset.audioRequest = "on";
    let musicStarted = false;
    let timeoutId = 0;
    let removeAbortListener = () => {};
    try {
      const playback = Promise.resolve(audioAtStart?.enable?.({ entryCue: true }));
      const timeout = new Promise((resolve) => {
        timeoutId = window.setTimeout(() => resolve(false), AUDIO_START_TIMEOUT);
      });
      const aborted = new Promise((resolve) => {
        const onAbort = () => resolve(false);
        if (this.lifecycleController.signal.aborted) onAbort();
        else {
          this.lifecycleController.signal.addEventListener("abort", onAbort, { once: true });
          removeAbortListener = () => this.lifecycleController.signal.removeEventListener(
            "abort",
            onAbort,
          );
        }
      });
      musicStarted = Boolean(await Promise.race([playback, timeout, aborted]));
    } catch (error) {
      if (!this.lifecycleInactive(revision)) {
        console.warn("The licensed score did not start.", error);
      }
    } finally {
      window.clearTimeout(timeoutId);
      removeAbortListener();
    }
    if (this.lifecycleInactive(revision)) {
      if (musicStarted) audioAtStart?.disable?.({ persist: false });
      return;
    }
    if (!musicStarted) {
      this.root.dataset.audioRequest = "off";
      this.audio?.disable?.({ persist: false });
      this.audioReady = false;
      this.disableSoundControl();
      this.activateFallback("Music could not start");
      this.announce("Music could not start. The static evidence edition is available.");
      document.querySelector("main")?.focus?.({ preventScroll: true });
      return;
    }
    this.entered = true;
    this.entry.dataset.entryState = "dismissing";
    this.entry.setAttribute("aria-hidden", "true");
    this.world?.setEntered(true);
    void this.world?.ensureComparisonEvidence();
    window.clearTimeout(this.entryDismissTimer);
    this.entryDismissTimer = window.setTimeout(() => {
      if (this.lifecycleInactive(revision)) return;
      this.entryDismissTimer = 0;
      this.entry.dataset.entryState = "dismissed";
      this.releaseEntryLock();
      const main = document.querySelector("main");
      main?.focus?.({ preventScroll: true });
    }, ENTRY_DISMISS_DURATION);
  }

  measureActiveScroll() {
    const center = window.innerHeight * 0.5;
    let bestIndex = 0;
    let bestDistance = Infinity;
    const measurements = this.beatNodes.map((node, index) => {
      if (!node) return { index, top: 0, height: 1, center: 0 };
      const rect = node.getBoundingClientRect();
      const nodeCenter = rect.top + rect.height * 0.5;
      const distance = Math.abs(nodeCenter - center);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
      return { index, top: rect.top, height: Math.max(1, rect.height), center: nodeCenter };
    });
    const measurement = measurements[bestIndex];
    const progress = clamp((center - measurement.top) / measurement.height);
    this.activeIndex = bestIndex;
    this.activeProgress = progress;
    return { beat: BEATS[bestIndex] || "control", index: bestIndex, progress };
  }

  commitMeasuredScene(world, state, immediate = false) {
    if (!world || world !== this.world) return;
    world.setScene(state.beat, state.progress, immediate);
    world.setCameraJourney(state.index, state.progress);
    this.start();
  }

  syncMeasuredFallback(beat) {
    this.root.dataset.chamberActiveScene = beat;
    this.root.dataset.worldActiveBeat = beat;
    this.root.querySelectorAll("[data-world-fallback-frame]").forEach((frame) => {
      const selected = frame.dataset.worldFallbackFrame === beat;
      frame.classList.toggle("is-active", selected);
      frame.setAttribute("aria-hidden", String(!selected));
    });
  }

  requestMeasuredScene(state, immediate = false) {
    const world = this.world;
    if (!world) {
      this.syncMeasuredFallback(state.beat);
      return;
    }
    const evidenceBearing = state.beat === "comparison"
      || state.beat === "reconstruction"
      || state.beat === "archive";
    if (!evidenceBearing || state.beat === world.sceneName) {
      this.sceneRequestRevision += 1;
      this.pendingEvidenceScene = null;
      this.commitMeasuredScene(world, state, immediate);
      return;
    }
    if (
      this.pendingEvidenceScene?.world === world
      && this.pendingEvidenceScene.beat === state.beat
    ) {
      this.pendingEvidenceScene.immediate ||= immediate;
      return;
    }

    const request = {
      world,
      beat: state.beat,
      revision: ++this.sceneRequestRevision,
      immediate,
    };
    this.pendingEvidenceScene = request;
    void world.prepareSceneEvidence(state.beat).then(() => {
      if (
        this.pendingEvidenceScene !== request
        || request.revision !== this.sceneRequestRevision
        || world !== this.world
        || (BEATS[this.activeIndex] || "control") !== request.beat
      ) return;
      const latest = {
        beat: request.beat,
        index: this.activeIndex,
        progress: this.activeProgress,
      };
      this.pendingEvidenceScene = null;
      this.commitMeasuredScene(world, latest, request.immediate);
    }).catch((error) => {
      if (this.pendingEvidenceScene === request) this.pendingEvidenceScene = null;
      if (!this.fallback && world === this.world) {
        console.warn(`${state.beat} scene remained hidden because documentary evidence was unavailable.`, error);
      }
    });
  }

  restoreMeasuredScene() {
    this.requestMeasuredScene(this.measureActiveScroll(), true);
  }

  sampleScroll() {
    this.requestMeasuredScene(this.measureActiveScroll());
  }

  scheduleVariantReload() {
    const next = this.compactMedia.matches ? "mobile" : "desktop";
    clearTimeout(this.reloadTimer);
    if (next === this.variantName) {
      if (this.pendingWorlds.size) {
        this.worldLoadRevision += 1;
        for (const pendingWorld of this.pendingWorlds) pendingWorld.destroy();
        this.pendingWorlds.clear();
      }
      return;
    }
    if (!this.manifest || !this.worldReady || this.fallback) return;
    this.reloadTimer = window.setTimeout(async () => {
      const latest = this.compactMedia.matches ? "mobile" : "desktop";
      if (latest !== next) {
        this.scheduleVariantReload();
        return;
      }
      try {
        const loaded = await this.loadWorld(latest);
        if (!loaded) return;
        this.sampleScroll();
        this.world?.setEntered(this.entered, false);
        this.start();
      } catch (error) {
        console.warn(`The ${latest} world could not replace the active world.`, error);
        this.root.dataset.worldVariant = this.variantName;
        const rect = this.viewport.getBoundingClientRect();
        this.world?.resize(Math.max(1, rect.width), Math.max(1, rect.height));
        this.announce("The current view remains available.");
        this.start();
      }
    }, 320);
  }

  start() {
    if (this.running || this.destroyed || document.hidden || !this.world || !this.renderer) return;
    this.running = true;
    this.lastFrame = performance.now();
    const tick = (time) => {
      if (!this.running || this.destroyed) return;
      const delta = Math.min(0.05, Math.max(0.001, (time - this.lastFrame) / 1000));
      this.lastFrame = time;
      this.elapsed += delta;
      if (this.world && this.renderer) {
        this.world.update(delta, this.elapsed);
        this.world.render();
      }
      if (this.world?.needsFrame()) {
        this.raf = requestAnimationFrame(tick);
      } else {
        this.running = false;
        this.raf = 0;
      }
    };
    this.raf = requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.lifecycleRevision += 1;
    this.lifecycleController.abort(abortError("Chamber director destroyed"));
    this.invalidateWorldLoads();
    this.stop();
    cancelAnimationFrame(this.pointerFrame);
    clearTimeout(this.reloadTimer);
    clearTimeout(this.entryDismissTimer);
    this.entryDismissTimer = 0;
    this.abortController.abort();
    this.resizeObserver?.disconnect();
    this.releaseEntryLock();
    this.audio?.destroy?.();
    this.audio = null;
    this.world?.destroy();
    this.world = null;
    this.releaseRenderer();
    for (const callback of this.cleanupCallbacks) callback();
  }
}

const chamberRoot = document.querySelector("[data-chamber]");
if (chamberRoot) {
  const director = new ChamberDirector(chamberRoot);
  director.boot().catch((error) => {
    console.error("The Atlas chamber could not start.", error);
    director.activateFallback(error?.message || "Boot failed");
    director.audioSettled = true;
    director.audioReady = Boolean(director.audio?.available);
    director.commitReady();
    director.maybeEnableEntry();
    director.start();
  });
  chamberRoot.__atlasDirector = director;
}
