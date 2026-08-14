"""Searchable static site generated from the same records as the wiki."""

from __future__ import annotations

import json
import shutil
from pathlib import Path

from vslib.matrices import nearest_aesthetics
from vslib.store import Library

CSS = """
:root {
  --zinc: #2b3038;
  --zinc-2: #353b45;
  --paper: #d8d2c4;
  --ink: #1c1714;
  --muted: #6a645a;
  --glass: #2a6f73;
  --glass-2: #8fd0c8;
  --amber: #c9842a;
  --rule: #b7b09f;
  --danger: #8a3b2a;
  --ok: #2f6b45;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: var(--zinc); color: var(--paper); }
body {
  font: 16px/1.5 "Literata", "Iowan Old Style", "Palatino Linotype", Palatino, serif;
}
a { color: var(--glass-2); text-decoration: none; }
a:hover { text-decoration: underline; }
code, .mono, input, kbd {
  font-family: "IBM Plex Mono", "Fragment Mono", ui-monospace, monospace;
}
.shell { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
nav {
  background: #23272e;
  border-right: 1px solid #1a1d22;
  padding: 1.25rem 1rem 3rem;
  position: sticky; top: 0; height: 100vh; overflow: auto;
}
nav .mark {
  font-family: "IBM Plex Sans Condensed", "Arial Narrow", sans-serif;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 0.72rem;
  color: var(--glass-2);
}
nav h1 { font-size: 1.15rem; margin: 0.35rem 0 1rem; color: var(--paper); font-weight: 600; }
nav a { display: block; color: var(--paper); padding: 0.18rem 0; font-size: 0.92rem; }
nav .sec {
  margin-top: 1.2rem;
  font-family: "IBM Plex Sans Condensed", sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.68rem;
  color: var(--amber);
}
main { padding: 1.5rem 2rem 4rem; max-width: 1100px; }
.mtf {
  display: flex; gap: 3px; height: 18px; margin: 0 0 1.25rem;
}
.mtf i { display: block; height: 100%; background: var(--paper); opacity: 0.85; }
.search {
  display: flex; gap: 0.6rem; align-items: center; margin-bottom: 1.25rem;
}
.search input {
  flex: 1; background: var(--zinc-2); color: var(--paper);
  border: 1px solid #4a5160; padding: 0.65rem 0.8rem; font-size: 0.95rem;
}
.search input:focus { outline: 2px solid var(--glass); border-color: var(--glass); }
.hits { background: #1f2329; border: 1px solid #3a404c; margin-bottom: 1rem; display: none; }
.hits a { display: block; padding: 0.45rem 0.7rem; color: var(--paper); border-bottom: 1px solid #2c313a; }
.hits a:hover { background: #2a313b; text-decoration: none; }
.hits .k { color: var(--amber); font-size: 0.75rem; margin-right: 0.5rem; }
h1.page { font-size: 2.1rem; line-height: 1.15; margin: 0 0 0.3rem; }
.lede { color: #c9c2b3; max-width: 62ch; }
.meta {
  display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0.8rem 0 1.2rem;
}
.chip {
  font-family: "IBM Plex Sans Condensed", sans-serif;
  font-size: 0.75rem; letter-spacing: 0.06em; text-transform: uppercase;
  border: 1px solid #5a6170; padding: 0.15rem 0.45rem; color: #d7d1c4;
}
.chip.canonical { border-color: var(--ok); color: #b6e0c4; }
.chip.provisional { border-color: var(--amber); color: #f0d09a; }
.chip.candidate { border-color: #6a645a; }
.chip.vague, .chip.rejected { border-color: var(--danger); color: #e3b2a6; }
.chip.composite, .chip.system { border-color: var(--glass); }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.card {
  background: var(--paper); color: var(--ink); padding: 0.9rem 1rem;
  border-radius: 0;
}
.card h3 { margin: 0 0 0.35rem; font-size: 1.05rem; }
.card p, .card li { color: #2a241f; }
.card a { color: #174f52; }
table { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
th, td { text-align: left; padding: 0.35rem 0.4rem; border-bottom: 1px solid #3d4450; }
th { font-family: "IBM Plex Sans Condensed", sans-serif; letter-spacing: 0.06em;
     text-transform: uppercase; font-size: 0.72rem; color: #c3bcae; font-weight: 600; }
.bar { height: 8px; background: #1a1d22; width: 140px; display: inline-block; vertical-align: middle; }
.bar > span { display: block; height: 100%; background: var(--glass-2); }
.strip { display: grid; gap: 8px; }
.strip.levels { grid-template-columns: repeat(3, 1fr); }
.strip img, .thumb img { width: 100%; height: auto; display: block; background: #111; }
.caption { font-size: 0.78rem; color: #b7b09f; font-family: "IBM Plex Mono", monospace; margin-top: 0.25rem; }
.anchor-row { display: grid; grid-template-columns: 140px 1fr 1fr 1fr; gap: 8px; align-items: start; margin-bottom: 12px; }
.anchor-row .an { font-size: 0.8rem; color: #c9c2b3; padding-top: 0.4rem; }
.warning { border-left: 3px solid var(--amber); padding: 0.4rem 0.8rem; color: #e6d3ad; }
footer { margin-top: 3rem; color: #8b8578; font-size: 0.8rem; }
@media (max-width: 860px) {
  .shell { grid-template-columns: 1fr; }
  nav { position: relative; height: auto; }
  .grid-2, .anchor-row, .strip.levels { grid-template-columns: 1fr; }
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
    _page(site / "index.html", "Library", _home(lib), nav="home")
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


def _nav(active: str) -> str:
    links = [
        ("home", "index.html", "Overview"),
        ("vectors", "vectors.html", "Vectors"),
        ("families", "families.html", "Families"),
        ("aesthetics", "aesthetics.html", "Aesthetics"),
        ("aliases", "aliases.html", "Aliases"),
        ("studies", "studies.html", "Studies"),
        ("matrices", "matrices.html", "Matrices"),
        ("questions", "questions.html", "Questions"),
    ]
    items = []
    for key, href, label in links:
        mark = " aria-current='page'" if key == active else ""
        items.append(f'<a href="{href}"{mark}>{label}</a>')
    return "\n".join(items)


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
<title>{_esc(title)} · visual timbre lab</title>
<link rel="stylesheet" href="{prefix}assets/app.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+Condensed:wght@500;600&family=Literata:opsz,wght@7..72,460;7..72,650&display=swap" rel="stylesheet">
<body>
<div class="shell">
<nav>
  <div class="mark">Image-formation atlas</div>
  <h1>Visual timbre lab</h1>
  {_nav_prefixed(nav, prefix)}
</nav>
<main>
  <div class="mtf" aria-hidden="true">{_mtf()}</div>
  <form class="search" role="search" data-prefix="{prefix}">
    <input id="q" type="search" placeholder="Search vectors, aliases, aesthetics…" autocomplete="off">
  </form>
  <div class="hits" id="hits"></div>
  {body}
  <footer>Canonical records live in registry/. Pages are generated. Basis is operational, not orthogonal.</footer>
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
        ("home", "index.html", "Overview"),
        ("vectors", "vectors.html", "Vectors"),
        ("families", "families.html", "Families"),
        ("aesthetics", "aesthetics.html", "Aesthetics"),
        ("aliases", "aliases.html", "Aliases"),
        ("studies", "studies.html", "Studies"),
        ("matrices", "matrices.html", "Matrices"),
        ("questions", "questions.html", "Questions"),
    ]
    items = []
    for key, href, label in links:
        mark = " aria-current='page'" if key == active else ""
        items.append(f'<a href="{prefix}{href}"{mark}>{label}</a>')
    return "\n".join(items)


def _mtf() -> str:
    widths = [3, 5, 8, 12, 18, 26, 36, 48, 28, 16, 10, 6, 4]
    return "".join(f'<i style="width:{w}px"></i>' for w in widths)


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


def _home(lib: Library) -> str:
    studied = [v for v in lib.vectors.values() if v.study_ids]
    return f"""
