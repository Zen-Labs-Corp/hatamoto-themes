# Changelog

## 0.2.0

- Footer credit: "Powered by Hatamoto CMS" after the copyright, linking to hatamoto.dev.
- New settings `show_credit` (hide the credit), `credit_text` (its words) and `credit_url`
  (where it links).
- New setting `show_home_byline` (hide the "by author · rss" line under the tagline on the home page).

## 0.1.0

- First version: a text-first blog theme with home, post, page, archive, category,
  author, search and 404 layouts.
- No stylesheet, script, font or request of its own: the CSS is inline, fonts are the
  system stacks, there is no JavaScript.
- Settings: `color_mode` (light, dark or auto), `density`, `show_theme_line`,
  `posts_on_home`.
- Search marks the match in titles and excerpts with a template-only highlight that
  escapes everything and falls back to plain text for anything it cannot match safely.
- Plain typography for Page Builder sections and the built-in partials.
- The owner's Background and Text colours restyle the whole theme, light and dark.
- Submenu items show in the header and footer menus; the rss and archive links follow
  the site's feed and menu.
- The built-in contact form is styled. Forms with a captcha need JavaScript, which the
  theme does not load, so use a form without a captcha.
