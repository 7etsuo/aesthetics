/**
 * Atlas Observation Chamber — licensed-score audiovisual director.
 *
 * Public entry points:
 *   createAtlasAudio(root = document)
 *   [data-enter] delegated entry action (with [data-enter-sound] transition alias)
 *   [data-sound-toggle] persistent semantic toggle
 *   root[data-audio-request="on|off"] early-entry request latch
 *   atlas:audio-request { enabled: boolean, source?: "entry" | string }
 *
 * Canonical document-level CustomEvents:
 *
 *   atlas:camera {
 *     journey: number,
 *     scene: string,
 *     localProgress: number,
 *     speed: number,
 *     acceleration: number,
 *     x: number,
 *     z: number,
 *     direction: number | "forward" | "backward",
 *     probeActive: boolean,
 *     probeSpeed: number,   // CSS px/s
 *     probeX: number,       // normalized device coordinate, -1..1
 *     probeY: number,       // normalized device coordinate, -1..1, +Y up
 *     probeSurface: string
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
 *     kind: "state-detent" | "comparison-slide" | "axis-collet" | "archive-open" | "optical-hover",
 *     id?: string,          // stable acquisition id for optical-hover
 *     value?: string | number,
 *     pan?: number,
 *     interactionId: string
 *   }
 *
 * Music is streamed only after explicit consent; it is never scrubbed, looped,
 * pitch-shifted, or restarted by camera motion. Detail-field aliases are
 * accepted defensively, but only the canonical event family is consumed so a
 * legacy mirror cannot produce duplicate sound. Sound reinforces visible state
 * only and is never required to use the experience.
 *
 * Music: "Signal to Noise" by Scott Buckley, CC BY 4.0. See audio/CREDITS.md.
 */

const STORAGE_KEY = "atlas_sound_v1";
const ROOM_LOOP_SECONDS = 56;
const AAC_GUARD_SECONDS = 1.024;
const ACTIVE_MASTER_LEVEL = 0.78;
const DESKTOP_MUSIC_LEVEL = 0.32;
const MOBILE_MUSIC_LEVEL = 0.26;
const PROBE_HOVER_COOLDOWN_SECONDS = 0.18;
const PROBE_SPEED_SCALE = 900;
const MAX_REMEMBERED_IDS = 160;
const instances = new WeakMap();

const SCENE_MIX = Object.freeze({
  origin: Object.freeze({ score: 0.72, room: 0.82, movement: 0.3 }),
  response: Object.freeze({ score: 0.92, room: 0.74, movement: 0.65 }),
  discriminate: Object.freeze({ score: 0.55, room: 0.86, movement: 0.3 }),
  association: Object.freeze({ score: 1.0, room: 0.72, movement: 0.55 }),
  reconstruct: Object.freeze({ score: 0.76, room: 0.78, movement: 0.45 }),
  archive: Object.freeze({ score: 0.68, room: 0.8, movement: 0.3 }),
});

const STATE_DETENTS = Object.freeze({
  low: Object.freeze({ frequencies: Object.freeze([146.83, 220]), duration: 0.105, level: 0.018 }),
  medium: Object.freeze({ frequencies: Object.freeze([220, 329.63]), duration: 0.09, level: 0.017 }),
  high: Object.freeze({ frequencies: Object.freeze([329.63, 493.88]), duration: 0.075, level: 0.014 }),
});

function clamp(value, minimum, maximum, fallback = minimum) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(maximum, Math.max(minimum, number)) : fallback;
}

function smoothstep(edge0, edge1, value) {
  const normalized = clamp((value - edge0) / Math.max(edge1 - edge0, 0.00001), 0, 1, 0);
  return normalized * normalized * (3 - 2 * normalized);
}

