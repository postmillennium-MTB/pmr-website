# Adding a pattern to the Texture Studio

The workflow used for US D 13,106 through 13,110. One patent at a time. Written so
Jon can start it, and so Claude (or anyone with Python) can finish it.

## What you provide (three things per patent)

| # | Item | Where it comes from | Why it is needed |
|---|---|---|---|
| 1 | **The patent PDF** | Google Patents page for the patent, "Download PDF". Two pages: page 1 is the drawing sheet, page 2 is the specification. Name it `USD<number>.pdf` (for example `USD13110.pdf`). | The inventor, assignee and grant date are read from it, and the drawing is compared with the redraw. Never guess these: US D 13,108 and 13,109 are Edwin Fisher of Boston, but 13,110 is John Fisher of New York. |
| 2 | **The "Gemini tile"** | The image Gemini returns after you attach the PDF and run `prompts/redraw-patent-as-tile.md` unchanged. PNG if Gemini offers it, otherwise JPEG is fine. Any size: Gemini has returned 1125 x 1125 every time, not the 2048 the prompt asks for, and that is fine. | It becomes the mask. |
| 3 | **The Google Patents link** | `https://patents.google.com/patent/USD<number>S` | It goes in the registry and makes the patent number in the credit line a link. The build environment cannot open Google Patents, so the link is recorded as given and not opened. |

### Five things that make it go smoothly

1. **Send the Gemini tile as PNG if Gemini offers it.** JPEG works, but it carries
   compression noise (the mask step thresholds most of it away). PNG is cleaner.
2. **One patent per message.** Send the PDF, the tile and the link together, and
   keep each tile with its own PDF so the tile is never matched to the wrong patent.
3. **Say each time whether to push to `main` or open a pull request.** Nothing is
   merged unless you ask. The default is a branch and a note that it is ready.
4. **Tell Claude if you changed the prompt text.** The prompt in
   `prompts/redraw-patent-as-tile.md` is used unchanged by default. If you edited it,
   say what you changed: it gets a new row in that file's revision log, so each
   pattern's provenance records which prompt version made it.
5. **The Google Patents link is recorded as given, not opened.** The build
   environment cannot reach Google Patents. The inventor, assignee and dates come from
   the PDF, so the PDF is the authority and the link is only a pointer.

A message you can paste:

```text
New texture: US D <number>.
PDF attached, Gemini tile attached (PNG), link https://patents.google.com/patent/USD<number>S
Prompt: unchanged   (or: changed - <what you changed>)
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
   neighboring columns (about 0.8-0.9). Every Gemini tile so far scored 0.0-0.1, so it
   does not wrap even though the prompt asks it to.
4. **Repair the edges.**
   - Fine square grid (13,109 and 13,110): `python3 tools/make_tileable_grid.py in.png out.png 96`.
     It measures the grid pitch and crops to a whole number of cells first, so the
     grid lines meet at the join.
   - No strict grid: `python3 tools/make_tileable.py in.png out.png 128`.
   - Try bands 96, 128 and 160 and keep the one with the best edge correlation and no
     visible seam. A good result scores at or above the neighbor correlation on both
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

Use the inventor's surname from the PDF, and two people with the same surname get
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

## Doing it without Claude

Needs Python 3 with Pillow and numpy. From the `textures/` folder, run steps 4 and 6
above, add the entry to `patterns.json` and rows to `PROVENANCE.md`, then
`python3 tools/build_studio.py`.

## Things that went wrong before

- **Gemini ignores the size and the edge-matching instructions.** The four tiles so far
  (13,106 to 13,110) all came back 1125 x 1125 with no edge match. Treat the edge repair as a required step.
- **A strict grid breaks the plain repair.** The grid meets half a cell out of step.
  Use `make_tileable_grid.py`.
- **A guessed inventor was wrong.** The sheet and specification decide.
- **Google Patents cannot be opened from the build environment.** Links are recorded as
  given. Everything else comes from the PDF.
- **JPEG tiles carry compression noise.** The mask step thresholds it away, but PNG is
  cleaner.
- **A very dark pattern needs a low default strength.** 13,108 to 13,110 are 57-66% ink.
