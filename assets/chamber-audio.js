/**
 * Atlas Observation Chamber — licensed-score audio director.
 *
 * Public entry points:
 *   createAtlasAudio(root = document)
 *   [data-sound-toggle] persistent semantic toggle
 *   root[data-audio-request="on|off"] early-entry request latch
 *   atlas:audio-request { enabled: boolean, source?: "entry" | string }
 *
 * Canonical transient-cue events:
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
 *     kind: "state-detent" | "comparison-slide" | "axis-collet" |
 *       "archive-open",
 *     id?: string,
 *     value?: string | number,
 *     pan?: number,
 *     interactionId: string
 *   }
 *
 * The licensed score is the only continuous source. Interface sounds are
 * short, dry, deterministic oscillator partials created only in response to a
 * visible commit. There is no room stem, noise buffer, hum, movement bed,
 * surface-probe source, autonomous tick, convolution tail, or per-frame audio.
 * Muting, lifecycle suspension, and score completion therefore resolve to
 * digital silence.
 *
 * Music: "Signal to Noise" by Scott Buckley, CC BY 4.0. See audio/CREDITS.md.
 */

const STORAGE_KEY = "atlas_sound_v1";
const ACTIVE_MASTER_LEVEL = 0.78;
const DESKTOP_MUSIC_LEVEL = 0.32;
const MOBILE_MUSIC_LEVEL = 0.26;
const FIRST_ENTRY_RAMP_SECONDS = 1.2;
const MAX_REMEMBERED_IDS = 160;
const instances = new WeakMap();

const STATE_DETENTS = Object.freeze({
  low: Object.freeze({
    partials: Object.freeze([
      Object.freeze({ frequency: 146.83, duration: 0.088, level: 0.017, type: "triangle" }),
      Object.freeze({ frequency: 220, delay: 0.003, duration: 0.072, level: 0.008, type: "sine" }),
      Object.freeze({ frequency: 880, delay: 0.001, duration: 0.026, level: 0.004, type: "sine" }),
    ]),
  }),
  medium: Object.freeze({
    partials: Object.freeze([
      Object.freeze({ frequency: 220, duration: 0.078, level: 0.016, type: "triangle" }),
      Object.freeze({ frequency: 329.63, delay: 0.003, duration: 0.064, level: 0.0075, type: "sine" }),
      Object.freeze({ frequency: 1174.66, delay: 0.001, duration: 0.023, level: 0.0038, type: "sine" }),
    ]),
  }),
  high: Object.freeze({
    partials: Object.freeze([
      Object.freeze({ frequency: 329.63, duration: 0.068, level: 0.014, type: "triangle" }),
      Object.freeze({ frequency: 493.88, delay: 0.003, duration: 0.055, level: 0.0065, type: "sine" }),
      Object.freeze({ frequency: 1567.98, delay: 0.001, duration: 0.021, level: 0.0034, type: "sine" }),
    ]),
  }),
});

const RELAY_PARTIALS = Object.freeze([
  Object.freeze({ frequency: 110, duration: 0.052, level: 0.013, type: "triangle" }),
  Object.freeze({ frequency: 987.77, delay: 0.001, duration: 0.027, level: 0.0056, type: "sine" }),
]);

const COMPARISON_PARTIALS = Object.freeze([
  Object.freeze({ frequency: 440, duration: 0.07, level: 0.012, type: "triangle" }),
  Object.freeze({ frequency: 1244.51, delay: 0.002, duration: 0.032, level: 0.0055, type: "sine" }),
  Object.freeze({ frequency: 1975.53, delay: 0.052, duration: 0.026, level: 0.0038, type: "sine" }),
]);

const AXIS_PARTIALS = Object.freeze([
  Object.freeze({ frequency: 220, duration: 0.086, level: 0.009, type: "triangle" }),
  Object.freeze({ frequency: 783.99, duration: 0.028, level: 0.0065, type: "sine" }),
  Object.freeze({ frequency: 1567.98, delay: 0.036, duration: 0.027, level: 0.0042, type: "sine" }),
]);

