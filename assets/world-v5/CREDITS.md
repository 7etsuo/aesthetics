# Scene-plate provenance and credits

## Authored color plates

The twelve source images were generated for this project with OpenAI image
generation and then used as authored scene plates. Production processing is
limited to deterministic WebP encoding. The package's `social-source.webp` is
an intermediate crop/resize of the desktop Control plate; the separate public
JPEG generator applies its typography and treatment to that intermediate. No
generated scene plate is presented as documentary photography, an observation
atlas, or an exact scientific record.

| Variant | Beat | Source file | SHA-256 |
| --- | --- | --- | --- |
| Desktop | Control | `exec-e213b5ed-7c63-4ccd-8718-c87c139164f0.png` | `304a29b88df06cf36e2db787e49ec848f41b003b4034d528d5298949f8fca86e` |
| Desktop | Response | `exec-ca6747a9-82d5-4f21-89bf-cba0b37f4dcf.png` | `56e48c59fb3181586269e1b3c320088679703aa8dd8302fec7d82bb82d87657e` |
| Desktop | Comparison | `exec-9c3c32d2-3b07-45a5-90f3-8acf5254ed49.png` | `67c21293bc82333688a872bef830079e73265fdf999439af609ae6a4a6b2e37b` |
| Desktop | Association | `exec-2da1d72e-32c2-498c-ba64-2ab9404ceffc.png` | `18e287f90e94d9c823d4149aaf8798698f663fd51e83acfdaefdc5bf1cff3e47` |
| Desktop | Reconstruction | `exec-ef0e9ebb-76be-4a4d-a377-269986fb6c80.png` | `378e86e86300b176c7d5f1873c073d8936749368e7ac35707f8b6a1db44341ea` |
| Desktop | Archive | `exec-b5706abb-1799-4fe5-ab47-dbde49d39db5.png` | `51d2288b64857270850e8b026696677194248431bd92fa7b7898166912e3e0d9` |
| Mobile | Control | `exec-2ac9201c-50ec-4405-bc2a-44ae4107776d.png` | `14952a2d381cbe5b91608e27c2a868f6e934454b61360e3276cf1b470d47137a` |
| Mobile | Response | `exec-bf62856e-d272-4af0-88df-c14146ebc903.png` | `e94466040c0205b8bb238f2491204a2c7d866cac4a3069899274e546847964c0` |
| Mobile | Comparison | `exec-a284ca89-f676-451b-858a-daa2440bb719.png` | `76151c4223debaf13ff68d38a4bf29489d1e05ee78966f4f4be921a8f7307ad8` |
| Mobile | Association | `exec-7161e0b1-75e7-45d9-81b8-7f9d80b996e7.png` | `aa8d9d9ab93f61152ea4230815e35c3305a530a10d8cecd352398397261e93fe` |
| Mobile | Reconstruction | `exec-867d3818-5463-450b-a01f-1edecd0ab1f4.png` | `8ab349e439ced22951db1d0cd8bdcbd87da57b42be135189169b784ff01bc225` |
| Mobile | Archive | `exec-36d675a1-4455-4960-9872-8caab78abcac.png` | `45ad23a607a0bc71902f3b56b16ac3c2758fc5d9e047640b72e8348826b7a7a1` |

The mobile Reconstruction source is the corrected composition with exactly
three gates. Dimensions, focal points, and the same records are machine-readable
in `tools/world_v5/plate_sources.json` and embedded in the production manifest.

## Depth estimator

Aligned depth was inferred with
[`depth-anything/Depth-Anything-V2-Small-hf`](https://huggingface.co/depth-anything/Depth-Anything-V2-Small-hf/tree/5426e4f0f36572d16453bbda7a8389317b1bef99),
pinned to revision `5426e4f0f36572d16453bbda7a8389317b1bef99`.
The model is licensed under
[`Apache-2.0`](https://www.apache.org/licenses/LICENSE-2.0).

The build uses the model's relative-depth output, bicubic resampling with
`align_corners=False`, and deterministic per-plate normalization. Model weights
are build-time inputs from the local Hugging Face cache and are not shipped in
this package.

## Retired inputs

Earlier Poly Haven PBR experiments and their marine backplate were not used in
the production derivatives and are not shipped. No retired PBR asset or source
registry is required by the production build.
