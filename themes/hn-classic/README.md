# HN Classic

A link-and-discussion theme: a coloured header bar, ranked story rows, threaded comments with no-JS vote and flag forms, Verdana, no JavaScript.

![HN Classic](assets/screenshot.png)

A theme for Hatamoto, built for link-and-discussion sites.

## Install

From the registry: **Theme > Themes > Available themes**, then **Install**, **Preview**
and **Activate**. From a terminal on the server:

```sh
hatamoto package install hn-classic-<version>.hmp
hatamoto theme activate hn-classic
```

Layouts and sections the theme does not ship come from the built-in theme, so every
page keeps rendering.

## Settings

**Theme > Themes > HN Classic > Settings**:

| Setting | Default | What it does |
| --- | --- | --- |
| Page width | `wide` | `wide` is the centred 85% column, `full` uses the whole window (always full width under 750 px) |
| Comment vote and flag buttons | on | prints the no-JavaScript vote and flag forms on comments, posting to `/p/hn/...`; turn off on a site without the hn plugin |

Colours, fonts and corners follow **Theme > Colours and fonts** (the header bar uses the
primary colour).

## Story pages

`layouts/single-hn-story.html` and `layouts/archive-hn-story.html` render the `hn-story` schema
(`url_pattern` `/item/{slug}`) with the attributes `url` (the story link), `text` (plain text,
shown under the title; the entity body is the fallback) and `kind` (`story`, `ask`, `show`,
`job`; a `job` row has no author). Other schemas use the built-in layouts.

## Markup the hn plugin prints

The theme styles, but does not print, the markup of the hn plugin. The class vocabulary:

- Story list: `ol.hn-stories > li.hn-story` with `.hn-rank`, `.hn-vote` (add `.hn-voted` once voted),
  `.hn-title` (with `.hn-site` for the host) and `.hn-sub`; `.hn-more` is the "More" link.
- Comments: `li.hn-c` with `.hn-c-row`, `.hn-vote`, `.hn-head`, `.hn-op`, `.hn-text` and `.hn-reply`;
  states `.hn-dead`, `.hn-faint` and `.hn-collapsed` go on the `li.hn-c`.
- Header: `.hn-userbar` is an empty slot in the bar for the user name, karma and logout.
- Forms and tables: `.hn-form-tbl`, `.hn-lbl`, `.hn-note`, `.hn-user-tbl`, `.hn-login`.
- Arrow sprite, available on every page: `<svg><use href="#hn-up"/></svg>` and `#hn-down`.

The comment rows the theme prints itself carry two forms for the plugin:

- `POST /p/hn/vote/comment/<id>` with hidden `how=up` and `next`
- `POST /p/hn/flag/comment/<id>` with hidden `next`

`<id>` is the comment id, the same as the row's `id="comment-<id>"`. Neither form is printed for
the visitor's own comment.

## Known gaps

- The grey sub line (`#828282` on `#f6f6ef`) is about 3.4:1, below WCAG AA for small text. It is
  kept from the approved design; links underline on hover and focus and nothing relies on colour
  alone. A later version may darken it.
- Dead, faint and collapsed comments, a vouch form and a sign-in page are styled but need fields
  core does not expose yet (comment status, a sign-in layout, a locked name field). Follow-ups.
- Story rank restarts at 1 on archive pages after the first.
- No dark mode, by design.

## Develop

From the root of the `hatamoto-themes` repository:

```sh
scripts/dev-site.sh blog themes/hn-classic --serve   # a seeded local site with this theme, live reload
scripts/check.sh themes/hn-classic                   # the full check: package, render, browser, screenshot
```

`dev/` is not part of the package.

## License

Apache-2.0, see [LICENSE](LICENSE).
