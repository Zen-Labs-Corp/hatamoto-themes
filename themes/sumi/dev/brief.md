# Sumi: design brief

- Site type: blog

## Theme block

- name `sumi`, type `blog`, prefix `sumi`, title `Sumi`
- description: `A text-first blog theme under 13.37 KB with no requests, JavaScript or trackers of its own. System fonts, monospace dates, hairline rows and one vermilion accent.`
- palette light: paper `#fafaf7`, ink `#1b1b19`, muted `#6b6a64`, line `#e4e2da`, code `#f1efe8`, accent `#b8432f` (= `--hm-primary` default), ok `#5d7a3a`
- palette dark: paper `#141413`, ink `#e6e4dc`, muted `#8e8c84`, line `#2a2926`, code `#1d1c1a`, accent `#e0775f`, ok `#9ab874`
- fonts: system sans stack for body and headings, `ui-monospace` stack for dates, labels, meta, footer, code. No Fontsource fonts.
- signature details: monospace `MM-DD` dates in hairline rows grouped by year; the accent dot after the site name; the footer theme line
- layouts owned: base, home, single post, archive, taxonomy, author, search, 404, page (names per THEMES.md)
- settings: `color_mode` (light, dark, auto; default light; no visitor toggle), `density` (comfortable, compact; default comfortable), `show_theme_line` (boolean, default true: the footer line), `posts_on_home` (integer 3-20, default 6)
- distribution: listed in the theme directory
