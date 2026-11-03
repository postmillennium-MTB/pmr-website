#!/usr/bin/env python3
"""Regenerate the three generated (procedural) patterns that are not plain SVG noise.

    python3 tools/make_procedural.py            # all three
    python3 tools/make_procedural.py topo       # or: guilloche, twill

Writes:
  masks/topo-contours.webp       topographic contour map, 800 px, tiles seamlessly
  masks/guilloche-rosettes.webp  guilloche rosette lattice, 800 px, tiles seamlessly
  masks/carbon-twill.css         the --twill-mask-carbon line (a 64 px vector SVG tile)

Each pattern is exactly periodic by construction, so no edge repair is needed:
  topo       a sum of cosines whose wave vectors are whole numbers of cycles per tile,
             so the field (and every contour of it) wraps; contours are drawn as
             anti-aliased lines from the first-order distance to the nearest level.
  guilloche  every rosette is drawn at its own position and at all eight wrapped
             offsets, so a rosette that crosses the edge continues on the other side.
  twill      each tow is a run of two cells; runs that cross the tile edge are drawn
             extended past it (and clipped), so no rounded end shows at the seam.

Alpha = ink, RGB = 0, like tools/make_mask.py, so CSS paints the ink in any color.
Prints the mean alpha of each tile; that is the 'inkCoverage' in patterns.json.
Needs Python 3 with Pillow and numpy.
"""
import pathlib, re, sys
from urllib.parse import quote

import numpy as np
from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent
N = 800  # mask size in px


def save_mask(alpha, path):
    """alpha: float array 0..1 -> lossless WebP, ink opaque, RGB 0."""
    rgba = np.zeros((*alpha.shape, 4), np.uint8)
    rgba[..., 3] = np.round(np.clip(alpha, 0, 1) * 255).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(path, "WEBP", lossless=True, method=6)
    print(f"{path.relative_to(ROOT)}: {alpha.shape[1]}x{alpha.shape[0]}, mean alpha {alpha.mean():.3f} "
          f"(alpha > .5: {(alpha > .5).mean():.3f})")


# ---------------------------------------------------------------- topographic contours
def topo():
    seed, n_waves, expo, levels_across = 42, 12, 1.5, 18
    minor_w, index_w, every = 1.8, 3.4, 5          # line widths in px; every 5th contour is an index contour
    rng = np.random.default_rng(seed)
    cands = [(m, n) for m in range(-4, 5) for n in range(0, 5)
             if (m, n) != (0, 0) and (n > 0 or m > 0) and m * m + n * n <= 17]
    pick = rng.choice(len(cands), n_waves, replace=False)
    waves = [(cands[i][0], cands[i][1], 1.0 / np.hypot(*cands[i]) ** expo, rng.uniform(0, 2 * np.pi))
             for i in pick]                          # integer wave vectors => periodic over the tile
    y, x = np.mgrid[0:N, 0:N].astype(float) + 0.5
    f, gx, gy = np.zeros_like(x), np.zeros_like(x), np.zeros_like(x)
    for m, n, a, ph in waves:
        arg = 2 * np.pi * (m * x + n * y) / N + ph
        f += a * np.cos(arg)
        d = -a * np.sin(arg) * 2 * np.pi / N
        gx += d * m
        gy += d * n
    g = np.hypot(gx, gy) + 1e-9
    step = (f.max() - f.min()) / levels_across
    lev = f / step
    k = np.round(lev)
    dist = np.abs(lev - k) * step / g                # px to the nearest contour (first order)
    w = np.where(k.astype(int) % every == 0, index_w, minor_w)
    save_mask(np.clip(w / 2 + 0.5 - dist, 0, 1), ROOT / "masks" / "topo-contours.webp")


