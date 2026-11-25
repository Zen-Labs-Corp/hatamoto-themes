# Changelog

## 1.1.1

- The hn user bar (your name, karma and logout, or login) now renders inside the header bar on the server, without JavaScript, on desktop and phones, in light and dark. It no longer shows as a strip at the top of the page.
- The logout button looks like the other header links.
- A page whose only plugin block is the user bar shows its own text again.

## 1.1.0

- New colours: a deep indigo header bar (#1f3a5f) with white text, cool grey paper on a white page, indigo title links; no orange or red.
- Dark mode: follows the system by default; readers pick auto, light or dark in the footer (remembered in the browser; hidden without JavaScript, which keeps the system choice). No flash on load.
- Spacing: tighter story rows, one left edge for titles, item text, comments and forms, the user bar inside the header bar, a canvas gap above the page.
- The OP name colour is darker for AA contrast.
- Tap targets are at least 24 px: vote arrows (the arrow stays small), header and footer links, the phone menu button, the sub-line links, the colour switch, buttons and the search box. Rows do not move.
- Your own comment's Edit and Delete sit on one row under the comment and look like the reply link.
- Every list, story, submit, login and profile page has one heading for screen readers (visually hidden, so nothing changes on screen); "1 comment" is singular on the story page.
- Phones: larger rank, title, sub-line and comment text; story text lines up with the title, forms use one left edge.
- The comment form is an 80x8 box (about 660 px wide) and comment text uses normal line height, as on the original.

## 1.0.1

- Story pages show the blocks a plugin places on them (the user bar, the story row with its vote arrow, points and actions, and notices); without blocks the page keeps its own story header.
- Your own comment's Edit and Delete controls use the small grey sub-line text.

## 1.0.0

- First release: header bar with a mobile menu, ranked story rows, threaded comments with no-JavaScript vote and flag forms, a plain comment form, a 404 page, and the settings `width` and `plugin_actions`.
- Dead comments: a [dead] placeholder, or with show-dead the grey row with a no-JavaScript vouch form (only when plugin_actions is on).
- A comment sign-in page (email link, no password) with the sign-out button.
- The comment form hides the name and email fields when a plugin fixes the commenter name, and shows who is signed in.
- Fixes: long titles wrap in thread headers on phones, the rank keeps a margin on phones, unvote underlines on hover.
- The user bar is styled both at the top of the page and in the header slot; vote arrows get a 24px tap target on phones; the muted grey is darker (#6b6b6b, 4.9:1).
