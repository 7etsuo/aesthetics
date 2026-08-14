#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from vslib.build import build

if __name__ == "__main__":
    lib = build(ROOT)
    print(f"built {len(lib.vectors)} vectors, {len(lib.observations)} observations")
