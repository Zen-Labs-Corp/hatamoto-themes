# Murasaki

Studio theme for agencies and advisory firms. Oversized type, hairline index rows, numbered sections and one vermilion accent.

![Murasaki](assets/screenshot.png)

A theme for [Hatamoto](https://hatamoto.dev), built for business sites.

## Install

From the registry: **Theme > Themes > Available themes**, then **Install**, **Preview**
and **Activate**. From a terminal on the server:

```sh
hatamoto package install murasaki-<version>.hmp
hatamoto theme activate murasaki
```

Layouts and sections the theme does not ship come from the built-in theme, so every
page keeps rendering.

## Settings

**Theme > Themes > Murasaki > Settings**:

| Setting | Default | What it does |
| --- | --- | --- |
| Colour mode | `light` | what a first visit shows: `light`, `dark` or `auto` (follows the system); visitors can still switch |
| Spacing | `comfortable` | `compact` tightens the space between sections |

Colours, fonts and corners follow **Theme > Colours and fonts**.

## Develop

From the root of the `hatamoto-themes` repository:

```sh
scripts/dev-site.sh business themes/murasaki --serve   # a seeded local site with this theme, live reload
scripts/check.sh themes/murasaki                            # the full check: package, render, browser, screenshot
```

`dev/` is not part of the package.

## License

Apache-2.0, see [LICENSE](LICENSE).
