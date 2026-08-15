/**
 * Atlas Observation Chamber — audiovisual director v2.
 *
 * Public entry points:
 *   createAtlasAudio(root = document)
 *   [data-enter-sound] / [data-enter-silent] delegated button clicks
 *   [data-sound-toggle] persistent semantic toggle
 *   root[data-audio-request="on|off"] early-entry request latch
 *   atlas:audio-request { enabled: boolean, source?: string }
 *
 * Spatial event contract (document-level CustomEvents):
 *
 *   atlas:camera {
 *     journey: number,       // global normalized camera path, 0..1
 *     scene: string,
 *     localProgress: number, // normalized inside the current station, 0..1
 *     speed: number,         // rendered camera arc-length velocity
 *     acceleration: number,
 *     x: number,
 *     z: number,
 *     direction: number | "forward" | "backward"
 *   }
 *
 *   atlas:transition {
 *     from: string,
 *     to: string,
 *     direction: number | "forward" | "backward",
 *     phase: "depart" | "cross" | "arrive",
 *     transitionId: string
 *   }
 *
 *   atlas:interaction {
 *     kind: "state-detent" | "comparison-slide" | "axis-collet" | "archive-open",
 *     value?: string | number,
 *     pan?: number,
 *     interactionId: string
 *   }
 *
 * The authored score and room stems are original outputs of
 * tools/generate_chamber_audio.py. Web Audio synthesis is reserved for causal
 * mechanics and the immediate fallback while authored stems decode. Sound is
 * optional reinforcement only; no information is communicated by audio alone.
 */

const STORAGE_KEY = "atlas_sound_v1";
const LOOP_SECONDS = 56;
const AAC_GUARD_SECONDS = 1.024;
const ACTIVE_MASTER_LEVEL = 0.78;
const MAX_REMEMBERED_IDS = 160;
const instances = new WeakMap();

const SCENE_MIX = Object.freeze({
  origin: Object.freeze({ score: 0.78, room: 0.96, movement: 0.62 }),
  response: Object.freeze({ score: 0.94, room: 0.88, movement: 1.0 }),
  discriminate: Object.freeze({ score: 0.22, room: 1.06, movement: 0.42 }),
  association: Object.freeze({ score: 1.0, room: 0.84, movement: 0.82 }),
  reconstruct: Object.freeze({ score: 0.62, room: 0.96, movement: 0.72 }),
  archive: Object.freeze({ score: 0.9, room: 0.84, movement: 0.52 }),
});

const STATE_DETENTS = Object.freeze({
  low: Object.freeze({ frequencies: Object.freeze([146.83, 220]), duration: 0.105, level: 0.022 }),
  medium: Object.freeze({ frequencies: Object.freeze([220, 329.63]), duration: 0.09, level: 0.02 }),
  high: Object.freeze({ frequencies: Object.freeze([329.63, 493.88]), duration: 0.075, level: 0.017 }),
});

function clamp(value, minimum, maximum, fallback = minimum) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(maximum, Math.max(minimum, number)) : fallback;
}

function smoothstep(edge0, edge1, value) {
  const normalized = clamp((value - edge0) / Math.max(edge1 - edge0, 0.00001), 0, 1, 0);
  return normalized * normalized * (3 - 2 * normalized);
}

function persistedPreference(view) {
  try {
    const value = view.localStorage.getItem(STORAGE_KEY);
    return value === "1" || value === "true" || value === "on";
  } catch {
    return false;
  }
}

function storePreference(view, enabled) {
  try {
    view.localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  } catch {
    // Embedded/private contexts can deny storage without disabling sound.
  }
}

function noAudioApi() {
  return Object.freeze({
    available: false,
    get enabled() {
      return false;
    },
    enable: () => Promise.resolve(false),
    disable: () => false,
    pause: () => false,
    resume: () => Promise.resolve(false),
    destroy: () => {},
  });
}

function holdAndRamp(parameter, target, duration, time) {
  const start = Number.isFinite(parameter.value) ? parameter.value : 0;
  try {
    if (typeof parameter.cancelAndHoldAtTime === "function") parameter.cancelAndHoldAtTime(time);
    else {
      parameter.cancelScheduledValues(time);
      parameter.setValueAtTime(start, time);
    }
    parameter.linearRampToValueAtTime(target, time + Math.max(0.01, duration));
  } catch {
    parameter.value = target;
  }
}

function settleParameter(parameter, target, time, timeConstant = 0.16) {
  try {
    parameter.cancelScheduledValues(time);
    parameter.setTargetAtTime(target, time, Math.max(0.01, timeConstant));
  } catch {
    parameter.value = target;
  }
}

