---
paths: ["src/components/**", "src/features/**", "src/hooks/**"]
---

# Frontend Rules

## Component Structure
- One component per file
- File name matches the default export
- Props interface defined above the component

## Styling
- CSS Modules for all component styles (`.module.css`)
- CSS custom properties from `src/styles/global.css` — use semantic tokens (`--color-text-primary`) not raw values
- No CSS-in-JS, no Tailwind, no runtime styling, no inline styles

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
