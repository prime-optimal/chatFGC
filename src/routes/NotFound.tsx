import { createFileRoute } from '@tanstack/react-router'

export function NotFoundComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="p-8 text-center text-white bg-gray-800/80 rounded-xl border border-orange-500/30 shadow-lg max-w-md">
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-sm text-gray-300">
          We couldn&apos;t find the content you were looking for. Please check the URL or return to the main chat.
        </p>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/NotFound')({
  component: NotFoundComponent,
})
