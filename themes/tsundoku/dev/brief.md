# Tsundoku: design brief

- Name: `tsundoku`; Type: `blog`; Prefix: `tk`; Title: `Tsundoku`
- Description: `Warm, playful blog theme: clay paper, plum ink and chartreuse, a rounded bento home and recent posts stacked as coloured book spines.`
- Palette light: paper `#f7ece2`, paper-2 `#efdccd`, ink `#2a1433`, muted `#6d5a6e`, line `#e2cbbb`,
  primary = ink `#2a1433` (owner-changeable), pop `#d4e84a` / pop-ink `#22300a`, teal `#0f6b66` / `#eaf7f3`,
  coral `#f08a64`; spine colours `#f08a64 #d4e84a #f3d38a #7cc6b8 #e8b4d4`.
- Palette dark: paper `#1a0f1d`, paper-2 `#28182c`, ink `#f4e6dc`, muted `#b8a2b5`, line `#3a2640`,
  pop `#c8de3a`, teal `#14837c`, coral `#e47b57`; footer `#0f0811`.
- Dark mode: auto (system + template toggle).
- Fonts: `bricolage-grotesque` (headings/UI, 780-800 weight, tight tracking) and `newsreader` (body, italic deks). OFL, via `scripts/add-font.sh`.
- Type scale: step-4 clamp(3rem,1.8rem+5.5vw,7.5rem) ... step--1 .85rem (see `:root` in mockups/a.html).
- Radius 20px tiles, 12px images, 999px pills. Gap clamp(.75rem,.5rem+1vw,1.25rem).
- Signature details: (1) the pile, recent posts as offset coloured book spines; (2) rounded colour bento with a
  chartreuse highlighter on headline words; (3) pill everything (header bar, nav, chips, search, pager) + the toppled-pile 404.
- Layouts owned: shell (header, mobile nav, footer), `home`, `single` (post), `archive` (post + taxonomy);
  page, search and 404 styled via CSS and own markup where needed; rest falls back to the built-in theme.
- Settings (+ template colour mode and spacing): `home_headline` (text, default "Small things worth noticing."
  with a way to mark highlighted words, e.g. text after `|` is highlighted), `recent_style` (select: `pile`|`list`,
  default `pile`), `show_newsletter` (bool, default true), `corners` (select: `rounded` 20px | `soft` 8px | `square`, default `rounded`).
- Distribution: listed in the theme directory.
- Out of scope: own sections, a real newsletter integration (tile links to the site's CTA/RSS), JS beyond the template's.
