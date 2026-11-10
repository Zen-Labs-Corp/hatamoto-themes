Development files, never packaged.

- `brief.md`: the design brief this theme was built from (site type, vibe,
  references, palette, fonts, must-haves).
- `seed.json` (optional): replaces `site-types/<type>/seed.json` for this theme
  in `scripts/dev-site.sh`. Same format, see `site-types/README.md`.
- `site-type`: one line, the site type the theme is checked against
  (`business`, `blog`, `portfolio`, `docs`, `landing`, `restaurant`).

Notes for checking this theme:

- `seed.json` here (business, sets the site colour to the theme's vermilion)
  replaces the seed of every site type in `scripts/dev-site.sh`. To try another
  type, move it aside for the run (`dev-site.sh portfolio themes/murasaki --shots DIR`)
  and put it back.
- Settings are stored per site, not in the seed. To test them on a dev site, set
  them in **Theme > Themes > Murasaki > Settings**, or insert a row for `murasaki`
  in `hatamoto_theme_settings` and reload.
- Verified on unusual content: no menus, no logo, a post without a featured image,
  a 90-character title, a 55-character site name and no saved settings render
  without errors and without horizontal overflow at 390 px.
