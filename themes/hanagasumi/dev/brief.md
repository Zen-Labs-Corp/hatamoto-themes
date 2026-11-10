## Theme

- name: hanagasumi (花霞, "flower mist")
- type: blog (`site-types/blog`)
- description: Soft pastel blog theme: a split homepage with a sideways-scrolling story rail, rounded cards, pill chips and mono labels in rose on warm mist.
- prefix: hg
- title: Hanagasumi
- palette (light): paper #fefbfa, surface #ffffff, tint #fcf0f3, ink #3d3644, muted #8a8090,
  line #f1e6e9, primary #f5adc3 (fills; text on it #4a1f31), primary-text #b84d74 (accent text,
  links, chips), primary-soft #fde9ef, sage #a9c4b4.
- palette (dark): paper #24202a, surface #2d2833, tint #362f3d, ink #f6eff3, muted #b6abb9,
  line #403847, primary #f5b3c8, primary-text #f5b3c8, primary-ink #3a1726, primary-soft #46303d.
- The owner's primary colour (Theme > Colours) maps to the accent; primary-text/soft derive from
  it (color-mix) so a changed primary restyles the theme. Contrast AA in both modes.
- fonts: Instrument Sans (`instrument-sans`, variable, headings + body), IBM Plex Mono
  (`ibm-plex-mono`, 400 + 500, labels/meta/code). Both OFL, self-hosted via `add-font.sh`.
- type scale: xs .75, sm .875, md 1.0625, lg 1.375, xl clamp(1.75,2.6vw,2.25), 2xl
  clamp(2.5,5vw,4.25) rem; headings 600, tight negative tracking.
- radii: xs 6, sm 10, md 16, lg 24, xl 32, pill 999 px.
- spacing: .25 .5 .75 1 1.5 2 3 4.5 rem; max width 1360px.
- dark: yes, follows the system by default (template `color_mode`, default auto).
- signature details: (1) split stage + sideways story rail with offset cards; (2) pill
  everything: nav, chips, buttons, inputs, pager; (3) mono micro-labels (index numbers, dates,
  counts); (4) gradient-faded 404 numerals and pastel gradient newsletter panel.
- layouts owned: shell (header, nav incl. mobile, footer), home, single, archive (incl.
  taxonomy), 404/search. Everything else falls back to the built-in theme. Partial theme.
- settings (on top of the template's colour mode and spacing):
  - `story_rail` boolean, default true: homepage split stage with the sideways rail; off =
    stage without the rail (intro + plain journal list).
  - `corner_style` enum `soft|round`, default `round` (the approved scale); `soft` = tighter
    radii (4/6/10/14/18).
  - `show_newsletter` boolean, default true: the intro-panel card, the homepage newsletter
    panel and the footer field.
  - `post_toc` boolean, default true: the sticky "On this page" list on single posts.
  Newsletter fields link to the site's subscribe/contact target (no form backend is invented;
  follow whatever the built-in theme/hanshi do for subscribe CTAs).
- distribution: listed in the theme directory.
- ship policy: auto (queue auto-merge on green); publish gate before the first push.
- out of scope: page-load animations, smooth scrolling, JS-driven horizontal scroll hijack,
  members/sign-in UI, any remote host, Mono's bracket styling.

