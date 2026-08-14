
async function boot() {
  const form = document.querySelector(".search");
  if (!form) return;
  const prefix = form.dataset.prefix || "";
  const box = document.getElementById("q");
  const hits = document.getElementById("hits");
  let data = [];
  try {
    const res = await fetch(prefix + "assets/index.json");
    data = await res.json();
  } catch (err) {
    return;
  }
  const run = () => {
    const q = (box.value || "").trim().toLowerCase();
    if (!q) { hits.style.display = "none"; hits.innerHTML = ""; return; }
    const found = data.filter((row) =>
      (row.name + " " + row.id + " " + row.text).toLowerCase().includes(q)
    ).slice(0, 18);
    hits.innerHTML = found.map((row) =>
      `<a href="${prefix}${row.href}"><span class="k">${row.kind}</span>${row.name} <span class="k">${row.id}</span></a>`
    ).join("") || `<a>No match for ${q}</a>`;
    hits.style.display = "block";
  };
  box.addEventListener("input", run);
  form.addEventListener("submit", (e) => { e.preventDefault(); run(); });
}
boot();
