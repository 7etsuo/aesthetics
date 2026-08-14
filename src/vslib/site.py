"""Searchable static site generated from the same records as the wiki."""

from __future__ import annotations

import json
import shutil
from pathlib import Path

from vslib.matrices import nearest_aesthetics
from vslib.store import Library

CSS = """
:root {
  --bg: #09090b;
  --fog: #a3a3a8;
  --white: #f4f1ec;
  --line: rgba(255,255,255,0.12);
  --hot: #ff6a3d;
  --ice: #9fd4ff;
  --ok: #8fdbb0;
}
* { box-sizing: border-box; }
html {
  margin: 0; padding: 0;
  overflow-x: hidden;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}
body {
  margin: 0; padding: 0;
  background: var(--bg); color: var(--white);
  font: 16px/1.5 "Outfit", "Helvetica Neue", sans-serif;
  letter-spacing: -0.011em;
  overflow-x: hidden;
  max-width: 100%;
}
img, video, svg { max-width: 100%; display: block; }
.field-wrap canvas { width: 100%; height: 100%; display: block; }
a { color: inherit; text-decoration: none; }
a:hover { color: var(--ice); }
code, .mono, input, kbd {
  font-family: "JetBrains Mono", ui-monospace, monospace;
}
.grain {
  pointer-events: none; position: fixed; inset: 0; z-index: 40; opacity: 0.09;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}
nav.float {
  position: fixed; top: 0; left: 0; right: 0; z-index: 30;
  display: flex; flex-wrap: wrap; align-items: center; gap: 0.45rem 0.85rem;
  padding: 0.75rem 4.5vw;
  background: linear-gradient(to bottom, rgba(9,9,11,0.78), rgba(9,9,11,0));
  backdrop-filter: blur(10px);
}
nav.float .mark {
  font-family: "Syne", sans-serif; font-weight: 700; letter-spacing: 0.18em;
  font-size: 0.92rem;
}
nav.float a {
  font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(244,241,236,0.62);
}
nav.float a[aria-current="page"], nav.float a:hover { color: var(--white); }
.hero {
  position: relative;
  min-height: 100svh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
}
.hero-media {
  position: absolute; inset: 0; overflow: hidden;
}
.hero-photo {
  position: absolute; inset: 0;
  width: 100%; height: 100%; max-width: none;
  object-fit: cover; object-position: 68% 42%;
}
.hero-shade {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(9,9,11,0.18) 0%, rgba(9,9,11,0.08) 42%, rgba(9,9,11,0.62) 100%);
}
.hero-hud {
  position: relative; z-index: 2;
  padding: 6.5rem 4.5vw 2.2rem;
  max-width: 1240px; width: 100%; margin: 0 auto;
}
.kicker {
  font-size: 0.72rem; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--hot); margin: 0 0 0.6rem;
}
h1.display {
  font-family: "Syne", sans-serif; font-weight: 750;
  font-size: clamp(2.1rem, 7vw, 6.4rem); line-height: 0.92;
  letter-spacing: -0.045em; margin: 0 0 0.7rem; max-width: 16ch;
}
.eq-live {
  font-family: "JetBrains Mono", monospace;
  font-size: clamp(0.72rem, 1.5vw, 1.02rem);
  line-height: 1.75; color: rgba(244,241,236,0.88);
  margin: 0 0 1.3rem;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.eq-live a { border-bottom: 1px solid rgba(159,212,255,0.35); display: inline; }
.eq-live .w { color: var(--hot); }
.eq-live .v { color: var(--ice); }
.rack {
  display: flex; gap: 1.1rem; align-items: flex-end; flex-wrap: wrap;
}
.fader { width: 56px; text-align: center; }
.fader-col {
  height: 160px; width: 10px; margin: 0 auto 0.45rem;
  background: rgba(255,255,255,0.08);
  border-radius: 99px; position: relative; overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
}
.fader-col .fill {
  position: absolute; left: 0; right: 0; bottom: 0;
  background: linear-gradient(180deg, var(--hot), #ffb089);
  box-shadow: 0 0 18px rgba(255,106,61,0.45);
  animation: rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.fader .n { font-size: 0.62rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--fog); }
.fader .w { font-family: "JetBrains Mono", monospace; font-size: 0.72rem; color: var(--hot); }
@keyframes rise { from { height: 0; } }
.sheet { max-width: 1240px; margin: 0 auto; padding: 5.2rem 4.5vw 5rem; }
.hero + .sheet { padding-top: 2rem; }
.table-wrap { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.search input {
  width: 100%; background: #111114; color: var(--white);
  border: 1px solid var(--line); padding: 0.85rem 1rem; font-size: 1rem;
  border-radius: 999px;
}
.search input:focus { outline: 1px solid var(--ice); }
.hits { background: #111114; border: 1px solid var(--line); border-radius: 12px; display: none; margin-top: 0.4rem; }
.hits a { display: block; padding: 0.5rem 0.8rem; color: var(--white); }
.hits a:hover { background: #1a1a1f; }
.hits .k { color: var(--hot); font-size: 0.7rem; margin-right: 0.5rem; }
h1.page {
  font-family: "Syne", sans-serif; font-weight: 700;
  font-size: clamp(2rem, 5vw, 3.6rem); letter-spacing: -0.04em;
  line-height: 0.95; margin: 0 0 0.6rem;
}
h2 {
  font-size: 0.72rem; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--hot); font-weight: 500; margin: 2.2rem 0 0.8rem;
}
.lede { color: var(--fog); max-width: 62ch; font-size: 1.05rem; }
.meta { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0.8rem 0 1.2rem; }
.chip {
  font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase;
  border: 1px solid var(--line); padding: 0.18rem 0.5rem; border-radius: 999px; color: var(--fog);
}
.chip.provisional { border-color: rgba(255,106,61,0.45); color: #ffc2ad; }
.chip.canonical { border-color: var(--ok); color: var(--ok); }
.chip.vague, .chip.rejected, .chip.near_alias { border-color: #7a3b32; color: #f0b0a6; }
.chip.composite, .chip.system { border-color: rgba(159,212,255,0.4); color: var(--ice); }
.rail {
  display: flex; gap: 0.7rem; overflow-x: auto; scroll-snap-type: x mandatory;
  padding: 0.2rem 0 1rem;
}
.rail::-webkit-scrollbar { height: 6px; }
.rail::-webkit-scrollbar-thumb { background: #2a2a30; border-radius: 99px; }
.plate {
  flex: 0 0 min(78vw, 360px); scroll-snap-align: start;
  position: relative; overflow: hidden; border-radius: 14px;
  background: #111;
  box-shadow: 0 30px 80px rgba(0,0,0,0.45);
  transform: translateZ(0);
  transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
}
.plate:hover { transform: translateY(-6px) scale(1.015); }
.plate img { width: 100%; height: 420px; object-fit: cover; display: block; }
.plate .cap {
  position: absolute; left: 0; right: 0; bottom: 0;
  padding: 2.2rem 0.8rem 0.7rem;
  background: linear-gradient(transparent, rgba(0,0,0,0.78));
  font-family: "JetBrains Mono", monospace; font-size: 0.72rem;
}
.field-wrap {
  position: relative; height: min(62vh, 560px); margin: 1rem 0 2rem;
  border-radius: 16px; overflow: hidden; background: #070708;
  box-shadow: inset 0 0 80px rgba(255,106,61,0.08);
}
.field-wrap canvas { width: 100%; height: 100%; display: block; }
.axis-film { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.45rem; }
.axis-film img {
  width: 100%; aspect-ratio: 1; object-fit: cover; display: block;
  border-radius: 10px;
}
.axis-card {
  background: #111114; border: 1px solid var(--line); border-radius: 16px;
  overflow: hidden; padding: 0.7rem;
}
.axis-card h3 { margin: 0.55rem 0 0.15rem; font-family: "Syne", sans-serif; font-size: 1.15rem; }
.grid-axes { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 0.9rem; }
table { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
th, td { text-align: left; padding: 0.4rem 0.3rem; border-bottom: 1px solid var(--line); }
th { font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--fog); }
.bar { height: 6px; background: #1c1c20; width: 120px; display: inline-block; border-radius: 99px; }
.bar > span { display: block; height: 100%; background: var(--hot); border-radius: 99px; }
.strip.levels { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
.strip img, .thumb img { width: 100%; height: auto; display: block; border-radius: 10px; background: #111; }
.caption { font-size: 0.72rem; color: var(--fog); font-family: "JetBrains Mono", monospace; margin-top: 0.25rem; }
.anchor-row { display: grid; grid-template-columns: 120px 1fr 1fr 1fr; gap: 0.45rem; margin-bottom: 0.7rem; }
.anchor-row .an { font-size: 0.78rem; color: var(--fog); padding-top: 0.3rem; }
.card {
  background: #111114; border: 1px solid var(--line); border-radius: 16px; padding: 1rem;
}
.card h3 { margin: 0 0 0.4rem; font-family: "Syne", sans-serif; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }
footer { margin-top: 3rem; color: #6b6b72; font-size: 0.78rem; }
.mast {
  position: relative; height: 42vh; min-height: 260px; overflow: hidden;
  border-radius: 0 0 22px 22px; margin-bottom: 1.4rem;
}
.mast img { width: 100%; height: 100%; max-width: none; object-fit: cover; object-position: 60% 40%; display: block; }
.mast .shade {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(9,9,11,0.15), rgba(9,9,11,0.82));
}
.mast .in { position: absolute; left: 4.5vw; right: 4.5vw; bottom: 1.1rem; }
.mast .in .page { font-size: clamp(1.6rem, 6vw, 3.2rem); }
@media (prefers-reduced-motion: reduce) {
  .hero-photo { animation: none; transform: none; }
  .fader-col .fill { animation: none; }
}
@media (max-width: 1100px) {
  .grid-axes { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
}
@media (max-width: 860px) {
  nav.float a:not(.mark) { font-size: 0.64rem; letter-spacing: 0.08em; }
  .hero { min-height: 100svh; }
  .hero-hud { padding-top: 5.2rem; }
  h1.display { font-size: clamp(1.9rem, 11vw, 3.4rem); }
  .fader { width: 48px; }
  .fader-col { height: 110px; }
  .plate { flex-basis: min(84vw, 320px); }
  .plate img { height: 260px; }
  .grid-2 { grid-template-columns: 1fr; }
  .anchor-row { grid-template-columns: 1fr 1fr 1fr; }
  .anchor-row .an { grid-column: 1 / -1; padding-top: 0.8rem; }
  .field-wrap { height: min(52vh, 420px); }
  .mast { height: 38vh; min-height: 200px; }
}
@media (max-width: 560px) {
  nav.float { gap: 0.35rem 0.65rem; }
  nav.float a.nav-more { display: none; }
  .rack { gap: 0.7rem; }
  .fader { width: 44px; }
  .eq-live { font-size: 0.74rem; }
  .strip.levels { grid-template-columns: 1fr; }
}
"""


