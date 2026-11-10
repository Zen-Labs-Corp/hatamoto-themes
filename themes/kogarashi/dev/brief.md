# Kogarashi: design brief


- name: kogarashi ("cold, wintry wind")
- type: blog (dev/site-type)
- description: Split-screen blog theme. A fixed midnight image panel on one side, a scrolling grid of post cards on the other, cobalt accents.
- prefix: kg
- title: Kogarashi
- palette light: accent #2b59c3 (on-accent #ffffff), accent-soft (tag chips) #e8eefb / ink #24468f, ink #121821, muted #5d6878, paper #ffffff, surface #f3f5f9, line #e3e7ee, panel #101b2c, panel tint rgba(10,18,32,.62), panel ink #f4f7fb, panel muted #b7c3d4, frost (panel highlight) #cfe0f5
- palette dark: accent #3f6ad8, accent-soft #17233a / ink #aac2f6, ink #e7ecf3, muted #98a3b3, paper #0c1118, surface #141b25, line #222c39, panel #070c14, panel tint rgba(4,8,15,.7)
- accent is owner-changeable through --hm-* tokens (Theme > Colours and fonts); every theme colour derives from --hm-* tokens where the contract allows
- fonts: hanken-grotesk (all text, variable wght), fraunces (italic, variable wght: wordmark, blockquotes, 404 numeral). OFL, self-hosted via scripts/add-font.sh
- type scale: modular. panel headline clamp(2rem, 1.2rem + 2.6vw, 3rem) weight 700; card title 1.25rem/700; body 1.0625rem/1.6
- radii: 6px controls, 12px cards/media, pill chips
- dark mode: yes; color_mode default `auto` (follows the system); keep the template toggle
- signature details:
  1. the split shell: sticky 50% panel (image + gradient tint) on the left, scrolling content on the right; stacks on top below 900px
  2. post cards: rounded 3:2 image, pill tag chip (+ round accent featured badge), title with a ↗ arrow that nudges on hover, 3-line clamped excerpt, author avatar + date
  3. the panel changes per page: home = tagline + topic links + footer; single post = cover image, kicker (category · reading time), title, byline; archive = term name, description, post count, topics row with the current one underlined; 404 = oversized italic Fraunces "404" in frost
  4. italic Fraunces wordmark with the second word in frost
  5. single post reading column 38rem, accent-ruled italic Fraunces blockquote, code block on the panel colour, previous/next cards
- layouts owned (partial theme): shell (base with the split, header incl. burger/mobile menu, footer inside the panel), home (post grid), single, archive (term/author/search list rows), 404 + search styling; page (About) rendered in the right column with the panel. Own sections: none.
- settings (settings_schema, all with defaults, in addition to color_mode + density from the template):
  - `panel_image` image/media (or URL string if the schema has no image type), default empty = the midnight gradient
  - `panel_side` select left|right, default left
  - `grid_columns` select 2|3, default 2 (wide screens only; 1 column on mobile)
  - `show_excerpts` boolean, default true
- distribution: listed in the theme directory
- ship policy: after the publish gate yes, PR auto-merges on green CI, then release (tag + GitHub release); registry PR and index publish ask the owner
- out of scope: own section types, JS beyond the template's (menu + colour toggle), any change to template/, scripts/, site-types/, other themes; members/sign-in (the header button is "Subscribe" linking to a menu/setting URL or RSS)

