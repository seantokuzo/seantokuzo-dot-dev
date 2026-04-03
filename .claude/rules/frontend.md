---
paths: ["src/components/**", "src/features/**", "src/hooks/**"]
---

# Frontend Rules

## Component Structure
- Prefer one primary component per file, but multiple local helper components/functions in the same file are allowed when they are tightly related
- Use either named or default exports to match the existing file pattern; name the file after the primary component or feature it contains
- Props interface defined above the component

## Styling
- Prefer CSS Modules for component styles (`.module.css`)
- CSS custom properties from `src/styles/global.css` — use semantic tokens (`--color-text-primary`) not raw values
- No Tailwind; avoid CSS-in-JS and runtime styling unless there is a clear need; inline styles are allowed for dynamic values that are awkward in CSS Modules (e.g., R3F overlays or scene-driven positioning)

## React Three Fiber
- Dispose all Three.js resources on unmount (materials, geometries, textures)
- Use `useFrame` for per-frame updates, never `requestAnimationFrame`
- `InstancedMesh` for repeated geometry (particles, trails)
- Adaptive DPR: `dpr={[1, 2]}`, regress when FPS < 45

## State Management
- Zustand stores: `useAppStore`, `useCVStore`
- Colocate state with the component that owns it
- Don't prop-drill more than 2 levels deep

## Accessibility
- All interactive elements must be keyboard accessible
- ARIA labels on all non-text interactive elements
- Use semantic HTML elements
- `prefers-reduced-motion` must be respected for animations

## Performance
- Lazy-load routes and heavy components
- Don't render lists without keys
- No console.log or debug artifacts in committed code
