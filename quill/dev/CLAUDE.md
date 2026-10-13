# The Quill and the Compass

An original King's Quest-style point-and-click adventure. It ships as ONE self-contained HTML file
(no libraries, no build tools beyond `cat`). Owner: Jon, who has no coding background and relies on
Claude for implementation, so explain changes plainly and keep the build simple.

## Game in one paragraph
Wren, a cartographer's apprentice with a feathered hat, restores the blank map of Thistlewick Vale.
21 screens (9 story screens, a 5-screen woods trail, the Glimmer Grotto behind the waterfall, the Apple Orchard, the Reed Marsh, and a 4-screen cave system under Fox Hollow), a map that fills in when you ink each place, a compass that gives hints, 3 talkable
characters (Hazel the squirrel trader, Magnus the moose, Fennel the fairy), a plain-language HINT button (H key), 61 points, one ending (the Peak).
Tone: subtle, dry, Sierra-style humor. No death scenes. 16-color EGA palette, 320x200, drawn in code
(no image files). Point-and-click with 4 verbs (Look, Hand, Talk, Boot), a pack, and walking off a
screen edge changes screens.

## Layout
- `src/page.html`  the page shell (CSS, markup). Ends right before the `<script>` body.
- `src/NN-*.js`    the game, concatenated in filename order into ONE script inside an IIFE
                   (so they share scope; `01-core.js` opens it and `14-main.js` closes it).
- `build.sh`       builds `build/quill-and-compass.html` (this is the file you publish or open).
- `tests/`         `playthrough.js` (headless full game, expects score 61 and performs the grotto wish), `exits.js` (every doorway works with sloppy clicks, no bounce-back, boot marks), `saving.js` (save/load safety),
                   `screenshots.js` (node-canvas renders of the scenes), `browser.js` and `browser2.js` (real Chromium clicks and keys; browser2 walks the woods loop and checks the boot ring; browser3 checks the waterfall walk-in and HINT button/H key; browser4 walks the new orchard/marsh/cave doorways with real clicks and checks the 21-room map).
- Setup once: `npm install --ignore-scripts` (the `canvas` package only serves `screenshots.js` and often can't compile; the other tests don't need it). Run: `npm test`.

## Where it lives and how it is published
- Lives in the `pmr-website` repo under `quill/`. The playable game is `quill/index.html`, served at postmillenniumrenaissance.com/quill/. The project (this folder) is `quill/dev/`.
- `./build.sh` writes `build/quill-and-compass.html` AND copies it to `../index.html`. To ship a change: edit `src/`, run `npm test` (and `npm run browser`), run `./build.sh`, commit both `src/` and `quill/index.html`. Never hand-edit `quill/index.html`; the next build overwrites it.
- Deliberately unlinked: `src/page.html` carries `<meta name="robots" content="noindex,nofollow">`, and the page is not in `sitemap.xml`. Remove the meta tag and add a sitemap entry when it goes public.
- Everything under `quill/dev/` is also publicly fetchable (static hosting serves the whole repo). Harmless, but it is not private.
- Saves are in the browser's `localStorage` (`qc-save-v1`), so they are per browser and per device; the save code (SAVE / LOAD) moves a game between devices.
- `src/page.html` is a complete standalone document (doctype, viewport, favicons from the site root). It was written for Claude chat's preview, which supplied that wrapper; the `window.claude.hot` hook at the end of `14-main.js` is a no-op outside chat and can stay.

## Source map
01 core: palette, drawing helpers (R rect, D dither rect, E ellipse, ED dithered ellipse, P polygon, PD dithered polygon, EF see-through ellipse, Ln line), icons.
02-03 character art: Wren, gnome, Hazel, Magnus, Fennel. 04-05, 08, 09, 09b (woods), 09c (grotto), 09d (orchard, marsh, burrow, cavern, lake, mine) scene art: `SC.<room> = {bg(), props(t), fg()}`.
06 state (`S`), items, helpers (`say`, `pts`, `take`, `has`, `add`, `del`), default verb replies.
07, 10, 10b, 10c, 10d rooms (10d uses the `hsp()` helper for hotspots): `ROOMS.<id>` = name, map position (mx,my), walk area, exits, hotspots.
11 dialogue data (`DLG`): nodes with say/opts/enter; options can have `if`, `do`, `go`.
12 engine: dialogue runner, compass hints (BFS), plain HINT (`plainStages`, `plainHint`, `showHint`: three escalating levels from the story state), inking, map overlay, inventory.
13 saving. 14 main loop, input, boot, `window.QC` test hooks.

