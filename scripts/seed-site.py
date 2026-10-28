#!/usr/bin/env python3
"""Seed a FRESH local Hatamoto site from a site-type seed (site-types/<type>/seed.json).

Creates the owner, finishes the setup wizard ("start empty"), then adds what the
seed lists: generated images in the media library, categories, extra schemas,
pages built from sections (the home page becomes the homepage), posts and
entities with spread-out publish dates, and menus (header, footer, sidebar,
nested items allowed). Run by scripts/dev-site.sh; see site-types/README.md for
the seed format.

Env: DATABASE_URL (must point at this machine), BASE (the running server),
     HATAMOTO_BIN (default hatamoto), PSQL (default psql).
Usage: python3 scripts/seed-site.py site-types/<type>/seed.json
"""
import datetime, http.cookiejar, json, os, re, struct, subprocess, sys, urllib.error, urllib.parse, urllib.request, uuid, zlib

DB = os.environ.get("DATABASE_URL", "")
BASE = os.environ.get("BASE", "").rstrip("/")
BIN = os.environ.get("HATAMOTO_BIN", "hatamoto")
PSQL = os.environ.get("PSQL", "psql")
if urllib.parse.urlparse(DB).hostname not in ("127.0.0.1", "localhost", "::1"):
    sys.exit("seed: refusing a non-local DATABASE_URL")
if not BASE.startswith("http://127.0.0.1:") and not BASE.startswith("http://localhost:"):
    sys.exit("seed: BASE must be a local server")
if len(sys.argv) != 2:
    sys.exit(__doc__)
S = json.load(open(sys.argv[1]))
OWNER = S["owner"]


def sh(*a, stdin=None):
    return subprocess.run(a, input=stdin, capture_output=True, text=True)


def sql(q, *params):
    # Values travel as psql variables (:'v1'), never spliced into the SQL text.
    args = [PSQL, DB, "-v", "ON_ERROR_STOP=1", "-qtAX"]
    for i, p in enumerate(params, 1):
        args += ["-v", f"v{i}={p}"]
    r = subprocess.run(args, input=q, capture_output=True, text=True)
    if r.returncode:
        sys.exit("seed: sql failed: " + r.stderr.strip())
    return r.stdout.strip()


# ---- generated images (PNG, no dependencies) -------------------------------------------------

def hexrgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def png(path, w, h, colours, style):
    """A flat, deterministic illustration: a diagonal gradient plus a pattern."""
    a, b = hexrgb(colours[0]), hexrgb(colours[1 % len(colours)])
    c = hexrgb(colours[2 % len(colours)])
    rows = []
    for y in range(h):
        row = bytearray(b"\x00")
        for x in range(w):
            t = (x / w + y / h) / 2
            px = [int(a[i] + (b[i] - a[i]) * t) for i in range(3)]
            on = False
            if style == "stripes":
                on = ((x + y) // max(8, w // 40)) % 2 == 0
            elif style == "dots":
                g = max(16, w // 24)
                on = (x % g - g / 2) ** 2 + (y % g - g / 2) ** 2 < (g / 6) ** 2
            elif style == "arcs":
                r = ((x - w * 0.7) ** 2 + (y - h * 1.1) ** 2) ** 0.5
                on = int(r / max(10, w // 30)) % 2 == 0
            elif style == "grid":
                g = max(20, w // 16)
                on = x % g < 2 or y % g < 2
            if on:
                px = [int(px[i] * 0.78 + c[i] * 0.22) for i in range(3)]
            row += bytes(px)
        rows.append(bytes(row))
    raw = zlib.compress(b"".join(rows), 9)

    def chunk(t, d):
        return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
    with open(path, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
                + chunk(b"IDAT", raw) + chunk(b"IEND", b""))


# ---- admin session ---------------------------------------------------------------------------

jar = http.cookiejar.CookieJar()


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar), NoRedirect())
NAV = {"Sec-Fetch-Site": "same-origin", "Sec-Fetch-Mode": "navigate", "Sec-Fetch-Dest": "document"}
TOKEN = ""


def get(path):
    # Follows same-site redirects by hand (the wizard sends the owner through its steps).
    for _ in range(6):
        req = urllib.request.Request(BASE + path, headers=NAV)
        try:
            r = op.open(req)
            return r.status, r.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            loc = e.headers.get("Location", "")
            if e.code in (301, 302, 303, 307, 308) and loc.startswith("/"):
                path = loc
                continue
            return e.code, e.read().decode("utf-8", "replace")
    return 0, ""


def token(path):
    global TOKEN
    _, body = get(path)
    m = re.search(r'<meta name="csrf-token" content="([^"]*)"', body)
    TOKEN = m.group(1) if m else next((c.value for c in jar if c.name == "hatamoto_csrf"), "")


def form(path, **kv):
    kv["_csrf"] = TOKEN
    req = urllib.request.Request(BASE + path, data=urllib.parse.urlencode(kv).encode(),
                                 headers={**NAV, "Origin": BASE, "X-CSRF-Token": TOKEN})
    try:
        return op.open(req).status
    except urllib.error.HTTPError as e:
        return e.code


def upload(path, mime="image/png"):
    bnd = "----seed" + uuid.uuid4().hex
    name = os.path.basename(path)
    body = (f"--{bnd}\r\nContent-Disposition: form-data; name=\"_csrf\"\r\n\r\n{TOKEN}\r\n"
            f"--{bnd}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{name}\"\r\n"
            f"Content-Type: {mime}\r\n\r\n").encode() + open(path, "rb").read() + f"\r\n--{bnd}--\r\n".encode()
    req = urllib.request.Request(BASE + "/admin/media/upload", data=body, headers={
        **NAV, "Origin": BASE, "X-CSRF-Token": TOKEN, "Content-Type": "multipart/form-data; boundary=" + bnd})
    try:
        code = op.open(req).status
    except urllib.error.HTTPError as e:
        code = e.code
    if code >= 400:
        sys.exit(f"seed: upload {name} answered {code}")
    return sql("select public_url from hatamoto_media where original_filename = :'v1' order by created_at desc limit 1", name)


def ok(step, code):
    print(f"{step}: {code}")
    if code >= 400:
        sys.exit(f"seed: {step} failed ({code})")


r = sh(BIN, "user", "create", "--email", OWNER["email"], "--name", OWNER["name"], "--role", "owner",
       "--password-stdin", stdin=OWNER["password"])
print("owner:", "created" if r.returncode == 0 else "exists (" + r.stderr.strip()[:80] + ")")
token("/admin/login")
ok("login", form("/admin/login", email=OWNER["email"], password=OWNER["password"]))
token("/admin")
site = S["site"]
# The admin hides every screen until the profile (name and photo) is complete;
# the upload is exempt from that gate.
tmp = os.environ.get("TMPDIR", "/tmp")
av = os.path.join(tmp, "owner-avatar.png")
png(av, 256, 256, [site.get("colour", "#c23b22"), "#ffffff", "#000000"], "dots")
photo = upload(av)
os.remove(av)
ok("profile", form("/admin/profile/complete", name=OWNER["name"], photo=photo, public="true" if OWNER.get("public", True) else "false"))
ok("setup site", form("/admin/setup/site", name=site["name"], url="", language=site.get("language", "en"), timezone="UTC"))
ok("setup theme", form("/admin/setup/theme", colour=site.get("colour", "#c23b22")))
ok("setup content", form("/admin/setup/content", content="empty"))
token("/admin")
if site.get("tagline"):
    sql("update hatamoto_site_config set tagline = :'v1'", site["tagline"])

# ---- media: {{media:NAME}} anywhere in the seed becomes the uploaded URL ----------------------

MEDIA = {}
for m in S.get("media", []):
    p = os.path.join(tmp, m["name"])
    png(p, m.get("w", 1600), m.get("h", 1000), m["colours"], m.get("style", "arcs"))
    MEDIA[m["name"]] = upload(p)
    os.remove(p)
    print("media", m["name"], MEDIA[m["name"]])


def subst(v):
    if isinstance(v, str):
        return re.sub(r"\{\{media:([^}]+)\}\}", lambda mm: MEDIA.get(mm.group(1), ""), v)
    if isinstance(v, list):
        return [subst(x) for x in v]
    if isinstance(v, dict):
        return {k: subst(x) for k, x in v.items()}
    return v


S = subst(S)

# ---- schemas, terms --------------------------------------------------------------------------

for sc in S.get("schemas", []):
    # A content type the built-in install lacks (docs: "doc"). Copies the field
    # schema of an existing one ("like", default page); "settings" holds the
    # routing (url_pattern, archive_path, sitemap_group).
    if sql("select count(*) from hatamoto_entity_schemas where slug = :'v1'", sc["slug"]) == "0":
        sql("""insert into hatamoto_entity_schemas (name, slug, description, schema, ui_schema, settings)
               select :'v2', :'v1', :'v3', schema, ui_schema, settings || :'v4'::jsonb
               from hatamoto_entity_schemas where slug = :'v5'""",
            sc["slug"], sc["name"], sc.get("description", ""), json.dumps(sc.get("settings", {})), sc.get("like", "page"))
        print("schema", sc["slug"])

for t in S.get("categories", []):
    sql("insert into hatamoto_terms(kind, slug, name) values ('category', :'v1', :'v2') on conflict do nothing", t["slug"], t["name"])


# ---- pages and entries -----------------------------------------------------------------------

def page_doc(sections):
    nodes = []
    for i, s in enumerate(sections):
        sid = s.get("id") or f"s{i + 1}"
        nodes.append({"id": "c-" + sid, "t": "container", "p": {"tag": "section", "v1": True},
                      "c": [{"id": sid, "t": "component", "p": {"type": s["type"], "content": s.get("content", {})}}]})
    return {"v": 2, "nodes": nodes}


IDS = {}
now = datetime.datetime.now(datetime.timezone.utc).replace(hour=9, minute=0, second=0, microsecond=0)


def create(schema, e):
    attrs = dict(e.get("attributes", {}))
    if "sections" in e:
        attrs["page_doc"] = page_doc(e["sections"])
    if e.get("content"):
        attrs["content"] = e["content"]
    for k in ("excerpt", "description", "featured_image", "category"):
        if e.get(k):
            attrs[k] = e[k]
    slug = e.get("slug", "")
    if e.get("home"):
        # The wizard's "start empty" made the home page; replace its attributes.
        sql("""update hatamoto_entities set name = :'v2', attributes = attributes || :'v3'::jsonb, status = 'published',
               published_at = coalesce(published_at, now()) where slug = :'v1'""", "home", e["name"], json.dumps(attrs))
        eid = sql("select id from hatamoto_entities where slug = 'home'")
        sql("update hatamoto_site_config set homepage_entity_id = :'v1'", eid)
    else:
        args = [BIN, "entity", "create", "--schema", schema, "--name", e["name"], "--attributes", json.dumps(attrs),
                "--publish", "--as", OWNER["email"]]
        if slug:
            args[5:5] = ["--slug", slug]
        r = sh(*args)
        if r.returncode:
            sys.exit(f"seed: {schema} {e['name']}: {r.stderr.strip()[:300]}")
        eid = json.loads(r.stdout)["id"]
    if "days_ago" in e:
        when = (now - datetime.timedelta(days=e["days_ago"])).isoformat()
        sql("update hatamoto_entities set published_at = :'v2', created_at = :'v2' where id = :'v1'", eid, when)
    for cat in ([e["category_slug"]] if e.get("category_slug") else []):
        sql("""insert into hatamoto_entity_terms(entity_id, term_id) select :'v1', id from hatamoto_terms
               where kind = 'category' and slug = :'v2' on conflict do nothing""", eid, cat)
    if e.get("parent"):
        sql("update hatamoto_entities set parent_id = (select id from hatamoto_entities where slug = :'v2') where id = :'v1'",
            eid, e["parent"])
    IDS[slug or e["name"]] = eid
    print(schema, e["name"])


for p in S.get("pages", []):
    create("page", p)
for p in S.get("posts", []):
    create("post", p)
for schema, items in S.get("entries", {}).items():
    for e in items:
        create(schema, e)


# ---- menus -----------------------------------------------------------------------------------

def item(menu_id, it, pos, parent=None):
    iid = str(uuid.uuid4())
    if "page" in it:
        kind, ent, url, sch = "entity", IDS.get(it["page"]) or sql("select id from hatamoto_entities where slug = :'v1'", it["page"]), "", ""
    elif "archive" in it:
        kind, ent, url, sch = "archive", "", "", it["archive"]
    elif "url" in it and it["url"].startswith(("http://", "https://")):
        kind, ent, url, sch = "external", "", it["url"], ""
    else:
        kind, ent, url, sch = "custom", "", it.get("url", ""), ""
    sql("""insert into hatamoto_menu_items (id, menu_id, parent_id, label, link_type, entity_id, url, schema_slug, position)
           values (:'v1', :'v2', nullif(:'v3','')::uuid, :'v4', :'v5', nullif(:'v6','')::uuid, nullif(:'v7',''), nullif(:'v8',''), :'v9'::int)""",
        iid, menu_id, parent or "", it["label"], kind, ent or "", url, sch, str(pos))
    for j, ch in enumerate(it.get("children", [])):
        item(menu_id, ch, j, iid)


for loc, items in S.get("menus", {}).items():
    mid = sql("select id from hatamoto_menus where location = :'v1'", loc)
    if mid:
        sql("delete from hatamoto_menu_items where menu_id = :'v1'", mid)
    else:
        mid = sql("insert into hatamoto_menus (name, slug, location) values (:'v1', :'v2', :'v2') returning id",
                  loc.capitalize(), loc)
    for i, it in enumerate(items):
        item(mid, it, i)
    print("menu", loc, len(items))

print("seed: done")
