Phase 11 — Big Polish: Design System, Page Transitions, Content Pages. Branch: `phase-11a/design-system`.

## Overview

This is a multi-phase polish pass that transforms the site from a cool tech demo into a complete, cohesive portfolio. Five sub-phases, each gets its own branch and PR:

| Phase | Branch | Scope |
|-------|--------|-------|
| 11a | `phase-11a/design-system` | Core components, tokens, typography, spacing — foundation for everything |
| 11b | `phase-11b/page-transitions` | Animated route transitions, UFO button concept (home→projects) |
| 11c | `phase-11c/home-page` | Landing/intro page with subtle atom bg, about-me copy, UFO CTA |
| 11d | `phase-11d/about-page` | Career story, interactive timeline (caddy → audio engineer → SWE), lite resume |
| 11e | `phase-11e/uses-page` | Tech stack / tools / setup page |

**Start with 11a. Each sub-phase merges to main before starting the next.**

---

## Phase 11a — Design System

### Why
The site has inconsistent typography, spacing, and component styles across pages. Before adding new pages and transitions, we need a solid design foundation so everything feels unified.

### What to Build

#### 1. Design Tokens (extend `src/styles/global.css`)
- **Typography scale**: consistent heading/body sizes using CSS custom properties. We use Inter (body) and Outfit (headings) — define a proper modular scale.
- **Spacing scale**: standardize spacing beyond what's there now. Ensure consistent vertical rhythm.
- **Color system audit**: verify all pages use semantic color variables, no raw hex values in component CSS.
- **Elevation/depth**: consistent blur, shadow, glassmorphism values (the frosted nav already has some — systematize it).
- **Transition/animation tokens**: standard easing curves and durations for UI interactions.

#### 2. Core Components (`src/components/ui/`)
- **`<Typography>`** or heading/text components — or, if we prefer to keep it CSS-only, a shared typography CSS module with reusable classes. Decide which approach fits better.
- **`<Button>`** — primary, secondary, ghost variants. Currently buttons are ad-hoc across pages.
- **`<Card>`** — base card component with consistent padding, radius, backdrop blur. The project cards can extend this.
- **`<PageShell>`** — audit the existing one, make sure it provides consistent page padding/max-width/layout.
- **`<Section>`** — consistent section spacing, optional heading slot.

#### 3. Audit & Migrate
- Go through every page/component and replace ad-hoc styles with the design system tokens/components.
- Ensure mobile/desktop breakpoints are consistent.

### Key Files
- `src/styles/global.css` — design tokens live here
- `src/components/ui/` — shared components
- `src/components/layout/` — PageShell, Nav, Footer
- All feature page CSS modules — audit for inconsistencies

### Quality Gates
- `npm run build` passes
- All existing pages still render correctly
- No raw hex/rgb values in component CSS (all use custom properties)
- Consistent spacing and typography across all pages
- Mobile still works

---

## Phase 11b — Page Transitions

### Why
This is the highest-impact visual win. Instead of standard React Router page swaps, animated transitions make the site feel like one continuous experience.

### What to Build

