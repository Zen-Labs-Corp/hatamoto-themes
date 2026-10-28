# Contributing

- **Sign off every commit** (`git commit -s`): the Developer Certificate of
  Origin, checked on every pull request by the `dco` workflow.
- **One theme per folder.** `themes/<name>/`; the folder name and
  `theme.json` `"name"` are the same.
- **A new theme** starts from `scripts/new-theme.sh <name> <site-type> "<description>"`.
- **Before a pull request**, run `scripts/check.sh themes/<name>` for every theme
  you touched. CI runs the same script, and a change to `scripts/`,
  `site-types/` or `template/` checks every theme.
- **A version bump** changes `theme.json` `"version"` and adds the matching
  `## <version>` entry to the theme's `CHANGELOG.md`.
- **Self-hosted only.** No request to another host; fonts come with their
  licence (`scripts/add-font.sh`).
- **No inline scripts.** Themes opt in to the strict public script policy.
- **Original work only.** Do not copy markup, CSS, images or copy from other
  sites or themes you have no licence for; references are for direction.

Security reports: see the core repository's
[SECURITY.md](https://github.com/Zen-Labs-Corp/hatamoto/blob/main/SECURITY.md),
not a public issue.
