# Yukigeshiki: design brief

## Theme

- Name: `yukigeshiki` ("snowy scenery")
- Type: `blog`
- Prefix: `yk`
- Title: `Yukigeshiki`
- Description: `Notion-style blog theme: a sticky masthead and category sidebar, a two-column card grid on tinted panels, Bricolage Grotesque with Source Serif italics, in pine green.`
- Palette light: paper `#fcfcfa`, surface `#f2f4f0`, ink `#13201b`, muted `#56645d` (AA on paper),
  line `#e2e6e0`, primary `#2c6a4e` (pine; owner can change), ink on primary `#ffffff`.
  Card tints (per category, cycling): `#e5efe8`, `#eef0e2`, `#e6edf1`, `#f3ece4`, `#eceeea`.
- Palette dark: paper `#0f1714`, surface `#16201c`, ink `#e8eee9`, muted `#a1b0a8`, line `#26322d`,
  primary `#7cc4a0`, ink on primary `#0f1714`; tints `#1a2a22`, `#24271b`, `#1b2529`, `#2a2219`, `#1f2421`.
- Dark mode: `auto` (system, plus the template's colour-mode setting and toggle).
- Fonts: `bricolage-grotesque` (headings, UI and body; variable wght) and `source-serif-4` (italic
  masthead word, quotes, blockquotes, placeholder initials; variable wght, normal + italic). Both
  OFL, self-hosted with `scripts/add-font.sh`.
- Scale: masthead 44px/0.98 -0.035em; card title 21px/1.22 650; post title clamp(2.2rem, 5vw, 3.4rem);
  body 16px (lists) / 17-18px (post body), line-height 1.55-1.7; labels 12px.
- Radius 10px panels, 8px buttons, 999px chips.
- Signature details:
  1. Split masthead: site name in Bricolage bold, last word on its own line in Source Serif italic.
  2. Tinted card panels by category; image-less posts show the category initial in serif italic.
  3. Full-height vertical hairline between the sticky category sidebar and the grid; chips on mobile.
- Layouts owned: shell (header, footer, mobile nav), `home`, `archive` (post + taxonomy share the
  card grid with sidebar), `single` (post), section CSS overrides for the about page; everything
  else falls back to the built-in theme, styled by tokens.
- Settings (`settings_schema`, plus the template's colour mode and spacing):
  `split_masthead` (bool, default true), `card_tints` (bool, default true),
  `show_author` (bool, default true), `cta_label` (text, default "Subscribe"),
  `cta_url` (url, default the RSS feed or empty = hidden), `footer_quote` (text, default the tagline).
- Distribution: listed in the theme directory.
- Out of scope: own sections, newsletter integration, author avatars from images, JS beyond the template's.

