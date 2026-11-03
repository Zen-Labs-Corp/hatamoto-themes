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

  /* ------------------------------------------------------------------ reveal */
  if ('IntersectionObserver' in window && !calm) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.kz-row').forEach(function (x) { x.classList.add('kz-reveal'); io.observe(x); });
  }
})();
