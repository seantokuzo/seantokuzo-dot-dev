export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  tech: string[]
  url?: string
  github?: string
  image?: string
  featured: boolean
}

export const projects: Project[] = [
  {
    id: 'seantokuzo-dev',
    title: 'seantokuzo.dev',
    description:
      'This portfolio site — 3D atom model, isometric game world, computer vision controls. The implementation IS the portfolio.',
    longDescription:
      'A fully interactive portfolio built with React Three Fiber, featuring a 3D atom model as the home page, an isometric Hawaiian village game world, and computer vision gesture controls powered by MediaPipe. Every page showcases a different technical capability.',
    tech: ['React', 'Three.js', 'TypeScript', 'MediaPipe', 'Rapier', 'Vite'],
    url: 'https://seantokuzo.dev',
    github: 'https://github.com/seantokuzo/seantokuzo-dot-dev',
    featured: true,
  },
  {
    id: 'cv-gesture-engine',
    title: 'CV Gesture Engine',
    description:
      'Real-time hand and face tracking with MediaPipe, translating gestures into application controls at 15fps.',
    longDescription:
      'A computer vision pipeline that processes webcam input through MediaPipe hand and face landmark models, mapping detected gestures to discrete application actions. Runs at 15fps for hands and 10fps for face, with intelligent throttling to prevent frame drops.',
    tech: ['MediaPipe', 'TypeScript', 'WebRTC', 'Canvas API'],
    featured: true,
  },
  {
    id: 'island-world',
    title: 'Island World',
    description:
      'Isometric Hawaiian village game world with Rapier physics, explorable NPCs, and interactive environment.',
    longDescription:
      'An isometric game environment built with React Three Fiber and Rapier physics. Features a Hawaiian-themed village with explorable areas, interactive NPCs, and physics-based interactions. Serves as the /world route of the portfolio.',
    tech: ['React Three Fiber', 'Rapier', 'TypeScript', 'Zustand'],
    featured: true,
  },
  {
    id: 'shader-lab',
    title: 'Shader Lab',
    description:
      'Collection of custom GLSL shaders — procedural planets, ocean surfaces, and bioluminescent effects.',
    longDescription:
      'A creative coding playground for GLSL shader development. Includes procedural terrain generation, ocean wave simulation, atmospheric scattering, and bioluminescent particle effects. Many of these shaders power visuals throughout the portfolio.',
    tech: ['GLSL', 'Three.js', 'WebGL', 'TypeScript'],
    featured: true,
  },
  {
    id: 'wave-function',
    title: 'Wave Function Collapse',
    description:
      'Procedural level generation using the Wave Function Collapse algorithm for tilemap-based worlds.',
    longDescription:
      'Implementation of the Wave Function Collapse algorithm for generating coherent tilemap layouts. Used to procedurally create village layouts and terrain patterns in the game world section of the portfolio.',
    tech: ['TypeScript', 'Canvas API', 'Algorithms'],
    featured: false,
  },
  {
    id: 'midi-visualizer',
    title: 'MIDI Visualizer',
    description:
      'Real-time 3D visualization of MIDI input using Web MIDI API and Three.js particle systems.',
    longDescription:
      'Connects to MIDI controllers via the Web MIDI API and translates note data into real-time 3D particle animations. Each MIDI channel maps to a different visual layer with configurable color palettes and physics behaviors.',
    tech: ['Web MIDI', 'Three.js', 'TypeScript', 'Web Audio'],
    featured: false,
  },
]