def generate_site(lib: Library) -> None:
    site = lib.root / "site"
    if site.exists():
        shutil.rmtree(site)
    site.mkdir(parents=True)
    (site / "assets").mkdir()
    (site / "assets" / "app.css").write_text(CSS, encoding="utf-8")
    (site / "assets" / "index.json").write_text(json.dumps(_search_index(lib)), encoding="utf-8")
    _page(site / "index.html", "Atlas", _home(lib), nav="home", hero=True)
    _page(site / "vectors.html", "Vectors", _vector_index(lib), nav="vectors")
    _page(site / "families.html", "Families", _family_index(lib), nav="families")
    _page(site / "aesthetics.html", "Aesthetics", _aesthetic_index(lib), nav="aesthetics")
    _page(site / "aliases.html", "Aliases", _alias_index(lib), nav="aliases")
    _page(site / "studies.html", "Studies", _study_index(lib), nav="studies")
    _page(site / "questions.html", "Questions", _questions(lib), nav="questions")
    _page(site / "matrices.html", "Matrices", _matrices(lib), nav="matrices")
    for folder in ("vectors", "aesthetics", "studies", "families", "observations"):
        (site / folder).mkdir()
    for vec in lib.vectors.values():
        _page(site / "vectors" / f"{vec.id}.html", vec.canonical_name, _vector_page(lib, vec.id), nav="vectors")
    for aes in lib.aesthetics.values():
        _page(site / "aesthetics" / f"{aes.id}.html", aes.canonical_name, _aesthetic_page(lib, aes.id), nav="aesthetics")
    for study in lib.studies.values():
        _page(site / "studies" / f"{study.id}.html", study.title, _study_page(lib, study.id), nav="studies")
    for fam in lib.families.values():
        _page(site / "families" / f"{fam.id}.html", fam.name, _family_page(lib, fam.id), nav="families")
    for obs in lib.observations.values():
        _page(site / "observations" / f"{obs.id}.html", obs.id, _obs_page(lib, obs.id), nav="studies")
    _copy_artifacts(lib, site)


