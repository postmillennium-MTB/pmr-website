# PMR Textures

Texture studio can be found here: 

https://www.postmillenniumrenaissance.com/textures/studio/

Recolorable background patterns for Post Millennium Renaissance tools: nine
derived from 1880s carpet design patents (six by Eugene A. Crowe, two by Edwin Fisher, one by John Fisher), one from
a 1927 textile design patent (D 74,141, Harry S. Day), one cropped from the
Tioga Comp III tire tread patent (US Design Patent 268,339), and two procedural pile/grain tiles. Each pattern is one
alpha mask (ink opaque, paper transparent), so a single file serves every color
scheme: CSS paints the ink in whatever color you choose.

## Credits

Six of the carpet patterns are derived from US design patents for a carpet naming
**Eugene A. Crowe** of Boston as inventor, granted 1882-1884, two (D 13,108 and D 13,109)
from patents naming **Edwin Fisher** of Boston, and one (D 13,110) naming **John Fisher**
of New York. The specifications of all nine carpet patents name the **Lowell Manufacturing
Company** of Lowell, Massachusetts as assignee. **US D 74,141** is a 1927 textile fabric
design (not a carpet) by **Harry S. Day** of Hawthorne, New Jersey, assigned to
**Pennsylvania Textile Mills, Inc.** of Clifton, New Jersey, granted Dec 27, 1927. **Comp III** is US D 268,339, the Tioga Comp III tire tread: inventors
**Syoji Inae and Eiji Fukuchi**, assigned to **Mitsuboshi Belting Ltd.**, granted
Mar 22, 1983, expired Mar 22, 1997. The pile and grain tiles are generated and need
no credit. The patents have expired, and the drawing scans come from the US Patent
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
   strength, size, and optionally its own ink color.
4. Optional **fade** per layer: top to bottom, bottom to top, left to right or
   right to left, with a "full strength until" point and a "strength left at the
   far edge" floor. Fade one layer out while another fades in to blend patterns.
5. Copy the **self-contained** CSS and paste it into the page's `<style>`.
6. Add the `<div>`s the studio lists (`texture`, then `texture-2`, `texture-3`
   for extra layers) as the first children of `<body>` and give `<body>`
   `position:relative`. The "Put it on the page" box in the studio has the exact
   text.
7. Paste the credit line the studio generates into the page footer (procedural
   patterns need none).

To recolor for another color scheme later, change only the CSS variables,
`--tex-ink` and `--tex-opacity` (plus `--tex-2-opacity` etc. for extra layers, and
`--tex-2-ink` if a layer has its own ink), per theme. The "Per-theme colors" box gives the
block to paste for each theme.

## Which CSS form to use

| Form | Use when | Why |
|---|---|---|
| Self-contained (data URI) | The tool is a single file that must work when double-clicked, or is embedded in an iframe | Browsers do not load a mask image from a local file. Tested: a relative `mask-image: url(m.webp)` renders nothing from `file://`; the same mask as a data URI renders. |
| File link | The page is served from a web server (GitHub Pages, etc.) | Smaller CSS. Needs the `.webp` copied next to the page. Cross-site links also need the host to send CORS headers (GitHub Pages does). |

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
| `masks/USD268339S.png` | Source scan for `us-d268339` (not served by the studio; kept to regenerate the mask) |
| `patterns.json` | The registry: id, patent, status, ink coverage, default strength |
| `studio/index.html` | The recolor-and-copy-CSS page (built; masks embedded) with layers, fades and a random-color button |
| `ADD-A-PATTERN.md` | The step-by-step workflow for adding a pattern: what to provide, what to check, what to update |
| `prompts/redraw-patent-as-tile.md` | The Gemini prompt used to redraw a single-swatch patent as a seamless tile, with notes and a revision log |
| `tools/make_mask.py` | Black-on-white image to alpha mask (downscale, then Otsu with soft ramp) |
| `tools/make_tileable_grid.py` | Same edge repair for a pattern with a strict fine grid: crops to a whole number of grid cells first so the grid lines meet at the join |
| `tools/make_tileable.py` | Forces an image to wrap on all four edges, or just one axis with `--axes=y` or `--axes=x` (min-error-cut quilting) |
| `tools/build_studio.py` + `tools/studio_template.html` | Rebuild the studio after adding a pattern |
| `PROVENANCE.md` | Where each pattern came from and how it was made |

## Add a pattern

Follow **[ADD-A-PATTERN.md](ADD-A-PATTERN.md)**. You provide three things per patent:
the patent PDF, the Gemini tile (the image Gemini returns after running
`prompts/redraw-patent-as-tile.md`), and the Google Patents link. The document lists
every step, the checks, the naming rules and the records to update.

Needs Python 3 with Pillow and numpy.
