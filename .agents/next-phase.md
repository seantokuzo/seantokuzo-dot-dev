Phase 11b — Page Transitions. Branch: `phase-11b/page-transitions`.

## Context

Phase 11a (design system foundation) is merged — PR #18. The site now has a complete token system in `src/styles/global.css` (easing curves, gradient palette, glassmorphism, overlay variants, etc.) and a reusable `StatusBadge` component. All CSS modules use tokens — zero raw color values.

## What to Build

### 1. Route Transition System
- Animated page transitions using a combination of React Router and CSS/Framer Motion (or pure CSS animations — present options with trade-offs).
- Each route change should feel intentional — not just a fade, but transitions that connect to the spatial metaphor of the site.
- The atom should persist across home↔projects transitions (it's the visual anchor).

### 2. The UFO Button (Home → Projects)
This is the hero interaction. On the home page:
- A CTA button that says something like "See what I'm building" with text above it.
- Inside the button (or adjacent to it), a small Three.js UFO model or simple geometric UFO shape.
- **On click**: the button fades/dissolves, the UFO "breaks free" and slowly flies around the viewport, disappears behind the atom nucleus, and as it does the atom brightens/sharpens and the view transitions to the full projects page.
- This should be the most memorable interaction on the entire site.

### 3. Back Navigation (Projects → Home)
- Reverse the energy — atom dims/softens, content slides in.
- Doesn't need to be as elaborate as the UFO, but should feel connected.

### 4. About/Uses Transitions
- These can be simpler — slide/fade/morph transitions.
- But should still feel part of the same design language.

### Architecture Considerations
- The atom Canvas needs to persist across routes (not unmount/remount). This likely means lifting it above the router or using a layout route.
- Page content animates in/out on top of the persistent 3D layer.
- `prefers-reduced-motion` must be respected — instant transitions as fallback.

### Key Files
- `src/App.tsx` or route config — where transitions hook in
- `src/components/layout/PageShell.tsx` — may need to become transition-aware
- `src/features/atom/AtomScene.tsx` — atom needs to persist and respond to route state
- New: transition components/hooks

## Remaining Phases (for reference)

| Phase | Branch | Scope |
|-------|--------|-------|
| 11c | `phase-11c/home-page` | Landing/intro page with subtle atom bg, about-me copy, UFO CTA |
| 11d | `phase-11d/about-page` | Career story, interactive timeline (caddy → audio engineer → SWE), lite resume |
| 11e | `phase-11e/uses-page` | Tech stack / tools / setup page |

## Skills to Read Before Implementing

- `.agents/skills/threejs-*/SKILL.md` — for UFO, atom modes, any 3D work
- `.agents/skills/frontend-design/SKILL.md` — transition design patterns
- `.agents/skills/web-design-guidelines/SKILL.md` — accessibility, reduced motion

## Constraints

- **CSS Modules + custom properties only** — no CSS-in-JS, no Tailwind
- **Use existing design tokens** from global.css (easing curves, transitions, etc.)
- **Mobile-first** — every page must work on mobile
- **`npm run build` must pass** after every change
- **`prefers-reduced-motion`** respected everywhere
- **Atomic commits** per logical change

## Starting

```bash
git checkout main
git pull
git checkout -b phase-11b/page-transitions
```

Start by reading the current routing setup (`src/App.tsx`, `src/components/layout/PageShell.tsx`, `src/features/atom/AtomScene.tsx`) and present architecture options for the persistent atom + animated transitions before implementing.