def _search_index(lib: Library) -> list[dict]:
    rows = []
    for vec in lib.vectors.values():
        rows.append({
            "id": vec.id, "name": vec.canonical_name, "kind": "vector",
            "href": f"vectors/{vec.id}.html", "status": vec.status,
            "text": " ".join([vec.canonical_name, *vec.aliases, vec.definition, vec.low_pole, vec.high_pole]),
        })
    for aes in lib.aesthetics.values():
        rows.append({
            "id": aes.id, "name": aes.canonical_name, "kind": "aesthetic",
            "href": f"aesthetics/{aes.id}.html", "status": aes.status,
            "text": " ".join([aes.canonical_name, *aes.aliases, aes.definition]),
        })
    for alias in lib.aliases.values():
        rows.append({
            "id": alias.id, "name": alias.raw_phrase, "kind": "alias",
            "href": "aliases.html", "status": alias.mapping_type,
            "text": f"{alias.raw_phrase} {alias.target_id} {alias.notes}",
        })
    for study in lib.studies.values():
        rows.append({
            "id": study.id, "name": study.title, "kind": "study",
            "href": f"studies/{study.id}.html", "status": study.status,
            "text": f"{study.title} {study.decision} {study.protocol}",
        })
    return rows


def _page(path: Path, title: str, body: str, nav: str, hero: bool = False) -> None:
    site_root = path
    while site_root.name != "site" and site_root.parent != site_root:
        site_root = site_root.parent
    rel = Path(*([".."] * len(path.parent.relative_to(site_root).parts)))
    prefix = (str(rel) + "/") if rel.parts else ""
    wrap_open = "" if hero else '<div class="sheet">'
    wrap_close = "" if hero else "</div>"
    html = f"""<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{_esc(title)} · atlas</title>
<link rel="stylesheet" href="{prefix}assets/app.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Outfit:wght@400;500&family=Syne:wght@700;800&display=swap" rel="stylesheet">
<body>
<div class="grain" aria-hidden="true"></div>
<nav class="float">
  <a class="mark" href="{prefix}index.html">ATLAS</a>
  {_nav(nav, prefix)}
</nav>
{wrap_open}{body}{wrap_close}
<script src="{prefix}assets/app.js"></script>
</body>
</html>
"""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(html, encoding="utf-8")


