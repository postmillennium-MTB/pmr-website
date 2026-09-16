# Globe art-direction prompts

Image prompts for developing the surface treatment of the rotatable tool
selector prototyped in `globe-lab/index.html`.

## Read this first — what the images are for

**The generated image is not the selector.** It supplies material, palette,
lighting and edge treatment. The sphere itself is computed in
`globe-lab/index.html`, and has to stay computed:

- A bitmap globe cannot rotate, cannot be clicked precisely, cannot be tabbed
  to, and cannot retint across the five themes. A sprite sequence covering
  36 rotation steps × 5 themes is 180 images and a permanent maintenance tax.
- The homepage grid derives every card from two fields in `PMR_TOOLS`. A
  bitmap globe breaks that contract — tool #22 would mean re-rendering the
  artwork instead of adding one line.

This mirrors `images/TEXTURE-PIPELINE.md`, where a historical ornament became
a tintable mask rather than a background image. Same shape of problem, same
answer: generate the *material*, compute the *structure*.

## The workflow that actually works

Text-to-image models cannot reliably draw a rhombic triacontahedron. Ask one
for "thirty identical diamond panels on a sphere" and you will get an
approximation, and you will burn forty generations trying to fix the face
count.

You do not have to. **The correct layout already exists as a render.**

1. Screenshot `globe-lab/index.html` (any theme, any rotation).
2. Give Nano Banana that screenshot **as an image-to-image reference**, with
   Prompt A below.
3. The model keeps the panel layout from your screenshot and supplies only
   the material, lighting and edge treatment.
4. Bring the result back and it gets translated into CSS/SVG — gradients,
   stroke weights, a mask asset — applied to the real geometry.

Generating textless is deliberate. Twenty-one small labels will garble in any
image model, and the labels are live text in the real thing anyway.

---

## Prompt A — master render (day / parchment)

> Using the attached image as the structural reference, keep the exact panel
> layout, panel count, and sphere position unchanged. Reinterpret only the
> surface material, lighting, and edge treatment.
>
> A single spherical object photographed straight on, centered, filling about
> eighty percent of a square frame. The sphere's entire surface is tiled by
> thirty identical diamond-shaped panels — rhombi meeting four at a point,
> no gaps, no overlaps, every panel exactly the same size and shape. The
> seams between panels are fine engraved lines, roughly one pixel of dark
> warm grey, scored into the surface rather than drawn on top of it.
>
> The material is aged printed paper laid over a solid form: a warm off-white
> parchment ground, hex #F4F1EC, with a faint uneven tooth like laid paper
> held up to the light. Each panel carries a very low-contrast ornamental
> pattern — a Victorian carpet repeat in fine line work at around five
> percent ink density, warm brown, barely legible, the kind of pattern you
> notice only when you go looking for it.
>
> Panels are tinted in five muted families, grouped into contiguous regions
> rather than scattered: a desaturated brick red #7A3828, a slate blue
> #3A5C6E, an olive gold #786030, and two blends of those three. Every tint
> is a wash at roughly a quarter strength over the parchment — never
> saturated, never flat color. Nine panels are left as bare untinted
> parchment.
>
> Lighting is soft and single-source, from the upper left, like north-facing
> window light on a library table. A gentle specular sheen across the
> upper-left quadrant, a soft terminator falling toward the lower right, and
> a faint warm bounce along the lower-right limb so the sphere never goes
> dead black. No hard shadows, no rim light, no glow, no bloom.
>
> The background is flat uniform #ECEAE4 — no gradient, no vignette, no
> horizon, no table surface, no contact shadow. The sphere floats.
>
> Absolutely no text, no letters, no numerals, no labels, no watermarks
> anywhere in the image.
>
> Style: antique cartographic instrument crossed with a technical patent
> illustration. Precise, matte, restrained, museum object. Not glossy, not
> neon, not sci-fi, not a video game asset, not a soccer ball, not a
> disco ball. Square 1:1, maximum resolution.

## Prompt B — 2049 variant

Run this **image-to-image on the output of Prompt A**, not from scratch. That
keeps the material identical across themes so the only thing that changes is
the palette — which is exactly how the CSS behaves.