const GLASS_PARTIALS = Object.freeze([
  Object.freeze({ frequency: 659.26, duration: 0.19, level: 0.0067, type: "sine" }),
  Object.freeze({ frequency: 987.77, delay: 0.006, duration: 0.14, level: 0.0036, type: "sine" }),
  Object.freeze({ frequency: 2637.02, duration: 0.025, level: 0.003, type: "sine" }),
]);

const ARCHIVE_PARTIALS = Object.freeze([
  Object.freeze({ frequency: 329.63, duration: 0.24, level: 0.006, type: "sine" }),
  Object.freeze({ frequency: 493.88, delay: 0.018, duration: 0.2, level: 0.0035, type: "sine" }),
  Object.freeze({ frequency: 740, delay: 0.034, duration: 0.15, level: 0.0018, type: "sine" }),
  Object.freeze({ frequency: 1174.66, duration: 0.032, level: 0.0038, type: "triangle" }),
]);

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

function disconnectLater(view, nodes, milliseconds) {
  view.setTimeout(() => {
    for (const node of nodes) {
      try {
        node.disconnect();
      } catch {
        // The graph may have been destroyed before the transient completed.
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
    if (stateHost?.dataset) {
      stateHost.dataset.audioState = "unavailable";
      stateHost.dataset.audioMode = "score-unavailable";
    }
    for (const control of allControls(soundToggleSelector)) {
      control.setAttribute("aria-disabled", "true");
      if ("disabled" in control) control.disabled = true;
      control.setAttribute("aria-pressed", "false");
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
  let musicPlaying = false;
  let musicEnded = false;
  let musicRequested = false;
  let musicPlayPromise = null;
  let destroyed = false;
  let manuallyPaused = false;
  let unlockArmed = false;
  let suspendTimer = 0;
  let lifecycleRevision = 0;
  let lastTransitionCueTime = -Infinity;
  let lastFallbackInteractionTime = -Infinity;
  const interactionIds = new Set();
  const transitionIds = new Set();

  const isMobileMix = () => Boolean(coarsePointer?.matches || view.innerWidth < 760);
  const musicTarget = () => (isMobileMix() ? MOBILE_MUSIC_LEVEL : DESKTOP_MUSIC_LEVEL);
  const visible = () => documentRoot.visibilityState !== "hidden";

  function setAudioMode(mode) {
    if (stateHost?.dataset) stateHost.dataset.audioMode = mode;
  }

  function syncControls() {
    if (stateHost?.dataset) {
      stateHost.dataset.audioState = desiredEnabled
        ? (musicPlaying ? "on" : musicEnded ? "ended" : graph ? "loading" : "armed")
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
    return probe.canPlayType?.(opus.type) ? [opus, aac] : [aac, opus];
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
      const musicGate = context.createGain();
      const scoreDucker = context.createGain();
      const cueBus = context.createGain();

      master.gain.value = 0;
      musicGate.gain.value = 0;
      scoreDucker.gain.value = 1;
      cueBus.gain.value = isMobileMix() ? 0.5 : 0.6;
      limiter.threshold.value = -12;
      limiter.knee.value = 5;
      limiter.ratio.value = 10;
      limiter.attack.value = 0.003;
      limiter.release.value = 0.18;

      musicGate.connect(scoreDucker);
      scoreDucker.connect(limiter);
      cueBus.connect(limiter);
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

      graph = {
        context,
        master,
        musicGate,
        scoreDucker,
        cueBus,
        music,
        mediaSource,
        musicCandidates: musicCandidates(),
        musicCandidateIndex: -1,
      };

      music.addEventListener("playing", handleMusicPlaying);
      music.addEventListener("ended", handleMusicEnded);
      context.addEventListener?.("statechange", handleContextState);
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

  function playPartial({ frequency, delay = 0, duration, level, type = "sine" }, pan, levelScale) {
    if (!graph) return;
    const at = graph.context.currentTime + 0.004 + delay;
    const oscillator = graph.context.createOscillator();
    const stage = createStereoStage(graph.cueBus, pan);
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, at);
    stage.gain.gain.setValueAtTime(0, at);
    stage.gain.gain.linearRampToValueAtTime(level * levelScale, at + 0.0025);
    stage.gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    stage.gain.gain.setValueAtTime(0, at + duration + 0.001);
    oscillator.connect(stage.gain);
    oscillator.start(at);
    oscillator.stop(at + duration + 0.004);
    disconnectLater(view, [oscillator, ...stage.nodes], (delay + duration + 0.12) * 1000);
  }

  function playPartials(partials, pan = 0, levelScale = 1) {
    if (!graph) return;
    for (const partial of partials) playPartial(partial, pan, levelScale);
  }

  function duckScore(level = 0.86) {
    if (!graph || !musicPlaying || musicEnded) return;
    const parameter = graph.scoreDucker.gain;
    const at = graph.context.currentTime;
    try {
      if (typeof parameter.cancelAndHoldAtTime === "function") parameter.cancelAndHoldAtTime(at);
      else {
        parameter.cancelScheduledValues(at);
        parameter.setValueAtTime(parameter.value, at);
      }
      parameter.linearRampToValueAtTime(level, at + 0.045);
      parameter.setValueAtTime(level, at + 0.11);
      parameter.linearRampToValueAtTime(1, at + 0.28);
    } catch {
      parameter.value = 1;
    }
  }

  function playTransitionCue(from, to, direction) {
    if (!graph) return;
    duckScore(0.86);
    const pan = normalizeDirection(direction) * (isMobileMix() ? 0.07 : 0.12);
    const intensity = reducedMotion?.matches ? 0.56 : 0.76;
    const connects = (first, second) => (
      (from === first && to === second) || (from === second && to === first)
    );
    if (connects("control", "response")) {
      playPartials(RELAY_PARTIALS, pan, intensity);
    } else if (connects("response", "comparison")) {
      playPartials(COMPARISON_PARTIALS, pan, intensity);
    } else if (connects("comparison", "association")) {
      playPartials(AXIS_PARTIALS, pan, intensity);
    } else if (connects("association", "reconstruction")) {
      playPartials(GLASS_PARTIALS, pan, intensity);
    } else if (connects("reconstruction", "archive")) {
      playPartials(ARCHIVE_PARTIALS, pan, intensity * 0.82);
    } else {
      playPartials(RELAY_PARTIALS, pan, intensity * 0.8);
    }
  }

  function canPlayCue() {
    return Boolean(
      graph
      && entryConsentGranted
      && desiredEnabled
      && musicPlaying
      && !musicEnded
      && !manuallyPaused
      && visible()
      && graph.context.state === "running"
      && !graph.music.paused
    );
  }

  function handleTransition(event) {
    const detail = eventDetail(event);
    const phase = String(detail.phase || "").toLowerCase();
    const transitionId = String(detail.transitionId ?? detail.id ?? "").trim();
    if (transitionId && rememberId(transitionIds, `${transitionId}:${phase}`)) return;
    if (phase !== "cross" || !canPlayCue()) return;
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
    if (!canPlayCue()) return;
    const kind = String(detail.kind || "").toLowerCase();
    const detent = STATE_DETENTS[String(detail.value || "").toLowerCase()];
    if (!detent && !["state-detent", "comparison-slide", "axis-collet", "archive-open"].includes(kind)) {
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
    duckScore(0.87);
    if (kind === "state-detent" || detent) {
      playPartials((detent || STATE_DETENTS.medium).partials, pan);
    } else if (kind === "comparison-slide") {
      playPartials(COMPARISON_PARTIALS, pan);
    } else if (kind === "axis-collet") {
      playPartials(AXIS_PARTIALS, pan);
    } else if (kind === "archive-open") {
      playPartials(ARCHIVE_PARTIALS, pan);
    }
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
    if (musicEnded || graph.music.ended) return Promise.resolve(false);
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
    if (!desiredEnabled || manuallyPaused || !visible()) {
      graph.music.pause();
      return;
    }
    musicPlaying = true;
    musicEnded = false;
    setAudioMode("licensed-score");
    syncControls();
  }

  function handleMusicEnded() {
    if (!graph || destroyed) return;
    musicPlaying = false;
    musicEnded = true;
    setAudioMode("score-ended");
    syncControls();
    quietAndSuspend(0.08);
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
        parameter.linearRampToValueAtTime(target, at + FIRST_ENTRY_RAMP_SECONDS);
      } catch {
        parameter.value = target;
      }
    } else {
      holdAndRamp(parameter, target, 0.35, at);
    }
  }

  function disarmUnlock() {
    if (!unlockArmed) return;
    unlockArmed = false;
    documentRoot.removeEventListener("pointerdown", handleUnlockGesture, true);
    documentRoot.removeEventListener("keydown", handleUnlockGesture, true);
  }

  function handleUnlockGesture(event) {
    if (!entryConsentGranted) return;
    if (event.target?.closest?.(`${entrySelector}, ${soundToggleSelector}`)) return;
    disarmUnlock();
    void makeAudible();
  }

  function armUnlock() {
    if (unlockArmed || destroyed || !desiredEnabled || !entryConsentGranted || musicEnded) return;
    unlockArmed = true;
    documentRoot.addEventListener("pointerdown", handleUnlockGesture, true);
    documentRoot.addEventListener("keydown", handleUnlockGesture, true);
  }

  function quietAndSuspend(fade = 0.08) {
    lifecycleRevision += 1;
    const revision = lifecycleRevision;
    view.clearTimeout(suspendTimer);
    suspendTimer = 0;
    if (!graph) return;
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
    }, Math.ceil((fade + 0.025) * 1000));
  }

  async function makeAudible({ entryCue = false, restartIfEnded = false } = {}) {
    if (destroyed || !desiredEnabled || !entryConsentGranted || manuallyPaused || !visible()) return false;
    if (musicEnded && !restartIfEnded) return false;

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
    const revision = lifecycleRevision;
    view.clearTimeout(suspendTimer);
    suspendTimer = 0;

    // Calling play() before the first await retains the opt-in gesture on
    // Safari/iOS. Media remains gated until the context and entrance envelope
    // are opened below.
    const firstMusicEntrance = !musicRequested || restartIfEnded;
    const playback = playMusic({ restartIfEnded });
    musicRequested = true;

    try {
      if (audioGraph.context.state !== "running") await audioGraph.context.resume();
    } catch {
      armUnlock();
      return false;
    }
    if (
      destroyed
      || revision !== lifecycleRevision
      || !desiredEnabled
      || manuallyPaused
      || !visible()
    ) {
      audioGraph.music.pause();
      return false;
    }
    if (audioGraph.context.state !== "running") {
      armUnlock();
      return false;
    }

    const at = audioGraph.context.currentTime;
    holdAndRamp(audioGraph.master.gain, ACTIVE_MASTER_LEVEL, entryCue ? 0.08 : 0.3, at);
    scheduleMusicEntrance(firstMusicEntrance);
    if (entryCue) playPartials(RELAY_PARTIALS, 0, 0.9);
    setAudioMode(musicPlaying ? "licensed-score" : "licensed-score-loading");
    syncControls();

    const started = await playback;
    if (
      destroyed
      || revision !== lifecycleRevision
      || !desiredEnabled
      || manuallyPaused
      || !visible()
    ) {
      audioGraph.music.pause();
      return false;
    }
    if (!started && !destroyed && desiredEnabled && graph) {
      holdAndRamp(graph.master.gain, 0, 0.08, graph.context.currentTime);
      if (!musicEnded) setAudioMode("score-unavailable");
      syncControls();
    }
    return started;
  }

  async function enable({ persist = true, entryCue = false } = {}) {
    if (destroyed) return false;
    if (entryCue) entryConsentGranted = true;
    const alreadyAudible = Boolean(
      desiredEnabled
      && !manuallyPaused
      && graph
      && graph.context.state === "running"
      && !graph.music.paused
      && !musicEnded
    );
    const wasEnabled = desiredEnabled;
    const shouldPlayEntryCue = entryCue && (!wasEnabled || !graph);
    desiredEnabled = true;
    manuallyPaused = false;
    if (stateHost?.dataset) stateHost.dataset.audioRequest = "on";
    syncControls();
    disarmUnlock();
    if (alreadyAudible) {
      if (persist) storePreference(view, true);
      return true;
    }
    const started = await makeAudible({
      entryCue: shouldPlayEntryCue,
      restartIfEnded: musicEnded,
    });
    if (!started && desiredEnabled && !musicEnded) armUnlock();
    if (persist) storePreference(view, started);
    return started;
  }

  function disable({ persist = true } = {}) {
    if (destroyed) return false;
    desiredEnabled = false;
    if (stateHost?.dataset) stateHost.dataset.audioRequest = "off";
    if (persist) storePreference(view, false);
    disarmUnlock();
    setAudioMode("muted");
    syncControls();
    quietAndSuspend(0.06);
    return true;
  }

  function pause() {
    if (destroyed) return false;
    manuallyPaused = true;
    disarmUnlock();
    quietAndSuspend(0.08);
    return true;
  }

  async function resume() {
    if (destroyed) return false;
    manuallyPaused = false;
    if (!desiredEnabled || musicEnded) return false;
    const started = await makeAudible();
    if (!started) armUnlock();
    return started;
  }

  function handleDelegatedClick(event) {
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
      graph.context.state === "suspended"
      && desiredEnabled
      && !musicEnded
      && !manuallyPaused
      && visible()
    );
    if (needsGesture) armUnlock();
  }

  function handleVisibility() {
    if (!visible()) quietAndSuspend(0.08);
    else if (desiredEnabled && !musicEnded && !manuallyPaused) void resume();
  }

  function handlePageHide() {
    quietAndSuspend(0.05);
  }

  function handlePageShow() {
    if (desiredEnabled && !musicEnded && !manuallyPaused && visible()) void resume();
  }

  function handleMediaPreference() {
    if (!graph) return;
    graph.cueBus.gain.value = isMobileMix() ? 0.5 : 0.6;
    if (musicPlaying && !musicEnded) {
      holdAndRamp(graph.musicGate.gain, musicTarget(), 0.3, graph.context.currentTime);
    }
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    lifecycleRevision += 1;
    disarmUnlock();
    view.clearTimeout(suspendTimer);
    documentRoot.removeEventListener("click", handleDelegatedClick, true);
    documentRoot.removeEventListener("atlas:audio-request", handleAudioRequest);
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
        graph.master.gain.value = 0;
        graph.music.pause();
        graph.music.removeAttribute("src");
        graph.music.load();
        graph.mediaSource.disconnect();
      } catch {
        // A media element can already be detached during page teardown.
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
  documentRoot.addEventListener("atlas:transition", handleTransition);
  documentRoot.addEventListener("atlas:interaction", handleInteraction);
  documentRoot.addEventListener("visibilitychange", handleVisibility);
  view.addEventListener("pagehide", handlePageHide);
  view.addEventListener("pageshow", handlePageShow);
  if (reducedMotion?.addEventListener) reducedMotion.addEventListener("change", handleMediaPreference);
  else reducedMotion?.addListener?.(handleMediaPreference);
  if (coarsePointer?.addEventListener) coarsePointer.addEventListener("change", handleMediaPreference);
  else coarsePointer?.addListener?.(handleMediaPreference);

  setAudioMode(desiredEnabled ? "armed" : "muted");
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
