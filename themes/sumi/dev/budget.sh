#!/usr/bin/env bash
# Size budget for sumi: every blog seed page, gzipped, must stay within 13.37 KB
# (13,370 bytes), and the theme must add no stylesheet, script, font or other
# request of its own. Exit 0 within budget, 1 otherwise.
#
# Usage: themes/sumi/dev/budget.sh
#   HATAMOTO_BIN=/path/to/hatamoto   measure on another core build. The core this
#                                    repo pins predates the speculation rules and
#                                    the analytics tag, so their size is added as a
#                                    constant below; a newer core already serves
#                                    them and nothing is added.
set -euo pipefail

BUDGET=13370
# What a current core splices into every public page and the pinned core does not
# (render engine, speculation rules and tracker tag): the gzipped speculationrules
# script (454 bytes raw) and the raw tracker script tag.
CORE_SPECULATION_GZ=267
CORE_TRACK_TAG=55

ROOT=$(git rev-parse --show-toplevel)
THEME=$ROOT/themes/sumi
seed=$THEME/dev/seed.json
tmp=$(mktemp -d)
log=$tmp/serve.log
pid=
cleanup() {
  [ -z "$pid" ] || { kill "$pid" 2>/dev/null || true; wait "$pid" 2>/dev/null || true; }
  rm -rf "$tmp"
}
trap cleanup EXIT

fail=0
[ -z "${HATAMOTO_BIN:-}" ] || echo "budget: core build $HATAMOTO_BIN"

# 1. Sources: the theme's own templates must not carry a stylesheet, script or font.
if grep -rnE '<script|rel=["'\'']?stylesheet|@import|@font-face' "$THEME/layouts" "$THEME/partials"; then
  echo "budget: FAIL theme source carries a stylesheet, script, import or font" >&2
  fail=1
fi
if find "$THEME/assets" -type f ! -name screenshot.png 2>/dev/null | grep -q .; then
  echo "budget: FAIL theme assets other than screenshot.png (CSS, JS or fonts)" >&2
  fail=1
fi

# 2. Serve the blog seed with the theme.
"$ROOT/scripts/dev-site.sh" blog themes/sumi --serve >"$log" 2>&1 &
pid=$!
base=
for _ in $(seq 1 240); do
  base=$(grep -oE '^dev-site: http://127\.0\.0\.1:[0-9]+' "$log" | head -1 | sed 's/^dev-site: //' || true)
  [ -z "$base" ] || break
  kill -0 "$pid" 2>/dev/null || { cat "$log" >&2; echo "budget: dev-site exited" >&2; exit 1; }
  sleep 0.5
done
[ -n "$base" ] || { cat "$log" >&2; echo "budget: dev-site did not come up" >&2; exit 1; }

# 3. Fetch every seed page.
printf '%7s  %-48s %s\n' bytes path '(raw / gz / +core)'
max=0
while IFS= read -r path; do
  [ -n "$path" ] || continue
  # No -f: the 404 page has a body too.
  curl -s -H 'Accept-Encoding: gzip' -D "$tmp/hdr" -o "$tmp/body" "$base$path"
  if grep -qi '^content-encoding: *gzip' "$tmp/hdr"; then
    gz=$(wc -c <"$tmp/body")
    gunzip -c "$tmp/body" >"$tmp/html"
  else
    # A core without response compression: gzip -9 is the yardstick.
    cp "$tmp/body" "$tmp/html"
    gz=$(gzip -9 <"$tmp/html" | wc -c)
  fi
  raw=$(wc -c <"$tmp/html")
  extra=0
  grep -q 'speculationrules' "$tmp/html" || extra=$((extra + CORE_SPECULATION_GZ))
  grep -q 'hm-track.js' "$tmp/html" || extra=$((extra + CORE_TRACK_TAG))
  total=$((gz + extra))
  printf '%7d  %-48s (%d / %d / +%d)\n' "$total" "$path" "$raw" "$gz" "$extra"
  ((total <= max)) || max=$total
  if ((total > BUDGET)); then
    echo "budget: FAIL $path is $total bytes, over $BUDGET" >&2
    fail=1
  fi
  # Requests the page itself makes for the theme: stylesheets, fonts, imports,
  # remote or non-data url(), scripts other than the core tracker.
  if ! python3 - "$tmp/html" <<'PY'
import re, sys
html = open(sys.argv[1], encoding="utf-8", errors="replace").read()
bad = []
if re.search(r'<link\b[^>]*\brel=["\']?stylesheet', html, re.I):
    bad.append("<link rel=stylesheet>")
for m in re.finditer(r'<script\b[^>]*\bsrc=["\']?([^"\'\s>]+)', html, re.I):
    if not m.group(1).endswith("/hm-track.js"):
        bad.append("<script src=%s>" % m.group(1))
for m in re.finditer(r'<style\b[^>]*>(.*?)</style>', html, re.I | re.S):
    css = m.group(1)
    if re.search(r'@font-face|@import', css):
        bad.append("@font-face or @import in <style>")
    if re.search(r'url\(\s*["\']?(?!data:)', css):
        bad.append("url() in <style>")
for m in re.finditer(r'<(?:img|iframe|source|video|audio)\b[^>]*\bsrc=["\']?(https?://[^"\'\s>]+)', html, re.I):
    bad.append("remote " + m.group(1))
if bad:
    print("budget: FAIL theme-owned request: " + "; ".join(sorted(set(bad))), file=sys.stderr)
    sys.exit(1)
PY
  then
    echo "budget: FAIL $path" >&2
    fail=1
  fi
done < <(python3 -c 'import json,sys;[print(s["path"]) for s in json.load(open(sys.argv[1]))["shots"]]' "$seed")

echo "max     $max bytes of $BUDGET"
((fail == 0)) || { echo "budget: FAILED" >&2; exit 1; }
echo "budget: OK"
