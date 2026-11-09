#!/usr/bin/env python3
"""Force a pattern image to wrap on all four edges (minimum-error-cut quilting).

    python3 tools/make_tileable.py input.png output.png [band_px] [--axes=xy|y|x]
                                   [--avoid-ink=LAMBDA] [--ground=LEVEL] [--keep-tone] [--color]

Joins the bottom band to the top band along the lowest-error path, then does the
same left to right. Output is band_px smaller each way. Check the result by
shifting it half its width and height with wraparound: no straight seam should
show through the middle. band_px 96-160 works best; try a few and compare. --axes=y repairs only the top/bottom
edges (use it when the left/right edges already match; see ADD-A-PATTERN.md).

For figurative art (animals, plants, lettering) the plain cut can run through a motif
and leave slivers of it floating in the ground. Two optional flags change that and
leave every other use of this script exactly as it was:
  --avoid-ink=LAMBDA  adds LAMBDA * (distance of the brighter-or-darker pixel from the
                      ground level)^2 to the cost of cutting through each pixel, so the
                      cut prefers bare ground. 1.0 is a good start; 0 (default) is off.
  --ground=LEVEL      grey level (0-255) of the bare ground. Default: the image median,
                      which is right whenever the ground covers most of the tile.
  --keep-tone         save the repaired grey image as it is. By default the output is
                      thresholded to pure black and white, which is right for line art
                      and wrong for a continuous-tone image that will become a tonal mask
                      (see tools/make_mask.py --tone).
  --color             repair a colour picture. The cut is found from the grey (luminance)
                      image exactly as above, then applied to all three colour channels, so
                      the repaired picture is the same one the grey repair gives, in colour.
                      Saved as a colour PNG. Use it when a second mask will be cut from the
                      colour (make_mask.py --accent), so that mask lines up with the grey one.
"""
import sys
import numpy as np
from PIL import Image


def _find_cut(A, B, avoid=0.0, ground=None):
    """The minimum-error cut across the B-row overlap of A's bottom and top bands: one row per column."""
    H, W = A.shape
    top, bot = A[:B].astype(float), A[H - B:].astype(float)
    err = (top - bot) ** 2
    if avoid:
        g = float(np.median(A)) if ground is None else float(ground)
        far = np.maximum(np.abs(top - g), np.abs(bot - g))
        err = err + avoid * far ** 2
    err = np.apply_along_axis(lambda r: np.convolve(r, np.ones(5) / 5, mode="same"), 1, err)
    cost = np.full((B, W), np.inf)
    cost[:, 0] = err[:, 0]
    back = np.zeros((B, W), int)
    for x in range(1, W):
        for dy in (-1, 0, 1):
            prev = np.roll(cost[:, x - 1], dy)
            if dy == -1: prev[-1] = np.inf
            if dy == 1: prev[0] = np.inf
            cand = prev + err[:, x]
            better = cand < cost[:, x]
            cost[better, x] = cand[better]
            back[better, x] = dy
    y = int(np.argmin(cost[:, -1]))
    cut = np.zeros(W, int)
    for x in range(W - 1, -1, -1):
        cut[x] = y
        y -= back[y, x]
    return cut


def _apply_cut(A, B, cut):
    """Join A's bottom band to its top band along cut; the result is B rows shorter."""
    H, W = A.shape
    top, bot = A[:B].astype(float), A[H - B:].astype(float)
    M = np.empty_like(top)
    for x in range(W):
        M[:cut[x], x] = bot[:cut[x], x]
        M[cut[x]:, x] = top[cut[x]:, x]
    return np.vstack([M, A[B:H - B].astype(float)])


def quilt_rows(A, B, avoid=0.0, ground=None):
    return _apply_cut(A, B, _find_cut(A, B, avoid, ground))


def make_tileable(A, B, axes="xy", avoid=0.0, ground=None, planes=None):
    """A: 2-D uint8 array. Returns the float array tiled on the chosen axes (B px smaller on each).

    axes "xy" repairs both, "y" only top/bottom, "x" only left/right. Repair only an axis
    that does not already wrap: quilting an axis that already wraps adds a mismatch of B px.
    avoid / ground: see the module docstring (default off, which is the original behavior).
    planes: optional list of 2-D arrays the same size as A (the colour channels of the picture
    A was made from). Each gets exactly the cuts found on A, and the return value is then
    (T, [repaired planes]) instead of T.
    """
    T, P = A, (None if planes is None else list(planes))
    if "y" in axes:
        cut = _find_cut(T, B, avoid, ground)
        if P is not None: P = [_apply_cut(p, B, cut) for p in P]
        T = _apply_cut(T, B, cut)
    if "x" in axes:
        cut = _find_cut(T.T, B, avoid, ground)
        if P is not None: P = [_apply_cut(p.T, B, cut).T for p in P]
        T = _apply_cut(T.T, B, cut).T
    return T if P is None else (T, P)


if __name__ == "__main__":
    args = [x for x in sys.argv[1:] if not x.startswith("--")]
    axes, avoid, ground, keep_tone, color = "xy", 0.0, None, False, False
    for x in sys.argv[1:]:
        if x.startswith("--axes="):
            axes = x.split("=", 1)[1]
        elif x.startswith("--avoid-ink="):
            avoid = float(x.split("=", 1)[1])
        elif x.startswith("--ground="):
            ground = float(x.split("=", 1)[1])
        elif x == "--keep-tone":
            keep_tone = True
        elif x == "--color":
            color = True
    src, dst = args[0], args[1]
    B = int(args[2]) if len(args) > 2 else 128
    if color:
        rgb = Image.open(src).convert("RGB")
        a = np.asarray(rgb)
        T, P = make_tileable(np.asarray(rgb.convert("L")), B, axes, avoid, ground, [a[..., k] for k in range(3)])
        out = np.clip(np.rint(np.stack(P, axis=-1)), 0, 255).astype(np.uint8)
        Image.fromarray(out, "RGB").save(dst)
        print(f"{dst}: {out.shape[1]}x{out.shape[0]} (colour)")
        sys.exit(0)
    T = make_tileable(np.asarray(Image.open(src).convert("L")), B, axes, avoid, ground)
    if keep_tone:
        out = np.clip(np.rint(T), 0, 255).astype(np.uint8)
    else:
        out = ((T > 127) * 255).astype(np.uint8)
    Image.fromarray(out).save(dst)
    print(f"{dst}: {T.shape[1]}x{T.shape[0]}")
