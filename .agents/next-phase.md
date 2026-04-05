Phase 11d — Visual Polish & Mobile Tuning. Branch: `phase-11d/polish-mobile`.

## Context

Phase 11c (home/projects split) is merged — PR #20. The site now has:
- **Separate home (`/`) and projects (`/projects`) pages**
- **Camera-driven atom sizing** — `HOME_CAMERA_DISTANCE = 80` makes atom icon-sized on home, normal on projects
- **CameraZoom** component lerps between distances with eased transitions
- **HomePage** with CSS Grid `1fr auto 1fr` layout — atom always at viewport center
- **UFO CTA** — saucer emoji lifts off, 3D UFO flies to nucleus, navigates to projects
- **Route transitions** with enter/exit animations
- **AtomContext** for shared state across routes
- Starfield canvas stays full-screen on home (no clipping, no dimming)
- Orbit labels hidden in home mode, visible in projects mode

## What to Polish

### 1. Atom Size Tuning
- `HOME_CAMERA_DISTANCE = 80` may need adjustment — verify the atom looks like a deliberate "3D icon" and not just a distant speck
- The zoom transition speed (`2.5 * delta`) may need tuning for feel
- Test the home→projects→home round-trip for smoothness

### 2. Mobile Layout
- Verify the CSS Grid `1fr auto 1fr` holds on small viewports
- `.atomSpacer` is 70px on mobile (100px desktop) — may need adjustment
- CTA button, blurb text, and title sizing on narrow screens
- Touch interactions on projects page (orbit controls, project orb taps)
- `ORBITS_MOBILE` radii and `ORB_RADIUS_MOBILE` may need tweaking

### 3. Transition Polish
- Home→projects camera zoom should feel intentional, not jarring
- Projects→home should feel like a graceful retreat
- UFO flight from screen-origin coordinates — verify it looks right from different CTA positions
- Canvas fade-in timing (`canvasEnter` animation) on first load

### 4. Visual Refinement
- Title gradient animation speed
- Blurb text readability over starfield (may need subtle text-shadow)
- CTA button hover/active states
- Overall home page "vibe" — should feel like a polished landing, not a placeholder

### 5. Content Tweaks
- Blurb copy may need iteration
- Subtitle lines ("Software Builder" / "Full-Stack Software Engineer") — final call on wording

### Key Files
- `src/features/home/HomePage.tsx` — home page component
- `src/features/home/HomePage.module.css` — home page styles
- `src/features/atom/AtomScene.tsx` — CameraZoom, orbit configs, HOME_CAMERA_DISTANCE
- `src/features/atom/Ufo.tsx` — UFO flight path and animation
- `src/components/layout/PageShell.tsx` — canvas persistence, triggerUfo
- `src/components/layout/PageShell.module.css` — canvas layer styles

## Remaining Phases (for reference)

| Phase | Branch | Scope |
|-------|--------|-------|
| 11e | `phase-11e/about-page` | Career story, interactive timeline, lite resume |
| 11f | `phase-11f/uses-page` | Tech stack / tools / setup page |

## Skills to Read Before Implementing

- `.agents/skills/frontend-design/SKILL.md` — design patterns
- `.agents/skills/web-design-guidelines/SKILL.md` — accessibility, responsive

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
git checkout -b phase-11d/polish-mobile
```

Start by running the dev server with `--host` and Chrome DevTools MCP to visually audit both pages on desktop and mobile viewports. Make a list of what needs tweaking before changing code.
