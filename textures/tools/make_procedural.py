#!/usr/bin/env python3
"""Regenerate the generated (procedural) patterns that are not plain SVG noise.

    python3 tools/make_procedural.py            # all four
    python3 tools/make_procedural.py topo       # or: guilloche, twill, trail

Writes:
  masks/topo-contours.webp       topographic contour map, 800 px, tiles seamlessly
  masks/guilloche-rosettes.webp  guilloche rosette lattice, 800 px, tiles seamlessly
  masks/carbon-twill.css         the --twill-mask-carbon line (a 64 px vector SVG tile)
  masks/switchback-trail.webp    two dashed switchback trails, 800 px, tiles seamlessly

Each pattern is exactly periodic by construction, so no edge repair is needed:
  topo       a sum of cosines whose wave vectors are whole numbers of cycles per tile,
             so the field (and every contour of it) wraps; contours are drawn as
             anti-aliased lines from the first-order distance to the nearest level.
  guilloche  every rosette is drawn at its own position and at all eight wrapped
             offsets, so a rosette that crosses the edge continues on the other side.
  twill      each tow is a run of two cells; runs that cross the tile edge are drawn
             extended past it (and clipped), so no rounded end shows at the seam.
  trail      two dashed switchback trails, each a zigzag that advances exactly one tile
             height per period and is drawn past both edges. The dash period is chosen
             so a whole number of dashes fits in one period, and the dashes are drawn
             one by one (not with an SVG dash array, whose phase depends on the browser),
             so they line up across the seam. Made to sit on topo-contours at the same size.

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


# ---------------------------------------------------------------- switchback trail
# Two dashed trails, each a zigzag that advances exactly one tile height (N px) per period. Per trail:
# (left apex xs, right apex xs, apexes per tile (even), y of the first apex, hairpin radius). The x lists repeat, so a
# trail is slightly uneven but exactly periodic. A is wide, B narrow, with different rhythms, in different columns.
TRAILS = {
    "A": ([128, 112, 140, 120, 150, 118], [386, 410, 372, 398, 380, 404], 12, 22.0, 15.0),
    "B": ([566, 580, 560, 574, 568], [706, 722, 712, 730, 716], 10, 74.0, 13.0),
}
TRAIL_WIDTH, TRAIL_DASH, TRAIL_PERIOD = 4.2, 15.0, 24.0   # stroke px; visible dash px (round caps included); target period px


def _trail_vertices(xl, xr, n_apex, y0, apex_r, bulge=9.0, mid_r=250.0):
    """Zigzag vertices: an apex, then a midpoint bowed off the straight leg by `bulge` px, for apex k = -1 .. n_apex + 1
    (one apex of margin past each tile edge, so every arc the tile can see is a full arc)."""
    dy = N / n_apex

    def apex_x(k):
        j = k % n_apex
        xs = xr if j % 2 == 0 else xl
        return xs[(j // 2) % len(xs)]

    pts, rad = [], []
    for k in range(-1, n_apex + 2):
        (x, y), (x2, y2) = (apex_x(k), y0 + k * dy), (apex_x(k + 1), y0 + (k + 1) * dy)
        pts.append((x, y))
        rad.append(apex_r)
        L = np.hypot(x2 - x, y2 - y)
        nx, ny = -(y2 - y) / L, (x2 - x) / L
        sg = 1 if k % 2 == 0 else -1
        pts.append(((x + x2) / 2 + sg * bulge * nx, (y + y2) / 2 + sg * bulge * ny))
        rad.append(mid_r)
    return pts, rad


def _path_points(pts, radii, step=0.25):
    """Dense polyline (about `step` px apart) of the zigzag with every interior vertex rounded by a tangent circular arc.
    Returns (points, at) where at[i] is the index just after vertex i's arc (the end vertices have none)."""
    P = [np.array(p, float) for p in pts]
    n = len(P)
    unit = lambda v: v / np.linalg.norm(v)
    t, theta = [0.0] * n, [0.0] * n
    for i in range(1, n - 1):
        theta[i] = np.arccos(np.clip(np.dot(unit(P[i - 1] - P[i]), unit(P[i + 1] - P[i])), -1, 1))   # interior angle
        t[i] = radii[i] / np.tan(theta[i] / 2)                  # how far back along each leg the arc starts
    for i in range(n - 1):
        if t[i] + t[i + 1] > np.linalg.norm(P[i + 1] - P[i]) - 1e-6:
            raise SystemExit(f"trail: arcs overlap on segment {i}; lower a radius")

    def line(a, b):
        k = max(2, int(np.ceil(np.linalg.norm(b - a) / step)) + 1)
        return list(np.linspace(a, b, k)[1:])

    out, at, cur = [P[0]], [0] * n, P[0]
    for i in range(1, n - 1):
        u1, u2 = unit(P[i - 1] - P[i]), unit(P[i + 1] - P[i])
        p1, p2 = P[i] + u1 * t[i], P[i] + u2 * t[i]
        out += line(cur, p1)
        c = P[i] + unit(u1 + u2) * radii[i] / np.sin(theta[i] / 2)   # arc center, on the bisector
        a1, a2 = np.arctan2(*(p1 - c)[::-1]), np.arctan2(*(p2 - c)[::-1])
        da = (a2 - a1 + np.pi) % (2 * np.pi) - np.pi                  # the short way round
        m = max(2, int(np.ceil(radii[i] * abs(da) / step)) + 1)
        out += [c + radii[i] * np.array([np.cos(a), np.sin(a)]) for a in a1 + da * np.linspace(0, 1, m)[1:]]
        cur, at[i] = p2, len(out)
    out += line(cur, P[-1])
    return np.array(out), at


