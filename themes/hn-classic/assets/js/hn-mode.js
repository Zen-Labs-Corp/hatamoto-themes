/* hn-classic colour mode. Loaded blocking in <head>, so the stored choice is on <html> before the first paint.
   Without JavaScript the page follows the system (prefers-color-scheme) and the footer switch stays hidden. */
(function () {
  var r = document.documentElement, K = 'hn-mode';
  function get() { try { var m = localStorage.getItem(K); return m === 'light' || m === 'dark' ? m : 'auto'; } catch (e) { return 'auto'; } }
  function apply(m) { if (m === 'auto') r.removeAttribute('data-hn-mode'); else r.setAttribute('data-hn-mode', m); }
  function mark(m) {
    var b = document.querySelectorAll('.hn-mode [data-hn-mode-set]');
    for (var i = 0; i < b.length; i++) b[i].setAttribute('aria-pressed', b[i].getAttribute('data-hn-mode-set') === m ? 'true' : 'false');
  }
  apply(get());
  /* the built-in theme's hm.js sets data-theme="dark" from its own stored choice; this theme has its own switch */
  function drop() { if (r.hasAttribute('data-theme')) r.removeAttribute('data-theme'); }
  drop(); new MutationObserver(drop).observe(r, { attributes: true, attributeFilter: ['data-theme'] });
  document.addEventListener('DOMContentLoaded', function () {
    var box = document.querySelector('.hn-mode');
    if (!box) return;
    mark(get());
    box.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-hn-mode-set]');
      if (!t) return;
      var m = t.getAttribute('data-hn-mode-set');
      if (m !== 'light' && m !== 'dark') m = 'auto';
      try { if (m === 'auto') localStorage.removeItem(K); else localStorage.setItem(K, m); } catch (x) {}
      apply(m); mark(m);
    });
    box.hidden = false;
  });
  window.addEventListener('storage', function (e) { if (e.key === K) { var m = get(); apply(m); mark(m); } });
})();
