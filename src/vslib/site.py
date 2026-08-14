"""Searchable static site generated from the same records as the wiki."""

from __future__ import annotations

import json
import math
import shutil
from pathlib import Path

from vslib.matrices import nearest_aesthetics
from vslib.store import Library

CSS = """
:root {
  --void: #0e1116;
  --plate: #161b22;
  --line: #2a3140;
  --star: #e8dcc4;
  --fog: #8b94a3;
  --gold: #c9a35a;
  --ember: #c45c48;
  --cyan: #7aa3a8;
  --print: #ece6d8;
  --ink: #1a1712;
  --ok: #6f9b78;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: var(--void); color: var(--star); }
body {
  font: 16px/1.55 "Source Sans 3", "Source Sans Pro", "Helvetica Neue", sans-serif;
}
a { color: var(--cyan); text-decoration: none; }
a:hover { color: var(--gold); }
code, .mono, input, kbd, .eq {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
}
.shell { min-height: 100vh; }
nav.top {
  display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.7rem 1.2rem;
  padding: 0.85rem 1.5rem;
  border-bottom: 1px solid var(--line);
  background: #0c0f14;
  position: sticky; top: 0; z-index: 20;
}
nav.top .mark {
  font-family: "Bodoni Moda", "Didot", serif;
  font-size: 1.35rem; letter-spacing: 0.16em; font-weight: 500;
  color: var(--star); margin-right: 0.4rem;
}
nav.top .mark em { color: var(--gold); font-style: normal; }
nav.top a {
  font-family: "IBM Plex Sans Condensed", sans-serif;
  font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--fog);
}
nav.top a[aria-current="page"] { color: var(--gold); }
main { padding: 1.6rem 1.6rem 4rem; max-width: 1180px; margin: 0 auto; }
.search { margin: 0 0 1.2rem; }
.search input {
  width: 100%; background: var(--plate); color: var(--star);
  border: 1px solid var(--line); padding: 0.7rem 0.85rem; font-size: 0.95rem;
}
.search input:focus { outline: 1px solid var(--gold); border-color: var(--gold); }
.hits { background: #11151c; border: 1px solid var(--line); display: none; }
.hits a { display: block; padding: 0.45rem 0.7rem; color: var(--star); border-bottom: 1px solid var(--line); }
.hits a:hover { background: #1c222c; }
.hits .k { color: var(--gold); font-size: 0.72rem; margin-right: 0.5rem; }
h1.page {
  font-family: "Bodoni Moda", "Didot", serif;
  font-weight: 500; font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1.05; margin: 0 0 0.5rem; letter-spacing: -0.02em;
}
h2 {
  font-family: "IBM Plex Sans Condensed", sans-serif;
  font-size: 0.78rem; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--gold); font-weight: 500; margin: 2rem 0 0.7rem;
}
.lede { color: var(--fog); max-width: 64ch; font-size: 1.08rem; }
.meta { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0.9rem 0 1.3rem; }
.chip {
  font-family: "IBM Plex Sans Condensed", sans-serif;
  font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;
  border: 1px solid var(--line); padding: 0.16rem 0.45rem; color: var(--fog);
}
.chip.canonical { border-color: var(--ok); color: #b6d4bc; }
.chip.provisional { border-color: var(--gold); color: #ecd6a4; }
.chip.candidate, .chip.count { border-color: var(--line); }
.chip.vague, .chip.rejected, .chip.near_alias { border-color: var(--ember); color: #e3b2a6; }
.chip.composite, .chip.system { border-color: var(--cyan); }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
.stage {
  display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 1.6rem;
  align-items: center; margin: 1.4rem 0 2rem;
}
.card {
  background: var(--print); color: var(--ink); padding: 1rem 1.05rem;
}
.card h3 { margin: 0 0 0.35rem; font-family: "Bodoni Moda", serif; font-weight: 500; }
.card p, .card li { color: #2c281f; }
.card a { color: #3d5c60; }
table { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
th, td { text-align: left; padding: 0.4rem 0.35rem; border-bottom: 1px solid var(--line); }
th {
  font-family: "IBM Plex Sans Condensed", sans-serif; letter-spacing: 0.08em;
  text-transform: uppercase; font-size: 0.7rem; color: var(--fog); font-weight: 500;
}
.bar { height: 7px; background: #1a1d22; width: 140px; display: inline-block; vertical-align: middle; }
.bar > span { display: block; height: 100%; background: var(--gold); }
.strip { display: grid; gap: 8px; }
.strip.levels { grid-template-columns: repeat(3, 1fr); }
.strip img, .thumb img { width: 100%; height: auto; display: block; background: #0a0c10; }
.caption { font-size: 0.74rem; color: var(--fog); font-family: "IBM Plex Mono", monospace; margin-top: 0.25rem; }
.anchor-row { display: grid; grid-template-columns: 140px 1fr 1fr 1fr; gap: 8px; align-items: start; margin-bottom: 12px; }
.anchor-row .an { font-size: 0.8rem; color: var(--fog); padding-top: 0.4rem; }
.warning { border-left: 2px solid var(--gold); padding: 0.35rem 0.8rem; color: #d9cba6; }
footer { margin-top: 3.2rem; color: #66707d; font-size: 0.78rem; }
.eq-block {
  font-size: clamp(1.02rem, 2.3vw, 1.5rem);
  line-height: 1.75; color: var(--star);
  padding: 0.4rem 0 0.2rem;
}
.eq-block .sum { font-family: "Bodoni Moda", serif; font-style: italic; font-size: 1.15em; }
.eq-term {
  display: inline-block; white-space: nowrap; margin: 0 0.08em;
  border-bottom: 1px solid transparent; color: inherit;
}
.eq-term:hover { border-bottom-color: var(--gold); color: var(--gold); }
.eq-term .w { color: var(--gold); }
.eq-term .v { color: var(--cyan); font-style: italic; }
.axis {
  display: grid; grid-template-columns: 1fr auto 1fr; gap: 0.7rem; align-items: center;
  margin: 1.2rem 0 1.6rem;
}
.axis .pole { font-size: 0.86rem; color: var(--fog); }
.axis .pole.hi { text-align: right; }
.axis .track {
  height: 2px; background: linear-gradient(90deg, var(--cyan), var(--gold));
  position: relative; min-width: 120px;
}
.axis .track i {
  position: absolute; top: -5px; width: 12px; height: 12px;
  border: 2px solid var(--gold); border-radius: 50%; background: var(--void);
}
.weights { display: grid; gap: 0.55rem; }
.weight-row { display: grid; grid-template-columns: minmax(8rem, 14rem) 1fr 3.2rem; gap: 0.6rem; align-items: center; }
.weight-row .lab { font-size: 0.88rem; }
.weight-row .track { height: 10px; background: #1b2028; }
.weight-row .track > i {
  display: block; height: 100%; background: var(--gold);
  transform-origin: left center;
  animation: grow 0.7s cubic-bezier(0.4, 0, 0.2, 1) both;
}
.weight-row .w { font-family: "IBM Plex Mono", monospace; color: var(--gold); font-size: 0.84rem; text-align: right; }
@keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.sky { width: 100%; max-width: 460px; margin: 0 auto; }
.sky svg { width: 100%; height: auto; display: block; }
.sky text { font-family: "IBM Plex Sans Condensed", sans-serif; letter-spacing: 0.04em; }
@media (prefers-reduced-motion: reduce) {
  .weight-row .track > i { animation: none; }
}
@media (max-width: 860px) {
  .stage, .grid-2, .anchor-row, .strip.levels, .weight-row { grid-template-columns: 1fr; }
  .axis { grid-template-columns: 1fr; }
  .axis .pole.hi { text-align: left; }
}
"""


