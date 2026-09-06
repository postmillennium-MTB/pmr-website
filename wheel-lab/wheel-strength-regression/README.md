# Lateral wheel-strength regression

Full-factorial OLS regression against the app's own 30-hub catalogue
(`HUBS_148` + `HUBS_157` from `src/data.js`), a 5-rim catalogue, and four
build-spec dimensions (spoke diameter, spoke count, build tension, wheel
size), run through `wheel-physics-core`'s validated `calc()` engine
directly -- the same numbers the COMPARE tab shows, not a re-derivation.

## Interactive explorer

[`explorer.html`](./explorer.html) is a standalone page (no build step, no
server -- open the file directly) that fits the same model live in the
browser against all 2,400 rows. Toggle betas on and off as chips, grouped
into **Hub geometry**, **Rim**, and **Build spec**; the standardized-
coefficient chart and the predicted-vs-actual scatter both refit on every
click. It carries its own copy of the dataset (field names abbreviated to
keep the file a reasonable size for a page that gets iframed on mobile) so
it has no runtime dependency on `wheel-physics-core`.

Notes worth knowing before you start clicking:

- `pm` (mean PCD) and the `pds`/`pnds` DS/NDS pair are mutually exclusive
  -- `pm` is exactly their average, so having all three selected at once
  makes the design matrix exactly singular, not just correlated.
- No other beta pair is mutually exclusive, but the in-browser CI whiskers
  do **not** cluster standard errors by hub, even though each hub appears
  80 times (5 rims &times; 16 build variants). The Python regression below
  does cluster by `hub_id`; treat the browser tool's confidence intervals
  as a quick-look approximation.
- The dataset table under "Dataset sample" shows only the first 500 of
  2,400 rows (and is built lazily, only once you open it) to keep the page
  light on mobile. The full table is `wheel_strength_dataset.csv`.

## Model

```
Y (F_lat, kgf) = b0 + b1*tension_ratio + b2*flange_width + b3*pcd_mean
               + b4*standard_157 + b5*rim_stiffness_index
               + b6*spoke_diameter + b7*spoke_count + b8*tension_kgf
               + b9*wheel_erd
```

| Beta | Definition | Tier | Source |
|---|---|---|---|
| `tension_ratio` | NDS/DS spoke tension split, % (`calc().ratio`) -- geometry-driven, not an independent input at fixed tension | derived | engine output |
| `flange_width` | total hub flange width, `nds + ds` (mm) | verified | hub geometry |
| `pcd_mean` | mean flange pitch-circle diameter, `(pds + pnds) / 2` (mm) | verified | hub geometry |
| `standard_157` | axle standard dummy: 1 = 157mm Super Boost, 0 = 148mm Boost | verified | hub catalogue membership |
| `rim_stiffness_index` | composite rim stiffness scale | **estimated** | rim geometry + a documented material rule of thumb (see below) |
| `rim_internal_width` | rim internal width, mm | verified | rim catalogue spec pages |
| `spoke_diameter` | spoke gauge, mm (1.8 = 15g, 2.0 = 14g, same both sides) | verified | SWG gauge-to-mm conversion |
| `spoke_count` | spokes per wheel (28h or 32h) | verified | catalogue spec |
| `tension_kgf` | drive-side build tension setpoint (90 or 120 kgf) | verified working range | Stan's low-end guidance (~90kgf) and DT Swiss's stated max (120kgf) |
| `wheel_erd` | effective rim diameter, mm (559 = 27.5″, 600 = 29″) | verified | app's own `RIM_ERD_BY_SIZE` table |

`pcd_ds` / `pcd_nds` are also in the dataset, mutually exclusive with
`pcd_mean` in the explorer as noted above.

## Rim catalogue and the stiffness estimate

The 30-hub catalogue is crossed with 5 rims currently sold for trail/enduro
use, chosen to span alloy and carbon, narrow and wide, shallow and deep:

