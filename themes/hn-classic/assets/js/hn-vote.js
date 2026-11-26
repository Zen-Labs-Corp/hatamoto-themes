/* hn-classic: votes without leaving the page. The arrow hides in place and the list keeps its order;
   points update on the next load. Without fetch, or on any error, the form posts as usual. */
(function () {
  if (!window.fetch) return;
  var d = document;
  function isUn(f) { var h = f.querySelector('[name=how]'); return (h && h.value === 'un') || /[?&]how=un/.test(f.getAttribute('action')); }
  function add(at, id, story, cell) {           /* insert ' | <form>unvote</form>' after node at */
    var f = d.createElement('form'), b = d.createElement('button'), i;
    f.method = 'post';
    f.action = story ? '/p/hn/vote/story/' + id + '?how=un' : '/p/hn/vote/comment/' + id;
    f.className = (story ? 'hn-act' : 'hn-inline') + ' hn-un';
    i = d.createElement('input'); i.type = 'hidden'; i.name = 'how'; i.value = 'un'; f.appendChild(i);
    i = d.createElement('input'); i.type = 'hidden'; i.name = 'next';
    i.value = location.pathname + location.search + (story ? '' : '#comment-' + id); f.appendChild(i);
    b.type = 'submit'; b.className = story ? 'hn-unvote' : 'hn-linkbtn'; b.textContent = 'unvote'; f.appendChild(b);
    f._c = cell;
    at.parentNode.insertBefore(f, at.nextSibling);
    at.parentNode.insertBefore(d.createTextNode(' | '), f);
    b.focus({ preventScroll: true });
  }
  function done(f, cell, voted) {
    var m, row, s, a, h, t, p;
    if (!voted) {
      if (cell) { cell.classList.remove('hn-voted'); t = cell.querySelector('button[title]'); if (t) t.focus({ preventScroll: true }); }
      p = f.previousSibling; if (p && p.nodeType === 3 && p.data === ' | ') p.parentNode.removeChild(p);
      f.parentNode.removeChild(f); return;
    }
    if (!cell) return;
    cell.classList.add('hn-voted');
    m = /^\/p\/hn\/vote\/(story|comment)\/([^/?#]+)/.exec(f.getAttribute('action'));
    if (!m) return;
    if (m[1] === 'story') {
      row = cell.closest('.hn-story'); s = row && row.querySelector('.hn-sub');
      if (s && !s.querySelector('.hn-unvote')) { a = s.querySelector('a.hn-user'); a = a && (a.nextElementSibling || a); if (a || s.lastChild) add(a || s.lastChild, m[2], true, cell); }
    } else if (cell.parentNode.classList.contains('hn-c-row')) {     /* theme comment rows only */
      h = cell.parentNode.querySelector('.hn-head'); t = h && h.querySelector('time');
      if (h && !h.querySelector('.hn-un') && (t || h.lastChild)) add(t ? t.parentNode : h.lastChild, m[2], false, cell);
    }
  }
  d.addEventListener('submit', function (e) {
    var f = e.target, a = f.getAttribute('action') || '', cell;
    if (e.defaultPrevented || a.indexOf('/p/hn/vote/') !== 0) return;
    if (!f.classList.contains('hn-vote-form') && !(isUn(f) && (f._c || a.indexOf('/p/hn/vote/story/') === 0))) return;
    e.preventDefault();
    if (f._busy) return;
    f._busy = 1; cell = f._c || f.closest('.hn-vote-cell, .hn-vote');
    fetch(a, { method: 'POST', credentials: 'same-origin', headers: { Accept: 'application/json' }, body: new URLSearchParams(new FormData(f)) })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { return !!j && typeof j.voted === 'boolean' && !('error' in j) && j; },
            function () { return false; })
      .then(function (j) { f._busy = 0; if (!j) { f.submit(); return; } done(f, cell, j.voted); });
  }, false);
})();
