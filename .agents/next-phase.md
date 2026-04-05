Phase 11c — Home Page. Branch: `phase-11c/home-page`.

## Context

Phase 11b (page transitions) is merged — PR #19. The site now has:
- **Persistent atom canvas** in PageShell (outside the route tree)
- **AtomContext** for shared state (sceneRef, focusedProject, viewMode, isLanding, etc.)
- **RouteTransition** state machine with CSS enter/exit animations
- **UFO CTA** hero interaction — glowing saucer flies around atom on CTA click
- **Landing mode** — CTA shows on first visit, controls appear after UFO flight
- Canvas fades in/out when navigating to/from home

## What to Build

### 1. Home Page Content (Landing State)
The landing experience needs real content beyond the hero text + CTA:
- **Intro section**: Brief, compelling copy about Sean — not a resume dump, more like "here's what I care about" energy
- **Animated subtitle**: The current "Full-Stack Developer · Creative Technologist" could be more dynamic — typing effect, rotating titles, or something that matches the 3D energy
- **Social proof / quick links**: GitHub, LinkedIn — subtle, not dominant
- The atom runs in the background throughout. Content overlays on top with glassmorphic panels.

### 2. Scroll-Triggered Content
- If there's more content than fits the viewport, add scroll-triggered reveals
- Content sections should fade/slide in as user scrolls
- The atom could respond to scroll position (subtle parallax or dim effect)
- Keep it light — the 3D canvas is already running

### 3. Visual Polish
- The CTA button from 11b works but could be more visually integrated
- Consider adding a subtle particle trail or glow effect behind the UFO path
- Hero text gradient animation speed could be tuned

### Architecture Considerations
- All content is HTML overlay on top of the persistent canvas
- Use `pointer-events: none` on non-interactive elements (canvas shows through)
- Scroll behavior needs to work with the `pointer-events: none` on main
- The `isLanding` state in AtomContext controls what's shown
- Content should work on mobile (touch, simplified layout)

### Key Files
- `src/features/atom/AtomPage.tsx` — main overlay content lives here
- `src/features/atom/AtomPage.module.css` — all landing styles
- `src/features/atom/AtomContext.tsx` — shared state if needed
- `src/data/bio.ts` — bio content data (already exists)
- `src/components/layout/PageShell.tsx` — canvas persistence layer

## Remaining Phases (for reference)

| Phase | Branch | Scope |
|-------|--------|-------|
| 11d | `phase-11d/about-page` | Career story, interactive timeline (caddy → audio engineer → SWE), lite resume |
| 11e | `phase-11e/uses-page` | Tech stack / tools / setup page |

## Skills to Read Before Implementing

- `.agents/skills/frontend-design/SKILL.md` — design patterns
- `.agents/skills/web-design-guidelines/SKILL.md` — accessibility, scroll behavior

## Constraints

- **CSS Modules + custom properties only** — no CSS-in-JS, no Tailwind
- **Use existing design tokens** from global.css
- **Mobile-first** — all content functional with touch
- **`npm run build` must pass** after every change
- **`prefers-reduced-motion`** respected everywhere
- **Atomic commits** per logical change

## Starting

```bash
git checkout main
git pull
git checkout -b phase-11c/home-page
```

Start by reading the current AtomPage overlay (`src/features/atom/AtomPage.tsx`) and the bio data (`src/data/bio.ts`) to understand what content is available, then plan the landing page layout.
