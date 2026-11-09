#!/usr/bin/env python3
"""Turn a black-ink-on-white pattern image into a recolorable alpha mask.

    python3 tools/make_mask.py input.png masks/my-pattern.webp [max_px] [--tone=GROUND,INK | --accent=FROM,TO]

Alpha = ink, RGB = 0, so any CSS background-color shows through the ink only.
Downscales BEFORE thresholding (fine hatching averages to gray instead of
aliasing), then an Otsu threshold with a soft +-18 level ramp. Prints ink coverage.

--tone=GROUND,INK  makes a continuous-tone mask instead of a two-level one, for artwork
whose grey levels carry meaning (a white antler over a mid-grey fern). GROUND is the grey
level (0-255) of the paper: alpha 0. INK is the grey level of full ink: alpha 1. Levels in
between ramp linearly. The order sets the polarity, so light ink on a dark ground is
--tone=45,235 and dark ink on a white ground would be --tone=235,45. Ink coverage is then
the mean alpha (as for the procedural masks), not the share of pixels over half.

--accent=FROM,TO  cuts a mask of the picture's one accent color from a colour image: alpha is
the colorfulness of each pixel (the largest of R, G, B minus the smallest, 0-255), 0 at FROM and
1 at TO, linear between. Greys and whites have no colorfulness, so they drop out and only the
accent remains. Pick FROM just above the noise (JPEG blur leaves faint color around grey
edges) and TO a little under the accent's own colorfulness. Ink coverage is the mean alpha.
The input must be the colour picture (make_tileable.py --color keeps it in colour), and this
mask lines up with the --tone mask cut from the same file.
"""
import sys
import numpy as np
from PIL import Image

args = [a for a in sys.argv[1:] if not a.startswith("--")]
tone = accent = None
for a in sys.argv[1:]:
    if a.startswith("--tone="):
        tone = [float(v) for v in a.split("=", 1)[1].split(",")]
        if len(tone) != 2 or tone[0] == tone[1]:
            raise SystemExit("--tone needs two different levels: --tone=GROUND,INK")
    elif a.startswith("--accent="):
        accent = [float(v) for v in a.split("=", 1)[1].split(",")]
        if len(accent) != 2 or accent[0] >= accent[1]:
            raise SystemExit("--accent needs FROM below TO: --accent=FROM,TO")
if tone and accent:
    raise SystemExit("use --tone or --accent, not both")
src, dst = args[0], args[1]
max_px = int(args[2]) if len(args) > 2 else 800
im = Image.open(src).convert("RGB" if accent else "L")
s = max_px / max(im.size)
if s < 1:
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
g = np.asarray(im).astype(float)
if accent:
    chroma = g.max(axis=2) - g.min(axis=2)
    g = chroma
    alpha = np.clip((chroma - accent[0]) / (accent[1] - accent[0]), 0, 1)
    label = f"accent colorfulness {accent[0]:g}->{accent[1]:g}, ink coverage (mean alpha) {alpha.mean():.1%}"
elif tone:
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
