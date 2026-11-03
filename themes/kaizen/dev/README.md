Development files, never packaged.

- `brief.md`: the design brief this theme was built from (site type, vibe,
  references, palette, fonts, must-haves).
- `seed.json` (optional): replaces `site-types/<type>/seed.json` for this theme
  in `scripts/dev-site.sh`. Same format, see `site-types/README.md`.
- `site-type`: one line, the site type the theme is checked against
  (`business`, `blog`, `portfolio`, `docs`, `landing`, `restaurant`).

## Audit notes (colour modes, no-JS, motion, contrast)

- Light palette is `:root[data-theme="light"]`; compared with the light mockup on home,
  an inner page and a post. The mode switch cross-fades (no scale or blur).
- Without JS: nothing is hidden (`.kz-reveal` only exists under `html.js`), the mode
  buttons stay `hidden`, the dark palette shows. The owner's light default needs JS.
- `prefers-reduced-motion: reduce`: animations, transitions and view transitions off;
  smooth scrolling off; reveal never applied.
- Contrast (WCAG ratio, text on paper, paper-2, surface, surface-2): dark ink 14.5+,
  ink-2 7.7+, muted 5.3+; light ink 15.9+, ink-2 8.7+, muted 5.0+. The accent
  (primary mixed 74% with ink) is 5.5+ in dark and 5.4+ in light for the default
  primary and the sample one. The header button darkens the primary so white text
  reaches 4.5:1. The search underline uses the muted colour (UI boundary).
- Other site type: `scripts/dev-site.sh business themes/kaizen` renders and passes
  the browser checks. Long site names get a smaller footer wordmark.
