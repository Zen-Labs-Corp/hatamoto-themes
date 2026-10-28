/* Runs in <head> before the first paint, so there is no flash of the wrong
   colour mode. Without it the page uses the owner's setting, already on <html>. */
(function () {
  var r = document.documentElement;
  try {
    var m = localStorage.getItem('hm-theme'); /* the engine toggle's key (hm.js) */
    var mode = r.getAttribute('data-__P__-mode');
    if (m === 'dark' || (!m && (mode === 'dark' || (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)))) {
      r.setAttribute('data-theme', 'dark');
    }
  } catch (e) { /* storage blocked: the owner's default stays */ }
})();
