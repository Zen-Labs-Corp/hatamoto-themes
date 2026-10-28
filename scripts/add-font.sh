#!/usr/bin/env bash
# add-font.sh themes/<name> <family-id> [--static WEIGHTS] [--subset latin]
# Self-host an open-licence font in a theme. Fetches the Fontsource package
# (@fontsource-variable/<id>, or @fontsource/<id> with --static 400,700) from
# npm, copies the woff2 files of one subset (default latin) and the licence to
# assets/fonts/<id>/, and prints the @font-face rules to paste into the theme
# CSS. Refuses a font whose licence is not the SIL OFL or Apache-2.0.
#   family-id   the Fontsource id: lower case, dashes (e.g. inter,
#               fraunces, ibm-plex-sans, jetbrains-mono)
set -euo pipefail
die() { echo "add-font: $*" >&2; exit 1; }
[ $# -ge 2 ] || die "usage: $0 themes/<name> <family-id> [--static 400,700] [--subset latin]"
theme=${1%/} id=$2; shift 2
static="" subset=latin
while [ $# -gt 0 ]; do
  case $1 in
    --static) static=${2:?}; shift 2 ;;
    --subset) subset=${2:?}; shift 2 ;;
    *) die "unknown flag $1" ;;
  esac
done
[ -f "$theme/theme.json" ] || die "$theme is not a theme"
[[ $id =~ ^[a-z0-9][a-z0-9-]{1,60}$ ]] || die "bad family id"
[[ $subset =~ ^[a-z0-9-]{2,30}$ ]] || die "bad subset"
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
pkg="@fontsource-variable/$id"; [ -z "$static" ] || pkg="@fontsource/$id"
( cd "$tmp" && npm pack "$pkg" --silent >/dev/null 2>&1 ) || die "no npm package $pkg (check the id on fontsource.org)"
tar xzf "$tmp"/*.tgz -C "$tmp"
lic=$(jq -r '.license // ""' "$tmp/package/package.json")
case "$lic" in OFL-1.1|Apache-2.0) ;; *) die "$pkg is licensed \"$lic\"; only OFL-1.1 and Apache-2.0 are accepted" ;; esac
dst="$theme/assets/fonts/$id"
mkdir -p "$dst"
cp "$tmp/package/LICENSE" "$dst/LICENSE.txt"
family=$(jq -r '.fontName // empty' "$tmp/package/metadata.json" 2>/dev/null || true)
[ -n "$family" ] || family=$(sed -E 's/(^|-)([a-z])/\1\u\2/g; s/-/ /g' <<<"$id")
echo "/* $family, $lic, self-hosted (assets/fonts/$id/LICENSE.txt) */"
n=0
# Variable packages name files <id>-<subset>-<axes>-<style>.woff2: take the
# weight axis only ("wght"), the smallest file; "standard" (more axes) when a
# family has no wght-only cut.
axis=wght
ls "$tmp/package/files/$id-$subset-wght-normal.woff2" >/dev/null 2>&1 || axis=standard
for f in "$tmp"/package/files/"$id"-"$subset"-*.woff2; do
  [ -e "$f" ] || continue
  base=$(basename "$f")
  if [ -z "$static" ]; then
    [[ $base =~ ^$id-$subset-$axis-(normal|italic)\.woff2$ ]] || continue
    style=${BASH_REMATCH[1]} weight="100 900"
  else
    [[ $base =~ ^$id-$subset-([0-9]{3})-(normal|italic)\.woff2$ ]] || continue
    weight=${BASH_REMATCH[1]} style=${BASH_REMATCH[2]}
    [[ ",$static," == *",$weight,"* ]] || continue
  fi
  cp "$f" "$dst/$base"; n=$((n + 1))
  echo "@font-face { font-family: \"$family\"; src: url(\"/theme/assets/fonts/$id/$base\") format(\"woff2\"); font-weight: $weight; font-style: $style; font-display: swap; }"
done
[ "$n" -gt 0 ] || die "no $subset woff2 files matched in $pkg"
echo "/* add-font: $n file(s) in $dst ($(du -sh "$dst" | cut -f1)) */"