> Keep the sphere, panel layout, panel count, camera angle, and surface
> material of the attached image exactly as they are. Change only the
> palette and the lighting mood.
>
> The parchment ground becomes a dark oxidized ground, hex #1A1815 — aged
> brass and soot rather than paper. Panel tints become a warm signal amber
> #C9A227, a burnt oxide red #8C3A1E, and a dull antique gold #B8901E, still
> as low-strength washes over the dark ground, never saturated fills. The
> nine untinted panels become bare dark metal.
>
> Seam lines invert: instead of dark scoring on light paper, they become
> faint warm highlights, as if light catches the raised edge of each panel.
>
> Lighting becomes a single low amber source from the upper left, dimmer and
> more directional, with most of the lower-right hemisphere falling into deep
> shadow. Add a very faint atmospheric haze around the sphere, warm amber,
> almost subliminal. No neon, no glow, no lens flare, no scanlines.
>
> Background flat uniform #0B0A08. No text, no letters, no numerals, no
> labels. Square 1:1, maximum resolution.

## Prompt C — single-panel material study (highest practical value)

This is the one that becomes an actual repository asset. It feeds straight
into `images/TEXTURE-PIPELINE.md` from Step 2 onward and comes out the other
side as a tintable mask.

> A flat square swatch of an antique printed surface, shot perfectly
> face-on with no perspective, no curvature, and no lighting falloff — an
> even scan, not a photograph of an object.
>
> The surface is warm off-white parchment, hex #F4F1EC, with visible laid
> paper tooth and faint age mottling. Printed on it in fine engraved line
> work is a Victorian carpet repeat — interlacing foliate scrollwork, dense
> but delicate, in a single warm brown ink at low density, the kind of
> pattern used on 1890s woven carpet design patents.
>
> The pattern is a true repeat unit: motifs deliberately run off all four
> edges so that they rejoin when the square is tiled. Nothing is framed,
> bordered, or centered as a self-contained composition. No border ornament
> on any side.
>
> Even illumination corner to corner. No vignette, no shadow, no highlight,
> no texture overlay, no paper curl. No text, no letters, no numerals, no
> signature, no plate number, no caption. Square 1:1, maximum resolution.

The "runs off all four edges" wording matters. `TEXTURE-PIPELINE.md` Step 1 is
a gate that fails on framed panels, and it has already failed once on a
Victorian wallpaper scan for exactly this reason.

## Prompt D — globe gores flat sheet

Useful as a mobile fallback layout, an OG image, or a sticker. A gore sheet is
the flat petal print used to paper a physical globe — a genuinely PMR-native
artifact, sitting naturally next to the patent atlas and the 1898 carpet.

> A flat printed sheet of antique globe gores, laid out horizontally: twelve
> tall pointed petal shapes side by side, each tapering to a sharp point at
> top and bottom and bulging at the middle, the pattern used to paper a
> physical globe. Drawn as a nineteenth-century engraved map plate.
>
> Printed on warm off-white parchment #F4F1EC in fine dark line work. Each
> gore is subdivided by faint engraved lines into diamond-shaped regions,
> some washed in muted brick red #7A3828, slate blue #3A5C6E, or olive gold
> #786030 at low saturation, others left bare.
>
> Thin double rule framing the sheet. Even flat lighting, no perspective, no
> curl, no shadow. Faint foxing and age toning at the edges.
>
> No text, no letters, no numerals, no place names, no title cartouche, no
> compass rose, no latitude or longitude numbers. Wide 16:9 or 2:1,
> maximum resolution.

---

## What to reject

Send it back if you see any of these — they are the common failure modes:

- **Text of any kind.** Even garbled. It will not be usable.
- **A soccer ball.** Pentagons mixed with hexagons means the model ignored
  the reference. The whole point is that all faces are congruent.
- **Saturated flat panel fills.** The tints must read as washes over a
  visible ground, or the material is lost and only the palette survives.
- **A contact shadow or a table.** The sphere must be extractable.
- **A glossy or metallic ball.** Matte museum object, not a product render.
- **A vignette or background gradient.** It makes the background
  non-uniform and unremovable.

## What to bring back

The useful output is six specific things, not "the picture":

1. **Six to eight hex values** sampled off the render — panel washes, seam
   line, parchment ground, highlight peak, terminator, limb bounce.
2. **The seam treatment** — line weight relative to panel size, and whether
   seams read as darker than the panels or lighter.
3. **The lighting model** — where the highlight center sits, how far the
   terminator falls, how strong the limb bounce is. This becomes the
   `radialGradient` that is currently a placeholder in the prototype.
4. **The surface texture**, via Prompt C, run through `TEXTURE-PIPELINE.md`.
5. **Whether the tint washes read at 26% strength** (`FILL_BASE` in the
   prototype) or need to move.
6. **Label typography** — whether labels want to sit directly on the panel,
   on a plate, or in a cartouche.
