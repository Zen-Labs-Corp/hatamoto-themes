# Wa: design brief

- Site type: blog
- One line: Bold magazine blog theme: a mosaic hero of notched image cards, numbered picks, topic chips and a night band, in cobalt and lime on cool paper.

Fill in (theme-writer does this from the intake):

## Who the site is for

## Vibe (three words, and what it is NOT)

## References (URLs, and what to take from each)

## Palette (light and dark, contrast checked)

## Type (heading, body, mono; self-hosted, OFL)

## Signature details (two or three things that make it recognisable)

## Must-haves and out of scope

## Theme (from the brief)

- Name: `wa`
- Type: `blog`
- Prefix: `wa`
- Title: `Wa`
- Description: `Bold magazine blog theme: a mosaic hero of notched image cards, numbered picks, topic chips and a night band, in cobalt and lime on cool paper.`
- Palette light: paper `#f7f8fb`, band `#e9eef7`, surface `#ffffff`, ink `#0e1526`, muted
  `#5a6479`, line `#d9e0ec`, chip `#e6ecf8`, primary `#2b54e8` (cobalt; owner can change), ink on
  primary `#ffffff`, signal `#c8f04a` (lime) with ink `#1a2300`, night band `#0b1122` / `#141c33`,
  night ink `#e7ecf7`, night muted `#97a2bb`.
- Palette dark: paper `#0a0f1c`, band `#111933`, surface `#121a2e`, ink `#e8edf8`, muted
  `#9aa5bd`, line `#24304c`, chip `#1b2541`, primary `#7d9bff`, ink on primary `#0a0f1c`, night
  `#060a15` / `#111a31`, signal unchanged.
- Dark mode: `auto` (follows the system, plus the template's colour-mode setting and toggle).
- Fonts: `instrument-sans` (headings and body, variable wght 400-700) and `fraunces` italic
  (accent words, drop cap, blockquotes). Both OFL, self-hosted with `scripts/add-font.sh`.
- Scale: step -1 .8125rem, 0 1rem, 1 1.25rem, 2 1.625rem, 3 2.25rem, 4 3.25rem, 5 4.5rem;
  headings 700, letter-spacing -.025em to -.045em; body 1rem/1.55, post prose 19px/1.7.
- Radii: card 22px, pill 999px, small 10px. Gap 20px, wrap 1240px, pad clamp(16px,4vw,40px).
- Signature details:
  1. Notched cards: rounded image card whose bottom-right corner is cut out (inverse radius in
     the background colour) holding a round arrow button; category + date pills on top, a mono
     serial number (001...) above the title.
  2. One italic Fraunces accent word in section headings (primary colour on paper, signal lime on
     the night band).
  3. Posts without a featured image get a dark "typographic" card: night gradient with the title's
     first letter in huge italic serif at low opacity.
  4. Lime signal chips ("Latest", "Editor's pick", "New") and big outlined list numbers.
  5. Oversized site name at the bottom of the footer.
- Layouts owned: shell (header with pill nav, search and colour toggle icons, Subscribe button,
  no-JS `<details>` mobile menu; footer with three columns and the oversized name), `home`
  (mosaic hero + announcement pill, "Picked by" featured card + numbered list, topic ticker,
  topic chips, night band with archive grid and newsletter block, 4-up "Don't miss" grid),
  `single` post (centred header on the band, cover overlapping, sticky contents and share rails,
  drop cap, author box, prev/next, "More from <category>" 3-up), `page`, `archive` (also used by
  category/taxonomy with the chip row as the current filter), `author`, `search`, `404`.
- Settings (`settings_schema`, beyond the template's colour mode and spacing):
  - Section toggles (boolean, default true each): `show_ticker`, `show_topics`,
    `show_archive_band`, `show_newsletter`.
  - Section headings (text pairs, plain text + italic word): picks (default "Picked by" +
    owner/author first name fallback "us"), archive band ("Worth a" / "second" / "read"),
    reading queue ("Don't" / "miss" / "these"); the planner fixes key names and the exact split.
  - Announcement strip: `announce_text` (default "Two new walks every month, plus the notebook
    pages we did not publish." is seed-specific, so the real default is a neutral line or empty;
    empty hides the pill), `announce_label`, `announce_url`.
  - Newsletter band: heading, text, button label and `newsletter_url` (default "/about"); a
    button link only, no form.
  - `signal_colour` (colour, default `#c8f04a`): chips and badges; the theme keeps its ink AA.
- Distribution: listed in the theme directory.
- Out of scope: own section types, membership/sign-in, newsletter forms, comments, a JS
  carousel or animated ticker beyond CSS (motion respects reduced motion), any content from the
  reference.

