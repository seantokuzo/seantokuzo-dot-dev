export interface Experience {
  title: string
  company: string
  period: string
  description: string
  highlights: string[]
}

export const experience: Experience[] = [
  {
    title: 'Senior Fullstack Software Engineer',
    company: 'Independent / Contract',
    period: '2023 — Present',
    description:
      'Building production-grade applications using specification-driven development and AI-assisted workflows.',
    highlights: [
      'Pioneered SDD methodology for AI-driven development teams',
      'Built fullstack applications with React, Node.js, and PostgreSQL',
      'Integrated computer vision and 3D web experiences',
      'Delivered projects for clients across multiple industries',
    ],
  },
  // Add more experience entries as needed
]
