// shoot.mjs - browser checks and screenshots of a seeded local site.
//
// Usage: node scripts/shoot.mjs --base URL --seed site-types/<type>/seed.json --out DIR
//                               [--screenshot themes/<name>/assets/screenshot.png]
//
// For every entry of the seed's "shots" it loads the page at desktop (1440x900)
// and mobile (390x844) size, saves a full-page PNG of each to DIR, and fails
// (exit 1) on:
//   - a status other than the expected one (default 200)
//   - a console error, an uncaught page error, a failed request or a
//     subresource that answers 4xx/5xx
//   - a Content-Security-Policy violation
//   - any request to another host (themes must be self-contained)
//   - an image that did not load
//   - a page wider than the mobile viewport (horizontal scrolling)
//   - a missing <html lang>, <title> or <main> (a page without exactly one
//     <h1> is a warning)
// --screenshot writes the registry preview: the seed's "screenshot" page at
// 1440x900 (viewport only, not the full page), PNG, checked against the
// registry limits (at most 2 MiB).
// Needs playwright-core (npm ci in scripts/) and Chrome (CHROME, default
// /usr/bin/google-chrome).
import { chromium } from 'playwright-core';
import { mkdirSync, readFileSync, statSync } from 'node:fs';

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => {
  if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]);
  return acc;
}, []));
if (!args.base || !args.seed || !args.out) {
  console.error('usage: node scripts/shoot.mjs --base URL --seed FILE --out DIR [--screenshot FILE]');
  process.exit(64);
}
const BASE = String(args.base).replace(/\/$/, '');
const origin = new URL(BASE).origin;
const seed = JSON.parse(readFileSync(args.seed, 'utf8'));
mkdirSync(args.out, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROME || '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--font-render-hinting=none'],
});
const problems = [];
const fail = (where, msg) => { problems.push(`${where}: ${msg}`); console.log(`FAIL ${where}: ${msg}`); };

async function visit(shot, vp, label) {
  const where = `${shot.name} ${label}`;
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, colorScheme: 'light' });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
  });
  // "Failed to load resource" is the console echo of an HTTP error; the
  // response check below reports it once, with the URL (and skips the expected
  // status of the document itself, e.g. the 404 page).
  page.on('console', (m) => {
    if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) fail(where, 'console: ' + m.text().slice(0, 200));
  });
  page.on('response', (r) => {
    if (r.request().isNavigationRequest() && r.request().frame() === page.mainFrame()) return;
    if (r.status() >= 400) fail(where, `HTTP ${r.status()}: ${r.url()}`);
  });
  page.on('pageerror', (e) => fail(where, 'page error: ' + e.message.slice(0, 200)));
  page.on('requestfailed', (r) => fail(where, 'request failed: ' + r.url() + ' ' + (r.failure()?.errorText || '')));
  page.on('request', (r) => {
    const u = r.url();
    if (u.startsWith('data:') || u.startsWith('blob:') || u.startsWith('about:')) return;
    if (new URL(u).origin !== origin) fail(where, 'remote request: ' + u);
  });
  const resp = await page.goto(BASE + shot.path, { waitUntil: 'networkidle' });
  const want = shot.status || 200;
  if (!resp || resp.status() !== want) fail(where, `status ${resp && resp.status()}, want ${want}`);
  await page.evaluate(() => document.fonts && document.fonts.ready);
  const facts = await page.evaluate(() => ({
    lang: document.documentElement.getAttribute('lang') || '',
    title: document.title || '',
    h1: document.querySelectorAll('h1').length,
    main: document.querySelectorAll('main').length,
    broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map((i) => i.getAttribute('src')),
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    csp: window.__csp || [],
  }));
  if (!facts.lang) fail(where, '<html> has no lang');
  if (!facts.title) fail(where, 'no <title>');
  if (facts.main < 1) fail(where, 'no <main> element');
  // Content decides the h1 (a page whose first section is not a hero may have
  // none), so this one is a warning for the theme author, not a failure.
  if (facts.h1 !== 1 && want === 200) console.log(`WARN ${where}: ${facts.h1} <h1> elements (want 1; does the layout print the title when the content has none?)`);
  for (const b of facts.broken) fail(where, 'image did not load: ' + b);
  for (const c of facts.csp) fail(where, 'CSP violation: ' + c);
  if (vp.width < 600 && facts.overflow > 1) fail(where, `page is ${facts.overflow}px wider than the screen`);
  await page.screenshot({ path: `${args.out}/${shot.name}-${label}.png`, fullPage: true });
  console.log(`ok   ${where} (${BASE}${shot.path})`);
  await ctx.close();
}

for (const shot of seed.shots || []) {
  await visit(shot, { width: 1440, height: 900 }, 'desktop');
  await visit(shot, { width: 390, height: 844 }, 'mobile');
}

if (args.screenshot) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light' });
  const page = await ctx.newPage();
  await page.goto(BASE + (seed.screenshot || '/'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.screenshot({ path: args.screenshot, fullPage: false });
  const size = statSync(args.screenshot).size;
  if (size > 2 * 1024 * 1024) fail('screenshot', `${size} bytes, the registry allows 2 MiB`);
  else console.log(`ok   screenshot ${args.screenshot} (1440x900, ${size} bytes)`);
  await ctx.close();
}

await browser.close();
console.log(problems.length ? `shoot: ${problems.length} problem(s)` : `shoot: OK (${(seed.shots || []).length} pages, shots in ${args.out})`);
process.exit(problems.length ? 1 : 0);
