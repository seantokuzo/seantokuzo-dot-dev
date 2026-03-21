Implement Phase 8: Final Polish & Launch Prep. The site has 7 phases shipped (foundation, 3D atom
home, about page, tropical beach world, polish pass, interactive experiences, computer vision).
Time to get this production-ready. Here's what needs work:

▎ 1. SEO & Meta Tags — Add proper Open Graph images (generate an OG card from the atom scene),
structured data (JSON-LD Person schema), canonical URLs, and a sitemap.xml. Make sure each
page has unique title, description, and OG tags.

▎ 2. Performance Audit — Run Lighthouse on all 3 pages. Optimize: preload critical fonts,
add resource hints for MediaPipe CDN, lazy-load heavy components more aggressively, add
loading states for all async operations. Target 90+ on all Lighthouse categories.

▎ 3. Accessibility Audit — Keyboard navigation through all pages, screen reader testing,
ARIA labels on all interactive elements, focus management on overlays, reduced motion
support (`prefers-reduced-motion` to disable animations/3D).

▎ 4. Error Boundaries — Add React error boundaries around each heavy feature (R3F scenes,
CV system) with graceful fallback UIs. No blank screens on crash.

▎ 5. Analytics & Monitoring — Add lightweight analytics (Plausible or similar privacy-first
solution). Track page views, CV feature usage, and world page interaction events.

▎ Branch: phase-8/launch-prep. This is the final phase before launch. Everything should be
bulletproof.
