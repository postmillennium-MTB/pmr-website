# Lateral wheel-strength regression

Full-factorial OLS regression against the app's own 30-hub catalogue
(`HUBS_148` + `HUBS_157` from `src/data.js`, read live by `hubs.js`), a 5-rim catalogue, and four
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

- On page load the explorer starts with six betas switched on: tension
  split, flange width, mean PCD, axle standard, spoke count and wheel size.
  Rim stiffness is off by default because `rim_stiffness_index` is an
  estimate (see "Rim catalogue and the stiffness estimate" below), while
  spoke count and wheel size are verified build specs. Rim stiffness is
  still available as a chip.
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
| `wheel_erd` | effective rim diameter, mm (567 = 27.5″, 605 = 29″) | verified | app's own `RIM_ERD_BY_SIZE` table; Tenet Coven AL spec page |

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

applied uniformly to all four of Ford's constants (EIL, EIR, GJ, EA_rim) of
a measured base rim. Index 1.00 is the **DT Swiss TK540 as measured by
Matthew Ford** (Ford, Peng and Balogun 2018; Ford's
[rim stiffness library](https://bicyclewheel.info/rim-stiffness/)): EI_lat
260, EI_rad 211, GJ 75 N&middot;m&sup2;, EA 7.2 MN from its 550 g mass. It is
the same rim the Lab itself uses for every build. Until November 2026 the
base was an unsourced 50 / 150 / 22 N&middot;m&sup2; and 11.5 MN, softer
laterally than any rim Ford measured; see "Results" for what changed.
See the code comments in `build_dataset.js` for the full reasoning and its
limits. Treat it as a labeled estimate for exploring sensitivity, not a
claim about exactly how much stiffer an ENVE M730 is than a Stan's Flow S2.

### Real measured rim stiffness data exists -- just not for these rims

Matthew Ford measured eleven rims with the acoustic method in Ford, Peng and
Balogun (2018) and publishes them in his
[rim stiffness library](https://bicyclewheel.info/rim-stiffness/). Seven of
them are also the rim presets in his wheel-app
([`dashdotrobot/wheel-app`](https://github.com/dashdotrobot/wheel-app),
`wheel-app/helpers.py`):

| Rim | Size | Mass | EI_rad (N&middot;m&sup2;) | EI_lat (N&middot;m&sup2;) | GJ (N&middot;m&sup2;) |
|---|---|---|---|---|---|
| Alex ALX-295 | 700C | 480g | 310 | 210 | 85 |
| Alex X404 27" | 27" | 595g | 130 | 150 | 15 |
| Alex Y2000 26" | 26" | 460g | 110 | 130 | 15 |
| Alex Y2000 700C | 700C | 550g | 125 | 160 | 20 |
| DT Swiss R460 | 700C | 460g | 280 | 230 | 100 |
| **DT Swiss TK540** (this analysis's base rim) | 700C | 550g | 211 | 260 | 75 |
| H Plus Son TB14 | 700C | 490g* | 89 | 224 | 32 |
| Mavic A119 32h | 700C | 540g | 140 | 232 | 44 |
| Stan's Grail MK3 24h | 700C | 440g* | 330 | 230 | 190 |
| Sun-Ringle CR18 20" | 20" | 380g | 100 | 150 | 25 |
| Sun-Ringle CR18 700C, 36h | 700C | 540g | 110 | 220 | 25 |

\* Maker's mass, not independently measured; Ford notes the true stiffness
would be correspondingly higher if the true mass is.

One of these, the Sun-Ringle CR18 700C, is also his actual physical test
article: his `phd-thesis` repo (`data/lateral_stiffness_tension/wheel_info.csv`,
rim serial `BR17282958`) has a four-point-bend lab measurement of that exact
rim -- EI&asymp;266/113 N&middot;m&sup2; (lat/rad) and GJ&asymp;25.9
N&middot;m&sup2; -- with a documented Monte Carlo error-propagation method
in his `rim-testing` repo. That's the one number in this entire analysis
traceable to an actual physical bending test rather than a spec sheet or a
rule of thumb.

**Why none of this replaces `rim_stiffness_index` above**: none of the
eleven is a modern wide tubeless MTB rim like the 5 in this catalogue (the
closest are the Stan's Grail MK3, a tubeless gravel rim, and the TK540, a
current DT Swiss trekking rim). Only the TK540 is used, as the base the
index scales; the five catalogue rims are still estimates relative to it.
If Ford's acoustic method (the paper is in wheel-physics-core's `papers/`)
is applied to one of this catalogue's actual 5 rims, this is where that
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
- **Wheel size** (27.5″ / 29″, ERD 567mm / 605mm): this hub/rim catalogue
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

**Hub dimensions are not stored here.** `hubs.js` reads `HUBS_148` and
`HUBS_157` straight out of the app's `src/data.js` inside
`wheel-lab-source.zip` (repo root), so there is one hub list for the whole
repo. To change a hub, edit it in the archive; never in this folder.

`explorer.html` carries an embedded copy of the 2,400 rows and the per-hub
geometry lookup, because it has to run as a standalone page. Those two
blocks sit between `BEGIN/END GENERATED` markers and are rewritten by
`build_explorer.js` -- don't hand-edit them. After any hub change:

```bash
npm install                 # pulls wheel-physics-core, pinned to the same
                             # commit as the main app's package.json
node build_explorer.js      # regenerates explorer.html's DATA + HUB_GEOM
node build_dataset.js > dataset.json
pip install numpy pandas statsmodels
python3 regression.py       # also writes wheel_strength_dataset.csv
```

Requires `unzip` on the PATH (preinstalled on macOS, most Linux, and the
CI runner).

`regression.py` prints the raw-unit OLS summary (cluster-robust SEs by
hub), standardized (z-scored) betas with p-values, VIF per predictor, and
partial R^2 per predictor, then writes `wheel_strength_dataset.csv`.

## Results (n=2,400)

Y is `F_lat` from wheel-physics-core at commit 1e81384: first spoke slack in
Ford's fully-discrete-spoke Mode Matrix (each spoke at its own rim angle,
lateral and radial coupled), on rims scaled from the measured DT Swiss
TK540 (see the rim catalogue above). Every one of the 2,400 builds is at or
below 50% of its discrete buckling tension.

R^2 = 0.982, adj. R^2 = 0.982 (SEs clustered by hub).

| Beta | std beta | p (clustered) | VIF | partial R^2 |
|---|---|---|---|---|
| `tension_kgf` | 0.645 | <0.001 | 1.00 | 0.416 |
| `tension_ratio` | 0.472 | <0.001 | 1.75 | 0.127 |
| `rim_stiffness_index` | 0.373 | <0.001 | 1.00 | 0.139 |
| `flange_width` | 0.294 | <0.001 | 3.35 | 0.026 |
| `spoke_count` | 0.269 | <0.001 | 1.00 | 0.072 |
| `wheel_erd` | -0.195 | <0.001 | 1.00 | 0.038 |
| `spoke_diameter` | -0.072 | <0.001 | 1.00 | 0.005 |
| `standard_157` | -0.013 | 0.150 | 4.17 | <0.0001 |
| `pcd_mean` | 0.009 | 0.077 | 1.07 | 0.0001 |

**Reading it, in order of what's actually driving strength:**

1. **Build tension leads** (std beta 0.64, partial R² 0.42). With the
   measured rim no build is near buckling, so more tension means more
   lateral strength in every one of them.
2. **Tension symmetry is second** (std beta 0.47), ahead of flange width
   (0.29).
3. **Rim stiffness is third** (std beta 0.37, partial R² 0.14). It led
   everything on the earlier soft base rim (std beta 0.60), because that
   rim put many builds close to buckling, where rim stiffness matters most.
4. **Spoke count has a real, moderate effect** (std beta 0.27).
5. **Wheel size works against you as it grows** (std beta -0.20): the
   larger radius shrinks the bracing angle.
6. **Thicker spokes slightly lower lateral first-slack strength**
   (std beta -0.07): at the same tension a stiffer spoke sheds its tension
   with less rim movement.
7. **`pcd_mean` and `standard_157` remain negligible** once flange width
   and symmetry are in the model, as in every previous pass.

VIF for every build-spec beta is exactly 1.00 -- they're orthogonal to
everything else and to each other by construction (a balanced factorial
design). `flange_width` and `standard_157` still carry the same ~3-4 VIF
from 157mm hubs mechanically running wider flanges.

**What changed with the measured rim (November 2026).** On the earlier
50 / 150 / 22 N&middot;m&sup2; base the same model gave R^2 = 0.927 with rim
stiffness first (std beta 0.60), tension fourth (0.34), and 45 builds at
80% or more of buckling (highest 97.8%). The near-buckling builds were where
the linear fit broke down and where extra tension or thinner spokes could
make a wheel weaker. On the measured rim those builds no longer exist, so
the fit is tighter and the effects are more uniform. Lateral strength
averages 42 kgf across the dataset, against 25 kgf before.

## What the wheel strength regressor actually tells you

Plain-language takeaways for wheel builders and buyers, written 2026-11-03
and re-run 2026-11-11 on the measured base rim with the sourced ERDs,
from the 2,400-row dataset above. All numbers come from Matthew Ford's Mode
Matrix model (PhD thesis, Northwestern, 2018) as implemented in
`wheel-physics-core`. They are model outputs, not lab tests.

**What "strength" means here.** Y is the load at which the first spoke goes
slack in Ford's discrete-spoke model: sideways for lateral (`F_lat`),
vertical for radial (`F_rad`). It measures how much spoke tension is left
in reserve, not a breaking load. Lateral averages about 42 kgf and radial
about 195 kgf across the dataset. Read the numbers relative to each other
("this build is 20% stronger than that one"), not as how hard a wheel can be
cornered before it fails.

**Lateral and radial.** The explorer fits lateral only. The radial figures
below come from the same `calc()` call (`F_rad`) on the same 2,400 builds;
they are included because the two directions reward different things.

**Method.** The dataset is a full factorial, so for any single change (for
example 28 to 32 spokes) there are hundreds of twin builds that differ only
in that one thing. The percentages below are medians across those twins,
with ranges where they matter. This is more direct than reading the
regression betas, and collinearity does not affect it. Figures re-run
2026-11-11 on the measured TK540 base rim with the sourced ERDs (hub-pair rows: from 2026-11-10; the best and worst hubs and their percentages came out the same after the ERD change).

### What we can say for sure (within Ford's model)

These are exact same-wheel comparisons. The only open question is whether
Ford's model matches real wheels, not the statistics.

| Change, everything else held fixed | Lateral strength | Radial strength | How consistent |
|---|---|---|---|
| Same brand, 148 hub &rarr; 157 hub (14 pairs) | +18% (range +15 to +27%) | +6% (+3 to +18%) | All 14 pairs gain, on both axes |
| Best hub vs worst hub, same build | 1.5&times; | 1.4&times; | Every build |
| Tension 90 &rarr; 120 kgf | +29% (+22 to +31%) | +34% | Every build, both axes |
| 29" &rarr; 27.5" | +8% | +3% | Every build, both axes |
| 28 &rarr; 32 spokes | +11% | +8% | Every build, both axes |
| 15g (1.8 mm) &rarr; 14g (2.0 mm) spokes | &minus;3% | &minus;5% | Down in every build, both axes |

What each row means on the bike:

1. **Hub choice can matter as much as a rim upgrade.** The weakest hubs
   laterally are the DMR Zone 148 and e*thirteen Sidekick 148, about 21%
   below average. Both have a 21 mm drive-side flange offset, so the drive
   side carries most of the tension. The strongest are the Spank Hex J-Type
   157, KOM Xeno 157 and Project 321 G3 157, 17 to 19% above average; all
   three have unusually even tension.
2. **Tension is the biggest lever, and on this rim it never backfires.**
   Going from 90 to 120 kgf adds 22 to 31% lateral strength in every
   build, a little more on the stiffer (carbon) rims. On the earlier soft
   base rim 75 builds sat at 90 to 98% of buckling and got weaker with
   more tension; no build here comes within 50% of buckling.
3. **The 29" penalty is mostly sideways.** A larger wheel gives the spokes
   a shallower angle to the hub. That costs 7 to 12% lateral and about 3%
   radial.
4. **Spoke count is the most predictable lever.** Four more spokes add
   about 11% lateral, with almost no spread across hubs and rims.
5. **Thicker spokes don't raise the first-slack threshold.** At the same
   tension, a stiffer spoke loses its tension with less rim movement, so it
   reaches slack slightly sooner, sideways and vertically.

### What we can reasonably infer

These go one step past the data, so each says what it rests on.

1. **For a 29er rear wheel, choose flange spacing first.** The 29" size
   costs about 8% lateral strength, and a 157 hub or a wide-flange 148 hub
   wins more than that back. *Rests on:* the hub and wheel-size rows
   above, which add up roughly independently in this data.
2. **Tensioning to the rim maker's maximum buys strength.** In this model
   it does so for every build here. *Rests on:* the tension row, on a rim
   with measured stiffness. Real rim limits also involve eyelet cracking
   and fatigue, which this model does not cover, so the rim maker's
   maximum still applies; and a rim much softer than the TK540 would
   bring back the near-buckling cases.
3. **14g spokes are a durability and buckling-margin choice, not a
   strength-number choice.** At the same tension a 2.0 mm spoke runs about
   19% lower stress than a 1.8 mm spoke. In this data it also lowers the
   wheel's tension-to-buckling ratio by about 12%. Fatigue life is not part
   of Ford's static model, so the durability half of this point is general
   engineering, not a result of this tool.
4. **Lateral and radial reward different hub traits.** Lateral strength
   tracks total flange width and tension symmetry; radial tracks mostly
   symmetry. The Project 321 G3 157 and KOM Xeno 157 are the best radially
   (16 to 18% above average) because their tension is very even. The
   narrow KOM Xeno 148 is the best 148 radially (+12%) but only middling
   laterally (+3%). A hub that does well on one axis does not
   automatically do well on the other.
5. **The rim result is the least trustworthy big number.** Carbon rims come
   out 12 to 15% stronger laterally than the XM 481, but most of that comes
   from this tool's own 1.35&times; carbon stiffness guess. Set the carbon
   chip to 1.0 and the edge shrinks to +4% (We Are One Convert) and +7%
   (ENVE M730); at 0.75 both carbon rims come out slightly below the XM
   481. The gaps between alloy rims (Stan's Flow S2 about 4% below the XM
   481) come only from rim depth in the estimate, not from measured
   stiffness.

### Limits

- **A model, not test data.** Every number is Ford's validated theory
  applied to published hub dimensions. No wheel in this dataset was built
  or loaded. The engine matches Ford's own code to floating-point
  precision, but that checks the port, not the physics against real rims.
- **Collinearity between hub traits.** 157 hubs, total flange width and
  tension balance tend to come together across the 30 hubs (157 vs flange
  width correlation 0.76, 157 vs balance 0.45). The regression splits their
  shared effect among them somewhat arbitrarily. Fit lateral strength on
  the 157 flag alone and it is worth +7.0 kgf. Add flange width, balance
  and the build specs and its coefficient drops to &minus;0.2 kgf. The 157
  bar near zero in the explorer does not mean axle width doesn't matter.
  Its benefit shows up through the wider flanges and more even tension it
  brings, as the same-brand pairs show.
- **Thirty hubs is the real sample for hub geometry.** Each hub appears 80
  times, but those rows are the same hub under different builds, not new
  hubs. The explorer's confidence whiskers treat all 2,400 rows as
  independent, so they are too narrow for the hub betas. The build-spec
  betas are exact by design, because each is perfectly balanced against
  everything else.
- **Linear fit, nonlinear wheel.** The regression assumes each factor adds
  a fixed amount. With the measured base rim no build is near buckling and
  the fit is tight (R^2 0.98), but a softer rim would bring back the
  near-buckling builds where the linear fit fails. The twin-build
  comparisons above are the safer read.
- **Rim stiffness is estimated.** No modern MTB rim in the catalogue has a
  measured bending or torsional stiffness. The base rim is measured (Ford's
  DT Swiss TK540), but each catalogue rim is scaled from it by an informed
  guess (see "Rim catalogue and the stiffness estimate" above).
- **A narrow range of builds.** Rear wheels only, two levels per build spec,
  the same spoke gauge on both sides, 3-cross lacing only, no 36h, no
  butted spokes, and no offset (asymmetric) rims.

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
