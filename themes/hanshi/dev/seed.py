#!/usr/bin/env python3
"""Seed a FRESH local Hatamoto database with blog content for developing Hanshi.

Creates an owner, finishes the setup wizard, then adds 16 published posts with
real-looking bodies (headings, lists, code, tables, quotes), seven categories and
spread-out publish dates, so every Hanshi view (home, archive pages, single post,
category, search) has something to show.

Env: DATABASE_URL (local only), BASE (default http://127.0.0.1:8711),
     HATAMOTO_BIN (default hatamoto). Never point this at a real site.
Usage: python3 dev/seed.py
"""
import json, os, subprocess, sys, tempfile, urllib.parse, http.cookiejar, urllib.request, datetime

DB = os.environ.get("DATABASE_URL", "")
BASE = os.environ.get("BASE", "http://127.0.0.1:8711")
BIN = os.environ.get("HATAMOTO_BIN", "hatamoto")
EMAIL, PASS = "owner@hanshi.test", "hanshi-dev-password"
host = urllib.parse.urlparse(DB).hostname or ""
if host not in ("127.0.0.1", "localhost", "::1"):
    sys.exit("seed: refusing a non-local DATABASE_URL")

def sh(*a, stdin=None):
    return subprocess.run(a, input=stdin, capture_output=True, text=True)

def sql(q):
    r = sh("psql", DB, "-Atc", q)
    if r.returncode:
        sys.exit("seed: sql failed: " + r.stderr)
    return r.stdout.strip()

# owner + wizard
r = sh(BIN, "user", "create", "--email", EMAIL, "--name", "Hanshi Owner", "--role", "owner", "--password-stdin", stdin=PASS)
print("owner:", "created" if r.returncode == 0 else "exists")
jar = http.cookiejar.CookieJar()
op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k): return None
op.add_handler(NoRedirect())
def csrf(): return next((c.value for c in jar if c.name == "hatamoto_csrf"), "")
def form(path, **kv):
    kv["_csrf"] = csrf()
    req = urllib.request.Request(BASE + path, data=urllib.parse.urlencode(kv).encode(), headers={"Origin": BASE})
    try: return op.open(req).status
    except urllib.error.HTTPError as e: return e.code
op.open(BASE + "/admin/login")
print("login", form("/admin/login", email=EMAIL, password=PASS))
print("profile", form("/admin/profile/complete", name="Hanshi Owner", photo="", public="false"))
print("setup site", form("/admin/setup/site", name="Hatamoto Journal", url="", language="en", timezone="UTC"))
print("setup theme", form("/admin/setup/theme", colour="#c23b22"))
print("setup content", form("/admin/setup/content", content="starter"))

CATS = [("migration", "Migration"), ("ai-search", "AI & search"), ("updates", "Updates"), ("plugins", "Plugins"),
        ("themes", "Themes"), ("engineering", "Engineering"), ("security", "Security")]
for slug, name in CATS:
    sql(f"insert into hatamoto_terms(kind,slug,name) values ('category','{slug}','{name}') on conflict do nothing")

