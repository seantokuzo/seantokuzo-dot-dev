Phase 10b — Three.js Plasma Card Borders. Branch off `phase-10/ui-polish` into `phase-10b/threejs-plasma-borders`.

## Startup

1. `npm run dev -- --host` to start the dev server
2. Open Chrome DevTools MCP → emulate iPhone (390x844x3, mobile, touch, dark mode)
3. Navigate to `http://localhost:5173/`, switch to list view
4. Take a screenshot to see the current Canvas 2D borders as baseline

## Context

The list view (`src/features/atom/ProjectList.tsx`) currently uses per-card Canvas 2D borders with:
- 3D simplex noise displacement along rounded-rect perimeter
- Multi-octave FBM + spatial variation (ported from Nucleus shader)
- Quadratic bezier smooth curves
- 4-layer glow (outer haze → sharp core) with conic gradient
- Always-on idle breathing (0.4 ± 0.08) + scroll-driven energy ramp
- Each card has staggered phase offsets

This looks good but the user wants to explore replacing it with a **Three.js / R3F shader approach** for a true plasma/lava-lamp material effect instead of a "stringy border."

## What to Build

Replace the Canvas 2D border renderer with a Three.js plane (or shaped geometry) per card that uses a **custom shader material** to create a plasma/lava-lamp border effect. Key requirements:

### Visual Design
- **Same colors**: purple (#b967ff), turquoise (#00f5d4), indigo (#818cf8), pink (#ff71ce) — cycling conic gradient
- **Same border structure**: follows card edges with rounded corners, extends ~28px beyond card for glow
- **NOT a stringy line border** — instead, a volumetric plasma/lava-lamp material that:
  - Fills the border region with glowing, flowing plasma
  - "Drips" off the edges organically — like molten material oozing from every side
  - Has depth and thickness — not a 2D stroke but a 3D-feeling substance
  - Uses simplex noise for organic flow (reuse `src/features/atom/noiseGlsl.ts`)

### Animation
- **Idle**: gentle flowing/breathing — the plasma slowly moves and pulses, always alive
- **Scroll energy**: when user scrolls, the plasma gets "excited" — drips become more jagged/electrified, flow speed increases, glow intensifies
- **Energy decay**: smooth falloff back to idle when scrolling stops

### Architecture Options to Consider
1. **Per-card R3F Canvas** — each card gets its own tiny `<Canvas>` with a plane + shader. Simple isolation but multiple WebGL contexts.
2. **Single shared R3F Canvas** — one canvas behind all cards, with planes positioned to match each card's DOM position. Better perf, harder to sync positions.
3. **Overlay approach** — single fullscreen R3F canvas with `Html` components for card content. Most integrated but complex.

Present options with trade-offs, recommend one, wait for buy-in before building.

### Shader Approach
- Use `ShaderMaterial` or `shaderMaterial` from drei
- Vertex shader: standard plane/quad
- Fragment shader:
  - SDF rounded rect to define the border region
  - Simplex noise (from `noiseGlsl.ts`) for plasma flow
  - Conic gradient color cycling via `atan2`
  - Glow falloff from border edges (exponential decay)
  - `uTime`, `uEnergy`, `uCardSize` uniforms
  - Multiple noise octaves at different speeds for lava-lamp feel

### Key Files
- `src/features/atom/ProjectList.tsx` — current Canvas 2D implementation (replace border rendering)
- `src/features/atom/ProjectList.module.css` — card styles
- `src/features/atom/noiseGlsl.ts` — shared simplex noise GLSL (reuse this!)
- `src/features/atom/Nucleus.tsx` — reference for energy/breathing pattern
- `src/features/atom/AtomPage.tsx` — starfield bg canvas already exists in list view

### Skills to Read Before Implementing
- `.agents/skills/threejs-shaders/SKILL.md` — custom shaders, uniforms, GLSL
- `.agents/skills/threejs-materials/SKILL.md` — material types, shader material
- `.agents/skills/threejs-fundamentals/SKILL.md` — scene setup, R3F patterns
- `.agents/skills/threejs-postprocessing/SKILL.md` — bloom/glow if needed

### Performance Constraints
- Mobile must work (cap DPR at 2, keep shader simple enough for mobile GPU)
- `prefers-reduced-motion` must be respected
- Don't fight with the existing starfield Canvas in list view
- Dispose all Three.js resources on unmount

### Quality Gates
- `npm run build` passes
- All 6 cards render with plasma borders on mobile
- Idle breathing always visible
- Scroll energy ramps up visibly
- No scroll jank
- Existing atom (3D) view still works when switching back

## Branch Setup

```bash
git checkout -b phase-10b/threejs-plasma-borders
```

Branch off the current `phase-10/ui-polish` which has all the Canvas 2D work + frosted nav/footer + starfield bg. We want those changes as the base — we're only replacing the border rendering approach.
