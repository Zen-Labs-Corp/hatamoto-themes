## Theme

- **Name:** kaizen · **Type:** blog · **Prefix:** kz · **Title:** Kaizen
- **Description (<=200):** A dark-first blog theme: a glowing horizon hero, a numbered index with sticky months, smooth page transitions and a live status strip in the footer.
- **Palette** (primary = owner's Theme colour, default indigo `#5b6cff`; accent text = `color-mix(primary 74%, ink)`):
  - Dark: paper `#08090c`, paper-2 `#0d0f14`, surface `#12151c`, surface-2 `#191d27`, ink `#eceef3`, ink-2 `#a9b0bf`, muted `#7a8293`, line `#1b1f29`, line-2 `#272c39`, dot `rgba(255,255,255,.09)`, glass `rgba(16,19,26,.7)`, glow opacity .55
  - Light: paper `#f6f6f3`, paper-2 `#efefea`, surface `#ffffff`, surface-2 `#ececE6`, ink `#101114`, ink-2 `#3c404a`, muted `#5f6470`, line `#e2e2dc`, line-2 `#d1d1c9`, dot `rgba(10,12,20,.10)`, glass `rgba(255,255,255,.78)`, glow opacity .3
  - Muted text must pass AA on paper in both modes (verify; nudge if not).
- **Fonts:** Geist (`geist`, variable 100-900) body+headings; Geist Mono (`geist-mono`) for labels, dates, numbers. Self-hosted via `add-font.sh`. Must be overridable through `--hm-*` font tokens.
- **Type scale:** dramatic: hero h1 clamp(52px,9vw,112px)/.95 -0.045em; page h1 clamp(36px,5.4vw,60px); body 17px/1.7; mono labels 12px uppercase .06em.
- **Signature details:**
  1. Top bar: wordmark left, numbered menu right (`01 Journal`…), sliding hover highlight, condenses into a centred glass capsule with a scroll-progress line after 40px of scroll.
  2. Static sunrise horizon: huge disc with an indigo rim + radial glow over a fading dot grid (home hero); dot grid fades on inner page heads; glow echoes at the footer bottom.
  3. Numbered index (`009`), month label sticky in a left rail, category tag, mono date; latest-entry feature card.
  4. Post: breadcrumb, left-aligned title, facts row (published, reading, words), 21:9 image, right sticky numbered TOC with scroll-spy + read %, large-type blockquote, code block with header bar, bordered table, "Keep reading" rows.
  5. Footer: colophon columns, live status strip (online, local time, viewport, entries, last entry, light/dark switch), giant outline wordmark.
  6. Motion: cross-document view transitions (CSS `@view-transition { navigation: auto }`, root fade/scale/blur, title morph list->post where feasible), rows reveal on scroll, mode switch cross-fade. All off under `prefers-reduced-motion`.
- **Layouts owned:** shell (`base`, header, footer), `home`, `single-post`, `archive`, `taxonomy`, `search`, `404`, plus page styling (about) via `single`/page if needed; author falls back unless cheap. Section CSS: prose + core section restyle via tokens only.
- **Settings** (`settings_schema`): `color_mode` (dark|light|auto, default dark), `show_latest` (bool, default true), `show_status` (bool, default true), `show_wordmark` (bool, default true).
- **Distribution:** listed in the theme directory.
- **Out of scope:** see Non-goals.