def generate_site(lib: Library) -> None:
    site = lib.root / "site"
    if site.exists():
        shutil.rmtree(site)
    site.mkdir(parents=True)
    (site / "assets").mkdir()
    (site / "assets" / "app.css").write_text(CSS, encoding="utf-8")
    index = _search_index(lib)
    (site / "assets" / "index.json").write_text(json.dumps(index), encoding="utf-8")
    _page(site / "index.html", "Atlas", _home(lib), nav="home")
    _page(site / "vectors.html", "Vectors", _vector_index(lib), nav="vectors")
    _page(site / "families.html", "Families", _family_index(lib), nav="families")
    _page(site / "aesthetics.html", "Aesthetics", _aesthetic_index(lib), nav="aesthetics")
    _page(site / "aliases.html", "Aliases", _alias_index(lib), nav="aliases")
    _page(site / "studies.html", "Studies", _study_index(lib), nav="studies")
    _page(site / "questions.html", "Questions", _questions(lib), nav="questions")
    _page(site / "matrices.html", "Matrices", _matrices(lib), nav="matrices")
    (site / "vectors").mkdir()
    (site / "aesthetics").mkdir()
    (site / "studies").mkdir()
    (site / "families").mkdir()
    (site / "observations").mkdir()
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


def _page(path: Path, title: str, body: str, nav: str) -> None:
    site_root = path
    while site_root.name != "site" and site_root.parent != site_root:
        site_root = site_root.parent
    rel = Path(*([".."] * len(path.parent.relative_to(site_root).parts)))
    prefix = (str(rel) + "/") if rel.parts else ""
    html = f"""<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{_esc(title)} · atlas</title>
<link rel="stylesheet" href="{prefix}assets/app.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,500;1,6..96,500&family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400&family=IBM+Plex+Sans+Condensed:wght@500&family=Source+Sans+3:wght@400;500&display=swap" rel="stylesheet">
<body>
<div class="shell">
<nav class="top">
  <a class="mark" href="{prefix}index.html">AT<i></i><em>LAS</em></a>
  {_nav_prefixed(nav, prefix)}
</nav>
<main>
  <form class="search" role="search" data-prefix="{prefix}">
    <input id="q" type="search" placeholder="Map a phrase to a vector or a look…" autocomplete="off">
  </form>
  <div class="hits" id="hits"></div>
  {body}
  <footer>Operational basis. Not assumed orthogonal. Records in registry/. Live combination a = sum w_i v_i.</footer>
</main>
</div>
<script src="{prefix}assets/app.js"></script>
</body>
</html>
"""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(html, encoding="utf-8")


