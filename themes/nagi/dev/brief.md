# Nagi: design brief

## Theme
- Name: `nagi`   Title: `Nagi`   Type: `blog`   CSS prefix: `ng`
- Description: A calm blog theme with light serif headlines, a featured cover, numbered topics, a picture mosaic and a ledger of posts with large dates. Light and dark.
- Idea: nagi is the calm sea after the wind drops. Quiet, editorial, still.
- Reference site gave direction only; no markup, CSS, copy or images were copied.
- Fonts (OFL, self-hosted with `scripts/add-font.sh`): `fraunces` (variable, normal and italic; headings, logo, dates) and `instrument-sans` (variable; body and UI). The cuts are weight-only, so only the weight axis is used.
- Palette light: paper #f5f6f3, ink #18232b, muted #5d6a71, line #dde2df, soft #e9ece8, deep (footer band) #14212a, on-deep #e7ecea, deep-muted #8fa0a6. Accent is the site primary (`--hm-primary`); the blog seed uses #b4532a.
- Palette dark: paper #11181d, ink #e6ebe9, muted #93a1a7, line #25313a, soft #1b252c, deep #0b1115, on-deep #dfe6e4, deep-muted #7d8c92.
- Shape: radius 4px everywhere (through the radius token), square buttons, hairlines.

## Signature details
1. "Still water" mark: three horizontal lines, the middle one barely rippling (inline SVG in the logo, as a full-width divider under the hero, and in the footer band).
2. Split hero: kicker with a short rule, light serif headline whose second half is a muted italic, underline-only email signup, and a tall featured post cover on the right.
3. Numbered topic index rows (01 Travel / excerpt / count and date / arrow).
4. Flat picture mosaic: one large tile and four small, caption on a paper tab, no tilt.
5. Ledger list: large day number and month in a left column, category tag, title, excerpt, reading time.
6. Open sidebar on a left hairline (About, category chips, numbered list), no boxed cards.
7. Deep footer band with a closing sentence (italic half), link columns and still-water lines.

## Layouts owned
Base shell (header with left nav and underlined current item, search, colour toggle, outlined Subscribe, mobile menu that works without JS), `home`, `single` (post), `page` (plain pages such as About), `archive`, `taxonomy`, `author`, `search`, `404`. Built-in sections keep working and pick up the Nagi tokens; no own sections in 1.0.0. Inner pages derive from the home: ledger rows for listings, the hero type scale for titles, prose measure about 68ch, hairline tables, code on the soft surface.

## Settings
Every key has a default; `color_mode` is kept from the template, `density` is dropped (no use in the design).
- `hero_kicker` (empty = "A journal by" the newest post author, else the site name)
- `hero_title` (empty = site tagline) and `hero_title_italic` (the muted italic second half)
- `hero_lede` (empty = organisation description, then tagline)
- `signup_form` (a form slug; the form needs a field named `email`; empty = no signup in hero, footer or header)
- `show_featured`, `show_topics`, `show_mosaic`, `show_most_read` (booleans, default true)
- `footer_line` and `footer_line_italic` (empty = the site tagline; no tagline = no sentence)
- `archive_url` (default `/blog`, target of the "More writing" link)
- `color_mode` (light, dark or auto; default light)

## Home content rules
Automatic. Featured = newest post with an image. Topic index = categories with the most posts (up to 4) with count, newest date and the newest post excerpt. Mosaic = the next 5 posts with images (hidden with fewer than 3). Ledger = latest 6 posts with a "More writing" link. Sidebar "Further reading" = the next 4 posts after the ledger (there is no view count, so it never claims popularity). Sparse content must not break: no posts, no images, no categories, no menu, no tagline, long titles. Blocks with nothing to show are hidden.
