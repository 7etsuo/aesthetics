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

      const updateScores = (level) => {
        const scoreRoot = root.querySelector("[data-hero-score]");
        if (!scoreRoot || !level) return;
        all("[data-score], [data-vector-id], [data-hero-score-value]", scoreRoot).forEach((node) => {
          const key = node.dataset.score || node.dataset.vectorId || node.dataset.heroScoreValue;
          const score = (level.scores || []).find((item) => (
            sameKey(item.vector_id, key) || sameKey(item.name, key)
          ));
          node.textContent = score ? formatDecimal(score.value, 2) : "—";
        });
        all("[data-hero-observation]", root).forEach((node) => {
          node.textContent = level.observation_id || level.id || "—";
        });
        all("[data-hero-label]", root).forEach((node) => {
          node.textContent = level.label || level.requested_level || level.level || "";
        });
        const notes = Array.isArray(level.notes) ? level.notes : (level.notes ? [level.notes] : []);
        const changes = Array.isArray(level.unintended_changes) ? level.unintended_changes : [];
        const haze = (level.scores || []).find((item) => sameKey(item.vector_id, "vec_atmospheric_haze_response"));
        const highOnly = haze
          ? [`atmospheric haze ${formatDecimal(haze.value, 2)}`, ...changes.map((change) => `“${change}”`)]
          : [];
        const noteText = (highOnly.length ? highOnly : [...notes, ...changes]).filter(Boolean).join(" · ");
        all("[data-hero-note]", root).forEach((node) => {
          const label = node.querySelector("span");
          const message = noteText || "No additional field note recorded.";
          if (!label) {
            node.textContent = message;
            return;
          }
          label.textContent = highOnly.length ? "High-only annotation" : "Protocol note";
          Array.from(node.childNodes).forEach((child) => {
            if (child !== label) child.remove();
          });
          node.append(document.createTextNode(` ${message}`));
        });
      };

      applyLayerState(active);
      root.classList.add("is-enhanced", "is-ready");

      controls.forEach((control) => bindChoice(control, async () => {
        const requested = hookValue(control, "data-hero-state");
        if (!requested || sameKey(requested, active)) return;
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
        updateScores(level);
      }));
    });
  }

  function responseRow(item) {
    const value = Number(item.value);
    const sign = value > 0 ? "positive" : value < 0 ? "negative" : "neutral";
    const row = document.createElement("li");
    row.className = "response-row";
    row.dataset.sign = sign;
    row.style.setProperty("--magnitude", `${Math.min(100, Math.abs(value) * 100)}%`);

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
      if (!controls.length || !ruler) return;
      let revision = 0;
      let active = root.dataset.activeAxis
        || hookValue(selectedControl(controls, "data-correlation-axis"), "data-correlation-axis");
      if (active) updateControls(controls, active, "data-correlation-axis");
      root.classList.add("is-enhanced", "is-ready");

      controls.forEach((control) => bindChoice(control, async () => {
        const requested = hookValue(control, "data-correlation-axis");
        if (!requested || sameKey(requested, active)) return;
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
    link.append(kind, name);

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
      input.setAttribute("aria-expanded", "false");
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
        input.setAttribute("aria-expanded", "false");
      };

      const show = (fragment) => {
        results.replaceChildren(fragment);
        results.hidden = false;
        results.classList.add("is-open");
        results.style.display = "block";
        input.setAttribute("aria-expanded", "true");
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
        if (pane) pane.style.width = `${value}%`;
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
