## Theme

- **Name:** ukiyou (浮世, "floating world", the world of ukiyo-e prints). Type: `blog`. Prefix: `uk`.
- **Title:** Ukiyou
- **Description (<=200 chars):** A dense magazine blog theme in indigo and saffron: centred masthead, lead story, three-column grid with a numbered sidebar, bold sans headlines over serif text.
- **Direction:** Recap (recap.thepixelthemes.com) for direction only: editorial blog, big imagery, serif body, quiet chrome. Colour tokens deliberately changed (Recap is black/white/gold); never copy its CSS, markup, text or images.
- **Palette light:** primary indigo `#2f3e8f`, accent saffron `#c9821a`, ink `#1d1f2b`, paper `#f7f3ea`, surface `#eee8da`, muted `#5d5f6e`, line `#ddd5c4`, on-primary `#f7f3ea`.
- **Palette dark:** primary `#9fb0ff`, accent `#f0b24f`, ink `#ecebe6`, paper `#14151d`, surface `#1d1f2a`, muted `#a3a5b4`, line `#2d3040`, on-primary `#14151d`.
- **Primary is owner-changeable** through Theme > Colours (`--hm-*` tokens); the theme's palette maps onto them. Accent comes from the accent preset setting.
- **Fonts (self-hosted, OFL):** headings + UI `instrument-sans` (variable); body `source-serif-4` (variable, normal + italic). Via `scripts/add-font.sh`.
- **Type:** headings sans 650 weight, tight tracking (-0.025em); scale 1.25 / 1.6 / 2.2 / 3 / 4.2 rem; body serif 1.05rem / 1.6.
- **Radii:** 0 (square corners everywhere; chips and pager are square).
- **Signature details:** (1) issue strip above a centred wordmark with a 2px-over-1px ruled nav bar and saffron underline on the current item; (2) category labels with a short saffron bar before them; (3) numbered sidebar list in saffron leading-zero numerals; (4) full-width indigo subscribe band; (5) giant indigo 404.
- **Dark mode:** yes, `color_mode` default `auto` (template setting), header toggle as the template does it.
- **Layouts owned (partial theme):** `base`, `home`, `single` (posts), `archive`, `taxonomy`, `search`, `404`, partials `header`, `footer`, plus page/author only if the built-in falls short visually. Everything else falls back to the built-in theme. No own sections.
- **Settings (settings_schema),** besides template's `color_mode` + `density`:
  - `issue_strip` (bool, default true) and `issue_label` (string, default `No. 1`; the month/year is printed automatically after it).
  - `sidebar` (bool, default true) and `sidebar_title` (string, default `Also new`): the numbered list shows the next posts after the home grid (Hatamoto has no read counts), plus topic chips.
  - `subscribe_url` (string, default empty) and `subscribe_headline` (string, default `New stories, twice a month. Nothing else.`): the band shows only when `subscribe_url` is set; the header Subscribe button links there too (hidden when empty).
  - `accent` (enum `saffron|brick|teal`, default `saffron`): brick `#b4532a`-ish, teal `#1f7a74`-ish, each with an AA-checked dark variant.
- **Distribution:** listed in the theme directory.
- **Out of scope:** own sections, JS beyond what the template already has (toggle/menu), read-count "Most read", any change to `template/`, `scripts/`, `site-types/`.

