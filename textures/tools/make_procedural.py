#!/usr/bin/env python3
"""Regenerate the generated (procedural) patterns that are not plain SVG noise.

    python3 tools/make_procedural.py            # all four
    python3 tools/make_procedural.py topo       # or: guilloche, twill, trail

Writes:
  masks/topo-contours.webp       topographic contour map, 800 px, tiles seamlessly
  masks/guilloche-rosettes.webp  guilloche rosette lattice, 800 px, tiles seamlessly
  masks/carbon-twill.css         the --twill-mask-carbon line (a 64 px vector SVG tile)
  masks/switchback-trail.webp    three dashed switchback loops routed over the topo terrain, 800 px, tiles seamlessly

Each pattern is exactly periodic by construction, so no edge repair is needed:
  topo       a sum of cosines whose wave vectors are whole numbers of cycles per tile,
             so the field (and every contour of it) wraps; contours are drawn as
             anti-aliased lines from the first-order distance to the nearest level.
  guilloche  every rosette is drawn at its own position and at all eight wrapped
             offsets, so a rosette that crosses the edge continues on the other side.
  twill      each tow is a run of two cells; runs that cross the tile edge are drawn
             extended past it (and clipped), so no rounded end shows at the seam.
  trail      three closed trail loops routed over the same terrain as the contours (a grade-
             limited climb up a steep face, which makes switchbacks, and an efficient
             return). Loops that cross a tile edge are drawn at every wrapped offset. The
             dash period is chosen so a whole number of dashes closes each loop, and the
             dashes are drawn one by one (not with an SVG dash array, whose phase depends
             on the browser). Made to sit on topo-contours at the same size.

Alpha = ink, RGB = 0, like tools/make_mask.py, so CSS paints the ink in any color.
Prints the mean alpha of each tile; that is the 'inkCoverage' in patterns.json.
Needs Python 3 with Pillow and numpy.
"""
import functools, heapq, math, pathlib, re, sys
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


# ---------------------------------------------------------------- terrain shared by the contours and the trail
# One periodic terrain, so the switchback trail is routed over exactly the hills the contours draw.
TOPO_SEED, TOPO_WAVES, TOPO_EXPO, TOPO_LEVELS = 42, 12, 1.5, 18


def _topo_waves():
    rng = np.random.default_rng(TOPO_SEED)
    cands = [(m, n) for m in range(-4, 5) for n in range(0, 5)
             if (m, n) != (0, 0) and (n > 0 or m > 0) and m * m + n * n <= 17]
    pick = rng.choice(len(cands), TOPO_WAVES, replace=False)
    return [(cands[i][0], cands[i][1], 1.0 / np.hypot(*cands[i]) ** TOPO_EXPO, rng.uniform(0, 2 * np.pi))
            for i in pick]                           # integer wave vectors => periodic over the tile


def _terrain(x, y):
    """Elevation and its gradient (per px) at points x, y (px), for scalars or arrays."""
    x, y = np.asarray(x, float), np.asarray(y, float)
    f, gx, gy = np.zeros(x.shape), np.zeros(x.shape), np.zeros(x.shape)
    for m, n, a, ph in _topo_waves():
        arg = 2 * np.pi * (m * x + n * y) / N + ph
        f += a * np.cos(arg)
        d = -a * np.sin(arg) * 2 * np.pi / N
        gx += d * m
        gy += d * n
    return f, gx, gy


def _contour_step():
    """Elevation of one contour interval (the relief over the tile divided into TOPO_LEVELS)."""
    y, x = np.mgrid[0:N, 0:N].astype(float) + 0.5
    f = _terrain(x, y)[0]
    return (f.max() - f.min()) / TOPO_LEVELS


