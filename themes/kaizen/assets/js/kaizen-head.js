/* Runs in <head> before the first paint, so there is no flash of the wrong
   colour mode. Dark is the default: the owner's setting (data-kz-mode on <html>)
   applies until the visitor picks a mode with a toggle (stored as hm-theme).
   It also adds the js class: content is only ever hidden for reveal under it. */
(function () {
  var r = document.documentElement;
  r.classList.add('js');
  var dark = true;
  try {
    var s = localStorage.getItem('hm-theme'); /* the engine toggle's key (hm.js) */
    var m = r.getAttribute('data-kz-mode');
    if (s === 'dark') dark = true;
    else if (s === 'light') dark = false;
    else if (m === 'light') dark = false;
    else if (m === 'auto') dark = !window.matchMedia('(prefers-color-scheme: light)').matches;
  } catch (e) { /* storage blocked: the owner's default stays */ }
  r.setAttribute('data-theme', dark ? 'dark' : 'light');
})();
