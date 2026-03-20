import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router'
import { PageShell } from './components/layout/PageShell'
import { LoadingScreen } from './components/ui/LoadingScreen'

const AtomPage = lazy(() =>
  import('./features/atom/AtomPage').then((m) => ({ default: m.AtomPage }))
)
const GamePage = lazy(() =>
  import('./features/game/GamePage').then((m) => ({ default: m.GamePage }))
)
const AboutPage = lazy(() =>
  import('./features/about/AboutPage').then((m) => ({ default: m.AboutPage }))
)

export const router = createBrowserRouter([
  {
    element: <PageShell />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AtomPage />
          </Suspense>
        ),
      },
      {
        path: '/world',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <GamePage />
          </Suspense>
        ),
      },
      {
        path: '/about',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AboutPage />
          </Suspense>
        ),
      },
    ],
  },
])
