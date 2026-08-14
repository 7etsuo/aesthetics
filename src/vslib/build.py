"""Build matrices, wiki, and site from the registry."""

from __future__ import annotations

from pathlib import Path

from vslib.grids import write_all_grids
from vslib.matrices import generate_matrices
from vslib.seed import materialize
from vslib.site import generate_site
from vslib.store import Library
from vslib.wiki import generate_wiki


def build(root: Path | str, *, seed: bool = True) -> Library:
    lib = Library(root)
    lib.ensure_dirs()
    lib.load()
    if seed:
        materialize(lib)
        lib.save()
        lib.load()
    generate_matrices(lib)
    write_all_grids(lib)
    generate_wiki(lib)
    generate_site(lib)
    return lib


def default_root() -> Path:
    return Path(__file__).resolve().parents[2]