## Conventions
- Pixel art is drawn procedurally onto a 320x200 canvas. Backgrounds render once into `bgC`; props redraw each frame, y-sorted.
- Do not paint a rectangular `D()` over a polygon `P()` (it leaves gray boxes). Use `PD()` for dithering inside a polygon.
- A room is registered in `ROOMS` AND `ROOM_IDS` (`ROOM_IDS` is created at the end of 10-rooms-wild.js; later files push onto it, as 10b-rooms-woods.js does; it must be complete before 12-engine.js runs). It needs a matching `SC.<id>` and map coordinates `mx,my` (the map grid grows to fit).
  Exits must be paired (A to B and B to A); `tests/playthrough.js` checks this. Each new room is inkable for 1 point, so MAXS goes up by 1 per room; also update 'of N' in `src/page.html` and the tests.
- Doorways are forgiving on purpose: `EXPAD` (12 px sideways), `EXM` (6 px from the edge counts as through), `EXBAND` (18 px click zone) in 12-engine.js. A click in a doorway always walks Wren through it unless an item is selected. Exit options: `soft:true` (the doorway is scenery too, so Look just describes it; used for the waterfall into the grotto) and `land:[x,y]` (place Wren exactly on arrival).
- Boot verb: clicking anywhere draws a ring (`addMark`, `drawMarks`) and clicking bare ground says what is near and the x,y clicked (`kickMsg`). Remove the `(You aimed at ...)` part of `kickMsg` if you want it less technical.
- `ROOMS.x.arrive()` may have side effects (the garden counts visits). Never call it when restoring a save.
- Messages shown in the message window go through `say()`. Points go through `pts(n,key)` (each key scores once). MAXS is 61; keep it in sync with the points that exist.
- Test in a real browser after UI changes: the first version looked fine in headless tests but a hidden overlay blocked all clicks.

## Saving
- Autosave to `localStorage` key `qc-save-v1` (about every 1.5 s after something changes, and on page hide).
- Save code = `QC1.` + base64 of JSON. Loading goes through `sanitize()`, which only copies known fields and clamps values.
- If you ADD a persistent field to `fresh()` in 06-state.js, also copy it in `sanitize()` (13-saving.js).
  If you change the shape of existing fields, bump `SAVEV` so old saves are rejected instead of breaking.
- Transient fields (dialogue, selected item, compass animation, last message) are intentionally not saved.

## Known rough edges / ideas
- The Glimmer Grotto (map position mx 2, my -1) is entered by walking into the waterfall. The pool takes an acorn for a wish (+1 point, acorn returned) and its advice line reuses the plain hint. 10c also patches the falls, mill and duck hotspots (the mill is scenery; the duck rejects the acorn).
- 0.6 map: Apple Orchard (3,2) joins Cottage E, Birch Trail S and Camp W. Reed Marsh (0,3) is south of Mill Pond. The caves are entered by walking into Fox Hollow's den door (a soft exit, `land:[268,144]` on the way back out): Fox's Burrow (4,-1) -> Glowcap Cavern (3,-1) -> Lantern Lake (3,-2, custom walk area, shore only) -> Old Quartz Mine (4,-2) -> back to the Burrow, a loop. Hooks planted, no puzzles yet: lake rowboat has no oars and the ferryman is out; the mine's cave-in has chalk marks from M.Q. (4 DAYS, OOPS) and a sign from Mulch & Sons (the gnome from the trowel); the scarecrow wears a hat like Wren's. The six rooms are scenery plus a point each for inking.
- The map grid shrinks cell height when there are more than 5 rows (`--asp` in 12-engine.js).
- Art is prototype quality: Hazel's stump area is cluttered; Fennel looks gray when drained; the peak is plain.
- No interior behind the cottage door (idea: the cartography workshop).
- The woods (Birch Trail, Tall Pines, Fox Hollow, Owl Tree, the Camp) are scenery only for now: Look/Hand/Talk/Boot replies, no puzzles or items. Hooks planted: the trail register in Tall Pines says M. Quill went to the Peak, and the Camp has a cup left 'FOR MASTER'. Fox Hollow has a sleeping fox; the owl at Owl Tree is asleep (office hours: night).
- No sound. No text input by design (not a parser game).
- Possible next steps: more puzzles per screen, a second map region, Master Quill's story payoff, music, an in-game hint log.