function decibelsToGain(decibels) {
  return 10 ** (decibels / 20);
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
    // Embedded and private contexts can deny storage without disabling sound.
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
        // The graph may have been destroyed before the cue completed.
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
    if (["backward", "reverse", "up"].includes(normalized)) return -1;
    if (["forward", "down"].includes(normalized)) return 1;
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

function eventDetail(event) {
  return event?.detail && typeof event.detail === "object" ? event.detail : {};
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
  const entrySelector = "[data-enter], [data-enter-sound]";
  const soundToggleSelector = "[data-sound-toggle]";

  function allControls(selector) {
    const controls = [];
    if (root.matches?.(selector)) controls.push(root);
    root.querySelectorAll?.(selector).forEach((control) => controls.push(control));
    return controls;
  }

  function rootContains(node) {
    return root === documentRoot || Boolean(root.contains?.(node));
  }

  function markUnavailable() {
    if (stateHost?.dataset) stateHost.dataset.audioState = "unavailable";
    for (const control of allControls(soundToggleSelector)) {
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
  const entryGate = root.matches?.("[data-chamber-entry]")
    ? root
    : root.querySelector?.("[data-chamber-entry]");
  let desiredEnabled = datasetRequest ?? persistedPreference(view);
  let entryConsentGranted = !entryGate
    || ["dismissing", "dismissed"].includes(String(entryGate.dataset.entryState || ""));
  let graph = null;
  let roomLoad = null;
  let roomReady = false;
  let musicPlaying = false;
  let musicEnded = false;
  let musicRequested = false;
  let musicPlayPromise = null;
  let destroyed = false;
  let manuallyPaused = false;
  let unlockArmed = false;
  let suspendTimer = 0;
  let lifecycleRevision = 0;
  let currentScene = "origin";
  let currentLocalProgress = 0;
  let movementActive = false;
  let movementSuppressedUntil = 0;
  let probeActive = false;
  let lastTransitionCueTime = -Infinity;
  let lastFallbackInteractionTime = -Infinity;
  let lastHoverCueTime = -Infinity;
  const interactionIds = new Set();
  const hoverIds = new Set();
  const transitionIds = new Set();
  const abortController = new AbortController();

  const isMobileMix = () => Boolean(coarsePointer?.matches || view.innerWidth < 760);
  const musicTarget = () => (isMobileMix() ? MOBILE_MUSIC_LEVEL : DESKTOP_MUSIC_LEVEL);
  const visible = () => documentRoot.visibilityState !== "hidden";

  function setAudioMode(mode) {
    if (stateHost?.dataset) stateHost.dataset.audioMode = mode;
  }

  function syncControls() {
    const ready = roomReady || musicPlaying || musicEnded;
    if (stateHost?.dataset) {
      stateHost.dataset.audioState = desiredEnabled
        ? (ready ? "on" : graph ? "loading" : "armed")
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

  function musicCandidates() {
    const probe = documentRoot.createElement("audio");
    const opus = {
      url: new URL("./audio/signal-to-noise.opus", import.meta.url).href,
      type: 'audio/ogg; codecs="opus"',
    };
    const aac = {
      url: new URL("./audio/signal-to-noise.m4a", import.meta.url).href,
      type: 'audio/mp4; codecs="mp4a.40.2"',
    };
    const preferred = probe.canPlayType?.(opus.type) ? [opus, aac] : [aac, opus];
    return preferred;
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
      const probeBus = context.createGain();
      const cueBus = context.createGain();
      const synthRoomBus = context.createGain();
      const musicGate = context.createGain();
      const scoreDucker = context.createGain();
      const roomStemGate = context.createGain();

      master.gain.value = 0;
      mix.gain.value = 0.9;
      scoreBus.gain.value = SCENE_MIX.origin.score;
      roomBus.gain.value = SCENE_MIX.origin.room;
      movementBus.gain.value = SCENE_MIX.origin.movement;
      probeBus.gain.value = isMobileMix() ? 0.78 : 1;
      cueBus.gain.value = isMobileMix() ? 0.52 : 0.62;
      synthRoomBus.gain.value = 0.5;
      musicGate.gain.value = 0;
      scoreDucker.gain.value = 1;
      roomStemGate.gain.value = 0;
      limiter.threshold.value = -12;
      limiter.knee.value = 5;
      limiter.ratio.value = 10;
      limiter.attack.value = 0.003;
      limiter.release.value = 0.22;

      musicGate.connect(scoreDucker);
      scoreDucker.connect(scoreBus);
      roomStemGate.connect(roomBus);
      scoreBus.connect(mix);
      roomBus.connect(mix);
      movementBus.connect(mix);
      probeBus.connect(mix);
      cueBus.connect(mix);
      synthRoomBus.connect(mix);
      mix.connect(limiter);
      limiter.connect(master);
      master.connect(context.destination);

      const music = documentRoot.createElement("audio");
      music.preload = "none";
      music.loop = false;
      music.autoplay = false;
      music.playsInline = true;
      music.setAttribute("playsinline", "");
      const mediaSource = context.createMediaElementSource(music);
      mediaSource.connect(musicGate);

      const noise = periodicNoiseBuffer(context);
      const persistent = [];

      // An immediate, restrained chamber tone covers the short room-stem load.
      const humFilter = context.createBiquadFilter();
      const humGain = context.createGain();
      humFilter.type = "lowpass";
      humFilter.frequency.value = 300;
      humGain.gain.value = 0.0055;
      humFilter.connect(humGain);
      humGain.connect(synthRoomBus);
      for (const [frequency, level] of [[60, 0.72], [120, 0.14]]) {
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
      fallbackHighpass.frequency.value = 140;
      fallbackLowpass.type = "lowpass";
      fallbackLowpass.frequency.value = 2100;
      fallbackGain.gain.value = 0.00055;
      fallbackNoise.connect(fallbackHighpass);
      fallbackHighpass.connect(fallbackLowpass);
      fallbackLowpass.connect(fallbackGain);
      fallbackGain.connect(synthRoomBus);
      fallbackNoise.start();
      persistent.push(fallbackNoise, fallbackHighpass, fallbackLowpass, fallbackGain, humFilter, humGain);

      // Optical transport air: continuous and causal, never a random tick bed.
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
      movementHighpass.frequency.value = 520;
      movementFilter.type = "bandpass";
      movementFilter.frequency.value = 820;
      movementFilter.Q.value = 0.78;
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

      // Surface probe: one deterministic filtered-air source. Its envelope is
      // opened only by canonical probe intersection data; no per-pixel sources
      // or autonomous ticks are created while the pointer moves.
      const probeSource = context.createBufferSource();
      const probeHighpass = context.createBiquadFilter();
      const probeFilter = context.createBiquadFilter();
      const probeGain = context.createGain();
      const probePanner = typeof context.createStereoPanner === "function"
        ? context.createStereoPanner()
        : null;
      probeSource.buffer = noise;
      probeSource.loop = true;
      probeHighpass.type = "highpass";
      probeHighpass.frequency.value = 260;
      probeFilter.type = "bandpass";
      probeFilter.frequency.value = 920;
      probeFilter.Q.value = 0.82;
      probeGain.gain.value = 0;
      probeSource.connect(probeHighpass);
      probeHighpass.connect(probeFilter);
      probeFilter.connect(probeGain);
      if (probePanner) {
        probeGain.connect(probePanner);
        probePanner.connect(probeBus);
      } else {
        probeGain.connect(probeBus);
      }
      probeSource.start();
      persistent.push(
        probeSource,
        probeHighpass,
        probeFilter,
        probeGain,
        ...(probePanner ? [probePanner] : []),
      );

      graph = {
        context,
        master,
        scoreBus,
        roomBus,
        movementBus,
        probeBus,
        cueBus,
        synthRoomBus,
        musicGate,
        scoreDucker,
        roomStemGate,
        movementFilter,
        movementGain,
        movementPanner,
        probeFilter,
        probeGain,
        probePanner,
        probeRelease: 0.32,
        music,
        mediaSource,
        musicCandidates: musicCandidates(),
        musicCandidateIndex: -1,
        noise,
        persistent,
        roomSources: [],
      };

      music.addEventListener("playing", handleMusicPlaying);
      music.addEventListener("ended", handleMusicEnded);
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
    const panLimit = isMobileMix() ? 0.16 : 0.28;
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
    const oscillator = graph.context.createOscillator();
    const stage = createStereoStage(graph.cueBus, pan);
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
    const source = graph.context.createBufferSource();
    const filter = graph.context.createBiquadFilter();
    const stage = createStereoStage(graph.cueBus, pan);
    source.buffer = graph.noise;
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

  function duckScore(level = 0.84) {
    if (!graph) return;
    const parameter = graph.scoreDucker.gain;
    const at = graph.context.currentTime;
    try {
      if (typeof parameter.cancelAndHoldAtTime === "function") parameter.cancelAndHoldAtTime(at);
      else {
        parameter.cancelScheduledValues(at);
        parameter.setValueAtTime(parameter.value, at);
      }
      parameter.linearRampToValueAtTime(level, at + 0.06);
      parameter.setValueAtTime(level, at + 0.14);
      parameter.linearRampToValueAtTime(1, at + 0.36);
    } catch {
      parameter.value = 1;
    }
  }

  function playRelay(level = 0.014, pan = 0) {
    if (!graph) return;
    const at = graph.context.currentTime + 0.004;
    playNoiseClick({ at, duration: 0.036, level: level * 1.55, frequency: 980, q: 0.82, pan });
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
      level: specification.level * 0.68,
      frequency: 1740,
      q: 1.35,
      pan,
    });
  }

  function playComparisonSlide(pan = 0, intensity = 1) {
    if (!graph) return;
    const at = graph.context.currentTime + 0.004;
    const level = 0.013 * intensity;
    playNoiseClick({ at, duration: 0.052, level: level * 1.45, frequency: 1240, q: 0.72, pan });
    playFixedPartial({ frequency: 440, at, duration: 0.075, level, type: "triangle", pan });
    playNoiseClick({ at: at + 0.052, duration: 0.032, level: level * 0.9, frequency: 1960, q: 1.2, pan });
  }

  function playAxisCollet(pan = 0, intensity = 1) {
    if (!graph) return;
    const at = graph.context.currentTime + 0.004;
    const level = 0.012 * intensity;
    playNoiseClick({ at, duration: 0.026, level: level * 1.7, frequency: 760, q: 0.9, pan });
    playNoiseClick({ at: at + 0.036, duration: 0.032, level: level * 1.15, frequency: 1520, q: 1.1, pan });
    playFixedPartial({ frequency: 220, at, duration: 0.092, level: level * 0.68, type: "triangle", pan });
  }

  function playGlassRelease(pan = 0, intensity = 1) {
    if (!graph) return;
    const at = graph.context.currentTime + 0.004;
    const level = 0.0075 * intensity;
    playNoiseClick({ at, duration: 0.025, level: level * 1.5, frequency: 2460, q: 2.1, pan });
    playFixedPartial({ frequency: 659.26, at, duration: 0.22, level, pan });
    playFixedPartial({ frequency: 987.77, at: at + 0.006, duration: 0.17, level: level * 0.54, pan });
  }

  function playArchiveOpen(pan = 0, intensity = 1) {
    if (!graph) return;
    const at = graph.context.currentTime + 0.005;
    const level = 0.0068 * intensity;
    playNoiseClick({ at, duration: 0.045, level: level * 1.75, frequency: 1120, q: 0.7, pan });
    playFixedPartial({ frequency: 329.63, at, duration: 0.28, level, pan });
    playFixedPartial({ frequency: 493.88, at: at + 0.018, duration: 0.24, level: level * 0.58, pan });
    playFixedPartial({ frequency: 740, at: at + 0.034, duration: 0.18, level: level * 0.3, pan });
  }

  function playOpticalHover(pan = 0) {
    if (!graph) return;
    const at = graph.context.currentTime + 0.003;
    // Fixed glass/collet partials only: materially below commit mechanics and
    // free of random noise bursts or a pitch glide that implies interpolation.
    playFixedPartial({ frequency: 987.77, at, duration: 0.046, level: 0.0034, type: "triangle", pan });
    playFixedPartial({ frequency: 1481.65, at: at + 0.002, duration: 0.034, level: 0.00155, pan });
  }

  function playTransitionCue(from, to, direction) {
    if (!graph) return;
    duckScore(0.84);
    const pan = normalizeDirection(direction) * (isMobileMix() ? 0.07 : 0.12);
    const intensity = reducedMotion?.matches ? 0.58 : 0.78;
    const key = `${from}->${to}`;
    if (key.includes("origin") && key.includes("response")) playRelay(0.012 * intensity, pan);
    else if (key.includes("response") && key.includes("discriminate")) playComparisonSlide(pan, intensity);
    else if (key.includes("discriminate") && key.includes("association")) playAxisCollet(pan, intensity);
    else if (key.includes("association") && key.includes("reconstruct")) playGlassRelease(pan, intensity);
    else if (key.includes("reconstruct") && key.includes("archive")) playArchiveOpen(pan, intensity * 0.82);
    else playRelay(0.01 * intensity, pan);
  }

  function roomCodecCandidates() {
    const probe = documentRoot.createElement("audio");
    const opus = new URL("./audio/atlas-room.opus", import.meta.url).href;
    const m4a = new URL("./audio/atlas-room.m4a", import.meta.url).href;
    return probe.canPlayType?.('audio/ogg; codecs="opus"') ? [opus, m4a] : [m4a, opus];
  }

  async function decodeRoom() {
    if (!graph) return null;
    for (const url of roomCodecCandidates()) {
      try {
        const response = await fetch(url, {
          credentials: "same-origin",
          signal: abortController.signal,
        });
        if (!response.ok) continue;
        const bytes = await response.arrayBuffer();
        const buffer = await graph.context.decodeAudioData(bytes.slice(0));
        if (buffer?.duration > ROOM_LOOP_SECONDS - 0.25) return buffer;
      } catch (error) {
        if (error?.name === "AbortError") return null;
      }
    }
    return null;
  }

  function startRoom(buffer) {
    const source = graph.context.createBufferSource();
    const hasCodecGuard = buffer.duration >= ROOM_LOOP_SECONDS + AAC_GUARD_SECONDS * 1.75;
    const loopStart = hasCodecGuard ? AAC_GUARD_SECONDS : 0;
    source.buffer = buffer;
    source.loop = true;
    source.loopStart = loopStart;
    source.loopEnd = Math.min(loopStart + ROOM_LOOP_SECONDS, buffer.duration);
    source.connect(graph.roomStemGate);
    source.start(graph.context.currentTime + 0.04, loopStart);
    graph.roomSources.push(source);
  }

  async function loadRoomLayer() {
    if (roomLoad) return roomLoad;
    roomLoad = (async () => {
      const room = await decodeRoom();
      if (destroyed || !graph || !room) {
        if (!destroyed) {
          setAudioMode(musicPlaying ? "licensed-score" : "synth-fallback");
          syncControls();
        }
        return false;
      }
      startRoom(room);
      const at = graph.context.currentTime;
      holdAndRamp(graph.roomStemGate.gain, 1, 1.15, at);
      holdAndRamp(graph.synthRoomBus.gain, 0, 1.35, at);
      roomReady = true;
      setAudioMode(musicPlaying ? "licensed-score-room" : musicEnded ? "room-only-ended" : "generated-room");
      syncControls();
      return true;
    })();
    return roomLoad;
  }

  function selectMusicCandidate(index) {
    if (!graph || index < 0 || index >= graph.musicCandidates.length) return false;
    const { music } = graph;
    try {
      music.pause();
      music.removeAttribute("src");
      music.load();
      music.src = graph.musicCandidates[index].url;
      music.preload = "auto";
      graph.musicCandidateIndex = index;
      music.load();
      return true;
    } catch {
      return false;
    }
  }

  async function attemptMusicPlayback(index) {
    if (!graph || destroyed || !desiredEnabled || manuallyPaused || !visible()) return false;
    if (graph.musicCandidateIndex !== index && !selectMusicCandidate(index)) return false;
    try {
      await graph.music.play();
      if (!desiredEnabled || manuallyPaused || !visible()) {
        graph.music.pause();
        return false;
      }
      return true;
    } catch (error) {
      if (error?.name === "NotAllowedError") {
        armUnlock();
        return false;
      }
      if (error?.name === "AbortError" || destroyed || !desiredEnabled) return false;
      const next = index + 1;
      return next < graph.musicCandidates.length ? attemptMusicPlayback(next) : false;
    }
  }

  function playMusic({ restartIfEnded = false } = {}) {
    if (!graph || !desiredEnabled || manuallyPaused || !visible()) return Promise.resolve(false);
    if (restartIfEnded && (musicEnded || graph.music.ended)) {
      try {
        graph.music.currentTime = 0;
      } catch {
        // Some media implementations reject seeking until metadata is loaded.
      }
      musicEnded = false;
    }
    const startIndex = Math.max(0, graph.musicCandidateIndex);
    if (musicPlayPromise) return musicPlayPromise;
    const pending = attemptMusicPlayback(startIndex).finally(() => {
      if (musicPlayPromise === pending) musicPlayPromise = null;
    });
    musicPlayPromise = pending;
    return pending;
  }

  function handleMusicPlaying() {
    if (!graph || destroyed) return;
    musicPlaying = true;
    musicEnded = false;
    setAudioMode(roomReady ? "licensed-score-room" : "licensed-score");
    syncControls();
  }

  function handleMusicEnded() {
    if (!graph || destroyed) return;
    musicPlaying = false;
    musicEnded = true;
    holdAndRamp(graph.musicGate.gain, 0, 0.45, graph.context.currentTime);
    setAudioMode(roomReady ? "room-only-ended" : "score-ended");
    syncControls();
  }

  function scheduleMusicEntrance(firstEntry) {
    if (!graph) return;
    const parameter = graph.musicGate.gain;
    const at = graph.context.currentTime;
    const target = musicTarget();
    if (firstEntry) {
      try {
        parameter.cancelScheduledValues(at);
        parameter.setValueAtTime(0, at);
        parameter.setValueAtTime(0, at + 0.35);
        parameter.linearRampToValueAtTime(target, at + 2.75);
      } catch {
        parameter.value = target;
      }
    } else {
      holdAndRamp(parameter, target, 0.8, at);
    }
  }

  function applySceneMix(scene, localProgress = 0, immediate = false) {
    if (!graph) return;
    const normalizedScene = SCENE_MIX[scene] ? scene : "origin";
    const base = SCENE_MIX[normalizedScene];
    let score = base.score;
    let movement = base.movement;
    if (normalizedScene === "archive") {
      const release = smoothstep(0.62, 0.9, localProgress);
      score *= 1 - release * 0.94;
      movement *= 1 - release * 0.82;
    }
    if (isMobileMix()) movement *= 0.58;
    const at = graph.context.currentTime;
    const constant = immediate ? 0.01 : normalizedScene === "association" ? 0.4 : 0.2;
    settleParameter(graph.scoreBus.gain, score, at, constant);
    settleParameter(graph.roomBus.gain, base.room, at, constant);
    settleParameter(graph.movementBus.gain, movement, at, constant);
  }

  function cameraDetail(detail) {
    return {
      scene: detail.scene ?? detail.id ?? detail.station,
      localProgress: detail.localProgress ?? detail.progress,
      speed: detail.speed ?? detail.velocity,
      acceleration: detail.acceleration ?? detail.accel,
      x: detail.x ?? detail.cameraX,
      probeActive: detail.probeActive,
      probeSpeed: detail.probeSpeed,
      probeX: detail.probeX,
      probeY: detail.probeY,
      probeSurface: detail.probeSurface,
    };
  }

  function releaseProbe(at, timeConstant = 0.32) {
    if (!graph) return;
    probeActive = false;
    settleParameter(graph.probeGain.gain, 0, at, timeConstant);
    if (graph.probePanner) settleParameter(graph.probePanner.pan, 0, at, 0.32);
  }

  function updateSurfaceProbe(detail, at) {
    if (!graph) return;
    const surface = String(detail.probeSurface || "").toLowerCase();
    const allowed = entryConsentGranted
      && desiredEnabled
      && !manuallyPaused
      && visible()
      && graph.context.state === "running"
      && !reducedMotion?.matches;
    const intersects = detail.probeActive === true && Boolean(surface);
    const normalizedSpeed = clamp(Math.abs(Number(detail.probeSpeed)) / PROBE_SPEED_SCALE, 0, 1, 0);
    if (!allowed || !intersects || normalizedSpeed < 0.025) {
      releaseProbe(at, probeActive ? (graph.probeRelease || 0.32) : 0.22);
      return;
    }

    const energy = smoothstep(0.025, 1, normalizedSpeed);
    const vertical = clamp(Number(detail.probeY), -1, 1, 0);
    let floorDb = -34;
    let ceilingDb = -26;
    let frequency = 780 + energy * 1240 + (vertical + 1) * 120;
    let resonance = 0.82;
    let release = 0.32;

    if (surface.startsWith("discriminate:") || surface.includes("comparison")) {
      // The comparison divider is deliberately drier and quieter than other
      // optical surfaces, reading as filtered bearing friction rather than air.
      floorDb = -38;
      ceilingDb = -30;
      frequency = 1180 + energy * 720 + (vertical + 1) * 90;
      resonance = 1.08;
    } else if (surface.startsWith("archive:")) {
      // The same single source becomes a low, broad aperture swell over cells;
      // no extra oscillator or triggered sweep is introduced.
      floorDb = -37;
      ceilingDb = -30;
      frequency = 500 + energy * 460 + (vertical + 1) * 70;
      resonance = 0.52;
      release = 0.36;
    }

    const targetGain = decibelsToGain(floorDb + (ceilingDb - floorDb) * energy);
    const wasActive = probeActive;
    probeActive = true;
    settleParameter(graph.probeGain.gain, targetGain, at, wasActive ? 0.032 : 0.028);
    settleParameter(graph.probeFilter.frequency, frequency, at, 0.035);
    settleParameter(graph.probeFilter.Q, resonance, at, 0.04);
    if (graph.probePanner) {
      settleParameter(graph.probePanner.pan, clamp(Number(detail.probeX), -1, 1, 0) * 0.15, at, 0.04);
    }
    // Retain the material-specific release value for a zero-speed active event.
    graph.probeRelease = release;
  }

  function handleCamera(event) {
    const detail = cameraDetail(eventDetail(event));
    const nextScene = String(detail.scene || currentScene).toLowerCase();
    if (SCENE_MIX[nextScene]) currentScene = nextScene;
    currentLocalProgress = clamp(detail.localProgress, 0, 1, currentLocalProgress);
    applySceneMix(currentScene, currentLocalProgress);
    if (!graph) return;

    const at = graph.context.currentTime;
    updateSurfaceProbe(detail, at);
    if (reducedMotion?.matches || at < movementSuppressedUntil) {
      movementActive = false;
      settleParameter(graph.movementGain.gain, 0, at, 0.045);
      return;
    }

    const speed = Math.abs(Number(detail.speed)) || 0;
    if (movementActive && speed < 0.008) movementActive = false;
    else if (!movementActive && speed > 0.015) movementActive = true;
    const energy = movementActive ? smoothstep(0.015, 0.3, speed) : 0;
    const acceleration = clamp(Math.abs(Number(detail.acceleration)), 0, 1, 0);
    const targetGain = energy * (isMobileMix() ? 0.0011 : 0.0018);
    settleParameter(graph.movementGain.gain, targetGain, at, targetGain > graph.movementGain.gain.value ? 0.09 : 0.34);
    settleParameter(graph.movementFilter.frequency, 720 + energy * 1080 + acceleration * 180, at, 0.12);
    if (graph.movementPanner) {
      const panLimit = isMobileMix() ? 0.12 : 0.22;
      settleParameter(graph.movementPanner.pan, clamp(Number(detail.x) / 4, -panLimit, panLimit, 0), at, 0.16);
    }
  }

  function handleTransition(event) {
    const detail = eventDetail(event);
    const phase = String(detail.phase || "").toLowerCase();
    const transitionId = String(detail.transitionId ?? detail.id ?? "").trim();
    if (transitionId && rememberId(transitionIds, `${transitionId}:${phase}`)) return;
    if (
      phase !== "cross"
      || !graph
      || !desiredEnabled
      || manuallyPaused
      || !visible()
      || graph.context.state !== "running"
    ) return;
    const at = graph.context.currentTime;
    if (at - lastTransitionCueTime < 0.9) return;
    lastTransitionCueTime = at;
    playTransitionCue(
      String(detail.from ?? detail.previous ?? ""),
      String(detail.to ?? detail.next ?? ""),
      detail.direction,
    );
  }

  function handleInteraction(event) {
    const detail = eventDetail(event);
    if (!graph || !desiredEnabled || manuallyPaused || !visible() || graph.context.state !== "running") return;
    const kind = String(detail.kind || "").toLowerCase();
    if (kind === "optical-hover") {
      if (!entryConsentGranted) return;
      const hoverId = String(detail.id ?? detail.interactionId ?? "").trim();
      if (!hoverId || rememberId(hoverIds, hoverId)) return;
      const at = graph.context.currentTime;
      if (at - lastHoverCueTime < PROBE_HOVER_COOLDOWN_SECONDS) return;
      lastHoverCueTime = at;
      playOpticalHover(clamp(detail.pan, -0.15, 0.15, 0));
      return;
    }
    const isImplicitDetent = Boolean(STATE_DETENTS[String(detail.value || "").toLowerCase()]);
    if (!isImplicitDetent && !["state-detent", "comparison-slide", "axis-collet", "archive-open"].includes(kind)) {
      return;
    }
    const interactionId = String(detail.interactionId ?? detail.id ?? "").trim();
    if (interactionId) {
      if (rememberId(interactionIds, interactionId)) return;
    } else {
      const at = graph.context.currentTime;
      if (at - lastFallbackInteractionTime < 0.12) return;
      lastFallbackInteractionTime = at;
    }

    const pan = clamp(detail.pan, -0.28, 0.28, 0);
    duckScore(0.86);
    if (kind === "state-detent" || isImplicitDetent) playStateDetent(detail.value, pan);
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
    if (!entryConsentGranted) return;
    // Let semantic entry/toggle clicks run their own handler so the opt-in
    // relay and long music entrance are not consumed by pointerdown first.
    if (event.target?.closest?.(`${entrySelector}, ${soundToggleSelector}`)) return;
    disarmUnlock();
    void makeAudible();
  }

  function armUnlock() {
    if (unlockArmed || destroyed || !desiredEnabled || !entryConsentGranted) return;
    unlockArmed = true;
    documentRoot.addEventListener("pointerdown", handleUnlockGesture, true);
    documentRoot.addEventListener("keydown", handleUnlockGesture, true);
  }

  function quietAndSuspend(fade = 0.25) {
    lifecycleRevision += 1;
    const revision = lifecycleRevision;
    view.clearTimeout(suspendTimer);
    suspendTimer = 0;
    if (!graph) return;
    releaseProbe(graph.context.currentTime, 0.025);
    holdAndRamp(graph.master.gain, 0, fade, graph.context.currentTime);
    suspendTimer = view.setTimeout(() => {
      suspendTimer = 0;
      if (destroyed || revision !== lifecycleRevision || !graph) return;
      try {
        graph.music.pause();
      } catch {
        // Media can already be detached during teardown.
      }
      if (graph.context.state === "running") {
        try {
          graph.context.suspend()?.catch?.(() => {});
        } catch {
          // The browser may already have suspended the context.
        }
      }
    }, Math.ceil((fade + 0.035) * 1000));
  }

  async function makeAudible({ entryCue = false } = {}) {
    if (
      destroyed
      || !desiredEnabled
      || !entryConsentGranted
      || manuallyPaused
      || !visible()
    ) return false;
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

    // Calling play() before the first await retains the opt-in gesture on
    // Safari/iOS. The MediaElementSource remains inaudible until the context
    // and gain envelope are opened below.
    const firstMusicEntrance = !musicRequested || musicEnded;
    const playback = playMusic({ restartIfEnded: musicEnded });
    musicRequested = true;

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

    const at = audioGraph.context.currentTime;
    holdAndRamp(audioGraph.master.gain, ACTIVE_MASTER_LEVEL, entryCue ? 0.14 : 0.8, at);
    scheduleMusicEntrance(firstMusicEntrance);
    if (entryCue) {
      movementSuppressedUntil = at + 0.9;
      playRelay(0.012, 0);
    }
    setAudioMode(musicPlaying ? (roomReady ? "licensed-score-room" : "licensed-score") : "licensed-score-loading");
    syncControls();
    void loadRoomLayer();
    void playback.then((started) => {
      if (!started && desiredEnabled && !destroyed) {
        setAudioMode(roomReady ? "generated-room" : "synth-fallback");
        syncControls();
      }
    });
    return true;
  }

  async function enable({ persist = true, entryCue = false } = {}) {
    if (destroyed) return false;
    const wasEnabled = desiredEnabled;
    const shouldPlayEntryCue = entryCue && (!wasEnabled || !graph);
    desiredEnabled = true;
    manuallyPaused = false;
    if (stateHost?.dataset) stateHost.dataset.audioRequest = "on";
    if (persist) storePreference(view, true);
    syncControls();
    disarmUnlock();
    const started = await makeAudible({ entryCue: shouldPlayEntryCue });
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
    const entry = event.target?.closest?.(entrySelector);
    if (entry && rootContains(entry)) {
      entryConsentGranted = true;
      if (stateHost?.dataset) stateHost.dataset.audioRequest = "on";
      void enable({ entryCue: true });
      return;
    }
    const toggle = event.target?.closest?.(soundToggleSelector);
    if (toggle && rootContains(toggle)) {
      if (desiredEnabled) disable();
      else void enable({ entryCue: true });
    }
  }

  function handleAudioRequest(event) {
    const detail = eventDetail(event);
    if (typeof detail.enabled !== "boolean") return;
    if (detail.enabled && detail.source === "entry") entryConsentGranted = true;
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
    if (!visible()) quietAndSuspend(0.25);
    else if (desiredEnabled && !manuallyPaused) void resume();
  }

  function handlePageHide() {
    quietAndSuspend(0.08);
  }

  function handlePageShow() {
    if (desiredEnabled && !manuallyPaused && visible()) void resume();
  }

  function handleMediaPreference() {
    if (!graph) return;
    if (reducedMotion?.matches) {
      movementActive = false;
      settleParameter(graph.movementGain.gain, 0, graph.context.currentTime, 0.045);
      releaseProbe(graph.context.currentTime, 0.025);
    }
    graph.probeBus.gain.value = isMobileMix() ? 0.78 : 1;
    if (musicPlaying && !musicEnded) {
      settleParameter(graph.musicGate.gain, musicTarget(), graph.context.currentTime, 0.3);
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
    if (reducedMotion?.removeEventListener) reducedMotion.removeEventListener("change", handleMediaPreference);
    else reducedMotion?.removeListener?.(handleMediaPreference);
    if (coarsePointer?.removeEventListener) coarsePointer.removeEventListener("change", handleMediaPreference);
    else coarsePointer?.removeListener?.(handleMediaPreference);

    if (graph) {
      graph.context.removeEventListener?.("statechange", handleContextState);
      graph.music.removeEventListener("playing", handleMusicPlaying);
      graph.music.removeEventListener("ended", handleMusicEnded);
      try {
        graph.music.pause();
        graph.music.removeAttribute("src");
        graph.music.load();
        graph.mediaSource.disconnect();
      } catch {
        // A media element can already be detached by page teardown.
      }
      for (const source of graph.roomSources) {
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
  if (reducedMotion?.addEventListener) reducedMotion.addEventListener("change", handleMediaPreference);
  else reducedMotion?.addListener?.(handleMediaPreference);
  if (coarsePointer?.addEventListener) coarsePointer.addEventListener("change", handleMediaPreference);
  else coarsePointer?.addListener?.(handleMediaPreference);

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