<h1 class="page">Smallest controllable visual properties</h1>
<p class="lede">
A navigable library of visual basis vectors: dimensions that can be isolated,
tested with Grok Imagine, named, and recombined. Phrases such as cinematic,
vintage, analog, or 1980s fantasy are not atoms. They are composites or vague labels.
</p>
<div class="meta">
  {_chip(str(len(lib.vectors)) + " vectors", "count")}
  {_chip(str(len(lib.observations)) + " observations", "count")}
  {_chip(str(len(lib.studies)) + " studies", "count")}
  {_chip(str(len(lib.aesthetics)) + " aesthetics", "count")}
</div>
<div class="warning">
  Operational basis only. Correlation, redundancy, dependence, and reconstruction error are tracked.
  A vector is canonical only after controlled tests across unrelated subjects.
</div>
<div class="grid-2" style="margin-top:1.2rem">
  <div class="card">
    <h3>Studied in this slice</h3>
    <ul>
      {''.join(f'<li><a href="vectors/{v.id}.html">{_esc(v.canonical_name)}</a> · {v.status} · conf {v.confidence:.2f}</li>' for v in studied) or "<li>none yet</li>"}
    </ul>
  </div>
  <div class="card">
    <h3>Agent entry points</h3>
    <p>Use <code>vslib map "old-tv softness"</code>, <code>vslib profile aes_80s_fantasy_tv</code>,
    <code>vslib reconstruct aes_soft_halated_shadow</code>, <code>vslib next</code>.</p>
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
<p class="lede">Every candidate and canonical dimension currently in the registry.</p>
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
    rows = []
    for aes in sorted(lib.aesthetics.values(), key=lambda a: a.canonical_name):
        rows.append(
            f"<tr><td><a href='aesthetics/{aes.id}.html'>{_esc(aes.canonical_name)}</a></td>"
            f"<td class='mono'>{aes.id}</td><td>{_chip(aes.status)}</td>"
            f"<td>{_bar(aes.confidence)}</td></tr>"
        )
    return f"""
<h1 class="page">Composite aesthetics</h1>
<p class="lede">Named looks stored as weight vectors over the basis. Linear first.</p>
<table><thead><tr><th>name</th><th>id</th><th>status</th><th>confidence</th></tr></thead>
<tbody>{''.join(rows)}</tbody></table>
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
<p class="lede">Type in the search box, or scan the table. Vague labels stay vague.</p>
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
    return f"""
