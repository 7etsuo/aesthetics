
async function bootSearch() {
  const form = document.querySelector(".search");
  if (!form) return;
  const prefix = form.dataset.prefix || "";
  const box = document.getElementById("q");
  const hits = document.getElementById("hits");
  let data = [];
  try { data = await (await fetch(prefix + "assets/index.json")).json(); } catch (e) { return; }
  const run = () => {
    const q = (box.value || "").trim().toLowerCase();
    if (!q) { hits.style.display = "none"; hits.innerHTML = ""; return; }
    const found = data.filter((row) => (row.name + " " + row.id + " " + row.text).toLowerCase().includes(q)).slice(0, 16);
    hits.innerHTML = found.map((row) =>
      `<a href="${prefix}${row.href}"><span class="k">${row.kind}</span>${row.name}</a>`
    ).join("") || `<a>No match</a>`;
    hits.style.display = "block";
  };
  box.addEventListener("input", run);
  form.addEventListener("submit", (e) => { e.preventDefault(); run(); });
}

function bootField() {
  const canvas = document.getElementById("field");
  if (!canvas) return;
  let nodes = [];
  try { nodes = JSON.parse(canvas.dataset.field || "{}").nodes || []; } catch (e) { return; }
  if (!nodes.length) return;
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, t = 0;
  const points = nodes.map((n, i) => {
    const u = (i / nodes.length) * Math.PI * 2;
    const v = 0.45 + (i % 3) * 0.18;
    return { ...n, u, v, r: 0.28 + Math.abs(n.w) * 0.55 };
  });
  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function project(p, rot) {
    const x = Math.cos(p.u + rot) * Math.sin(p.v) * p.r;
    const y = Math.cos(p.v) * p.r;
    const z = Math.sin(p.u + rot) * Math.sin(p.v) * p.r;
    const f = 2.1 / (2.4 + z);
    return { x: w/2 + x * Math.min(w,h) * 0.42 * f, y: h/2 + y * Math.min(w,h) * 0.42 * f, z, f };
  }
  function frame() {
    t += 0.004;
    ctx.clearRect(0, 0, w, h);
    const g = ctx.createRadialGradient(w/2, h/2, 10, w/2, h/2, Math.min(w,h)*0.55);
    g.addColorStop(0, "rgba(255,106,61,0.08)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
    const proj = points.map((p) => ({ p, s: project(p, t) })).sort((a,b) => a.s.z - b.s.z);
    ctx.strokeStyle = "rgba(159,212,255,0.16)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    proj.forEach((item, i) => {
      if (item.p.w <= 0) return;
      if (i === 0) ctx.moveTo(item.s.x, item.s.y);
      else ctx.lineTo(item.s.x, item.s.y);
    });
    ctx.closePath(); ctx.stroke();
    proj.forEach((item) => {
      const glow = 4 + item.p.w * 16;
      ctx.beginPath();
      ctx.fillStyle = item.p.w > 0 ? "rgba(255,106,61,0.95)" : "rgba(159,212,255,0.55)";
      ctx.shadowColor = item.p.w > 0 ? "rgba(255,106,61,0.7)" : "rgba(159,212,255,0.35)";
      ctx.shadowBlur = glow;
      ctx.arc(item.s.x, item.s.y, 3 + item.p.w * 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(244,241,236,0.78)";
      ctx.font = "11px Outfit, sans-serif";
      ctx.fillText(item.p.name, item.s.x + 8, item.s.y + 4);
    });
    requestAnimationFrame(frame);
  }
  resize();
  window.addEventListener("resize", resize);
  frame();
}

bootSearch();
bootField();
