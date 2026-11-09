# Adding a pattern to the Texture Studio

The workflow used for US D 13,106 through 13,110. One patent at a time. Written so
Jon can start it, and so Claude (or anyone with Python) can finish it.

## What you provide (three things per patent)

| # | Item | Where it comes from | Why it is needed |
|---|---|---|---|
| 1 | **The patent PDF** | Google Patents page for the patent, "Download PDF". Two pages: page 1 is the drawing sheet, page 2 is the specification. Name it `USD<number>.pdf` (for example `USD13110.pdf`). | The inventor, assignee and grant date are read from it, and the drawing is compared with the redraw. Never guess these: US D 13,108 and 13,109 are Edwin Fisher of Boston, but 13,110 is John Fisher of New York. |
| 2 | **The "Gemini tile"** | The image Gemini returns after you attach the PDF and run `prompts/redraw-patent-as-tile.md` unchanged. PNG if Gemini offers it, otherwise JPEG is fine. **Send it at full size and do not resize, screenshot or re-export it.** Every tile so far reached the build at 1125 x 1125 px instead of the 2048 the prompt asks for; that was an oversight on the sender's side, not Gemini ignoring the size. A smaller tile still works because the masks are made at 800 px, but full size is better. | It becomes the mask. |
| 3 | **The Google Patents link** | `https://patents.google.com/patent/USD<number>S` | It goes in the registry and makes the patent number in the credit line a link. The build environment cannot open Google Patents, so the link is recorded as given and not opened. |

### Five things that make it go smoothly

1. **Send the Gemini tile as PNG if Gemini offers it.** JPEG works, but it carries
   compression noise (the mask step thresholds most of it away). PNG is cleaner.
2. **One patent per message.** Send the PDF, the tile and the link together, and
   keep each tile with its own PDF so the tile is never matched to the wrong patent.
3. **Say each time whether to push to `main` or open a pull request.** Nothing is
   merged unless you ask. The default is a branch and a note that it is ready.
4. **Tell Claude if you changed the prompt text.** The prompt in
   `prompts/redraw-patent-as-tile.md` (currently **v2**) is used unchanged by default. If you edited it,
   say what you changed: it gets a new row in that file's revision log, so each
   pattern's provenance records which prompt version made it.
5. **The Google Patents link is recorded as given, not opened.** The build
   environment cannot reach Google Patents. The inventor, assignee and dates come from
   the PDF, so the PDF is the authority and the link is only a pointer.

A message you can paste:

```text
New texture: US D <number>.
PDF attached, Gemini tile attached (PNG), link https://patents.google.com/patent/USD<number>S
Prompt: v2 unchanged   (or: changed - <what you changed>)
Merge: push to main / open a PR / both / leave on the branch
```

## What happens next

1. **Read the PDF.** Page 1 header and signature, page 2 specification. Record the
   inventor and city, assignee, application date and grant date. Check the OCR text
   against the rendered page, because OCR misreads names ("J." versus "E."), and the
   rendered page is the authority.
2. **Check the Gemini tile against the sheet.** The same motifs should be present:
   no invented motifs, none dropped. Note any that moved.
3. **Test whether the tile already wraps.** Compare the correlation of the last
   column with the first (and last row with first) against the correlation between
   neighboring columns (about 0.8-0.9). Check **each axis separately**. Nine tiles scored
   0.0-0.1 on both axes, but the prompt-v2 tile for US D 74,141 already matched left to
   right (0.92) and only failed top to bottom (0.02). Also look for **straight cuts inside
   the tile**: a full-height vertical (or horizontal) line where motifs start abruptly,
   as if strips were pasted together (the first D 74,141 tile, from prompt v1, had two; the
   v2 tile had none). Find them by plotting the
   correlation between each pair of adjacent columns and rows and looking for dips, then
   confirm in a zoom.
