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

**When an icon is called for or requested, use Lucide** (https://lucide.dev/icons/).
It is the icon set for every PMR tool and for this site. (The README describes the
site's real stack, plain static HTML; this applies to every page and tool folder.)

* **Inline SVG only.** Paste the icon's SVG into the page. No CDN script, icon font or
  npm package, and no separate icon image file: pages stay self-contained.
* **Copy the SVG from lucide.dev and keep its attributes**: `xmlns`,
  `width="24" height="24" viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`,
  `stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`. Add
  `class="lucide lucide-<icon-name>"`, `aria-hidden="true"` and `focusable="false"`.
  Do not edit the path data.
* **Color and size come from CSS.** The stroke is `currentColor`, so the icon follows
  the text color and every theme (day, spring, autumn, winter, 2049) automatically.
* **Accessibility:** the SVG is decorative; the button or link carries the name
  (`aria-label`), never the icon.
* **Never hand-draw an icon or invent path data.** If Lucide has no suitable icon, say
  so and ask Jon.
* **No emoji as icons** in new UI; use Lucide.

## Git & PR Guidelines
* Write concise, descriptive commit messages (e.g., `feat: add race registration form`, `fix: mobile menu toggle`).
* Before suggesting a PR, ensure `npm run build` completes without errors and all TypeScript types are resolved.

## Error Handling
* Wrap async operations in `try/catch` blocks.
* Provide user-friendly fallback UI for data fetching errors (e.g., when failing to load schedule data).

## License and notice (do not remove)

The repo root is licensed under PolyForm Noncommercial 1.0.0 (`LICENSE`). Keep: the `Required Notice:` line at the top of `LICENSE`; the (c) / SPDX comment after the doctype of `index.html` and `wheel-lab/index.html`; the license line in the homepage footer (`.footer-license`) and the `.pmr-license` footer in `wheel-lab/index.html`. The tool wrapper pages are thin iframes and carry no footer: the tool inside shows its own notice. `random/` keeps its own MIT license; images, artwork and stickers are not licensed by this repo's `LICENSE`. Third-party material keeps its own license: never relicense it. Jon holds the copyright and decides any license change.
