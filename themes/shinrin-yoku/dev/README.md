Development files, never packaged.

- `brief.md`: the design brief this theme was built from (site type, vibe,
  references, palette, fonts, must-haves).
- `seed.json` (optional): replaces `site-types/<type>/seed.json` for this theme
  in `scripts/dev-site.sh`. Same format, see `site-types/README.md`.
- `site-type`: one line, the site type the theme is checked against
  (`business`, `blog`, `portfolio`, `docs`, `landing`, `restaurant`).

Note on `seed.json`: it is the blog seed with the theme's own primary colour and one
empty content type (`aside`). The content type makes `dev-site.sh` restart the server
after seeding, which is what lets the site tagline show up on the first render.
