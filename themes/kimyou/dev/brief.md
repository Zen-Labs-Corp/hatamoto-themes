## Theme

- Name: `kimyou`; Type: `blog`; Prefix: `km`; Title: `Kimyou`
- Description: `Literary blog theme for writers: linen paper, oxblood and book-cloth green, posts as chapters, categories as spines on a shelf.`
- Palette light: paper `#f4eee3`, paper-2 `#ebe2d1`, ink `#221d1a`, muted `#6b6056`, line `#d8ccb6`,
  primary oxblood `#8c2f39` (owner-changeable) on `#fbf5ea`, cloth `#2e4b40` / cloth-ink `#efe6d3`,
  indigo `#2b3d5e`, ochre `#c27a2c`, foil gold `#b08a3e` (decoration only), fixed oxblood cloth
  `#8c2f39`, epigraph band `#8c2f39` / `#fbf5ea`, plank `#3b2a1d`.
- Palette dark ("night library"): paper `#121614`, paper-2 `#1a201d`, ink `#ece4d4`, muted `#a69d8d`,
  line `#2f3833`, primary `#e28a92` on `#1a0d0f`, cloth `#23392f`, indigo `#24324d`, gold `#d6b067`,
  ochre `#c9862f`, oxblood cloth `#7d2832`, band `#4a1a21` / `#f3e3d6`, plank `#5a4330`, footer `#0b0d0c`.
- Dark mode: auto (system) + the template's colour-mode setting/toggle.
- Fonts (OFL, `scripts/add-font.sh`): `cormorant-garamond` (display, italics), `literata` (reading),
  `manrope` (labels, buttons, nav, tables).
- Type scale and tokens: copy the `:root` block of `mockups/a.html` (steps -1..5, radius 2px / 6px,
  gap, section padding, measure 36rem, wide 72rem). Map colours/fonts/radius onto `--hm-*` so
  Theme > Colours and fonts restyles it (primary = oxblood).
- Signature details: (1) open-book spread hero with a CSS cloth-bound cover of the latest post;
  (2) the shelf: categories as spines sized by post count; (3) classic book typography on the reading
  side (drop cap + small caps, roman chapter numbers, `§` heads, fleurons, contents with dotted
  leaders, running head, colophon) mixed with a modern hairline card grid, sans labels and pills;
  (4) torn-page 404.
- Layouts owned: shell (header + running head, mobile nav, footer), `home`, `single` (post),
  `archive` (post index + taxonomy + author), search and 404 and page via own markup or CSS where
  needed; everything else falls back to the built-in theme.
- Settings (plus the template's colour mode and spacing):
  - `home_headline` (text, default `The small things | worth noticing.`; text after `|` in italic primary)
  - `home_lede` (text, default empty = site tagline)
  - `show_shelf` (bool, default true)
  - `books_category` (text slug, default `books`; empty or unknown hides the "On books" band)
  - `ornaments` (select `full` | `quiet`, default `full`; quiet drops drop caps, `§`, fleurons and
    roman numerals for plain modern headings)
- Distribution: listed in the theme directory.
- Out of scope: own builder sections, a real newsletter integration (box links to the site's
  CTA/subscribe page or RSS), JS beyond the template's, book-specific content types.

