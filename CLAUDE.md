# Postmillennium MTB Website (PMR) - Claude Instructions

## Project Context
This is the repository for `pmr-website` (Postmillennium MTB). Claude should prioritize mobile-first responsiveness, fast load times for media (MTB photos/videos), and accessible navigation when generating UI components.

## Development & Build Commands
* **Install dependencies:** `npm install` (or `pnpm install` / `yarn`)
* **Local development server:** `npm run dev`
* **Production build:** `npm run build`
* **Linting:** `npm run lint`
* **Format code:** `npm run format`

## Tech Stack & Architecture
* **Framework:** Next.js / React (Update if using Astro, Vue, etc.)
* **Styling:** Tailwind CSS
* **Language:** TypeScript (Strict mode enabled)
* **Assets:** Store all media (images, icons) in the `/public` directory. Optimize MTB imagery using WebP format where possible.

## Code Style & Conventions
* **Types:** Use TypeScript interfaces for object definitions. Avoid `any`.
* **Components:** Use functional components and React Hooks. Keep components small, modular, and in the `/components` folder.
* **Naming:** 
  * Files/Folders: `kebab-case` (e.g., `hero-section.tsx`)
  * Components: `PascalCase` (e.g., `HeroSection`)
  * Variables/Functions: `camelCase` (e.g., `fetchRaceResults`)
* **Styling Rules:** Utilize Tailwind utility classes directly in the markup. Extract complex, repeated UI elements into separate components rather than writing custom CSS classes.

## Icons

**When an icon is called for or requested, check Lucide first**
(https://lucide.dev/icons/). Lucide is the default set for every PMR tool and for
this site. **If Lucide has no suitable icon, look in Google's Material Symbols**
(https://fonts.google.com/icons) before asking. (The README describes the site's real
stack, plain static HTML; this applies to every page and tool folder.) Examples:
Lucide has no skateboard, only a scooter; Material Symbols has "skateboarding".

* **Inline SVG only, from either set.** Paste the icon's SVG into the page. No CDN
  script, icon font or npm package, and no separate icon image file: pages stay
  self-contained.
* **Lucide: copy the SVG from lucide.dev and keep its attributes**: `xmlns`,
  `width="24" height="24" viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`,
  `stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`. Add
  `class="lucide lucide-<icon-name>"`, `aria-hidden="true"` and `focusable="false"`.
  Do not edit the path data.
* **Material Symbols: download the SVG from fonts.google.com/icons** (Weight 400,
  Fill off, 24px, unless Jon picks otherwise). It arrives with a fixed colour
  (`fill="#e3e3e3"`) and `viewBox="0 -960 960 960"`. Keep the viewBox and the path
  data. Change only: `fill` to `currentColor`, `height`/`width` from `24px` to
  `24`, and add `class="material-symbol material-symbol-<icon-name>"`,
  `aria-hidden="true"` and `focusable="false"`. Never leave the hard-coded colour:
  it would ignore every theme. Material Symbols is Apache 2.0 licensed.
* **Do not mix the two sets inside one row of controls.** Lucide is an outline
  (stroked) set and Material Symbols is a filled shape set, so side by side they read
  as two different icon families. Use a Material Symbol only where Lucide has no
  match, and say in the handover which set each icon came from.
* **Color and size come from CSS.** The icon is `currentColor`, so it follows the
  text color and every theme (day, spring, autumn, winter, 2049) automatically.
* **Accessibility:** the SVG is decorative; the button or link carries the name
  (`aria-label`), never the icon.
* **Never hand-draw an icon or invent path data.** If neither Lucide nor Material
  Symbols has a suitable icon, say so and ask Jon.
* **No emoji as icons** in new UI; use Lucide, or Material Symbols where Lucide has no
  match.

## Color accessibility (colorblind-safe)

Every color scheme and theme must stay readable for colorblind viewers
(about 1 in 12 men, mostly red-green). This covers charts, graphs, diagrams,
text and fonts, icons, badges, buttons and sliders, in every theme, not just
the default one.

- **Check with numbers, not by eye.** Any two colors that must be told apart
  in the same view (two series, the two hubs, a hub vs a failure line, status
  colors) need an OKLab ΔE×100 of at least **15 for normal vision** and at
  least **8 under simulated deuteranopia, protanopia and tritanopia**. Check
  every theme against that theme's own background, e.g. with the `dataviz`
  skill's `scripts/validate_palette.js` (`--pairs all` when everything is on
  screen at once) or any OKLab + color-vision-simulation tool.
- **One color, one meaning per view.** A color that marks a hub or series is
  never reused for something else (a failure line, a status) in the same chart.
- **Never color alone.** Pair color with a second cue: a text label, line
  style (solid / dashed / dotted), marker shape, icon, or position. Charts with
  two or more series keep a legend or direct labels.
- **Watch the risky pairs:** red/green, red/orange, pink/teal, blue/purple and
  cyan/light blue are easy to confuse when their lightness is similar. A clear
  lightness difference between the two is the most reliable fix.
- **Text contrast (WCAG 2.x):** normal text at least 4.5:1 against its
  background; large text (24px+, or 18.7px+ bold) and chart lines, marks and
  icons at least 3:1. Colored text, such as a value printed in its series
  color, counts too.
- **Text over lines or fills** gets a halo or backing box in the background
  color (SVG: `stroke` = background, `paint-order: stroke`) so it is never
  struck through.
- **Fix with the smallest change that keeps the existing look:** adjust one
  color's shade, or add a line style or label. Don't restyle a chart to fix a
  color problem unless Jon asks for a redesign.
- **When adding or changing a theme or palette,** re-run the check for every
  pair in that theme and put the results (pairs and ΔE values) in the PR
  description.

## Git & PR Guidelines
* Write concise, descriptive commit messages (e.g., `feat: add race registration form`, `fix: mobile menu toggle`).
* Before suggesting a PR, ensure `npm run build` completes without errors and all TypeScript types are resolved.

## Error Handling
* Wrap async operations in `try/catch` blocks.
* Provide user-friendly fallback UI for data fetching errors (e.g., when failing to load schedule data).

## License and notice (do not remove)

The repo root is licensed under PolyForm Noncommercial 1.0.0 (`LICENSE`). Keep: the `Required Notice:` line at the top of `LICENSE`; the (c) / SPDX comment after the doctype of `index.html` and `wheel-lab/index.html`; the license line in the homepage footer (`.footer-license`) and the `.pmr-license` footer in `wheel-lab/index.html`. The tool wrapper pages are thin iframes and carry no footer: the tool inside shows its own notice. `random/` keeps its own copy of the PolyForm `LICENSE` (it was MIT/CC BY 4.0 before; keep its license line in the page footer and README in step); images, artwork and stickers are not licensed by this repo's `LICENSE`. Third-party material keeps its own license: never relicense it. Jon holds the copyright and decides any license change.