LONG = """<p>Most migrations fail quietly. The pages come across, the site looks right, and three weeks later search traffic is down because a few hundred old addresses now answer with a 404. The import wizard is built around the opposite promise: at the end you get your pages, posts, images, menus and authors, and a report that lists every old address and anything that needs a look.</p>
<h2>Before you start</h2>
<p>You need a site you can sign in to as an <strong>owner</strong>, the role that can do everything. Your WordPress site must still be online: the import reads from it, and it never writes to it.</p>
<ul><li>A username with an <strong>application password</strong>, a separate password WordPress makes for programs.</li><li>Or an <strong>export file</strong> from <em>Tools › Export › All content</em>, up to 256 MB.</li></ul>
<blockquote><p>Images are downloaded from the addresses inside the export file, so the old site has to stay online until the import finishes.</p></blockquote>
<h2>Scan the old site</h2>
<ol><li>Open <strong>Settings › Import &amp; export › WordPress import</strong>.</li><li>Fill in the site address, the username and the application password, or choose your export file.</li><li>Select <strong>Scan the site</strong>. The scan reads the old site and writes nothing.</li></ol>
<p>The scan report tells you what you are about to move before anything moves: how many posts, pages, drafts, images, categories, tags, authors and menus it found, your permalink structure and whether the same rule can be used, and the plugins it noticed.</p>
<h3>Expected fidelity</h3>
<p>The number that matters most is <strong>expected fidelity</strong>: the share of items that come across without loss, with each item that does not and the reason.</p>
<h2>Choose and run</h2>
<p>Pick the content types to bring across, switch menus, drafts and image downloads on or off, then decide on the URL structure. Copying the WordPress permalinks keeps most old addresses exactly the same.</p>
<h2>Review the report</h2>
<table><thead><tr><th>Part</th><th>What it tells you</th></tr></thead><tbody><tr><td>Items that failed</td><td>Each failure, with the reason.</td></tr><tr><td>Pages to review</td><td>Pages that came across with some loss.</td></tr><tr><td>Redirects created</td><td>Every forward from an old address to a new one.</td></tr><tr><td>URL audit</td><td>Every old address checked on this site.</td></tr></tbody></table>
<h3>Fix the pages to review</h3>
<p>Each row links to its edit screen. Open it in the page editor, rebuild the layout with sections, and save. The text is already there.</p>
<h2>From the command line</h2>
<p>A scan cannot reach a site on your own network. An administrator can run the same import on the server instead:</p>
<pre><code>hatamoto import wordpress --url https://old.example.com --user admin --allow-private-hosts</code></pre>
<p>When the audit is clean, point the domain at the new site. Old links keep working, and crawler analytics start counting from the first visit.</p>"""

def body(lede, sections):
    out = f"<p>{lede}</p>"
    for h, p in sections:
        out += f"<h2>{h}</h2><p>{p}</p>"
    return out

