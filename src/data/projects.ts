export type ProjectStatus = 'released' | 'in-development' | 'early-stage'

export interface ProjectMedia {
  type: 'image' | 'video' | 'gif'
  src: string
  alt?: string
}

export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  tech: string[]
  url?: string
  github?: string
  isPrivate: boolean
  status: ProjectStatus
  media: ProjectMedia | null
  featured: boolean
  color: string
}

export const projects: Project[] = [
  {
    id: 'seantokuzo-dev',
    title: 'seantokuzo.dev',
    description:
      'This portfolio site — 3D atom model, isometric game world, computer vision controls. The implementation IS the portfolio.',
    longDescription:
      'A fully interactive portfolio built with React Three Fiber, featuring a 3D atom model as the home page, an isometric Hawaiian village game world, and computer vision gesture controls powered by MediaPipe. Every page showcases a different technical capability — from physics-based game environments to real-time hand tracking that translates gestures into application controls.',
    tech: ['React', 'Three.js', 'TypeScript', 'MediaPipe', 'Rapier', 'Vite'],
    url: 'https://seantokuzo.dev',
    github: 'https://github.com/seantokuzo/seantokuzo-dot-dev',
    isPrivate: false,
    status: 'in-development',
    media: null,
    featured: true,
    color: '#c084fc',  // soft purple
  },
  {
    id: 'u-suck-at-money',
    title: 'U Suck At Money',
    description:
      'Full-stack personal finance command center — budgeting, spending analysis, retirement tracking, investments, savings goals, and wishlist management in one place.',
    longDescription:
      'A comprehensive personal finance application designed to replace scattered spreadsheets and multiple financial tools. Serves as a unified hub where users can track budgets and spending patterns, monitor 401k/HSA retirement contributions, view investment portfolios, set savings goals, plan for major life events, and maintain a purchase wishlist. Built with a modern full-stack architecture emphasizing type safety end-to-end — from database schema through API to UI components.',
    tech: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Zustand',
      'TanStack Query',
      'Neon Postgres',
      'Drizzle ORM',
      'NextAuth',
    ],
    isPrivate: true,
    status: 'in-development',
    media: null,
    featured: true,
    color: '#818cf8',
  },
  {
    id: 'major-tom',
    title: 'Major Tom',
    description:
      'Native iOS app for remote control of Claude Code sessions — approve tool calls from anywhere, with a gamified pixel-art office where AI agents come to life.',
    longDescription:
      'A sophisticated remote control system for AI agent orchestration, allowing developers to manage Claude Code CLI sessions and VSCode extensions from their iPhone with full approval authority over tool calls. Features a pixel-art office environment built with SpriteKit where orchestrator and subagent characters animate based on work state — walking to desks when active, hanging in the break room when idle. The architecture spans a Swift/SwiftUI iOS app, a Node.js/Fastify relay server communicating over WebSocket, and a VSCode extension target.',
    tech: [
      'Swift',
      'SwiftUI',
      'SpriteKit',
      'Node.js',
      'TypeScript',
      'Fastify',
      'WebSocket',
      'Claude Agent SDK',
    ],
    github: 'https://github.com/seantokuzo/major-tom',
    isPrivate: false,
    status: 'in-development',
    media: null,
    featured: true,
    color: '#7c3aed',
  },
  {
    id: 'roi-gen',
    title: 'ROI-GEN',
    description:
      'AI-powered autonomous trading platform with human-in-the-loop approval, multi-strategy support, and real-time portfolio tracking via Alpaca.',
    longDescription:
      'An autonomous AI trading system that democratizes algorithmic trading by combining real-time market data with multi-LLM intelligence. Generates actionable trading signals from multiple AI sources (OpenAI, Anthropic, Cohere, Google), executes within strict safety guardrails including position limits, daily loss caps, and trade frequency restrictions. Supports paper trading for risk-free strategy validation and provides a chat interface for natural language portfolio analysis alongside traditional signal approval workflows.',
    tech: [
      'Python',
      'FastAPI',
      'React',
      'TypeScript',
      'PostgreSQL',
      'Redis',
      'LangChain',
      'Alpaca API',
      'Docker',
    ],
    isPrivate: true,
    status: 'in-development',
    media: null,
    featured: true,
    color: '#a78bfa',
  },
  {
    id: 'face-fling',
    title: 'Face-Fling',
    description:
      'Native macOS app that scans photo folders, detects and clusters faces with ML, and lets you organize your entire library by the people in them.',
    longDescription:
      'Solves the problem of finding specific photos in large digital archives. Recursively scans folders, detects all faces using state-of-the-art dlib ResNet models, clusters similar-looking faces automatically, and presents them in an intuitive interface for identification and organization. Intelligently handles aging faces across decades of photos by supporting cluster merging, and exports matched photos with smart naming. Everything runs locally with zero cloud dependency.',
    tech: ['C++', 'Qt 6', 'dlib', 'SQLite', 'CMake'],
    github: 'https://github.com/seantokuzo/face-fling',
    isPrivate: false,
    status: 'early-stage',
    media: null,
    featured: true,
    color: '#6d28d9',
  },
  {
    id: 'seantokuzo-mcp',
    title: 'Kuzo MCP',
    description:
      'MCP server and CLI tool that automates GitHub pull request management — gives AI assistants programmatic PR control with a personality-driven terminal UI.',
    longDescription:
      'A comprehensive GitHub automation platform built on the Model Context Protocol, enabling Claude and other AI assistants to programmatically manage pull requests. Provides multiple interfaces: a powerful MCP server for AI integration, an interactive CLI with three personality modes (chaotic, professional, zen), and a webhook server for auto-updating PR descriptions on push events. Integrates GitHub API operations with JIRA ticket management and includes environment-driven configuration for seamless team customization.',
    tech: [
      'Node.js',
      'TypeScript',
      'MCP SDK',
      'Octokit',
      'Express',
      'Commander',
      'Zod',
    ],
    github: 'https://github.com/seantokuzo/seantokuzo-mcp',
    isPrivate: false,
    status: 'released',
    media: null,
    featured: false,
    color: '#4f46e5',
  },
  {
    id: 'the-bach',
    title: 'The Bach',
    description:
      'Bachelor/bachelorette party planning platform with real-time collaboration, social games, expense tracking, and a mobile-first experience.',
    longDescription:
      'A comprehensive party planning and entertainment platform for coordinating bachelor and bachelorette parties. Combines essential planning features like itineraries and expense splitting with interactive social games (Quiplash-style), real-time chat with reactions, and member management. Spans mobile (React Native), web, and API layers within a Turborepo monorepo. Features push notifications, offline chat support, WebAuthn authentication, and a complete design system — all deployed to Fly.io with Neon Postgres and Upstash Redis.',
    tech: [
      'React Native',
      'TypeScript',
      'Hono',
      'Socket.IO',
      'Drizzle ORM',
      'PostgreSQL',
      'Redis',
      'Turborepo',
      'Docker',
    ],
    isPrivate: true,
    status: 'in-development',
    media: null,
    featured: true,
    color: '#8b5cf6',
  },
]
