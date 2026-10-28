# Site types

Each folder holds `seed.json`, the sample content `scripts/dev-site.sh` puts on a
fresh local site so a theme is designed and checked against realistic pages. A
theme picks its type in `themes/<name>/dev/site-type`; `themes/<name>/dev/seed.json`,
when present, replaces the type's seed for that theme.

| Type | The sample site | Pages it exercises |
|---|---|---|
| `business` | an advisory firm | section-built home, services with pricing, about with team, contact, posts |
| `blog` | a travel and food journal | 10 posts in 5 categories, long-form typography, archive, category, author, search |
| `portfolio` | a graphic designer | a `project` content type at `/work`, case studies with images, about, contact |
| `docs` | a CLI tool's documentation | a `doc` content type at `/docs`, nested sidebar menu, code, tables, prev/next |
| `landing` | a SaaS product | one long page: hero, logos, bento features, steps, stats, pricing, FAQ, CTA |
| `restaurant` | a harbour osteria | menu, opening hours, booking, team, news |

## Format

```jsonc
{
  "owner": {"email": "...", "name": "...", "password": "..."},   // the sign-in --serve prints
  "site": {"name": "...", "tagline": "...", "colour": "#1f5f8b"}, // setup wizard + primary colour
  "media": [                                                   // generated PNGs, uploaded to the library;
    {"name": "hero.png", "w": 1600, "h": 1000,                 // "{{media:hero.png}}" anywhere below
     "colours": ["#a", "#b", "#c"], "style": "arcs"}           // becomes its URL. style: arcs, dots,
  ],                                                           // stripes, grid
  "schemas": [                                                 // extra content types (copy the fields
    {"slug": "doc", "name": "Doc", "like": "page",             // of "like"); settings = routing
     "settings": {"url_pattern": "/docs/{slug}", "archive_path": "/docs"}}
  ],
  "categories": [{"slug": "news", "name": "News"}],
  "pages": [
    {"home": true, "name": "Home", "sections": [               // the homepage
      {"id": "hero", "type": "hero", "content": {...}}         // any section of the built-in library;
    ]},                                                        // fields: its schemas/<type>.json
    {"slug": "about", "name": "About", "description": "...",
     "sections": [...]}                                        // or "content": "<p>html</p>"
  ],
  "posts": [{"name": "...", "days_ago": 3, "category": "News", "category_slug": "news",
             "excerpt": "...", "featured_image": "{{media:x.png}}", "content": "<p>...</p>"}],
  "entries": {"doc": [{"name": "...", "slug": "...", "content": "...", "parent": "<slug>"}]},
  "menus": {                                                   // header, footer, sidebar
    "header": [{"label": "...", "page": "<slug>"},             // page, archive (schema slug), url
               {"label": "...", "archive": "post"},
               {"label": "...", "url": "/x", "children": [...]}]
  },
  "screenshot": "/",                                           // the registry preview (1440x900)
  "shots": [{"name": "home", "path": "/"},                     // checked and shot at desktop + mobile
            {"name": "not-found", "path": "/nope", "status": 404}]
}
```

All content is invented for the sample (names, companies, addresses on reserved
example domains and numbers). Images are generated, so nothing is fetched and
nothing needs a licence.