def _nav_prefixed(active: str, prefix: str) -> str:
    links = [
        ("home", "index.html", "Atlas"),
        ("vectors", "vectors.html", "Vectors"),
        ("aesthetics", "aesthetics.html", "Aesthetics"),
        ("studies", "studies.html", "Studies"),
        ("families", "families.html", "Families"),
        ("aliases", "aliases.html", "Aliases"),
        ("matrices", "matrices.html", "Matrices"),
        ("questions", "questions.html", "Questions"),
    ]
    items = []
    for key, href, label in links:
        mark = ' aria-current="page"' if key == active else ""
        items.append(f'<a href="{prefix}{href}"{mark}>{label}</a>')
    return "\n".join(items)


def _esc(text: str) -> str:
    return (
        str(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def _chip(status: str, css: str | None = None) -> str:
    klass = css or status.split()[0]
    return f'<span class="chip {_esc(klass)}">{_esc(status)}</span>'


def _bar(value: float) -> str:
    pct = max(0, min(100, abs(value) * 100))
    return f'<span class="bar"><span style="width:{pct:.0f}%"></span></span> {value:.2f}'


def _short_v(vector_id: str) -> str:
    return vector_id.removeprefix("vec_")


def _equation(lib: Library, aesthetic_id: str, href_prefix: str = "") -> str:
    aes = lib.aesthetics.get(aesthetic_id)
    if not aes or not aes.weights:
        return '<p class="eq-block"><span class="sum">a</span> = Σ w<sub>i</sub> v<sub>i</sub></p>'
    terms = []
    for i, item in enumerate(sorted(aes.weights, key=lambda w: abs(w.weight), reverse=True)):
        name = lib.vectors[item.vector_id].canonical_name if item.vector_id in lib.vectors else item.vector_id
        op = "" if i == 0 else " + "
        terms.append(
            f'{op}<a class="eq-term" href="{href_prefix}vectors/{item.vector_id}.html" title="{_esc(name)}">'
            f'<span class="w">{item.weight:.2f}</span> '
            f'<span class="v">v<sub>{_esc(_short_v(item.vector_id))}</sub></span></a>'
        )
    return (
        f'<p class="eq-block"><a class="sum" href="{href_prefix}aesthetics/{aes.id}.html">{_esc(aes.canonical_name)}</a>'
        f' = {"".join(terms)}</p>'
    )


def _constellation(lib: Library, aesthetic_id: str | None, href_prefix: str = "") -> str:
    axes = [v for v in lib.vectors.values() if v.study_ids and v.status in {"canonical", "provisional"}]
    axes.sort(key=lambda v: v.id)
    if not axes:
        axes = sorted(lib.vectors.values(), key=lambda v: v.canonical_name)[:8]
    weights = {}
    if aesthetic_id and aesthetic_id in lib.aesthetics:
        weights = lib.aesthetics[aesthetic_id].coordinate()
    n = max(len(axes), 1)
    cx, cy, r = 200, 200, 132
    parts = [
        f'<svg viewBox="0 0 400 400" role="img" aria-label="weight constellation">'
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#2a3140"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{r*0.5}" fill="none" stroke="#222833"/>'
        f'<circle cx="{cx}" cy="{cy}" r="3" fill="#c9a35a"/>'
    ]
    pts = []
    for i, vec in enumerate(axes):
        ang = -math.pi / 2 + (2 * math.pi * i / n)
        x2 = cx + r * math.cos(ang)
        y2 = cy + r * math.sin(ang)
        w = max(0.0, min(1.0, abs(weights.get(vec.id, 0.0))))
        px = cx + r * w * math.cos(ang)
        py = cy + r * w * math.sin(ang)
        lx = cx + (r + 22) * math.cos(ang)
        ly = cy + (r + 22) * math.sin(ang)
        anchor = "start" if math.cos(ang) > 0.2 else ("end" if math.cos(ang) < -0.2 else "middle")
        parts.append(f'<line x1="{cx}" y1="{cy}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="#2a3140"/>')
        parts.append(
            f'<a href="{href_prefix}vectors/{vec.id}.html">'
            f'<circle cx="{px:.1f}" cy="{py:.1f}" r="5" fill="#c9a35a">'
            f'<title>{_esc(vec.canonical_name)} {w:.2f}</title></circle></a>'
        )
        parts.append(
            f'<text x="{lx:.1f}" y="{ly:.1f}" fill="#8b94a3" font-size="10" text-anchor="{anchor}">'
            f'{_esc(vec.canonical_name)}</text>'
        )
        if vec.id in weights:
            pts.append((px, py))
    if len(pts) >= 3:
        d = "M " + " L ".join(f"{x:.1f},{y:.1f}" for x, y in pts) + " Z"
        parts.append(f'<path d="{d}" fill="rgba(201,163,90,0.12)" stroke="#c9a35a"/>')
    elif len(pts) == 2:
        parts.append(
            f'<line x1="{pts[0][0]:.1f}" y1="{pts[0][1]:.1f}" x2="{pts[1][0]:.1f}" y2="{pts[1][1]:.1f}" stroke="#c9a35a"/>'
        )
    parts.append("</svg>")
    return f'<div class="sky">{"".join(parts)}</div>'


def _weight_rows(lib: Library, aesthetic_id: str, href_prefix: str = "") -> str:
    aes = lib.aesthetics.get(aesthetic_id)
    if not aes or not aes.weights:
        return ""
    rows = []
    for item in sorted(aes.weights, key=lambda w: abs(w.weight), reverse=True):
        name = lib.vectors[item.vector_id].canonical_name if item.vector_id in lib.vectors else item.vector_id
        pct = max(0, min(100, abs(item.weight) * 100))
        flag = " hypothesized" if item.hypothesized else ""
        rows.append(
            f'<div class="weight-row">'
            f'<a class="lab" href="{href_prefix}vectors/{item.vector_id}.html">{_esc(name)}</a>'
            f'<div class="track"><i style="width:{pct:.0f}%"></i></div>'
            f'<div class="w">{item.weight:.2f}{flag}</div></div>'
        )
    return f'<div class="weights">{"".join(rows)}</div>'


def _home(lib: Library) -> str:
    featured = "aes_soft_halated_shadow" if "aes_soft_halated_shadow" in lib.aesthetics else next(iter(lib.aesthetics), "")
    studied = [v for v in lib.vectors.values() if v.study_ids]
    studied.sort(key=lambda v: (-v.confidence, v.canonical_name))
    return f"""
<p class="chip count">visual basis atlas</p>
<h1 class="page">Hidden associations, mapped as vectors.</h1>
<p class="lede">
Atlas turns a named look into a coordinate. Each axis is a tested visual basis vector.
An aesthetic is a weighted combination over that basis.
</p>
{_equation(lib, featured)}
<div class="stage">
  {_constellation(lib, featured)}
  <div>
    <h2>Live combination</h2>
    {_weight_rows(lib, featured)}
    <p class="lede" style="margin-top:1rem">
    Operational basis only. Correlation and reconstruction error stay in the record.
    A vector is canonical only after isolation across unrelated subjects.
    </p>
  </div>
</div>
<div class="meta">
  {_chip(str(len(lib.vectors)) + " vectors", "count")}
  {_chip(str(len(lib.observations)) + " observations", "count")}
  {_chip(str(len(lib.studies)) + " studies", "count")}
  {_chip(str(len(lib.aesthetics)) + " aesthetics", "count")}
</div>
<div class="grid-2">
  <div class="card">
    <h3>Studied axes</h3>
    <ul>
      {''.join(f'<li><a href="vectors/{v.id}.html">{_esc(v.canonical_name)}</a> · {v.status} · {v.confidence:.2f}</li>' for v in studied) or "<li>none yet</li>"}
    </ul>
  </div>
  <div class="card">
    <h3>How to query</h3>
    <p><code>vslib map "old-tv softness"</code></p>
    <p><code>vslib reconstruct aes_soft_halated_shadow</code></p>
    <p>Vague words stay vague. They never become atoms.</p>
  </div>
</div>
"""


def _vector_index(lib: Library) -> str:
    rows = []
    for vec in sorted(lib.vectors.values(), key=lambda v: (v.family_id, v.canonical_name)):
        fam = lib.families.get(vec.family_id)
        rows.append(
            f"<tr><td><a href='vectors/{vec.id}.html'>{_esc(vec.canonical_name)}</a></td>"
            f"<td class='mono'>{vec.id}</td><td>{_chip(vec.status)}</td>"
            f"<td>{_esc(fam.name if fam else vec.family_id)}</td>"
            f"<td>{_bar(vec.confidence)}</td></tr>"
        )
    return f"""
<h1 class="page">Vector index</h1>
<p class="lede">Every candidate and tested axis in the current basis.</p>
<table>
<thead><tr><th>name</th><th>id</th><th>status</th><th>family</th><th>confidence</th></tr></thead>
<tbody>{''.join(rows)}</tbody>
</table>
"""


def _family_index(lib: Library) -> str:
    cards = []
    for fam in sorted(lib.families.values(), key=lambda f: f.name):
        n = sum(1 for v in lib.vectors.values() if v.family_id == fam.id)
        cards.append(
            f"<div class='card'><h3><a href='families/{fam.id}.html'>{_esc(fam.name)}</a></h3>"
            f"<p>{_esc(fam.definition)}</p><p class='mono'>{n} vectors</p></div>"
        )
    return f"<h1 class='page'>Families</h1><p class='lede'>Provisional shelves, not final truths.</p><div class='grid-2'>{''.join(cards)}</div>"


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
        blocks.append(
            f"<article class='card' style='margin-bottom:1rem'>"
            f"<h3><a href='aesthetics/{aes.id}.html'>{_esc(aes.canonical_name)}</a> {_chip(aes.status)}</h3>"
            f"{_equation(lib, aes.id)}"
            f"</article>"
        )
    return f"""
<h1 class="page">Composite aesthetics</h1>
<p class="lede">Named looks as coordinates. Linear first: a = sum w_i v_i.</p>
{''.join(blocks)}
"""


def _alias_index(lib: Library) -> str:
    rows = []
    for alias in sorted(lib.aliases.values(), key=lambda a: a.raw_phrase.lower()):
        target = alias.target_id
        href = "#"
        if target.startswith("vec_"):
            href = f"vectors/{target}.html"
        elif target.startswith("aes_"):
            href = f"aesthetics/{target}.html"
        rows.append(
            f"<tr><td>{_esc(alias.raw_phrase)}</td><td><a href='{href}' class='mono'>{target}</a></td>"
            f"<td>{_chip(alias.mapping_type)}</td><td>{alias.confidence:.2f}</td>"
            f"<td>{_esc(alias.notes)}</td></tr>"
        )
    return f"""
<h1 class="page">Alias search</h1>
<p class="lede">Map a raw phrase onto the basis. Vague labels stay vague.</p>
<table><thead><tr><th>phrase</th><th>target</th><th>mapping</th><th>conf</th><th>notes</th></tr></thead>
<tbody>{''.join(rows)}</tbody></table>
"""


def _study_index(lib: Library) -> str:
    cards = []
    for s in sorted(lib.studies.values(), key=lambda x: x.id):
        cards.append(
            f"<div class='card'><h3><a href='studies/{s.id}.html'>{_esc(s.title)}</a></h3>"
            f"<p class='mono'>{s.id}</p><p>{_chip(s.status)} {_chip(s.decision or 'undecided')}</p>"
            f"<p>{_esc(s.protocol)}</p></div>"
        )
    return f"<h1 class='page'>Controlled studies</h1><div class='grid-2'>{''.join(cards)}</div>"


def _questions(lib: Library) -> str:
    blocks = ["<h1 class='page'>Unresolved questions</h1>"]
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
        "observation_matrix.csv",
        "confidence_matrix.csv",
        "composite_weight_matrix.csv",
        "alias_mapping.csv",
        "cooccurrence_matrix.csv",
        "vector_similarity_matrix.csv",
        "aesthetic_similarity_matrix.csv",
        "vector_correlation_matrix.csv",
        "interaction_candidates.csv",
        "reconstruction_evaluations.csv",
    ]
    lis = "".join(f"<li><span class='mono'>{f}</span> in data/</li>" for f in files)
    return f"""
<h1 class="page">Matrices</h1>
<p class="lede">Machine-readable tables generated from the same records as these pages.</p>
<ul>{lis}</ul>
<p>C = X<sup>T</sup>X. Similarity is cosine. Correlation is column-wise on X. None of this claims orthogonality.</p>
"""


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
    studies = "".join(
        f"<li><a href='../studies/{s}.html'>{s}</a></li>" for s in vec.study_ids
    ) or "<li>none</li>"
    effects = "".join(f"<li>{_esc(e)}</li>" for e in vec.observable_effects) or "<li>not yet observed</li>"
    qs = "".join(f"<li>{_esc(q)}</li>" for q in vec.open_questions) or "<li>none</li>"
    evidence = _vector_evidence(lib, vec.id)
    mark = max(8.0, min(92.0, vec.confidence * 100))
    return f"""
<p class="eq-block"><span class="sum">v</span> = <span class="v">v<sub>{_esc(_short_v(vec.id))}</sub></span></p>
<h1 class="page">{_esc(vec.canonical_name)}</h1>
<div class="meta">
  {_chip(vec.status)}
  <span class="chip mono">{vec.id}</span>
  <span class="chip">conf {_esc(f"{vec.confidence:.2f}")}</span>
  <span class="chip"><a href="../families/{vec.family_id}.html">{_esc(fam.name if fam else vec.family_id)}</a></span>
</div>
<div class="axis">
  <div class="pole">{_esc(vec.low_pole)}</div>
  <div class="track"><i style="left:{mark:.0f}%"></i></div>
  <div class="pole hi">{_esc(vec.high_pole)}</div>
</div>
<p class="lede">{_esc(vec.definition)}</p>
<div class="grid-2">
  <div class="card"><h3>What it changes</h3><p>{_esc(vec.testable_claim)}</p><ul>{effects}</ul></div>
  <div class="card"><h3>Aliases</h3><p>{_esc(", ".join(vec.aliases) or "none")}</p></div>
</div>
<h2>Controlled examples</h2>
{evidence}
<h2>Nearby</h2><ul>{nearby}</ul>
<h2>Commonly confused with</h2><ul>{not_same}</ul>
<h2>Studies</h2><ul>{studies}</ul>
<h2>Scoring</h2><p>{_esc(vec.scoring_guidance or "0 absent, 0.5 moderate, 1 dominant.")}</p>
<h2>Open questions</h2><ul>{qs}</ul>
"""


def _vector_evidence(lib: Library, vector_id: str) -> str:
    rows = {}
    for obs in lib.observations.values():
        if obs.intended_vector_id != vector_id or not obs.anchor_id:
            continue
        rows.setdefault(obs.anchor_id, {})[obs.intended_level or ""] = obs
    if not rows:
        return "<p>No controlled examples yet.</p>"
    html = ['<div class="strip">']
    html.append("<div class='anchor-row'><div></div><div class='caption'>low</div><div class='caption'>medium</div><div class='caption'>high</div></div>")
    for anchor_id, levels in rows.items():
        name = lib.anchors[anchor_id].name if anchor_id in lib.anchors else anchor_id
        cells = [f"<div class='an'>{_esc(name)}</div>"]
        for level in ("low", "medium", "high"):
            obs = levels.get(level)
            if obs:
                cells.append(
                    f"<div class='thumb'><a href='../observations/{obs.id}.html'>"
                    f"<img src='../{obs.image_path}' alt='{obs.id}'></a>"
                    f"<div class='caption'>{obs.id}</div></div>"
                )
            else:
                cells.append("<div class='thumb'></div>")
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
    refs = "".join(
        f"<li><a href='../observations/{o}.html'>{o}</a></li>" for o in aes.observation_ids
    ) or "<li>none</li>"
    notes = "".join(f"<li>{_esc(n)}</li>" for n in aes.interaction_notes) or "<li>none</li>"
    ev = ""
    if aes.observation_ids:
        thumbs = []
        for oid in aes.observation_ids[:5]:
            obs = lib.observations.get(oid)
            if not obs:
                continue
            thumbs.append(
                f"<div><a href='../observations/{obs.id}.html'><img src='../{obs.image_path}' alt='{obs.id}'></a>"
                f"<div class='caption'>{obs.anchor_id} · {obs.id}</div></div>"
            )
        ev = f"<div class='strip levels'>{''.join(thumbs)}</div>"
    return f"""
{_equation(lib, aes.id, "../")}
<h1 class="page">{_esc(aes.canonical_name)}</h1>
<div class="meta">{_chip(aes.status)}<span class="chip mono">{aes.id}</span>{_chip("conf "+f"{aes.confidence:.2f}")}</div>
<p class="lede">{_esc(aes.definition)}</p>
<div class="stage">
  {_constellation(lib, aes.id, "../")}
  <div>
    <h2>Coordinate</h2>
    {_weight_rows(lib, aes.id, "../")}
  </div>
</div>
<h2>Reconstruction plates</h2>
{ev or "<p>No reconstruction plates yet.</p>"}
<h2>Interactions</h2><ul>{notes}</ul>
<h2>Nearest neighbors</h2><ul>{near}</ul>
<h2>Notes</h2><p>{_esc(aes.reconstruction_notes)}</p>
<h2>Evidence</h2><ul>{refs}</ul>
"""


def _study_page(lib: Library, study_id: str) -> str:
    study = lib.studies[study_id]
    grid = f"<p><img src='../artifacts/grids/{study.id}.jpg' alt='grid'></p>" if (lib.root / "artifacts" / "grids" / f"{study.id}.jpg").exists() else ""
    by_anchor: dict[str, dict[str, object]] = {}
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
                f"<div class='caption'>{level} · {obs.id}</div></div>"
            )
        blocks.append(f"<h3>{_esc(name)}</h3><div class='strip levels'>{''.join(cells)}</div>")
    obs_lis = "".join(
        f"<li><a href='../observations/{o}.html'>{o}</a></li>" for o in study.observation_ids
    )
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
<h2>Observations</h2><ul>{obs_lis}</ul>
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
<h1 class="page">{obs.id}</h1>
<div class="meta">
  <a class="chip" href="../studies/{obs.study_id}.html">{obs.study_id}</a>
  {_chip(obs.intended_level or "n/a")}
  <span class="chip">{_esc(obs.anchor_id or "")}</span>
</div>
<p><img src="../{obs.image_path}" alt="{obs.id}" style="max-width:min(720px,100%)"></p>
<h2>Prompt</h2>
<p class="mono" style="white-space:pre-wrap;font-size:0.82rem">{_esc(obs.prompt)}</p>
<p>Seed: {_esc(obs.seed or "unavailable")} · tool: {_esc(obs.settings.get("tool", obs.model))}</p>
<h2>Scores</h2>
<table><thead><tr><th>vector</th><th>score</th><th>conf</th></tr></thead><tbody>{scores}</tbody></table>
<h2>Unintended changes</h2><ul>{unintended}</ul>
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
"""
