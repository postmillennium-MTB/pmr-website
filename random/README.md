# Stochastic OS — model details

Companion document for [`/random/`](https://www.postmillenniumrenaissance.com/random/), the
Post Millennium Renaissance randomness lab. It records, for every model in the tool, **what it is,
the formula and parameters the code uses, where it came from, and how well that has been checked**, so
that anyone can trace a model back to its origin and re-check it.

> **Status: working draft.** Citations were assembled from memory and from a research pass that opened
> few primary papers. Treat every entry as a pointer to the literature, not as an authority. The
> confidence tags below say how far each claim has been checked. The disclaimer at the bottom is a
> **placeholder**.

## How to read the confidence tags

| Tag | Meaning |
|---|---|
| **[N]** | **Numerically verified in this build.** A test was run against a published reference value or a theoretical identity (for example Mersenne Twister's first outputs, a copula's Kendall τ). It checks that *the code does what the formula says*; it does not check the citation. |
| **[V]** | **Verified against a source** (web page or paper abstract) during the research pass. The URL is given. |
| **[R]** | **Recalled** from the literature, not re-checked. Verify the citation and the constants before relying on them. |

A line with no tag has not been checked at all.

## Contents

1. [Conventions used by the tool](#conventions-used-by-the-tool)
2. [Randomness & Chaos generators](#randomness--chaos-generators)
3. [Strange attractors](#strange-attractors)
4. [Core 4 — the 3-D viewer](#core-4--the-3-d-viewer)
5. [Copulas](#copulas)
6. [Financial stochastic processes](#financial-stochastic-processes)
7. [Shared numerical methods](#shared-numerical-methods)
8. [Verification log](#verification-log)
9. [Not yet included](#not-yet-included)
10. [Adding a model](#adding-a-model)
11. [Disclaimer (placeholder)](#disclaimer-placeholder)

## Conventions used by the tool

- Every model draws **1,500 points**. Scatter models plot `(x, y)`; "line" models plot a time series.
- **Core** models are always listed. **Advanced** models (marked ⚙ below) are hidden until switched on in
  the Core 1 "Advanced models" menu.
- A **dial** is a 0–100 % slider that moves one real parameter between two end values; the real value
  is printed beside it. The slider starts at the "classic" (published or textbook) value.
- Advanced stochastic models use a **seeded** random stream, so moving a dial changes only the
  parameter, not the random draws. The "Re-roll" buttons change the seed.
- Copula models are on **uniform margins** natively. "Normal margins" maps them to standard normal
  (probit) and puts all active copulas on one shared axis range so tails can be compared directly.
- Parameter values are **illustrative teaching values**, not calibrated to any market, unless noted.
- Every strange-attractor model has at least one dial. Most 3-D flows also have an **Orbit length** dial (0.25×–4×), which scales how much of the trajectory the 1,500 points cover.
- **Re-roll** picks a new random start. For the two models whose orbit is deterministic from a fixed start (Halvorsen, Tinkerbell) it instead picks a different stretch of the same orbit, so the picture still changes.
- **Core 4** (below) shows the 3-D models as a rotating 3-D plot.

---

## Randomness & Chaos generators

### Core models

#### Math.random (browser PRNG)
- **What:** the generator built into the browser. In Chrome/V8 it has been xorshift128+ since V8 4.9.41 (Chrome 49); before that it was a weak multiply-with-carry generator. Firefox and Safari use their own generators, so the *exact* stream differs by browser. **[V]** <https://v8.dev/blog/math-random>
- **Origin:** xorshift128+ — S. Vigna, "Further scramblings of Marsaglia's xorshift generators", *J. Comput. Appl. Math.* 315 (2017); arXiv:1404.0390. **[R]**
- **In the tool:** `Math.random()` for both coordinates. No parameters.

#### Linear Congruential (LCG)
- **Formula:** `x' = (a·x + c) mod m`, with `a = 1664525`, `c = 1013904223`, `m = 2³²`.
- **Origin:** D. H. Lehmer (1951); constants from *Numerical Recipes in C* (Press et al., 2nd ed., 1992). **[R]** Constants listed in the LCG parameter table at <https://en.wikipedia.org/wiki/Linear_congruential_generator> **[V]**.
- **Shows:** points from successive outputs fall on a lattice of lines (Marsaglia 1968); the Core 3 "Algorithmic Forge" makes this visible as the state is shrunk.
- **Check:** the multiply stays below 2⁵³, so double arithmetic is exact.

#### Middle-Square (Von Neumann)
- **Formula:** square a 6-digit state, pad to 12 digits, keep the middle six: `x' = ⌊x²/10³⌋ mod 10⁶`.
- **Origin:** John von Neumann, c. 1946, described in "Various techniques used in connection with random digits", *Monte Carlo Method*, NBS Applied Mathematics Series 12 (1951). **[R]**
- **Known flaw, reproduced here:** from the textbook seed 123456 the sequence reaches the fixed point **625000** after 145 steps (625000² = 390625000000, whose middle six digits are 625000) and stays there. **[N]**
- **Switch:** *Reseed*, *Reseed + report* and *Pure* modes control what the tool does on collapse (see the in-page help).

#### Xorshift Engine
- **Formula:** xorshift32 — `x ^= x<<13; x ^= x>>>17; x ^= x<<5`.
- **Origin:** G. Marsaglia, "Xorshift RNGs", *J. Statistical Software* 8(14), 2003. **[R]** The (13, 17, 5) triplet is from memory.

#### Logistic Map (Chaos)
- **Formula:** `x' = r·x·(1−x)`, `r = 3.99`.
- **Origin:** R. M. May, "Simple mathematical models with very complicated dynamics", *Nature* 261, 459–467 (1976). **[R]**
- **Shows:** deterministic chaos in one variable; plotted against index so structure is visible.

#### Halton Sequence (Low-Disc.)
- **Formula:** van der Corput radical inverse in bases 2 and 3 for `(x, y)`.
- **Origin:** J. H. Halton, *Numerische Mathematik* 2 (1960) 84–90. **[R]**
- **Shows:** even coverage with no clumps, unlike pseudo-random points.

### Advanced models ⚙

#### ⚙ RANDU (IBM, 15 planes) — dial: viewing angle
- **Formula:** `x' = 65539·x mod 2³¹`. Consecutive triples satisfy `x_{n+2} = 6x_{n+1} − 9x_n (mod 2³¹)`, so `9x − 6y + z` is an integer and the triples lie on 15 planes.
- **Origin:** IBM System/360 Scientific Subroutine Package (1960s). G. Marsaglia, "Random numbers fall mainly in the planes", *PNAS* 61(1) (1968) 25–28. **[R]** Summary of the 15 planes: <https://en.wikipedia.org/wiki/RANDU> **[V]**
- **In the tool:** each triple is projected to 2-D. At 0° the view is edge-on to the planes, so they show as 15 vertical lines; at 90° the structure is hidden. **[N]** (15 distinct plane offsets counted).
- **Note:** the "truly horrible" remark often attributed to Knuth is second-hand.

#### ⚙ Sobol Sequence (2-D)
- **Formula:** base-2 digital net; point *n* from the Gray code of *n* and direction numbers. Dimension 1 is the van der Corput sequence; dimension 2 uses the primitive polynomial `x+1` with `m₁ = 1`, `m_i = 2m_{i−1} ⊕ m_{i−1}`.
- **Origin:** I. M. Sobol', *USSR Comput. Math. Math. Phys.* 7(4) (1967) 86–112 **[R]**; direction numbers: S. Joe & F. Y. Kuo, *SIAM J. Sci. Comput.* 30(5) (2008) 2635–2654 **[V]** <https://web.maths.unsw.edu.au/~fkuo/sobol/>
- **Check:** first points `(0,0) (0.5,0.5) (0.75,0.25) (0.25,0.75) (0.375,0.375)` match the standard sequence. **[N]**
- **Finance link:** quasi-Monte Carlo in high-dimensional pricing — Paskov & Traub, *J. Portfolio Management* 22(1) (1995), pp. 113 ff. (CMO valuation, dimension up to 360; sources disagree on the last page). **[V]**. The advantage depends on effective dimension; it should not be quoted for a 2-D toy.

#### ⚙ R2 Sequence (golden-ratio lattice)
- **Formula:** `x_n = {s₀ + n/φ₂}`, `y_n = {s₀ + n/φ₂²}`, `φ₂ = 1.32471795724…` (the plastic number, real root of `x³ = x + 1`), so `α₁ = 0.7548776662466927`, `α₂ = 0.5698402909980532`.
- **Origin:** M. Roberts, "The unreasonable effectiveness of quasirandom sequences" (2018), extremelearning.com.au. **[R]** (page could not be read in the research pass).
- **Check:** constants recomputed from the plastic-number definition. **[N]**

#### ⚙ Fibonacci Lattice
- **Formula:** rank-1 lattice, `(x_i, y_i) = ((i+½)/F_k, {i·F_{k−1}/F_k})` with `F_k = 1597`, `F_{k−1} = 987`; the first 1,500 of 1,597 points are drawn.
- **Origin:** lattice rules — H. Niederreiter, *Random Number Generation and Quasi-Monte Carlo Methods*, SIAM (1992). **[R]**
- **Shows:** the best 2-D lattice; the opposite of RANDU's bad lattice.

#### ⚙ Wichmann–Hill (3 combined LCGs)
- **Formula:** `x' = 171x mod 30269`, `y' = 172y mod 30307`, `z' = 170z mod 30323`; output `{x/30269 + y/30307 + z/30323}`.
- **Origin:** B. A. Wichmann & I. D. Hill, "Algorithm AS 183", *Applied Statistics* 31(2) (1982) 188–190. **[V]** (constants per <https://en.wikipedia.org/wiki/Wichmann%E2%80%93Hill>)
- **Check:** output mean 0.499 over 100,000 draws. **[N]**

#### ⚙ Mersenne Twister (MT19937)
- **Formula:** 624-word state, recurrence with `m = 397`, matrix constant `0x9908B0DF`, standard tempering; default seed 5489. Period 2¹⁹⁹³⁷ − 1.
- **Origin:** M. Matsumoto & T. Nishimura, "Mersenne Twister", *ACM TOMACS* 8(1) (1998) 3–30. **[V]** <https://en.wikipedia.org/wiki/Mersenne_Twister>
- **Check:** first three 32-bit outputs for seed 5489 are `3499211612, 581869302, 3890346734`, matching the reference implementation. **[N]**
- **Note:** looks like noise on a scatter plot; the lesson is that "looks random" is not the test. Known to fail some TestU01 linear-complexity tests and to be predictable from 624 outputs. **[V]**

#### ⚙ PCG32 (permuted LCG)
- **Formula:** 64-bit LCG state with multiplier `6364136223846793005`, output permutation XSH-RR (xorshift-high then random rotate), 32-bit output. Seeded `(42, 54)`.
- **Origin:** M. E. O'Neill, "PCG: A Family of Simple Fast Space-Efficient Statistically Good Algorithms for Random Number Generation", Harvey Mudd College tech. report HMC-CS-2014-0905 (2014). **[V]** <https://www.pcg-random.org/> Seed recovery from ~512 bytes of output: Bouillaguet et al. (2020). **[V]**
- **Check:** first six outputs for seed `(42, 54)` are `a15c02b7 7b47f409 ba1d3330 83d2f293 bfa4784b cbed606e`, matching the published demo output as recalled — confirm against pcg-random.org. **[N]**
- **Cost:** BigInt arithmetic; about 3,000 draws per render is fine.

#### ⚙ Chirikov Standard Map — dial: kick strength *K*
- **Formula:** `p' = p + K sin θ`, `θ' = θ + p'`, both mod 2π. Ten orbits from spread-out starts. This map is area-preserving (conservative), so it has *no attractor*; that is why it is listed here and not under Strange attractors.
- **Origin:** B. V. Chirikov, "A universal instability of many-dimensional oscillator systems", *Physics Reports* 52(5) (1979) 263–379. **[V]** (citation). Last invariant curve breaks near `K ≈ 0.9716` (J. M. Greene, *J. Math. Phys.* 20 (1979) 1183). **[R]**
- **Check:** the range of *p* along one orbit grows monotonically with *K* (0.37 at K = 0.2, 1.24 at K = 1, 11 at K = 3). **[N]**

## Strange attractors

Systems whose long-run behavior settles onto a bounded set with fractal structure (a *strange attractor*). Plotted as a scatter of the orbit or a line along it. Each has a dial that moves one parameter through its regimes (for example from regular motion to chaos, or from a thin to a wide attractor).

### Core models

#### Hénon Map (Strange Attractor) — dials: contraction *b* ("Attraction"), parameter *a*
- **Formula:** `x' = 1 − a·x² + y`, `y' = b·x`, `a = 1.4`, `b = 0.30` (dials: *b* 0.02–0.31; *a* 0.8–1.42).
- **Dial *a*:** at `b = 0.30` the orbit period-doubles as *a* rises: 2 points at a = 0.85, 4 at 1.0, then chaos from about 1.1, a periodic window near 1.3 (7 points), and full chaos at 1.4. **[N]** The attractor disappears at about `a = 1.43` (all 50 test starts escaped), so the dial stops at 1.42. **[N]**
- **Origin:** M. Hénon, "A two-dimensional mapping with a strange attractor", *Commun. Math. Phys.* 50 (1976) 69–77. **[R]**
- **Check:** at `a = 1.4` the attractor exists up to `b ≈ 0.31`; at 0.315 about 83 % of starting points escaped to infinity in a test, so the dial stops at 0.31. **[N]**

#### Lorenz Attractor (x–z) — dials: dissipation *β* ("Attraction"), heating *ρ*, orbit length
- **Formula:** `x' = σ(y−x)`, `y' = x(ρ−z)−y`, `z' = xy−βz`; `σ = 10`, `ρ = 28`, `β = 8/3` (dials: *β* 0.5–6; *ρ* 10–45). RK4, step 0.01.
- **Dial *ρ*:** the orbit spirals into a fixed point for small *ρ* (last-300-point spread of 0 at ρ = 12, 0.3 at 20) and becomes chaotic from about ρ = 24 (spread 8 at 24, 32 at 28). **[N]** The textbook threshold for sustained chaos at σ = 10, β = 8/3 is `ρ ≈ 24.74` **[R]**; just below it the motion is a long chaotic transient.
- **Origin:** E. N. Lorenz, "Deterministic nonperiodic flow", *J. Atmos. Sci.* 20 (1963) 130–141. **[R]**
- **Check:** with these values the nontrivial fixed points become stable near `β ≈ 3.2`, so at the strong end of the dial the chaos dies and the orbit spirals into a single point; in a test the last 200 points had zero spread at β = 6. **[N]**

### Advanced models ⚙

#### ⚙ Rössler Attractor (x–y) — dials: control parameter *c*, spiral parameter *a*, orbit length
- **Formula:** `x' = −y − z`, `y' = x + a·y`, `z' = b + z(x − c)`; `a = b = 0.2`, `c = 5.7` (dials: *c* 2.5–9; *a* 0.1–0.35). RK4, step 0.02.
- **Dial *a*:** at `c = 5.7` the Lyapunov estimate is ≈ 0 (regular loop) for `a = 0.1–0.15` and positive (chaos) from 0.2. **[N]**
- **Origin:** O. E. Rössler, "An equation for continuous chaos", *Phys. Lett. A* 57(5) (1976) 397–398. **[V]** (citation); the classic parameters are **[R]**.
- **Shows:** a single loop at small *c*, period-doubling, then chaos near 5.7. In a test, *c* = 2.5 gave one peak per loop and *c* = 3.5 gave two. **[N]**

#### ⚙ Thomas Attractor (x–y) — dial: damping *b*
- **Formula:** `x' = sin y − b·x`, `y' = sin z − b·y`, `z' = sin x − b·z`; default `b = 0.19` (dial 0.02–0.35). RK4, step 0.05.
- **Origin:** R. Thomas, "Deterministic chaos seen in terms of feedback circuits", *Int. J. Bifurcation Chaos* 9(10) (1999) 1889–1905. **[V]** Thresholds: Hopf at `b ≈ 0.32899`, chaos onset at `b ≈ 0.208186`, conservative at `b = 0` <https://en.wikipedia.org/wiki/Thomas%27_cyclically_symmetric_attractor> **[V]**
- **Check:** spread of the last 2,000 steps was 0 at `b = 0.35` (sink), small at 0.28 (limit cycle), large at 0.19 and 0.05 (chaos / wandering). **[N]**

#### ⚙ Ikeda Map (spiral attractor) — dial: dissipation *u*
- **Formula:** `x' = 1 + u(x cos t − y sin t)`, `y' = u(x sin t + y cos t)`, `t = 0.4 − 6/(1 + x² + y²)`; `u = 0.9` (dial 0.6–0.99).
- **Origin:** K. Ikeda, *Opt. Commun.* 30(2) (1979) 257–261; Ikeda, Daido & Akimoto, *Phys. Rev. Lett.* 45 (1980) 709. **[R]** Textbook values of *u* vary between 0.9 and 0.918 — **[R]**, unverified.

#### ⚙ Chen Attractor (x–z) — dial: control parameter *c*
- **Formula:** `x' = a(y − x)`, `y' = (c − a)x − xz + cy`, `z' = xy − bz`; `a = 35`, `b = 3`, `c = 28` (dial 20–28.4). RK4, step 0.002.
- **Origin:** G. Chen & T. Ueta, "Yet another chaotic attractor", *Int. J. Bifurcation Chaos* 9(7) (1999) 1465–1466. **[R]** Described as a dual of the Lorenz system (not topologically equivalent); chaos for `c ∈ [20, 28.4]` as recalled from the paper.
- **Check:** the largest Lyapunov exponent estimate was positive at every sampled `c` from 20 to 28.4 (0.60 at c = 20, 1.34 at c = 28). **[N]**

#### ⚙ Aizawa Attractor (x–z) — dial: offset *b*
- **Formula:** `x' = (z − b)x − dy`, `y' = dx + (z − b)y`, `z' = c + az − z³/3 − (x² + y²)(1 + ez) + fz x³`; `a = 0.95`, `b = 0.7`, `c = 0.6`, `d = 3.5`, `e = 0.25`, `f = 0.1` (dial on *b*, 0.6–0.9). RK4, step 0.01.
- **Origin:** **unverified.** The system circulates under the names Aizawa and Langford (W. F. Langford studied torus bifurcations in this family, 1984), and this parameter set is widely reproduced on graphics sites (for example Paul Bourke's attractor pages). No primary source was opened. **[R]**
- **Check:** below `b ≈ 0.58` the orbit collapses to a fixed point (z range of zero); near 0.7 the Lyapunov estimate was small and positive (≈ 0.10); at 0.8 and above it was ≈ 0 (regular motion). **[N]** So "chaotic" here means weakly chaotic; the picture is mainly a sphere with a tube through it.

#### ⚙ Chua Double Scroll (x–z) — dials: gain α, coupling β, orbit length
- **Formula:** `x' = α(y − x − g(x))`, `y' = x − y + z`, `z' = −βy`, with `g(x) = m₁x + ½(m₀ − m₁)(|x+1| − |x−1|)`; `β = 28`, `m₀ = −8/7`, `m₁ = −5/7`, `α = 15.6` (dials: α 9–18; β 24–36). RK4, step 0.005.
- **Dial β:** at α = 15.6 the Lyapunov estimate was positive for β = 24–32 (double scroll to one-sided), ≈ 0 at 36 (a single regular scroll), and the orbit ran away at β = 20. **[N]** The dial therefore starts at 24.
- **Origin:** T. Matsumoto, "A chaotic attractor from Chua's circuit", *IEEE Trans. Circuits Syst.* 31(12) (1984) 1055–1058; L. O. Chua, M. Komuro & T. Matsumoto, "The double scroll family", *IEEE Trans. Circuits Syst.* 33(11) (1986) 1072–1118. **[R]** The dimensionless constants are the commonly quoted set, also recalled.
- **Check:** with these constants the dial moves from a point (α = 9) through loops (≈ 11) and one-sided, single-scroll chaos (α ≈ 13.5, *x* confined to 0–2.2) to the two-sided double scroll from about α = 15. **[N]**

#### ⚙ Halvorsen Attractor (x–y) — dials: damping *a*, orbit length
- **Formula:** `x' = −ax − 4y − 4z − y²`, `y' = −ay − 4z − 4x − z²`, `z' = −az − 4x − 4y − x²`; `a = 1.4` (dial 1.3–2.6). RK4, step 0.005. Fixed start `(−1.48, −1.51, 2.04)`; Re-roll discards a random number of extra steps (up to 20 time units) so each re-roll shows a different stretch of the same orbit.
- **Origin:** presented in J. C. Sprott, *Elegant Chaos* (World Scientific, 2010), where it is named after Arne Dehli Halvorsen. **[R]**
- **Parameter conflict, resolved numerically:** sources quote `a = 1.4` and `a = 1.89`. At `a = 1.4` the Lyapunov estimate was clearly positive (0.49 after a long transient); at `a = 1.89` it was ≈ 0, so the orbit is regular. The tool uses 1.4. **[N]** Below about `a = 1.2` the orbit ran away to infinity in a test; the tool restarts a runaway orbit instead of plotting it.

#### ⚙ Tinkerbell Map — dials: parameter *a*, parameter *b*
- **Formula:** `x' = x² − y² + ax + by`, `y' = 2xy + cx + dy`; `a = 0.9`, `b = −0.6013`, `c = 2`, `d = 0.5`; start `(−0.72, −0.64)`; dials on *a* (0.75–0.9) and *b* (−0.45 to −0.6013). Re-roll discards a random number of extra iterations (up to 3,000), a different stretch of the same deterministic orbit.
- **Origin:** the name comes from K. T. Alligood, T. D. Sauer & J. A. Yorke, *Chaos: An Introduction to Dynamical Systems* (Springer, 1997). **[R]** Parameters as commonly quoted, recalled.
- **Check:** the attractor has a very small basin: from the standard start the orbit stayed bounded for `a ≤ 0.9` and escaped for `a ≥ 0.91`, and for `b ≤ −0.61`. The Lyapunov estimate was positive across `a = 0.75–0.9` (0.14–0.21). **[N]** The dials therefore stop at *a* = 0.9 and *b* = −0.6013. All four corners of the (*a*, *b*) dial rectangle stayed bounded in a test. **[N]**

---

## Core 4 — the 3-D viewer

A fourth panel that draws the real 3-D orbit of a model and lets you turn it. It lists every model that has a 3-D form: Lorenz, Rössler, Thomas, Chen, Aizawa, Chua, Halvorsen (flows) and RANDU (its raw triples, so the 15 planes can be found by rotating).

- **How it draws:** there is no 3-D library. Each point is rotated about the vertical axis by *azimuth*, tilted by *elevation*, optionally shrunk with distance (*perspective*), and drawn on an ordinary 2-D canvas. The orbit is first centered on its bounding box and scaled to unit radius so every model fills the view the same way. Near parts are drawn brighter and thicker than far parts (six depth layers). A small x/y/z key in the corner shows the orientation.
- **Controls:** *Auto-rotate* switch (Lucide `toggle-left` / `toggle-right`), *rotation speed* (0–90°/s), *azimuth*, *elevation*, *zoom*, *perspective* and *line / point size*, all generated from the `VIEW3D_PARAMS` list. The model's own dials (attraction, orbit length and so on) are mirrored below the view and stay in step with the same dials in Core 1.
- **Animation:** it runs only while Auto-rotate is on with a speed above zero, the plot is on screen and the tab is visible; otherwise it redraws only when a control changes. With the system "reduce motion" setting on, it starts with Auto-rotate off.
- **Why it matters:** a 2-D projection can hide structure. RANDU's planes only show from a particular angle; the Lorenz and Rössler folds are flattened in any single projection.
- **Check:** all 8 models produce 1,500 finite 3-D points, normalized to a maximum radius of exactly 1; auto-rotation advanced 18° in 1.5 s at 12°/s and 60° in 1 s at 60°/s; it paused when the plot was off screen or Auto-rotate was off. **[N]**

---

## Copulas

All copula models are plotted on uniform margins. Sklar's theorem (A. Sklar, 1959) **[R]** is the reason a joint distribution can be split into margins plus a copula.

### Core models

#### Gaussian Copula (ρ = 0.8)
- **Formula:** `(z₁, ρ·z₁ + √(1−ρ²)·z₂)` from two standard normals; no tail dependence for |ρ| < 1.
- **Origin / finance link:** D. X. Li, "On default correlation: a copula function approach", *J. Fixed Income* 9(4) (2000) 43–54 **[R]**; critique: F. Salmon, "Recipe for disaster: the formula that killed Wall Street", *Wired* (2009) **[R]** (not opened).

#### Student-t Copula (ν = 4)
- **Formula:** correlated normals divided by `√(χ²_ν/ν)`. Lower/upper tail dependence `λ = 2·t_{ν+1}(−√((ν+1)(1−ρ)/(1+ρ)))`.
- **Origin:** S. Demarta & A. J. McNeil, "The t copula and related copulas", *Int. Statistical Review* 73(1) (2005) 111–129. **[R]**
- **Check:** at ρ = 0.8, `λ` = 0.604 (ν = 2), **0.490 (ν = 4)**, 0.293 (ν = 10), 0.073 (ν = 30), 0.001 (ν = 100), versus 0 for the Gaussian. **[N]** (computed numerically in the research pass).
- **Normal-margins view:** uses the exact closed-form t₄ CDF `F(t) = ½ + ¾x − ¼x³`, `x = t/√(4+t²)`, then probit. The CDF matches the textbook 97.5 % critical value 2.776 and a 200,000-draw simulation. **[N]**

#### Clayton Copula (θ = 2)
- **Formula:** `C(u,v) = (u^{−θ} + v^{−θ} − 1)^{−1/θ}`; lower-tail dependence `2^{−1/θ}` (0.707 at θ = 2); Kendall `τ = θ/(θ+2)` (0.5).
- **Origin:** D. G. Clayton, *Biometrika* 65(1) (1978) 141–151. **[R]** Sampling: Marshall & Olkin, *JASA* 83 (1988) 834–841 (Gamma frailty). **[R]**
- **Check:** joint lower tail (both < 0.1) 7.14 % against 7.09 % theoretical. **[N]**

### Advanced models ⚙

Sampling for the Archimedean families uses one template (Marshall & Olkin 1988 **[R]**): draw a latent `V` and two Exp(1) variates `E₁, E₂`, then `Uᵢ = ψ(Eᵢ/V)`. Tail-dependence and τ formulas follow the survey table at <https://arxiv.org/pdf/2310.17307> **[V]** and the R `VineCopula` documentation **[V]**.

#### ⚙ Gumbel Copula (upper tail) — dial: Kendall's τ
- **Formula:** `C(u,v) = exp(−[(−ln u)^θ + (−ln v)^θ]^{1/θ})`, `θ ≥ 1`, `τ = 1 − 1/θ`, upper-tail dependence `2 − 2^{1/θ}`.
- **Origin:** E. J. Gumbel, "Bivariate exponential distributions", *JASA* 55(292) (1960) 698–707. **[R]**
- **Sampling:** `V` is positive stable with index `1/θ`, generated by the Chambers–Mallows–Stuck method (J. M. Chambers, C. L. Mallows & B. W. Stuck, *JASA* 71(354) (1976) 340–344). **[R]** `ψ(t) = exp(−t^{1/θ})`.
- **Check:** simulated τ = 0.487 at θ = 2 (theory 0.5) and 0.753 at θ = 4 (theory 0.75); the stable sampler satisfies `E[exp(−S)] = e⁻¹` (0.3673 vs 0.3679). **[N]**

#### ⚙ Frank Copula (no tail dependence) — dial: θ
- **Formula:** `C(u,v) = −(1/θ)·ln(1 + (e^{−θu}−1)(e^{−θv}−1)/(e^{−θ}−1))`, `θ > 0`; `τ = 1 − (4/θ)(1 − D₁(θ))` where `D₁` is the Debye function. No tail dependence.
- **Origin:** M. J. Frank, *Aequationes Mathematicae* 19 (1979) 194–226. **[R]**
- **Sampling:** `V` is logarithmic-series with parameter `1 − e^{−θ}` (Kemp, *Applied Statistics* 30(3) (1981) 249–253; Devroye, *Non-Uniform Random Variate Generation*, 1986) **[R]**; `ψ(t) = −ln(1 − (1−e^{−θ})e^{−t})/θ`.
- **Check:** simulated τ = 0.448 vs 0.457 formula at θ = 5, and 0.109 vs 0.110 at θ = 1; logarithmic-series mean 1.933 vs 1.938. **[N]**

#### ⚙ Joe Copula (sharp upper tail) — dial: θ
- **Formula:** `C(u,v) = 1 − [(1−u)^θ + (1−v)^θ − (1−u)^θ(1−v)^θ]^{1/θ}`, `θ ≥ 1`; upper-tail dependence `2 − 2^{1/θ}`; `τ = 1 − 4·Σ_{k≥1} 1/(k(θk+2)(θ(k−1)+2))`.
- **Origin:** H. Joe, *J. Multivariate Analysis* 46(2) (1993) 262–282. **[R]** Sibuya distribution: M. Sibuya, *Ann. Inst. Statist. Math.* 31 (1979) 373–390. **[R]**
- **Sampling:** `V ~ Sibuya(1/θ)`, `ψ(t) = 1 − (1 − e^{−t})^{1/θ}`. The Sibuya tail is heavy; the code searches exactly to 200 and uses the power-law tail beyond (a small approximation in the far tail).
- **Check:** simulated τ = 0.519 vs 0.518 from the series at θ = 3. **[N]**

#### ⚙ Survival Clayton (upper tail) — dial: Kendall's τ
- **Formula:** Clayton rotated 180°: `(1−U, 1−V)`, `θ = 2τ/(1−τ)`. Upper-tail dependence `2^{−1/θ}`.
- **Origin:** standard rotation; see R. B. Nelsen, *An Introduction to Copulas*, 2nd ed. (Springer, 2006). **[R]**

#### ⚙ Marshall–Olkin (common-shock ridge) — dial: common-shock share α
- **Formula:** independent shocks `Z₁, Z₂ ~ Exp(1−α)` and a common shock `Z₁₂ ~ Exp(α)`; `X = min(Z₁, Z₁₂)`, `Y = min(Z₂, Z₁₂)`; plot `(e^{−X}, e^{−Y})`. Margins are uniform. Singular component on the diagonal with mass `α/(2−α)`; upper-tail dependence `α`.
- **Origin:** A. W. Marshall & I. Olkin, "A multivariate exponential distribution", *JASA* 62(317) (1967) 30–44. **[R]**
- **Check:** diagonal mass 0.424 vs 0.429 at α = 0.6, and 0.3335 vs 0.3333 at α = 0.5. **[N]**

#### ⚙ Clayton + Gumbel Mixture (both tails) — dial: Gumbel weight
- **Formula:** with probability *w* draw from Gumbel (θ = 2), else Clayton (θ = 2); both have τ = 0.5.
- **Origin:** finite mixtures of copulas are standard (see Nelsen 2006; Joe, *Dependence Modeling with Copulas*, CRC 2014 **[R]**); this particular pair is a teaching choice.

---

## Financial stochastic processes

Time-step models use 252 steps per year unless noted. Simulated paths illustrate model behavior; they are not forecasts.

### Core models

#### Geometric Brownian (GBM)
- **Formula:** `dS = μS dt + σS dW`; here `μ = 5 %`, `σ = 20 %`, exact log-step.
- **Origin:** P. A. Samuelson, *Industrial Management Review* 6(2) (1965) 41–49; F. Black & M. Scholes, *J. Political Economy* 81(3) (1973) 637–654. **[R]**

#### Vasicek (Mean Reverting)
- **Formula:** `dr = κ(θ − r)dt + σ dW`; `κ = 0.1`, `θ = 5 %`, `σ = 2 %`.
- **Origin:** O. Vasicek, *J. Financial Economics* 5(2) (1977) 177–188. **[R]**

#### Jump-Diffusion Model
- **Formula:** Merton (1976) — GBM plus Poisson jumps, `λ = 8`/yr, jump ~ N(−15 %, 10 %), `σ = 15 %`.
- **Origin:** R. C. Merton, *J. Financial Economics* 3(1–2) (1976) 125–144. **[R]**

#### Heston Stochastic Volatility
- **Formula:** `dS = μS dt + √v S dW₁`, `dv = κ(θ − v)dt + ξ√v dW₂`, `corr = ρ`. `κ = 3`, `θ = 0.04`, `ξ = 0.6`, `ρ = −0.7`, `v₀ = 0.04`, `μ = 5 %`; Euler with full truncation.
- **Origin:** S. L. Heston, *Rev. Financial Studies* 6(2) (1993) 327–343 **[R]**; full truncation: R. Lord, R. Koekkoek & D. van Dijk, *Quantitative Finance* 10(2) (2010) 177–194. **[R]**
- **Note:** these defaults violate the Feller condition (`2κθ = 0.24 < ξ² = 0.36`), so the variance can touch zero; full truncation is what keeps the simulation valid. **[N]** (arithmetic).

### Advanced models ⚙

#### ⚙ GJR-GARCH Returns (vol clustering) — dial: persistence
- **Formula:** `σ²ₜ₊₁ = ω + (α + γ·1{εₜ<0})·εₜ² + β·σ²ₜ`; `α = 0.04`, `γ = 0.08`; persistence `p = α + β + γ/2` (dial 0.85–0.995); `ω = σ²∞(1 − p)` with long-run daily volatility 1 %. Plots daily returns in %.
- **Origin:** R. F. Engle, *Econometrica* 50(4) (1982) 987–1007 (ARCH); T. Bollerslev, *J. Econometrics* 31(3) (1986) 307–327 (GARCH); L. R. Glosten, R. Jagannathan & D. E. Runkle, *J. Finance* 48(5) (1993) 1779–1801 (leverage term). **[R]**
- **Check:** return standard deviation 0.996 % (target 1.00 %) and excess kurtosis (3.85 > 3) over 60 paths. **[N]**

#### ⚙ Hawkes Process (self-exciting intensity) — dial: branching ratio *n*
- **Formula:** `λ(t) = μ + Σ α·e^{−β(t−tᵢ)}`; `μ = 1`, `β = 1`, `α = n·β`; the plotted line is `λ(t)`. Mean rate `μ/(1−n)`. Simulated by Ogata thinning.
- **Origin:** A. G. Hawkes, *Biometrika* 58(1) (1971) 83–90; Y. Ogata, *IEEE Trans. Information Theory* 27(1) (1981) 23–31 (thinning). **[R]** Finance survey: E. Bacry, I. Mastromatteo & J.-F. Muzy, "Hawkes processes in finance", *Market Microstructure and Liquidity* 1(1) (2015); arXiv:1502.04592. **[V]**
- **Check:** mean intensity 3.31 vs 3.33 theoretical at *n* = 0.7 over 40 paths. **[N]**

#### ⚙ Regime Switching (calm / stress) — dial: stress persistence
- **Formula:** two-state Markov chain; calm `μ = 10 %`, `σ = 12 %`; stress `μ = −20 %`, `σ = 35 %`; `P(stay calm) = 0.99`; `P(stay stress)` is the dial (default 0.95). GBM step within each state.
- **Origin:** J. D. Hamilton, *Econometrica* 57(2) (1989) 357–384. **[R]** (Hamilton's model is for growth-rate series; this is the standard price-process adaptation.)
- **Check:** average step variance 1.27e-4 vs 1.29e-4 expected from the stationary regime mix. **[N]**
- **Parameters are illustrative, not estimated.**

#### ⚙ Fat-Tailed Returns (Student-t) — dial: tail index ν
- **Formula:** i.i.d. log-returns `0.01·√((ν−2)/ν)·t_ν`, so daily volatility is fixed at 1 % and only the tails change. ν dial is geometric, 30 → 2.5.
- **Origin:** R. Praetz, *J. Business* 45(1) (1972) 49–55 (Student-t returns); B. Mandelbrot, *J. Business* 36(4) (1963) 394–419 (heavy tails); R. Cont, "Empirical properties of asset returns: stylized facts and statistical issues", *Quantitative Finance* 1(2) (2001) 223–236. **[R]**
- **Check:** realized daily volatility 0.994 % vs 1 % at ν = 4. **[N]**

#### ⚙ Variance Gamma (pure-jump Lévy) — dial: time-change variance ν
- **Formula:** log-price `X_t = θ·G_t + σ·W(G_t)` with gamma time change `G` (mean 1, variance ν per unit time); `θ = −0.1`, `σ = 0.2`, `r = 5 %`; martingale correction `ω = ln(1 − θν − σ²ν/2)/ν`.
- **Origin:** D. B. Madan & E. Seneta, *J. Business* 63(4) (1990) 511–524; D. B. Madan, P. P. Carr & E. C. Chang, *European Finance Review* 2(1) (1998) 79–105. **[R]**
- **Check:** variance of log increments 1.635e-4 vs 1.667e-4 expected `(σ² + θ²ν)·dt`. **[N]**

#### ⚙ Kou Jump-Diffusion (asymmetric jumps) — dial: jump intensity λ
- **Formula:** GBM plus Poisson jumps with double-exponential size: up with probability `p = 0.4`, mean `1/η₁ = 10 %`; down with probability `0.6`, mean `1/η₂ = 20 %`; `σ = 16 %`, `μ = 10 %`. Compensator `κ = p·η₁/(η₁−1) + (1−p)·η₂/(η₂+1) − 1`.
- **Origin:** S. G. Kou, "A jump-diffusion model for option pricing", *Management Science* 48(8) (2002) 1086–1101. **[R]** The parameter set is recalled from the paper's example and should be verified.
- **Check:** the compensator by simulation, −0.0554, vs −0.0556 from the formula. **[N]**

#### ⚙ CIR Short Rate (stays positive) — dial: volatility σ
- **Formula:** `dr = κ(θ − r)dt + σ√r dW`; `κ = 0.5`, `θ = 4 %`, 5-year horizon; Euler with full truncation. Feller condition `2κθ ≥ σ²` (σ ≤ 0.2).
- **Origin:** J. C. Cox, J. E. Ingersoll & S. A. Ross, *Econometrica* 53(2) (1985) 385–407. **[R]**
- **Check:** mean simulated rate 4.28 % vs 4 % long-run (Euler discretisation and finite horizon). **[N]**

---

## Shared numerical methods

| Method | Used for | Reference |
|---|---|---|
| Box–Muller transform | normal draws | G. E. P. Box & M. E. Muller, *Ann. Math. Statistics* 29(2) (1958) 610–611 **[R]** |
| Marsaglia–Tsang gamma sampler | Clayton, Student-t, Variance Gamma | G. Marsaglia & W. W. Tsang, *ACM TOMS* 26(3) (2000) 363–372 **[R]** |
| Acklam probit (inverse normal CDF) | Normal-margins view | P. J. Acklam, "An algorithm for computing the inverse normal cumulative distribution function" (2003), relative error ≈ 1.2×10⁻⁹ **[R]**. Matches reference quantiles to 5×10⁻⁹. **[N]** |
| Chambers–Mallows–Stuck stable variates | Gumbel copula | see Gumbel above **[R]** |
| RK4 integration | Lorenz, Rössler, Thomas | standard fourth-order Runge–Kutta **[R]** |
| mulberry32 | seeded stream for advanced models | T. Ettinger (public domain) **[R]** |
| Ogata thinning | Hawkes process | see Hawkes above **[R]** |

## Verification log

Run during the build that added the Advanced models (headless browser plus a separate harness):

- Mersenne Twister and PCG32 reproduce their published reference outputs; Sobol matches the standard first points.
- Copula samplers reproduce their theoretical Kendall's τ (Gumbel, Clayton, Frank, Joe) and the Marshall–Olkin diagonal mass.
- The stochastic financial models reproduce their theoretical moments (Hawkes mean rate, GJR volatility, variance-gamma increment variance, Student-t volatility, Kou compensator, regime variance).
- Every dial's default position reproduces its stated classic value.
- All 29 advanced models returned 1,500 finite points; the five attractors added later (Chen, Aizawa, Chua, Halvorsen, Tinkerbell) were also checked across every dial position.
- When the extra attractor dials and Core 4 were added, every dial of every model was run at 0 %, 50 % and 100 % in both its 2-D and 3-D form (all finite, 1,500 points), and every dial's default reproduced its classic value.

**What this does *not* show:** that any citation is correct, that a published parameter set was recalled correctly, or that the models are suitable for any real-world purpose.

## Not yet included

Candidates from the research pass that are **not** implemented (attractors still open: Lü, Burke–Shaw, Rabinovich–Fabrikant, Sprott's simplest flows, Clifford / de Jong, Lozi, Gingerbreadman, Duffing, double pendulum; 3-D views for the 2-D maps and the copulas), usually because the equations or parameters were not verified against primary sources: rough volatility (rough Bergomi, rough Heston), fractional Brownian motion, multifractal random walk, SABR, Bates, local volatility, the Merton structural credit model, the Vasicek one-factor loan-loss model, Geltner / Getmansky–Lo–Makarov return smoothing, nested and vine copulas, Hüsler–Reiss and Galambos extreme-value copulas, Brock–Hommes heterogeneous-agent map, the 2-D sine-logistic and logistic-adjusted-sine maps, Poisson-disk sampling, xoshiro, Philox, and Owen-scrambled Sobol.

## Adding a model

1. Write a generator returning 1,500 `{x, y}` points (use `makeRng(simSeed)` for anything random).
2. Add one entry to `MODELS` in `index.html`. Set `adv: true` to put it in the Advanced menu. Add `dials` for a parameter slider.
3. Add its published constants (with a comment pointing here) to the tuning-constants block.
4. Add an entry to this file with the formula, origin, and a confidence tag. Run a numeric check before tagging anything **[N]**.

## Disclaimer (placeholder)

> **PLACEHOLDER — NOT FINAL. To be reviewed and replaced before wider promotion of this page.**
>
> This tool and document are provided for **educational and illustrative purposes only**. All outputs are
> **simulated and hypothetical**. They are not forecasts, predictions, or projections of any real
> investment, security, index, or market, and they do not represent actual or expected results. Model
> parameters are illustrative and have not been calibrated to market data. Nothing here is investment,
> legal, tax, or accounting advice or a recommendation or offer to buy or sell any security or product.
> Simulated and hypothetical results have inherent limitations and are not indicative of future results.
>
> Citations and formulas were compiled from memory and secondary sources and **may contain errors**; the
> confidence tags show how far each has been checked. Verify against primary sources before relying on
> any of it.
>
> [Placeholder: statement of authorship and independence — e.g. that this is a personal educational
> project and does not represent the views of any employer or advisory firm.]
> [Placeholder: any firm-specific compliance language, if required.]
> [Placeholder: license and reuse terms for the code and this document.]
