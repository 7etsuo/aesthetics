"use strict";

(() => {
  const MOTION = Object.freeze({
    quick: 100,
    standard: 420,
    slow: 560,
    easing: "cubic-bezier(.4,0,.2,1)",
  });
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const jsonRequests = new Map();
  let generatedId = 0;

  const all = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function setMotionPreference() {
    document.documentElement.dataset.motion = motionQuery.matches ? "reduced" : "full";
  }

  setMotionPreference();
  motionQuery.addEventListener?.("change", setMotionPreference);

  function finishState(root, className, duration = MOTION.standard) {
    if (motionQuery.matches) {
      root.classList.remove(className);
      return;
    }
    window.setTimeout(() => root.classList.remove(className), duration);
  }

  function normalisePrefix(value) {
    const prefix = String(value || "").trim();
    if (!prefix || /^[a-z][a-z\d+.-]*:/i.test(prefix) || prefix.startsWith("//")) return "";
    return prefix.endsWith("/") ? prefix : `${prefix}/`;
  }

  function assetPrefix(root) {
    const form = root?.matches?.("form[data-prefix]")
      ? root
      : root?.closest?.("form[data-prefix]");
    return normalisePrefix(form?.dataset.prefix ?? document.body?.dataset.prefix ?? "");
  }

  function loadJson(root, filename) {
    const url = `${assetPrefix(root)}assets/${filename}`;
    if (!jsonRequests.has(url)) {
      const request = fetch(url, {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      })
        .then((response) => {
          if (!response.ok) throw new Error(`Could not load ${filename} (${response.status})`);
          return response.json();
        })
        .catch((error) => {
          jsonRequests.delete(url);
          throw error;
        });
      jsonRequests.set(url, request);
    }
    return jsonRequests.get(url);
  }

  function loadExplorer(root) {
    return loadJson(root, "atlas-explorer.json").then((data) => {
      if (!data || typeof data !== "object") throw new Error("Explorer data is invalid");
      return data;
    });
  }

  function hookValue(node, hook) {
    const direct = node.getAttribute(hook);
    if (direct) return direct;
    return node.dataset.state || node.dataset.mode || node.value || "";
  }

  function comparable(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/^vec_/, "")
      .replace(/[^a-z\d]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function sameKey(a, b) {
    return comparable(a) === comparable(b);
  }

  function selectedControl(controls, hook) {
    return controls.find((control) => (
      control.checked
      || control.getAttribute("aria-pressed") === "true"
      || control.getAttribute("aria-selected") === "true"
      || control.classList.contains("is-active")
    )) || controls.find((control) => hookValue(control, hook)) || null;
  }

  function updateControls(controls, activeValue, hook) {
    controls.forEach((control) => {
      const active = sameKey(hookValue(control, hook), activeValue);
      control.classList.toggle("is-active", active);
      if (control.matches("input[type='radio'], input[type='checkbox']")) {
        control.checked = active;
        control.closest("label")?.classList.toggle("is-active", active);
      } else {
        control.setAttribute("aria-pressed", String(active));
      }
      if (control.getAttribute("role") === "tab") {
        control.setAttribute("aria-selected", String(active));
        control.tabIndex = active ? 0 : -1;
      }
    });
  }

  function bindChoice(control, callback) {
    if (control.matches("input, select")) {
      control.addEventListener("change", () => {
        if (!control.matches("input[type='radio'], input[type='checkbox']") || control.checked) {
          callback(control);
        }
      });
    } else {
      control.addEventListener("click", () => callback(control));
    }
  }

  function imageIn(node) {
    if (node.matches?.("img")) return node;
    return node.querySelector?.("img") || null;
  }

  function decodeImage(node) {
    const image = imageIn(node);
    if (!image) return Promise.resolve();
    image.loading = "eager";
    if (image.complete) {
      return image.naturalWidth
        ? Promise.resolve()
        : Promise.reject(new Error("Image could not be decoded"));
    }
    if (typeof image.decode === "function") return image.decode();
    return new Promise((resolve, reject) => {
      image.addEventListener("load", resolve, { once: true });
      image.addEventListener("error", () => reject(new Error("Image could not be loaded")), { once: true });
    });
  }

  function formatDecimal(value, digits = 2) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "—";
    return number.toFixed(digits).replace(/^(-?)0\./, "$1.");
  }

  function formatSigned(value, digits = 3) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "—";
    if (Math.abs(number) < 0.5 * (10 ** -digits)) return formatDecimal(0, digits);
    const magnitude = Math.abs(number).toFixed(digits).replace(/^0\./, ".");
    return `${number > 0 ? "+" : "−"}${magnitude}`;
  }

  function instrumentStatus(root, message) {
    const status = root.querySelector("[data-instrument-status]");
    if (status) status.textContent = message;
  }

  function motionComplete(duration = MOTION.slow) {
    if (motionQuery.matches) return Promise.resolve();
    return new Promise((resolve) => window.setTimeout(resolve, duration));
  }

  function createHeroScanner({ root, layers, controls, activeState, applyLayerState }) {
    const stage = root.querySelector("[data-hero-stage]");
    const scanStage = root.querySelector("[data-hero-scan-stage]") || stage;
    const toggle = root.querySelector("[data-hero-scan-toggle]");
    const scanControl = root.querySelector("[data-hero-scan-control]");
    const scan = root.querySelector("[data-hero-scan]");
    const output = root.querySelector("[data-hero-scan-output]");
    const toggleLabel = root.querySelector("[data-hero-scan-toggle-label]");
    const requiredStates = ["low", "medium", "high"];
    const layerFor = (state) => layers.find((layer) => sameKey(hookValue(layer, "data-hero-layer"), state));
    const available = stage && scanStage && toggle && scan && requiredStates.every(layerFor);
    if (!available) {
      return {
        exit: () => Promise.resolve(),
        isActive: () => false,
      };
    }

    const compareLabel = toggleLabel?.dataset.compareLabel
      || toggleLabel?.textContent.trim()
      || "Register 3 outputs";
    const isolateLabel = toggleLabel?.dataset.isolateLabel || "Isolate output";
    let comparisonActive = false;
    let comparisonPending = false;
    let transitionRevision = 0;
    let gesture = null;

    const stateLabel = (state) => {
      const control = controls.find((item) => sameKey(hookValue(item, "data-hero-state"), state));
      return control?.dataset.label
        || control?.closest("label")?.querySelector(".state-name, [data-state-name]")?.textContent.trim()
        || control?.closest("label")?.textContent.trim()
        || control?.textContent.trim()
        || state;
    };

    const observationId = (state) => layerFor(state)?.dataset.observationId || "";

    const setToggleState = (active) => {
      toggle.setAttribute("aria-pressed", String(active));
      toggle.setAttribute(
        "aria-label",
        active ? `Isolate ${stateLabel(activeState())}` : "Compare all three registered outputs",
      );
      if (toggleLabel) toggleLabel.textContent = active ? isolateLabel : compareLabel;
      if (scanControl) scanControl.hidden = !active;
      scan.hidden = !active;
      scan.disabled = !active;
    };

    const scanHalf = () => {
      const explicit = Number(scan.dataset.scanHalf);
      if (Number.isFinite(explicit) && explicit > 0) return explicit;
      const width = stage.getBoundingClientRect().width;
      if (!width) return 8;
      const pixels = Math.max(28, Math.min(44, width * 0.04));
      return (pixels / width) * 100;
    };

    const clampScan = (value) => {
      const minimum = Number(scan.min) || 12;
      const maximum = Number(scan.max) || 88;
      return Math.max(minimum, Math.min(maximum, Number(value)));
    };

    const setGates = (left, right) => {
      stage.style.setProperty("--gate-a", `${left}%`);
      stage.style.setProperty("--gate-b", `${right}%`);
    };

    const isolatedGates = (state) => {
      if (sameKey(state, "low")) return [100, 100];
      if (sameKey(state, "medium")) return [0, 100];
      return [0, 0];
    };

    const updateScan = (value) => {
      const position = clampScan(value);
      const half = scanHalf();
      setGates(Math.max(0, position - half), Math.min(100, position + half));
      scan.value = String(position);
      const rounded = Math.round(position);
      if (output) output.textContent = `${rounded}%`;
      scan.setAttribute(
        "aria-valuetext",
        `Comparison centered at ${rounded} percent. Left ${stateLabel("low")}; center ${stateLabel("medium")}; right ${stateLabel("high")}.`,
      );
    };

    const finishComparison = (state) => {
      comparisonActive = false;
      root.dataset.heroView = "isolate";
      stage.dataset.heroView = "isolate";
      root.classList.remove("is-scan-entering", "is-scan-exiting", "is-scan-dragging");
      setToggleState(false);
      applyLayerState(state);
    };

    const exit = async ({ state = activeState(), focus = false } = {}) => {
      const ticket = ++transitionRevision;
      if (comparisonPending && !comparisonActive) {
        comparisonPending = false;
        toggle.disabled = false;
        root.classList.remove("is-loading", "is-scan-entering", "is-scan-exiting", "is-scan-dragging");
        root.removeAttribute("aria-busy");
        setToggleState(false);
        instrumentStatus(root, `${stateLabel(state)} selected.`);
        return;
      }
      if (!comparisonActive) {
        setToggleState(false);
        return;
      }
      toggle.disabled = true;
      root.classList.remove("is-scan-entering", "is-scan-dragging");
      root.classList.add("is-scan-exiting");
      setGates(...isolatedGates(state));
      instrumentStatus(root, `Returning to ${stateLabel(state)}.`);
      await motionComplete(MOTION.slow);
      if (ticket !== transitionRevision) return;
      finishComparison(state);
      toggle.disabled = false;
      instrumentStatus(root, `${stateLabel(state)} isolated.`);
      if (focus) toggle.focus({ preventScroll: true });
    };

    const enter = async () => {
      if (comparisonActive) return;
      const ticket = ++transitionRevision;
      comparisonPending = true;
      toggle.disabled = true;
      root.classList.remove("has-error", "is-scan-exiting");
      root.classList.add("is-loading");
      root.setAttribute("aria-busy", "true");
      instrumentStatus(root, "Preparing the registered comparison.");
      try {
        await Promise.all(requiredStates.map((state) => decodeImage(layerFor(state))));
        if (ticket !== transitionRevision) return;
        comparisonPending = false;
        comparisonActive = true;
        setGates(...isolatedGates(activeState()));
        root.dataset.heroView = "compare";
        stage.dataset.heroView = "compare";
        root.classList.add("is-scan-entering");
        setToggleState(true);
        // The next frame separates a state change from the CSS gate transition;
        // there is no JavaScript tween and no synthesized image state.
        await new Promise((resolve) => window.requestAnimationFrame(resolve));
        if (ticket !== transitionRevision) return;
        updateScan(scan.value || 50);
        finishState(root, "is-scan-entering", MOTION.slow);
        const ids = requiredStates.map(observationId).filter(Boolean);
        instrumentStatus(
          root,
          `Registered comparison shown${ids.length ? `: ${ids.join(", ")}` : ""}. Three actual outputs; zero interpolated frames.`,
        );
      } catch {
        if (ticket !== transitionRevision) return;
        comparisonPending = false;
        finishComparison(activeState());
        root.classList.add("has-error");
        instrumentStatus(root, "The registered comparison could not be loaded. The selected output is still shown.");
      } finally {
        if (ticket === transitionRevision) {
          toggle.disabled = false;
          root.classList.remove("is-loading");
          root.removeAttribute("aria-busy");
        }
      }
    };

    const updateFromPointer = (event) => {
      const bounds = scanStage.getBoundingClientRect();
      if (!bounds.width) return;
      updateScan(((event.clientX - bounds.left) / bounds.width) * 100);
    };

    const endGesture = (event) => {
      if (!gesture || (event.pointerId !== undefined && event.pointerId !== gesture.id)) return;
      if (scanStage.hasPointerCapture?.(gesture.id)) scanStage.releasePointerCapture(gesture.id);
      gesture = null;
      root.classList.remove("is-scan-dragging");
    };

    toggle.hidden = false;
    scan.min = scan.min || "12";
    scan.max = scan.max || "88";
    scan.step = scan.step || "1";
    scan.value = scan.value || "50";
    setToggleState(false);
    setGates(...isolatedGates(activeState()));

    toggle.addEventListener("click", () => {
      if (comparisonActive) void exit();
      else void enter();
    });
    controls.forEach((control) => {
      control.addEventListener("click", () => {
        const requested = hookValue(control, "data-hero-state");
        if (comparisonActive && sameKey(requested, activeState())) void exit({ state: requested });
      });
    });
    scan.addEventListener("input", () => updateScan(scan.value));
    scan.addEventListener("change", () => {
      instrumentStatus(root, `Registered comparison centered at ${Math.round(Number(scan.value))} percent.`);
    });
    scan.addEventListener("pointerdown", () => root.classList.add("is-scan-dragging"));
    scan.addEventListener("pointerup", () => root.classList.remove("is-scan-dragging"));
    scan.addEventListener("pointercancel", () => root.classList.remove("is-scan-dragging"));

    scanStage.addEventListener("pointerdown", (event) => {
      if (!comparisonActive || event.button !== 0 || event.target.closest("button, input, label, a, figcaption")) return;
      gesture = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        active: event.pointerType !== "touch",
      };
      if (gesture.active) {
        scanStage.setPointerCapture(event.pointerId);
        root.classList.add("is-scan-dragging");
        updateFromPointer(event);
      }
    });
    scanStage.addEventListener("pointermove", (event) => {
      if (!comparisonActive || !gesture || event.pointerId !== gesture.id) return;
      if (!gesture.active) {
        const deltaX = Math.abs(event.clientX - gesture.startX);
        const deltaY = Math.abs(event.clientY - gesture.startY);
        if (deltaX < 8 || deltaX <= deltaY * 1.2) return;
        gesture.active = true;
        scanStage.setPointerCapture(event.pointerId);
        root.classList.add("is-scan-dragging");
      }
      event.preventDefault();
      updateFromPointer(event);
    });
    scanStage.addEventListener("pointerup", endGesture);
    scanStage.addEventListener("pointercancel", endGesture);
    root.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !comparisonActive || event.isComposing) return;
      event.preventDefault();
      event.stopPropagation();
      void exit({ focus: true });
    }, { capture: true });

    const observer = typeof ResizeObserver === "function"
      ? new ResizeObserver(() => { if (comparisonActive) updateScan(scan.value); })
      : null;
    observer?.observe(stage);

    return {
      exit: (state) => exit({ state }),
      isActive: () => comparisonActive || comparisonPending,
    };
  }

  function bootHeroInstruments() {
    all("[data-hero-instrument]").forEach((root) => {
      const controls = all("[data-hero-state]", root);
      const layers = all("[data-hero-layer]", root);
      if (!controls.length || !layers.length) return;

      let revision = 0;
      let active = root.dataset.activeState
        || hookValue(selectedControl(controls, "data-hero-state"), "data-hero-state")
        || hookValue(layers.find((layer) => layer.classList.contains("is-active")) || layers[0], "data-hero-layer");

      const applyLayerState = (state) => {
        layers.forEach((layer) => {
          const on = sameKey(hookValue(layer, "data-hero-layer"), state);
          layer.classList.toggle("is-active", on);
          layer.setAttribute("aria-hidden", String(!on));
        });
        updateControls(controls, state, "data-hero-state");
        root.dataset.activeState = state;
      };

      const updateScores = (level, heroData = null) => {
        const scoreRoot = root.querySelector("[data-hero-score]");
        if (!scoreRoot || !level) return;
        all("[data-score], [data-vector-id], [data-hero-score-value]", scoreRoot).forEach((node) => {
          const key = node.dataset.score || node.dataset.vectorId || node.dataset.heroScoreValue;
          const score = (level.scores || []).find((item) => (
            sameKey(item.vector_id, key) || sameKey(item.name, key)
          ));
          node.textContent = score ? formatDecimal(score.value, 2) : "—";
          const metric = node.closest("[data-hero-metric], .hero-metric");
          if (metric) metric.style.setProperty("--score", score ? String(score.value) : "0");
        });
        all("[data-hero-observation]", root).forEach((node) => {
          node.textContent = level.observation_id || level.id || "—";
        });
        all("[data-hero-label]", root).forEach((node) => {
          node.textContent = level.label || level.requested_level || level.level || "";
        });
        const notes = Array.isArray(level.notes) ? level.notes : (level.notes ? [level.notes] : []);
        const changes = Array.isArray(level.unintended_changes) ? level.unintended_changes : [];
        const noteText = [...notes, ...changes.map((change) => `“${change}”`)].filter(Boolean).join(" · ");
        all("[data-hero-note]", root).forEach((node) => {
          const label = node.querySelector("span");
          const message = noteText || "No additional field note recorded.";
          if (!label) {
            node.textContent = message;
            return;
          }
          label.textContent = changes.length ? "Observed spillover" : "Protocol note";
          Array.from(node.childNodes).forEach((child) => {
            if (child !== label) child.remove();
          });
          node.append(document.createTextNode(` ${message}`));
        });

        if (heroData) {
          const low = (heroData.levels || []).find((item) => sameKey(item.requested_level || item.level, "low"));
          all("[data-hero-delta]", root).forEach((node) => {
            const vectorId = node.dataset.heroDelta || heroData.vector_id;
            const lowScore = (low?.scores || []).find((item) => sameKey(item.vector_id, vectorId));
            const activeScore = (level.scores || []).find((item) => sameKey(item.vector_id, vectorId));
            node.textContent = lowScore && activeScore
              ? `Δ ${formatSigned(Number(activeScore.value) - Number(lowScore.value), 2)}`
              : "Δ —";
          });
        }
      };

      applyLayerState(active);
      const scanner = createHeroScanner({
        root,
        layers,
        controls,
        activeState: () => active,
        applyLayerState,
      });
      root.classList.add("is-enhanced", "is-ready");

      controls.forEach((control) => bindChoice(control, async () => {
        const requested = hookValue(control, "data-hero-state");
        if (!requested) return;
        if (scanner.isActive()) await scanner.exit(requested);
        if (sameKey(requested, active)) return;
        const destination = layers.find((layer) => sameKey(hookValue(layer, "data-hero-layer"), requested));
        if (!destination) return;

        const previous = active;
        const ticket = ++revision;
        root.classList.remove("has-error");
        root.classList.add("is-loading", "is-changing");
        root.setAttribute("aria-busy", "true");
        instrumentStatus(root, `Loading ${requested} state.`);

        const dataRequest = loadExplorer(root).catch(() => null);
        try {
          await decodeImage(destination);
          if (ticket !== revision) return;
          active = requested;
          applyLayerState(active);
          instrumentStatus(root, `${requested} state selected.`);
          finishState(root, "is-changing", MOTION.standard);
        } catch {
          if (ticket !== revision) return;
          updateControls(controls, previous, "data-hero-state");
          root.classList.remove("is-changing");
          root.classList.add("has-error");
          instrumentStatus(root, "That image could not be loaded. The previous state is still shown.");
          return;
        } finally {
          if (ticket === revision) {
            root.classList.remove("is-loading");
            root.removeAttribute("aria-busy");
          }
        }

        const data = await dataRequest;
        if (ticket !== revision) return;
        if (!data) {
          const scoreRoot = root.querySelector("[data-hero-score]");
          if (scoreRoot) {
            all("[data-score], [data-vector-id], [data-hero-score-value]", scoreRoot)
              .forEach((node) => { node.textContent = "—"; });
          }
          root.classList.add("has-error");
          instrumentStatus(root, `${requested} state selected. Its score data is temporarily unavailable.`);
          return;
        }
        const level = (data.hero?.levels || []).find((item) => (
          sameKey(item.requested_level || item.level, requested)
        ));
        updateScores(level, data.hero);
      }));
    });
  }

  function responseRow(item) {
    const value = Number(item.value);
    const sign = value > 0 ? "positive" : value < 0 ? "negative" : "neutral";
    const row = document.createElement("li");
    row.className = "response-row";
    row.dataset.sign = sign;
    row.style.setProperty("--magnitude", `${Math.min(50, Math.abs(value) * 50)}%`);

    const name = document.createElement("span");
    name.className = "response-name";
    name.textContent = item.name || item.vector_id || "Unnamed dimension";

    const track = document.createElement("span");
    track.className = "response-track";
    track.setAttribute("aria-hidden", "true");
    const fill = document.createElement("span");
    fill.className = "response-fill";
    track.append(fill);

    const displayed = document.createElement("span");
    displayed.className = "response-value";
    displayed.textContent = formatSigned(value, 3);

    const support = Number(item.n_pairs);
    row.setAttribute(
      "aria-label",
      `${name.textContent}: ${displayed.textContent}${Number.isFinite(support) ? `, ${support} paired scenes` : ""}`,
    );
    row.append(name, track, displayed);
    return row;
  }

  function renderResponse(chart, response) {
    const list = document.createElement("ol");
    list.className = "response-chart-list";
    list.setAttribute("role", "list");
    (response.mean_response_delta || response.deltas || [])
      .filter((item) => Math.abs(Number(item.value)) >= 0.0005)
      .slice(0, 7)
      .forEach((item) => {
        const row = responseRow(item);
        row.setAttribute("role", "listitem");
        list.append(row);
      });
    chart.replaceChildren(list);
    chart.dataset.axis = response.vector_id || "";
    chart.setAttribute("aria-label", `${response.name || "Selected axis"} mean high-minus-low response`);
  }

  function bootResponseInstruments() {
    all("[data-response-instrument]").forEach((root) => {
      const controls = all("[data-response-axis]", root);
      const chart = root.querySelector("[data-response-chart]");
      if (!controls.length || !chart) return;
      let revision = 0;
      let active = root.dataset.activeAxis
        || hookValue(selectedControl(controls, "data-response-axis"), "data-response-axis");
      if (active) updateControls(controls, active, "data-response-axis");
      root.classList.add("is-enhanced", "is-ready");

      controls.forEach((control) => bindChoice(control, async () => {
        const requested = hookValue(control, "data-response-axis");
        if (!requested || sameKey(requested, active)) return;
        const previous = active;
        const ticket = ++revision;
        updateControls(controls, requested, "data-response-axis");
        root.classList.remove("has-error");
        root.classList.add("is-loading", "is-changing");
        root.setAttribute("aria-busy", "true");

        try {
          const data = await loadExplorer(root);
          if (ticket !== revision) return;
          const response = (data.responses || []).find((item) => sameKey(item.vector_id, requested));
          if (!response) throw new Error("No response data for this axis");
          renderResponse(chart, response);
          active = requested;
          root.dataset.activeAxis = active;
          all("[data-response-meta]", root).forEach((node) => {
            node.textContent = `n=${response.n_pairs || 0} paired scenes · high − low`;
          });
          instrumentStatus(root, `${response.name || requested} response shown. ${response.n_pairs || 0} paired scenes.`);
          finishState(root, "is-changing", MOTION.standard);
        } catch {
          if (ticket !== revision) return;
          updateControls(controls, previous, "data-response-axis");
          root.classList.remove("is-changing");
          root.classList.add("has-error");
          instrumentStatus(root, "Response data could not be loaded. The previous view is still shown.");
        } finally {
          if (ticket === revision) {
            root.classList.remove("is-loading");
            root.removeAttribute("aria-busy");
          }
        }
      }));
    });
  }

  function bootContextInstruments() {
    all("[data-context-instrument]").forEach((root) => {
      const controls = all("[data-context-mode]", root);
      const panels = all("[data-context-panel]", root);
      if (!controls.length || !panels.length) return;
      let revision = 0;
      let active = root.dataset.activeMode
        || hookValue(selectedControl(controls, "data-context-mode"), "data-context-mode")
        || hookValue(panels[0], "data-context-panel");

      const apply = (mode) => {
        panels.forEach((panel) => {
          const on = sameKey(hookValue(panel, "data-context-panel"), mode);
          panel.classList.toggle("is-active", on);
          panel.hidden = !on;
          panel.setAttribute("aria-hidden", String(!on));
        });
        updateControls(controls, mode, "data-context-mode");
        root.dataset.activeMode = mode;
      };

      apply(active);
      root.classList.add("is-enhanced", "is-ready");
      controls.forEach((control) => bindChoice(control, async () => {
        const requested = hookValue(control, "data-context-mode");
        if (!requested || sameKey(requested, active)) return;
        const destination = panels.find((panel) => sameKey(hookValue(panel, "data-context-panel"), requested));
        if (!destination) return;

        const previous = active;
        const ticket = ++revision;
        updateControls(controls, requested, "data-context-mode");
        root.classList.remove("has-error");
        root.classList.add("is-loading", "is-changing");
        root.setAttribute("aria-busy", "true");
        try {
          await Promise.all(all("img", destination).map((image) => decodeImage(image)));
          if (ticket !== revision) return;
          active = requested;
          apply(active);
          instrumentStatus(root, `${requested} comparison shown.`);
          finishState(root, "is-changing", MOTION.standard);
        } catch {
          if (ticket !== revision) return;
          updateControls(controls, previous, "data-context-mode");
          root.classList.remove("is-changing");
          root.classList.add("has-error");
          instrumentStatus(root, "That comparison could not be loaded. The previous view is still shown.");
        } finally {
          if (ticket === revision) {
            root.classList.remove("is-loading");
            root.removeAttribute("aria-busy");
          }
        }
      }));
    });
  }

  function correlationsForAxis(data, axis) {
    return (data.correlations || [])
      .filter((item) => sameKey(item.a, axis) || sameKey(item.b, axis))
      .map((item) => ({
        ...item,
        other: sameKey(item.a, axis) ? item.b : item.a,
        other_name: sameKey(item.a, axis) ? item.b_name : item.a_name,
      }))
      .sort((left, right) => Math.abs(Number(right.r)) - Math.abs(Number(left.r)));
  }

  function svgElement(name, attributes = {}) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  }

  function fanLabelLayout() {
    if (window.matchMedia("(max-width: 390px)").matches) {
      return {
        spacing: 112,
        minimumY: 58,
        maximumY: 578,
        leftX: 450,
        rightX: 550,
        valueDy: 46,
      };
    }
    if (window.matchMedia("(max-width: 768px)").matches) {
      return {
        spacing: 74,
        minimumY: 54,
        maximumY: 586,
        leftX: 430,
        rightX: 570,
        valueDy: 34,
      };
    }
    return {
      spacing: 46,
      minimumY: 54,
      maximumY: 594,
      leftX: null,
      rightX: null,
      valueDy: 18,
    };
  }

  function resolveFanLabels(geometry, layout) {
    const {
      spacing,
      minimumY,
      maximumY,
    } = layout;
    const positions = new Map();

    ["left", "right"].forEach((side) => {
      const entries = geometry
        .filter((item) => item.side === side)
        .map((item) => ({
          ...item,
          desiredY: Math.max(minimumY, Math.min(maximumY, item.endY - 10)),
        }))
        .sort((a, b) => a.desiredY - b.desiredY
          || String(a.item.other || a.item.other_name || "").localeCompare(String(b.item.other || b.item.other_name || ""))
          || a.index - b.index);
      if (!entries.length) return;

      const pack = (items) => {
        const center = items.reduce((sum, item) => sum + item.desiredY, 0) / items.length;
        const span = spacing * (items.length - 1);
        const start = Math.max(minimumY, Math.min(maximumY - span, center - span / 2));
        return { items, start, end: start + span };
      };

      let clusters = entries.map((entry) => pack([entry]));
      let merged = true;
      while (merged && clusters.length > 1) {
        merged = false;
        const next = [];
        for (let index = 0; index < clusters.length; index += 1) {
          const current = clusters[index];
          const following = clusters[index + 1];
          if (following && current.end + spacing > following.start) {
            next.push(pack([...current.items, ...following.items]));
            index += 1;
            merged = true;
          } else {
            next.push(current);
          }
        }
        clusters = next;
      }

      clusters.forEach((cluster) => {
        cluster.items.forEach((entry, index) => {
          positions.set(entry.index, cluster.start + index * spacing);
        });
      });
    });

    return positions;
  }

  function renderBasisFan(target, correlations, axisName) {
    if (!target) return;
    const rays = correlations.slice(0, 6);
    const origin = { x: 500, y: 570 };
    const length = 400;
    const titleId = `basis-fan-title-${++generatedId}`;
    const descriptionId = `basis-fan-description-${generatedId}`;
    const svg = svgElement("svg", {
      class: "basis-fan-svg",
      viewBox: "0 0 1000 640",
      role: "img",
      "aria-labelledby": `${titleId} ${descriptionId}`,
      focusable: "false",
      preserveAspectRatio: "xMidYMid meet",
    });
    svg.dataset.axis = axisName || "";

    const title = svgElement("title", { id: titleId });
    title.textContent = `${axisName || "Selected dimension"}: six strongest observed correlations`;
    const description = svgElement("desc", { id: descriptionId });
    description.textContent = [
      "All rays have equal length. Each ray angle is the arccosine of its Pearson r value.",
      ...rays.map((item) => `${item.other_name || item.other}: r ${formatSigned(item.r, 4)}.`),
      "The complete values are available in the adjacent table.",
    ].join(" ");
    svg.append(title, description);

    const reference = svgElement("g", { class: "basis-fan-reference", "aria-hidden": "true" });
    reference.append(
      svgElement("path", {
        class: "basis-fan-arc",
        d: `M ${origin.x - length} ${origin.y} A ${length} ${length} 0 0 1 ${origin.x + length} ${origin.y}`,
      }),
      svgElement("line", {
        class: "basis-fan-baseline",
        x1: origin.x - length,
        y1: origin.y,
        x2: origin.x + length,
        y2: origin.y,
      }),
    );
    svg.append(reference);

    const geometry = rays.map((item, index) => {
      const coefficient = Math.max(-1, Math.min(1, Number(item.r)));
      const theta = Math.acos(coefficient);
      const degrees = theta * (180 / Math.PI);
      const endX = origin.x + length * Math.cos(theta);
      const endY = origin.y - length * Math.sin(theta);
      return {
        item,
        index,
        coefficient,
        theta,
        degrees,
        endX,
        endY,
        side: endX < origin.x ? "left" : "right",
      };
    });
    const labelLayout = fanLabelLayout();
    const labelPositions = resolveFanLabels(geometry, labelLayout);

    geometry.forEach(({ item, index, coefficient, degrees, endX, endY, side }) => {
      const sign = coefficient > 0 ? "positive" : coefficient < 0 ? "negative" : "neutral";
      const group = svgElement("g", {
        class: "basis-fan-ray",
        "data-sign": sign,
        "data-label-side": side,
        "data-r": coefficient.toFixed(6),
        "data-theta-degrees": degrees.toFixed(4),
      });
      group.style.setProperty("--fan-index", String(index));
      group.style.setProperty("--fan-delay", `${Math.floor(index / 2) * MOTION.quick}ms`);

      const line = svgElement("line", {
        class: "basis-fan-line",
        x1: origin.x,
        y1: origin.y,
        x2: endX.toFixed(3),
        y2: endY.toFixed(3),
        pathLength: "1",
      });
      const endpoint = svgElement("circle", {
        class: "basis-fan-endpoint",
        cx: endX.toFixed(3),
        cy: endY.toFixed(3),
        r: "5",
      });

      const pointsLeft = side === "left";
      const labelX = pointsLeft
        ? labelLayout.leftX ?? Math.max(210, Math.min(470, endX - 16))
        : labelLayout.rightX ?? Math.min(790, Math.max(530, endX + 16));
      const labelY = labelPositions.get(index)
        ?? Math.max(labelLayout.minimumY, Math.min(labelLayout.maximumY, endY - 10));
      const leaderTargetX = labelX + (pointsLeft ? 7 : -7);
      const leaderTargetY = labelY - 5;
      const leader = svgElement("path", {
        class: "basis-fan-label-leader",
        d: `M ${endX.toFixed(3)} ${endY.toFixed(3)} L ${leaderTargetX.toFixed(3)} ${leaderTargetY.toFixed(3)}`,
        "aria-hidden": "true",
      });
      const label = svgElement("text", {
        class: "basis-fan-label",
        x: labelX.toFixed(3),
        y: labelY.toFixed(3),
        "text-anchor": pointsLeft ? "end" : "start",
        "data-label-y": labelY.toFixed(3),
      });
      const name = svgElement("tspan", {
        class: "basis-fan-label-name",
        x: labelX.toFixed(3),
        dy: "0",
      });
      name.textContent = item.other_name || item.other || "Unnamed dimension";
      const value = svgElement("tspan", {
        class: "basis-fan-label-value",
        x: labelX.toFixed(3),
        dy: String(labelLayout.valueDy),
      });
      value.textContent = `r ${formatSigned(coefficient, 4)}`;
      label.append(name, value);
      group.append(line, endpoint, leader, label);
      svg.append(group);
    });

    const originMark = svgElement("circle", {
      class: "basis-fan-origin",
      cx: origin.x,
      cy: origin.y,
      r: "7",
      "aria-hidden": "true",
    });
    svg.append(originMark);
    target.replaceChildren(svg);
    target.dataset.axis = axisName || "";
    if (motionQuery.matches) svg.classList.add("is-drawn");
    else window.requestAnimationFrame(() => svg.classList.add("is-drawn"));
  }

  function renderCorrelationRuler(ruler, correlations, axisName) {
    const list = document.createElement("ol");
    list.className = "correlation-list";
    list.setAttribute("role", "list");

    correlations.slice(0, 6).forEach((item) => {
      const value = Number(item.r);
      const mark = document.createElement("li");
      mark.className = "correlation-mark";
      mark.dataset.sign = value > 0 ? "positive" : value < 0 ? "negative" : "neutral";
      mark.style.setProperty("--position", `${Math.max(0, Math.min(100, ((value + 1) / 2) * 100))}%`);
      mark.setAttribute("role", "listitem");

      const name = document.createElement("span");
      name.className = "correlation-name";
      name.textContent = item.other_name || item.other || "Unnamed dimension";

      const line = document.createElement("span");
      line.className = "correlation-line";
      line.setAttribute("aria-hidden", "true");
      const dot = document.createElement("span");
      dot.className = "correlation-dot";
      line.append(dot);

      const displayed = document.createElement("span");
      displayed.className = "correlation-value";
      displayed.textContent = formatSigned(value, 4);
      mark.setAttribute("aria-label", `${name.textContent}: Pearson r ${displayed.textContent}`);
      mark.append(name, line, displayed);
      list.append(mark);
    });

    const previousList = ruler.querySelector(".correlation-list");
    if (previousList) previousList.replaceWith(list);
    else ruler.append(list);
    ruler.dataset.axis = axisName || "";
    ruler.setAttribute("aria-label", `Strongest correlations with ${axisName || "the selected axis"}`);
  }

  function renderCorrelationTable(target, correlations, axisName) {
    const body = target.matches("tbody") ? target : target.querySelector("tbody");
    if (!body) return;
    const fragment = document.createDocumentFragment();
    correlations.forEach((item) => {
      const row = document.createElement("tr");
      const dimension = document.createElement("th");
      dimension.scope = "row";
      dimension.textContent = item.other_name || item.other || "Unnamed dimension";
      const coefficient = document.createElement("td");
      coefficient.textContent = formatSigned(item.r, 4);
      const support = document.createElement("td");
      support.textContent = Number.isFinite(Number(item.n)) ? String(item.n) : "—";
      row.append(dimension, coefficient, support);
      fragment.append(row);
    });
    body.replaceChildren(fragment);
    const table = target.matches("table") ? target : target.querySelector("table") || target.closest("table");
    const caption = table?.querySelector("caption");
    if (caption && axisName) caption.textContent = `Pearson correlations with ${axisName}`;
  }

  function bootCorrelationInstruments() {
    all("[data-correlation-instrument]").forEach((root) => {
      const controls = all("[data-correlation-axis]", root);
      const ruler = root.querySelector("[data-correlation-ruler]");
      const table = root.querySelector("[data-correlation-table]");
      const fan = root.querySelector("[data-basis-fan]");
      if (!controls.length || !ruler) return;
      let revision = 0;
      let active = root.dataset.activeAxis
        || hookValue(selectedControl(controls, "data-correlation-axis"), "data-correlation-axis");
      if (active) updateControls(controls, active, "data-correlation-axis");
      root.classList.add("is-enhanced", "is-ready");

      if (fan && typeof IntersectionObserver === "function") {
        const observer = new IntersectionObserver((entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer.disconnect();
          const requested = active;
          const ticket = revision;
          if (!requested) return;

          void loadExplorer(root)
            .then((data) => {
              // A deliberate axis change owns the fan if it began while the
              // quiet fallback upgrade was loading.
              if (ticket !== revision || !sameKey(requested, active)) return;
              const correlations = correlationsForAxis(data, requested);
              if (!correlations.length) return;
              const control = controls.find((item) => (
                sameKey(hookValue(item, "data-correlation-axis"), requested)
              ));
              const label = control?.dataset.label
                || control?.textContent.trim()
                || requested;
              renderBasisFan(fan, correlations, label);
            })
            .catch(() => {
              // Keep the complete server-rendered fallback unchanged.
            });
        }, {
          rootMargin: "320px 0px",
          threshold: 0,
        });
        observer.observe(fan);
      }

      controls.forEach((control) => bindChoice(control, async () => {
        const requested = hookValue(control, "data-correlation-axis");
        const fanNeedsContent = fan && !fan.querySelector("svg");
        if (!requested || (sameKey(requested, active) && !fanNeedsContent)) return;
        const previous = active;
        const ticket = ++revision;
        updateControls(controls, requested, "data-correlation-axis");
        root.classList.remove("has-error");
        root.classList.add("is-loading", "is-changing");
        root.setAttribute("aria-busy", "true");

        try {
          const data = await loadExplorer(root);
          if (ticket !== revision) return;
          const correlations = correlationsForAxis(data, requested);
          if (!correlations.length) throw new Error("No complete correlations for this axis");
          const label = control.dataset.label || control.textContent.trim() || requested;
          renderCorrelationRuler(ruler, correlations, label);
          if (fan) renderBasisFan(fan, correlations, label);
          if (table) renderCorrelationTable(table, correlations, label);
          active = requested;
          root.dataset.activeAxis = active;
          instrumentStatus(root, `${label} correlations shown. ${correlations.length} complete relationships.`);
          finishState(root, "is-changing", MOTION.standard);
        } catch {
          if (ticket !== revision) return;
          updateControls(controls, previous, "data-correlation-axis");
          root.classList.remove("is-changing");
          root.classList.add("has-error");
          instrumentStatus(root, "Correlation data could not be loaded. The previous view is still shown.");
        } finally {
          if (ticket === revision) {
            root.classList.remove("is-loading");
            root.removeAttribute("aria-busy");
          }
        }
      }));
    });
  }

  function bootResidualPanels() {
    all("[data-residual-toggle]").forEach((button) => {
      const controlledId = button.getAttribute("aria-controls");
      const scope = button.closest("[data-reconstruction], section, article") || document;
      const panel = (controlledId ? document.getElementById(controlledId) : null)
        || scope.querySelector("[data-residual-panel]");
      if (!panel) return;
      if (!panel.id) panel.id = `residual-panel-${++generatedId}`;
      button.setAttribute("aria-controls", panel.id);
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(expanded));
      panel.hidden = !expanded;
      panel.classList.toggle("is-open", expanded);

      button.addEventListener("click", () => {
        const open = button.getAttribute("aria-expanded") !== "true";
        button.setAttribute("aria-expanded", String(open));
        panel.hidden = !open;
        panel.classList.toggle("is-open", open);
        panel.closest("[data-reconstruction], section, article")?.classList.add("is-changing");
        const container = panel.closest("[data-reconstruction], section, article");
        if (container) finishState(container, "is-changing", MOTION.slow);
      });
    });
  }

  function normaliseFilter(value) {
    const filter = comparable(value);
    if (filter === "hypothesized" || filter === "hypothesised") return "hypothesis";
    return filter || "all";
  }

  function searchScore(row, query) {
    const name = String(row.name || "").toLowerCase();
    const id = String(row.id || "").toLowerCase();
    const text = `${name} ${id} ${row.kind || ""} ${row.text || ""}`.toLowerCase();
    const tokens = query.split(/\s+/).filter(Boolean);
    if (!tokens.every((token) => text.includes(token))) return -1;
    let score = tokens.length;
    if (name === query || id === query) score += 12;
    if (name.startsWith(query)) score += 6;
    if (id.startsWith(query)) score += 4;
    if (name.includes(query)) score += 2;
    return score;
  }

  function internalHref(prefix, href) {
    const value = String(href || "");
    if (/^[a-z][a-z\d+.-]*:/i.test(value) || value.startsWith("/") || value.startsWith("#")) return value;
    return `${prefix}${value}`;
  }

  function resultNode(row, prefix, listContainer) {
    const link = document.createElement("a");
    link.className = "search-hit";
    link.href = internalHref(prefix, row.href);

    const kind = document.createElement("span");
    kind.className = "search-kind k";
    kind.textContent = row.kind || "Record";
    const name = document.createElement("span");
    name.className = "search-name";
    name.textContent = row.name || row.id || "Untitled record";
    const meta = document.createElement("span");
    meta.className = "search-meta";
    meta.textContent = row.id || row.status || "";
    link.append(kind, name, meta);

    if (!listContainer) return link;
    const item = document.createElement("li");
    item.append(link);
    return item;
  }

  function searchForms() {
    const forms = [
      ...all("form[data-atlas-search]"),
      ...all("[data-atlas-search] form"),
      ...all("form.search"),
    ];
    return forms.filter((form, index) => forms.indexOf(form) === index);
  }

  function bootSearch() {
    const controllers = [];

    searchForms().forEach((form, formIndex) => {
      const searchRoot = form.matches("[data-atlas-search]")
        ? form
        : form.closest("[data-atlas-search]") || form;
      const scope = form.closest("[data-search-scope]") || searchRoot.parentElement || searchRoot;
      const input = form.querySelector("input[type='search']");
      const results = searchRoot.querySelector("[data-search-results], .hits")
        || scope.querySelector("[data-search-results], .hits");
      if (!input || !results) return;

      if (!results.id) results.id = `atlas-search-results-${formIndex + 1}-${++generatedId}`;
      input.setAttribute("aria-controls", results.id);
      input.setAttribute("autocomplete", "off");
      results.setAttribute("role", "region");
      results.setAttribute("aria-label", "Search results");
      results.setAttribute("aria-live", "polite");
      results.hidden = true;
      let rows = null;
      let runVersion = 0;
      let activeFilter = "all";
      const filterButtons = all("[data-search-filter]", scope);
      const limit = Number(searchRoot.dataset.searchLimit || (form.closest("dialog") ? 10 : 16));

      const close = () => {
        results.replaceChildren();
        results.hidden = true;
        results.classList.remove("is-open");
        results.style.removeProperty("display");
      };

      const show = (fragment) => {
        results.replaceChildren(fragment);
        results.hidden = false;
        results.classList.add("is-open");
        results.style.display = "block";
      };

      const ensureRows = async () => {
        if (rows) return rows;
        searchRoot.classList.add("is-loading");
        try {
          const data = await loadJson(form, "index.json");
          rows = Array.isArray(data) ? data : [];
          return rows;
        } finally {
          searchRoot.classList.remove("is-loading");
        }
      };

      const run = async ({ allowEmpty = false } = {}) => {
        const version = ++runVersion;
        const query = input.value.trim().toLowerCase();
        if (!query && !allowEmpty && activeFilter === "all") {
          close();
          return;
        }

        let index;
        try {
          index = await ensureRows();
        } catch {
          if (version !== runVersion) return;
          const error = document.createElement("div");
          error.className = "search-empty empty";
          error.textContent = "Search is temporarily unavailable.";
          show(error);
          return;
        }
        if (version !== runVersion) return;

        const found = index
          .map((row) => ({ row, score: query ? searchScore(row, query) : 0 }))
          .filter(({ row, score }) => (
            score >= 0
            && (
              activeFilter === "all"
              || normaliseFilter(row.evidence) === activeFilter
              || normaliseFilter(row.status) === activeFilter
            )
          ))
          .sort((left, right) => right.score - left.score
            || String(left.row.name || "").localeCompare(String(right.row.name || "")))
          .slice(0, Number.isFinite(limit) && limit > 0 ? limit : 16)
          .map(({ row }) => row);

        const fragment = document.createDocumentFragment();
        if (!found.length) {
          const empty = document.createElement("div");
          empty.className = "search-empty empty";
          empty.textContent = "No matching record. Try a more literal visual property.";
          fragment.append(empty);
        } else {
          const listContainer = results.matches("ul, ol");
          found.forEach((row) => fragment.append(resultNode(row, assetPrefix(form), listContainer)));
        }
        show(fragment);
      };

      input.addEventListener("focus", () => { void ensureRows().catch(() => {}); });
      input.addEventListener("input", () => { void run(); });
      input.addEventListener("keydown", (event) => {
        const links = all("a", results);
        if (event.key === "ArrowDown" && links.length) {
          event.preventDefault();
          links[0].focus();
        } else if (event.key === "Escape" && !form.closest("dialog[open]")) {
          input.value = "";
          close();
        }
      });
      results.addEventListener("keydown", (event) => {
        const links = all("a", results);
        const index = links.indexOf(document.activeElement);
        if (event.key === "ArrowDown" && links.length) {
          event.preventDefault();
          links[Math.min(links.length - 1, index + 1)].focus();
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          if (index <= 0) input.focus();
          else links[index - 1].focus();
        } else if (event.key === "Escape" && !form.closest("dialog[open]")) {
          event.preventDefault();
          input.focus();
          close();
        }
      });
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        void run({ allowEmpty: activeFilter !== "all" }).then(() => results.querySelector("a")?.focus());
      });

      filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
          activeFilter = normaliseFilter(button.getAttribute("data-search-filter") || button.value || "all");
          filterButtons.forEach((candidate) => {
            const selected = normaliseFilter(candidate.getAttribute("data-search-filter") || candidate.value || "all") === activeFilter;
            candidate.classList.toggle("is-active", selected);
            candidate.setAttribute("aria-pressed", String(selected));
          });
          void run({ allowEmpty: true });
        });
      });

      document.addEventListener("pointerdown", (event) => {
        if (!scope.contains(event.target)) close();
      });
      controllers.push({ form, input, results, close });
    });

    document.addEventListener("keydown", (event) => {
      const target = event.target;
      const typing = target instanceof HTMLInputElement
        || target instanceof HTMLTextAreaElement
        || target instanceof HTMLSelectElement
        || target?.isContentEditable;
      if (event.key !== "/" || typing || event.metaKey || event.ctrlKey || event.altKey) return;
      const dialogTrigger = document.querySelector("[data-search-open]");
      if (dialogTrigger && dialogForTrigger(dialogTrigger)) {
        event.preventDefault();
        dialogTrigger.click();
        return;
      }
      const available = controllers.find(({ form }) => !form.closest("dialog:not([open])"));
      if (!available) return;
      event.preventDefault();
      available.input.focus();
    });
  }

  function dialogForTrigger(trigger) {
    const controlled = trigger.getAttribute("aria-controls") || trigger.dataset.searchOpen;
    if (controlled) {
      const candidate = document.getElementById(controlled.replace(/^#/, ""));
      if (candidate?.matches("[data-search-dialog]")) return candidate;
    }
    return document.querySelector("[data-search-dialog]");
  }

  function bootSearchDialogs() {
    const returnFocus = new WeakMap();
    all("[data-search-open]").forEach((trigger) => {
      const controlledDialog = dialogForTrigger(trigger);
      if (controlledDialog) {
        if (!controlledDialog.id) controlledDialog.id = `atlas-search-dialog-${++generatedId}`;
        trigger.setAttribute("aria-haspopup", "dialog");
        trigger.setAttribute("aria-controls", controlledDialog.id);
        trigger.setAttribute("aria-expanded", String(controlledDialog.open));
      }
      trigger.addEventListener("click", (event) => {
        const dialog = dialogForTrigger(trigger);
        if (!dialog) return;
        event.preventDefault();
        returnFocus.set(dialog, trigger);
        trigger.setAttribute("aria-expanded", "true");
        if (!dialog.open) {
          if (typeof dialog.showModal === "function") dialog.showModal();
          else dialog.setAttribute("open", "");
        }
        const searchInput = dialog.querySelector("input[type='search']");
        searchInput?.focus({ preventScroll: true });
        if (searchInput && document.activeElement !== searchInput) {
          window.requestAnimationFrame(() => searchInput.focus({ preventScroll: true }));
        }
      });
    });

    all("[data-search-dialog]").forEach((dialog) => {
      dialog.addEventListener("keydown", (event) => {
        if (event.key !== "Escape" || event.isComposing || !dialog.open) return;
        event.preventDefault();
        event.stopPropagation();
        if (typeof dialog.close === "function") dialog.close();
        else dialog.removeAttribute("open");
      }, { capture: true });
      all("[data-search-close]", dialog).forEach((button) => {
        button.addEventListener("click", () => {
          if (typeof dialog.close === "function") dialog.close();
          else dialog.removeAttribute("open");
        });
      });
      dialog.addEventListener("click", (event) => {
        if (event.target !== dialog) return;
        if (typeof dialog.close === "function") dialog.close();
        else dialog.removeAttribute("open");
      });
      dialog.addEventListener("close", () => {
        const trigger = returnFocus.get(dialog);
        if (trigger) {
          trigger.setAttribute("aria-expanded", "false");
          if (trigger.isConnected) trigger.focus();
        }
      });
    });
  }

  function bootCompare() {
    all("[data-compare]").forEach((stage) => {
      const pane = stage.querySelector(".compare-b");
      const range = stage.querySelector(".compare-range, input[type='range']");
      if (!range) return;

      const set = (percent) => {
        const value = Math.max(Number(range.min) || 4, Math.min(Number(range.max) || 96, Number(percent)));
        stage.style.setProperty("--split", `${value}%`);
        if (pane && !stage.hasAttribute("data-compare-clip")) pane.style.width = `${value}%`;
        range.value = String(value);
        const output = stage.querySelector("[data-compare-value]");
        if (output) output.textContent = `${Math.round(value)}%`;
      };
      const fromPointer = (event) => {
        const bounds = stage.getBoundingClientRect();
        if (!bounds.width) return;
        set(((event.clientX - bounds.left) / bounds.width) * 100);
      };

      set(range.value);
      range.addEventListener("input", () => set(range.value));
      stage.addEventListener("pointerdown", (event) => {
        if (event.button !== 0 || event.target === range || event.target.closest("a, button")) return;
        stage.setPointerCapture(event.pointerId);
        fromPointer(event);
      });
      stage.addEventListener("pointermove", (event) => {
        if (stage.hasPointerCapture(event.pointerId)) fromPointer(event);
      });
    });
  }

  function boot() {
    bootHeroInstruments();
    bootResponseInstruments();
    bootContextInstruments();
    bootCorrelationInstruments();
    bootResidualPanels();
    bootSearchDialogs();
    bootSearch();
    bootCompare();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
