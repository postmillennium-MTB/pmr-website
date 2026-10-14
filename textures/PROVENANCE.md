# Provenance

The carpet patterns' source patents are US design patents from 1882-1884: six name
Eugene A. Crowe of Boston as inventor, and D 13,108 and D 13,109 name Edwin Fisher of Boston.
Comp III (`us-d268339`) is a 1983 patent, covered below. Design patents of that era ran 3.5, 7 or 14 years, so
all had expired by 1898 at the latest: the patents are in the public domain.
The drawing sheets are the USPTO / Google Patents scans (the 12,657 scan is
stamped "Best Available Copy").

Links: every carpet patent links to its Google Patents page. 14,685 and 12,657 were opened and confirmed; the 13,102, 13,483, 13,105, 13,106, 13,108 and 13,109 links were supplied by the site owner and not opened here (no network access in the build session). For 13,106, 13,108 and 13,109 the site owner also supplied the patent PDFs, which were read (see below).

"Same inventor" here means the name on the drawing sheet. The 1884 and 1882
(12,657) specifications name the Lowell Manufacturing Company as assignee. The
other three assignees were not read.

| Pattern id | Patent | Granted | Kind | How it was made |
|---|---|---|---|---|
| `crowe-1884-14685` | US D 14,685 | Feb 19, 1884 | Patent drawing | Page 1 scan (300 ppi) cropped to the figure, deskewed 0.5 degrees, windowed to a repeat that wraps both ways (the figure holds two horizontal repeats; both are used). Downscaled to 800 px, then thresholded to a mask. |
| `crowe-1882-12657` | US D 12,657 | Jan 10, 1882 | Adapted | The drawing is one swatch that does not wrap (edge continuity 0.45 left-right against about 0.76 for neighboring columns). Redrawn with an AI image model; edges repaired with `make_tileable.py` (band 96 px). |
| `crowe-1882-13102` | US D 13,102 | Aug 1, 1882 | Adapted | Same method; band 128 px. The center bouquet is partly re-cut by the repair. |
| `crowe-1882-13483` | US D 13,483 | Dec 26, 1882 | Adapted | Same method; band 160 px. |
| `crowe-1882-13105` | US D 13,105 | Aug 1, 1882 | Adapted | Same method; band 96 px. |
| `crowe-1882-13106` | US D 13,106 | Aug 1, 1882 | Adapted | Same method (Gemini redraw of the patent PDF using `prompts/redraw-patent-as-tile.md`); the 1125 px result did not wrap (edge correlation 0.06 left-right, -0.12 top-bottom, against about 0.8-0.9 for neighbors), so edges were repaired with band 128 px (997 px tile; edge correlation afterward 0.89 and 0.86). Ink coverage 42%. |
| `fisher-1882-13109` | US D 13,109 | Aug 1, 1882 | Adapted | Same Gemini method (`prompts/redraw-patent-as-tile.md`). The 1125 px result did not wrap (edge correlation 0.02 left-right, 0.12 top-bottom). This drawing has a strict fine grid with a 33.3 px by 28.06 px pitch, and the plain repair (`make_tileable.py`) left the grid about half a cell out of step at the join (a visible vertical seam and horizontal jog in a 2x2 view). `make_tileable_grid.py` crops to 30 x 36 whole cells first, band 96 px: 999 x 1010 px tile, edge correlation 0.85 left-right and 0.70 top-bottom (neighbors 0.78 and 0.65). A faint horizontal jog may still show in a 2x2 view. Mask 791x800 px. Ink coverage 57%. |
| `fisher-1882-13108` | US D 13,108 | Aug 1, 1882 | Adapted | Same method as 13,106 (Gemini redraw using `prompts/redraw-patent-as-tile.md`). The 1125 px result did not wrap (edge correlation 0.05 left-right, -0.04 top-bottom, against about 0.85 for neighbors); edges repaired with band 96 px (1029 px tile; afterward 0.91 and 0.81). Seam ink-density steps are within normal variation. Ink coverage 59%. Inventor is Edwin Fisher (not Crowe); the id was renamed from `crowe-1882-13108`. |
| `us-d268339` (Comp III) | US D 268,339 | Mar 22, 1983 | Patent drawing | Scan `masks/USD268339S.png` (1328x1108), cropped to x 197-1085, y 110-975 (888x865 px): exactly 3 horizontal repeats (period about 296 px, found by autocorrelation) starting between columns, and one vertical repeat whose top and bottom half-plates, cut by the drawing frame, join into whole plates. Frame lines and margin marks are outside the crop. Then `make_mask.py` at 800 px (ink coverage 10%). |
| `pile-carpet`, `pile-grain` | none | n/a | Procedural | SVG `feTurbulence` tiles (256 px, `stitchTiles`) from `masks/low-pile-carpet.css`; ink coverage measured in Chromium (11% and 6%). |

Patent numbers and grant dates were read from the printed header of each
drawing sheet. The match between each AI-redrawn image and its source patent was
made by eye. An earlier attempt at US D 13,106 did not yield a usable tile; a later Gemini redraw did (below). For 13,106, 13,108 and 13,109 the patent PDFs were read and the sheet drawings compared with the redraws: the motifs match (13,106: five-petal flowers, leaf sprays, cloud shapes; 13,108: ferns, large leaves, the stepped block; 13,109: dark flowers, tulip-like blooms, a fan-shaped plant over a fine grid). The 13,108 sheet is a tall swatch and the redraw is square, so the redraw rearranges the layout.

## Seam checks

Each tile was checked by comparing its right edge to its left and its bottom to
its top (correlation, at 1/8 scale) against the correlation between neighboring
columns, and by viewing the tile shifted half its width and height with
wraparound. Every adapted tile shows no straight seam in that view. Two caveats: the grid
lines can look doubled where a repair cut crosses them, and the repaired
swatches (13,102 especially) have their central motif partly re-cut.

## Ink coverage

| Pattern | Ink at full strength |
|---|---|
| 14,685 | 62% |
| 12,657 | 49% |
| 13,102 | 53% |
| 13,483 | 66% |
| 13,105 | 54% |
| 13,106 | 42% |
| 13,108 | 59% |
| 13,109 | 57% |

For comparison, the PMR site's existing 1898 carpet (US D 28,278) is about 45%.

## US D 268,339 (Comp III)

The tread design of the Tioga Comp III tire (the tire identification is from the
site owner; the patent page lists no tire name). Inventors Syoji Inae and Eiji
Fukuchi; assigned to Mitsuboshi Belting Ltd. (assignment recorded 1982-10-28);
application US 06/349,941 filed 1982-02-18; granted 1983-03-22; expired 1997-03-22
([Google Patents](https://patents.google.com/patent/USD268339S/en)). The patent
title was not recorded. The tile was checked by eye shifted half its width and
height with wraparound; no seam shows. The scan has rough, slightly fuzzy edges,
which survive into the mask.

## Facts read from the 13,106, 13,108 and 13,109 PDFs

| | US D 13,106 | US D 13,108 | US D 13,109 |
|---|---|---|---|
| Title on sheet | Design, carpet | Design, carpet | Design, carpet |
| Inventor | Eugene A. Crowe, of Boston | Edwin Fisher, of Boston | Edwin Fisher, of Boston |
| Assignee | Lowell Manufacturing Company, of Lowell, Massachusetts | same | same |
| Application filed | June 21, 1882 | June 21, 1882 | June 21, 1882 |
| Dated / patented | Aug 1, 1882 | Aug 1, 1882 | Aug 1, 1882 |
