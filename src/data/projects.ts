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
    tech: ['React', 'Three.js', 'TypeScript', 'MediaPipe', 'Rapier', 'Vite'],
    url: 'https://seantokuzo.dev',
    github: 'https://github.com/seantokuzo/seantokuzo-dot-dev',
    featured: true,
  },
  // Add more projects as they're ready
]
