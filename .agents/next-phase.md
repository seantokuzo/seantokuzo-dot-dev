Update all project card/overlay components to consume the new `Project` interface fields (`isPrivate`, `status`, `media`). Branch: `phase-9/project-cards-v2` off `main`.

PR #13 just merged — `src/data/projects.ts` now has 7 real projects (replacing 6 placeholders) with an extended interface:

```ts
type ProjectStatus = 'released' | 'in-development' | 'early-stage'
interface ProjectMedia { type: 'image' | 'video' | 'gif'; src: string; alt?: string }
interface Project {
  // existing: id, title, description, longDescription, tech, url?, github?, featured, color
  isPrivate: boolean       // true = no repo link, show lock icon
  status: ProjectStatus    // badge/indicator on cards
  media: ProjectMedia | null  // null for now, render when present
}
```

Private repos (u-suck-at-money, roi-gen, the-bach) have `isPrivate: true` and no `github` URL.
Public repos (major-tom, face-fling, seantokuzo-mcp) have `isPrivate: false` and a `github` URL.

## 4 Tickets — Parallelize Wave 1 (1-3), then Wave 2 (4)

---

### Ticket 1: Project Card + Overlay — consume new fields

Update `ProjectCard.tsx` and `ProjectOverlay.tsx` to display:
- **Status badge** — small pill/tag showing `released`, `in development`, or `early stage`
- **Private indicator** — lock icon (inline SVG or CSS) next to title when `isPrivate: true`
- **Media slot** — conditionally render image/video/gif from `media` when not null (placeholder-ready)
- Hide the "GitHub" link when `project.github` is absent (already works via conditional, but verify)

Style the badge and lock icon using CSS Modules. Use semantic colors from `global.css` design tokens (add new tokens if needed — e.g. `--color-status-released`, `--color-status-in-dev`, `--color-status-early`).

**Files:** `src/features/atom/ProjectCard.tsx`, `src/features/atom/ProjectCard.module.css`, `src/features/atom/ProjectOverlay.tsx`, `src/features/atom/ProjectOverlay.module.css`, `src/styles/global.css`

---

### Ticket 2: ProjectList + ProjectStepper — consume new fields

Update `ProjectList.tsx` to show a compact status indicator and lock icon per card in the grid. The stepper (`ProjectStepper.tsx`) should show the status next to the project title.

**Files:** `src/features/atom/ProjectList.tsx`, `src/features/atom/ProjectList.module.css`, `src/features/atom/ProjectStepper.tsx`, `src/features/atom/ProjectStepper.module.css`

---

### Ticket 3: AboutPage + InteractionOverlay — consume new fields

Update `AboutPage.tsx` projects section and `InteractionOverlay.tsx` projects content to display status badges and private indicators. These are simpler card layouts — keep the updates minimal and consistent with the atom page cards.

**Files:** `src/features/about/AboutPage.tsx`, `src/features/about/AboutPage.module.css`, `src/features/game/InteractionOverlay.tsx`, `src/features/game/InteractionOverlay.module.css`

---

### Ticket 4: Visual QA + build verification

After all card updates:
1. `npm run build` (or `tsc -b`) passes clean
2. Visually verify all 3 pages render the new project data correctly
3. Confirm private projects show lock icon, no GitHub link
4. Confirm status badges render with appropriate styling
5. Keyboard navigation still works on all card variants
6. Mobile layout handles the extra UI elements gracefully

---

## Key constraints
- CSS Modules only — no inline styles, no Tailwind, no CSS-in-JS
- Use design tokens from `src/styles/global.css` — add new ones as needed
- Lock icon should be an inline SVG element, not an emoji or image asset
- Status badge colors should be subtle — don't overpower the project's `color` theme
- `media` field is null on all projects right now — just wire up the conditional render so it's ready when assets are added later
- Keep the `longDescription || description` fallback pattern (longDescription is now required but the pattern is harmless)
