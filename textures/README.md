# PMR Textures

Texture studio can be found here: 

https://www.postmillenniumrenaissance.com/textures/studio/

Recolorable background patterns for Post Millennium Renaissance tools. Twenty in
all: nine redrawn or cropped from 1880s carpet design patents (six by Eugene A. Crowe,
two by Edwin Fisher, one by John Fisher), one from a 1927 textile design patent
(D 74,141, Harry S. Day), one cropped from the Tioga Comp III tire tread patent (US
Design Patent 268,339), two procedural pile/grain tiles, procedural graph paper, and
four more generated patterns: topographic contours, guilloché rosettes, a carbon
twill weave and a switchback trail line, plus two pieces of the site's own artwork,
converted to continuous-tone masks: `moose-skulls` (the header tile of the bike-park guides,
with its pink accents as a setting in the studio) and `moose-train-glove-tree` (a cream-ground
pattern of moose skulls, trains, baseball gloves and Christmas trees). Each pattern is one alpha
mask (ink opaque, paper transparent), so a single file serves every color scheme: CSS
paints the ink in whatever color you choose.

## Credits

Six of the carpet patterns are derived from US design patents for a carpet naming
**Eugene A. Crowe** of Boston as inventor, granted 1882-1884, two (D 13,108 and D 13,109)
from patents naming **Edwin Fisher** of Boston, and one (D 13,110) naming **John Fisher**
of New York. The specifications of all nine carpet patents name the **Lowell Manufacturing
Company** of Lowell, Massachusetts as assignee. **US D 74,141** is a 1927 textile fabric
design (not a carpet) by **Harry S. Day** of Hawthorne, New Jersey, assigned to
**Pennsylvania Textile Mills, Inc.** of Clifton, New Jersey, granted Dec 27, 1927. **Comp III** is US D 268,339, the Tioga Comp III tire tread: inventors
**Syoji Inae and Eiji Fukuchi**, assigned to **Mitsuboshi Belting Ltd.**, granted
Mar 22, 1983, expired Mar 22, 1997. The pile, grain, graph-paper, topographic-contour, guilloché, carbon-twill and switchback-trail tiles are generated and need
no credit. The two artwork tiles (moose-skulls, moose-train-glove-tree) are the site's own artwork, not patents, so they need no patent credit. The patents have expired, and the drawing scans come from the US Patent
Office via Google Patents. Permission is not required, but the designs should carry
their names when they are used.

