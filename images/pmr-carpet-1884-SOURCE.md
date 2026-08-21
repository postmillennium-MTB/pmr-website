# pmr-carpet-1884-mask.png / pmr-carpet-1884-reference.png

**Source:** US Design Patent No. 14,685 — Eugene A. Crowe, of Boston,
assignor to the Lowell Manufacturing Company, of Lowell, Massachusetts.
"Design for a Carpet" ("design for ingrain or other carpeting... to be
inwrought in Two or Three Ply Ingrain and other Carpeting"). Filed
November 23, 1883. Patented February 19, 1884. Term of patent: 3 years.
https://patentimages.storage.googleapis.com/01/a5/58/2e267a575fc50f/USD14685.pdf

**Public domain:** an 1884 US design patent with a 3-year elected term
lapsed in 1887 — 138+ years expired, and the underlying work is also long
past any copyright term regardless. The scan is the USPTO/Google Patents
reproduction of the original photographic print filed with the
specification, not a separately rights-managed image.

**Why this one tiles:** the specification states the drawing is "the
photographic print accompanying this specification [that] conveys to any
one skilled in the art of carpet weaving a clear understanding of the
same, and is sufficient to enable such person to use my invention" — i.e.
a loom card meant to convey a weave repeat, not a self-contained framed
illustration. Visually the plate is an all-over floral/rosette diaper with
motifs cut off at all four edges and no enclosing border rule, confirmed
by pixel-density scanning (no row/column runs dark near-edge-to-edge the
way a frame rule would).

**How the assets were made:**
1. Rendered the PDF page and located the printed plate's extent by pixel
   density scanning (rows/columns crossing a 10–15% ink-density threshold
   near-continuously mark the block edges), not by eye. Deskewed first —
   the scan carried a slight rotation, empirically ~0.5°.
2. Found the horizontal repeat period empirically via 2-D normalized
   cross-correlation of the ink field against itself: a dominant peak at
   dx=548px (NCC ≈ 0.70) — no comparably strong vertical-only peak, so the
   full plate height (522px) was kept as the vertical repeat. Cropped to
   one repeat unit: 548×522px.
3. Verified seamlessness by tiling 3×3 (both the raw crop and the final
   thresholded version) — floral motifs continue across every boundary
   with no broken shapes or visible seam line.
4. The embedded scan is a **true 1-bit bitonal image** (verified: exactly
   two pixel values, 0/255, at native ~300 DPI) — the "hachure" look is an
   actual halftone dot screen from the 1884 photomechanical print, not a
   grayscale rendering artifact. Because the native repeat unit is only
   ~550×520px (much smaller than a typical 600–800px downscale target),
   it was Lanczos-downscaled *down* to 340×324px — enough reduction to
   average the halftone dots and fine hachure/weave-grid lines into real
   continuous gray tone (confirmed: pure-binary pixel fraction dropped
   from 100% to ~45% after resampling) before thresholding.
5. Otsu-thresholded (threshold level 121) with a soft ±18-level ramp
   rather than a hard cutoff, written out as a transparent RGBA alpha
   mask — ink opaque, paper transparent, RGB left at zero — so any
   element can tint it via `mask-image` + `background-color`, re-tinting
   automatically on theme change.

**Files:**
- `pmr-carpet-1884-mask.png` (340×324px) — the alpha mask, tintable via
  CSS `mask-image` + `background-color`.
- `pmr-carpet-1884-reference.png` — same crop, rendered as near-black ink
  on white, for previewing the pattern without a theme tint applied.

**Ink coverage:** ~62% at the working (downscaled) resolution — this is a
dense, heavily-inked Jacquard-style rosette diaper, drawn to be woven
solid on a floor, not to read at low density. Never display it at full
strength behind body text; apply at low opacity only (3–6%, see CSS
below), same convention as `pmr-carpet-1898`.

**Note on the companion 1898 texture:** this is the *same designer*
(Eugene A. Crowe) fourteen years earlier, for a different assignee
(Lowell Manufacturing Co. rather than E. S. Higgins Carpet Co.) and a
visually distinct rosette/floral diaper rather than the 1898 leaf-scroll
damask — kept as a separate asset (`-1884` suffix) rather than replacing
`pmr-carpet-1898`.