# ---------------------------------------------------------------- topographic contours
def topo():
    minor_w, index_w, every = 1.8, 3.4, 5          # line widths in px; every 5th contour is an index contour
    y, x = np.mgrid[0:N, 0:N].astype(float) + 0.5
    f, gx, gy = _terrain(x, y)
    g = np.hypot(gx, gy) + 1e-9
    step = (f.max() - f.min()) / TOPO_LEVELS
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
# Three loops, each routed over the terrain above the way a trail builder (or a deer) would pick a line:
#   climb   a steep, straight face is climbed from its foot to its top by a route that may never exceed a maximum
#           grade and is confined to a corridor around the fall line. The grade limit forces it to traverse across the
#           face, so it runs roughly along the contours; the corridor forces it to double back: switchbacks.
#   return  the way back is the cheapest route that keeps clear of the climb, with a steeper limit (riders descend
#           steeper than they climb): an efficient line that contours around the hillside.
# Cost is distance, plus penalties for side slope and for grade, plus a turning penalty. Without the turning penalty
# every zigzag that climbs at the limit costs the same, and the cheapest "switchback" is a saw-tooth of tiny legs; with
# it, the cheapest climb has the fewest turns, so long legs and hairpins at the edge of the corridor. Routes are found
# on a 4 px grid with 16 headings, reduced to their legs (Douglas-Peucker), and every corner is rounded by a tangent arc.
TRAIL = dict(grid=4, gmax_up=0.0042, gmax_down=0.0068, corridor=60.0, gain=7.5, turn_px=100.0, side_w=1.0, grade_w=0.3,
             simplify=6.0, radius=6.0, avoid=30.0, window=200.0)
TRAIL_STARTS = [(420.0, 160.0), (40.0, 420.0), (330.0, 740.0)]   # foot of each climb, px; `trail --find` lists faces
TRAIL_WIDTH, TRAIL_DASH, TRAIL_PERIOD = 3.2, 11.0, 17.0   # stroke px; visible dash px (round caps included); target period px
_DIRS = sorted([(dx, dy) for dx in range(-2, 3) for dy in range(-2, 3)
                if (dx, dy) != (0, 0) and math.gcd(abs(dx), abs(dy)) == 1], key=lambda v: math.atan2(v[1], v[0]))


@functools.lru_cache(None)
def _scalar_waves():
    return tuple(_topo_waves())


def _slope(x, y):
    """Scalar elevation and gradient at one point (pure Python, for the fall-line tracing and the face search)."""
    f = gx = gy = 0.0
    k = 2 * math.pi / N
    for m, n, a, ph in _scalar_waves():
        arg = k * (m * x + n * y) + ph
        f += a * math.cos(arg)
        d = -a * math.sin(arg) * k
        gx += d * m
        gy += d * n
    return f, gx, gy


def _fall_line(x, y, gain, ds=2.0, band=None):
    """Follow the uphill direction from (x, y) until `gain` of elevation is climbed. Returns the points, or None if
    `band` = (min, max) slope is given and the line leaves it, or never climbs that far."""
    f0 = _slope(x, y)[0]
    pts = [(x, y)]
    for _ in range(600):
        f, gx, gy = _slope(x, y)
        g = math.hypot(gx, gy)
        if band and not band[0] <= g <= band[1]:
            return None
        x, y = x + ds * gx / g, y + ds * gy / g
        pts.append((x, y))
        if _slope(x, y)[0] - f0 >= gain:
            return np.array(pts)
    return None


def trail_find():
    """List steep, straight faces to start a climb from: each is a fall line of TRAIL['gain'] contour intervals that
    stays in a steep band and is nearly straight. Prints the foot of the face (what TRAIL_STARTS holds)."""
    gain, found = TRAIL["gain"] * _contour_step(), []
    for y0 in range(0, N, 10):
        for x0 in range(0, N, 10):
            P = _fall_line(float(x0), float(y0), gain, band=(0.0075, 0.0175))
            if P is None:
                continue
            arc = float(np.hypot(*np.diff(P, axis=0).T).sum())
            if 70 <= arc <= 300 and np.hypot(*(P[-1] - P[0])) / arc >= 0.93:
                found.append((arc, x0, y0, P[-1]))
    kept = []
    for f in sorted(found, reverse=True):
        if all(math.hypot(f[1] - k[1], f[2] - k[2]) > 90 for k in kept):
            kept.append(f)
    print(f"{len(kept)} distinct steep, straight faces ({TRAIL['gain']:g} contour intervals of climb); foot (x, y) -> top:")
    for arc, x0, y0, top in kept[:14]:
        print(f"  ({x0}, {y0}) -> ({top[0]:.0f}, {top[1]:.0f}), fall line {arc:.0f} px")


