from __future__ import annotations

import hashlib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def test_licensed_score_derivatives_remain_pinned() -> None:
    assert _sha256(ROOT / "assets/audio/signal-to-noise.opus") == (
        "ae46157590f6173508a0d7b680bd0ec5ffe6c26fee132f2e064c7abd542131ea"
    )
    assert _sha256(ROOT / "assets/audio/signal-to-noise.m4a") == (
        "da6aedd1d7d53ca3d8fd3511c0f79491d13a44cb9fcbfe3e657446e95c1d9b98"
    )


def test_room_stems_are_not_shipped() -> None:
    for root in (ROOT / "assets/audio", ROOT / "site/assets/audio"):
        assert not (root / "atlas-room.opus").exists()
        assert not (root / "atlas-room.m4a").exists()


def test_runtime_has_no_continuous_synthetic_source() -> None:
    source = (ROOT / "assets/chamber-audio.js").read_text()
    assert "createOscillator" in source
    assert "oscillator.stop" in source
    assert "createBufferSource" not in source
    assert "createBuffer(" not in source
    assert 'addEventListener("atlas:camera"' not in source
    assert "optical-hover" not in source
    assert "HOVER_PARTIALS" not in source
    assert "PROBE_HOVER" not in source
    assert "atlas-room" not in source
    assert "fetch(" not in source


def test_generator_builds_only_the_pinned_score() -> None:
    source = (ROOT / "tools/generate_chamber_audio.py").read_text()
    assert "OUTPUT_SHA256" in source
    assert "signal-to-noise.opus" in source
    assert "signal-to-noise.m4a" in source
    assert "atlas-room" not in source
    assert "numpy" not in source
