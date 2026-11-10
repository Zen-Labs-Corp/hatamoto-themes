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
})();