def trail(S=4):
    im = Image.new("L", (N * S, N * S), 0)
    dr = ImageDraw.Draw(im)
    w, info = TRAIL_WIDTH, {}
    for name, (xl, xr, n, y0, ar) in TRAILS.items():
        pts, rad = _trail_vertices(xl, xr, n, y0, ar)
        path, at = _path_points(pts, rad)
        s = np.concatenate([[0.0], np.cumsum(np.hypot(*np.diff(path, axis=0).T))])
        length = s[at[2 + 2 * n]] - s[at[2]]                       # one period, apex 0 to apex n, measured on these samples
        period = length / round(length / TRAIL_PERIOD)             # a whole number of dashes per period => same phase every tile
        info[name] = (length, period)
        # dashes are drawn explicitly (not with an SVG stroke-dasharray): where a renderer puts dashes along an arc depends
        # on its own length estimate, which differs between browsers and by about 1 px per tile here; these positions do not
        a = s[at[2]] - period * np.ceil((s[at[2]] - s[0]) / period)   # a dash start phase-aligned with the apex-0 arc end
        starts = np.arange(a, s[-1], period)
        on = TRAIL_DASH - w                                        # round caps add w/2 at each end
        for s0 in starts:
            lo, hi = max(s0, s[0]), min(s0 + on, s[-1])
            if hi <= lo:
                continue
            seg = [np.array([np.interp(q, s, path[:, 0]), np.interp(q, s, path[:, 1])]) for q in (lo, hi)]
            inside = path[(s > lo) & (s < hi)]
            xy = [tuple(v * S) for v in [seg[0], *inside, seg[1]]]
            dr.line(xy, fill=255, width=round(w * S), joint="curve")
            for v in (seg[0], seg[1]):
                dr.ellipse([v[0] * S - w * S / 2, v[1] * S - w * S / 2, v[0] * S + w * S / 2, v[1] * S + w * S / 2], fill=255)
    ink = np.asarray(im.resize((N, N), Image.BOX)) / 255
    save_mask(ink, ROOT / "masks" / "switchback-trail.webp")
    print("  " + "; ".join(f"trail {k}: {v[0]:.1f} px per tile in {round(v[0] / v[1])} dashes of {v[1]:.3f} px" for k, v in info.items()))


JOBS = {"topo": topo, "guilloche": guilloche, "twill": twill, "trail": trail}

if __name__ == "__main__":
    want = sys.argv[1:] or list(JOBS)
    for name in want:
        if name not in JOBS:
            raise SystemExit(f"unknown pattern '{name}'; choose from {', '.join(JOBS)}")
        JOBS[name]()
