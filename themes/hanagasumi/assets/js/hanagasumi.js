/* Hanagasumi: progressive enhancement. Every page works without this file; it adds the
   story rail's previous/next buttons and progress marks. No dependencies, no globals,
   no network, no animation (the rail moves instantly). */
(function () {
  'use strict';
  var doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };

  /* JS-only controls: shown once this file runs */
  $$('[data-hg-js][hidden]').forEach(function (el) { el.hidden = false; });

  /* Escape closes an open submenu (it opens on hover or focus, which a keyboard or
     pointer user could not otherwise dismiss); the next hover or focus reopens it */
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var item = doc.activeElement && doc.activeElement.closest('.hg-nav__item');
    if (!item || !$('.hg-nav__sub', item)) return;
    item.classList.add('is-dismissed');
    var a = $('a, [tabindex]', item);
    if (a) a.focus();
  });
  doc.addEventListener('focusin', function (e) { var d = $('.is-dismissed'); if (d && d !== e.target.closest('.hg-nav__item')) d.classList.remove('is-dismissed'); });
  doc.addEventListener('mouseover', function (e) { var d = $('.is-dismissed'); if (d && d !== e.target.closest('.hg-nav__item')) d.classList.remove('is-dismissed'); });

  /* ---------------------------------------------------------------- rail */
  var track = $('[data-hg-track]');
  if (track) {
    var stage = track.closest('.hg-stage') || doc;
    var prev = $('[data-hg-prev]', stage), next = $('[data-hg-next]', stage);
    var marks = $$('[data-hg-progress] b', stage);
    var ticking = false;

    var update = function () {
      ticking = false;
      var max = track.scrollWidth - track.clientWidth;
      var at = max > 0 ? Math.min(Math.max(track.scrollLeft / max, 0), 1) : 0;
      var on = Math.round(at * (marks.length - 1));
      marks.forEach(function (m, i) { m.classList.toggle('is-on', i === on); });
      if (prev) prev.disabled = track.scrollLeft <= 1;
      if (next) next.disabled = track.scrollLeft >= max - 1;
    };
    var queue = function () { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } };
    var step = function (dir) { track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: 'auto' }); };

    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
    track.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
    update();
  }

  /* ------------------------------------------------- post contents spy */
  var toc = $('.hg-toc');
  var prose = $('.hg-prose');
  if (toc && prose && !window.matchMedia('(max-width: 1080px)').matches) {
    var links = $$('a[data-hg-toc]', toc);
    var heads = links.map(function (a) { return doc.getElementById(a.getAttribute('data-hg-toc')); });
    var spyTick = false;
    var spy = function () {
      spyTick = false;
      var cur = -1;
      heads.forEach(function (h, i) { if (h && h.getBoundingClientRect().top <= 140) cur = i; });
      links.forEach(function (a, i) {
        a.classList.toggle('is-active', i === cur);
        if (i === cur) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    };
    window.addEventListener('scroll', function () { if (!spyTick) { spyTick = true; window.requestAnimationFrame(spy); } }, { passive: true });
    spy();
  }

  /* --------------------------------------------------------- copy link */
  $$('[data-hg-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var url = location.href.split('#')[0];
      var done = function () { btn.setAttribute('aria-label', 'Link copied'); btn.title = 'Link copied'; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () {});
    });
  });
})();
