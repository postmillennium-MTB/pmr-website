# Prompt: redraw a patent drawing as a seamless tile

**Current version: v2** (saved 2026-10-14). **Used in Google Gemini** (image generation,
with the patent PDF attached). The earlier version, v1 (below), made the "adapted"
patterns `crowe-1882-12657`, `-13102`, `-13483`, `-13105`, `-13106`,
`fisher-1882-13108`, `-13109` and `-13110`, and the first (flawed) tile for
`day-1927-74141`. v2 made the second, repaired tile for `day-1927-74141`. See
`../PROVENANCE.md` for what was done to each result afterward.

## How to use

1. Download the patent PDF from Google Patents (the Download PDF link).
2. In Gemini, attach the PDF and paste the **v2** prompt below, unchanged. If you edit
   it, say what you changed so it gets a new version number and a log row.
3. Save the tile, then follow `../ADD-A-PATTERN.md`.
4. Add the result to `../patterns.json` with `kind: "adapted"` and a row in
   `../PROVENANCE.md`, naming the prompt version. Never call it the patent's own drawing.

## The prompt (v2)

```text
The attached PDF is a US design patent.  Page 1 is a scanned
sheet containing a black-and-white pattern drawing, surrounded by a printed header, patent number and date, handwritten notes (such as "Application No."), witness
signatures and scan marks. Page 2 is specification text; ignore it.

Task: extract ONLY the carpet pattern drawing from page 1 and redraw it as a perfectly
seamless, tileable repeat unit that I can use as a repeating background texture.
The tile must be one continuous drawing: no straight vertical or horizontal cuts, pasted strips or repeated blocks inside it.

Step 1, isolate the artwork. Use only the rectangular pattern drawing. Discard the
paper, header, numbers, handwriting, signatures, stamps, scan streaks and edge noise.
The scan may be slightly tilted; straighten it so the grid lines are perfectly
horizontal and vertical.

Step 2, make it tile. Redraw the pattern so it wraps on all four edges: anything
crossing the right edge re-enters at the left edge at the same height, and anything
crossing the top re-enters at the bottom at the same position. The left and right edges
must match exactly, and so must the top and bottom. Where the original is a single
swatch with one large central bouquet or focal motif, rebuild it as a repeat: keep one
full copy near the center and a second copy split across the four corners, so the four
corner pieces join into a whole motif when the tile is repeated. Fill the space between
with the same filler foliage, geometric blocks and grid texture used in the original,
so the surface reads as continuous cloth and not as spots on empty ground.

Step 3, keep the original's look. Use the same motifs and the same drawing style: pure
black ink on pure white, with the same stippled fills, hatching, loom-card pixel grid
and fine square grid lines, at the same overall ink density. Invent no new kinds of
motif. Add no border, frame, text, numbers, shading, gray wash, color or gradient. Edges
stay crisp.

Output: one square image, 2048×2048 px, black on white, showing only the tile. After
generating it, show a 2×2 repetition of the tile beneath it so I can check the seams.
```

## What changed from v1 to v2

- The opening no longer says "a carpet from the 1880s": "The attached PDF is a US design
  patent", and "a black-and-white pattern drawing". It now fits other patents, such as the
  1927 textile D 74,141.
- New sentence after the Task paragraph: "The tile must be one continuous drawing: no
  straight vertical or horizontal cuts, pasted strips or repeated blocks inside it."
- Everything else is unchanged. **Leftover:** the Task line still says "extract ONLY the
  carpet pattern drawing"; consider "the pattern drawing" in the next version.

## Results by version

**v2** (one run so far, US D 74,141): the pasted-strip cuts of v1 are gone. No
full-height straight cut; one short straight edge (about 120 px) remains in a
cross-hatched panel. The left and right edges matched (correlation 0.92 against about
0.80 for neighboring columns), the first of the tiles measured in this workflow to wrap on an axis without repair. The
top and bottom did not match (0.02), and the image was 1125 x 1125, not 2048.

**v1** (nine runs): see "What it did not do reliably" below and the log.

## What it did not do reliably

From `../PROVENANCE.md`: the "left and right edges must match exactly" instruction was
not met by v1 on its own, and only partly by v2. Every adapted tile needed its edges
repaired with `tools/make_tileable.py` (or `make_tileable_grid.py`), and the repairs
left doubled grid lines where a cut crossed them and partly re-cut the central motif
(13,102 most of all). The 2048 x 2048 size was never honored (1125 x 1125 every time).
The match between each result and its source patent was checked against the patent
sheet. US D 13,106 did not give a usable tile on the first attempt; a later run did.
Only designs that are a single swatch need this prompt: a drawing that already repeats
(like US D 14,685) is cropped directly instead.

## Ideas to try (untested)

These are suggestions, not tested changes. Change one at a time, give it a version
number, and log it below.