def _nav(active: str, prefix: str) -> str:
    links = [
        ("home", "index.html", "Atlas", False),
        ("vectors", "vectors.html", "Vectors", False),
        ("aesthetics", "aesthetics.html", "Looks", False),
        ("studies", "studies.html", "Studies", False),
        ("aliases", "aliases.html", "Aliases", True),
        ("families", "families.html", "Families", True),
        ("questions", "questions.html", "Open", True),
    ]
    out = []
    for key, href, label, more in links:
        mark = ' aria-current="page"' if key == active else ""
        extra = ' class="nav-more"' if more else ""
        out.append(f'<a href="{prefix}{href}"{extra}{mark}>{label}</a>')
    return "\n".join(out)


def _esc(text: str) -> str:
    return (
        str(text).replace("&", "&amp;").replace("<", "&lt;")
        .replace(">", "&gt;").replace('"', "&quot;")
    )


def _chip(status: str, css: str | None = None) -> str:
    klass = css or status.split()[0]
    return f'<span class="chip {_esc(klass)}">{_esc(status)}</span>'


def _bar(value: float) -> str:
    pct = max(0, min(100, abs(value) * 100))
    return f'<span class="bar"><span style="width:{pct:.0f}%"></span></span> {value:.2f}'


def _short_v(vector_id: str) -> str:
    return vector_id.removeprefix("vec_")


def _hero_src(lib: Library, prefix: str = "") -> str:
    path = "artifacts/studies/study_reconstruction_soft_halated_shadow_001/anchor_portrait_reconstruction.jpg"
    if (lib.root / path).exists():
        return prefix + path
    for obs in lib.observations.values():
        if obs.image_path:
            return prefix + obs.image_path
    return ""


def _equation(lib: Library, aesthetic_id: str, href_prefix: str = "") -> str:
    aes = lib.aesthetics.get(aesthetic_id)
    if not aes or not aes.weights:
        return '<p class="eq-live"><span class="sum">a</span> = Σ w<sub>i</sub> v<sub>i</sub></p>'
    terms = []
    for i, item in enumerate(sorted(aes.weights, key=lambda w: abs(w.weight), reverse=True)):
        name = lib.vectors[item.vector_id].canonical_name if item.vector_id in lib.vectors else item.vector_id
        op = "" if i == 0 else " + "
        terms.append(
            f'{op}<a href="{href_prefix}vectors/{item.vector_id}.html" title="{_esc(name)}">'
            f'<span class="w">{item.weight:.2f}</span> '
            f'<span class="v">v<sub>{_esc(_short_v(item.vector_id))}</sub></span></a>'
        )
    return f'<p class="eq-live">{"".join(terms)}</p>'


def _faders(lib: Library, aesthetic_id: str) -> str:
    aes = lib.aesthetics.get(aesthetic_id)
    if not aes:
        return ""
    bits = []
    for item in sorted(aes.weights, key=lambda w: abs(w.weight), reverse=True)[:6]:
        name = lib.vectors[item.vector_id].canonical_name if item.vector_id in lib.vectors else item.vector_id
        pct = max(4, min(100, abs(item.weight) * 100))
        bits.append(
            f'<div class="fader"><div class="fader-col"><div class="fill" style="height:{pct:.0f}%"></div></div>'
            f'<div class="w">{item.weight:.2f}</div><div class="n">{_esc(name)}</div></div>'
        )
    return f'<div class="rack">{"".join(bits)}</div>'


def _field_payload(lib: Library, aesthetic_id: str) -> str:
    axes = [v for v in lib.vectors.values() if v.study_ids]
    axes.sort(key=lambda v: v.id)
    weights = lib.aesthetics[aesthetic_id].coordinate() if aesthetic_id in lib.aesthetics else {}
    payload = {
        "nodes": [
            {"id": v.id, "name": v.canonical_name, "w": weights.get(v.id, 0.0), "href": f"vectors/{v.id}.html"}
            for v in axes
        ]
    }
    return json.dumps(payload)