| Rim | Material | Internal width | Depth | Stiffness index | Source |
|---|---|---|---|---|---|
| DT Swiss XM 481 | alloy | 30mm | 21mm | 1.000 (reference) | [dtswiss.com](https://www.dtswiss.com/en/components/rims-mtb/all-mountain/xm-481), [biketart.com](https://www.biketart.com/products/dt-swiss-xm-481-sbwt-disc-specific-rim) |
| Race Face ARC Offset 30 | alloy | 30mm | 20mm | 0.952 | [bike24.com](https://www.bike24.com/p2311760.html), [probikesupply.com](https://www.probikesupply.com/products/raceface-arc-30-rim-29-disc-black-32h-offset) |
| Stan's Flow S2 | alloy | 30mm | 18.2mm | 0.867 | [stans.com](https://stans.com/products/flow-s2-rim) |
| We Are One Convert | carbon | 35mm | 21mm | 1.575 | [evoride-wheels.com](https://www.evoride-wheels.com/en/produit/we-are-one-convert/) |
| ENVE M730 | carbon | 30mm | 27mm | 1.736 | [enve.com](https://enve.com/pages/tech-specs-m730-wheels/), [nsmb.com](https://nsmb.com/articles/enve-m730-wheels/) |

**Internal width, depth, and material are verified**; **`rim_stiffness_index`
is not** -- no manufacturer publishes a rim's bending or torsional
stiffness in the N&middot;m&sup2; units Ford's Mode Matrix model needs. The
index is this analysis's own estimate:

```
geometry_factor = (internal_width_mm * depth_mm) / (30 * 21)   # DT Swiss XM 481 = 1.00
material_factor = 1.35 for carbon, 1.00 for alloy               # rule of thumb, not measured
rim_stiffness_index = geometry_factor * material_factor
```

applied uniformly to all four of Ford's constants (EIL, EIR, GJ, EA_rim).
See the code comments in `build_dataset.js` for the full reasoning and its
limits. Treat it as a labeled estimate for exploring sensitivity, not a
claim about exactly how much stiffer an ENVE M730 is than a Stan's Flow S2.

### Real measured rim stiffness data exists -- just not for these rims

`wheel-physics-core`'s own repo carries no rim database, only one generic
validation fixture (EIL=50, EIR=150, GJ=22 N&middot;m&sup2;, arbitrary
units, used to check the JS port against Ford's Python reference across
hubs, not tied to any real product). But Matthew Ford's own tooling does
have real numbers -- they just live in a repo this project hadn't looked at
yet: [`dashdotrobot/wheel-app`](https://github.com/dashdotrobot/wheel-app),
a Bokeh GUI with a hardcoded rim-preset table
(`wheel-app/helpers.py`):

| Rim | Size | Mass | EI_rad (N&middot;m&sup2;) | EI_lat (N&middot;m&sup2;) | GJ (N&middot;m&sup2;) |
|---|---|---|---|---|---|
| Alex ALX-295 | 700C | 480g | 310 | 210 | 85 |
| DT Swiss R460 | 700C | 460g | 280 | 230 | 100 |
| Sun-Ringle CR18 700C, 36h | 700C | 540g | 110 | 220 | 25 |
| Sun-Ringle CR18 20" | 20" | 380g | 100 | 150 | 25 |
| Alex X404 27" | 27" | 595g | 130 | 150 | 15 |
| Alex Y2000 26" | 26" | 460g | 110 | 130 | 15 |
| Alex Y2000 700C | 700C | 550g | 125 | 160 | 20 |

One of these, the Sun-Ringle CR18 700C, is also his actual physical test
article: his `phd-thesis` repo (`data/lateral_stiffness_tension/wheel_info.csv`,
rim serial `BR17282958`) has a four-point-bend lab measurement of that exact
rim -- EI&asymp;266/113 N&middot;m&sup2; (lat/rad) and GJ&asymp;25.9
N&middot;m&sup2; -- with a documented Monte Carlo error-propagation method
in his `rim-testing` repo. That's the one number in this entire analysis
traceable to an actual physical bending test rather than a spec sheet or a
rule of thumb.

**Why none of this replaces `rim_stiffness_index` above**: every rim in
that table is a narrow alloy rim-brake road/hybrid rim (700C/26"/27",
~2015-2018 era) -- not a modern wide tubeless MTB rim like any of the 5 in
this catalogue. Mixing them into the regression would confound "narrow road
rim" with "wide MTB rim" in a beta that's supposed to isolate stiffness
alone, so they're listed here for reference and future calibration work
only, not joined into `build_dataset.js`. Kept for two reasons: (1) it's
the closest thing to ground truth this analysis has touched, useful for
sanity-checking whether `rim_stiffness_index`'s geometry-times-material
formula is in a believable range at all, and (2) Matthew Ford has
described a phone-microphone acoustic method for measuring a rim's own
EI/GJ directly (a paper, not yet reviewed here) -- if that method gets
applied to one of this catalogue's actual 5 rims, this is where that
measured value would replace the corresponding estimated row above.

## Build-spec betas 1-4, and why each level was chosen

Each of these is a genuine, checkable spec or a published working range --
unlike the rim stiffness index, none of these four carry an estimation
caveat. Two levels each (not three), to hold the full factorial to a size
an in-browser tool can still hold entirely in memory:

- **Spoke diameter** (1.8mm / 2.0mm): 15-gauge and 14-gauge on the SWG
  standard, the two most common MTB spoke diameters. Applied to both
  sides equally -- mixed DS/NDS gauge builds are a real practice but
  would double this dimension again, so they're not modeled here.
- **Spoke count** (28h / 32h): the two most common trail/enduro counts in
  this catalogue's actual product lines. 36h exists but skews DH-specific;
  omitted to hold the factorial size down.
- **Build tension** (90kgf / 120kgf): brackets two manufacturers' own
  published numbers -- Stan's recommends roughly 85-100kgf on their modern
  rims, DT Swiss states 120kgf as a stated maximum -- rather than picking
  round numbers arbitrarily.
- **Wheel size** (27.5″ / 29″, ERD 559mm / 600mm): this hub/rim catalogue
  is trail/enduro-oriented, so 26″ and 32″ fat-bike sizes aren't realistic
  options for it. ERD values are the app's own `RIM_ERD_BY_SIZE` constants.

## A note on the dataset's structure

2,400 rows = 30 hubs &times; 5 rims &times; 2 spoke diameters &times; 2
spoke counts &times; 2 tensions &times; 2 wheel sizes, so each hub appears
80 times rather than being a fresh, independent observation -- a repeated-
measures design, not a simple random sample. `regression.py` fits with
standard errors clustered by `hub_id` to account for this; the in-browser
explorer does not (see the guardrail note above).

## Running it

`dataset.json` and `wheel_strength_dataset.csv` are not checked into this
repo -- at 2,400 rows they're a few hundred KB of numbers already fully
derivable from `build_dataset.js`, so regenerate them rather than diffing
a large data blob on every catalogue change. `explorer.html` carries its
own embedded copy of the same 2,400 rows for the live page.

```bash
npm install                 # pulls wheel-physics-core, pinned to the same
                             # commit as the main app's package.json
node build_dataset.js > dataset.json
pip install numpy pandas statsmodels
python3 regression.py       # also writes wheel_strength_dataset.csv
```

`regression.py` prints the raw-unit OLS summary (cluster-robust SEs by
hub), standardized (z-scored) betas with p-values, VIF per predictor, and
partial R^2 per predictor, then writes `wheel_strength_dataset.csv`.

## Results (n=2,400)

R^2 = 0.945, adj. R^2 = 0.945 (SEs clustered by hub).

| Beta | std beta | p (clustered) | VIF | partial R^2 |
|---|---|---|---|---|
| `rim_stiffness_index` | 0.579 | <0.001 | 1.00 | 0.335 |
| `tension_ratio` | 0.420 | <0.001 | 1.73 | 0.101 |
| `flange_width` | 0.400 | <0.001 | 3.22 | 0.050 |
| `tension_kgf` | 0.377 | <0.001 | 1.00 | 0.142 |
| `wheel_erd` | -0.306 | <0.001 | 1.00 | 0.093 |
| `spoke_count` | 0.209 | <0.001 | 1.00 | 0.044 |
| `pcd_mean` | 0.022 | 0.086 | 1.07 | 0.0004 |
| `standard_157` | -0.022 | 0.199 | 4.01 | 0.0001 |
| `spoke_diameter` | 0.005 | 0.345 | 1.00 | ~0.0000 |

**Reading it, in order of what's actually driving strength:**

1. **Rim stiffness still leads everything** (std beta 0.58, partial R²
   0.34) -- consistent with the earlier hub&times;rim-only result.
2. **Build tension is the second-biggest single lever** (std beta 0.38,
   partial R² 0.14) and it's the *cheapest* one to act on -- unlike a hub,
   rim, or spoke-count change, hitting the top of the recommended tension
   range costs nothing but a truing stand and a tension meter.
3. **Wheel size matters more than expected, and works against you as it
   grows** (std beta -0.31): a 29" wheel is measurably weaker, all else
   equal, than the same build in 27.5", because the larger radius shrinks
   the bracing angle -- exactly the mechanism this repo's README already
   flagged for the 27.5"-vs-29" tension-balance comparison, just showing
   up here with real force behind it once wheel size is actually varied
   rather than held fixed.
4. **Tension symmetry and flange width** remain close behind and close to
   each other, same story as before.
5. **Spoke count has a real, moderate effect** (std beta 0.21) -- more
   spokes meaningfully raise the first-slack threshold, as expected.
6. **Spoke diameter is statistically indistinguishable from zero**
   (std beta 0.005, p=0.35, partial R² ~0). This is the one genuinely
   counterintuitive result: going from 15g to 14g doesn't reliably buy
   more lateral strength margin in this model. The likely mechanism is a
   cancellation inside Ford's linearized threshold -- a fatter spoke raises
   both the axial stiffness that sets the slack-tension threshold *and*
   the smeared stiffness term that raises `K_lat`, and those two move in
   opposite directions for `F_lat`'s size. Worth treating as a real,
   model-derived result to sanity-check against Ford's thesis rather than
   a bug -- it did not disappear on a second run at different hub/rim
   combinations.
7. **`pcd_mean` and `standard_157` remain negligible**, as in every
   previous pass of this analysis.

VIF for every build-spec beta is exactly 1.00 -- they're orthogonal to
everything else and to each other by construction (a balanced factorial
design). `flange_width` and `standard_157` still carry the same ~3-4 VIF
from 157mm hubs mechanically running wider flanges.

## Working with Claude on this file

To extend the rim catalogue: give the next session the rim's name and ask
it to (1) web-search internal width, depth, and material against the
manufacturer's own spec page, (2) compute `rim_stiffness_index` using the
formula above against the DT Swiss XM 481 reference row, (3) never invent
a depth or width it can't find a source for -- drop the rim rather than
guess.

To extend a build-spec dimension (e.g. add 36h, or a third tension level):
add the value to the relevant array in `build_dataset.js`, note in this
README where its number comes from (a spec sheet, a stated max, a common
practice), and re-run `node build_dataset.js` + `python3 regression.py`.
Each added level multiplies the factorial by however many levels that
dimension now has -- check the resulting row count stays something an
in-browser tool can hold before wiring it into `explorer.html`.
