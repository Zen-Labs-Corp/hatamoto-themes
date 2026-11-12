# hatamoto-themes

Themes for [Hatamoto](https://hatamoto.dev), one folder each. They are packed,
signed and listed in the theme directory at hatamoto.dev from the commit a
manifest in [hatamoto-plugins](https://github.com/Zen-Labs-Corp/hatamoto-plugins)
pins.

| Theme | Folder | Built for | Release | What it is |
|---|---|---|---|---|
| `hanagasumi` | [themes/hanagasumi](themes/hanagasumi) | blog | [v0.1.0](https://github.com/Zen-Labs-Corp/hatamoto-themes/releases/tag/hanagasumi/v0.1.0) | Soft pastel blog theme: a split homepage with a sideways-scrolling story rail, rounded cards, pill chips and mono labels in rose on warm mist. |
| `hanshi` | [themes/hanshi](themes/hanshi) | blog | [v1.0.1](https://github.com/Zen-Labs-Corp/hatamoto-themes/releases/tag/hanshi/v1.0.1) | A blog theme: hairline frames, generated pattern covers, a page ruler for pagination and an index that follows you through every post. |
| `hearth` | [themes/hearth](themes/hearth) | business | [v1.0.0](https://github.com/Zen-Labs-Corp/hatamoto-themes/releases/tag/hearth/v1.0.0) | Warm, photo-led theme for home builders and trades: split heroes, full-bleed photo bands, a step-by-step process list and a terracotta footer. |
| `kaizen` | [themes/kaizen](themes/kaizen) | blog | [v0.1.0](https://github.com/Zen-Labs-Corp/hatamoto-themes/releases/tag/kaizen/v0.1.0) | A dark-first blog theme: a glowing horizon hero, a numbered index with sticky months, smooth page transitions and a live status strip in the footer. |
| `kazahana` | [themes/kazahana](themes/kazahana) | blog | [v1.0.0](https://github.com/Zen-Labs-Corp/hatamoto-themes/releases/tag/kazahana/v1.0.0) | Editorial blog theme with a masthead and topic strip, big EB Garamond headlines, hairline meta rows and a pine intro block, in snow white and camellia red. |
| `kimyou` | [themes/kimyou](themes/kimyou) | blog | [v0.1.0](https://github.com/Zen-Labs-Corp/hatamoto-themes/releases/tag/kimyou/v0.1.0) | Literary blog theme for writers: linen paper, oxblood and book-cloth green, posts as chapters, categories as spines on a shelf. |
| `kogarashi` | [themes/kogarashi](themes/kogarashi) | blog | [v0.1.0](https://github.com/Zen-Labs-Corp/hatamoto-themes/releases/tag/kogarashi/v0.1.0) | Split-screen blog theme. A fixed midnight image panel on one side, a scrolling grid of post cards on the other, cobalt accents. |
| `komorebi` | [themes/komorebi](themes/komorebi) | blog | [v0.1.0](https://github.com/Zen-Labs-Corp/hatamoto-themes/releases/tag/komorebi/v0.1.0) | Quiet, typographic blog theme: a two-tone split hero, a featured card with generated pixel art, hairline post lists and mono labels, in indigo and peach. |
| `murasaki` | [themes/murasaki](themes/murasaki) | business | [v0.1.0](https://github.com/Zen-Labs-Corp/hatamoto-themes/releases/tag/murasaki/v0.1.0) | Studio theme for agencies and advisory firms. Oversized type, hairline index rows, numbered sections and one vermilion accent. |
| `nagi` | [themes/nagi](themes/nagi) | blog | [v1.0.0](https://github.com/Zen-Labs-Corp/hatamoto-themes/releases/tag/nagi/v1.0.0) | A calm blog theme with light serif headlines, a featured cover, numbered topics, a picture mosaic and a ledger of posts with large dates. Light and dark. |
| `shinrin-yoku` | [themes/shinrin-yoku](themes/shinrin-yoku) | blog | [v0.1.0](https://github.com/Zen-Labs-Corp/hatamoto-themes/releases/tag/shinrin-yoku/v0.1.0) | Blog theme in forest green on cream: a split serif masthead, a sticky category sidebar and a two-column card grid on soft tinted panels, lime accents after dark. |
| `tsundoku` | [themes/tsundoku](themes/tsundoku) | blog | [v0.1.0](https://github.com/Zen-Labs-Corp/hatamoto-themes/releases/tag/tsundoku/v0.1.0) | Warm, playful blog theme: clay paper, plum ink and chartreuse, a rounded bento home and recent posts stacked as coloured book spines. |
| `ukiyou` | [themes/ukiyou](themes/ukiyou) | blog | [v0.1.0](https://github.com/Zen-Labs-Corp/hatamoto-themes/releases/tag/ukiyou/v0.1.0) | A dense magazine blog theme in indigo and saffron: centred masthead, lead story, three-column grid with a numbered sidebar, bold sans headlines over serif text. |
| `wa` | [themes/wa](themes/wa) | blog | [v0.1.0](https://github.com/Zen-Labs-Corp/hatamoto-themes/releases/tag/wa/v0.1.0) | Bold magazine blog theme: a mosaic hero of notched image cards, numbered picks, topic chips and a night band, in cobalt and lime on cool paper. |
| `yukigeshiki` | [themes/yukigeshiki](themes/yukigeshiki) | blog | [v0.1.0](https://github.com/Zen-Labs-Corp/hatamoto-themes/releases/tag/yukigeshiki/v0.1.0) | Editorial blog theme: a sticky masthead and category sidebar, a two-column card grid on tinted panels, Bricolage Grotesque with Source Serif italics, in pine green. |

A theme is templates, CSS, a few optional scripts and its assets: no build step.
The theme contract is
[THEMES.md](https://github.com/Zen-Labs-Corp/hatamoto/blob/main/docs/THEMES.md)
in the core repository. A theme may be partial: every layout, partial and
section it does not ship comes from the built-in theme.

## Layout

```
themes/<name>/              one theme; <name> = theme.json "name"
  dev/                      never packaged: the brief, the site type, an optional seed
template/                   what scripts/new-theme.sh copies (a skin over the built-in theme)
site-types/<type>/seed.json sample content per kind of site: business, blog, portfolio,
                            docs, landing, restaurant (format: site-types/README.md)
scripts/new-theme.sh        create themes/<name> from the template
scripts/dev-site.sh         a throwaway local site with sample content and the theme, live reload
scripts/check.sh            the full check of one theme, as CI runs it
scripts/add-font.sh         self-host an open-licence font in a theme
scripts/changed-themes.sh   which themes a change touches (CI)
scripts/hatamoto-bin.sh     build the hatamoto binary of the core commit in .hatamoto-core
```

## Develop

Needs a `hatamoto` binary (`export HATAMOTO_BIN=$(scripts/hatamoto-bin.sh)` builds
one with Go), the Postgres server binaries (`initdb`, `pg_ctl`), Python 3, Node 22
and Chrome, plus `npm ci` in `scripts/` once.

```sh
scripts/new-theme.sh harbour business "Calm, editorial theme for advisory firms."
scripts/dev-site.sh business themes/harbour --serve       # http://127.0.0.1:<port>, edits reload
scripts/check.sh themes/harbour --screenshot              # rules, render, browser checks, screenshot
```

`dev-site.sh` starts Postgres and Hatamoto in a temporary directory on
127.0.0.1, seeds the sample site (owner, pages built from sections, posts,
categories, menus, generated images), pushes the theme with
`hatamoto theme dev` and deletes everything when it stops. Nothing leaves the
machine.

## Rules

- Everything is served by the site itself: no fonts, scripts, styles or images
  from another host. `scripts/add-font.sh` self-hosts OFL fonts with their licence.
- `csp.strictScripts`: no inline scripts, `on*=` attributes or `javascript:` URLs.
- Colours, type and radii go through the `--hm-*` tokens, so **Theme > Colours
  and fonts** restyles any theme.
- Works without JavaScript, at 390 px wide, in light and dark.

## Releases

A release of one theme is the tag `<name>/v<version>` on the commit that sets that
version in `themes/<name>/theme.json` (with its `CHANGELOG.md` entry). The registry
lists it once `manifests/themes/<name>.json` in hatamoto-plugins pins that commit
with `"subdir": "themes/<name>"`.

## History

`hanshi` was imported with its full history from its former repository
(`hatamoto-theme-hanshi`, now archived).

## License

Apache-2.0, see [LICENSE](LICENSE); each theme carries its own LICENSE, and
bundled fonts their licence next to the files. Contributions: see
[CONTRIBUTING.md](CONTRIBUTING.md).
