#!/usr/bin/env python3
"""Make a pattern with a strict fine grid wrap on all four edges, grid lines included.

    python3 tools/make_tileable_grid.py input.png output.png [band_px]

make_tileable.py joins two bands that sit one tile-width apart in the source. If that
distance is not a whole number of grid cells, the grid lines meet half a cell out of
step and show as a jog. This script measures the grid pitch (FFT of the column and
row ink profiles), crops the source so the final tile is a whole number of cells
each way, then runs the same edge repair. band_px defaults to 96.
Used for US D 13,109 (pitch 33.3 x 28.06 px, 30 x 36 cells, 999 x 1010 px tile).
Check the result by shifting it half its width and height with wraparound.
"""
import sys
import numpy as np
from PIL import Image
from make_tileable import make_tileable


def pitch(profile, lo=15, hi=60):
    p = profile - profile.mean()
    n = 1 << 16
    spec = np.abs(np.fft.rfft(p * np.hanning(len(p)), n))
    f = np.fft.rfftfreq(n)[1:]
    spec = spec[1:]
    ok = (1 / f >= lo) & (1 / f <= hi)
    return float(1 / f[ok][np.argmax(spec[ok])])


src, dst = sys.argv[1], sys.argv[2]
B = int(sys.argv[3]) if len(sys.argv) > 3 else 96
A = np.asarray(Image.open(src).convert("L"))
H, W = A.shape
ink = (A < 128).astype(float)
px, py = pitch(ink.mean(0)), pitch(ink.mean(1))
w = int(np.floor((W - B) / px)) * px          # final width: a whole number of cells
h = int(np.floor((H - B) / py)) * py
w, h = round(w), round(h)
x0, y0 = (W - (w + B)) // 2, (H - (h + B)) // 2
print(f"pitch {px:.2f} x {py:.2f} px; tile {w} x {h} px ({round(w/px)} x {round(h/py)} cells)")
T = make_tileable(A[y0:y0 + h + B, x0:x0 + w + B], B)
Image.fromarray(((T > 127) * 255).astype(np.uint8)).save(dst)
print(f"{dst}: {T.shape[1]}x{T.shape[0]}")