- Say "pattern drawing" in the Task line, not "carpet pattern drawing".
- Ask for 1024x1024 instead of 2048: the mask pipeline downsamples to 800 px anyway, and
  a smaller canvas may hold the edge match better.
- Ask for the 2x2 check as a separate second image, so the tile itself is delivered
  clean with no preview attached.
- Ask for the output with a fixed ink-density target taken from the original (a mask's
  "ink coverage" in `../patterns.json` is 49-66% for the current set).
- Repeat the edge instruction for the vertical axis only if horizontal wrap is what v2
  got right: for example "the top row of pixels must continue into the bottom row".
- If a seam still shows, re-prompt with the shifted-by-half check image and ask for only
  the seam region to be redrawn.

## Revision log

| Date | Version | Change | Result |
|---|---|---|---|
| 2026-10-14 | v1 | First version saved. | Used for the eight adapted patterns listed at the top. |
| 2026-10-14 | v1 | Same text re-run on US D 13,106. | Returned a 1125x1125 image, not the 2048x2048 requested, with no edge match (left-right correlation 0.06). `make_tileable.py` at 128 px fixed the seams; no visible seam in the half-shifted view. |
| 2026-10-14 | v1 | Same text re-run on US D 13,108. | Again 1125x1125 with no edge match (left-right correlation 0.05). `make_tileable.py` at 96 px fixed it. Two runs in a row ignored the 2048 px size and the exact-edge instruction. |
| 2026-10-14 | v1 | Same text re-run on US D 13,109. | Again 1125x1125 with no edge match (left-right correlation 0.02). This drawing has a strict fine square grid; the plain repair left the grid out of step at the join, so `make_tileable_grid.py` was added. Three runs in a row ignored the 2048 px size and the exact-edge instruction. |
| 2026-10-14 | v1 | Same text re-run on US D 13,110. | Again 1125x1125, no edge match (correlation 0.00). The tile came back with the four corner pieces already forming one medallion across the wrap, as the prompt asks, but the edges still did not match. `make_tileable_grid.py` fixed it. Four runs in a row ignored the 2048 px size and the exact-edge instruction. |
| 2026-10-14 | v1 | Same text run on US D 74,141. This is a 1927 textile fabric design, not an 1880s carpet; whether the wording was adapted was not stated. | 1125x1125 again, no edge match (left-right correlation 0.34). It also came back with two straight vertical cuts inside the tile where strips look pasted. `make_tileable.py` at 128 fixed the edges but not those cuts. Five runs in a row ignored the 2048 px size and the exact-edge instruction. |
| 2026-10-14 | v2 | Added the "one continuous drawing" sentence and generalized the opening (see above). Re-run on US D 74,141. | 1125x1125 again. No pasted-strip cuts this time (one short straight edge, about 120 px). Left-right edges matched (correlation 0.92); top-bottom did not (0.02). `make_tileable.py --axes=y` at 176 px fixed the vertical edge (top-bottom correlation 0.90). |

## v1 (kept for provenance)

The text used for the eight patterns above and for the first D 74,141 run:

```text
The attached PDF is a US design patent for a carpet from the 1880s. Page 1 is a scanned
sheet containing a black-and-white carpet pattern drawing, surrounded by a printed
header, patent number and date, handwritten notes (such as "Application No."), witness
signatures and scan marks. Page 2 is specification text; ignore it.

Task: extract ONLY the carpet pattern drawing from page 1 and redraw it as a perfectly
seamless, tileable repeat unit that I can use as a repeating background texture.

Step 1, isolate the artwork. Use only the rectangular pattern drawing. Discard the
paper, header, numbers, handwriting, signatures, stamps, scan streaks and edge noise.
The scan may be slightly tilted; straighten it so the grid lines are perfectly
horizontal and vertical.

Step 2, make it tile. Redraw the pattern so it wraps on all four edges: anything
crossing the right edge re-enters at the left edge at the same height, and anything
crossing the top re-enters at the bottom at the same position. The left and right edges
must match exactly, and so must the top and bottom. Where the original is a single
swatch with one large central bouquet or focal motif, rebuild it as a repeat: keep one
full copy near the center and a second copy split across the four corners, so the four
corner pieces join into a whole motif when the tile is repeated. Fill the space between
with the same filler foliage, geometric blocks and grid texture used in the original,
so the surface reads as continuous cloth and not as spots on empty ground.

Step 3, keep the original's look. Use the same motifs and the same drawing style: pure
black ink on pure white, with the same stippled fills, hatching, loom-card pixel grid
and fine square grid lines, at the same overall ink density. Invent no new kinds of
motif. Add no border, frame, text, numbers, shading, gray wash, color or gradient. Edges
stay crisp.

Output: one square image, 2048×2048 px, black on white, showing only the tile. After
generating it, show a 2×2 repetition of the tile beneath it so I can check the seams.
```
