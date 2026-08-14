"""Grok Imagine experiment runner.

Imagine is an agent-operated instrument. This module plans jobs, writes
manifests, and ingests results. It does not call the image API itself.

Seed is not exposed by the current image_gen/image_edit tools. Control is
obtained by editing a locked source image rather than by seed reuse.
"""

from __future__ import annotations

import json
import shutil
from datetime import date
from pathlib import Path

from vslib.catalog import HOLD_CONSTANT, extra_hold_for
from vslib.ids import mint_id
from vslib.models import GenerationJob, Observation, Study
from vslib.prompts import level_edit_prompt
from vslib.store import Library

INSTRUMENT = {
    "name": "grok-imagine",
    "tools": ["image_gen", "image_edit"],
    "seed_control": "unavailable",
    "aspect_ratio_control": True,
    "source_image_lock": True,
    "notes": (
        "image_gen and image_edit do not accept a seed. Hold subject by generating "
        "a locked anchor, then image_edit that file while asking for a single change."
    ),
}


def plan_anchor_jobs(lib: Library) -> list[GenerationJob]:
    jobs = []
    for anchor in lib.anchors.values():
        jobs.append(GenerationJob(
            id=mint_id("job", f"anchor_{anchor.kind}"),
            study_id="study_anchor_set_001",
            kind="image_gen",
            prompt=anchor.lock_prompt,
            intended_vector_id=None,
            intended_level="baseline",
            anchor_id=anchor.id,
            source_image=None,
            aspect_ratio=anchor.aspect_ratio,
            hold_constant=list(HOLD_CONSTANT),
            status="planned",
        ))
    return jobs


def ensure_anchor_study(lib: Library) -> Study:
    study_id = "study_anchor_set_001"
    if study_id not in lib.studies:
        lib.studies[study_id] = Study(
            id=study_id,
            title="Locked anchor set",
            candidate_vector_id="vec_optical_softness",
            protocol="Generate five neutral reference subjects used by later single-axis edits.",
            status="planned",
            anchor_ids=sorted(lib.anchors),
            levels=["baseline"],
            hold_constant=list(HOLD_CONSTANT),
            date=str(date.today()),
            notes="candidate_vector_id is unused; this study only locks subjects.",
        )
    return lib.studies[study_id]


def plan_vector_study(
    lib: Library,
    vector_id: str,
    study_id: str,
    *,
    anchor_ids: list[str] | None = None,
) -> list[GenerationJob]:
    vec = lib.vectors[vector_id]
    selected = sorted(anchor_ids) if anchor_ids is not None else sorted(lib.anchors)
    if study_id not in lib.studies:
        lib.studies[study_id] = Study(
            id=study_id,
            title=f"Controlled variation of {vec.canonical_name}",
            candidate_vector_id=vector_id,
            protocol=(
                "Hold subject via locked anchor images. image_edit each anchor to low, "
                "medium, and high of one candidate. Do not change other dimensions on purpose."
            ),
            status="planned",
            anchor_ids=selected,
            levels=["low", "medium", "high"],
            hold_constant=list(HOLD_CONSTANT),
            date=str(date.today()),
        )
    if study_id not in vec.study_ids:
        vec.study_ids.append(study_id)

    jobs = []
    for aid in selected:
        if aid not in lib.anchors:
            raise KeyError(aid)
        anchor = lib.anchors[aid]
        source = anchor.image_path
        for level in ("low", "medium", "high"):
            prompt = level_edit_prompt(lib, vector_id, level)
            jobs.append(GenerationJob(
                id=mint_id("job", f"{study_id}_{anchor.kind}_{level}"),
                study_id=study_id,
                kind="image_edit",
                prompt=prompt,
                intended_vector_id=vector_id,
                intended_level=level,
                anchor_id=anchor.id,
                source_image=source,
                aspect_ratio=anchor.aspect_ratio,
                hold_constant=list(HOLD_CONSTANT) + [extra_hold_for(vector_id)],
                status="planned",
            ))
    return jobs


