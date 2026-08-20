# pmr-carpet-1898-mask.png / pmr-carpet-1898-reference.png

**Source:** US Design Patent No. 28,278 — Eugene A. Crowe, assignor to the
E. S. Higgins Carpet Company, of New York, N. Y. "Design for Carpet."
Filed December 27, 1897. Patented February 8, 1898.
https://patentimages.storage.googleapis.com/ed/c9/5a/35d2e6ad912c44/USD28278.pdf

**Public domain:** design patents of this era ran a 3½/7/14-year term (this
one elected 3½), so protection lapsed by 1901 — well over a century expired.
The scan itself is the USPTO/Google Patents reproduction, not a rights-managed
image.

**Why this one:** the drawing carries reference letters (B/B′, C/C′) that the
specification explicitly ties to the weave repeat — "opposing triangular
fanciful groups of leaves B and B′," "minor groupings C and C′" — i.e. it's a
loom card already drawn as one true repeat unit, not an illustration that
happens to look tileable.

**How the assets were made:**
1. Rendered the PDF at 288 DPI, located the plate's frame boundaries by pixel
   analysis (not by eye), cropped to exactly one repeat: 933×1549px.
2. Verified seamlessness by tiling 3×3 — the corner leaf clusters (B/B′,
   C/C′) rejoin correctly across the boundary.
3. Downscaled to 800px wide with Lanczos resampling *before* thresholding,
   so the fine engraving hachures average into clean gray instead of
   aliasing into moiré.
4. Otsu-thresholded with a soft ±18-level ramp (not a hard cutoff) and
   written out as a transparent alpha mask — ink opaque, paper transparent,
   RGB left at zero — so any element can tint it via `mask-image` +
   `background-color`, re-tinting automatically on theme change.

**Files:**
- `pmr-carpet-1898-mask.png` — the alpha mask actually used on the site
  (`.carpet-field` / `.footer-carpet` in `index.html`).
- `pmr-carpet-1898-reference.png` — same crop/mask, kept as a plain
  near-black-ink reference if you want to see it without a theme tint.

**Ink coverage:** ~45% at native resolution — deliberately dense, since a
19th-century damask carpet pattern is drawn to be worn on the floor, not
sit at 5% opacity as a website watermark. Always apply at low opacity
(the two current uses sit at 5%) rather than displaying at full strength
behind body text.
