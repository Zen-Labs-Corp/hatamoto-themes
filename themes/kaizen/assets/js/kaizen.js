/* Kaizen: colour-mode toggles, condensing bar, scroll progress, nav highlight,
   footer clock and viewport, row reveal. Everything works without it. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------ colour mode */
  var toggles = $$('[data-kz-theme-toggle]');
  function sync() {
    var dark = root.getAttribute('data-theme') !== 'light';
    toggles.forEach(function (b) {
      b.setAttribute('aria-pressed', dark ? 'true' : 'false');
      b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }
  function setMode(dark) {
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    try { localStorage.setItem('hm-theme', dark ? 'dark' : 'light'); } catch (e) { /* not remembered */ }
    sync();
  }
  toggles.forEach(function (b) {
    b.hidden = false;
    b.addEventListener('click', function () {
      var dark = root.getAttribute('data-theme') === 'light';
      if (doc.startViewTransition && !calm) doc.startViewTransition(function () { setMode(dark); });
      else setMode(dark);
    });
  });
  sync();

  /* ------------------------------------------- condensed bar and progress */
  var bar = $('.kz-bar'), prog = $('.kz-progress'), raf = 0;
  function onScroll() {
    raf = 0;
    if (bar) bar.classList.toggle('is-condensed', window.scrollY > 40);
    if (prog) {
      var max = root.scrollHeight - window.innerHeight;
      prog.style.setProperty('--p', max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    }
  }
  window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(onScroll); }, { passive: true });
  onScroll();

  /* ---------------------------------------------------- sliding nav highlight */
  var nav = $('.kz-nav'), hl = nav && $('.kz-hl', nav);
  if (nav && hl) {
    var place = function (a) {
      if (!a) { nav.classList.remove('is-hot'); return; }
      var n = nav.getBoundingClientRect(), r = a.getBoundingClientRect();
      hl.style.width = r.width + 'px';
      hl.style.height = r.height + 'px';
      hl.style.transform = 'translate(' + (r.left - n.left) + 'px,' + (r.top - n.top) + 'px)';
      nav.classList.add('is-hot');
    };
    $$('a', nav).forEach(function (a) {
      a.addEventListener('mouseenter', function () { place(a); });
      a.addEventListener('focus', function () { place(a); });
    });
    nav.addEventListener('mouseleave', function () { place(null); });
    nav.addEventListener('focusout', function () { place(null); });
  }

  /* ------------------------------------------------ footer clock, viewport */
  $$('[data-kz-js]').forEach(function (c) { c.hidden = false; });
  var clock = $('[data-kz-clock]'), vp = $('[data-kz-vp]');
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function tick() { var d = new Date(); clock.textContent = two(d.getHours()) + ':' + two(d.getMinutes()) + ':' + two(d.getSeconds()); }
  if (clock) { tick(); setInterval(tick, 1000); }
  function size() { if (vp) vp.textContent = window.innerWidth + '\u00d7' + window.innerHeight; }
  if (vp) { size(); window.addEventListener('resize', size); }

  /* ------------------------------------------------ post: contents and read % */
  var prose = $('#kz-prose'), tocNav = $('#kz-toc');
  if (prose && tocNav) {
    var heads = $$('h2[id], h3[id]', prose), links = $$('a[data-t]', tocNav);
    var pct = $('#kz-toc-pct'), fill = $('#kz-toc-bar'), cur = null, tick2 = 0;
    var spy = function () {
      tick2 = 0;
      var r = prose.getBoundingClientRect();
      var v = Math.min(1, Math.max(0, (window.innerHeight * 0.4 - r.top) / r.height));
      if (pct) pct.textContent = Math.round(v * 100) + '%';
      if (fill) fill.style.setProperty('--rp', v);
      var id = null;
      heads.forEach(function (h) { if (h.getBoundingClientRect().top < window.innerHeight * 0.3) id = h.id; });
      if (id === cur) return;
      cur = id;
      links.forEach(function (l) {
        var on = l.getAttribute('data-t') === id;
        l.classList.toggle('is-active', on);
        if (on) l.setAttribute('aria-current', 'location'); else l.removeAttribute('aria-current');
      });
    };
    var queue = function () { if (!tick2) tick2 = requestAnimationFrame(spy); };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    spy();
  }

  /* ------------------------------------------------------------------ reveal
     Armed on the first scroll, and only for rows still below the fold, so a page
     that is printed, captured or never scrolled shows every row. */
  if ('IntersectionObserver' in window && !calm) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    var arm = function () {
      window.removeEventListener('scroll', arm);
      $$('.kz-row').forEach(function (x) {
        if (x.getBoundingClientRect().top > window.innerHeight) { x.classList.add('kz-reveal'); io.observe(x); }
      });
    };
    window.addEventListener('scroll', arm, { passive: true });
  }
})();