4. **Repair the edges.**
   - Fine square grid (13,109 and 13,110): `python3 tools/make_tileable_grid.py in.png out.png 96`.
     It measures the grid pitch and crops to a whole number of cells first, so the
     grid lines meet at the join.
   - No strict grid: `python3 tools/make_tileable.py in.png out.png 128`.
   - **Only one axis fails:** repair just that axis, `--axes=y` (top/bottom) or
     `--axes=x` (left/right). Quilting an axis that already wraps adds a mismatch of one
     band width and breaks it. US D 74,141 (v2 tile): `--axes=y` at band 176.
   - If the ground has fine ruling lines (D 74,141: horizontal ruling every 5.45 px),
     pick the band so the tile height is a whole number of ruling pitches, or the ruling
     jogs at the join. Scan bands (for example 64 to 192 in steps of 8) and compare the
     edge correlation and the ruling misalignment.
   - Cuts inside the Gemini tile are **not** removed by any repair. Record them in
     `PROVENANCE.md` and the pattern's `note`, and re-run Gemini (the v2 prompt's
     "one continuous drawing" sentence removed them for D 74,141).
   - Try several bands (96, 128, 160, more if one axis is already fine) and keep the one
     with the best edge correlation and no visible seam. A good result scores at or above the neighbor correlation on both
     axes.
5. **Check the seams.** View the tile shifted half its width and height with
   wraparound, and as a 2x2. No straight seam, no doubled or jogged grid lines in the
   middle cross. If a seam shows, try another band before accepting it. Write any
   remaining flaw in `PROVENANCE.md`.
6. **Make the mask.** `python3 tools/make_mask.py out.png masks/<id>.webp 800` prints the
   ink coverage; keep that number.
7. **Register it** (see "Records to update").
8. **Rebuild and test the studio.** `python3 tools/build_studio.py`, open
   `studio/index.html`, pick the new pattern, check the provenance text and the credit
   line, and look at it at full strength ("Show at full strength") for a visible seam
   at the tile boundary.
9. **Commit and push, then merge as you asked.** Push to the working branch always.
   "Push to main" means a fast-forward or merge into `main`. "Open a PR" means a pull
   request from the branch into `main`. "Both" means open the PR, then merge it, so the
   PR record exists and `main` is updated. With no instruction, the branch is left
   unmerged and Claude says it is ready.

## Naming and defaults

| Field | Rule | Example |
|---|---|---|
| `id` and mask file | `<inventor surname>-<year>-<number>`, lower case | `fisher-1882-13110` |
| `title` | `<initial>. <Surname> carpet, <year> (<short description>)` | `J. Fisher carpet, 1882 (medallion on trellis)` |
| `kind` | `adapted` for a Gemini redraw. `patent-drawing` only when the mask is the patent's own drawing cropped to a repeat that already wraps. Never call an adapted pattern the patent's drawing. | `adapted` |
| `defaultOpacity` | Ink 55% or more: 0.05-0.055. Ink 45-55%: 0.06. Thin line art (under 15%): about 0.10. | 0.05 |
| `credit` | `Background pattern adapted from US Design Patent No. <n> (<inventor>, <year>); the patent has long expired.` | |
| `url` | `https://patents.google.com/patent/USD<number>S/en` | |

The Comp III pattern, `us-d268339`, predates this rule and keeps its id so that any page
already using its hosted mask URL keeps working. Use the inventor's surname from the PDF, and two people with the same surname get
distinct initials in the title (E. Fisher and J. Fisher). Rename an id that turns out
wrong before it spreads; `crowe-1882-13108` became `fisher-1882-13108`.

## Records to update

- `masks/<id>.webp`
- `patterns.json`: a new entry (id, title, kind, patent, inventor, granted, assignee,
  mask, pixels, inkCoverage, defaultOpacity, note, url, credit)
- `README.md`: the patent table, the pattern counts in the intro, the credits
  paragraph
- `PROVENANCE.md`: a table row (how the tile was made and the numbers), the ink
  coverage row, and the column in "Facts read from the PDFs"
- `tools/studio_template.html`: the inventor counts in the Credits blurb
- `prompts/redraw-patent-as-tile.md`: a row in the revision log for this run
- Rebuild `studio/index.html` last

## Procedural patterns (no patent)

