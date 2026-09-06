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

## Git & PR Guidelines
* Write concise, descriptive commit messages (e.g., `feat: add race registration form`, `fix: mobile menu toggle`).
* Before suggesting a PR, ensure `npm run build` completes without errors and all TypeScript types are resolved.

## Error Handling
* Wrap async operations in `try/catch` blocks.
* Provide user-friendly fallback UI for data fetching errors (e.g., when failing to load schedule data).
