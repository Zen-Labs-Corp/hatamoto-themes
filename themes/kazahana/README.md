# Kazahana

Editorial blog theme with a masthead and topic strip, big EB Garamond headlines, hairline meta rows and a pine intro block, in snow white and camellia red.

![Kazahana](assets/screenshot.png)

A theme for [Hatamoto](https://hatamoto.dev), built for blog sites.

## Install

From the registry: **Theme > Themes > Available themes**, then **Install**, **Preview**
and **Activate**. From a terminal on the server:

```sh
hatamoto package install kazahana-<version>.hmp
hatamoto theme activate kazahana
```

Layouts and sections the theme does not ship come from the built-in theme, so every
page keeps rendering.

## What it ships

- Home, single post, plain page, archive, topic and tag, author, search and 404 layouts.
- A centred italic masthead with a red dot, a hairline row with your menu and topics, and a dateline (date of the latest note and your tagline). On small screens the menu is a pine panel that works without JavaScript.
- A pine intro block with your tagline, topic chips and the three latest notes, then the newest note, a grid of recent notes, a quote band with a subscribe link, and the archive as a two-column list.
- Single posts with a wide image, a sticky "On this page" list built from the h2 headings (shown when there are two or more), a red drop cap, an author row and an older/newer pair.
- Lists with dated rows, thumbnails, topic filters and a Newer/Older pager.
- Light and dark. No JavaScript is needed for anything except the colour toggle.

## Settings

**Theme > Themes > Kazahana > Settings**. Every setting has a default.

| Setting | Type | Default | What it does |
| --- | --- | --- | --- |
| Intro block (`show_intro`) | on/off | on | The pine block with the tagline, topics and latest notes on the home page. Off keeps a hidden site-name heading. |
| Drop cap (`drop_cap`) | on/off | on | A large red first letter on posts. |
| Topics in the header (`header_topics`) | on/off | on | Your categories in the header row, and as a strip on small screens. |
| Dateline (`header_dateline`) | on/off | on | The date of the latest note and the site tagline, left of the site name on wide screens. |
| Colour mode (`color_mode`) | `light`, `dark`, `auto` | `auto` | What a first visit shows; `auto` follows the system. Visitors can still switch with the header toggle. |
| Spacing (`density`) | `comfortable`, `compact` | `comfortable` | `compact` tightens the space between sections. |

Colours, fonts and corners follow **Theme > Colours and fonts**.

## Subscribe

The red header button, the home quote band and the footer all lead to the same place: the
site's own header button (Site settings) when it is set, otherwise the feed at `/feed.xml`.
The theme prints no sign-up form.

## Develop

From the root of the `hatamoto-themes` repository:

```sh
scripts/dev-site.sh blog themes/kazahana --serve   # a seeded local site with this theme, live reload
scripts/check.sh themes/kazahana --screenshot               # the full check, and rewrites the registry screenshot
```

`dev/` is not part of the package.

## License

Apache-2.0, see [LICENSE](LICENSE).