| Pattern | Patent | Inventor | Granted | Kind |
|---|---|---|---|---|
| `crowe-1884-14685` | [US D 14,685](https://patents.google.com/patent/USD14685S/en) | Eugene A. Crowe | Feb 19, 1884 | Patent drawing |
| `crowe-1882-12657` | [US D 12,657](https://patents.google.com/patent/USD12657S/en) | Eugene A. Crowe | Jan 10, 1882 | Adapted |
| `crowe-1882-13102` | [US D 13,102](https://patents.google.com/patent/USD13102S/en) | Eugene A. Crowe | Aug 1, 1882 | Adapted |
| `crowe-1882-13483` | [US D 13,483](https://patents.google.com/patent/USD13483S/en) | Eugene A. Crowe | Dec 26, 1882 | Adapted |
| `crowe-1882-13105` | [US D 13,105](https://patents.google.com/patent/USD13105S/en) | Eugene A. Crowe | Aug 1, 1882 | Adapted |
| `crowe-1882-13106` | [US D 13,106](https://patents.google.com/patent/USD13106S/en) | Eugene A. Crowe | Aug 1, 1882 | Adapted |
| `fisher-1882-13108` | [US D 13,108](https://patents.google.com/patent/USD13108S/en) | **Edwin Fisher** | Aug 1, 1882 | Adapted |
| `fisher-1882-13109` | [US D 13,109](https://patents.google.com/patent/USD13109S/en) | **Edwin Fisher** | Aug 1, 1882 | Adapted |
| `fisher-1882-13110` | [US D 13,110](https://patents.google.com/patent/USD13110S/en) | **John Fisher** | Aug 1, 1882 | Adapted |
| `day-1927-74141` | [US D 74,141](https://patents.google.com/patent/USD74141S/en) | **Harry S. Day** | Dec 27, 1927 | Adapted (textile fabric, not a carpet) |
| `us-d268339` (Comp III) | [US D 268,339](https://patents.google.com/patent/USD268339S/en) | Syoji Inae, Eiji Fukuchi | Mar 22, 1983 | Patent drawing (cropped) |
| `pile-carpet`, `pile-grain` | none (procedural) | n/a | n/a | Generated noise, no credit needed |
| `graph-paper` | none (procedural) | n/a | n/a | Generated ruled lines (8 px minor, 40 px major), no credit needed |
| `topo-contours` | none (procedural) | n/a | n/a | Generated contour map (18 contour intervals, an index line every 5th), no credit needed |
| `guilloche-rosettes` | none (procedural) | n/a | n/a | Generated guilloché rosette lattice, the banknote and stock-certificate style, no credit needed |
| `carbon-twill` | none (procedural) | n/a | n/a | Generated 2/2 twill weave, a 64 px vector tile, no credit needed |
| `switchback-trail` | none (procedural) | n/a | n/a | Generated dashed trail loops routed over the `topo-contours` terrain, made to layer over it; no credit needed |
| `moose-skulls` | none (site artwork) | n/a | n/a | Artwork: the US guide's header tile (moose skulls, sloths, ferns), converted to a continuous-tone mask; no patent credit. Made by the site owner with Google Gemini's Nano Banana image model (see `PROVENANCE.md`) |
| `moose-train-glove-tree` | none (site artwork) | n/a | n/a | Artwork: a pattern made by the site owner (moose skulls, trains, gloves, Christmas trees on cream), cropped to one repeat that wraps both ways and converted to a continuous-tone mask; no patent credit. The tool used is not recorded (see `PROVENANCE.md`) |

"Adapted" patterns were redrawn from the patent drawing with an AI image model
(Google Gemini) and had their edges repaired so they tile; they are not the
patent's own drawing. When a pattern is used on a page, add its credit line: the
studio generates one for the selected pattern, and `patterns.json` holds the same
text in each entry's `credit` field.

## Use it (no code editing)

1. Open `studio/index.html` in a browser (double-click is fine).
2. Pick a color preset, or set your own ink and paper colors. **Random colors**
   rolls a new ink and paper at random (always at least 4:1 contrast).
3. Pick a pattern for layer 1 and adjust ink strength until body text stays easy
   to read. **Add a layer** stacks up to three patterns; each has its own
   strength, size, and optionally its own ink color. A pattern that has an accent
   ink (the moose's pink) shows a tick box for it on its layer.
4. Optional **fade** per layer: top to bottom, bottom to top, left to right or
   right to left, with a "full strength until" point and a "strength left at the
   far edge" floor. Fade one layer out while another fades in to blend patterns.
5. **Using it in a project with Claude Code:** copy the **Paste into Claude Code**
   block and paste it into the conversation. It holds the instructions, the CSS, the
   `<div>`s, the per-theme variables and the credit line, and is about 4 KB with the
   default **Short** form (the masks load from the hosted site). The
   **Self-contained** tab gives the same block with the masks embedded (100 KB or
   more), for single-file tools that must work offline or double-clicked.
6. **Doing it by hand:** copy the CSS from "CSS only", add the `<div>`s the studio
   lists (`texture`, then `texture-2`, `texture-3` for extra layers) as the first
   children of `<body>`, and give `<body>` `position:relative`. The "Put it on the
   page" box has the exact text.
7. Put the credit line the studio generates in the page footer (procedural patterns
   need none).

To recolor for another color scheme later, change only the CSS variables,
`--tex-ink` and `--tex-opacity` (plus `--tex-2-opacity` etc. for extra layers, and
`--tex-2-ink` if a layer has its own ink), per theme. The "Per-theme colors" box gives the
block to paste for each theme.

## Which CSS form to use

| Form | Use when | Why |
|---|---|---|
| Self-contained (data URI) | The tool is a single file that must work when double-clicked, or is embedded in an iframe | Browsers do not load a mask image from a local file. Tested: a relative `mask-image: url(m.webp)` renders nothing from `file://`; the same mask as a data URI renders. |
| Short (file link, the studio default) | The page is served from the web | About 1-2 KB of CSS per layer. The masks load from `https://www.postmillenniumrenaissance.com/textures/masks/<id>.webp`; GitHub Pages sends the CORS header mask images need, so any web page can use them. Tested against a local server sending the same CORS header (the short CSS painted on a page from a different origin); not yet tested against the live site. A new pattern only loads once it is on the live site (after the branch is merged). The procedural pile, grain, graph paper and carbon twill stay embedded (about 1-3 KB each); the topographic contour, guilloché and switchback trail masks are files, so they load from the live site like the patent patterns. |

The Patent Atlas must keep working when double-clicked, so it should use the
self-contained form. That adds roughly 40-100 KB to `index.html` per pattern.

## Rules of thumb

- **Strength:** 4-7% ink. These patterns are 49-66% ink at full strength, so they
  look like heavy black print if shown near 100%. The studio's default per pattern
  is in `patterns.json`.
- **Dark themes:** a light ink on a dark ground needs slightly more strength
  (the PMR site uses 6.5-7% on its dark themes vs 5.5% on light ones).
- **Layers:** one layer is the safe default. Two large patterns of similar scale can
  moire against each other. Fade one across the other, or pair a large pattern
  with a fine one (the procedural pile or grain, about 256 px).
- **Fades** run across the whole element the texture sits on, so on `<body>` they
  span the full page height. Fades use a second mask intersected with the pattern
  (`mask-composite`); tested in Chromium only, and the CSS carries the
  `-webkit-` form for Safari.
- **Iframes:** use `position:absolute` on the layer, not `fixed` (Pinkbike
  embeds clip fixed layers).
- **Background color goes on `<body>` or `<html>`.** If it is only on an inner
  wrapper, the layer (z-index -1) ends up hidden behind it.
- **Graph paper:** keep it at 80 px (or 160 px) so the 1 px lines stay sharp, and 3.5-6% strength. Put charts on opaque panels and halo any text that sits on it; `masks/graph-paper.css` has the details.
- **Topographic contours and guilloché rosettes:** thin line art (10% and 16% ink), so they take more strength than the carpets: 8-12%. Show them at 400 px or larger, because the lines are 1.5-1.8 px in the 800 px mask and fade out when shrunk. Both are exactly periodic and need no seam repair.
- **Carbon twill:** a 64 px vector tile that stays sharp at any size. 64-96 px reads as carbon cloth, 160 px and up as a coarse macro weave. About 46% ink, so 5-7%. The studio jumps the size to 64 px when you pick it.
- **Switchback trail:** three dashed trail loops routed over the same terrain as the topographic contours, so the pair must be used together: pick the contours for layer 1, **Add a layer**, pick the trail for layer 2, and keep both at 520 px so each loop lies on the hills it was routed over (the studio sets the trail to 520 px when you pick it). Each loop climbs a steep face in switchbacks that run along the contours and returns by an efficient line, the way a game trail or a trail builder's line goes. It is dashed line art with under 1% ink, so give it about 3-4x the contours' strength: 30-40% against 8-12%. It stands out from a contour by its dashes, not by color. Alone it is only three dashed loops with nothing under them; use it at 400 px or larger.
- **Moose skulls (site artwork):** a continuous-tone mask (the antlers are full ink, the mid-grey ferns, mountains and sloths about 60%), so one ink color keeps the depth of the picture. Mean ink is 21% but the antlers reach 100%, so 6-10% strength (the studio's default is 8%). It is figurative: 400 px or larger (default 520). The original is light motifs on a dark ground, so a pale ink on a dark paper looks like it; on a light theme the antlers print darkest. The `postmillenniumrenaissance.com` mark is part of the picture and repeats with the tile. **Pink accents:** tick "Add the pink accents as their own ink" on its layer. They are a second mask (1% mean ink), written as a layer of their own just above it at the same size and fade, with their own ink color and strength (default `#FA6DAF` at 45%; the accents are thin, so they take far more strength than the pattern). It counts as one of the three layers.
- **Moose, trains, gloves and trees (site artwork):** a continuous-tone mask of a color illustration, so its colors become tones of one ink (linework full ink, green and brown about 80%, grey skulls and antlers about 60%, gold petals about 35%), 38% mean ink. Dark ink on a light paper reads like the original (the Day preset is close to its own cream and brown). 6-10% strength (the studio's default is 8%), 400 px or larger (default 520). No accent ink: it has four colors, not one.
- **Regenerating:** `python3 tools/make_procedural.py` rebuilds the contours, the guilloché, the twill tile and the trail; edit the numbers at the top of each function to change the design.
- **Pattern size:** the PMR site uses 520 px. The fine-grid pattern (13,105)
  blurs when shown smaller than about 400 px.

## What is real and what is adapted

Only `crowe-1884-14685` is a patent's own drawing. The other four patents'
drawings are single swatches that do not repeat, so they were redrawn with an AI
image model and their edges repaired to wrap. They are labeled "adapted" in
`patterns.json` and in the studio. **Never describe an adapted pattern as the
patent's drawing.** See `PROVENANCE.md`.

## Folder map

| Path | What it is |
|---|---|
| `masks/*.webp` | The recolorable masks (lossless WebP with alpha, 800 px) |
| `masks/low-pile-carpet.css` | The two procedural SVG tiles (carpet, grain); the studio reads them from here |
| `masks/graph-paper.css` | Procedural graph paper: the studio's 80 px mask tile, plus the plain-gradient recipe and per-theme rules the Wheel Strength Lab uses |
| `masks/carbon-twill.css` | The carbon twill's 64 px SVG mask tile (written by `tools/make_procedural.py twill`) |
| `masks/topo-contours.webp`, `masks/guilloche-rosettes.webp`, `masks/switchback-trail.webp` | Generated masks (800 px) written by `tools/make_procedural.py`; no patent, no credit |
| `tools/make_procedural.py` | Regenerates the topographic contours, the guilloché rosettes, the carbon twill tile and the switchback trail (all exactly periodic, so no edge repair) |
| `masks/moose-skulls-accent.webp` | The pink accent mask of `moose-skulls` (a registry `accent`, not a pattern of its own; the studio offers it as a setting on that layer) |
| `moose-train-glove-tree.jpg` (in `textures/`, not `masks/`) | Source picture for `moose-train-glove-tree`, 2816 x 1536 px as uploaded by the site owner (not served by the studio; kept to regenerate the mask) |
| `masks/moose-pattern-tile.jpg` | Source tile for `moose-skulls`: a copy of the US guide's `moose-pattern-tile.jpg` (not served by the studio; kept to regenerate the mask) |
| `masks/USD268339S.png` | Source scan for `us-d268339` (not served by the studio; kept to regenerate the mask) |
| `patterns.json` | The registry: id, patent, status, ink coverage, default strength |
| `studio/index.html` | The recolor-and-copy-CSS page (built; masks embedded) with layers, fades and a random-color button |
| `ADD-A-PATTERN.md` | The step-by-step workflow for adding a pattern: what to provide, what to check, what to update |
| `prompts/redraw-patent-as-tile.md` | The Gemini prompt used to redraw a single-swatch patent as a seamless tile, with notes and a revision log |
| `tools/make_mask.py` | Black-on-white image to alpha mask (downscale, then Otsu with soft ramp). `--tone=GROUND,INK` makes a continuous-tone mask from artwork instead, and `--accent=FROM,TO` cuts a picture's one accent color from a colour image (both used for `moose-skulls`) |
| `tools/make_tileable_grid.py` | Same edge repair for a pattern with a strict fine grid: crops to a whole number of grid cells first so the grid lines meet at the join |
| `tools/make_tileable.py` | Forces an image to wrap on all four edges, or just one axis with `--axes=y` or `--axes=x` (min-error-cut quilting). For figurative art, `--avoid-ink` steers the cut through bare ground and `--keep-tone` keeps a grey image grey (both used for `moose-skulls`; off by default); `--color` repairs a colour picture with the cut found on its grey image, so a second mask cut from the colour lines up |
| `tools/build_studio.py` + `tools/studio_template.html` | Rebuild the studio after adding a pattern |
| `PROVENANCE.md` | Where each pattern came from and how it was made |

## Add a pattern

Follow **[ADD-A-PATTERN.md](ADD-A-PATTERN.md)**. You provide three things per patent:
the patent PDF, the Gemini tile (the image Gemini returns after running
`prompts/redraw-patent-as-tile.md`), and the Google Patents link. The document lists
every step, the checks, the naming rules and the records to update.

For a picture the site already uses (a header or hero image, not a patent), see the **Artwork** section of the same file: it needs only the image, and the steps differ (tonal mask, one-axis repair, no credit line).

Needs Python 3 with Pillow and numpy.
