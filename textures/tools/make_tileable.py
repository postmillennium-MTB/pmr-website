#!/usr/bin/env python3
"""Force a pattern image to wrap on all four edges (minimum-error-cut quilting).

    python3 tools/make_tileable.py input.png output.png [band_px] [--axes=xy|y|x]

Joins the bottom band to the top band along the lowest-error path, then does the
same left to right. Output is band_px smaller each way. Check the result by
shifting it half its width and height with wraparound: no straight seam should
show through the middle. band_px 96-160 works best; try a few and compare. --axes=y repairs only the top/bottom
edges (use it when the left/right edges already match; see ADD-A-PATTERN.md).
"""
import sys
import numpy as np
from PIL import Image


def quilt_rows(A, B):
    H, W = A.shape
    top, bot = A[:B].astype(float), A[H - B:].astype(float)
    err = (top - bot) ** 2
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
    M = np.empty_like(top)
    for x in range(W):
        M[:cut[x], x] = bot[:cut[x], x]
        M[cut[x]:, x] = top[cut[x]:, x]
    return np.vstack([M, A[B:H - B].astype(float)])


def make_tileable(A, B, axes="xy"):
    """A: 2-D uint8 array. Returns the float array tiled on the chosen axes (B px smaller on each).

    axes "xy" repairs both, "y" only top/bottom, "x" only left/right. Repair only an axis
    that does not already wrap: quilting an axis that already wraps adds a mismatch of B px.
    """
    T = A
    if "y" in axes:
        T = quilt_rows(T, B)
    if "x" in axes:
        T = quilt_rows(T.T, B).T
    return T


if __name__ == "__main__":
    args = [x for x in sys.argv[1:] if not x.startswith("--")]
    axes = "xy"
    for x in sys.argv[1:]:
        if x.startswith("--axes="):
            axes = x.split("=", 1)[1]
    src, dst = args[0], args[1]
    B = int(args[2]) if len(args) > 2 else 128
    T = make_tileable(np.asarray(Image.open(src).convert("L")), B, axes)
    Image.fromarray(((T > 127) * 255).astype(np.uint8)).save(dst)
    print(f"{dst}: {T.shape[1]}x{T.shape[0]}")
