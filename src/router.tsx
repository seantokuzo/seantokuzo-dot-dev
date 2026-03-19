import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router'
import { PageShell } from './components/layout/PageShell'

const AtomPage = lazy(() =>
  import('./features/atom/AtomPage').then((m) => ({ default: m.AtomPage }))
)
const GamePage = lazy(() =>
  import('./features/game/GamePage').then((m) => ({ default: m.GamePage }))
)
const AboutPage = lazy(() =>
  import('./features/about/AboutPage').then((m) => ({ default: m.AboutPage }))
)

function PageLoader() {
  return (
    <div
      style={{
        minHeight: 'calc(100dvh - var(--nav-height))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-muted)',
      }}
    >
      Loading...
    </div>
  )
}

export const router = createBrowserRouter([
  {
    element: <PageShell />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AtomPage />
          </Suspense>
        ),
      },
      {
        path: '/world',
        element: (
          <Suspense fallback={<PageLoader />}>
            <GamePage />
          </Suspense>
        ),
      },
      {
        path: '/about',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AboutPage />
          </Suspense>
        ),
      },
    ],
  },
])
