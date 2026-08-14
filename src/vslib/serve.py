"""Local static server for the generated site."""

from __future__ import annotations

import functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


def serve(directory: Path, port: int = 8765) -> None:
    directory = Path(directory)
    if not directory.exists():
        raise SystemExit(f"site not built: {directory}")
    handler = functools.partial(SimpleHTTPRequestHandler, directory=str(directory))
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    print(f"serving {directory} at http://127.0.0.1:{port}/")
    server.serve_forever()