A generated pattern needs none of the three inputs above: no PDF, no Gemini tile, no
link, no credit line. The topographic contours, guilloché rosettes, carbon twill and
switchback trail were added this way. The trail is the one with real engineering in it (it
routes trails over the contours' terrain); `make_procedural.py trail --find` lists the faces
its climbs start from.

1. **Make it periodic by construction**, so no edge repair is needed: integer wave
   vectors for noise, wrapped offsets for anything that crosses the edge (a closed
   loop is drawn at every whole-tile shift that can touch the tile), runs drawn past
   the edge and clipped for a weave. A pattern meant to layer over another one (the
   switchback trail over the contours) should be generated from the same function, so
   they agree. A dashed line needs its dash period chosen so a whole number of
   dashes fits in one period (or round a loop), **and the dashes drawn one by one**: an SVG
   `stroke-dasharray` on a path with arcs puts dashes where the renderer's own length
   estimate says, which was about 1 px off per tile in Chromium and differs between
   browsers.
2. **Write the generator.** A WebP mask goes in `tools/make_procedural.py` (a new
   function writing `masks/<id>.webp`). A small vector tile goes in `masks/<name>.css` as
   a `--<name>-mask-<id>` variable that `build_studio.py` reads through `cssVar`
   (`graph-paper.css` and `carbon-twill.css` are the examples).
3. **Check the seam**: view the tile shifted by half its width and height with
   wraparound, and compare the step across the wrap with the interior steps. For a
   path, the real test is to tile the mask 3 x 3 and compare it pixel by pixel with one
   continuous drawing over several periods (tiling the same bitmap and comparing tile
   with tile proves nothing). Measure the ink coverage as mean alpha.
4. **Register it** in `patterns.json` with `kind: "procedural"`, `patent`, `inventor`,
   `granted`, `url` and `credit` all `null`. Set `snapSize: true` and `defaultSize` for
   a tile that only makes sense at one size (a small weave, or a layer that must line up
   with another pattern's tile), so the studio jumps to it when picked.
5. Update the README counts, patent table and folder map, add a `PROVENANCE.md` row, and
   rebuild with `python3 tools/build_studio.py`.

## Artwork (a picture the site already uses)

A header or hero image can become a pattern (`moose-skulls`, from the US guide's header, was the
first). It needs one input: **the tile image** (the file the page already uses), and the site
owner's word on who made the picture, because the README says images and artwork are reserved,
not licensed by `LICENSE`. No PDF, no Gemini run, no patent link, no credit line.

1. **Measure each axis separately**, as in step 3 above. Artwork cut from a banner often wraps
   on one axis only (the moose tile wrapped left to right, 0.94, and not top to bottom, 0.36).
2. **Repair only the axis that fails.** For a picture of things (animals, plants, lettering)
   rather than an ornament, steer the cut through bare ground and keep the grey levels:
   `python3 tools/make_tileable.py src.jpg /tmp/wrapped.png <band> --axes=y --avoid-ink=1 --ground=<ground grey> --color`
   (`--ground` is the grey level of the empty background; take it from a histogram of the tile.
   `--color` finds the cut on the grey image and applies it to all three channels, so the repaired
   picture stays in colour. If the picture has no accent color, use `--keep-tone` instead and get a grey PNG.)
   **Judge the bands by eye, not by the printed correlation**: a min-error cut scores well at its
   own line whatever it cuts through. Scan bands, roll each result half its height so the join
   sits in the middle, and look for slivers of a motif floating in the ground. Measure the share
   of the cut that runs through a motif as well. Wider bands discard more of the picture.
3. **Make a tonal mask**, so the picture keeps its depth in one ink color:
   `python3 tools/make_mask.py /tmp/wrapped.png masks/<id>.webp 800 --tone=<ground>,<ink>`
   (this works on the colour PNG too: it uses the grey).
   Alpha is 0 at the `<ground>` grey and 1 at the `<ink>` grey (light ink on a dark ground is
   `--tone=56,235`; the order sets the polarity). Put `<ground>` just above the top of the
   ground's grey range, so the paper is exactly transparent and the paper's own shading does not
   show. The printed ink coverage is the mean alpha; the studio's tone readout uses it.
4. **Check the seams** as in step 5 above, on the finished mask: half-shifted on both axes and as
   a 2x2.
5. **Register it** with `"kind": "artwork"` and `patent`, `inventor`, `granted`, `assignee`,
   `url`, `credit` all `null`. Set `defaultOpacity` by eye in the studio on a light and a dark
   preset, and keep it at 10% or less: the brightest motif is full alpha, so that is the strength
   it prints at. (`moose-skulls` is 8%, a mean tone of about 1.7% against the carpets' 2.5-3%;
   matching the carpets' mean would have needed 13% and made the antlers too strong.) Say in the
   `note` what is not carried over (a second ink color, for example).
6. **Keep the source tile** in `masks/` (not served by the studio; it regenerates the mask), and
   write the PROVENANCE row with the wrap numbers, the band you chose, why, and any remaining flaw.
   **Do not write who made the picture unless the site owner has said.**
7. Update the README counts, table row, rules of thumb and folder map, and rebuild the studio
   (`python3 tools/build_studio.py`).

**An accent ink** (the moose's pink) is a second mask cut from the same repaired colour tile, so it
lines up with the first exactly. It is a **setting on the layer in the studio, not a pattern of its
own**, so it never turns up in the pattern list on its own and cannot be used at the wrong size.
Only worth doing when the picture has one accent color on neutral greys:
1. Measure first: the hue spread of the colorful pixels (chroma above about 60) should be a narrow
   band, and most pixels should be grey. If there are several colors, an accent mask would not
   separate them.
2. `python3 tools/make_mask.py /tmp/wrapped.png masks/<id>-accent.webp 800 --accent=<from>,<to>`:
   alpha is colorfulness (largest of R, G, B minus smallest), 0 at `<from>` and 1 at `<to>`. Compare
   a few settings by eye on the places the accent lives (edges, small shapes); `30,110` for the moose.
3. Add to the pattern's registry entry an `accent` object: `label` (used in the checkbox text:
   "Add the <label> as their own ink"), `mask`, `pixels`, `inkCoverage` (mean alpha), `defaultInk` (the
   saturated peak of the accent hue) and `defaultOpacity`. Accents are thin, so their default is far
   higher than the pattern's: `moose-skulls` is 0.45 against 0.08. `tools/build_studio.py` embeds the
   accent mask with the pattern.
4. In the studio the accent is written as its own layer directly above the pattern, at the same size
   and fade, and counts as one of the three layers.

## Doing it without Claude

Needs Python 3 with Pillow and numpy. From the `textures/` folder, run steps 4 and 6
above, add the entry to `patterns.json` and rows to `PROVENANCE.md`, then
`python3 tools/build_studio.py`.

## Things that went wrong before

- **Gemini does not match the edges.** Every tile from prompt v1 (13,106 to 13,110 and the
  first D 74,141) had no edge match. Treat the edge repair as a required step.
- **Tiles arrived downscaled.** All of them reached the build at 1125 x 1125, an oversight
  on the sender's side. Whether Gemini honors the 2048 px line has not been tested. Send
  the original file.
- **Gemini can paste strips together.** The first D 74,141 tile (prompt v1) had two
  straight vertical cuts that the edge repair cannot heal. Check for them (step 3) before
  you invest in the repair. Re-running with the v2 prompt gave a clean tile.
- **Not every patent is a carpet from the 1880s.** D 74,141 is a 1927 textile fabric; the
  prompt text says "a carpet from the 1880s", and the inventor, assignee and dates in the
  PDF are different in kind (a corporation assignee, an application serial number). Read
  the PDF and name the pattern for what it is ("textile").
- **A strict grid breaks the plain repair.** The grid meets half a cell out of step.
  Use `make_tileable_grid.py`.
- **A guessed inventor was wrong.** The sheet and specification decide.
- **Google Patents cannot be opened from the build environment.** Links are recorded as
  given. Everything else comes from the PDF.
- **JPEG tiles carry compression noise.** The mask step thresholds it away, but PNG is
  cleaner.
- **A very dark pattern needs a low default strength.** 13,108 to 13,110 are 57-66% ink.
- **A min-error cut scores well on any band.** For the moose tile the plain cut scored 0.79-0.96 at
  bands 64-400 px, including bands that left slivers of antler or a stray branch floating in the
  ground. Look at the join (and measure the share of the cut on a motif) before trusting the
  correlation. See the Artwork section.
