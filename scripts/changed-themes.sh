#!/usr/bin/env bash
# changed-themes.sh [--json] [BASE [HEAD]] - the theme folders (themes/<name>)
# touched between BASE and HEAD, one per line, or a JSON array with --json.
# A change outside themes/ (scripts/, site-types/, template/, .github/, ...)
# counts as a change to every theme. No BASE: every theme.
set -euo pipefail
json=0
[ "${1:-}" = --json ] && { json=1; shift; }
cd "$(git rev-parse --show-toplevel)"
all() { for f in themes/*/theme.json; do [ -f "$f" ] && dirname "$f"; done; }
if [ $# -eq 0 ]; then
  list=$(all)
else
  base=$1 head=${2:-HEAD}
  files=$(git diff --name-only "$base...$head")
  if grep -qvE '^(themes/|README\.md$|CONTRIBUTING\.md$)' <<<"$files"; then
    list=$(all)
  else
    list=$(sed -n 's#^\(themes/[^/]*\)/.*#\1#p' <<<"$files" | sort -u | while read -r d; do
      [ -f "$d/theme.json" ] && echo "$d"; done)
  fi
fi
if [ "$json" = 1 ]; then
  printf '%s\n' $list | jq -R 'select(length > 0)' | jq -cs .
else
  [ -z "$list" ] || printf '%s\n' $list
fi
