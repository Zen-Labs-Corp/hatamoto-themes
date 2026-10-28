#!/usr/bin/env bash
# new-theme.sh <name> <site-type> "<one-line description>" [--prefix P] [--title "Title"]
# Create themes/<name> from template/: substitutes the placeholders, records
# the site type in dev/site-type and starts dev/brief.md, then runs the
# package check (without --registry: there is no screenshot yet; check.sh
# takes it).
#   name       the registry name: ^[a-z][a-z0-9-]{1,39}$, not reserved, not
#              taken here or in the registry (plugins and themes share names)
#   site-type  one of site-types/*/ (business, blog, portfolio, docs, landing,
#              restaurant)
#   --prefix   the CSS class prefix of the theme's own markup (default: the
#              name); ^[a-z][a-z0-9]{1,11}$
set -euo pipefail
export LC_ALL=C.UTF-8
die() { echo "new-theme: $*" >&2; exit 1; }
[ $# -ge 3 ] || die "usage: $0 <name> <site-type> \"<description>\" [--prefix P] [--title T]"
name=$1 type=$2 desc=$3; shift 3
prefix=$name title=""
while [ $# -gt 0 ]; do
  case $1 in
    --prefix) prefix=${2:?}; shift 2 ;;
    --title) title=${2:?}; shift 2 ;;
    *) die "unknown flag $1" ;;
  esac
done
[[ $name =~ ^[a-z][a-z0-9-]{1,39}$ ]] || die "name must match ^[a-z][a-z0-9-]{1,39}$"
case "$name" in default|hello|webhooks|gtm|searchconsole|template) die "name \"$name\" is reserved" ;; esac
[[ $prefix =~ ^[a-z][a-z0-9-]{1,39}$ ]] || die "prefix must match ^[a-z][a-z0-9-]{1,39}$"
[[ $prefix != hm && $prefix != hm-* ]] || die "the hm prefix belongs to the engine"
[ -n "$desc" ] && [ ${#desc} -le 200 ] || die "description must be 1-200 characters"
[[ $desc != *$'\n'* && $desc != *'"'* && $desc != *'\'* && $desc != *'|'* && $desc != *'&'* ]] \
  || die "description must be one line without \" \\ | &"
[ -n "$title" ] || title=$(sed -E 's/(^|-)([a-z])/\1\u\2/g; s/-/ /g' <<<"$name")
[[ $title != *'|'* && $title != *'&'* && $title != *'\'* && $title != *'"'* && ${#title} -le 60 ]] || die "bad title"
root=$(git rev-parse --show-toplevel)
cd "$root"
[ -f "site-types/$type/seed.json" ] || die "unknown site type \"$type\" (have: $(ls site-types | grep -v README | tr '\n' ' '))"
dst=themes/$name
[ ! -e "$dst" ] || die "$dst already exists"
if [ -z "${NEW_THEME_OFFLINE:-}" ]; then
  # The registry is the other place a name can be taken.
  idx=$(curl -fsS --max-time 15 https://hatamoto.dev/registry.json 2>/dev/null || true)
  if [ -n "$idx" ] && jq -e --arg n "$name" '[.. | objects | select(has("name")) | .name] | index($n)' <<<"$idx" >/dev/null 2>&1; then
    die "\"$name\" is already a plugin or theme in the registry"
  fi
fi
mkdir -p "$dst"
cp -r template/. "$dst/"
# file names first (assets/css/__NAME__.css, assets/js/__NAME__-head.js)
while IFS= read -r -d '' f; do mv "$f" "${f//__NAME__/$name}"; done < <(find "$dst" -depth -name '*__NAME__*' -print0)
find "$dst" -type f -print0 | xargs -0 sed -i \
  -e "s|__NAME__|$name|g" -e "s|__TITLE__|$title|g" -e "s|__DESCRIPTION__|$desc|g" \
  -e "s|__P__|$prefix|g" -e "s|__SITE_TYPE__|$type|g"
! grep -rq '__[A-Z_]*__' "$dst" || die "placeholder left in $dst: $(grep -rl '__[A-Z_]*__' "$dst" | head -3)"
echo "$type" > "$dst/dev/site-type"
cat > "$dst/dev/brief.md" <<BRIEF
# $title: design brief

- Site type: $type
- One line: $desc

Fill in (theme-writer does this from the intake):

## Who the site is for

## Vibe (three words, and what it is NOT)

## References (URLs, and what to take from each)

## Palette (light and dark, contrast checked)

## Type (heading, body, mono; self-hosted, OFL)

## Signature details (two or three things that make it recognisable)

## Must-haves and out of scope
BRIEF
BIN=${HATAMOTO_BIN:-hatamoto}
"$BIN" theme check "$dst" --expect-name "$name" >/dev/null || die "the new theme does not pass hatamoto theme check"
echo "new-theme: created $dst ($type, prefix $prefix)"
echo "next: scripts/dev-site.sh $type $dst --serve"
