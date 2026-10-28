#!/usr/bin/env bash
# dev-site.sh - boot a throwaway local Hatamoto site with the sample content of
# one site type, push a theme to it, and check, shoot or serve it.
#
# Usage:
#   scripts/dev-site.sh <type> [themes/<name>] [--serve] [--shots DIR] [--screenshot]
#
#   <type>           a folder under site-types/ (business, blog, portfolio, docs,
#                    landing, restaurant); themes/<name>/dev/seed.json, when it
#                    exists, is used instead of site-types/<type>/seed.json
#   themes/<name>    the theme to push with `hatamoto theme dev` (live reload);
#                    without it the site runs the built-in default theme
#   --serve          print the address and the sign-in, then keep running
#                    (Ctrl-C stops and deletes everything)
#   --shots DIR      run scripts/shoot.mjs: every page of the seed at desktop and
#                    mobile size, with the browser checks (exit 1 on a problem)
#   --screenshot     with a theme: also write themes/<name>/assets/screenshot.png
#                    from the seed's "screenshot" page (1440x900)
#
# Without --serve or --shots it seeds, pushes and checks that every page of the
# seed answers 200 with the theme active (a quick render smoke test).
#
# Env: HATAMOTO_BIN (default: hatamoto on PATH), PG_BIN (dir with initdb and
# pg_ctl; default: initdb on PATH, else the newest /usr/lib/postgresql/*/bin),
# CHROME (default /usr/bin/google-chrome), KEEP=1 keeps the work dir.
# Everything runs on 127.0.0.1 in a temporary directory; nothing leaves the
# machine (update checks and the registry are switched off).
set -Eeuo pipefail
ROOT=$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel)
die() { echo "dev-site: $*" >&2; exit 2; }

