#!/usr/bin/env python3
"""Build studio/index.html: one self-contained page with every mask embedded.

    python3 tools/build_studio.py

Reads patterns.json and masks/*.webp, writes studio/index.html. Re-run after
adding or changing a pattern.
"""
import base64, json, pathlib

root = pathlib.Path(__file__).resolve().parent.parent
reg = json.loads((root / "patterns.json").read_text())
for p in reg["patterns"]:
    raw = (root / p["mask"]).read_bytes()
    p["data"] = "data:image/webp;base64," + base64.b64encode(raw).decode()
tpl = (root / "tools" / "studio_template.html").read_text()
out = tpl.replace("/*__PATTERNS__*/[]", json.dumps(reg["patterns"], ensure_ascii=False))
(root / "studio" / "index.html").write_text(out)
print(f"studio/index.html: {len(out)/1024:.0f} KB, {len(reg['patterns'])} patterns")