def _home(lib: Library) -> str:
    featured = "aes_soft_halated_shadow" if "aes_soft_halated_shadow" in lib.aesthetics else next(iter(lib.aesthetics), "")
    hero = _hero_src(lib)
    plates = []
    if featured in lib.aesthetics:
        for oid in lib.aesthetics[featured].observation_ids:
            obs = lib.observations.get(oid)
            if not obs:
                continue
            plates.append(
                f'<a class="plate" href="observations/{obs.id}.html">'
                f'<img src="{obs.image_path}" alt="{obs.id}">'
                f'<div class="cap">{_esc(obs.anchor_id or "")} · reconstruction</div></a>'
            )
    studied = [v for v in lib.vectors.values() if v.study_ids]
    studied.sort(key=lambda v: (-v.confidence, v.canonical_name))
    cards = []
    for vec in studied:
        triple = _level_triple(lib, vec.id, "")
        cards.append(
            f'<a class="axis-card" href="vectors/{vec.id}.html">'
            f'{triple}'
            f'<h3>{_esc(vec.canonical_name)}</h3>'
            f'<div class="caption">{vec.status} · {vec.confidence:.2f}</div></a>'
        )
    return f"""
<section class="hero">
  <div class="hero-media">
    <img class="hero-photo" src="{_esc(hero)}" alt="">
    <div class="hero-shade"></div>
  </div>
  <div class="hero-hud">
    <p class="kicker">visual basis atlas</p>
    <h1 class="display">a = Σ wᵢ vᵢ</h1>
    {_equation(lib, featured)}
    {_faders(lib, featured)}
  </div>
</section>
<div class="sheet">
  <form class="search" role="search" data-prefix="">
    <input id="q" type="search" placeholder="Map a phrase. cinematic, analog, 80s fantasy…" autocomplete="off">
  </form>
  <div class="hits" id="hits"></div>
  <h2>The look, reconstructed</h2>
  <p class="lede">Soft-halated shadow is a coordinate, not a mood. These plates are the same five subjects after the weighted sum.</p>
  <div class="rail">{''.join(plates)}</div>
  <h2>The basis in motion</h2>
  <p class="lede">Each studied axis is a node. Distance from the core is its weight in the current look.</p>
  <div class="field-wrap"><canvas id="field" data-field='{_esc(_field_payload(lib, featured))}'></canvas></div>
  <h2>Tested axes</h2>
  <div class="grid-axes">{''.join(cards)}</div>
  <footer>{len(lib.vectors)} vectors · {len(lib.observations)} observations · operational basis, not orthogonal</footer>
</div>
"""


def _level_triple(lib: Library, vector_id: str, prefix: str) -> str:
    by_level: dict[str, object] = {}
    for obs in lib.observations.values():
        if obs.intended_vector_id != vector_id or not obs.intended_level:
            continue
        current = by_level.get(obs.intended_level)
        if current is None or obs.anchor_id == "anchor_portrait":
            by_level[obs.intended_level] = obs
    cells = []
    for level in ("low", "medium", "high"):
        obs = by_level.get(level)
        if obs:
            cells.append(f'<img src="{prefix}{obs.image_path}" alt="{level}">')
        else:
            cells.append("<div></div>")
    return f'<div class="axis-film">{"".join(cells)}</div>'


def _vector_index(lib: Library) -> str:
    studied = [v for v in lib.vectors.values() if v.study_ids]
    studied.sort(key=lambda v: v.canonical_name)
    cards = []
    for vec in studied:
        cards.append(
            f'<a class="axis-card" href="vectors/{vec.id}.html">{_level_triple(lib, vec.id, "")}'
            f'<h3>{_esc(vec.canonical_name)}</h3><div class="caption">{vec.status}</div></a>'
        )
    rows = []
    for vec in sorted(lib.vectors.values(), key=lambda v: (v.family_id, v.canonical_name)):
        fam = lib.families.get(vec.family_id)
        rows.append(
            f"<tr><td><a href='vectors/{vec.id}.html'>{_esc(vec.canonical_name)}</a></td>"
            f"<td class='mono'>{vec.id}</td><td>{_chip(vec.status)}</td>"
            f"<td>{_esc(fam.name if fam else '')}</td><td>{_bar(vec.confidence)}</td></tr>"
        )
    return f"""
<h1 class="page">Vectors</h1>
<p class="lede">Tested axes first. The rest of the basis is still candidate.</p>
<div class="grid-axes">{''.join(cards)}</div>
<h2>Full catalog</h2>
<div class="table-wrap"><table><thead><tr><th>name</th><th>id</th><th>status</th><th>family</th><th>conf</th></tr></thead>
<tbody>{''.join(rows)}</tbody></table></div>
"""


def _family_index(lib: Library) -> str:
    cards = []
    for fam in sorted(lib.families.values(), key=lambda f: f.name):
        n = sum(1 for v in lib.vectors.values() if v.family_id == fam.id)
        cards.append(
            f"<div class='card'><h3><a href='families/{fam.id}.html'>{_esc(fam.name)}</a></h3>"
            f"<p>{_esc(fam.definition)}</p><p class='mono'>{n} vectors</p></div>"
        )
    return f"<h1 class='page'>Families</h1><p class='lede'>Provisional shelves.</p><div class='grid-2'>{''.join(cards)}</div>"


