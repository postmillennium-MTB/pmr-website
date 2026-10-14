# Provenance

The carpet patterns' source patents are US design patents from 1882-1884: six name
Eugene A. Crowe of Boston as inventor, D 13,108 and D 13,109 name Edwin Fisher of Boston, and D 13,110 names John Fisher of New York.
Comp III (`us-d268339`) is a 1983 patent, covered below. Design patents of that era ran 3.5, 7 or 14 years, so
all had expired by 1898 at the latest: the patents are in the public domain.
The drawing sheets are the USPTO / Google Patents scans (the 12,657 scan is
stamped "Best Available Copy").

Links: every carpet patent links to its Google Patents page. 14,685 and 12,657 were opened and confirmed; the 13,102, 13,483, 13,105, 13,106, 13,108, 13,109 and 13,110 links were supplied by the site owner and not opened here (no network access in the build session). For 13,102, 13,105, 13,106, 13,108, 13,109, 13,110, 13,483 and 12,657 the site owner also supplied the patent PDFs, which were read (see below); the 14,685 PDF was supplied later and read too (see below).

"Same inventor" here means the name on the drawing sheet. The 1884 and 1882
(12,657) specifications name the Lowell Manufacturing Company as assignee, and so do
the 13,102, 13,105, 13,106, 13,108, 13,109, 13,110 and 13,483 specifications (read from the PDFs).

| Pattern id | Patent | Granted | Kind | How it was made |
|---|---|---|---|---|
| `crowe-1884-14685` | US D 14,685 | Feb 19, 1884 | Patent drawing | Page 1 scan (300 ppi) cropped to the figure, deskewed 0.5 degrees, windowed to a repeat that wraps both ways (the figure holds two horizontal repeats; both are used). Downscaled to 800 px, then thresholded to a mask. |
| `crowe-1882-12657` | US D 12,657 | Jan 10, 1882 | Adapted | The drawing is one swatch that does not wrap (edge continuity 0.45 left-right against about 0.76 for neighboring columns). Redrawn with an AI image model; edges repaired with `make_tileable.py` (band 96 px). |
| `crowe-1882-13102` | US D 13,102 | Aug 1, 1882 | Adapted | Same method; band 128 px. The center bouquet is partly re-cut by the repair. |
| `crowe-1882-13483` | US D 13,483 | Dec 26, 1882 | Adapted | Same method; band 160 px. |
| `crowe-1882-13105` | US D 13,105 | Aug 1, 1882 | Adapted | Same method; band 96 px. |
| `crowe-1882-13106` | US D 13,106 | Aug 1, 1882 | Adapted | Same method (Gemini redraw of the patent PDF using `prompts/redraw-patent-as-tile.md`); the 1125 px result did not wrap (edge correlation 0.06 left-right, -0.12 top-bottom, against about 0.8-0.9 for neighbors), so edges were repaired with band 128 px (997 px tile; edge correlation afterward 0.89 and 0.86). Ink coverage 42%. |
| `day-1927-74141` | US D 74,141 | Dec 27, 1927 | Adapted | A 1927 textile fabric design, not a carpet. Same Gemini method (`prompts/redraw-patent-as-tile.md`). The 1125 px tile did not wrap (edge correlation 0.34 left-right, -0.02 top-bottom) and also had two straight vertical cuts inside it at about x=268 and x=850 where strips look pasted (weak adjacent-column correlation, 0.55-0.63, and visible in a zoom). The plain repair `make_tileable.py`, band 128, gave a 997 px tile with edge correlation 0.86 and 0.69 (neighbors 0.77 and 0.63); bands 96 and 160 scored worse (top-bottom 0.45 and 0.52). The fine horizontal ruling has a 5.63 px pitch and 997 px is 177.1 pitches, so the ruling stays in step at the join. **The two internal cuts are not removed**: they show as faint straight vertical lines in a 2x2 view. `make_tileable_grid.py` does not fit (no vertical grid), and no glitch-free block of the Gemini tile wraps on its own (best 0.25). The patent sheet itself does not wrap either (edge correlation -0.37 and -0.61: a mirrored 2:1 unit). Ink coverage 60%. Re-running Gemini may give a cleaner tile. |
| `fisher-1882-13110` | US D 13,110 | Aug 1, 1882 | Adapted | Same Gemini method and the grid-aware repair, as for 13,109. The 1125 px result did not wrap (edge correlation 0.00 both axes); grid pitch 30.74 x 27.89 px; `make_tileable_grid.py` band 96 px gave a 1014 x 1004 px tile (33 x 36 cells), edge correlation 0.83 left-right and 0.80 top-bottom (neighbors 0.82 and 0.73). Bands 112 and 128 were worse (one axis at -0.01 and 0.40) and `make_tileable.py` at 128 gave 0.42 left-right, so they were not used. In a 2x2 view the four corner pieces join into one whole medallion and no seam shows. Mask 800x792 px. Ink coverage 66%, the darkest pattern in the set. |
| `fisher-1882-13109` | US D 13,109 | Aug 1, 1882 | Adapted | Same Gemini method (`prompts/redraw-patent-as-tile.md`). The 1125 px result did not wrap (edge correlation 0.02 left-right, 0.12 top-bottom). This drawing has a strict fine grid with a 33.3 px by 28.06 px pitch, and the plain repair (`make_tileable.py`) left the grid about half a cell out of step at the join (a visible vertical seam and horizontal jog in a 2x2 view). `make_tileable_grid.py` crops to 30 x 36 whole cells first, band 96 px: 999 x 1010 px tile, edge correlation 0.85 left-right and 0.70 top-bottom (neighbors 0.78 and 0.65). A faint horizontal jog may still show in a 2x2 view. Mask 791x800 px. Ink coverage 57%. |
| `fisher-1882-13108` | US D 13,108 | Aug 1, 1882 | Adapted | Same method as 13,106 (Gemini redraw using `prompts/redraw-patent-as-tile.md`). The 1125 px result did not wrap (edge correlation 0.05 left-right, -0.04 top-bottom, against about 0.85 for neighbors); edges repaired with band 96 px (1029 px tile; afterward 0.91 and 0.81). Seam ink-density steps are within normal variation. Ink coverage 59%. Inventor is Edwin Fisher (not Crowe); the id was renamed from `crowe-1882-13108`. |
| `us-d268339` (Comp III) | US D 268,339 | Mar 22, 1983 | Patent drawing | Scan `masks/USD268339S.png` (1328x1108), cropped to x 197-1085, y 110-975 (888x865 px): exactly 3 horizontal repeats (period about 296 px, found by autocorrelation) starting between columns, and one vertical repeat whose top and bottom half-plates, cut by the drawing frame, join into whole plates. Frame lines and margin marks are outside the crop. Then `make_mask.py` at 800 px (ink coverage 10%). |
| `pile-carpet`, `pile-grain` | none | n/a | Procedural | SVG `feTurbulence` tiles (256 px, `stitchTiles`) from `masks/low-pile-carpet.css`; ink coverage measured in Chromium (11% and 6%). |

