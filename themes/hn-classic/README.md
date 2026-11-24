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
| Colour mode | `light` | what a first visit shows: `light`, `dark` or `auto` (follows the system); visitors can still switch |
| Spacing | `comfortable` | `compact` tightens the space between sections |

Colours, fonts and corners follow **Theme > Colours and fonts**.

## Develop

From the root of the `hatamoto-themes` repository:

```sh
scripts/dev-site.sh blog themes/hn-classic --serve   # a seeded local site with this theme, live reload
scripts/check.sh themes/hn-classic                            # the full check: package, render, browser, screenshot
```

`dev/` is not part of the package.

## License

Apache-2.0, see [LICENSE](LICENSE).
