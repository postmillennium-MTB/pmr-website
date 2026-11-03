#!/usr/bin/env python3
"""Build studio/index.html: one self-contained page with every mask embedded.

    python3 tools/build_studio.py

Reads patterns.json, writes studio/index.html. A pattern's mask comes from its
'mask' file (embedded as a WebP data URI) or, for procedural patterns, from the
CSS variable named in 'cssVar' inside one of the masks/*.css files (an SVG data URI:
low-pile-carpet.css holds the pile and grain, graph-paper.css the graph paper).
Re-run after adding or changing a pattern.
"""
import base64, json, pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
reg = json.loads((root / "patterns.json").read_text())
proc_css = "\n".join(f.read_text() for f in sorted((root / "masks").glob("*.css")))
for p in reg["patterns"]:
    if p.get("mask"):
        raw = (root / p["mask"]).read_bytes()
        p["data"] = "data:image/webp;base64," + base64.b64encode(raw).decode()
    else:
        m = re.search(re.escape(p["cssVar"]) + r'\s*:\s*url\("([^"]+)"\)', proc_css)
        if not m:
            raise SystemExit(f"{p['id']}: {p['cssVar']} not found in masks/*.css")
        p["data"] = m.group(1)
tpl = (root / "tools" / "studio_template.html").read_text()
out = tpl.replace("/*__PATTERNS__*/[]", json.dumps(reg["patterns"], ensure_ascii=False))
(root / "studio" / "index.html").write_text(out)
print(f"studio/index.html: {len(out)/1024:.0f} KB, {len(reg['patterns'])} patterns")
