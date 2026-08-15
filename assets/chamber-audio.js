/**
 * Atlas Observation Chamber sound engine.
 *
 * Event contract (all events are dispatched on `document`):
 *
 * - `atlas:scene`
 *   `detail: { id: string, progress?: number, velocity?: number }`
 *   A changed `id` produces a quiet film-gate cue. `progress` is expected in
 *   the range 0..1; `velocity` is a signed, normalized motion value. Those two
 *   values only affect residual flutter and are ignored under reduced motion.
 *
 * - `atlas:state`
 *   `detail: { state: "low" | "medium" | "high", index?: number }`
 *   Produces one of three fixed, hard detents. A bare state string and an
 *   `index` of 0, 1, or 2 are accepted as defensive fallbacks. Frequencies do
 *   not glide between states, because the registered outputs are discrete.
 *
 * - `atlas:commit`
 *   `detail: { kind?: string, value?: number, pan?: number }`
 *   Produces a relay or glass detent. `pan` is clamped to -1..1 and `value`
 *   only trims the cue's intensity. No information is communicated by sound
 *   alone; every audible response is an optional reinforcement of visible UI.
 *
 * The engine creates audio only after an explicit opt-in (or after a later
 * gesture when restoring a stored opt-in). It uses Web Audio synthesis only.
 */

const STORAGE_KEY = "atlas_sound_v1";
const ACTIVE_MASTER_LEVEL = 0.58;
const instances = new WeakMap();

const STATE_DETENTS = Object.freeze({
  low: Object.freeze({ frequencies: Object.freeze([146.83, 220]), duration: 0.105, level: 0.019 }),
  medium: Object.freeze({ frequencies: Object.freeze([220, 329.63]), duration: 0.09, level: 0.017 }),
  high: Object.freeze({ frequencies: Object.freeze([329.63, 493.88]), duration: 0.075, level: 0.015 }),
});

function clamp(value, minimum, maximum, fallback = minimum) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(maximum, Math.max(minimum, number)) : fallback;
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
    // Storage can be unavailable in private or embedded contexts. Sound still works.
  }
}

function noiseBuffer(context, seconds = 2) {
  const length = Math.max(1, Math.floor(context.sampleRate * seconds));
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const samples = buffer.getChannelData(0);
  let seed = 0x6d2b79f5;
  let previous = 0;

  // Deterministic, gently correlated noise keeps the room texture consistent.
  for (let index = 0; index < length; index += 1) {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    const white = ((seed >>> 0) / 0xffffffff) * 2 - 1;
    previous = previous * 0.16 + white * 0.84;
    samples[index] = previous * 0.72;
  }

  return buffer;
}

function setFixed(parameter, value, time) {
  parameter.cancelScheduledValues(time);
  parameter.setValueAtTime(value, time);
}

function fadeParameter(parameter, value, duration, time) {
  const start = Number.isFinite(parameter.value) ? parameter.value : 0;
  if (typeof parameter.cancelAndHoldAtTime === "function") {
    parameter.cancelAndHoldAtTime(time);
  } else {
    parameter.cancelScheduledValues(time);
    parameter.setValueAtTime(start, time);
  }
  parameter.linearRampToValueAtTime(value, time + Math.max(0.01, duration));
}