def _dist_to_polyline(X, Y, P):
    pts = []
    for a, b in zip(P[:-1], P[1:]):
        pts += list(np.linspace(a, b, max(2, int(np.hypot(*(b - a)) / 2) + 1)))
    d = np.full(X.shape, 1e9)
    for q in pts:
        d = np.minimum(d, np.hypot(X - q[0], Y - q[1]))
    return d


def _route(A, B, box, allowed, mult, gmax, field):
    """Least-cost route from A to B (px, unwrapped) over the window `box`, on a grid with 16 headings.
    `allowed` and `mult` are arrays over the window's nodes; a move is forbidden above grade `gmax`."""
    c, (M, F, GX, GY, gref) = TRAIL["grid"], field
    nd, ang = len(_DIRS), [math.atan2(dy, dx) for dx, dy in _DIRS]
    length = [math.hypot(dx, dy) * c for dx, dy in _DIRS]
    turn = [[TRAIL["turn_px"] * (abs((ang[b] - ang[a] + math.pi) % (2 * math.pi) - math.pi) / math.pi) ** 2
             for b in range(nd)] for a in range(nd)]
    ix0, iy0 = int(box[0] // c), int(box[1] // c)
    w, h = int(box[2] // c) - ix0 + 1, int(box[3] // c) - iy0 + 1
    sx, sy = round(A[0] / c) - ix0, round(A[1] / c) - iy0
    tx, ty = round(B[0] / c) - ix0, round(B[1] / c) - iy0
    inf, dist, prev = 1e18, [1e18] * (w * h * nd), [-1] * (w * h * nd)
    pq = [(0.0, (sy * w + sx) * nd + d) for d in range(nd)]
    for _, s in pq:
        dist[s] = 0.0
    heapq.heapify(pq)
    goal = None
    while pq:
        cost, s = heapq.heappop(pq)
        if cost > dist[s]:
            continue
        d0, cell = s % nd, s // nd
        x, y = cell % w, cell // w
        if x == tx and y == ty:
            goal = s
            break
        px, py = (ix0 + x) % M, (iy0 + y) % M
        fp, gxp, gyp = F[py][px], GX[py][px], GY[py][px]
        for d1 in range(nd):
            dx, dy = _DIRS[d1]
            nx, ny = x + dx, y + dy
            if nx < 0 or ny < 0 or nx >= w or ny >= h or not allowed[ny][nx]:
                continue
            ax, ay = (ix0 + nx) % M, (iy0 + ny) % M
            grade = abs(F[ay][ax] - fp) / length[d1]
            if grade > gmax:
                continue
            gxm, gym = 0.5 * (gxp + GX[ay][ax]), 0.5 * (gyp + GY[ay][ax])
            side = abs(gxm * dy - gym * dx) / math.hypot(dx, dy)        # slope across the direction of travel
            nc = cost + length[d1] * (1 + TRAIL["grade_w"] * (grade / gmax) ** 2
                                      + TRAIL["side_w"] * (side / gref) ** 2) * mult[ny][nx] + turn[d0][d1]
            ns = (ny * w + nx) * nd + d1
            if nc < dist[ns]:
                dist[ns], prev[ns] = nc, s
                heapq.heappush(pq, (nc, ns))
    if goal is None:
        raise SystemExit(f"trail: no route from {A} to {B} under grade {gmax}; widen the corridor or raise the limit")
    out, s = [], goal
    while s != -1:
        out.append(((ix0 + (s // nd) % w) * c, (iy0 + (s // nd) // w) * c))
        s = prev[s]
    pts = np.array(out[::-1], float)
    keep = [0] + [i for i in range(1, len(pts)) if (pts[i] != pts[i - 1]).any()]
    return pts[keep]


def _simplify(P, eps):
    """Douglas-Peucker: keep only the vertices that deviate more than eps px from the straight line between kept ones."""
    P = np.asarray(P, float)

    def rec(i, j):
        a, ab = P[i], P[j] - P[i]
        ln = np.hypot(*ab)
        mid = P[i + 1:j]
        d = np.hypot(*(mid - a).T) if ln == 0 else np.abs(ab[0] * (mid[:, 1] - a[1]) - ab[1] * (mid[:, 0] - a[0])) / ln
        if len(d) == 0 or d.max() <= eps:
            return [i, j]
        k = i + 1 + int(d.argmax())
        return rec(i, k)[:-1] + rec(k, j)
    return P[rec(0, len(P) - 1)]


def _round_corners(P, r, step=0.25):
    """Dense polyline of P with every interior corner rounded by a tangent circular arc of radius r (smaller where the
    legs are too short to fit it). Corners that are almost straight, or fold back on themselves, are left alone."""
    n = len(P)
    unit = lambda v: v / np.linalg.norm(v)
    t, rad, th = [0.0] * n, [0.0] * n, [0.0] * n
    for i in range(1, n - 1):
        th[i] = np.arccos(np.clip(np.dot(unit(P[i - 1] - P[i]), unit(P[i + 1] - P[i])), -1, 1))
        if 0.12 <= th[i] <= np.pi - 0.02:
            rad[i] = r
            t[i] = r / np.tan(th[i] / 2)
    for _ in range(8):                               # shrink radii until every fillet fits on both of its legs
        fits = True
        for i in range(n - 1):
            seg = np.linalg.norm(P[i + 1] - P[i])
            if t[i] + t[i + 1] > 0.98 * seg:
                fits, k = False, 0.98 * seg / (t[i] + t[i + 1])
                for j in (i, i + 1):
                    if 0 < j < n - 1 and rad[j] > 0:
                        rad[j] *= k
                        t[j] = rad[j] / np.tan(th[j] / 2)
        if fits:
            break

    def line(a, b):
        return list(np.linspace(a, b, max(2, int(np.ceil(np.linalg.norm(b - a) / step)) + 1))[1:])
    out, cur = [P[0]], P[0]
    for i in range(1, n - 1):
        if rad[i] <= 0:
            out += line(cur, P[i])
            cur = P[i]
            continue
        u1, u2 = unit(P[i - 1] - P[i]), unit(P[i + 1] - P[i])
        p1, p2 = P[i] + u1 * t[i], P[i] + u2 * t[i]
        out += line(cur, p1)
        c = P[i] + unit(u1 + u2) * rad[i] / np.sin(th[i] / 2)         # arc center, on the bisector
        a1, a2 = np.arctan2(*(p1 - c)[::-1]), np.arctan2(*(p2 - c)[::-1])
        da = (a2 - a1 + np.pi) % (2 * np.pi) - np.pi
        m = max(2, int(np.ceil(rad[i] * abs(da) / step)) + 1)
        out += [c + rad[i] * np.array([np.cos(a), np.sin(a)]) for a in a1 + da * np.linspace(0, 1, m)[1:]]
        cur = p2
    out += line(cur, P[-1])
    return np.array(out)


def _trail_loop(start, field):
    """One loop: a corridor-confined climb up the face that starts at `start`, and an efficient return."""
    c = TRAIL["grid"]
    face = _fall_line(start[0], start[1], TRAIL["gain"] * _contour_step())
    if face is None:
        raise SystemExit(f"trail: the fall line from {start} never climbs {TRAIL['gain']} contour intervals")
    A, B = face[0], face[-1]

    def window(lo, hi):
        xs, ys = np.arange(int(lo[0] // c), int(hi[0] // c) + 1) * c, np.arange(int(lo[1] // c), int(hi[1] // c) + 1) * c
        return np.meshgrid(xs, ys)
    pad = TRAIL["corridor"] + 12
    lo, hi = face.min(axis=0) - pad, face.max(axis=0) + pad
    X, Y = window(lo, hi)
    up = _route(A, B, (*lo, *hi), (_dist_to_polyline(X, Y, face) <= TRAIL["corridor"]).tolist(),
                np.ones(X.shape).tolist(), TRAIL["gmax_up"], field)
    mid = (A + B) / 2
    lo, hi = mid - TRAIL["window"], mid + TRAIL["window"]
    X, Y = window(lo, hi)
    clear = np.clip(1 - _dist_to_polyline(X, Y, up) / TRAIL["avoid"], 0, 1) * 8.0     # keep the return off the climb...
    clear[np.minimum(np.hypot(X - A[0], Y - A[1]), np.hypot(X - B[0], Y - B[1])) < 30] = 0.0   # ...except at its ends
    down = _route(B, A, (*lo, *hi), np.ones(X.shape, bool).tolist(), (1 + clear).tolist(), TRAIL["gmax_down"], field)
    legs_up, legs_down = _simplify(up, TRAIL["simplify"]), _simplify(down, TRAIL["simplify"])
    corners = np.vstack([legs_up, legs_down[1:-1]])               # the loop's corners, A -> B -> A
    m0 = (corners[-1] + corners[0]) / 2                           # start mid-leg so every corner can be rounded
    path = _round_corners(np.vstack([m0, corners, m0]), TRAIL["radius"])
    turns = sum(1 for i in range(1, len(legs_up) - 1)
                if np.degrees(np.arccos(np.clip(np.dot(legs_up[i - 1] - legs_up[i], legs_up[i + 1] - legs_up[i]) /
                                                np.linalg.norm(legs_up[i - 1] - legs_up[i]) /
                                                np.linalg.norm(legs_up[i + 1] - legs_up[i]), -1, 1))) < 60)
    return path, turns, B                                          # B: the top of the face, where the climb ends


def trail(S=4):
    c = TRAIL["grid"]
    M = N // c
    ys, xs = np.mgrid[0:M, 0:M]
    f, gx, gy = _terrain(xs * c, ys * c)                          # node (i, j) is at x = j c, y = i c
    field = (M, f.tolist(), gx.tolist(), gy.tolist(), float(np.median(np.hypot(gx, gy))))
    im = Image.new("L", (N * S, N * S), 0)
    dr = ImageDraw.Draw(im)
    w, report = TRAIL_WIDTH, []
    for start in TRAIL_STARTS:
        path, turns, _ = _trail_loop(start, field)
        s = np.concatenate([[0.0], np.cumsum(np.hypot(*np.diff(path, axis=0).T))])
        total = s[-1]
        period = total / round(total / TRAIL_PERIOD)              # a whole number of dashes round the loop, so they close up
        report.append(f"loop from {start}: {total:.0f} px, {turns} sharp turns on the climb, {round(total / period)} dashes of {period:.3f} px")
        on = TRAIL_DASH - w                                       # round caps add w/2 at each end
        # dashes are drawn one by one (not an SVG stroke-dasharray): where a renderer puts dashes along an arc follows its own
        # length estimate, which differs between browsers (about 1 px per tile in Chromium); these positions do not
        dashes = []
        for i in range(round(total / period)):
            lo, hi = i * period, i * period + on
            ends = [np.array([np.interp(q, s, path[:, 0]), np.interp(q, s, path[:, 1])]) for q in (lo, hi)]
            dashes.append(np.vstack([ends[0], path[(s > lo) & (s < hi)], ends[1]]))
        kx0, kx1 = math.floor(-path[:, 0].max() / N), math.ceil((N - path[:, 0].min()) / N)
        ky0, ky1 = math.floor(-path[:, 1].max() / N), math.ceil((N - path[:, 1].min()) / N)
        for kx in range(kx0, kx1 + 1):                            # wrapped copies: a loop that crosses an edge continues across it
            for ky in range(ky0, ky1 + 1):
                for d in dashes:
                    xy = [((x + kx * N) * S, (y + ky * N) * S) for x, y in d]
                    dr.line(xy, fill=255, width=round(w * S), joint="curve")
                    for x, y in (xy[0], xy[-1]):
                        dr.ellipse([x - w * S / 2, y - w * S / 2, x + w * S / 2, y + w * S / 2], fill=255)
    save_mask(np.asarray(im.resize((N, N), Image.BOX)) / 255, ROOT / "masks" / "switchback-trail.webp")
    print("  " + "\n  ".join(report))


JOBS = {"topo": topo, "guilloche": guilloche, "twill": twill, "trail": trail}

if __name__ == "__main__":
    if "--find" in sys.argv:
        trail_find()
        raise SystemExit
    want = [a for a in sys.argv[1:] if not a.startswith("--")] or list(JOBS)
    for name in want:
        if name not in JOBS:
            raise SystemExit(f"unknown pattern '{name}'; choose from {', '.join(JOBS)}")
        JOBS[name]()
