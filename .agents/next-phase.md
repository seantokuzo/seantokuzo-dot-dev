Implement Phase 6: Interactive Experiences. The site has 5 phases shipped (foundation, 3D atom home, about page, tropical beach world, polish pass). Now it's time to make the experiences richer and more engaging. Here's what needs work:

▎ 1. World Page Interactables — The beach world is explorable but empty. Add interactive elements the player can walk up to and trigger: a surfboard, a campfire, a beach hut with a mailbox (contact), and a tiki sign (about link). Each should have a proximity-based interaction prompt ("Press E to interact" / tap on mobile) and do something meaningful (open overlay, navigate, show info).

▎ 2. Atom Page Orbit Enhancements — The 3D atom works but feels static. Add: subtle particle trails behind orbiting project orbs, a gentle pulse/breathe animation on the nucleus, and improved hover states with info preview tooltips before clicking.

▎ 3. Page Transitions — Routes switch instantly which feels jarring. Add subtle enter/exit animations between pages using CSS transitions or a lightweight animation approach (no framer-motion — keep bundle small).

▎ 4. Sound Design (Optional/Progressive) — Ambient ocean sounds on World page, subtle UI feedback sounds on interactions. Must be user-initiated (no autoplay), with a mute toggle in the nav. Use Web Audio API, not <audio> tags.

▎ Branch: phase-6/interactive-experiences. Focus on making visitors want to stay and explore.