function disconnectLater(view, nodes, milliseconds) {
  view.setTimeout(() => {
    nodes.forEach((node) => {
      try {
        node.disconnect();
      } catch {
        // Nodes can already be disconnected during teardown.
      }
    });
  }, milliseconds);
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

export function createAtlasAudio(root = document) {
  if (!root || (typeof root !== "object" && typeof root !== "function")) return noAudioApi();
  if (instances.has(root)) return instances.get(root);

  const documentRoot = root.nodeType === 9 ? root : root.ownerDocument;
  const view = documentRoot?.defaultView;
  const AudioContextClass = view?.AudioContext || view?.webkitAudioContext;
  const motionPreference = view?.matchMedia?.("(prefers-reduced-motion: reduce)") || null;
  const toggleSelector = "[data-sound-toggle]";
  const toggles = [];

  if (root.matches?.(toggleSelector)) toggles.push(root);
  root.querySelectorAll?.(toggleSelector).forEach((toggle) => toggles.push(toggle));

  if (!documentRoot || !view || !AudioContextClass) {
    toggles.forEach((toggle) => {
      toggle.setAttribute("aria-pressed", "false");
      toggle.setAttribute("aria-disabled", "true");
      if ("disabled" in toggle) toggle.disabled = true;
    });
    const unavailable = noAudioApi();
    instances.set(root, unavailable);
    return unavailable;
  }

  let graph = null;
  let destroyed = false;
  let desiredEnabled = persistedPreference(view);
  let manuallyPaused = false;
  let unlockArmed = false;
  let suspendTimer = 0;
  let projectorTimer = 0;
  let lifecycleRevision = 0;
  let currentScene = null;
  let lastStateKey = "";
  let lastStateTime = 0;
  const lastCueTimes = new Map();
  const toggleHandlers = new Map();

  function visible() {
    return documentRoot.visibilityState !== "hidden";
  }

  function syncToggles() {
    toggles.forEach((toggle) => {
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
      if (!toggle.matches("button, input") && !toggle.hasAttribute("role")) toggle.setAttribute("role", "button");
      if (!toggle.matches("button, input") && !toggle.hasAttribute("tabindex")) toggle.tabIndex = 0;
      if (!toggle.hasAttribute("aria-label") && !toggle.textContent.trim()) toggle.setAttribute("aria-label", "Sound");
    });
  }

  function createStereoStage(context, destination, pan = 0) {
    const gain = context.createGain();
    const panner = typeof context.createStereoPanner === "function" ? context.createStereoPanner() : null;
    if (panner) {
      panner.pan.value = clamp(pan, -1, 1, 0);
      gain.connect(panner);
      panner.connect(destination);
    } else {
      gain.connect(destination);
    }
    return { gain, panner, nodes: panner ? [gain, panner] : [gain] };
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

    const master = context.createGain();
    const limiter = context.createDynamicsCompressor();
    const mix = context.createGain();
    const ambienceBus = context.createGain();
    const harmonicBus = context.createGain();
    const motionBus = context.createGain();
    const eventBus = context.createGain();

    master.gain.value = 0;
    mix.gain.value = 0.82;
    ambienceBus.gain.value = 0.52;
    harmonicBus.gain.value = 0.31;
    motionBus.gain.value = 0.42;
    eventBus.gain.value = 0.68;
    limiter.threshold.value = -18;
    limiter.knee.value = 5;
    limiter.ratio.value = 8;
    limiter.attack.value = 0.004;
    limiter.release.value = 0.18;

    ambienceBus.connect(mix);
    harmonicBus.connect(mix);
    motionBus.connect(mix);
    eventBus.connect(mix);
    mix.connect(limiter);
    limiter.connect(master);
    master.connect(context.destination);

    const persistent = [];
    const texture = noiseBuffer(context);

    // Transformer body: fixed 60 Hz fundamental and restrained second harmonic.
    const humFilter = context.createBiquadFilter();
    const humGain = context.createGain();
    humFilter.type = "lowpass";
    humFilter.frequency.value = 360;
    humFilter.Q.value = 0.48;
    humGain.gain.value = 0.011;
    humFilter.connect(humGain);
    humGain.connect(ambienceBus);

    [
      { frequency: 60, type: "sine", level: 0.78 },
      { frequency: 120, type: "sine", level: 0.2 },
    ].forEach(({ frequency, type, level }) => {
      const oscillator = context.createOscillator();
      const levelGain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      levelGain.gain.value = level;
      oscillator.connect(levelGain);
      levelGain.connect(humFilter);
      oscillator.start();
      persistent.push(oscillator, levelGain);
    });

    const humLfo = context.createOscillator();
    const humLfoDepth = context.createGain();
    humLfo.type = "sine";
    humLfo.frequency.value = 0.073;
    humLfoDepth.gain.value = 0.0012;
    humLfo.connect(humLfoDepth);
    humLfoDepth.connect(humGain.gain);
    humLfo.start();
    persistent.push(humLfo, humLfoDepth, humFilter, humGain);

    // D-A-E: an open fifth plus suspended partial, kept just above room tone.
    const harmonicFilter = context.createBiquadFilter();
    harmonicFilter.type = "lowpass";
    harmonicFilter.frequency.value = 980;
    harmonicFilter.Q.value = 0.32;
    harmonicFilter.connect(harmonicBus);
    [
      { frequency: 146.83, level: 0.0034, type: "sine", lfo: 0.041 },
      { frequency: 220, level: 0.0024, type: "sine", lfo: 0.052 },
      { frequency: 329.63, level: 0.0015, type: "triangle", lfo: 0.037 },
    ].forEach(({ frequency, level, type, lfo }) => {
      const oscillator = context.createOscillator();
      const voiceGain = context.createGain();
      const amplitudeLfo = context.createOscillator();
      const amplitudeDepth = context.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      voiceGain.gain.value = level;
      amplitudeLfo.type = "sine";
      amplitudeLfo.frequency.value = lfo;
      amplitudeDepth.gain.value = level * 0.16;
      oscillator.connect(voiceGain);
      amplitudeLfo.connect(amplitudeDepth);
      amplitudeDepth.connect(voiceGain.gain);
      voiceGain.connect(harmonicFilter);
      oscillator.start();
      amplitudeLfo.start();
      persistent.push(oscillator, voiceGain, amplitudeLfo, amplitudeDepth);
    });
    persistent.push(harmonicFilter);

    // A synthetic optical-room texture, with a separate motion-responsive send.
    const flutterSource = context.createBufferSource();
    const flutterHighpass = context.createBiquadFilter();
    const flutterFilter = context.createBiquadFilter();
    const residualGain = context.createGain();
    const motionGain = context.createGain();
    const motionPanner = typeof context.createStereoPanner === "function" ? context.createStereoPanner() : null;
    flutterSource.buffer = texture;
    flutterSource.loop = true;
    flutterHighpass.type = "highpass";
    flutterHighpass.frequency.value = 620;
    flutterFilter.type = "bandpass";
    flutterFilter.frequency.value = 1180;
    flutterFilter.Q.value = 0.58;
    residualGain.gain.value = 0.00115;
    motionGain.gain.value = 0;
    flutterSource.connect(flutterHighpass);
    flutterHighpass.connect(flutterFilter);
    flutterFilter.connect(residualGain);
    residualGain.connect(ambienceBus);
    flutterFilter.connect(motionGain);
    if (motionPanner) {
      motionGain.connect(motionPanner);
      motionPanner.connect(motionBus);
    } else {
      motionGain.connect(motionBus);
    }
    flutterSource.start();
    persistent.push(
      flutterSource,
      flutterHighpass,
      flutterFilter,
      residualGain,
      motionGain,
      ...(motionPanner ? [motionPanner] : []),
    );

    graph = {
      context,
      master,
      buses: { ambience: ambienceBus, harmonic: harmonicBus, motion: motionBus, event: eventBus },
      texture,
      persistent,
      flutterFilter,
      motionGain,
      motionPanner,
    };

    context.addEventListener?.("statechange", handleContextState);
    return graph;
  }

  function cueAllowed(name, cooldown = 0.08) {
    if (!graph || !desiredEnabled || manuallyPaused || !visible() || graph.context.state !== "running") return false;
    const time = graph.context.currentTime;
    const previous = lastCueTimes.get(name) ?? -Infinity;
    if (time - previous < cooldown) return false;
    lastCueTimes.set(name, time);
    return true;
  }

  function playNoiseClick({ at, duration, level, frequency, q = 0.8, pan = 0 }) {
    if (!graph) return;
    const { context, texture, buses } = graph;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const stage = createStereoStage(context, buses.event, pan);
    source.buffer = texture;
    filter.type = "bandpass";
    filter.frequency.value = frequency;
    filter.Q.value = q;
    stage.gain.gain.setValueAtTime(0.0001, at);
    stage.gain.gain.linearRampToValueAtTime(level, at + 0.002);
    stage.gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    source.connect(filter);
    filter.connect(stage.gain);
    source.start(at, (at * 0.731) % 1.5, duration + 0.015);
    source.stop(at + duration + 0.02);
    disconnectLater(view, [source, filter, ...stage.nodes], (duration + 0.12) * 1000);
  }

  function playFixedPartial({ frequency, at, duration, level, type = "sine", pan = 0 }) {
    if (!graph) return;
    const { context, buses } = graph;
    const oscillator = context.createOscillator();
    const stage = createStereoStage(context, buses.event, pan);
    oscillator.type = type;
    // Intentionally fixed for the entire cue: no interpolated state pitches.
    setFixed(oscillator.frequency, frequency, at);
    stage.gain.gain.setValueAtTime(0.0001, at);
    stage.gain.gain.linearRampToValueAtTime(level, at + 0.003);
    stage.gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    oscillator.connect(stage.gain);
    oscillator.start(at);
    oscillator.stop(at + duration + 0.02);
    disconnectLater(view, [oscillator, ...stage.nodes], (duration + 0.12) * 1000);
  }

  function playFilmGate(intensity = 1, pan = 0) {
    if (!graph) return;
    const at = graph.context.currentTime + 0.006;
    const scale = clamp(intensity, 0.2, 1, 0.7);
    playNoiseClick({ at, duration: 0.048, level: 0.029 * scale, frequency: 860, q: 0.72, pan });
    playFixedPartial({ frequency: 92, at, duration: 0.066, level: 0.016 * scale, type: "triangle", pan });
    playNoiseClick({ at: at + 0.052, duration: 0.032, level: 0.017 * scale, frequency: 1320, q: 1.1, pan });
  }

  function playRelay(intensity = 1, pan = 0) {
    if (!graph) return;
    const at = graph.context.currentTime + 0.004;
    const scale = clamp(intensity, 0.45, 1, 0.75);
    playNoiseClick({ at, duration: 0.038, level: 0.032 * scale, frequency: 1040, q: 0.92, pan });
    playFixedPartial({ frequency: 110, at, duration: 0.058, level: 0.014 * scale, type: "triangle", pan });
  }

  function playGlass(intensity = 1, pan = 0) {
    if (!graph) return;
    const at = graph.context.currentTime + 0.004;
    const scale = clamp(intensity, 0.45, 1, 0.75);
    playNoiseClick({ at, duration: 0.024, level: 0.016 * scale, frequency: 2480, q: 2.2, pan });
    playFixedPartial({ frequency: 1318.51, at, duration: 0.19, level: 0.0075 * scale, pan });
    playFixedPartial({ frequency: 1975.53, at: at + 0.006, duration: 0.135, level: 0.0046 * scale, pan });
  }

  function playStateDetent(state, index = 0) {
    const specification = STATE_DETENTS[state];
    if (!graph || !specification) return;
    const at = graph.context.currentTime + 0.004;
    const position = Number.isFinite(Number(index)) ? ((Math.abs(Number(index)) % 5) - 2) * 0.055 : 0;
    specification.frequencies.forEach((frequency, frequencyIndex) => {
      playFixedPartial({
        frequency,
        at: at + frequencyIndex * 0.003,
        duration: specification.duration,
        level: specification.level * (frequencyIndex ? 0.54 : 1),
        type: frequencyIndex ? "sine" : "triangle",
        pan: position,
      });
    });
    playNoiseClick({
      at,
      duration: 0.025,
      level: specification.level * 0.72,
      frequency: 1720,
      q: 1.25,
      pan: position,
    });
  }

  function scheduleProjector() {
    view.clearTimeout(projectorTimer);
    projectorTimer = 0;
    if (!graph || !desiredEnabled || manuallyPaused || !visible() || graph.context.state !== "running") return;
    const delay = 7200 + Math.random() * 5600;
    projectorTimer = view.setTimeout(() => {
      projectorTimer = 0;
      if (cueAllowed("projector", 4.5)) playFilmGate(0.24, -0.12 + Math.random() * 0.24);
      scheduleProjector();
    }, delay);
  }

  function quietAndSuspend(fade = 0.22) {
    lifecycleRevision += 1;
    const revision = lifecycleRevision;
    view.clearTimeout(projectorTimer);
    projectorTimer = 0;
    view.clearTimeout(suspendTimer);
    suspendTimer = 0;
    if (!graph) return;
    fadeParameter(graph.master.gain, 0, fade, graph.context.currentTime);
    suspendTimer = view.setTimeout(() => {
      suspendTimer = 0;
      if (destroyed || revision !== lifecycleRevision || !graph || graph.context.state !== "running") return;
      graph.context.suspend().catch(() => {});
    }, Math.ceil((fade + 0.05) * 1000));
  }

  async function makeAudible() {
    if (destroyed || !desiredEnabled || manuallyPaused || !visible()) return false;
    let audioGraph;
    try {
      audioGraph = buildGraph();
    } catch {
      audioGraph = null;
    }
    if (!audioGraph) {
      desiredEnabled = false;
      syncToggles();
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

    fadeParameter(audioGraph.master.gain, ACTIVE_MASTER_LEVEL, 0.72, audioGraph.context.currentTime);
    scheduleProjector();
    return true;
  }

  function disarmUnlock() {
    if (!unlockArmed) return;
    unlockArmed = false;
    documentRoot.removeEventListener("pointerdown", handleUnlockGesture, true);
    documentRoot.removeEventListener("keydown", handleUnlockGesture, true);
  }

  function handleUnlockGesture(event) {
    if (event.target?.closest?.(toggleSelector)) return;
    disarmUnlock();
    makeAudible();
  }

  function armUnlock() {
    if (unlockArmed || destroyed || !desiredEnabled) return;
    unlockArmed = true;
    documentRoot.addEventListener("pointerdown", handleUnlockGesture, true);
    documentRoot.addEventListener("keydown", handleUnlockGesture, true);
  }

  async function enable({ persist = true } = {}) {
    if (destroyed) return false;
    desiredEnabled = true;
    manuallyPaused = false;
    if (persist) storePreference(view, true);
    syncToggles();
    disarmUnlock();
    const started = await makeAudible();
    if (!started && desiredEnabled) armUnlock();
    return started;
  }

  function disable({ persist = true } = {}) {
    if (destroyed) return false;
    desiredEnabled = false;
    if (persist) storePreference(view, false);
    disarmUnlock();
    syncToggles();
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

  function handleToggle() {
    if (desiredEnabled) disable();
    else enable();
  }

  function handleToggleKeydown(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handleToggle();
  }

  function handleContextState() {
    if (!graph || destroyed) return;
    if (graph.context.state === "interrupted" || (
      graph.context.state === "suspended" && desiredEnabled && !manuallyPaused && visible()
    )) {
      armUnlock();
    }
  }

  function normalizeState(detail) {
    if (typeof detail === "string") return detail.toLowerCase();
    if (!detail || typeof detail !== "object") return "";
    const explicit = detail.state ?? (typeof detail.value === "string" ? detail.value : "");
    if (explicit) return String(explicit).toLowerCase();
    if (detail.low === true) return "low";
    if (detail.medium === true) return "medium";
    if (detail.high === true) return "high";
    const index = Number(detail.index);
    return Number.isInteger(index) && index >= 0 && index < 3 ? ["low", "medium", "high"][index] : "";
  }

  function handleScene(event) {
    const detail = event.detail && typeof event.detail === "object" ? event.detail : {};
    const nextScene = detail.id == null ? null : String(detail.id);
    const changed = nextScene !== null && nextScene !== currentScene;
    if (nextScene !== null) currentScene = nextScene;

    if (graph && !motionPreference?.matches) {
      const progress = clamp(detail.progress, 0, 1, 0.5);
      const velocity = clamp(Math.abs(Number(detail.velocity)), 0, 2, 0);
      const energy = Math.min(1, velocity / 1.35);
      const time = graph.context.currentTime;
      graph.motionGain.gain.setTargetAtTime(0.00015 + energy * 0.0032, time, 0.085);
      graph.flutterFilter.frequency.setTargetAtTime(920 + progress * 720, time, 0.12);
      if (graph.motionPanner) graph.motionPanner.pan.setTargetAtTime((progress - 0.5) * 0.34, time, 0.14);
    } else if (graph) {
      graph.motionGain.gain.setTargetAtTime(0, graph.context.currentTime, 0.045);
    }

    if (changed && cueAllowed("scene", 0.32)) playFilmGate(0.52, 0);
  }

  function handleState(event) {
    const detail = event.detail;
    const state = normalizeState(detail);
    if (!STATE_DETENTS[state]) return;
    const index = detail && typeof detail === "object" ? Number(detail.index) || 0 : 0;
    const time = view.performance?.now?.() ?? Date.now();
    const stateKey = `${state}:${index}`;
    if (stateKey === lastStateKey && time - lastStateTime < 140) return;
    if (!cueAllowed("state", 0.065)) return;
    lastStateKey = stateKey;
    lastStateTime = time;
    playStateDetent(state, index);
  }

  function handleCommit(event) {
    const detail = event.detail && typeof event.detail === "object" ? event.detail : {};
    const kind = String(detail.kind || "commit").toLowerCase();
    if (!cueAllowed(`commit:${kind}`, 0.095)) return;
    const numericValue = Number(detail.value);
    const intensity = Number.isFinite(numericValue)
      ? 0.66 + Math.min(1, Math.abs(numericValue)) * 0.22
      : 0.76;
    const pan = clamp(detail.pan, -1, 1, 0);
    if (/glass|lens|plate|image|reveal|open/.test(kind)) playGlass(intensity, pan);
    else playRelay(intensity, pan);
  }

  function suppressMotionAudio() {
    if (!graph) return;
    graph.motionGain.gain.setTargetAtTime(0, graph.context.currentTime, 0.045);
  }

  function handleVisibility() {
    if (!visible()) {
      quietAndSuspend(0.16);
      return;
    }
    if (desiredEnabled && !manuallyPaused) resume();
  }

  function handlePageHide() {
    quietAndSuspend(0.08);
  }

  function handlePageShow() {
    if (desiredEnabled && !manuallyPaused && visible()) resume();
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    lifecycleRevision += 1;
    disarmUnlock();
    view.clearTimeout(suspendTimer);
    view.clearTimeout(projectorTimer);
    toggles.forEach((toggle) => {
      const handlers = toggleHandlers.get(toggle);
      if (!handlers) return;
      toggle.removeEventListener("click", handlers.click);
      if (handlers.keydown) toggle.removeEventListener("keydown", handlers.keydown);
    });
    documentRoot.removeEventListener("atlas:scene", handleScene);
    documentRoot.removeEventListener("atlas:state", handleState);
    documentRoot.removeEventListener("atlas:commit", handleCommit);
    documentRoot.removeEventListener("visibilitychange", handleVisibility);
    view.removeEventListener("pagehide", handlePageHide);
    view.removeEventListener("pageshow", handlePageShow);
    if (motionPreference?.removeEventListener) motionPreference.removeEventListener("change", suppressMotionAudio);
    else motionPreference?.removeListener?.(suppressMotionAudio);

    if (graph) {
      graph.context.removeEventListener?.("statechange", handleContextState);
      graph.persistent.forEach((node) => {
        try {
          node.stop?.();
        } catch {
          // Only source nodes have stop(), and they may already have ended.
        }
        try {
          node.disconnect();
        } catch {
          // Safe teardown for partially connected graphs.
        }
      });
      try {
        graph.context.close()?.catch?.(() => {});
      } catch {
        // The context may already have been closed by the browser lifecycle.
      }
      graph = null;
    }
    instances.delete(root);
  }

  toggles.forEach((toggle) => {
    const nonNative = !toggle.matches("button, input");
    const handlers = { click: handleToggle, keydown: nonNative ? handleToggleKeydown : null };
    toggleHandlers.set(toggle, handlers);
    toggle.addEventListener("click", handlers.click);
    if (handlers.keydown) toggle.addEventListener("keydown", handlers.keydown);
  });

  documentRoot.addEventListener("atlas:scene", handleScene);
  documentRoot.addEventListener("atlas:state", handleState);
  documentRoot.addEventListener("atlas:commit", handleCommit);
  documentRoot.addEventListener("visibilitychange", handleVisibility);
  view.addEventListener("pagehide", handlePageHide);
  view.addEventListener("pageshow", handlePageShow);
  if (motionPreference?.addEventListener) motionPreference.addEventListener("change", suppressMotionAudio);
  else motionPreference?.addListener?.(suppressMotionAudio);

  syncToggles();
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
