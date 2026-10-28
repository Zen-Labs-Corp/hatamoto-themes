#!/usr/bin/env bash
# check.sh themes/<name> [--screenshot] [--shots DIR] - the full check of one
# theme, the same in CI and on a laptop. Exit code is the verdict.
#   1. files: only what a theme package may hold (outside dev/), no request to
#      another host in templates, CSS or JS, fonts with their licence,
#      CHANGELOG has the theme.json version
#   2. hatamoto theme check --expect-name <name> (and --registry, with the
#      screenshot rule, at the end: --screenshot may have just written it)
#   3. hatamoto theme pack (unsigned) proves it packs
#   4. scripts/dev-site.sh <site-type> themes/<name> --shots DIR: a seeded site
#      on a throwaway database, every page of the seed answers, then the browser
#      checks of scripts/shoot.mjs (desktop and mobile, console, CSP, remote
#      requests, broken images, overflow)
# --screenshot also rewrites assets/screenshot.png from the seeded site.
# Needs: hatamoto (HATAMOTO_BIN), Postgres binaries (PG_BIN), node and Chrome
# (CHROME) with `npm ci` done in scripts/.
set -euo pipefail
die() { echo "check: $*" >&2; exit 1; }
[ $# -ge 1 ] || die "usage: $0 themes/<name> [--screenshot] [--shots DIR]"
dir=${1%/}; shift
shot_flag=() shots=""
while [ $# -gt 0 ]; do
  case $1 in
    --screenshot) shot_flag=(--screenshot); shift ;;
    --shots) shots=${2:?}; shift 2 ;;
    *) die "unknown flag $1" ;;
  esac
done
root=$(git rev-parse --show-toplevel)
cd "$root"
[ -f "$dir/theme.json" ] || die "$dir has no theme.json"
name=$(jq -r .name "$dir/theme.json")
version=$(jq -r .version "$dir/theme.json")
[ "$dir" = "themes/$name" ] || die "theme.json name \"$name\" does not match the folder $dir"
BIN=${HATAMOTO_BIN:-hatamoto}
fail=0
bad() { echo "FAIL $*"; fail=1; }

# 1. files
while IFS= read -r f; do
  rel=${f#"$dir"/}
  case "$rel" in
    theme.json|README.md|LICENSE|LICENSE.*|CHANGELOG.md|.gitignore) ;;
    dev/*) ;;
    layouts/*.html|partials/*.html|sections/*.html|schemas/*.json) ;;
    assets/*) ;;
    *) bad "$rel: not part of a theme package (move it to dev/ or drop it)" ;;
  esac
done < <(git ls-files --cached --others --exclude-standard -- "$dir")
remote=$(grep -rnIE '(src|href|url|@import)[=( ]*["'\'']?(https?:)?//[a-z0-9]' "$dir"/layouts "$dir"/partials "$dir"/sections "$dir"/assets 2>/dev/null \
  | grep -vE 'xmlns|w3\.org/2000/svg|hatamoto\.dev' || true)
[ -z "$remote" ] || { echo "$remote" | head -5; bad "templates or assets load from another host (self-host it)"; }
if [ -d "$dir/assets/fonts" ]; then
  while IFS= read -r d; do
    ls "$d" | grep -qiE '^(LICENSE|OFL)' || bad "${d#"$dir"/}: font without a licence file"
  done < <(find "$dir/assets/fonts" -mindepth 1 -maxdepth 1 -type d)
fi
grep -qF "## $version" "$dir/CHANGELOG.md" 2>/dev/null || bad "CHANGELOG.md has no \"## $version\" entry"
grep -rIl '__[A-Z_]*__' "$dir" --exclude-dir=dev >/dev/null 2>&1 && bad "template placeholder left: $(grep -rIl '__[A-Z_]*__' "$dir" --exclude-dir=dev | head -3)"
[ "$fail" = 0 ] && echo "ok   files"

# 2. + 3. engine rules and packing
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
if "$BIN" theme check "$dir" --expect-name "$name" 2>"$tmp/check.err"; then echo "ok   theme check"; else cat "$tmp/check.err" >&2; bad "hatamoto theme check"; fi
if HATAMOTO_SIGNING_KEY= "$BIN" theme pack "$dir" --expect-name "$name" --out "$tmp/t.hmp" >/dev/null 2>"$tmp/pack.err"; then
  echo "ok   pack ($(du -h "$tmp/t.hmp" | cut -f1))"
else
  cat "$tmp/pack.err" >&2; bad "hatamoto theme pack"
fi
[ "$fail" = 0 ] || die "$name: static checks failed"

# 4. a real site
type=$(cat "$dir/dev/site-type" 2>/dev/null || true)
[ -n "$type" ] || die "$dir/dev/site-type is missing (one of: $(ls site-types | grep -v README | tr '\n' ' '))"
shots=${shots:-build/shots/$name}
scripts/dev-site.sh "$type" "$dir" --shots "$shots" "${shot_flag[@]}" || die "$name: the seeded site failed (shots in $shots)"
"$BIN" theme check "$dir" --registry --expect-name "$name" 2>"$tmp/check.err" || { cat "$tmp/check.err" >&2; die "$name: registry rules (a screenshot in assets/, at most 2 MiB; --screenshot writes one)"; }
echo "ok   theme check --registry"
echo "check: OK $name $version ($type)"
