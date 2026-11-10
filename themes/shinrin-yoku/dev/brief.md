# Shinrin-yoku: design brief


- Name: `shinrin-yoku` ("forest bathing")
- Type: `blog`
- Prefix: `sy`
- Title: `Shinrin-yoku`
- Description: `Blog theme in forest green on cream: a split serif masthead, a sticky category sidebar and a two-column card grid on soft tinted panels, lime accents after dark.`
- Palette (direction: cream paper, green-black ink, deep
  forest primary, lime in dark mode; own values, nothing copied).
- Palette light: paper `#fbfbf6`, surface `#f0f2ed`, ink `#1a2119`, muted `#5b6358` (AA on paper),
  line `#dcddd5`, primary `#0e4640` (forest; owner can change), ink on primary `#fbfbf6`.
  Card tints (per category, cycling): `#e6ebe2`, `#ecebdf`, `#e2e9e7`, `#efe9df`, `#e9eae4`.
- Palette dark: paper `#131a15`, surface `#1b231d`, ink `#edefe7`, muted `#a4ab9f`, line `#2b342d`,
  primary `#c9ec72` (lime), ink on primary `#131a15`; tints = the light tint mixed 10% into surface
  (`color-mix(in srgb, <tint> 10%, var(--surface))`).
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

