// Browser smoke test for Hanshi against a running local site.
// Usage: node dev/smoke.mjs [base] [outdir]   (needs playwright-core and Chrome)
// Fails on any console error, CSP violation or failed request, and checks the
// interactive parts: search palette, dark toggle, layout switch, post index, paging keys.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8711';
const OUT = process.argv[3] || '/tmp/hanshi-smoke';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const problems = [];
const ok = (cond, msg) => { if (!cond) problems.push(msg); console.log((cond ? 'ok   ' : 'FAIL ') + msg); };

async function page(w = 1440, h = 1000) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  p.on('console', (m) => { if (m.type() === 'error') problems.push('console: ' + m.text()); });
  p.on('pageerror', (e) => problems.push('pageerror: ' + e.message));
  p.on('requestfailed', (r) => problems.push('requestfailed: ' + r.url()));
  return p;
}

// Home: covers drawn, palette from the feed, layout switch, paging keys.
let p = await page();
await p.goto(BASE + '/');
ok(await p.locator('.hs-cover[data-done] svg.pat').count() >= 5, 'home: pattern covers drawn');
ok(await p.locator('[data-hm-theme-toggle]:not([hidden])').count() === 1, 'home: theme toggle visible');
await p.keyboard.press('/');
await p.waitForSelector('#hs-search[open] a[role=option]');
ok(await p.locator('#hs-search a[role=option]').count() >= 5, 'palette: lists posts from /feed.xml');
await p.keyboard.type('plugin');
await p.waitForTimeout(150);
const first = await p.locator('#hs-search a[role=option]').first().textContent();
ok(/plugin/i.test(first || ''), 'palette: filters as you type (' + (first || '').trim().slice(0, 40) + ')');
ok(await p.locator('#hs-search a[href^="/search?q=plugin"]').count() === 1, 'palette: offers a full search');
await p.screenshot({ path: OUT + '/palette.png' });
await p.keyboard.press('Escape');
await p.click('[data-hs-layout-btn=grid]');
ok(await p.evaluate(() => document.documentElement.getAttribute('data-hs-layout')) === 'grid', 'layout: grid switch');
await p.screenshot({ path: OUT + '/home-grid.png', fullPage: true });
await p.click('[data-hs-layout-btn=list]');
await p.click('[data-hm-theme-toggle]');
ok(await p.evaluate(() => document.documentElement.getAttribute('data-theme')) === 'dark', 'dark: toggle sets data-theme');
await p.reload();
ok(await p.evaluate(() => document.documentElement.getAttribute('data-theme')) === 'dark', 'dark: remembered after reload');
await p.screenshot({ path: OUT + '/home-dark.png', fullPage: true });
await p.click('[data-hm-theme-toggle]');
await p.keyboard.press('ArrowRight');
await p.waitForURL(/page=2/);
ok(true, 'keys: → goes to page 2');

// Visitor preset panel (only when the owner switched it on in Settings).
await p.goto(BASE + '/');
if (await p.locator('.hs-tp-btn:not([hidden])').count()) {
  await p.click('.hs-tp-btn');
  await p.click('[data-hs-pref=accent][data-value=indigo]');
  await p.reload();
  ok(await p.evaluate(() => document.documentElement.getAttribute('data-hs-accent')) === 'indigo', 'panel: accent preset saved and applied before paint');
  await p.click('.hs-tp-btn');
  await Promise.all([p.waitForNavigation(), p.click('[data-hs-reset]')]);
  ok(await p.evaluate(() => document.documentElement.getAttribute('data-hs-accent')) === 'brand', 'panel: reset returns to the owner setting');
} else console.log('skip panel (visitor_panel is off)');

// Post: index, progress, anchors.
await p.goto(BASE + '/blog/move-off-wordpress-without-losing-a-single-url');
ok(await p.locator('.hs-toc a[data-t]').count() >= 5, 'post: index built from the headings');
await p.evaluate(() => document.querySelector('#hs-prose h2:nth-of-type(3)').scrollIntoView());
await p.waitForTimeout(300);
const active = await p.locator('.hs-toc a.is-active').first().textContent();
ok(!!active && active.trim().length > 0, 'post: scroll spy marks "' + (active || '').trim() + '"');
ok(await p.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.hs-progress')).getPropertyValue('--p')) > 0), 'post: reading progress moves');
await p.screenshot({ path: OUT + '/post-mid.png' });

// Mobile post: the index bar.
p = await page(390, 844);
await p.goto(BASE + '/blog/move-off-wordpress-without-losing-a-single-url');
await p.click('#hs-tocm button');
ok(await p.locator('#hs-tocm-panel:not([hidden]) a').count() >= 5, 'mobile: index panel opens');
await p.screenshot({ path: OUT + '/mobile-index.png' });

await browser.close();
if (problems.filter((x) => !x.startsWith('ok')).length) { console.log('\nPROBLEMS:\n' + problems.join('\n')); process.exit(1); }
console.log('\nall good');