function disconnectLater(view, nodes, milliseconds) {
  view.setTimeout(() => {
    for (const node of nodes) {
      try {
        node.disconnect();
      } catch {
        // The graph may have been destroyed before a short cue completed.
      }
    }
  }, milliseconds);
}

function requestedDatasetState(root) {
  const value = String(root?.dataset?.audioRequest || "").toLowerCase();
  if (["on", "true", "1", "sound"].includes(value)) return true;
  if (["off", "false", "0", "silent"].includes(value)) return false;
  return null;
}

function normalizeDirection(value) {
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized === "backward" || normalized === "reverse" || normalized === "up") return -1;
    if (normalized === "forward" || normalized === "down") return 1;
  }
  return Number(value) < 0 ? -1 : 1;
}

function rememberId(set, value) {
  const id = String(value || "").trim();
  if (!id) return false;
  if (set.has(id)) return true;
  set.add(id);
  if (set.size > MAX_REMEMBERED_IDS) set.delete(set.values().next().value);
  return false;
}

export function createAtlasAudio(root = document) {
  if (!root || (typeof root !== "object" && typeof root !== "function")) return noAudioApi();
  if (instances.has(root)) return instances.get(root);

  const documentRoot = root.nodeType === 9 ? root : root.ownerDocument;
  const view = documentRoot?.defaultView;
  const stateHost = root.dataset ? root : documentRoot?.documentElement;
  const AudioContextClass = view?.AudioContext || view?.webkitAudioContext;
  const reducedMotion = view?.matchMedia?.("(prefers-reduced-motion: reduce)") || null;
  const coarsePointer = view?.matchMedia?.("(pointer: coarse)") || null;
  const entrySoundSelector = "[data-enter-sound]";
  const entrySilentSelector = "[data-enter-silent]";
  const soundToggleSelector = "[data-sound-toggle]";

  function allControls(selector) {
    const controls = [];
    if (root.matches?.(selector)) controls.push(root);
    root.querySelectorAll?.(selector).forEach((control) => controls.push(control));
    return controls;
  }

  function markUnavailable() {
    if (stateHost?.dataset) stateHost.dataset.audioState = "unavailable";
    for (const control of allControls(`${soundToggleSelector}, ${entrySoundSelector}`)) {
      control.setAttribute("aria-disabled", "true");
      if ("disabled" in control) control.disabled = true;
      if (control.matches(soundToggleSelector)) control.setAttribute("aria-pressed", "false");
    }
  }

  if (!documentRoot || !view || !AudioContextClass) {
    markUnavailable();
    const unavailable = noAudioApi();
    instances.set(root, unavailable);
    return unavailable;
  }

  const datasetRequest = requestedDatasetState(stateHost);
  let desiredEnabled = datasetRequest ?? persistedPreference(view);
  let graph = null;
  let authoredLoad = null;
  let authoredReady = false;
  let destroyed = false;
  let manuallyPaused = false;
  let unlockArmed = false;
  let suspendTimer = 0;
  let lifecycleRevision = 0;
  let currentScene = "origin";
  let currentLocalProgress = 0;
  let movementActive = false;
  let lastTransitionCueTime = -Infinity;
  let lastFallbackInteractionTime = -Infinity;
  const interactionIds = new Set();
  const transitionIds = new Set();
  const abortController = new AbortController();

  const isMobileMix = () => Boolean(coarsePointer?.matches || view.innerWidth < 760);
  const visible = () => documentRoot.visibilityState !== "hidden";

  function syncControls() {
    if (stateHost?.dataset) {
      stateHost.dataset.audioState = desiredEnabled
        ? (authoredReady ? "on" : graph ? "loading" : "armed")
        : "off";
    }
    for (const toggle of allControls(soundToggleSelector)) {
      const label = toggle.querySelector?.("[data-sound-label]");
      if (label) {
        if (!label.dataset.soundEnableLabel) {
          label.dataset.soundEnableLabel = label.textContent.trim() || "Enable sound";
        }
        label.textContent = desiredEnabled
          ? (label.dataset.soundDisableLabel || "Disable sound")
          : label.dataset.soundEnableLabel;
      }
      toggle.setAttribute("aria-pressed", String(desiredEnabled));
      toggle.removeAttribute("aria-disabled");
      if ("disabled" in toggle) toggle.disabled = false;
      if (toggle.matches("button") && !toggle.hasAttribute("type")) toggle.type = "button";
    }
  }

  function periodicNoiseBuffer(context, seconds = 2) {
    const length = Math.floor(context.sampleRate * seconds);
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const samples = buffer.getChannelData(0);
    let seed = 0x71a57;
    for (let index = 0; index < length; index += 1) {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      samples[index] = ((seed >>> 0) / 0xffffffff) * 2 - 1;
    }
    const crossfade = Math.min(2048, Math.floor(length * 0.08));
    for (let index = 0; index < crossfade; index += 1) {
      const mix = index / Math.max(crossfade - 1, 1);
      const tail = length - crossfade + index;
      samples[tail] = samples[tail] * (1 - mix) + samples[index] * mix;
    }
    return buffer;
  }

  function buildGraph() {
    if (graph || destroyed) return graph;
    let context;
    try {
      context = new AudioContextClass({ latencyHint: "interactive" });
    } catch {
      try {
        context = new AudioContextClass();
      } catch {
        return null;
      }
    }

    try {
      const master = context.createGain();
      const limiter = context.createDynamicsCompressor();
      const mix = context.createGain();
      const scoreBus = context.createGain();
      const roomBus = context.createGain();
      const movementBus = context.createGain();
      const cueBus = context.createGain();
      const synthRoomBus = context.createGain();
      const scoreStemGate = context.createGain();
      const roomStemGate = context.createGain();

      master.gain.value = 0;
      mix.gain.value = 0.88;
      scoreBus.gain.value = SCENE_MIX.origin.score;
      roomBus.gain.value = SCENE_MIX.origin.room;
      movementBus.gain.value = SCENE_MIX.origin.movement;
      cueBus.gain.value = isMobileMix() ? 0.58 : 0.68;
      synthRoomBus.gain.value = 0.72;
      scoreStemGate.gain.value = 0;
      roomStemGate.gain.value = 0;
      limiter.threshold.value = -12;
      limiter.knee.value = 5;
      limiter.ratio.value = 10;
      limiter.attack.value = 0.003;
      limiter.release.value = 0.22;

      scoreStemGate.connect(scoreBus);
      roomStemGate.connect(roomBus);
      scoreBus.connect(mix);
      roomBus.connect(mix);
      movementBus.connect(mix);
      cueBus.connect(mix);
      synthRoomBus.connect(mix);
      mix.connect(limiter);
      limiter.connect(master);
      master.connect(context.destination);

      const noise = periodicNoiseBuffer(context);
      const persistent = [];

      // Immediate, low-bandwidth room fallback while the authored stems decode.
      const humFilter = context.createBiquadFilter();
      const humGain = context.createGain();
      humFilter.type = "lowpass";
      humFilter.frequency.value = 330;
      humGain.gain.value = 0.009;
      humFilter.connect(humGain);
      humGain.connect(synthRoomBus);
      for (const [frequency, level] of [[60, 0.76], [120, 0.18]]) {
        const oscillator = context.createOscillator();
        const voiceGain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        voiceGain.gain.value = level;
        oscillator.connect(voiceGain);
        voiceGain.connect(humFilter);
        oscillator.start();
        persistent.push(oscillator, voiceGain);
      }

      const fallbackNoise = context.createBufferSource();
      const fallbackHighpass = context.createBiquadFilter();
      const fallbackLowpass = context.createBiquadFilter();
      const fallbackGain = context.createGain();
      fallbackNoise.buffer = noise;
      fallbackNoise.loop = true;
      fallbackHighpass.type = "highpass";
      fallbackHighpass.frequency.value = 110;
      fallbackLowpass.type = "lowpass";
      fallbackLowpass.frequency.value = 2400;
      fallbackGain.gain.value = 0.00125;
      fallbackNoise.connect(fallbackHighpass);
      fallbackHighpass.connect(fallbackLowpass);
      fallbackLowpass.connect(fallbackGain);
      fallbackGain.connect(synthRoomBus);
      fallbackNoise.start();
      persistent.push(fallbackNoise, fallbackHighpass, fallbackLowpass, fallbackGain, humFilter, humGain);

      // Optical transport: only audible while the rendered camera moves.
      const movementSource = context.createBufferSource();
      const movementHighpass = context.createBiquadFilter();
      const movementFilter = context.createBiquadFilter();
      const movementGain = context.createGain();
      const movementPanner = typeof context.createStereoPanner === "function"
        ? context.createStereoPanner()
        : null;
      movementSource.buffer = noise;
      movementSource.loop = true;
      movementHighpass.type = "highpass";
      movementHighpass.frequency.value = 480;
      movementFilter.type = "bandpass";
      movementFilter.frequency.value = 860;
      movementFilter.Q.value = 0.72;
      movementGain.gain.value = 0;
      movementSource.connect(movementHighpass);
      movementHighpass.connect(movementFilter);
      movementFilter.connect(movementGain);
      if (movementPanner) {
        movementGain.connect(movementPanner);
        movementPanner.connect(movementBus);
      } else {
        movementGain.connect(movementBus);
      }
      movementSource.start();
      persistent.push(
        movementSource,
        movementHighpass,
        movementFilter,
        movementGain,
        ...(movementPanner ? [movementPanner] : []),
      );

      graph = {
        context,
        master,
        scoreBus,
        roomBus,
        movementBus,
        cueBus,
        synthRoomBus,
        scoreStemGate,
        roomStemGate,
        movementFilter,
        movementGain,
        movementPanner,
        noise,
        persistent,
        stemSources: [],
      };
      context.addEventListener?.("statechange", handleContextState);
      applySceneMix(currentScene, currentLocalProgress, true);
      return graph;
    } catch {
      try {
        context.close()?.catch?.(() => {});
      } catch {
        // A partially constructed context can fail to close on older WebKit.
      }
      return null;
    }
  }

  function createStereoStage(destination, pan = 0) {
    const { context } = graph;
    const gain = context.createGain();
    const panner = typeof context.createStereoPanner === "function" ? context.createStereoPanner() : null;
    const panLimit = isMobileMix() ? 0.18 : 0.3;
    if (panner) {
      panner.pan.value = clamp(pan, -panLimit, panLimit, 0);
      gain.connect(panner);
      panner.connect(destination);
    } else {
      gain.connect(destination);
    }
    return { gain, panner, nodes: panner ? [gain, panner] : [gain] };
  }

  function playFixedPartial({ frequency, at, duration, level, pan = 0, type = "sine" }) {
    if (!graph) return;
    const { context, cueBus } = graph;
    const oscillator = context.createOscillator();
    const stage = createStereoStage(cueBus, pan);
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, at);
    stage.gain.gain.setValueAtTime(0.0001, at);
    stage.gain.gain.linearRampToValueAtTime(level, at + 0.0025);
    stage.gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    oscillator.connect(stage.gain);
    oscillator.start(at);
    oscillator.stop(at + duration + 0.02);
    disconnectLater(view, [oscillator, ...stage.nodes], (duration + 0.14) * 1000);
  }

  function playNoiseClick({ at, duration, level, frequency, q = 0.9, pan = 0 }) {
    if (!graph) return;
    const { context, cueBus, noise } = graph;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const stage = createStereoStage(cueBus, pan);
    source.buffer = noise;
    filter.type = "bandpass";
    filter.frequency.value = frequency;
    filter.Q.value = q;
    stage.gain.gain.setValueAtTime(0.0001, at);
    stage.gain.gain.linearRampToValueAtTime(level, at + 0.0018);
    stage.gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    source.connect(filter);
    filter.connect(stage.gain);
    source.start(at, (at * 0.613) % 1.6, duration + 0.02);
    source.stop(at + duration + 0.03);
    disconnectLater(view, [source, filter, ...stage.nodes], (duration + 0.14) * 1000);
  }

  function playRelay(level = 0.018, pan = 0) {
    if (!graph) return;
    const at = graph.context.currentTime + 0.004;
    playNoiseClick({ at, duration: 0.036, level: level * 1.65, frequency: 980, q: 0.82, pan });
    playFixedPartial({ frequency: 110, at, duration: 0.055, level, type: "triangle", pan });
  }

  function playStateDetent(value, pan = 0) {
    if (!graph) return;
    const state = String(value || "medium").toLowerCase();
    const specification = STATE_DETENTS[state] || STATE_DETENTS.medium;
    const at = graph.context.currentTime + 0.004;
    specification.frequencies.forEach((frequency, index) => {
      playFixedPartial({
        frequency,
        at: at + index * 0.003,
        duration: specification.duration,
        level: specification.level * (index ? 0.52 : 1),
        type: index ? "sine" : "triangle",
        pan,
      });
    });
    playNoiseClick({
      at,
      duration: 0.024,
      level: specification.level * 0.76,
      frequency: 1740,
      q: 1.35,
      pan,
    });
  }

  function playComparisonSlide(pan = 0, intensity = 1) {
    if (!graph) return;
    const at = graph.context.currentTime + 0.004;
    const level = 0.016 * intensity;
    playNoiseClick({ at, duration: 0.052, level: level * 1.5, frequency: 1240, q: 0.72, pan });
    playFixedPartial({ frequency: 440, at, duration: 0.075, level, type: "triangle", pan });
    playNoiseClick({ at: at + 0.052, duration: 0.032, level, frequency: 1960, q: 1.2, pan });
  }

  function playAxisCollet(pan = 0, intensity = 1) {
    if (!graph) return;
    const at = graph.context.currentTime + 0.004;
    const level = 0.014 * intensity;
    playNoiseClick({ at, duration: 0.026, level: level * 1.8, frequency: 760, q: 0.9, pan });
    playNoiseClick({ at: at + 0.036, duration: 0.032, level: level * 1.25, frequency: 1520, q: 1.1, pan });
    playFixedPartial({ frequency: 220, at, duration: 0.092, level: level * 0.72, type: "triangle", pan });
  }

  function playGlassRelease(pan = 0, intensity = 1) {
    if (!graph) return;
    const at = graph.context.currentTime + 0.004;
    const level = 0.009 * intensity;
    playNoiseClick({ at, duration: 0.025, level: level * 1.55, frequency: 2460, q: 2.1, pan });
    playFixedPartial({ frequency: 659.26, at, duration: 0.22, level, pan });
    playFixedPartial({ frequency: 987.77, at: at + 0.006, duration: 0.17, level: level * 0.58, pan });
  }

  function playArchiveOpen(pan = 0, intensity = 1) {
    if (!graph) return;
    const at = graph.context.currentTime + 0.005;
    const level = 0.008 * intensity;
    playNoiseClick({ at, duration: 0.045, level: level * 1.8, frequency: 1120, q: 0.7, pan });
    playFixedPartial({ frequency: 329.63, at, duration: 0.28, level, pan });
    playFixedPartial({ frequency: 493.88, at: at + 0.018, duration: 0.24, level: level * 0.62, pan });
    playFixedPartial({ frequency: 740, at: at + 0.034, duration: 0.18, level: level * 0.34, pan });
  }

  function playTransitionCue(from, to, direction) {
    if (!graph) return;
    const pan = normalizeDirection(direction) * (isMobileMix() ? 0.08 : 0.14);
    const intensity = reducedMotion?.matches ? 0.62 : 0.86;
    const key = `${from}->${to}`;
    if (key.includes("origin") && key.includes("response")) {
      playRelay(0.015 * intensity, pan);
    } else if (key.includes("response") && key.includes("discriminate")) {
      playComparisonSlide(pan, intensity);
    } else if (key.includes("discriminate") && key.includes("association")) {
      playAxisCollet(pan, intensity);
    } else if (key.includes("association") && key.includes("reconstruct")) {
      playGlassRelease(pan, intensity);
    } else if (key.includes("reconstruct") && key.includes("archive")) {
      playArchiveOpen(pan, intensity * 0.86);
    } else {
      playRelay(0.012 * intensity, pan);
    }
  }

  function codecCandidates(name) {
    const probe = documentRoot.createElement("audio");
    const opus = new URL(`./audio/atlas-${name}.opus`, import.meta.url).href;
    const m4a = new URL(`./audio/atlas-${name}.m4a`, import.meta.url).href;
    const supportsOpus = Boolean(probe.canPlayType?.('audio/ogg; codecs="opus"'));
    return supportsOpus ? [opus, m4a] : [m4a, opus];
  }

  async function decodeStem(name) {
    if (!graph) return null;
    for (const url of codecCandidates(name)) {
      try {
        const response = await fetch(url, {
          credentials: "same-origin",
          signal: abortController.signal,
        });
        if (!response.ok) continue;
        const bytes = await response.arrayBuffer();
        const buffer = await graph.context.decodeAudioData(bytes.slice(0));
        if (buffer?.duration > LOOP_SECONDS - 0.25) return buffer;
      } catch (error) {
        if (error?.name === "AbortError") return null;
      }
    }
    return null;
  }

  function startStem(buffer, gate, startAt) {
    const source = graph.context.createBufferSource();
    const hasCodecGuard = buffer.duration >= LOOP_SECONDS + AAC_GUARD_SECONDS * 1.75;
    const loopStart = hasCodecGuard ? AAC_GUARD_SECONDS : 0;
    source.buffer = buffer;
    source.loop = true;
    source.loopStart = loopStart;
    source.loopEnd = Math.min(loopStart + LOOP_SECONDS, buffer.duration);
    source.connect(gate);
    source.start(startAt, loopStart);
    graph.stemSources.push(source);
  }

  async function loadAuthoredStems() {
    if (authoredLoad) return authoredLoad;
    authoredLoad = (async () => {
      const scorePromise = decodeStem("score");
      const roomPromise = decodeStem("room");
      const [score, room] = await Promise.all([scorePromise, roomPromise]);
      if (destroyed || !graph || (!score && !room)) {
        if (desiredEnabled && !destroyed) {
          authoredReady = true;
          if (stateHost?.dataset) stateHost.dataset.audioMode = "synth-fallback";
          syncControls();
        }
        return false;
      }

      const startAt = graph.context.currentTime + 0.06;
      if (score) startStem(score, graph.scoreStemGate, startAt);
      if (room) startStem(room, graph.roomStemGate, startAt);
      const time = graph.context.currentTime;
      if (score) holdAndRamp(graph.scoreStemGate.gain, 1, 1.25, time);
      if (room) holdAndRamp(graph.roomStemGate.gain, 1, 1.25, time);
      holdAndRamp(graph.synthRoomBus.gain, room ? 0 : 0.54, 1.35, time);
      authoredReady = true;
      if (stateHost?.dataset) stateHost.dataset.audioMode = room ? "authored-stereo" : "authored-score-only";
      syncControls();
      return true;
    })();
    return authoredLoad;
  }

  function applySceneMix(scene, localProgress = 0, immediate = false) {
    if (!graph) return;
    const normalizedScene = SCENE_MIX[scene] ? scene : "origin";
    const base = SCENE_MIX[normalizedScene];
    let score = base.score;
    let movement = base.movement;
    if (normalizedScene === "archive") {
      const release = smoothstep(0.62, 0.9, localProgress);
      score *= 1 - release * 0.84;
      movement *= 1 - release * 0.72;
    }
    if (isMobileMix()) {
      score *= 0.88;
      movement *= 0.62;
    }
    const time = graph.context.currentTime;
    const constant = immediate ? 0.01 : 0.18;
    settleParameter(graph.scoreBus.gain, score, time, constant);
    settleParameter(graph.roomBus.gain, base.room, time, constant);
    settleParameter(graph.movementBus.gain, movement, time, constant);
  }

  function handleCamera(event) {
    const detail = event.detail && typeof event.detail === "object" ? event.detail : {};
    const nextScene = String(detail.scene || currentScene).toLowerCase();
    if (SCENE_MIX[nextScene]) currentScene = nextScene;
    currentLocalProgress = clamp(detail.localProgress, 0, 1, currentLocalProgress);
    applySceneMix(currentScene, currentLocalProgress);
    if (!graph) return;

    const time = graph.context.currentTime;
    if (reducedMotion?.matches) {
      movementActive = false;
      settleParameter(graph.movementGain.gain, 0, time, 0.045);
      return;
    }

    const speed = Math.abs(Number(detail.speed)) || 0;
    if (movementActive && speed < 0.008) movementActive = false;
    else if (!movementActive && speed > 0.015) movementActive = true;
    const energy = movementActive ? smoothstep(0.015, 0.28, speed) : 0;
    const acceleration = clamp(Math.abs(Number(detail.acceleration)), 0, 1, 0);
    const targetGain = energy * (isMobileMix() ? 0.0032 : 0.0048);
    const timeConstant = targetGain > graph.movementGain.gain.value ? 0.075 : 0.32;
    settleParameter(graph.movementGain.gain, targetGain, time, timeConstant);
    settleParameter(graph.movementFilter.frequency, 760 + energy * 1420 + acceleration * 260, time, 0.1);
    if (graph.movementPanner) {
      const panLimit = isMobileMix() ? 0.16 : 0.28;
      settleParameter(graph.movementPanner.pan, clamp(Number(detail.x) / 4, -panLimit, panLimit, 0), time, 0.14);
    }
  }

  function handleTransition(event) {
    const detail = event.detail && typeof event.detail === "object" ? event.detail : {};
    const phase = String(detail.phase || "").toLowerCase();
    const transitionId = String(detail.transitionId || "").trim();
    if (transitionId && rememberId(transitionIds, `${transitionId}:${phase}`)) return;
    if (phase !== "cross" || !graph || !desiredEnabled || manuallyPaused || !visible()) return;
    const time = graph.context.currentTime;
    if (time - lastTransitionCueTime < 0.9) return;
    lastTransitionCueTime = time;
    playTransitionCue(String(detail.from || ""), String(detail.to || ""), detail.direction);
  }

  function handleInteraction(event) {
    const detail = event.detail && typeof event.detail === "object" ? event.detail : {};
    if (!graph || !desiredEnabled || manuallyPaused || !visible() || graph.context.state !== "running") return;
    const interactionId = String(detail.interactionId || "").trim();
    if (interactionId) {
      if (rememberId(interactionIds, interactionId)) return;
    } else {
      const time = graph.context.currentTime;
      if (time - lastFallbackInteractionTime < 0.12) return;
      lastFallbackInteractionTime = time;
    }

    const kind = String(detail.kind || "").toLowerCase();
    const pan = clamp(detail.pan, -0.3, 0.3, 0);
    if (kind === "state-detent") playStateDetent(detail.value, pan);
    else if (kind === "comparison-slide") playComparisonSlide(pan);
    else if (kind === "axis-collet") playAxisCollet(pan);
    else if (kind === "archive-open") playArchiveOpen(pan);
  }

  function disarmUnlock() {
    if (!unlockArmed) return;
    unlockArmed = false;
    documentRoot.removeEventListener("pointerdown", handleUnlockGesture, true);
    documentRoot.removeEventListener("keydown", handleUnlockGesture, true);
  }

  function handleUnlockGesture(event) {
    if (event.target?.closest?.(entrySilentSelector)) return;
    disarmUnlock();
    void makeAudible();
  }

  function armUnlock() {
    if (unlockArmed || destroyed || !desiredEnabled) return;
    unlockArmed = true;
    documentRoot.addEventListener("pointerdown", handleUnlockGesture, true);
    documentRoot.addEventListener("keydown", handleUnlockGesture, true);
  }

  function quietAndSuspend(fade = 0.24) {
    lifecycleRevision += 1;
    const revision = lifecycleRevision;
    view.clearTimeout(suspendTimer);
    suspendTimer = 0;
    if (!graph) return;
    holdAndRamp(graph.master.gain, 0, fade, graph.context.currentTime);
    suspendTimer = view.setTimeout(() => {
      suspendTimer = 0;
      if (destroyed || revision !== lifecycleRevision || !graph || graph.context.state !== "running") return;
      try {
        graph.context.suspend()?.catch?.(() => {});
      } catch {
        // The browser may already have suspended the context.
      }
    }, Math.ceil((fade + 0.05) * 1000));
  }

  async function makeAudible({ entryCue = false } = {}) {
    if (destroyed || !desiredEnabled || manuallyPaused || !visible()) return false;
    let audioGraph;
    try {
      audioGraph = buildGraph();
    } catch {
      audioGraph = null;
    }
    if (!audioGraph) {
      desiredEnabled = false;
      markUnavailable();
      return false;
    }

    lifecycleRevision += 1;
    view.clearTimeout(suspendTimer);
    suspendTimer = 0;
    try {
      if (audioGraph.context.state !== "running") await audioGraph.context.resume();
    } catch {
      armUnlock();
      return false;
    }
    if (audioGraph.context.state !== "running") {
      armUnlock();
      return false;
    }

    const time = audioGraph.context.currentTime;
    // The first relay must read as immediate feedback to the opt-in gesture;
    // later lifecycle restores retain the slower, room-like fade.
    holdAndRamp(audioGraph.master.gain, ACTIVE_MASTER_LEVEL, entryCue ? 0.12 : 0.72, time);
    if (entryCue) playRelay(0.015, 0);
    syncControls();
    void loadAuthoredStems();
    return true;
  }

  async function enable({ persist = true, entryCue = false } = {}) {
    if (destroyed) return false;
    const wasEnabled = desiredEnabled;
    desiredEnabled = true;
    manuallyPaused = false;
    if (stateHost?.dataset) stateHost.dataset.audioRequest = "on";
    if (persist) storePreference(view, true);
    syncControls();
    disarmUnlock();
    const started = await makeAudible({ entryCue: entryCue && !wasEnabled });
    if (!started && desiredEnabled) armUnlock();
    return started;
  }

  function disable({ persist = true } = {}) {
    if (destroyed) return false;
    desiredEnabled = false;
    if (stateHost?.dataset) stateHost.dataset.audioRequest = "off";
    if (persist) storePreference(view, false);
    disarmUnlock();
    syncControls();
    quietAndSuspend(0.28);
    return true;
  }

  function pause() {
    if (destroyed) return false;
    manuallyPaused = true;
    disarmUnlock();
    quietAndSuspend(0.18);
    return true;
  }

  async function resume() {
    if (destroyed) return false;
    manuallyPaused = false;
    if (!desiredEnabled) return false;
    const started = await makeAudible();
    if (!started) armUnlock();
    return started;
  }

  function handleDelegatedClick(event) {
    const soundEntry = event.target?.closest?.(entrySoundSelector);
    if (soundEntry && root.contains?.(soundEntry)) {
      if (stateHost?.dataset) stateHost.dataset.audioRequest = "on";
      void enable({ entryCue: true });
      return;
    }
    const silentEntry = event.target?.closest?.(entrySilentSelector);
    if (silentEntry && root.contains?.(silentEntry)) {
      if (stateHost?.dataset) stateHost.dataset.audioRequest = "off";
      disable();
      return;
    }
    const toggle = event.target?.closest?.(soundToggleSelector);
    if (toggle && root.contains?.(toggle)) {
      if (desiredEnabled) disable();
      else void enable({ entryCue: true });
    }
  }

  function handleAudioRequest(event) {
    const detail = event.detail && typeof event.detail === "object" ? event.detail : {};
    if (typeof detail.enabled !== "boolean") return;
    if (stateHost?.dataset) stateHost.dataset.audioRequest = detail.enabled ? "on" : "off";
    if (detail.enabled) void enable({ entryCue: detail.source === "entry" });
    else disable();
  }

  function handleContextState() {
    if (!graph || destroyed) return;
    const needsGesture = graph.context.state === "interrupted" || (
      graph.context.state === "suspended" && desiredEnabled && !manuallyPaused && visible()
    );
    if (needsGesture) armUnlock();
  }

  function handleVisibility() {
    if (!visible()) quietAndSuspend(0.16);
    else if (desiredEnabled && !manuallyPaused) void resume();
  }

  function handlePageHide() {
    quietAndSuspend(0.08);
  }

  function handlePageShow() {
    if (desiredEnabled && !manuallyPaused && visible()) void resume();
  }

  function handleReducedMotion() {
    if (!graph) return;
    if (reducedMotion?.matches) {
      movementActive = false;
      settleParameter(graph.movementGain.gain, 0, graph.context.currentTime, 0.045);
    }
    applySceneMix(currentScene, currentLocalProgress);
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    lifecycleRevision += 1;
    disarmUnlock();
    abortController.abort();
    view.clearTimeout(suspendTimer);
    documentRoot.removeEventListener("click", handleDelegatedClick, true);
    documentRoot.removeEventListener("atlas:audio-request", handleAudioRequest);
    documentRoot.removeEventListener("atlas:camera", handleCamera);
    documentRoot.removeEventListener("atlas:transition", handleTransition);
    documentRoot.removeEventListener("atlas:interaction", handleInteraction);
    documentRoot.removeEventListener("visibilitychange", handleVisibility);
    view.removeEventListener("pagehide", handlePageHide);
    view.removeEventListener("pageshow", handlePageShow);
    if (reducedMotion?.removeEventListener) reducedMotion.removeEventListener("change", handleReducedMotion);
    else reducedMotion?.removeListener?.(handleReducedMotion);
    if (coarsePointer?.removeEventListener) coarsePointer.removeEventListener("change", handleReducedMotion);
    else coarsePointer?.removeListener?.(handleReducedMotion);

    if (graph) {
      graph.context.removeEventListener?.("statechange", handleContextState);
      for (const source of graph.stemSources) {
        try {
          source.stop();
        } catch {
          // A source can already be stopped by context teardown.
        }
      }
      for (const node of graph.persistent) {
        try {
          node.stop?.();
        } catch {
          // Only source nodes expose stop().
        }
        try {
          node.disconnect();
        } catch {
          // Safe for a partially built graph.
        }
      }
      try {
        graph.context.close()?.catch?.(() => {});
      } catch {
        // Context can already be closed by the browser lifecycle.
      }
      graph = null;
    }
    instances.delete(root);
  }

  documentRoot.addEventListener("click", handleDelegatedClick, true);
  documentRoot.addEventListener("atlas:audio-request", handleAudioRequest);
  documentRoot.addEventListener("atlas:camera", handleCamera);
  documentRoot.addEventListener("atlas:transition", handleTransition);
  documentRoot.addEventListener("atlas:interaction", handleInteraction);
  documentRoot.addEventListener("visibilitychange", handleVisibility);
  view.addEventListener("pagehide", handlePageHide);
  view.addEventListener("pageshow", handlePageShow);
  if (reducedMotion?.addEventListener) reducedMotion.addEventListener("change", handleReducedMotion);
  else reducedMotion?.addListener?.(handleReducedMotion);
  if (coarsePointer?.addEventListener) coarsePointer.addEventListener("change", handleReducedMotion);
  else coarsePointer?.addListener?.(handleReducedMotion);

  syncControls();
  if (desiredEnabled) armUnlock();

  const api = Object.freeze({
    available: true,
    get enabled() {
      return desiredEnabled;
    },
    enable,
    disable,
    pause,
    resume,
    destroy,
  });
  instances.set(root, api);
  return api;
}
