# Changelog

## 0.4.0

- New setting `newsletter_form`: the slug of a Hatamoto form. When set, an email field with
  a subscribe button is shown. Empty (the default) leaves the pages unchanged.
- New setting `newsletter_position` (`footer`, `above_posts`, `below_posts`): the block sits
  at the top of the footer, or before or after the post list on the home page.
- New settings `newsletter_text`, `newsletter_button` and `newsletter_placeholder`: the
  sentence (empty removes it), the button label and the field hint.

## 0.3.1

- Fix: the admin preview of a draft post no longer fails with "preview failed" on cores
  that render a draft without `.Entity`; the post layout falls back to the page name.

## 0.3.0

- New setting `home_list` (`summaries`, `titles`): `titles` lists the home posts as titles
  only, like the archive.
- New setting `home_title` (`auto`, `tagline`, `hidden`): `tagline` shows the heading only
  when a tagline is set, `hidden` never shows it. A visually hidden `h1` with the site name
  takes its place, unless the page has a hero or its own `h1`, so the page keeps one heading.
- Fix: a whitespace-only tagline counts as empty, so the home no longer prints an empty heading.
- Fix: the LATEST heading no longer gets the extra top margin when the byline is off and the
  home page has no body copy.

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