Patent numbers and grant dates were read from the printed header of each
drawing sheet. Every AI-redrawn image was compared with its patent sheet (the PDFs were read for all eight adapted
patents). An earlier attempt at US D 13,106 did not yield a usable tile; a later Gemini redraw did (below). The motifs match on every one (12,657: dark rosette panels, scroll shapes and a central flower over lattice; 13,102: a central leaf bouquet with ferns, key-pattern frames and lattice; 13,105: a patchwork of fine grid, key and basket-weave panels around a leaf-and-berry bouquet; 13,483: dense foliage with large leaves and corner roses; 13,106: five-petal flowers, leaf sprays, cloud shapes; 13,108: ferns, large leaves, the stepped block; 13,109: dark flowers, tulip-like blooms, a fan-shaped plant over a fine grid; 13,110: scalloped medallions, a central leaf cluster, lattice and stippled fills). The 13,108 sheet is a tall swatch and the redraw is square, so the redraw rearranges the layout.

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
| 13,110 | 66% |
| 74,141 | 60% |

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

## Facts read from the 13,106, 13,108, 13,109 and 13,110 PDFs

| | US D 13,106 | US D 13,108 | US D 13,109 | US D 13,110 |
|---|---|---|---|---|
| Title on sheet | Design, carpet | Design, carpet | Design, carpet | Design, carpet |
| Inventor | Eugene A. Crowe, of Boston | Edwin Fisher, of Boston | Edwin Fisher, of Boston | John Fisher, of New York |
| Assignee | Lowell Manufacturing Company, of Lowell, Massachusetts | same | same | same |
| Application filed | June 21, 1882 | June 21, 1882 | June 21, 1882 | June 21, 1882 |
| Dated / patented | Aug 1, 1882 | Aug 1, 1882 | Aug 1, 1882 | Aug 1, 1882 |

## Facts read from the 12,657, 13,102, 13,105 and 13,483 PDFs

| | US D 12,657 | US D 13,102 | US D 13,105 | US D 13,483 |
|---|---|---|---|---|
| Title on sheet | Design, carpet | Design, carpet | Design, carpet | Design, carpet |
| Inventor | Eugene A. Crowe, of Boston | Eugene A. Crowe, of Boston | Eugene A. Crowe, of Boston | Eugene A. Crowe, of Boston |
| Assignee | Lowell Manufacturing Company, of Lowell, Massachusetts | same | same | same |
| Application filed | Dec 12, 1881 | June 21, 1882 | June 21, 1882 | Nov 9, 1882 |
| Dated / patented | Jan 10, 1882 | Aug 1, 1882 | Aug 1, 1882 | Dec 26, 1882 |

The registry already had the right inventor and grant date for all four; checking the PDFs
added the assignee and the application dates. The 12,657 sheet is stamped "Best Available Copy".

## Facts read from the 14,685 and 74,141 PDFs

| | US D 14,685 | US D 74,141 |
|---|---|---|
| Title on sheet | Design, carpet | Textile fabric (specification: "Design for a textile fabric") |
| Inventor | Eugene A. Crowe, of Boston | Harry S. Day, of Hawthorne, New Jersey |
| Assignee | Lowell Manufacturing Company, of Lowell, Massachusetts | Pennsylvania Textile Mills, Inc., of Clifton, New Jersey (a New Jersey corporation) |
| Application filed | Nov 23, 1883 | July 9, 1927 (Serial No. 22,710) |
| Dated / patented | Feb 19, 1884 | Dec 27, 1927 |

14,685 is the only pattern that is a patent's own drawing. Its sheet is a strip of two
repeats side by side, and the studio mask shows the same motifs, so the registry entry
(inventor, date) was already right. The 74,141 sheet is a mirrored 2:1 damask unit that
does not wrap by translation, so it was redrawn like the carpets.
