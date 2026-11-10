# Murasaki: design brief

- Site type: business (also checked on portfolio: /work archive and project page)
- One line: Studio theme for agencies and advisory firms. Oversized type, hairline index rows, numbered sections and one vermilion accent.
- Class prefix: `mu`

## Who the site is for

Agencies and studios: design, engineering and advisory firms.

## Vibe

Cool paper, night ink, one vermilion accent. Near-square corners, a grotesque display face, mono labels.

## Palette

| | Light | Dark |
|---|---|---|
| paper | #f3f5f7 | #0a1016 |
| surface | #ffffff | #111a22 |
| snow (band) | #e6ebef | #17222c |
| ink | #0d1821 | #e8edf1 |
| muted | #56636e | #94a3af |
| line | #d3dae0 | #25323d |
| primary | #d9452b (on-primary #ffffff) | #ff6a4d (on-primary #140805) |
| night | #0d1821 (on-night #eef2f5) | #05090d (on-night #e8edf1) |

Primary is owner-changeable through the `--hm-*` tokens (Theme > Colours and fonts); every other colour derives from those tokens.

## Type

- Display: Bricolage Grotesque (variable weight)
- Body: Instrument Sans (variable weight)
- Labels: IBM Plex Mono (400, 500)
- All OFL, self-hosted.
- Scale: h1 `clamp(3rem, 8.2vw, 7.25rem)`, tracking -0.045em, line-height 0.98; h2 `clamp(2.25rem, 4.4vw, 3.5rem)`; mono labels 0.8125rem uppercase.
- Radii: 2px controls, 4px cards and media.

## Dark mode

Yes. `color_mode` defaults to `auto` (follows the system); the header toggle stays.

## Signature details

1. Numbered section eyebrows ("01 / What we do") with a small vermilion square marker.
2. Services and features as a full-width hairline index: label column, big title, description, square arrow button; first row in the accent.
3. Full vermilion CTA band with the button in night ink.
4. Dark footer with a giant low-contrast site-name wordmark ending in a vermilion full stop.
5. Stats as huge numerals with the suffix in the accent; process steps as a four-column ruled row.
6. Lead testimonial in a dark card, the others in white cards.
7. Article: sticky contents column, numbered h2s, accent-ruled blockquote.

## Layouts

Partial theme: shell (base, header with mobile menu, footer), home through section CSS, single, archive, 404 and search styling, section CSS for hero, logo strip, features, stats, process steps, testimonials, FAQ, CTA, content, card columns, pricing, team and contact info. Portfolio: the /work archive as a large index list and a project page with a big title and a meta row.

## Settings

| Key | Default | Effect |
|---|---|---|
| `color_mode` | auto | light, dark or follow the system |
| `density` | comfortable | section spacing |
| `footer_wordmark` | true | giant site name in the footer |
| `section_numbers` | true | "NN /" prefix on section eyebrows |
| `header_cta_label` | empty | header button label; empty means no button |
| `header_cta_url` | /contact | header button address |
| `hero_accent` | true | last sentence of the hero headline in the accent |
