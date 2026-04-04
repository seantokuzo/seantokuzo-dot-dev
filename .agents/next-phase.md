Phase 10 — UI Polish (continuation). Branch: `phase-10/ui-polish` (already exists, uncommitted changes in working tree).

## Context

Read memory file `project_phase10_canvas_borders.md` for full state. TL;DR:

The list view card borders use per-card `<canvas>` elements with a rAF loop drawing noise-distorted rounded-rect borders. The shape alignment is correct (rounded rect perimeter sampling), but:

1. **Scroll stutters** — animation janks on scroll. Likely causes: rAF doing `getBoundingClientRect()` per frame per card (forces layout), or canvas resize thrashing. Investigate and fix.
2. **Visual effect is weak** — needs to feel like the Nucleus electrification (`src/features/atom/Nucleus.tsx`). The sine-wave pseudo-noise looks too regular. Consider porting the GLSL simplex noise to JS, or using a proper noise implementation.
3. **Glow not dramatic enough** — shadowBlur values may need tuning, or consider drawing filled glow shapes instead of relying solely on canvas shadow.

## What's already done (DON'T redo)
- Nav frosted glass (blur only) — `Nav.module.css`
- Footer transparent + blur — `Footer.module.css`
- Starfield Canvas behind list view — `AtomPage.tsx`
- ProjectOverlay removed (files deleted, state removed)
- Cards are `<div>` elements (not buttons, no click handler)
- Rounded rect perimeter sampling replaces superellipse — shape matches card borders

## Key files
- `src/features/atom/ProjectList.tsx` — canvas border implementation (main focus)
- `src/features/atom/ProjectList.module.css` — card styles
- `src/features/atom/AtomPage.tsx` — starfield bg, view switching
- `src/features/atom/Nucleus.tsx` — reference for desired visual quality

## Approach ideas (investigate, don't blindly apply)
- **Stutter fix:** Cache `getBoundingClientRect` — only recalc on resize, not every frame. Or use ResizeObserver to track card dimensions.
- **Single canvas:** Instead of 6 canvases, one canvas behind the entire grid positioned with CSS. Draw all borders in one pass. Fewer contexts, fewer reflows.
- **Better noise:** Port `SIMPLEX_NOISE_3D` from `src/features/atom/noiseGlsl.ts` to JS, or use a lightweight 2D simplex implementation.
- **Dramatic glow:** Draw filled concentric shapes with decreasing opacity instead of just stroke + shadowBlur. Or use `ctx.filter = 'blur(Xpx)'` on a bright stroke.

## Constraints
- Read `CLAUDE.md` and `feedback_visual_bar.md` before starting
- Use Chrome DevTools MCP to screenshot and verify visual quality — don't fly blind
- `npm run build` must pass
- No changes are committed yet — everything is in the working tree on `phase-10/ui-polish`
- Pre-existing uncommitted changes from a previous session also in working tree (AtomScene.tsx, ProjectOrb.tsx, projects.ts) — don't lose those
