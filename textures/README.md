# PMR Textures

Texture studio can be found here: 

https://www.postmillenniumrenaissance.com/textures/studio/

Recolorable background patterns for Post Millennium Renaissance tools: five
derived from 1880s carpet design patents by Eugene A. Crowe, one cropped from US
Design Patent 268,339, and two procedural pile/grain tiles. Each pattern is one
alpha mask (ink opaque, paper transparent), so a single file serves every color
scheme: CSS paints the ink in whatever color you choose.

## Credits

Every pattern is derived from a US design patent for a carpet naming **Eugene A.
Crowe** of Boston as inventor, granted 1882-1884. The two specifications that were
read name the **Lowell Manufacturing Company** of Lowell, Massachusetts as
assignee. The patents expired more than a century ago, and the drawing scans come
from the US Patent Office via Google Patents. Permission is not required, but
the designs should carry their names when they are used.

| Pattern | Patent | Inventor | Granted | Kind |
|---|---|---|---|---|
| `crowe-1884-14685` | [US D 14,685](https://patents.google.com/patent/USD14685S/en) | Eugene A. Crowe | Feb 19, 1884 | Patent drawing |
| `crowe-1882-12657` | [US D 12,657](https://patents.google.com/patent/USD12657S/en) | Eugene A. Crowe | Jan 10, 1882 | Adapted |
| `crowe-1882-13102` | US D 13,102 | Eugene A. Crowe | Aug 1, 1882 | Adapted |
| `crowe-1882-13483` | US D 13,483 | Eugene A. Crowe | Dec 26, 1882 | Adapted |
| `crowe-1882-13105` | US D 13,105 | Eugene A. Crowe | Aug 1, 1882 | Adapted |
| `us-d268339` | US D 268,339 | not checked | not checked | Patent drawing (cropped) |
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
| `tools/make_mask.py` | Black-on-white image to alpha mask (downscale, then Otsu with soft ramp) |
| `tools/make_tileable.py` | Forces an image to wrap on all four edges (min-error-cut quilting) |
| `tools/build_studio.py` + `tools/studio_template.html` | Rebuild the studio after adding a pattern |
| `PROVENANCE.md` | Where each pattern came from and how it was made |

## Add a pattern

1. Get a black-on-white image (a patent PDF page, or a redrawn version).
2. If it does not already wrap, run `python3 tools/make_tileable.py in.png out.png 128`,
   then shift the result half its width and height with wraparound and check that
   no straight seam shows through the middle.
3. `python3 tools/make_mask.py out.png masks/<id>.webp 800`
4. Add an entry to `patterns.json` (set `kind` honestly) and a row to `PROVENANCE.md`.
5. `python3 tools/build_studio.py`

Needs Python 3 with Pillow and numpy.
