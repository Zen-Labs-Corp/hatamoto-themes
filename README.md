# hatamoto-themes

Themes for [Hatamoto](https://hatamoto.dev), one folder each. They are packed,
signed and listed in the theme directory at hatamoto.dev from the commit a
manifest in [hatamoto-plugins](https://github.com/Zen-Labs-Corp/hatamoto-plugins)
pins.

| Theme | Folder | Built for | What it is |
|---|---|---|---|
| `hanshi` | [themes/hanshi](themes/hanshi) | blog | Hairline frames, generated pattern covers, a page ruler and a post index |

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
