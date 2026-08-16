# Atlas cinematic scene plates

This package is the production visual world for the Atlas chamber. It uses six
authored cinematic scenes in desktop and mobile compositions, each paired with
an exactly aligned relative inverse-depth map for restrained GPU parallax and
relighting. It contains no GLB, PBR model, or procedural beacon asset.

## Package layout

- `atlas-world-v2.json` is the canonical `atlas-world/v2`, version 2 manifest.
- `plates/desktop/` contains six 1672 × 941 color/depth pairs.
- `plates/mobile/` contains four 941 × 1672 pairs and two 853 × 1844 pairs.
- `social-source.webp` is the focal-point-aware 1200 × 630 intermediate used by
  the separate public social-card generator. It is a crop of the desktop
  Control plate and introduces no new visual content.

Every asset record carries its path, SHA-256 digest, byte count, dimensions,
and MIME type. Color and depth dimensions are identical within every pair.
The Control color is also the loading poster and non-WebGL fallback; the build
does not duplicate those pixels. Save-Data mode preloads color only.

## Runtime contract

The renderer is `depth-parallax-v1`. The beat order is Control, Response,
Comparison, Association, Reconstruction, and Archive. Authored focal points are
normalized `[x, y]` coordinates with a top-left origin in intrinsic plate space.
They guide cover alignment without changing the images.

Depth maps are lossless 8-bit grayscale WebP with per-plate min/max
normalization. They encode relative inverse depth: 255 is near and 0 is far.
Some WebP decoders expose a grayscale file as RGB; in that case all three
decoded channels are byte-identical and the renderer may sample red.

Parallax is capped at 18 px on desktop and 10 px on mobile. The authored
interaction response/settle budget is 48/240 ms, relighting is capped at 0.6 EV,
and chapter transitions are 900 ms.

## Rebuilding

The approved PNG source IDs are registered with exact dimensions and SHA-256
digests in `tools/world_v5/plate_sources.json`; the registry contains no local
filesystem root. Source-backed generation requires `ATLAS_PLATE_SOURCE_ROOT` to
name a directory containing those twelve files. Depth generation additionally
requires Python packages `torch`, `transformers`, `numpy`, and Pillow plus the
locally cached, pinned Depth Anything V2 Small revision documented in
`CREDITS.md`. These large reproduction dependencies and private source PNGs are
not part of the normal project install. The builder uses `local_files_only=True`
and fails rather than downloading or substituting a model.

```sh
python tools/build_emulsion_world.py --verify-only
pytest -q tests/test_world_v5_assets.py
```

To run a source-backed reproduction in a prepared audit environment:

```sh
export ATLAS_PLATE_SOURCE_ROOT="${ATLAS_VERIFIED_SOURCE_CACHE}"
python tools/build_emulsion_world.py --control-checkpoint
python tools/build_emulsion_world.py
python tools/build_emulsion_world.py --determinism-check
ATLAS_RUN_WORLD_REPRO=1 pytest -q tests/test_world_v5_assets.py
```

Without `ATLAS_RUN_WORLD_REPRO=1`, the default asset suite verifies all
committed hashes, dimensions, depth variance, byte budgets, provenance, and
deterministic lightweight WebP encoding, then explicitly skips the two-build
model reproduction.

The Control-only command writes its integration record to
named `atlas-scene-plates-control-checkpoint.json` in the system temporary
directory. A full production build is hard-capped at 12 MB and targets 10 MB;
each initial Control color/depth pair is hard-capped at 1.5 MB.