<h1 class="page">{_esc(vec.canonical_name)}</h1>
<div class="meta">
  {_chip(vec.status)}
  <span class="chip mono">{vec.id}</span>
  <span class="chip">conf {_esc(f"{vec.confidence:.2f}")}</span>
  <span class="chip"><a href="../families/{vec.family_id}.html">{_esc(fam.name if fam else vec.family_id)}</a></span>
</div>
<p class="lede">{_esc(vec.definition)}</p>
<div class="grid-2">
  <div class="card"><h3>What it changes</h3><p>{_esc(vec.testable_claim)}</p><ul>{effects}</ul></div>
  <div class="card"><h3>Poles</h3>
    <p>Low: {_esc(vec.low_pole)}</p>
    <p>High: {_esc(vec.high_pole)}</p>
    <p>Aliases: {_esc(", ".join(vec.aliases) or "none")}</p>
  </div>
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
    rows = []
    for item in sorted(aes.weights, key=lambda w: abs(w.weight), reverse=True):
        name = lib.vectors[item.vector_id].canonical_name if item.vector_id in lib.vectors else item.vector_id
        flag = " hypothesized" if item.hypothesized else ""
        rows.append(
            f"<tr><td><a href='../vectors/{item.vector_id}.html'>{_esc(name)}</a></td>"
            f"<td>{_bar(item.weight)}</td><td>{flag}</td></tr>"
        )
    nearest = nearest_aesthetics(lib, aes.id)
    near = "".join(
        f"<li><a href='{i}.html'>{_esc(lib.aesthetics[i].canonical_name)}</a> cosine {s:.3f}</li>"
        for i, s in nearest
    ) or "<li>none</li>"
    refs = "".join(
        f"<li><a href='../observations/{o}.html'>{o}</a></li>" for o in aes.observation_ids
    ) or "<li>none</li>"
    notes = "".join(f"<li>{_esc(n)}</li>" for n in aes.interaction_notes) or "<li>none</li>"
    return f"""
<h1 class="page">{_esc(aes.canonical_name)}</h1>
<div class="meta">{_chip(aes.status)}<span class="chip mono">{aes.id}</span>{_chip("conf "+f"{aes.confidence:.2f}")}</div>
<p class="lede">{_esc(aes.definition)}</p>
<h2>Coordinate vector</h2>
<table><thead><tr><th>vector</th><th>weight</th><th></th></tr></thead><tbody>{''.join(rows)}</tbody></table>
<h2>Interactions</h2><ul>{notes}</ul>
<h2>Nearest neighbors</h2><ul>{near}</ul>
<h2>Reconstruction</h2><p>{_esc(aes.reconstruction_notes)}</p>
<h2>Evidence</h2><ul>{refs}</ul>
"""


def _study_page(lib: Library, study_id: str) -> str:
    study = lib.studies[study_id]
    grid = f"<p><img src='../artifacts/grids/{study.id}.jpg' alt='grid'></p>" if (lib.root / "artifacts" / "grids" / f"{study.id}.jpg").exists() else ""
    # side by side by anchor
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
    # also write JS next to css
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


# Fix _page writing JS: generate_site already writes JS in _copy_artifacts.
# Rewrite _page to drop the broken js path logic at the end.