def plan_reconstruction_jobs(lib: Library, aesthetic_id: str, study_id: str) -> list[GenerationJob]:
    from vslib.prompts import reconstruction_prompt

    if study_id not in lib.studies:
        lib.studies[study_id] = Study(
            id=study_id,
            title=f"Linear reconstruction of {aesthetic_id}",
            candidate_vector_id="vec_optical_softness",
            protocol="Translate aesthetic weights into prompt phrases and edit each anchor.",
            status="planned",
            anchor_ids=sorted(lib.anchors),
            levels=["reconstruction"],
            hold_constant=list(HOLD_CONSTANT),
            date=str(date.today()),
            notes=f"target={aesthetic_id}",
        )
    jobs = []
    for anchor in lib.anchors.values():
        built = reconstruction_prompt(lib, aesthetic_id, "Use the attached source image as the locked subject.")
        jobs.append(GenerationJob(
            id=mint_id("job", f"{study_id}_{anchor.kind}"),
            study_id=study_id,
            kind="image_edit",
            prompt=built["prompt"],
            intended_vector_id=None,
            intended_level="reconstruction",
            anchor_id=anchor.id,
            source_image=anchor.image_path,
            aspect_ratio=anchor.aspect_ratio,
            hold_constant=list(HOLD_CONSTANT),
            status="planned",
        ))
    return jobs


def write_jobs(lib: Library, jobs: list[GenerationJob], name: str) -> Path:
    path = lib.root / "data" / "jobs" / f"{name}.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = {"instrument": INSTRUMENT, "jobs": [j.to_dict() for j in jobs]}
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    return path


def load_jobs(path: Path) -> list[GenerationJob]:
    payload = json.loads(Path(path).read_text(encoding="utf-8"))
    return [GenerationJob.from_dict(item) for item in payload["jobs"]]


def copy_artifact(src: str | Path, dest: str | Path) -> Path:
    dest = Path(dest)
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)
    return dest


def ingest_job(
    lib: Library,
    job: GenerationJob,
    image_path: str | Path,
    *,
    scores: list[dict] | None = None,
    unintended: list[str] | None = None,
    notes: str = "",
    date_str: str | None = None,
) -> Observation:
    dest_dir = lib.root / "artifacts" / "studies" / job.study_id
    is_anchor_study = job.intended_level == "baseline" or job.study_id in {
        "study_anchor_set_001",
        "study_lamp_anchor_set_001",
    }
    if is_anchor_study:
        dest_dir = lib.root / "artifacts" / "anchors"
        dest = dest_dir / f"{job.anchor_id}{Path(image_path).suffix}"
    else:
        level = job.intended_level or "out"
        dest = dest_dir / f"{job.anchor_id}_{level}{Path(image_path).suffix}"
    stored = copy_artifact(image_path, dest)
    rel = stored.relative_to(lib.root).as_posix()

    if job.anchor_id and job.anchor_id in lib.anchors and is_anchor_study:
        lib.anchors[job.anchor_id].image_path = rel

    obs_id = lib.next_obs_id()
    obs = Observation(
        id=obs_id,
        study_id=job.study_id,
        source_type="generated",
        image_path=rel,
        prompt=job.prompt,
        intended_vector_id=job.intended_vector_id,
        intended_level=job.intended_level,
        anchor_id=job.anchor_id,
        source_image=job.source_image,
        seed=None,
        aspect_ratio=job.aspect_ratio,
        model="grok-imagine",
        settings={
            "tool": job.kind,
            "seed_control": "unavailable",
            "hold_constant": job.hold_constant,
            "job_id": job.id,
        },
        unintended_changes=unintended or [],
        scores=[],
        notes=notes,
        date=date_str or str(date.today()),
    )
    if scores:
        from vslib.models import Score
        obs.scores = [Score(**s) if not isinstance(s, Score) else s for s in scores]
    lib.put_observation(obs)
    job.status = "ingested"
    job.output_path = rel
    job.observation_id = obs_id
    return obs


def jobs_markdown(jobs: list[GenerationJob]) -> str:
    lines = [
        "# Imagine jobs",
        "",
        f"Instrument: `{INSTRUMENT['name']}`. Seed control: {INSTRUMENT['seed_control']}.",
        "",
    ]
    for job in jobs:
        lines.extend([
            f"## {job.id}",
            "",
            f"- kind: `{job.kind}`",
            f"- study: `{job.study_id}`",
            f"- anchor: `{job.anchor_id}`",
            f"- intended: `{job.intended_vector_id}` @ `{job.intended_level}`",
            f"- source: `{job.source_image}`",
            f"- aspect: `{job.aspect_ratio}`",
            "",
            "Prompt:",
            "",
            f"> {job.prompt}",
            "",
        ])
    return "\n".join(lines)
