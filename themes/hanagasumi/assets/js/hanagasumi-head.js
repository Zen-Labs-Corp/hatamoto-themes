/* Runs in <head> before the first paint, so there is no flash of the wrong
   colour mode. Without it (no script, or script blocked) the CSS follows the
   owner's setting on <html> (data-hg-mode); only a visitor's saved choice and
   the system's dark preference need this script. */
(function () {
  var r = document.documentElement;
  r.setAttribute('data-hg-js', ''); /* from here the engine toggle owns data-theme; the CSS no-JS fallback stands down */
  var mode = r.getAttribute('data-hg-mode');
  var m = null;
  try { m = localStorage.getItem('hm-theme'); } catch (e) { /* storage blocked: no saved choice */ } /* the engine toggle's key (hm.js) */
  if (m === 'dark' || (!m && (mode === 'dark' || (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)))) {
    r.setAttribute('data-theme', 'dark');
  } else if (m === 'light') {
    r.setAttribute('data-theme', 'light');
  }
})();
