# Postmillennium Renaissance (PMR)

Source for [postmillenniumrenaissance.com](https://www.postmillenniumrenaissance.com) —
Jon Lontai's (RedFoxRun) hub of interactive mountain bike engineering and
trail-economics tools.

## Stack

Static HTML/CSS/JS, no build step, no framework, no `package.json`. Served
by GitHub Pages (see `CNAME`) at the custom domain. Each tool is a
self-contained `index.html` (styles and script inline or same-folder),
following the [PMR build standard](https://github.com/postmillennium-MTB) used
across the org: single file, mobile-first CSS, a contiguous data block, and
confidence-tiered sourcing for anything factual.

> Note: an earlier `CLAUDE.md` in this repo described a Next.js/Tailwind/TypeScript
> stack. That doesn't match what's actually here — this is plain static HTML.
> Treat this README as the current source of truth until that file is updated.

## Structure

- `index.html` — homepage: hero, tool directory, about/advocacy sections.
- One folder per tool/page (`atlas/`, `wheel-lab/`, `suspension-lab/`,
  `roi/`, `geometry/`, `tire-sim/`, `parks-us/`, `parks-ca/`,
  `trail-advocacy-atlas/`, `trail-partnership-atlas/`, `viscosity-ledger/`,
  `headwaters-ledger/`, `weagle/`, `pump-track/`, `metric-clock/`,
  `sports-popularity/`, `singletrack-density/`, `mtb-weight-price/`,
  `MTB-inflation/`, `wheel-comparison-widget2/`, `maintenance/`, `bmx/`,
  `dst/`, `1977/`, `autonomy-paradox/`, `studies/`, `stickers/`, `privacy/`),
  each with its own `index.html`.
- `images/` — shared site assets, including the carpet texture (below).
- `sitemap.xml` / `robots.txt` — SEO, kept in sync with the tool directory.
- `CNAME` — GitHub Pages custom domain pin (`www.postmillenniumrenaissance.com`).

## The carpet texture

The page-wide background weave (`.page-carpet` in `index.html`, and
`.carpet-field` in the plate-archive section) is drawn from an actual
**public-domain patent**:

- **Source:** US Design Patent No. 28,278 — Eugene A. Crowe, assignor to
  the E. S. Higgins Carpet Company. "Design for Carpet." Filed December 27,
  1897; granted February 8, 1898.
- **Status:** design patents of that era ran a 3½/7/14-year term (this one
  elected the 3½-year term), so protection lapsed by 1901 — public domain
  for well over a century. The scan is the USPTO/Google Patents
  reproduction of the drawing, not a rights-managed image.
- **Assets:** `images/pmr-carpet-1898-mask.png` (the transparent alpha mask
  actually used — RGB zeroed, ink opaque/paper transparent — so any element
  can tint it via `mask-image` + `background-color`, which is how it
  re-tints automatically per theme) and `images/pmr-carpet-1898-reference.png`
  (the same crop, kept as a plain near-black reference).
- **Full derivation notes** (DPI, crop boundaries, thresholding, tiling
  verification): `images/pmr-carpet-1898-SOURCE.md`.

Applied at low opacity (5% in current use — see each theme's `--carpet-ink`
token) since the source pattern is dense (~45% ink coverage at native res),
drawn to be walked on, not read as a watermark.

## Local development

No install step. Open `index.html` (or any tool's `index.html`) directly in
a browser, or serve the directory with any static file server, e.g.:

```bash
python3 -m http.server 8000
```

## Deployment

Push to the deployed branch; GitHub Pages serves the repo root directly
using `CNAME` for the custom domain. No CI build step — what's committed is
what ships.