def _family_page(lib: Library, family_id: str) -> str:
    fam = lib.families[family_id]
    items = [v for v in lib.vectors.values() if v.family_id == family_id]
    items.sort(key=lambda v: v.canonical_name)
    lis = "".join(
        f"<li><a href='../vectors/{v.id}.html'>{_esc(v.canonical_name)}</a> {_chip(v.status)}</li>"
        for v in items
    )
    return f"<h1 class='page'>{_esc(fam.name)}</h1><p class='lede'>{_esc(fam.definition)}</p><ul>{lis}</ul>"


def _aesthetic_index(lib: Library) -> str:
    blocks = []
    for aes in sorted(lib.aesthetics.values(), key=lambda a: a.canonical_name):
        img = ""
        for oid in aes.observation_ids:
            obs = lib.observations.get(oid)
            if obs:
                img = f'<div class="mast" style="height:220px;border-radius:16px;margin:0 0 0.7rem"><img src="{obs.image_path}" alt=""></div>'
                break
        blocks.append(
            f"<article class='card'>{img}<h3><a href='aesthetics/{aes.id}.html'>{_esc(aes.canonical_name)}</a> {_chip(aes.status)}</h3>"
            f"{_equation(lib, aes.id)}</article>"
        )
    return f"<h1 class='page'>Looks</h1><p class='lede'>Coordinates over the basis.</p><div class='grid-2'>{''.join(blocks)}</div>"


def _alias_index(lib: Library) -> str:
    rows = []
    for alias in sorted(lib.aliases.values(), key=lambda a: a.raw_phrase.lower()):
        href = "#"
        if alias.target_id.startswith("vec_"):
            href = f"vectors/{alias.target_id}.html"
        elif alias.target_id.startswith("aes_"):
            href = f"aesthetics/{alias.target_id}.html"
        rows.append(
            f"<tr><td>{_esc(alias.raw_phrase)}</td><td><a href='{href}' class='mono'>{alias.target_id}</a></td>"
            f"<td>{_chip(alias.mapping_type)}</td><td>{alias.confidence:.2f}</td>"
            f"<td>{_esc(alias.notes)}</td></tr>"
        )
    return f"""
<h1 class="page">Aliases</h1>
<p class="lede">Map a raw phrase onto the basis.</p>
<div class="table-wrap"><table><thead><tr><th>phrase</th><th>target</th><th>mapping</th><th>conf</th><th>notes</th></tr></thead>
<tbody>{''.join(rows)}</tbody></table></div>
"""


def _study_index(lib: Library) -> str:
    cards = []
    for s in sorted(lib.studies.values(), key=lambda x: x.id):
        cards.append(
            f"<div class='card'><h3><a href='studies/{s.id}.html'>{_esc(s.title)}</a></h3>"
            f"<p class='mono'>{s.id}</p><p>{_chip(s.status)} {_chip(s.decision or 'undecided')}</p>"
            f"<p>{_esc(s.protocol)}</p></div>"
        )
    return f"<h1 class='page'>Studies</h1><div class='grid-2'>{''.join(cards)}</div>"


def _questions(lib: Library) -> str:
    blocks = ["<h1 class='page'>Open questions</h1>"]
    for vec in sorted(lib.vectors.values(), key=lambda v: v.id):
        if not vec.open_questions:
            continue
        items = "".join(f"<li>{_esc(q)}</li>" for q in vec.open_questions)
        blocks.append(f"<h2><a href='vectors/{vec.id}.html'>{_esc(vec.canonical_name)}</a></h2><ul>{items}</ul>")
    for study in lib.studies.values():
        if study.next_experiments:
            items = "".join(f"<li>{_esc(q)}</li>" for q in study.next_experiments)
            blocks.append(f"<h2><a href='studies/{study.id}.html'>{study.id}</a></h2><ul>{items}</ul>")
    return "\n".join(blocks)


def _matrices(lib: Library) -> str:
    files = [
        "observation_matrix.csv", "confidence_matrix.csv", "composite_weight_matrix.csv",
        "alias_mapping.csv", "cooccurrence_matrix.csv", "vector_similarity_matrix.csv",
        "aesthetic_similarity_matrix.csv", "vector_correlation_matrix.csv",
        "interaction_candidates.csv", "reconstruction_evaluations.csv",
    ]
    lis = "".join(f"<li><span class='mono'>{f}</span></li>" for f in files)
    return f"<h1 class='page'>Matrices</h1><ul>{lis}</ul><p>C = X<sup>T</sup>X. Not orthogonal.</p>"