# ---------------------------------------------------------------- guilloche rosettes
def guilloche(S=3, w=1.5):
    def circ(dr, cx, cy, r, lw):
        t = np.linspace(0, 2 * np.pi, 900)
        dr.line(list(zip((cx + r * np.cos(t)) * S, (cy + r * np.sin(t)) * S)),
                fill=0, width=max(1, round(lw * S)), joint="curve")

    def band(dr, cx, cy, c, rho, n):
        """n circles of radius rho with centres on a ring of radius c: a rosette band c-rho .. c+rho"""
        for j in range(n):
            a = 2 * np.pi * j / n
            circ(dr, cx + c * np.cos(a), cy + c * np.sin(a), rho, w)

    def big(dr, cx, cy):                              # on a 400 px square lattice
        band(dr, cx, cy, 128, 72, 26)                 # band from r = 56 to 200
        circ(dr, cx, cy, 201, w * 1.3)                # crisp outer edge
        circ(dr, cx, cy, 55, w * 1.3)                 # inner edge
        band(dr, cx, cy, 22, 22, 12)                  # small flower in the hole

    def small(dr, cx, cy):                            # in the gap between four big ones
        band(dr, cx, cy, 41.5, 41.5, 16)

    im = Image.new("L", (N * S, N * S), 255)
    dr = ImageDraw.Draw(im)
    for ox in (-N, 0, N):                             # wrapped copies: edge rosettes continue across
        for oy in (-N, 0, N):
            for cx in (0, 400):
                for cy in (0, 400):
                    big(dr, cx + ox, cy + oy)
            for cx in (200, 600):
                for cy in (200, 600):
                    small(dr, cx + ox, cy + oy)
    ink = 1 - np.asarray(im.resize((N, N), Image.LANCZOS)) / 255
    save_mask(ink, ROOT / "masks" / "guilloche-rosettes.webp")


# ---------------------------------------------------------------- carbon twill (SVG)
def twill_svg(cell=16, gap=0.8, rx=2.2, warp=(0.95, 0.40), weft=(0.62, 0.22)):
    """2/2 twill. Warp tows (vertical) are the darker ink, weft tows (horizontal) the lighter, so the
    diagonal rib reads in one ink color. Each tow shades from strong edges to a lighter middle."""
    T, w = cell * 4, cell - 2 * gap
    run = cell * 2 - 2 * gap

    def grad(i, vertical, hi, lo):
        x2, y2 = ("0", "1") if vertical else ("1", "0")
        return (f"<linearGradient id='{i}' x1='0' y1='0' x2='{x2}' y2='{y2}'>"
                f"<stop offset='0' stop-color='#fff' stop-opacity='{hi}'/>"
                f"<stop offset='.5' stop-color='#fff' stop-opacity='{lo}'/>"
                f"<stop offset='1' stop-color='#fff' stop-opacity='{hi}'/></linearGradient>")

    def touches(start, length):                       # does a span [start, start + length] overlap the tile 0..T?
        return start < T and start + length > 0

    out = [f"<svg xmlns='http://www.w3.org/2000/svg' width='{T}' height='{T}' viewBox='0 0 {T} {T}'>",
           "<defs>" + grad("a", False, *warp) + grad("b", True, *weft) + "</defs>", "<g fill='url(#a)'>"]
    for i in range(4):                                # warp: a run of 2 cells starting at row (-i) % 4
        j0 = (-i) % 4
        for k in (-1, 0, 1):                          # k = -1 / +1: the wrapped copy of a run that crosses the edge
            y = j0 * cell + gap + k * T
            if touches(y, run):
                out.append(f"<rect x='{i * cell + gap:g}' y='{y:g}' width='{w:g}' height='{run:g}' rx='{rx:g}'/>")
    out.append("</g><g fill='url(#b)'>")
    for j in range(4):                                # weft: a run of 2 cells starting at column (2-j) % 4
        i0 = (2 - j) % 4
        for k in (-1, 0, 1):
            x = i0 * cell + gap + k * T
            if touches(x, run):
                out.append(f"<rect x='{x:g}' y='{j * cell + gap:g}' width='{run:g}' height='{w:g}' rx='{rx:g}'/>")
    out.append("</g></svg>")
    return "".join(out)


def twill():
    svg = twill_svg()
    uri = "data:image/svg+xml," + quote(svg, safe="/:=',.-_()!*;")
    path = ROOT / "masks" / "carbon-twill.css"
    css = path.read_text()
    new, n = re.subn(r'(--twill-mask-carbon\s*:\s*)url\("[^"]*"\)', lambda m: m.group(1) + f'url("{uri}")', css)
    if n != 1:
        raise SystemExit("masks/carbon-twill.css must contain exactly one --twill-mask-carbon: url(\"...\") line")
    path.write_text(new)
    print(f"{path.relative_to(ROOT)}: --twill-mask-carbon updated ({len(uri)} bytes as a data URI)")


JOBS = {"topo": topo, "guilloche": guilloche, "twill": twill}

if __name__ == "__main__":
    want = sys.argv[1:] or list(JOBS)
    for name in want:
        if name not in JOBS:
            raise SystemExit(f"unknown pattern '{name}'; choose from {', '.join(JOBS)}")
        JOBS[name]()
