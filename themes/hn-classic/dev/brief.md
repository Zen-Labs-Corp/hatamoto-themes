# HN Classic: design brief

- Site type: blog
- One line: A link-and-discussion theme: a coloured header bar, ranked story rows, threaded comments with no-JS vote and flag forms, Verdana, no JavaScript.

## Who the site is for

Readers of a link-and-discussion site: a ranked list of stories and a threaded
conversation under each one. Dense, quick to scan, no decoration.

## Vibe

Plain, dense, utilitarian. Not glossy, not card-based. Cool ink-blue, no warm
accent colours. Light and dark, the reader can switch in the footer.

## Palette (light and dark, auto by default)

Light:
- Header bar `#1f3a5f` with white text and a white-bordered "H" box as the logo
- Page `#f4f6f9`, canvas `#ffffff`, text `#171c26`
- Title links `#1f3a5f`, visited links `#5f6b80`, accent text `#2a5aa8`, subtext `#566174`
- Dead comments `#bfbfbf`, vote arrow `#7886a0`, `[op]` tag `#2e7d32`, faint comments `#4f5866`

Dark:
- Header bar `#244470`, page `#141a24`, canvas `#0d1118`, text `#e4e8ef`
- Title links `#c5d5ee`, visited links `#8f9db4`, accent text `#8fb4f0`, subtext `#9ba7ba`
- Dead comments `#4a5263`, vote arrow `#7d8ba3`, `[op]` tag `#7cc47c`, faint comments `#a3adbd`

A footer switch `theme: auto | light | dark` lets the reader force a scheme.

## Type

Verdana, Geneva, "DejaVu Sans", sans-serif; no webfonts. 10pt base, 7.5pt sub line,
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
- `powered_by`: show the footer link (default on)
- `powered_by_label`, `powered_by_href`: its text and address

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