def _vector_page(lib: Library, vector_id: str) -> str:
    vec = lib.vectors[vector_id]
    fam = lib.families.get(vec.family_id)
    nearby = "".join(
        f"<li><a href='{nid}.html'>{_esc(lib.vectors[nid].canonical_name if nid in lib.vectors else nid)}</a></li>"
        for nid in vec.nearby_ids
    ) or "<li>none</li>"
    not_same = "".join(
        f"<li><a href='{k}.html'>{k}</a>: {_esc(v)}</li>" for k, v in vec.not_the_same_as.items()
    ) or "<li>no notes</li>"
    studies = "".join(f"<li><a href='../studies/{s}.html'>{s}</a></li>" for s in vec.study_ids) or "<li>none</li>"
    effects = "".join(f"<li>{_esc(e)}</li>" for e in vec.observable_effects) or "<li>not yet observed</li>"
    qs = "".join(f"<li>{_esc(q)}</li>" for q in vec.open_questions) or "<li>none</li>"
    high = None
    for obs in lib.observations.values():
        if obs.intended_vector_id == vector_id and obs.intended_level == "high" and obs.anchor_id == "anchor_portrait":
            high = obs
            break
    if not high:
        for obs in lib.observations.values():
            if obs.intended_vector_id == vector_id and obs.intended_level == "high":
                high = obs
                break
    mast = ""
    if high:
        mast = (
            f'<div class="mast"><img src="../{high.image_path}" alt="">'
            f'<div class="shade"></div><div class="in">'
            f'<p class="kicker">v<sub>{_esc(_short_v(vec.id))}</sub> · high</p>'
            f'<h1 class="page">{_esc(vec.canonical_name)}</h1></div></div>'
        )
    else:
        mast = f'<h1 class="page">{_esc(vec.canonical_name)}</h1>'
    return f"""
{mast}
<div class="meta">
  {_chip(vec.status)}
  <span class="chip mono">{vec.id}</span>
  <span class="chip">conf {vec.confidence:.2f}</span>
  <span class="chip"><a href="../families/{vec.family_id}.html">{_esc(fam.name if fam else vec.family_id)}</a></span>
</div>
<p class="lede">{_esc(vec.definition)}</p>
<p class="eq-live"><span class="w">{_esc(vec.low_pole)}</span> → <span class="v">{_esc(vec.high_pole)}</span></p>
<div class="grid-2">
  <div class="card"><h3>What it changes</h3><p>{_esc(vec.testable_claim)}</p><ul>{effects}</ul></div>
  <div class="card"><h3>Aliases</h3><p>{_esc(", ".join(vec.aliases) or "none")}</p></div>
</div>
<h2>Controlled examples</h2>
{_vector_evidence(lib, vec.id)}
<h2>Nearby</h2><ul>{nearby}</ul>
<h2>Commonly confused with</h2><ul>{not_same}</ul>
<h2>Studies</h2><ul>{studies}</ul>
<h2>Open questions</h2><ul>{qs}</ul>
"""


def _vector_evidence(lib: Library, vector_id: str) -> str:
    rows: dict[str, dict] = {}
    for obs in lib.observations.values():
        if obs.intended_vector_id != vector_id or not obs.anchor_id:
            continue
        rows.setdefault(obs.anchor_id, {})[obs.intended_level or ""] = obs
    if not rows:
        return "<p>No controlled examples yet.</p>"
    html = ["<div>"]
    html.append("<div class='anchor-row'><div></div><div class='caption'>low</div><div class='caption'>medium</div><div class='caption'>high</div></div>")
    for anchor_id, levels in rows.items():
        name = lib.anchors[anchor_id].name if anchor_id in lib.anchors else anchor_id
        cells = [f"<div class='an'>{_esc(name)}</div>"]
        for level in ("low", "medium", "high"):
            obs = levels.get(level)
            if obs:
                cells.append(
                    f"<div class='thumb'><a href='../observations/{obs.id}.html'>"
                    f"<img src='../{obs.image_path}' alt='{obs.id}'></a></div>"
                )
            else:
                cells.append("<div></div>")
        html.append(f"<div class='anchor-row'>{''.join(cells)}</div>")
    html.append("</div>")
    return "\n".join(html)


def _aesthetic_page(lib: Library, aesthetic_id: str) -> str:
    aes = lib.aesthetics[aesthetic_id]
    nearest = nearest_aesthetics(lib, aes.id)
    near = "".join(
        f"<li><a href='{i}.html'>{_esc(lib.aesthetics[i].canonical_name)}</a> cosine {s:.3f}</li>"
        for i, s in nearest
    ) or "<li>none</li>"
    notes = "".join(f"<li>{_esc(n)}</li>" for n in aes.interaction_notes) or "<li>none</li>"
    hero_obs = None
    plates = []
    for oid in aes.observation_ids:
        obs = lib.observations.get(oid)
        if not obs:
            continue
        if hero_obs is None:
            hero_obs = obs
        plates.append(
            f'<a class="plate" href="../observations/{obs.id}.html">'
            f'<img src="../{obs.image_path}" alt="{obs.id}">'
            f'<div class="cap">{_esc(obs.anchor_id or "")}</div></a>'
        )
    mast = ""
    if hero_obs:
        mast = (
            f'<div class="mast" style="height:58vh"><img src="../{hero_obs.image_path}" alt="">'
            f'<div class="shade"></div><div class="in">'
            f'<p class="kicker">{aes.id}</p><h1 class="page">{_esc(aes.canonical_name)}</h1>'
            f'{_equation(lib, aes.id, "../")}</div></div>'
        )
    else:
        mast = f'<h1 class="page">{_esc(aes.canonical_name)}</h1>{_equation(lib, aes.id, "../")}'
    payload = _field_payload(lib, aes.id).replace('"href": "vectors/', '"href": "../vectors/')
    return f"""
{mast}
<div class="meta">{_chip(aes.status)}<span class="chip mono">{aes.id}</span>{_chip("conf "+f"{aes.confidence:.2f}")}</div>
<p class="lede">{_esc(aes.definition)}</p>
{_faders(lib, aes.id)}
<h2>Plates</h2>
<div class="rail">{''.join(plates) or "<p>None yet.</p>"}</div>
<h2>Coordinate field</h2>
<div class="field-wrap"><canvas id="field" data-field='{_esc(payload)}'></canvas></div>
<h2>Interactions</h2><ul>{notes}</ul>
<h2>Nearest</h2><ul>{near}</ul>
<p class="lede">{_esc(aes.reconstruction_notes)}</p>
"""


