# Reusable prompt — turn a historical ornament source into a website background tile

Paste everything below the line into a chat, with the PDF/image attached or its
URL substituted in. Works standalone; no prior context needed.

---

I want to turn the source below into a seamlessly tiling, theme-tintable
background texture for my website.

**SOURCE:** <paste URL, or "see attached file">

Work through this in order. **Stop and report at Step 1 if it fails** — do not
produce a broken tile and call it done.

## Step 1 — Determine whether this can tile AT ALL (do this first)

Fetch/open the source and render it at high resolution (for a PDF: ~288 DPI,
e.g. PyMuPDF `get_pixmap(matrix=Matrix(4,4))`). Look at the actual artwork and
decide:

**It CAN tile if** the design is a true repeat unit — motifs deliberately run
off the edges so they rejoin on the opposite side. Textile/carpet/wallpaper
*design patents* are usually drawn this way. Strong signal: the patent
specification references paired letters (B/B′, C/C′) describing motifs that
oppose each other across the repeat.

**It CANNOT tile if** the design is a self-contained framed composition —
border ornament enclosing the artwork on all four sides, motifs stopping at the
edge rather than crossing it. Book plates, endpapers, and single ornamental
panels are like this. Tiling one produces a visible grid of frames.

If it's a framed panel, **say so and stop.** Offer instead: use it once, whole
and large, as a section background or masthead — or find a different source.
Do not crop a framed panel and hope.

## Step 2 — Crop to exactly one repeat

Find the plate's frame boundaries **by pixel analysis, not by eye** — scan for
rows/columns that are dark across nearly the entire height/width of the plate
(only a continuous frame rule does that; interior artwork doesn't run edge to
edge). Crop to the artwork interior, discarding the frame, caption, reference
letters, signatures, and any page furniture.

If the scan is visibly rotated, deskew before cropping.

## Step 3 — Verify seamlessness empirically

Tile the crop 3×3 and **look at the result.** Motifs must rejoin across every
boundary with no visible seam line and no broken elements. If they don't,
adjust the crop and repeat. Show me this 3×3 check.

## Step 4 — Downscale BEFORE thresholding

This ordering is load-bearing. Engraved/halftone sources carry fine hachure
lines that alias into moiré if you threshold at full resolution and shrink
afterward. Resize first (Lanczos, ~600–800px wide), so the hachures average
into smooth gray, *then* threshold.

## Step 5 — Threshold to a transparent alpha mask

Otsu-threshold the downscaled grayscale, but use a **soft ramp** (roughly ±18
levels around the threshold) rather than a hard cutoff, so fine lines don't go
jagged.

Write RGBA where **alpha = ink, RGB = 0**. The output must be a *mask*, not a
black image — this is what lets it be tinted per theme instead of shipping one
PNG per color scheme.

Report the ink coverage percentage.

## Step 6 — Deliver

1. `<name>-mask.png` — the alpha mask
2. `<name>-reference.png` — same crop as visible near-black ink, for previewing
3. `<name>-SOURCE.md` — provenance: what it is, who made it, date, why it's
   public domain, the URL, and a summary of how the crop/threshold was derived
4. The CSS, using a full-bleed absolutely-positioned child:

```css
.texture-field {
  position: absolute; inset: 0; pointer-events: none;
  background-color: var(--accent);   /* a theme token, not a literal */
  opacity: 0.05;                     /* dense patterns need 3–6% */
  -webkit-mask-image: url('/path/to/<name>-mask.png');
          mask-image: url('/path/to/<name>-mask.png');
  -webkit-mask-repeat: repeat;  mask-repeat: repeat;
  -webkit-mask-size: 480px auto; mask-size: 480px auto;
}
```

The parent needs `position: relative`, and real content inside it needs
`position: relative` so it sits above the texture.

5. A rendered screenshot of it applied behind real content in at least two
   different theme colors — one light ground, one dark — so I can judge it in
   context rather than as an isolated swatch.

## Constraints

- Public domain only. State the reasoning explicitly (publication date, patent
  expiry, etc.), and flag if the *scan* might carry separate rights even when
  the underlying work doesn't.
- Never display at full ink density behind body text. These patterns are drawn
  to be woven or printed at full strength, not read through.
- If any step fails or the result is marginal, tell me plainly rather than
  shipping something that technically renders but looks wrong.

---

## Optional — if the target is postmillenniumrenaissance.com

The site has five themes (`day`, `spring`, `autumn`, `winter`, `2049`) whose
tokens live in `[data-theme=...]` blocks in `index.html`. Tint from `--accent`
(or `--bg-rule` / `--text`) and the texture re-colors per theme automatically —
that's the whole point of the mask approach.

Two gotchas that have already bitten this exact feature:

- **Assets go in `images/`**, alongside `pmr-caribou-pattern.png`.
- **A scroll-linked palette-drift script** in `index.html` forces `--accent`
  toward a fixed amber as `#plate-archive` comes into view. Anything inside
  that plate tinted from `--accent` will get overridden right when it's
  on screen. `readBase()` pins the true per-theme value back onto the plate to
  prevent that — if you add a texture inside `#plate-archive`, verify the tint
  actually changes across themes *while scrolled to it*, not just on load.
