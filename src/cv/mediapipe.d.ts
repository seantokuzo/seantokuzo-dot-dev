// Minimal type shim for @mediapipe/tasks-vision
// Dynamic imports bypass Vite's broken exports resolution,
// but TypeScript still needs the module to exist.
declare module '@mediapipe/tasks-vision' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const FilesetResolver: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const HandLandmarker: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const FaceLandmarker: any
}
