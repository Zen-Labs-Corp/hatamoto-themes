# Kazahana: design brief

## Theme


- Name: `kazahana` ("a flurry of snow in a clear sky")
- Type: `blog`
- Prefix: `kz`
- Title: `Kazahana`
- Description: `Editorial blog theme with a masthead and topic strip, big EB Garamond headlines, hairline meta rows and a pine intro block, in snow white and camellia red.`
- Palette light: paper `#f4f5f2`, surface `#ffffff`, ink `#1a2123`, muted `#5c6769` (AA on paper),
  line `#d3d9d7`, primary `#b5382a` (camellia red; owner can change), ink on primary `#ffffff`,
  pine `#1e3833` with ink `#eef3f1` (intro block, mobile menu, footer), frost `#e3ebe8`, code `#eceeeb`.
- Palette dark: paper `#0f1314`, surface `#161b1c`, ink `#e6ebe9`, muted `#97a3a2`, line `#2a3334`,
  primary `#ec7a64`, ink on primary `#1a0d0a`, pine `#1b2f2b` / `#e6efec`, frost `#1c2526`, code `#1b2122`.
- Dark mode: `auto` (system), plus the template's colour-mode setting and toggle.
- Fonts: `eb-garamond` (headings, site name, quotes, drop cap; variable wght, normal + italic) and
  `schibsted-grotesk` (body and UI; variable wght). Mono: system `ui-monospace` stack (no font file).
  Both OFL, self-hosted with `scripts/add-font.sh`.
- Scale: hero/post title clamp(2.6rem, 6vw, 4.6rem)/1.02, archive title 3.2rem, section heads 1.6rem,
  card titles 1.6rem, body 1.0625rem (post body 1.1rem/1.72), labels 0.72rem mono uppercase.
- Radius 6px buttons/inputs, 14px images/panels, 22px blocks; chips 99px.
- Signature details:
  1. Centred italic serif masthead with the red dot, over a hairline menu + topic strip (the
     redesigned menu; mobile = topic strip + pine numbered-link panel).
  2. Hairline meta rows under lead titles and a red serif drop cap in posts.
  3. Pine colour blocks (home intro, mobile menu, footer) against snow paper and frost quote bands.
- Layouts owned: shell (header incl. mobile menu, footer), `home`, `single` (post, with toc),
  `archive` (post archive + taxonomy share the row list), search and 404 styling; author/other
  pages fall back to the built-in theme, styled by tokens.
- Settings (`settings_schema`, plus the template's colour mode and spacing), all bool default true:
  `show_intro` (home intro block), `drop_cap` (drop cap on posts), `header_topics` (topics row in
  the header), `header_dateline` (date and tagline left of the site name).
- Distribution: listed in the theme directory.
- Out of scope: own sections, a real newsletter backend (the Subscribe button/form link to the
  site's existing subscribe/RSS target or are hidden when none), series/paths, JS beyond the
  template's, author images.

