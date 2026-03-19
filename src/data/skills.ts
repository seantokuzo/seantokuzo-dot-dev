export interface Skill {
  name: string
  category: SkillCategory
}

export type SkillCategory =
  | 'languages'
  | 'frontend'
  | 'backend'
  | 'ai-tools'
  | 'devops'
  | 'methodology'

export const skillCategories: Record<SkillCategory, string> = {
  languages: 'Languages',
  frontend: 'Frontend',
  backend: 'Backend',
  'ai-tools': 'AI & Tools',
  devops: 'DevOps & Infrastructure',
  methodology: 'Methodology',
}

export const skills: Skill[] = [
  // Languages
  { name: 'TypeScript', category: 'languages' },
  { name: 'JavaScript', category: 'languages' },
  { name: 'Python', category: 'languages' },
  { name: 'HTML/CSS', category: 'languages' },
  { name: 'SQL', category: 'languages' },

  // Frontend
  { name: 'React', category: 'frontend' },
  { name: 'Next.js', category: 'frontend' },
  { name: 'Three.js / R3F', category: 'frontend' },
  { name: 'CSS Modules', category: 'frontend' },
  { name: 'Zustand', category: 'frontend' },
  { name: 'Vite', category: 'frontend' },

  // Backend
  { name: 'Node.js', category: 'backend' },
  { name: 'Express', category: 'backend' },
  { name: 'PostgreSQL', category: 'backend' },
  { name: 'MongoDB', category: 'backend' },
  { name: 'REST APIs', category: 'backend' },

  // AI & Tools
  { name: 'Claude / AI-Driven Dev', category: 'ai-tools' },
  { name: 'Specification-Driven Development', category: 'ai-tools' },
  { name: 'Prompt Engineering', category: 'ai-tools' },
  { name: 'MediaPipe / Computer Vision', category: 'ai-tools' },

  // DevOps
  { name: 'Git / GitHub', category: 'devops' },
  { name: 'Netlify', category: 'devops' },
  { name: 'CI/CD', category: 'devops' },
  { name: 'Docker', category: 'devops' },

  // Methodology
  { name: 'SDD (Spec-Driven Dev)', category: 'methodology' },
  { name: 'Agile / Scrum', category: 'methodology' },
  { name: 'System Design', category: 'methodology' },
  { name: 'Code Review', category: 'methodology' },
]
