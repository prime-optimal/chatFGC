import {
  createRootRoute,
  Outlet,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { ConvexClientProvider } from '../convex'
import { NotFoundComponent } from './NotFound'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'chatFGC',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: () => (
    <RootDocument>
      <Outlet />
    </RootDocument>
  ),
  errorComponent: RootError,
  notFoundComponent: NotFoundComponent,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
        <Scripts />
      </body>
    </html>
  )
}

function RootError({ error }: { error: unknown }) {
  console.error('Root route error:', error)

  return (
    <RootDocument>
      <main className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="p-8 text-center text-white bg-gray-800/80 rounded-xl border border-orange-500/30 shadow-lg max-w-md">
          <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
          <p className="text-sm text-gray-300">
            Please refresh the page or try again later.
          </p>
        </div>
      </main>
    </RootDocument>
  )
}
