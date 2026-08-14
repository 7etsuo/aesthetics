"""Command-line agent interface."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from vslib.build import build, default_root
from vslib.retrieve import (
    agent_bundle,
    aesthetic_profile,
    compare_aesthetics,
    explain_observation,
    map_language,
    next_experiments,
    reconstruct,
)
from vslib.store import Library


def _lib(root: str | None) -> Library:
    path = Path(root) if root else default_root()
    return Library(path).load()


def _print(data) -> None:
    print(json.dumps(data, indent=2, default=str))


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="vslib", description="Visual basis vector library")
    parser.add_argument("--root", default=None)
    sub = parser.add_subparsers(dest="cmd", required=True)

    sub.add_parser("build")
    p_map = sub.add_parser("map")
    p_map.add_argument("phrase")
    p_profile = sub.add_parser("profile")
    p_profile.add_argument("aesthetic_id")
    p_cmp = sub.add_parser("compare")
    p_cmp.add_argument("a")
    p_cmp.add_argument("b")
    p_rec = sub.add_parser("reconstruct")
    p_rec.add_argument("aesthetic_id")
    p_rec.add_argument("--subject", default=None)
    p_ex = sub.add_parser("explain")
    p_ex.add_argument("observation_id")
    sub.add_parser("next")
    p_q = sub.add_parser("query")
    p_q.add_argument("phrase")
    p_serve = sub.add_parser("serve")
    p_serve.add_argument("--port", type=int, default=8765)

    args = parser.parse_args(argv)
    if args.cmd == "build":
        lib = build(Path(args.root) if args.root else default_root())
        _print({"ok": True, "vectors": len(lib.vectors), "observations": len(lib.observations)})
        return 0

    lib = _lib(args.root)
    if args.cmd == "map":
        _print(map_language(lib, args.phrase))
    elif args.cmd == "profile":
        _print(aesthetic_profile(lib, args.aesthetic_id))
    elif args.cmd == "compare":
        _print(compare_aesthetics(lib, args.a, args.b))
    elif args.cmd == "reconstruct":
        _print(reconstruct(lib, args.aesthetic_id, args.subject))
    elif args.cmd == "explain":
        _print(explain_observation(lib, args.observation_id))
    elif args.cmd == "next":
        _print(next_experiments(lib))
    elif args.cmd == "query":
        _print(agent_bundle(lib, args.phrase))
    elif args.cmd == "serve":
        from vslib.serve import serve
        serve(lib.root / "site", args.port)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
