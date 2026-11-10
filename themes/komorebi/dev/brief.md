# Komorebi: design brief

- Site type: blog
- One line: Quiet, typographic blog theme: a two-tone split hero, a featured card with generated pixel art, hairline post lists and mono labels, in indigo and peach.

Fill in (theme-writer does this from the intake):

## Who the site is for

## Vibe (three words, and what it is NOT)

## References (URLs, and what to take from each)

## Palette (light and dark, contrast checked)

## Type (heading, body, mono; self-hosted, OFL)

## Signature details (two or three things that make it recognisable)

## Must-haves and out of scope

## Theme

- Name: `komorebi`
- Type: `blog`
- Prefix: `kb`
- Title: `Komorebi`
- Description: `Quiet, typographic blog theme: a two-tone split hero, a featured card with generated pixel art, hairline post lists and mono labels, in indigo and peach.`
- Palette light: paper `#f2f3f5`, surface `#fbfbfc`, ink `#15171c`, muted `#5b5f6b` (AA on paper),
  line `#d8dbe2`, primary `#3b3fb6` (indigo dusk; owner can change), accent `#ffc9a8` (peach),
  ink on primary `#ffffff`.
- Palette dark: paper `#101218`, surface `#171a22`, ink `#eceef3`, muted `#a3a8b6`, line `#2a2e3a`,
  primary `#8f93ff`, accent `#ffc9a8`.
- Dark mode: `auto` (follows the system, plus the template's colour-mode setting and toggle).
- Fonts: `inter-tight` (headings and body; 400, 500, 600) and `ibm-plex-mono` (labels, kickers,
  dates; 400, 500). Both OFL, self-hosted with `scripts/add-font.sh`.
- Scale: dramatic display (hero h1 clamp ~3rem -> 7.5rem, letter-spacing ~-0.045em, line-height
  ~0.95), modest body (17px), mono labels 11-12px uppercase letter-spaced.
- Signature details:
  1. Two-tone display headlines: second line in primary, indented, with a thin asterisk.
  2. Generated pixel/arc/stripe/dot art (inline SVG or CSS, primary + accent) for posts and topic
     cards with no featured image; the pattern is picked deterministically per post.
  3. Hairline everything: section headers with an underlined ↗ link, post rows, bordered card
     grids, mono uppercase kickers and dates.
- Layouts owned: shell (header with no-JS `<details>` mobile menu, colour toggle, footer with big
  CTA line and back-to-top), `home` (split hero, featured card + recent list, topics grid, about
  band), `single` post, `page`, `archive` (post list in the hairline style, featured first),
  `taxonomy` (category), `author`, `search`, `404`.
- Settings (`settings_schema`, beyond the template's colour mode and spacing):
  - `hero_line_1` (text, default "Small things,") and `hero_line_2` (text, default
    "worth noticing."): empty values fall back to the site name split in two.
  - `header_cta_label` (text, default "Write to us") and `header_cta_url` (url, default "/about");
    the same pair drives the footer's big CTA line.
  - `show_topics` (boolean, default true): the 3-up category cards on the home page.
  - `generated_art` (boolean, default true): pattern art for posts without a featured image;
    off = text-only cards.
- Distribution: listed in the theme directory.
- Out of scope: own section types, JS beyond the template's toggle, comments, newsletter forms,
  any content from the reference.

