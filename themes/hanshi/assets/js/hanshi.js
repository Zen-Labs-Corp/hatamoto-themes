/* Hanshi: progressive enhancement. Every page works without this file; it adds the
   pattern covers, the search palette, keyboard paging, the post index (scroll spy and
   reading progress), copy buttons, the list/grid switch and the visitor preset panel.
   No dependencies, no globals, no eval, same-origin requests only (/feed.xml). */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  function store(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* not remembered */ } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* JS-only controls: shown once this file runs */
  $$('[data-hs-js][hidden]').forEach(function (el) { el.hidden = false; });

  /* ------------------------------------------------------------ covers */
  var PATTERNS = ['seigaiha', 'shippo', 'uroko', 'kikko', 'ichimatsu', 'yabane', 'tokusa'];
  var NAMES = { seigaiha: 'Ocean waves', shippo: 'Rings', uroko: 'Scales', kikko: 'Hexagons', ichimatsu: 'Checks', yabane: 'Arrows', tokusa: 'Reeds' };
  var uid = 0;
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rnd(seed) { var s = (seed % 233280) || 7; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function pattern(name, W, H) {
    var id = 'hsp' + (++uid), sw = 'stroke="currentColor" stroke-width="1" fill="none"', tile = '';
    if (name === 'seigaiha') {
      var r = 38, out = '', row = 0;
      for (var y = -r; y < H + r * 2; y += r / 2, row++) for (var x = (row % 2 ? r : 0) - r * 2; x < W + r * 2; x += r * 2)
        for (var k = 4; k >= 1; k--) out += '<circle cx="' + x + '" cy="' + y + '" r="' + (r * k / 4) + '" style="fill:var(--hm-surface)" stroke="currentColor" stroke-width="1"/>';
      return '<svg class="pat" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + out + '</svg>';
    }
    if (name === 'shippo') tile = '<pattern id="' + id + '" width="44" height="44" patternUnits="userSpaceOnUse"><g ' + sw + '><circle r="22"/><circle cx="44" r="22"/><circle cy="44" r="22"/><circle cx="44" cy="44" r="22"/><circle cx="22" cy="22" r="22"/></g></pattern>';
    if (name === 'uroko') tile = '<pattern id="' + id + '" width="40" height="68" patternUnits="userSpaceOnUse"><path d="M0 34L20 0L40 34ZM-20 68L0 34L20 68ZM20 68L40 34L60 68Z" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1"/></pattern>';
    if (name === 'kikko') tile = '<pattern id="' + id + '" width="60" height="34.64" patternUnits="userSpaceOnUse"><path d="M0 17.32L10 0H30L40 17.32L30 34.64H10ZM40 17.32H60" ' + sw + '/><path d="M20 9l8 8.3-8 8.3-8-8.3z" ' + sw + ' stroke-opacity=".5"/></pattern>';
    if (name === 'ichimatsu') tile = '<pattern id="' + id + '" width="48" height="48" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="currentColor" fill-opacity=".12"/><rect x="24" y="24" width="24" height="24" fill="currentColor" fill-opacity=".12"/><path d="M0 24H48M24 0V48" ' + sw + ' stroke-opacity=".5"/></pattern>';
    if (name === 'yabane') tile = '<pattern id="' + id + '" width="36" height="44" patternUnits="userSpaceOnUse"><path d="M0 0L18 14L36 0M0 22L18 36L36 22M18 14V36" ' + sw + '/><path d="M0 0V44M36 0V44" ' + sw + ' stroke-opacity=".35"/></pattern>';
    if (name === 'tokusa') tile = '<pattern id="' + id + '" width="36" height="12" patternUnits="userSpaceOnUse"><path d="M2 0V12M6 0V12M8.5 0V12M17 0V12M25 0V12M27 0V12" ' + sw + '/></pattern>';
    return '<svg class="pat" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' + tile + '</defs><rect width="100%" height="100%" fill="url(#' + id + ')"/></svg>';
  }
  function cover(el) {
    if (el.getAttribute('data-done')) return;
    el.setAttribute('data-done', '1');
    var cat = el.getAttribute('data-cat') || '', key = cat || el.getAttribute('data-key') || 'post';
    var pat = PATTERNS[hash(key.toLowerCase()) % PATTERNS.length];
    var R = rnd((+el.getAttribute('data-seed') || 7) * 31 + hash(key) % 97);
    var size = 30 + Math.round(R() * 22), x = 8 + R() * 62, y = 8 + R() * (84 - size);
    var no = el.getAttribute('data-no');
    el.innerHTML = pattern(pat, 600, 380) +
      '<span class="sun" style="height:' + size + '%;aspect-ratio:1;left:' + x + '%;top:' + y + '%"></span>' +
      '<span class="tag">' + (no && no !== '0' ? '<span>No. ' + esc(String(no).padStart(3, '0')) + '</span>' : '') + (cat ? '<span>' + esc(cat) + '</span>' : '') + '<span>' + NAMES[pat] + '</span></span>';
  }
  $$('[data-hs-cover]').forEach(cover);

  /* ------------------------------------------------------------- toast/copy */
  var toastTimer;
  function toast(msg) {
    var t = $('.hs-toast');
    if (!t) { t = doc.createElement('div'); t.className = 'hs-toast'; t.setAttribute('role', 'status'); doc.body.appendChild(t); }
    t.textContent = msg; t.classList.add('on'); clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('on'); }, 1800);
  }
  function copy(text, msg) {
    var done = function () { toast(msg); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done); else done();
  }
  doc.addEventListener('click', function (e) {
    var c = e.target.closest('[data-hs-copy]');
    if (!c) return;
    e.preventDefault();
    var kind = c.getAttribute('data-hs-copy');
    if (kind === 'url') copy(location.href.split('#')[0], 'Link copied');
    else if (kind === 'feed') copy(location.origin + '/feed.xml', 'Feed address copied');
  });

  /* ---------------------------------------------------------- list / grid */
  function setLayout(v) {
    root.setAttribute('data-hs-layout', v); store('hanshi-layout', v);
    $$('[data-hs-layout-btn]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-hs-layout-btn') === v)); });
  }
  $$('[data-hs-layout-btn]').forEach(function (b) {
    b.setAttribute('aria-pressed', String(b.getAttribute('data-hs-layout-btn') === root.getAttribute('data-hs-layout')));
    b.addEventListener('click', function () { setLayout(b.getAttribute('data-hs-layout-btn')); });
  });

  /* ------------------------------------------------------- search palette */
  var dlg = $('#hs-search'), input, list, items = [], sel = 0, feed = null, loading = false;
  function loadFeed(cb) {
    if (feed || loading) { cb(); return; }
    loading = true;
    fetch('/feed.xml', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.text() : ''; }).then(function (xml) {
      var d = new DOMParser().parseFromString(xml, 'application/xml');
      feed = Array.prototype.slice.call(d.querySelectorAll('item')).map(function (it) {
        var g = function (n) { var x = it.getElementsByTagName(n)[0]; return x ? x.textContent : ''; };
        var url = g('link'); try { var u = new URL(url); if (u.origin !== location.origin) url = ''; else url = u.pathname + u.search; } catch (e) { url = ''; }
        return { t: g('title'), u: url, c: g('category'), d: g('pubDate') };
      }).filter(function (x) { return x.t && x.u; });
    }).catch(function () { feed = []; }).then(function () { loading = false; cb(); });
  }
  function hl(s, q) {
    if (!q) return esc(s);
    var i = s.toLowerCase().indexOf(q.toLowerCase());
    return i < 0 ? esc(s) : esc(s.slice(0, i)) + '<mark>' + esc(s.slice(i, i + q.length)) + '</mark>' + esc(s.slice(i + q.length));
  }
  function render() {
    var q = input.value.trim(), ql = q.toLowerCase(), html = '';
    items = (feed || []).filter(function (x) { return !q || (x.t + ' ' + x.c).toLowerCase().indexOf(ql) > -1; }).slice(0, 8);
    if (items.length) html += '<li class="hs-pal__group" role="presentation">' + (q ? 'Recent posts' : 'Latest posts') + '</li>';
    items.forEach(function (x, i) {
      var d = x.d ? new Date(x.d) : null;
      html += '<li role="presentation"><a role="option" href="' + esc(x.u) + '" data-i="' + i + '"><span class="hs-pal__ic">' + (i + 1) + '</span><span>' + hl(x.t, q) + '</span><small>' + (d && !isNaN(d) ? d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '') + '</small></a></li>';
    });
    if (q) html += '<li role="presentation"><a role="option" href="/search?q=' + encodeURIComponent(q) + '" data-i="' + items.length + '"><span class="hs-pal__ic">→</span><span>Search everything for &ldquo;' + esc(q) + '&rdquo;</span><small>Enter</small></a></li>';
    if (!html) html = '<li class="hs-pal__empty">' + (loading ? 'Loading…' : 'Type to search.') + '</li>';
    list.innerHTML = html;
    var max = $$('a[role=option]', list).length - 1;
    sel = Math.max(0, Math.min(sel, max)); mark();
  }
  function mark() { $$('a[role=option]', list).forEach(function (a) { var on = +a.getAttribute('data-i') === sel; a.setAttribute('aria-selected', String(on)); if (on) a.scrollIntoView({ block: 'nearest' }); }); }
  function openSearch(e) {
    if (!dlg || typeof dlg.showModal !== 'function') return; /* falls back to the /search link */
    if (e) e.preventDefault();
    dlg.showModal(); input.value = ''; sel = 0; render(); input.focus();
    loadFeed(render);
  }
  if (dlg) {
    input = $('input', dlg); list = $('ul', dlg);
    input.addEventListener('input', function () { sel = 0; render(); });
    input.addEventListener('keydown', function (e) {
      var opts = $$('a[role=option]', list);
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % Math.max(opts.length, 1); mark(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + opts.length) % Math.max(opts.length, 1); mark(); }
      else if (e.key === 'Enter' && opts[sel]) { e.preventDefault(); location.href = opts[sel].getAttribute('href'); }
      else if (e.key === 'Escape') { e.preventDefault(); dlg.close(); }
    });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    $$('[data-hs-search]').forEach(function (b) { b.addEventListener('click', openSearch); });
  }

  /* ----------------------------------------------------------- preset panel */
  var tpBtn = $('.hs-tp-btn'), tp = $('#hs-tp');
  function prefs() { try { return JSON.parse(localStorage.getItem('hanshi-prefs') || '{}'); } catch (e) { return {}; } }
  function markPrefs() { $$('[data-hs-pref]').forEach(function (b) { b.setAttribute('aria-pressed', String(root.getAttribute('data-hs-' + b.getAttribute('data-hs-pref')) === b.getAttribute('data-value'))); }); }
  function panel(open) { if (!tp) return; tp.hidden = !open; tpBtn.setAttribute('aria-expanded', String(open)); }
  if (tp && tpBtn) {
    markPrefs();
    tpBtn.addEventListener('click', function () { panel(tp.hidden); });
    tp.addEventListener('click', function (e) {
      var b = e.target.closest('[data-hs-pref]');
      if (b) { var p = prefs(), k = b.getAttribute('data-hs-pref'), v = b.getAttribute('data-value'); p[k] = v; store('hanshi-prefs', JSON.stringify(p)); root.setAttribute('data-hs-' + k, v); markPrefs(); }
      if (e.target.closest('[data-hs-reset]')) { store('hanshi-prefs', null); location.reload(); }
    });
    doc.addEventListener('click', function (e) { if (!tp.hidden && !tp.contains(e.target) && !tpBtn.contains(e.target)) panel(false); });
  }

  /* ------------------------------------------------------------------ keys */
  function typing(e) { var t = e.target; return t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName); }
  doc.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && dlg) { openSearch(e); return; }
    if (typing(e) || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === '/' && dlg) openSearch(e);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      var l = $(e.key === 'ArrowLeft' ? '[data-hs-prev]' : '[data-hs-next]');
      if (l && l.href) location.href = l.href;
    } else if (e.key === 'j' || e.key === 'k') {
      var rows = $$('.hs-lead, .hs-row > a'); if (!rows.length) return;
      var i = rows.indexOf(doc.activeElement);
      i = e.key === 'j' ? Math.min(i + 1, rows.length - 1) : Math.max(i - 1, 0);
      rows[i].focus(); rows[i].scrollIntoView({ block: 'center' });
    } else if (e.key === 'Escape') panel(false);
  });

  /* ---------------------------------------------------------------- reveal */
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    $$('.hs-reveal').forEach(function (x) { x.classList.add('hs-reveal--on'); io.observe(x); });
  }

  /* ------------------------------------------------------------ post index */
  var prose = $('#hs-prose');
  if (prose) {
    var hs = $$('h2[id], h3[id]', prose), links = $$('.hs-toc a[data-t], .hs-tocm a[data-t]');
    var bar = $('.hs-header .hs-progress'), mins = +prose.getAttribute('data-hs-minutes') || 0, cur = null;
    var h2count = hs.filter(function (h) { return h.tagName === 'H2'; }).length;
    var top = function (el) { return el.getBoundingClientRect().top + window.scrollY; };
    hs.forEach(function (h) {
      var a = doc.createElement('a'); a.className = 'hs-anchor'; a.href = '#' + h.id; a.textContent = '#'; a.setAttribute('aria-label', 'Link to this section'); h.appendChild(a);
    });
    var tick = function () {
      var start = top(prose), end = start + prose.offsetHeight - window.innerHeight * 0.6;
      var p = Math.max(0, Math.min(1, (window.scrollY - start + window.innerHeight * 0.3) / Math.max(end - start, 1)));
      if (bar) bar.style.setProperty('--p', p);
      var tb = $('#hs-toc-bar'); if (tb) tb.style.setProperty('--p', p);
      var pct = $('#hs-toc-pct'); if (pct) pct.textContent = Math.round(p * 100) + '%';
      var left = $('#hs-toc-left'); if (left && mins) left.textContent = p > 0.98 ? 'Finished' : Math.max(1, Math.ceil(mins * (1 - p))) + ' min left';
      if (!hs.length) return;
      var line = window.scrollY + window.innerHeight * 0.28, active = hs[0];
      hs.forEach(function (h) { if (top(h) <= line) active = h; });
      hs.forEach(function (h, i) {
        var s = top(h), e = hs[i + 1] ? top(hs[i + 1]) : start + prose.offsetHeight;
        var f = Math.max(0, Math.min(1, (line - s) / Math.max(e - s, 1)));
        links.forEach(function (l) { if (l.getAttribute('data-t') === h.id) { l.style.setProperty('--f', f); l.classList.toggle('is-read', f >= 1); l.classList.toggle('is-active', h === active); } });
      });
      if (active !== cur) {
        cur = active;
        var idx = hs.indexOf(active), h2 = active;
        while (idx > 0 && h2.tagName !== 'H2') h2 = hs[--idx];
        var n = hs.filter(function (h) { return h.tagName === 'H2'; }).indexOf(h2) + 1;
        var num = String(Math.max(n, 1)).padStart(2, '0');
        var c = $('#hs-toc-count'); if (c) c.textContent = num + ' / ' + String(h2count).padStart(2, '0');
        var mn = $('#hs-tocm-n'); if (mn) mn.textContent = num;
        var mt = $('#hs-tocm-t'); if (mt) mt.textContent = h2.firstChild ? h2.firstChild.textContent : h2.textContent;
      }
    };
    var raf = 0;
    window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; tick(); }); }, { passive: true });
    window.addEventListener('resize', tick); tick();
    var cc = $('#hs-toc-copy'); if (cc) cc.addEventListener('click', function () { if (cur) copy(location.href.split('#')[0] + '#' + cur.id, 'Section link copied'); });
    var m = $('#hs-tocm');
    if (m) {
      var mb = $('button', m), mp = $('#hs-tocm-panel');
      var setOpen = function (o) { mp.hidden = !o; mb.setAttribute('aria-expanded', String(o)); m.toggleAttribute('data-open', o); };
      mb.addEventListener('click', function () { setOpen(mp.hidden); });
      mp.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    }
  }
})();