#### 1. Route Transition System
- Animated page transitions using a combination of React Router and CSS/Framer Motion (or pure CSS animations — present options with trade-offs).
- Each route change should feel intentional — not just a fade, but transitions that connect to the spatial metaphor of the site.
- The atom should persist across home↔projects transitions (it's the visual anchor).

#### 2. The UFO Button (Home → Projects)
This is the hero interaction. On the home page:
- A CTA button that says something like "See what I'm building" with text above it.
- Inside the button (or adjacent to it), a small Three.js UFO model or simple geometric UFO shape.
- **On click**: the button fades/dissolves, the UFO "breaks free" and slowly flies around the viewport, disappears behind the atom nucleus, and as it does the atom brightens/sharpens and the view transitions to the full projects page.
- This should be the most memorable interaction on the entire site.

#### 3. Back Navigation (Projects → Home)
- Reverse the energy — atom dims/softens, content slides in.
- Doesn't need to be as elaborate as the UFO, but should feel connected.

#### 4. About/Uses Transitions
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

---

## Phase 11c — Home Page

### Why
Currently the atom page IS the home page and it goes straight to projects. We need a proper landing that introduces Sean before diving into the work.

### What to Build

#### 1. Layout
- The atom stays visible but is **subtle** — dimmed, maybe slightly out of focus, no electron labels. It's atmospheric, not the focus.
- The hero content sits in front: name, title, a short about-me blurb.
- The UFO CTA button (from 11b) sits below the blurb.

#### 2. Copy
- **The user will provide the about-me copy** (they're getting it from web Claude with their resume). Don't write placeholder copy — use obvious `[COPY GOES HERE]` placeholders that are easy to find and replace.
- Keep the layout flexible enough to accommodate 2-4 sentences.

#### 3. Atom Adjustments for Home State
- The atom should have two "modes": **home** (subtle, atmospheric) and **projects** (full, vibrant — current state).
- Home mode: lower opacity/brightness, no electron name labels, maybe slower rotation.
- Projects mode: current behavior.
- The UFO transition animates between these modes.

### Route Change
- Rename current `/` to `/projects` (this is the atom explorer + list view).
- New `/` is the landing/home page.
- SEO: `<title>` and meta description for the home page.

### Key Files
- New: `src/features/home/` — HomePage component
- `src/features/atom/` — atom needs home vs. projects modes
- `src/data/` — any static copy data
- Route config

---

## Phase 11d — About Page

### Why
The about page needs to tell Sean's story — not just SWE, but the full journey. PGA tour caddy → studio manager / audio engineer → software engineer is a genuinely compelling narrative.

### What to Build

#### 1. Interactive Career Timeline
- Visual timeline component showing career phases.
- Each phase has: role, company/context, date range, brief description.
- Could be vertical scroll-driven, with each phase revealing as you scroll.
- Add subtle visual flair — maybe each career phase has a different accent color or icon.

#### 2. Lite Resume Section
- More detailed than the timeline but not a full CV.
- SWE experience (primary), plus prior careers (audio engineering, caddy).
- Skills, technologies, tools.

#### 3. Copy
- **User will provide the detailed copy.** Use `[COPY GOES HERE]` placeholders.
- Structure the layout so it works with the expected content shape.

#### 4. Transition
- Smooth transition from other pages (designed in 11b).

### Key Files
- `src/features/about/` — already exists, needs rework
- New: timeline component (could go in `ui/` if generic enough)
- `src/data/` — career/resume data

---

## Phase 11e — Uses/Stack Page

### Why
"/uses" pages are popular in the dev community (see uses.tech). It shows personality, gives visitors something to connect over, and is low-effort high-reward.

### What to Build

#### 1. Content Sections
- **Languages & Frameworks** — what you code with
- **Tools & Apps** — editor, terminal, browser, design tools
- **Hardware** — desk setup, peripherals
- **This Site** — the tech stack powering seantokuzo.dev itself (meta flex)

#### 2. Layout
- Clean grid or categorized list.
- Could have subtle hover interactions or icons for each tool.
- Keep it simple and scannable — this is a reference page, not a spectacle.

#### 3. Route
- `/uses` or `/stack` — present options, user decides.

### Key Files
- New: `src/features/uses/` — UsesPage component
- `src/data/uses.ts` — structured data for tools/stack
- Route config

---

## Skills to Read Before Implementing

Each sub-phase should read relevant skills before coding:
- `.agents/skills/threejs-*/SKILL.md` — for UFO, atom modes, any 3D work
- `.agents/skills/frontend-design/SKILL.md` — design system patterns
- `.agents/skills/web-design-guidelines/SKILL.md` — accessibility, UI best practices

## General Constraints

- **CSS Modules + custom properties only** — no CSS-in-JS, no Tailwind
- **Mobile-first** — every page must work on mobile
- **`npm run build` must pass** after every sub-phase
- **Atomic commits** per logical change within each sub-phase
- **Each sub-phase gets its own branch + PR → merge to main**
- **SEO basics** — proper `<title>`, meta descriptions for each page
- **`prefers-reduced-motion`** respected everywhere

## Starting Phase 11a

```bash
git checkout main
git pull
git checkout -b phase-11a/design-system
```

Start by auditing what exists: read `src/styles/global.css`, all component CSS modules, and the current UI components. Identify inconsistencies, then propose the design system plan with options before implementing.
