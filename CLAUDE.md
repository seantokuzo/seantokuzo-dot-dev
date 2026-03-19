# seantokuzo.dev — Project Instructions

> Extends global `~/.claude/CLAUDE.md`. Project-specific rules live here.

---

## Project Overview

Portfolio site for Sean Simpson (seantokuzo). Front-end only, deployed to Netlify at seantokuzo.dev. The implementation IS the portfolio — showcases technical skill through 3D experiences, computer vision, and game-world exploration.

- **GitHub**: https://github.com/seantokuzo/seantokuzo-dot-dev
- **Deploy**: Netlify (static), `npm run build` → `dist/`
- **Live**: https://seantokuzo.dev

---

## Tech Stack & Conventions

| Concern | Convention |
|---------|-----------|
| Build | Vite + React 19 + TypeScript |
| 3D | @react-three/fiber v9 + @react-three/drei |
| Physics | @react-three/rapier v2 (game page only) |
| Computer Vision | @mediapipe/tasks-vision (desktop only, progressive enhancement) |
| State | Zustand (two stores: `useAppStore`, `useCVStore`) |
| Routing | React Router v7 (3 lazy-loaded routes) |
| Styling | CSS Modules + CSS custom properties (zero runtime) |
| Fonts | Self-hosted Inter + Outfit (woff2, variable) |

### File Structure

```
src/
├── components/layout/    # Nav, Footer, PageShell
├── components/ui/        # Button, Card, Modal, LoadingScreen
├── components/three/     # CanvasWrapper, AdaptivePerformance
├── features/atom/        # Home — 3D atom portfolio
├── features/game/        # Isometric Hawaiian village
├── features/about/       # Standard portfolio page
├── cv/                   # MediaPipe wrappers, gesture hooks
├── hooks/                # useMediaQuery, useDeviceCapabilities
├── store/                # Zustand stores
├── data/                 # Static data (projects, skills, bio)
├── styles/               # global.css (design tokens, reset)
└── utils/                # Math helpers, constants
```

### Styling Rules

- CSS Modules for all component styles (`.module.css`)
- CSS custom properties defined in `src/styles/global.css`
- No CSS-in-JS, no Tailwind, no runtime styling
- Use semantic color variables (`--color-text-primary`) not raw values

---

## Before You Code

1. **Read relevant skills** — Use the `Read` tool on `.agents/skills/` before implementing
2. **Check Context7** — For ALL library APIs (R3F, drei, Rapier, MediaPipe). Never trust training data.
3. **Check npm versions** — `npm view <package> version` before adding dependencies
4. **Verify build** — `npm run build` must pass after every change

---

## Git Conventions

- **Atomic commits** — one logical change per commit
- **Commit format** — `type(scope): description` (e.g., `feat(about): add skills grid section`)
- **Types** — `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- **Scopes** — `atom`, `game`, `about`, `cv`, `layout`, `styles`, `data`, `config`
- **Branch naming** — `phase-N/feature-name` (e.g., `phase-1/foundation`)

---

## Performance Rules

### Only One Heavy System Active Per Page
- **Atom (home)**: R3F + CV (when enabled). No audio, no physics.
- **Game (/world)**: R3F + Rapier. No CV.
- **About (/about)**: Nothing heavy — fast, accessible, SEO-friendly.

### R3F Performance
- Adaptive DPR: `dpr={[1, 2]}`, regress when FPS < 45
- `InstancedMesh` for particles/repeated geometry
- Conditional post-processing (bloom only on `qualityTier === 'high'`)
- Dispose all Three.js resources on unmount

### CV Processing Constraints
- HandTracker at **15fps** (not 60)
- FaceTracker at **10fps**
- Never process hand AND face in same frame
- Camera at 320x240
- Only push to Zustand when gesture/action changes

---

## Quality Gates

Before marking any task complete:

1. **`npm run build` passes** — no type errors, no build failures
2. **No regressions** — existing pages still render
3. **Convention compliance** — follows this file's rules
4. **Asset budget** — total assets under 10MB
5. **Mobile works** — all pages functional with touch, simplified 3D or list fallbacks

---

## What NOT To Do

- Don't use CSS-in-JS or runtime styling solutions
- Don't guess library APIs — always verify with Context7
- Don't guess package versions — always check with `npm view`
- Don't nest subagents (orchestrator → workers, never workers → sub-workers)
- Don't paste file contents into agent prompts (pass paths instead)
- Don't skip build verification after changes
- Don't enable CV features on mobile
