# Hearth: design brief

## Theme

- Name: `hearth`
- Type: `business`
- Prefix: `ht`
- Title: `Hearth`
- Description: `Warm, photo-led theme for home builders and trades: split heroes, full-bleed photo bands, a step-by-step process list and a terracotta footer.`
- Palette light: paper `#f2eee7`, surface `#fbf9f5`, ink `#2f2f2f`, muted `#5c5852` (AA on paper),
  line `#d9d2c7`, primary `#c4492d` (terracotta, AA for text on paper; owner can change), primary
  ink on primary `#ffffff`, footer gradient `#d65a3a -> #b23f2a`.
- Palette dark: paper `#1c1a18`, surface `#262320`, ink `#f0ebe3`, muted `#b3aca2`, line `#3b3632`,
  primary `#e9785a`.
- Dark mode: `auto` (follows the system, with the template's colour-mode setting).
- Fonts: `figtree` (Fontsource, OFL) for headings and body (weights 300, 400, 500, 600).
- Scale: dramatic for display (hero h1 clamp ~2.6rem -> 4rem), tight line-height on headings.
- Signature details:
  1. Round outlined arrow buttons (circle + arrow) next to text links and on feature rows.
  2. Edge-bleed split rows (image to the viewport edge, text in the content column) with an
     optional thin outline house mark drawn over the split on the hero.
  3. Terracotta gradient footer band with grain, a big CTA headline and "Back to top".
- Layouts owned: shell (header with mobile nav, footer), `home`, `page` (section styles), `archive`
  (2-up image grid with a type label), `single` (title, label, stacked gallery-friendly content),
  `404`, `search`. Section CSS overrides: `hero` (split variant), `split`, `features`,
  `process_steps` (hairline rows with icon), `cta` (photo band), `contact_info`, `contact_form`,
  `card_columns`, `testimonials`, `stats`, `faq`, `team`, `pricing`, `logo_strip`. No own sections.
- Settings (`settings_schema`, beyond the template's colour mode and spacing):
  - `header_cta_label` and `header_cta_url` (text and url, default empty; fallback when the site has no header button).
  - `footer_headline` (text, default "Let's talk.").
  - `footer_lead` (text, default "Tell us what you need and we will get back to you.").
  - `footer_grain` (boolean, default true).
  - `hero_house_mark` (boolean, default true).
- Out of scope: sliders, scroll animations, own section types, any client content.

