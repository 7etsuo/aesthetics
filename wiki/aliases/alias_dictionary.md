# Alias dictionary

Raw phrases mapped to canonical entities. Vague cultural labels are not atoms.

| raw phrase | target | mapping | confidence | notes |
|---|---|---|---:|---|
| 1980s fantasy | `aes_80s_fantasy_tv` | composite | 0.90 |  |
| 80s fantasy | `aes_80s_fantasy_tv` | composite | 0.90 |  |
| 80s fantasy TV look | `aes_80s_fantasy_tv` | composite | 0.94 |  |
| analog | `aes_analog_generic` | vague | 0.93 | Not atomic. Could be film, tape, or print. |
| cinematic | `aes_cinematic_generic` | vague | 0.95 | Not atomic. Usually lighting ratio plus contrast plus shallow space plus grade. |
| clinical crispness | `vec_optical_softness` | alias | 0.70 | Names the low pole, not a separate vector. |
| crushed blacks | `vec_black_level` | near_alias | 0.72 | Sometimes means black floor, sometimes shadow density. |
| dreamy | `vec_optical_softness` | vague | 0.55 | Often softness plus bloom plus lifted midtones. Do not treat as atomic. |
| film emulation | `aes_film_emulation` | composite | 0.86 | Usually only the finishing layer. Incomplete as a look. |
| film grain | `vec_grain_structure` | alias | 0.86 |  |
| film halation | `vec_halation` | alias | 0.92 |  |
| film-to-tape softness | `vec_telecine_softness` | alias | 0.88 |  |
| filmic | `aes_film_emulation` | vague | 0.80 |  |
| glow | `vec_highlight_bloom` | near_alias | 0.64 | Glow is overloaded. Prefer bloom or halation. |
| gritty | `vec_grain_structure` | vague | 0.50 | Often grain plus microcontrast plus dirt plus hard light. |
| handmade material feel | `vec_practical_material_feel` | alias | 0.80 |  |
| highlight bleed | `vec_halation` | near_alias | 0.74 | May also mean bloom. |
| inky shadows | `vec_shadow_density` | alias | 0.88 |  |
| lens softness | `vec_optical_softness` | alias | 0.88 |  |
| lifted blacks | `vec_black_level` | alias | 0.90 |  |
| lighting ratio | `vec_key_to_fill_ratio` | alias | 0.90 |  |
| moody | `aes_cinematic_generic` | vague | 0.92 |  |
| murky shadows | `vec_shadow_density` | alias | 0.90 |  |
| old look | `aes_vintage_generic` | vague | 0.90 |  |
| old-cinema softness | `vec_optical_softness` | alias | 0.78 |  |
| old-tv softness | `vec_telecine_softness` | alias | 0.82 |  |
| open shadows | `vec_shadow_density` | alias | 0.80 | Low pole. |
| practical puppet feel | `vec_practical_material_feel` | near_alias | 0.72 |  |
| retro | `aes_vintage_generic` | vague | 0.90 |  |
| soft shoulder | `vec_highlight_rolloff` | alias | 0.86 |  |
| television-stage blocking | `vec_theatrical_blocking` | alias | 0.84 |  |
| VHS | `aes_vhs_look` | system | 0.88 | A capture/transfer system, not a vector. |
| VHS softness | `vec_vhs_bandwidth_loss` | alias | 0.80 |  |
| VHS texture | `vec_analog_video_texture` | near_alias | 0.70 | VHS also includes bandwidth loss. |
| vintage | `aes_vintage_generic` | vague | 0.95 | Not atomic. Mixes softness, palette, grain, and transfer. |
| vintage softness | `vec_optical_softness` | alias | 0.84 | Common prompt phrase. Not identical to telecine softness. |
