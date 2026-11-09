#!/usr/bin/env python3
"""Turn a black-ink-on-white pattern image into a recolorable alpha mask.

    python3 tools/make_mask.py input.png masks/my-pattern.webp [max_px] [--tone=GROUND,INK]

Alpha = ink, RGB = 0, so any CSS background-color shows through the ink only.
Downscales BEFORE thresholding (fine hatching averages to gray instead of
aliasing), then an Otsu threshold with a soft +-18 level ramp. Prints ink coverage.

--tone=GROUND,INK  makes a continuous-tone mask instead of a two-level one, for artwork
whose grey levels carry meaning (a white antler over a mid-grey fern). GROUND is the grey
level (0-255) of the paper: alpha 0. INK is the grey level of full ink: alpha 1. Levels in
between ramp linearly. The order sets the polarity, so light ink on a dark ground is
--tone=45,235 and dark ink on a white ground would be --tone=235,45. Ink coverage is then
the mean alpha (as for the procedural masks), not the share of pixels over half.
"""
import sys
import numpy as np
from PIL import Image

args = [a for a in sys.argv[1:] if not a.startswith("--")]
tone = None
for a in sys.argv[1:]:
    if a.startswith("--tone="):
        tone = [float(v) for v in a.split("=", 1)[1].split(",")]
        if len(tone) != 2 or tone[0] == tone[1]:
            raise SystemExit("--tone needs two different levels: --tone=GROUND,INK")
src, dst = args[0], args[1]
max_px = int(args[2]) if len(args) > 2 else 800
im = Image.open(src).convert("L")
s = max_px / max(im.size)
if s < 1:
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
g = np.asarray(im).astype(float)
if tone:
    alpha = np.clip((g - tone[0]) / (tone[1] - tone[0]), 0, 1)
    label = f"tone {tone[0]:g}->{tone[1]:g}, ink coverage (mean alpha) {alpha.mean():.0%}"
else:
    hist, _ = np.histogram(g, bins=256, range=(0, 256))
    p = hist / hist.sum()
    om, mu = np.cumsum(p), np.cumsum(p * np.arange(256))
    t = int(np.argmax((mu[-1] * om - mu) ** 2 / (om * (1 - om) + 1e-12)))
    alpha = np.clip((t + 18 - g) / 36, 0, 1)
    label = f"Otsu {t}, ink coverage {(alpha > .5).mean():.0%}"
rgba = np.zeros((*g.shape, 4), np.uint8)
rgba[..., 3] = (alpha * 255).astype(np.uint8)
Image.fromarray(rgba, "RGBA").save(dst, "WEBP", lossless=True, method=6)
print(f"{dst}: {im.width}x{im.height}, {label}")
