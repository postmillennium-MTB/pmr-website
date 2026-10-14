# Provenance

The Crowe patterns' source patents are US design patents from 1882-1884, naming
Eugene A. Crowe of Boston as inventor. Comp III (`us-d268339`) is a 1983 patent, covered below. Design patents of that era ran 3.5, 7 or 14 years, so
all had expired by 1898 at the latest: the patents are in the public domain.
The drawing sheets are the USPTO / Google Patents scans (the 12,657 scan is
stamped "Best Available Copy").

Links: only 14,685 and 12,657 are linked in the README and studio, because those are the Google Patents pages that were opened and confirmed. The other three are cited by number until their pages are checked.

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
| `us-d268339` (Comp III) | US D 268,339 | Mar 22, 1983 | Patent drawing | Scan `masks/USD268339S.png` (1328x1108), cropped to x 197-1085, y 110-975 (888x865 px): exactly 3 horizontal repeats (period about 296 px, found by autocorrelation) starting between columns, and one vertical repeat whose top and bottom half-plates, cut by the drawing frame, join into whole plates. Frame lines and margin marks are outside the crop. Then `make_mask.py` at 800 px (ink coverage 10%). |
| `pile-carpet`, `pile-grain` | none | n/a | Procedural | SVG `feTurbulence` tiles (256 px, `stitchTiles`) from `masks/low-pile-carpet.css`; ink coverage measured in Chromium (11% and 6%). |

Patent numbers and grant dates were read from the printed header of each
drawing sheet. The match between each AI-redrawn image and its source patent was
made by eye. US D 13,106 was tried and did not yield a usable tile.

## Seam checks

Each tile was checked by comparing its right edge to its left and its bottom to
its top (correlation, at 1/8 scale) against the correlation between neighboring
columns, and by viewing the tile shifted half its width and height with
wraparound. All five show no straight seam in that view. Two caveats: the grid
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
