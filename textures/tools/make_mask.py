#!/usr/bin/env python3
"""Turn a black-ink-on-white pattern image into a recolorable alpha mask.

    python3 tools/make_mask.py input.png masks/my-pattern.webp [max_px]

Alpha = ink, RGB = 0, so any CSS background-color shows through the ink only.
Downscales BEFORE thresholding (fine hatching averages to gray instead of
aliasing), then an Otsu threshold with a soft +-18 level ramp. Prints ink coverage.
"""
import sys
import numpy as np
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
max_px = int(sys.argv[3]) if len(sys.argv) > 3 else 800
im = Image.open(src).convert("L")
s = max_px / max(im.size)
if s < 1:
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
g = np.asarray(im).astype(float)
hist, _ = np.histogram(g, bins=256, range=(0, 256))
p = hist / hist.sum()
om, mu = np.cumsum(p), np.cumsum(p * np.arange(256))
t = int(np.argmax((mu[-1] * om - mu) ** 2 / (om * (1 - om) + 1e-12)))
alpha = np.clip((t + 18 - g) / 36, 0, 1)
rgba = np.zeros((*g.shape, 4), np.uint8)
rgba[..., 3] = (alpha * 255).astype(np.uint8)
Image.fromarray(rgba, "RGBA").save(dst, "WEBP", lossless=True, method=6)
print(f"{dst}: {im.width}x{im.height}, Otsu {t}, ink coverage {(alpha > .5).mean():.0%}")