POSTS = [
 ("Move off WordPress without losing a single URL", "migration", 0, "Scan the old site, choose what comes across, and read a URL audit that proves every old address still answers, directly or with one 301.", LONG),
 ("Which AI read your page, and did it send anyone?", "ai-search", 5, "Crawler visits and assistant referrals are recorded, verified against published IP ranges, and reported per page.",
  body("Every request from a known AI crawler is recorded with the page it fetched.", [("Verified, not guessed", "A hit that claims to be a crawler is checked against the operator's published IP ranges or its reverse DNS, so a forged user agent is labelled as spoofed."), ("Referrals", "When an assistant sends a visitor, the referral is counted against the page that earned it."), ("Where to look", "The admin shows both per page, and the same numbers are in the API and the command line.")])),
 ("Signed updates you control", "updates", 11, "Two signing keys, a supervisor that rolls back on its own, and switches for notify-only, pinning and install hours.",
  body("Every release is signed twice before a server will run it.", [("Two keys", "One key signs the release, another signs the channel that points at it. A leaked channel key alone cannot ship code."), ("Rollback", "The supervisor starts the new version, watches it, and goes back to the previous one if it does not become healthy."), ("Your switches", "Pin a release line, delay updates, pick install hours, or switch to notify-only.")])),
 ("Plugins in a sandbox: why we chose WebAssembly", "plugins", 18, "One-click plugins that react to events, store data and add admin pages, with no compiling and no shared memory.",
  body("A plugin is a WebAssembly module with a list of permissions it asks for.", [("No shared memory", "A plugin cannot read the server's memory or another plugin's. It talks to the host through a small, versioned set of calls."), ("Permissions", "Fetching from the network, storing data or adding an admin page are each a grant the owner sees at install."), ("One click", "Signed packages install from the registry without compiling anything.")])),
 ("Design tokens and style presets, from theme.json to the editor", "themes", 23, "Opt in with builder.tokens and the owner's spacing, type scale and shadows reach every page your theme renders.",
  body("Design tokens are named values a theme reuses everywhere.", [("Colours and fonts", "The owner sets the brand colour, background, text, fonts and corners. Only changed values are printed, so the theme's defaults hold for the rest."), ("Design system", "A theme that sets builder.tokens also receives the spacing scale, the type scale and three shadows."), ("Style presets", "Named style maps an editor applies to any node; a value set on the node still wins.")])),
 ("Let an AI agent draft and publish over MCP, safely", "ai-search", 30, "Every tool, scope, limit and audit record of the endpoint agents use to read, draft and publish on your site.",
  body("The MCP server lets an agent work through the CMS, not around it.", [("Scopes", "An API key carries scopes, so an agent that may draft cannot publish."), ("Audit", "Every call is recorded with the key that made it.")])),
 ("The robots.txt and llms.txt your site serves", "ai-search", 37, "The crawler policy per purpose, per-page opt-outs, and the knowledge-graph feed, exactly as served.",
  body("Both files are generated from one policy.", [("Per purpose", "Training, search and assistants are set separately, not crawler by crawler."), ("Per page", "A page can opt out of both files on its own.")])),
 ("One binary plus Postgres: what that means on a server", "engineering", 43, "No Node, no Redis. How a request becomes a cached, server-rendered page, and where your data lives.",
  body("The whole CMS is one Go program.", [("A request", "The router finds the entity, the theme renders it, and the page cache keeps the result until content changes."), ("Your data", "Content, media metadata and settings live in Postgres. Media files live on disk.")])),
 ("Layout parts: build your header in the page editor", "themes", 50, "Assign a header, footer, single or archive part. The theme's own partial stays as the fallback.",
  body("A layout part is a small builder document assigned to a slot.", [("Fallback", "If a part is missing or fails to render, the theme's own markup is used for that request.")])),
 ("No telemetry: every outbound connection, listed", "security", 56, "Update checks, the registry, crawler IP ranges and reverse DNS: what each sends, and how to turn it off.",
  body("The server makes a short, documented list of outbound connections.", [("Each one has a switch", "Updates, the registry and the crawler IP ranges can each be turned off with one setting.")])),
 ("Keep old links working after a move", "migration", 64, "Redirect rules, 301s and the URL audit, for the addresses an import could not map.",
  body("Some old addresses need a rule by hand.", [("Rules", "A redirect is a source, a target and a status. Patterns cover whole folders.")])),
 ("Export and import a whole site", "migration", 72, "A portable archive with content, media and settings, for moving between servers.",
  body("One command writes the whole site to an archive.", [("Restore", "An archive imports into an empty database only, so it never overwrites a live site.")])),
 ("Build your first theme in an afternoon", "themes", 80, "A theme.json, one layout and a stylesheet. Everything else comes from the built-in theme.",
  body("A theme does not have to be complete.", [("The lookup chain", "Every file is looked up in your theme first, then in the built-in theme.")])),
 ("How the page cache decides what to keep", "engineering", 88, "Pages stay ready for fast visits and are cleared by exactly the content changes that affect them.",
  body("The cache stores rendered pages, not database rows.", [("Invalidation", "Saving content clears the pages that show it, and nothing else.")])),
 ("Write a plugin that reacts to a publish", "plugins", 96, "Subscribe to an event, store a row and add an admin page, in under a hundred lines.",
  body("Events are the simplest way in.", [("Subscribe", "Declare the event in the manifest and handle it in one function.")])),
 ("Trust and signing, explained", "security", 104, "The two keys behind every update and package, and what a leaked key could and could not do.",
  body("Signatures are checked before anything runs.", [("Rotation", "A new key ships in a release; old servers keep trusting the old key until they update.")])),
]

now = datetime.datetime.now(datetime.timezone.utc).replace(hour=9, minute=0, second=0, microsecond=0)
for title, cat, days_ago, excerpt, content in POSTS:
    attrs = json.dumps({"content": content, "excerpt": excerpt, "category": dict(CATS)[cat]})
    r = sh(BIN, "entity", "create", "--schema", "post", "--name", title, "--attributes", attrs, "--publish", "--as", EMAIL)
    if r.returncode:
        print("skip", title, r.stderr.strip()[:120]); continue
    eid = json.loads(r.stdout)["id"]
    when = (now - datetime.timedelta(days=days_ago)).isoformat()
    sql(f"update hatamoto_entities set published_at='{when}', created_at='{when}' where id='{eid}'")
    sql(f"insert into hatamoto_entity_terms(entity_id,term_id) select '{eid}', id from hatamoto_terms where kind='category' and slug='{cat}' on conflict do nothing")
    print("post", title)
print("done; restart the server or save any post to clear the page cache")
