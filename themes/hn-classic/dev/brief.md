# HN Classic: design brief

- Site type: blog
- One line: A link-and-discussion theme: a coloured header bar, ranked story rows, threaded comments with no-JS vote and flag forms, Verdana, no JavaScript.

## Who the site is for

Readers of a link-and-discussion site: a ranked list of stories and a threaded
conversation under each one. Dense, quick to scan, no decoration.

## Vibe

Plain, dense, utilitarian. Not glossy, not card-based, not dark.

## Palette (single light scheme, no dark mode)

- Header bar `#c23b22` with white text and a white-bordered "H" box as the logo
- Page `#f6f6ef`, text `#000000`
- Muted text and visited links `#828282`
- Dead comments `#bfbfbf`, vote arrow `#9a9a9a`, `[op]` tag `#3c963c`, faint comments `#5a5a5a`

## Type

Verdana, Geneva, "DejaVu Sans", sans-serif; no webfonts. 10pt base, 7pt sub line,
9pt comment text, "Courier New" for form fields and code.

## Geometry

- Centred column 85% wide, 100% at 750 px and below
- Story row grid 28px / 14px / 1fr
- Comment indent 40 px per depth, 14 px on mobile
- 2 px accent rule above the footer
- Comment textarea 500 px wide

## Surfaces

Front list, item page, comment rows, comment form, 404 ("Unknown."), mobile
`<details>` menu.

## Settings

- `width`: `wide` (default) or `full`
- `plugin_actions`: print the no-JavaScript vote and flag forms on comments

## Signature details

The white-bordered "H" box, pipe-separated lower-case navigation, small grey
sub lines, hairline-free layout.

## Class vocabulary for plugin-printed markup

Rows: `hn-story hn-rank hn-vote hn-title hn-site hn-sub hn-more`.
Comments: `hn-c hn-head hn-text hn-reply hn-op`. Header slot: `hn-userbar`.
Forms and tables: `hn-form-tbl hn-user-tbl hn-note hn-login`.
States: `hn-voted hn-dead hn-faint hn-collapsed`.

## Out of scope

Dark mode, webfonts, JavaScript, any plugin-owned markup.