type=${1:-}; [ -n "$type" ] || { sed -n '2,27p' "$0"; exit 64; }; shift
theme="" serve=0 shots="" screenshot=0
while [ $# -gt 0 ]; do
  case "$1" in
    --serve) serve=1 ;;
    --shots) shots=${2:?--shots needs a directory}; shift ;;
    --screenshot) screenshot=1 ;;
    themes/*) theme=${1%/} ;;
    *) die "unknown argument $1" ;;
  esac
  shift
done
[ -d "$ROOT/site-types/$type" ] || die "no site type $type (have: $(ls "$ROOT/site-types" | tr '\n' ' '))"
seed=$ROOT/site-types/$type/seed.json
if [ -n "$theme" ]; then
  [ -f "$ROOT/$theme/theme.json" ] || die "$theme/theme.json not found"
  [ -f "$ROOT/$theme/dev/seed.json" ] && seed=$ROOT/$theme/dev/seed.json
fi
((screenshot == 0)) || [ -n "$theme" ] || die "--screenshot needs a theme"

BIN=${HATAMOTO_BIN:-$(command -v hatamoto || true)}
[ -x "${BIN:-/nonexistent}" ] || die "no hatamoto binary (set HATAMOTO_BIN)"
BIN=$(readlink -f "$BIN")
command -v python3 >/dev/null || die "python3 needed"
if [ -z "${PG_BIN:-}" ]; then
  if command -v initdb >/dev/null; then PG_BIN=$(dirname "$(command -v initdb)")
  else PG_BIN=$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1); fi
fi
[ -x "${PG_BIN:-/nonexistent}/initdb" ] || die "no postgres binaries (set PG_BIN)"

W=$(mktemp -d /tmp/hm-theme-site.XXXXXX)
SRV="" DEV="" PG=""
cleanup() {
  [ -n "$DEV" ] && kill "$DEV" 2>/dev/null || true
  [ -n "$SRV" ] && kill "$SRV" 2>/dev/null && wait "$SRV" 2>/dev/null || true
  [ -n "$PG" ] && "$PG_BIN/pg_ctl" -D "$W/pg" stop -m immediate >/dev/null 2>&1 || true
  if [ "${KEEP:-}" = 1 ]; then echo "dev-site: kept $W"; else rm -rf "$W"; fi
}
trap cleanup EXIT
trap 'exit 130' INT TERM
port() { python3 -c 'import socket;s=socket.socket();s.bind(("127.0.0.1",0));print(s.getsockname()[1])'; }

# Postgres: a fresh cluster, trust auth, loopback only. A port can be taken
# between the probe and the bind, so retry on "already in use".
"$PG_BIN/initdb" -D "$W/pg" -U hatamoto --auth=trust >/dev/null
for _ in 1 2 3 4 5; do
  PGPORT=$(port)
  if "$PG_BIN/pg_ctl" -D "$W/pg" -o "-p $PGPORT -k $W -c listen_addresses=127.0.0.1" -l "$W/pg.log" -w start >/dev/null; then PG=1; break; fi
  grep -q 'already in use' "$W/pg.log" || break
done
[ -n "$PG" ] || { cat "$W/pg.log" >&2; die "postgres did not start"; }
"$PG_BIN/createdb" -h 127.0.0.1 -p "$PGPORT" -U hatamoto site
export DATABASE_URL="postgres://hatamoto@127.0.0.1:$PGPORT/site?sslmode=disable"
export PSQL=psql
[ -x "$PG_BIN/psql" ] && PSQL=$PG_BIN/psql

API_PORT=$(port)
export BASE="http://127.0.0.1:$API_PORT" HATAMOTO_BIN=$BIN
mkdir -p "$W/cwd"
start_server() {
  (
    cd "$W/cwd"
    export ENVIRONMENT=development API_HOST=127.0.0.1 API_PORT HATAMOTO_DATA="$W/data" \
      HATAMOTO_ADMIN_PATH=/admin EMAIL_DISABLED=true \
      HATAMOTO_UPDATE_URL=https://127.0.0.1:9 HATAMOTO_REGISTRY_URL=off
    exec "$BIN" serve >>"$W/server.log" 2>&1
  ) &
  SRV=$!
  for _ in $(seq 1 120); do
    curl -fs -o /dev/null "$BASE/health" && return 0
    kill -0 "$SRV" 2>/dev/null || { tail -40 "$W/server.log" >&2; die "server exited"; }
    sleep 0.5
  done
  tail -40 "$W/server.log" >&2; die "server did not come up on $BASE"
}
start_server

python3 "$ROOT/scripts/seed-site.py" "$seed" || die "seed failed"
# The server reads content types (and their routes) at boot: restart it when
# the seed added one (docs, portfolio).
if python3 -c 'import json,sys;sys.exit(0 if json.load(open(sys.argv[1])).get("schemas") else 1)' "$seed"; then
  kill "$SRV"; wait "$SRV" 2>/dev/null || true
  start_server
  echo "dev-site: server restarted for the new content types"
fi

if [ -n "$theme" ]; then
  name=$(python3 -c 'import json,sys;print(json.load(open(sys.argv[1]))["name"])' "$ROOT/$theme/theme.json")
  (cd "$W/cwd" && ENVIRONMENT=development exec "$BIN" theme dev "$ROOT/$theme" --dev) >"$W/theme-dev.log" 2>&1 &
  DEV=$!
  # Wait until the server renders with the pushed theme (the push is applied
  # within about a second; the home page then carries the theme's stylesheet).
  for _ in $(seq 1 60); do
    grep -q 'NOT PUSHED' "$W/theme-dev.log" && { cat "$W/theme-dev.log" >&2; die "theme dev refused the theme"; }
    kill -0 "$DEV" 2>/dev/null || { cat "$W/theme-dev.log" >&2; die "theme dev exited"; }
    act=$("$PSQL" "$DATABASE_URL" -qtAX -c "select coalesce(active_theme,'') from hatamoto_package_config" 2>/dev/null || true)
    [ "$act" = "$name" ] && break
    sleep 0.5
  done
  [ "$act" = "$name" ] || { cat "$W/theme-dev.log" >&2; die "theme $name was not activated (active: '${act:-default}')"; }
  sleep 1.5   # the server polls for package changes; let it swap the chain
  echo "dev-site: theme $name active"
fi

bad=0
while read -r p want; do
  [ -n "$p" ] || continue
  code=$(curl -s -o "$W/page.html" -w '%{http_code}' "$BASE$p")
  if [ "$code" != "$want" ]; then echo "FAIL $p answered $code, want $want"; bad=1; else echo "ok   $p $code"; fi
done < <(python3 -c 'import json,sys;[print(s["path"], s.get("status",200)) for s in json.load(open(sys.argv[1])).get("shots",[])]' "$seed")
((bad == 0)) || { tail -30 "$W/server.log" >&2; die "pages failed to render"; }

if [ -n "$shots" ] || ((screenshot)); then
  out=${shots:-$W/shots}
  args=(--base "$BASE" --seed "$seed" --out "$out")
  ((screenshot)) && args+=(--screenshot "$ROOT/$theme/assets/screenshot.png")
  [ -d "$ROOT/scripts/node_modules/playwright-core" ] || (cd "$ROOT/scripts" && npm ci --no-audit --no-fund >/dev/null) || die "npm ci failed in scripts/"
  node "$ROOT/scripts/shoot.mjs" "${args[@]}" || die "browser checks failed (shots in $out)"
fi

if ((serve)); then
  echo
  echo "dev-site: $BASE  (admin: $BASE/admin, $(python3 -c 'import json,sys;o=json.load(open(sys.argv[1]))["owner"];print(o["email"],"/",o["password"])' "$seed"))"
  [ -n "$theme" ] && echo "dev-site: theme dev is watching $theme; save a file and reload"
  echo "dev-site: Ctrl-C stops and deletes the site"
  wait "$SRV"
fi
echo "dev-site: OK $type${theme:+ with $theme}"
