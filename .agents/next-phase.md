Implement Phase 7: Computer Vision Controls. The site has 6 phases shipped (foundation, 3D atom
home, about page, tropical beach world, polish pass, interactive experiences). Now it's time to
bring the computer vision features to life. Here's what needs work:

▎ 1. MediaPipe Hand Tracking — Wire up @mediapipe/tasks-vision HandLandmarker to the webcam.
Create a `HandTracker` class in `src/cv/` that processes frames at 15fps, detects hand landmarks,
and maps them to gestures: pinch (select/click), point (cursor control), open-palm (stop/pause),
swipe-left/swipe-right (navigate). Push gesture state to `useCVStore`.

▎ 2. MediaPipe Face Tracking — Create a `FaceTracker` class in `src/cv/` using FaceLandmarker
at 10fps. Detect blink, wink-left, wink-right, and smile actions. Push face action state to
`useCVStore`. Never process hand AND face in the same frame.

▎ 3. Gesture-to-Action Mapping (Atom Page) — On the home page, map gestures to atom controls:
pinch to select a project orb, point to move the camera angle, open-palm to pause orbit rotation,
swipe to cycle between orbital shells.

▎ 4. Camera Permission Flow — Build a progressive enhancement flow: detect camera capability,
request permission with clear UX, show camera preview with landmark overlay, graceful degradation
when denied. Desktop only — never enable CV on mobile.

▎ 5. CV Toggle UI — Add a camera/CV toggle button near the view mode toggle on the atom page.
When enabled, show a small camera preview in the corner with hand/face landmarks overlaid.
When disabled, all CV processing stops and camera releases.

▎ Branch: phase-7/computer-vision. The stores (useCVStore) and hooks (useDeviceCapabilities)
already exist — build on them. Keep CV processing budget-conscious: 320x240 camera, 15fps hands,
10fps face, never both in same frame.
