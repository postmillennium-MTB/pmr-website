# Texture pipeline — turning a historical ornament into a site background tile

How `pmr-carpet-1898-mask.png` was made, written so the process can be repeated
with a different source. See `pmr-carpet-1898-SOURCE.md` for that specific
asset's provenance.

Two things worth knowing before starting, both learned the hard way here:

- **The first source tried for this could not tile at all.** It was a scanned
  Victorian wallpaper, but a *framed panel* — border ornament on all four sides,
  motifs stopping at the edge rather than crossing it. No amount of cropping
  fixes that. Step 1 below is a gate that can fail, for exactly this reason.
- **A correct color value is not the same as a visible one.** An earlier change
  here retinted the archive plate's texture per theme, verified the exact accent
  hex resolved correctly in all five themes, and was still wrong — three of the
  five accents are dark colors, the plate's ground is fixed near-black, and at
  5% opacity the result was invisible. Step 6 asks for a visibility measurement
  against the *actual* ground, not just confirmation that the token resolved.

---

## The reusable prompt

Paste everything below the divider into a **Claude Code session scoped to this
repo** (it needs to run Python for the image work and write files here), with
the new PDF/image attached or its URL substituted in. Self-contained — no prior
context needed.

---

I want to turn the source below into a seamlessly tiling, theme-tintable
background texture for my website.

**SOURCE:** <paste URL, or "see attached file">

Work through this in order. **Stop and report at Step 1 if it fails** — do not
produce a broken tile and call it done.

### Step 1 — Determine whether this can tile AT ALL (do this first)

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

### Step 2 — Crop to exactly one repeat

Find the plate's frame boundaries **by pixel analysis, not by eye** — scan for
rows/columns that are dark across nearly the entire height/width of the plate
(only a continuous frame rule does that; interior artwork doesn't run edge to
edge). Crop to the artwork interior, discarding the frame, caption, reference
letters, signatures, and any page furniture.

If the scan is visibly rotated, deskew before cropping.

### Step 3 — Verify seamlessness empirically

Tile the crop 3×3 and **look at the result.** Motifs must rejoin across every
boundary with no visible seam line and no broken elements. If they don't,
adjust the crop and repeat. Show me this 3×3 check.

### Step 4 — Downscale BEFORE thresholding

This ordering is load-bearing. Engraved/halftone sources carry fine hachure
lines that alias into moiré if you threshold at full resolution and shrink
afterward. Resize first (Lanczos, ~600–800px wide), so the hachures average
into smooth gray, *then* threshold.

### Step 5 — Threshold to a transparent alpha mask

Otsu-threshold the downscaled grayscale, but use a **soft ramp** (roughly ±18
levels around the threshold) rather than a hard cutoff, so fine lines don't go
jagged.

Write RGBA where **alpha = ink, RGB = 0**. The output must be a *mask*, not a
black image — this is what lets it be tinted per theme instead of shipping one
PNG per color scheme.

Report the ink coverage percentage.

### Step 6 — Verify it is actually VISIBLE, per theme

Apply it, then for every theme measure the texture's contrast against the
ground it actually sits on — e.g. screenshot the layer over an empty region
with text/chrome hidden and compare pixel standard deviation across themes. A
theme whose stddev is a fraction of the others is invisible, however correct
its color value is.

Watch for the specific trap: **a dark accent on a dark ground, or a light
accent on a light ground, disappears at these opacities.** If the ground is
fixed while accents vary, either vary the opacity per theme or keep the tint
fixed — don't assume one opacity works everywhere.

Show me a screenshot per theme, on the real surface, not a mockup of a
different surface.

### Step 7 — Deliver

1. `images/<name>-mask.png` — the alpha mask
2. `images/<name>-reference.png` — same crop as visible near-black ink, for previewing
3. `images/<name>-SOURCE.md` — provenance: what it is, who made it, date, why it's
   public domain, the URL, and a summary of how the crop/threshold was derived
4. The CSS, using a masked layer tinted from a theme token:

```css
.texture-field {
  position: absolute; inset: 0; pointer-events: none;
  background-color: var(--accent);       /* a theme token, not a literal */
  opacity: var(--carpet-ink);            /* per-theme, not one constant */
  -webkit-mask-image: url('/images/<name>-mask.png');
          mask-image: url('/images/<name>-mask.png');
  -webkit-mask-repeat: repeat;  mask-repeat: repeat;
  -webkit-mask-size: 520px auto; mask-size: 520px auto;
}
```

### Constraints

- Public domain only. State the reasoning explicitly (publication date, patent
  expiry, etc.), and flag if the *scan* might carry separate rights even when
  the underlying work doesn't.
- Never display at full ink density behind body text. These patterns are drawn
  to be woven or printed at full strength, not read through.
- If any step fails or the result is marginal, tell me plainly rather than
  shipping something that technically renders but looks wrong.

### If the target is postmillenniumrenaissance.com

Five themes (`day`, `spring`, `autumn`, `winter`, `2049`), tokens in
`[data-theme=...]` blocks in `index.html`. Current state of this feature:

- **`.page-carpet`** is the one page-wide layer — absolute, `inset: 0`,
  `z-index: -1`, a child of `<body>` (which is `position: relative`), with the
  canvas background on `<html>` so the layer isn't painted over. Tinted
  `var(--accent)` at `var(--carpet-ink)`, `mask-size: 520px`.
- **`--carpet-ink` is per-theme** (0.055 light, 0.065 for 2049, 0.07 winter) —
  a dark accent on light paper and a light accent on a near-black ground do not
  read the same at equal opacity. To restrengthen a theme, change its
  `--carpet-ink`, not the shared opacity.
- **`.plate-archive` deliberately keeps a fixed `--pl-amber` tint**, not
  `--accent`. Its ground is a fixed near-black `--pl-bg` in every theme, so the
  three dark accents (day, spring, autumn) vanish against it. This was tried
  the other way and reverted; don't "fix" it back without measuring visibility
  on that specific ground first.
- **Don't add a second carpet layer at a different `mask-size`** — it will moiré
  against the page layer's 520px repeat. The footer had its own 300px instance;
  it was removed for this reason.

---

## Sourcing notes

**US design patents are an unusually good vein for this.** Pre-1929 filings are
unambiguously public domain, Google Patents hosts clean scans, and patents for
carpets, textiles, wallpaper and oilcloth are drawn as repeat units by
definition — so they tend to pass Step 1 by construction rather than by luck.

The existing asset came from US Design Patent 28,278 (Crowe, 1898, "Design for
Carpet"), found this way.
