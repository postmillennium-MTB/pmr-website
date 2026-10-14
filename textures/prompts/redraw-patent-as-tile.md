# Prompt: redraw a patent drawing as a seamless tile

Saved 2026-10-14. **Used in Google Gemini** (image generation, with the patent PDF
attached) to make the "adapted" Crowe patterns: `crowe-1882-12657`, `-13102`,
`-13483` and `-13105`. See `../PROVENANCE.md` for what was done to each result
afterward.

## How to use

1. Download the patent PDF from Google Patents (the Download PDF link).
2. In Gemini, attach the PDF and paste the prompt below, unchanged.
3. Save the 2048x2048 tile, then follow "Add a pattern" in `../README.md`
   (`make_tileable.py` if the edges do not match, then `make_mask.py`).
4. Add the result to `../patterns.json` with `kind: "adapted"` and a row in
   `../PROVENANCE.md`. Never call it the patent's own drawing.

## The prompt

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

## What it did not do reliably

From `../PROVENANCE.md`: the "left and right edges must match exactly" instruction was
not met on its own. Every adapted tile needed its edges repaired with
`tools/make_tileable.py`, and the repairs left doubled grid lines where a cut crossed
them and partly re-cut the central motif (13,102 most of all). The match between each
result and its source patent was made by eye. US D 13,106 did not give a usable tile.
Only designs that are a single swatch need this prompt: a drawing that already repeats
(like US D 14,685) is cropped directly instead.

## Ideas to try (untested)

These are suggestions, not tested changes. Change one at a time and log it below.

- Ask for 1024x1024 instead of 2048: the mask pipeline downsamples to 800 px anyway, and
  a smaller canvas may hold the edge match better.
- Ask for the 2x2 check as a separate second image, so the tile itself is delivered
  clean with no preview attached.
- Ask for the output with a fixed ink-density target taken from the original (a mask's
  "ink coverage" in `../patterns.json` is 49-66% for the current set).
- If a seam still shows, re-prompt with the shifted-by-half check image and ask for only
  the seam region to be redrawn.

## Revision log

| Date | Change | Result |
|---|---|---|
| 2026-10-14 | First version saved (the text above, as used in Gemini). | Used for the four adapted patterns. |
