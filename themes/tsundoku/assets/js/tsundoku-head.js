/* Runs in <head> before the first paint, so there is no flash of the wrong
   colour mode. Without it (no script, or script blocked) the CSS follows the
   owner's setting on <html> (data-tk-mode); only a visitor's saved choice and
   the system's dark preference need this script. */
(function () {
  var r = document.documentElement;
  r.setAttribute('data-tk-js', ''); /* from here the engine toggle owns data-theme; the CSS no-JS fallback stands down */
  var mode = r.getAttribute('data-tk-mode');
  var m = null;
  try { m = localStorage.getItem('hm-theme'); } catch (e) { /* storage blocked: no saved choice */ } /* the engine toggle's key (hm.js) */
  if (m === 'dark' || (!m && (mode === 'dark' || (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)))) {
    r.setAttribute('data-theme', 'dark');
  } else {
    r.setAttribute('data-theme', 'light'); /* explicit light beats the owner's dark default after a saved light choice */
  }
})();
