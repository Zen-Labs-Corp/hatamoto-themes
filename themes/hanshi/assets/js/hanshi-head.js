/* Hanshi: runs in <head> before first paint so there is no flash of the wrong colour mode,
   layout or visitor preset. Everything here is optional; without it the page uses the
   owner's settings, which are already on <html>. */
(function () {
  var r = document.documentElement;
  try {
    var m = localStorage.getItem('hm-theme'); /* the engine toggle's key (hm.js) */
    var mode = r.getAttribute('data-hs-mode');
    if (m === 'dark' || (!m && (mode === 'dark' || (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)))) {
      r.setAttribute('data-theme', 'dark');
    }
    var layout = localStorage.getItem('hanshi-layout');
    if (layout === 'list' || layout === 'grid') r.setAttribute('data-hs-layout', layout);
    if (r.hasAttribute('data-hs-panel')) {
      var p = JSON.parse(localStorage.getItem('hanshi-prefs') || '{}'), ok = { accent: 1, type: 1, density: 1, radius: 1 };
      for (var k in p) if (ok[k] && /^[a-z]{2,12}$/.test(p[k])) r.setAttribute('data-hs-' + k, p[k]);
    }
  } catch (e) { /* storage blocked: owner defaults stay */ }
})();
