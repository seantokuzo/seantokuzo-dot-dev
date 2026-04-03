Implement Phase 8: Launch Prep. Branch: `phase-8/launch-prep` off `main`.

The site has 7 phases shipped + a nucleus redesign (PR #9). The atom home page now has:
- MeshPhysicalMaterial nucleus with mouse-reactive simplex noise vertex displacement (frequency + amplitude scale with mouse speed, non-uniform spatial variation)
- Telemetry-style HUD labels on orbiting project electrons with keyboard accessibility
- Simplex noise hover displacement on electrons
- Lightweight shadows via invisible ground plane
- CV face tracker disabled (code intact, not loaded)
- Open tech-debt issue #10: replace inline style props with CSS custom properties on ProjectOrb

This is the final phase — make it production-ready.

## 5 Tickets — Parallelize Wave 1 (tickets 1-3), then Wave 2 (tickets 4-5)

---

### Ticket 1: SEO & Meta Tags
Add proper Open Graph images (generate an OG card from the atom scene), structured data (JSON-LD Person schema), canonical URLs, and a sitemap.xml. Each page needs unique title, description, and OG tags. Add robots.txt.

**Files:** `index.html`, `public/`, new `src/components/layout/Meta.tsx` or head manager

---

### Ticket 2: Performance Audit
Run Lighthouse on all 3 pages. Optimize: preload critical fonts (Inter, Outfit woff2), add resource hints for MediaPipe CDN, lazy-load heavy components more aggressively, add loading states for all async operations. Target 90+ on all Lighthouse categories. Review bundle size — the chunk warning from Vite should be addressed.

**Files:** `index.html`, `src/App.tsx`, route-level lazy imports, `vite.config.ts`

---

### Ticket 3: Accessibility Audit
Full keyboard navigation through all pages. Screen reader testing with VoiceOver. ARIA labels on all interactive elements. Focus management on project overlay (trap focus, return focus on close). Reduced motion support — `prefers-reduced-motion` should disable 3D animations, vertex displacement, and orbit rotation, showing a static simplified view.

**Files:** `src/features/atom/`, `src/features/game/`, `src/components/ui/`, `src/styles/global.css`

---

### Ticket 4: Error Boundaries
Add React error boundaries around each heavy feature (R3F atom scene, R3F game scene, CV system) with graceful fallback UIs. No blank screens on crash — show a styled error card with retry option. The atom page should fall back to ProjectList on R3F crash.

**Files:** new `src/components/ui/ErrorBoundary.tsx`, `src/features/atom/AtomPage.tsx`, `src/features/game/GamePage.tsx`

---

### Ticket 5: Final QA & Tech Debt
Address #10 (inline styles on ProjectOrb). Cross-browser testing (Chrome, Firefox, Safari). Mobile testing — all pages functional with touch, simplified 3D or list fallbacks. Verify total assets under 10MB budget. Fix any remaining TypeScript strict-mode warnings.

**Files:** `src/features/atom/ProjectOrb.tsx`, `src/features/atom/ProjectOrb.module.css`, various

---

## Quality Gates
Before marking Phase 8 complete:
1. `npm run build` passes clean (no warnings except chunk size if addressed)
2. Lighthouse 90+ on all categories for all 3 pages
3. Keyboard-navigable end-to-end
4. `prefers-reduced-motion` respected
5. Error boundaries catch R3F/CV crashes gracefully
6. Total assets under 10MB
7. Works on mobile (touch, list fallbacks)