def _study_page(lib: Library, study_id: str) -> str:
    study = lib.studies[study_id]
    grid = f"<p><img src='../artifacts/grids/{study.id}.jpg' alt='grid' style='width:100%;border-radius:14px'></p>" if (lib.root / "artifacts" / "grids" / f"{study.id}.jpg").exists() else ""
    by_anchor: dict[str, dict] = {}
    for obs_id in study.observation_ids:
        obs = lib.observations.get(obs_id)
        if not obs or not obs.anchor_id:
            continue
        by_anchor.setdefault(obs.anchor_id, {})[obs.intended_level or "x"] = obs
    blocks = []
    levels = study.levels or ["low", "medium", "high"]
    for anchor_id, levels_map in by_anchor.items():
        name = lib.anchors[anchor_id].name if anchor_id in lib.anchors else anchor_id
        cells = []
        for level in levels:
            obs = levels_map.get(level)
            if not obs:
                continue
            cells.append(
                f"<div><a href='../observations/{obs.id}.html'><img src='../{obs.image_path}' alt='{level}'></a>"
                f"<div class='caption'>{level}</div></div>"
            )
        blocks.append(f"<h3>{_esc(name)}</h3><div class='strip levels'>{''.join(cells)}</div>")
    ents = "".join(f"<li>{_esc(e)}</li>" for e in study.entanglement_notes) or "<li>none</li>"
    nxt = "".join(f"<li>{_esc(e)}</li>" for e in study.next_experiments) or "<li>none</li>"
    return f"""
<h1 class="page">{_esc(study.title)}</h1>
<div class="meta">{_chip(study.status)} {_chip(study.decision or "undecided")}
<a class="chip" href="../vectors/{study.candidate_vector_id}.html">{study.candidate_vector_id}</a></div>
<p class="lede">{_esc(study.protocol)}</p>
<p>{_esc(study.decision_reason)}</p>
{grid}
{''.join(blocks)}
<h2>Entanglement</h2><ul>{ents}</ul>
<h2>Next</h2><ul>{nxt}</ul>
"""


def _obs_page(lib: Library, observation_id: str) -> str:
    obs = lib.observations[observation_id]
    scores = "".join(
        f"<tr><td><a href='../vectors/{s.vector_id}.html'>{s.vector_id}</a></td>"
        f"<td>{_bar(s.score)}</td><td>{s.confidence:.2f}</td></tr>"
        for s in obs.scores
    )
    unintended = "".join(f"<li>{_esc(u)}</li>" for u in obs.unintended_changes) or "<li>none</li>"
    return f"""
<div class="mast" style="height:70vh"><img src="../{obs.image_path}" alt="{obs.id}"><div class="shade"></div>
<div class="in"><p class="kicker">{obs.id}</p><h1 class="page">{_esc(obs.anchor_id or "")} · {_esc(obs.intended_level or "")}</h1></div></div>
<div class="meta">
  <a class="chip" href="../studies/{obs.study_id}.html">{obs.study_id}</a>
</div>
<h2>Prompt</h2>
<p class="mono" style="white-space:pre-wrap;font-size:0.8rem">{_esc(obs.prompt)}</p>
<h2>Scores</h2>
<div class="table-wrap"><table><thead><tr><th>vector</th><th>score</th><th>conf</th></tr></thead><tbody>{scores}</tbody></table></div>
<h2>Unintended</h2><ul>{unintended}</ul>
<p>{_esc(obs.notes)}</p>
"""


def _copy_artifacts(lib: Library, site: Path) -> None:
    src = lib.root / "artifacts"
    dest = site / "artifacts"
    if dest.exists():
        shutil.rmtree(dest)
    if src.exists():
        shutil.copytree(src, dest)
    (site / "assets" / "app.js").write_text(JS, encoding="utf-8")


JS = r"""
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
  if (window.visualViewport) visualViewport.addEventListener("resize", resize);
  frame();
}

bootSearch();
bootField();
"""
