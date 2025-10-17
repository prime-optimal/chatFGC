import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'

type ConvexProviderComponent = typeof import('./ConvexProviderClient')['default']

const ConvexAvailabilityContext = createContext(false)

export function useConvexAvailability() {
  return useContext(ConvexAvailabilityContext)
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convexUrl = import.meta.env.VITE_CONVEX_URL
  const isBrowser = typeof window !== 'undefined'
  const hasConvexFlag = import.meta.env.VITE_CONVEX_ENABLED === 'true'
  const stableConvexUrl = typeof convexUrl === 'string' && convexUrl.length > 0
  const enableConvex = isBrowser && hasConvexFlag && stableConvexUrl

  const availabilityValue = useMemo(() => enableConvex, [enableConvex])

  const [ProviderComponent, setProviderComponent] = useState<ConvexProviderComponent | null>(
    null,
  )

  useEffect(() => {
    let isMounted = true

    if (!enableConvex) {
      setProviderComponent(null)
      return () => {
        isMounted = false
      }
    }

    import('./ConvexProviderClient')
      .then((module) => {
        if (isMounted) {
          setProviderComponent(() => module.default)
        }
      })
      .catch((error) => {
        console.error('Failed to load Convex provider client:', error)
        if (isMounted) {
          setProviderComponent(null)
        }
      })

    return () => {
      isMounted = false
    }
  }, [enableConvex])

  if (!enableConvex || !ProviderComponent || !convexUrl) {
    return (
      <ConvexAvailabilityContext.Provider value={availabilityValue}>
        {children}
      </ConvexAvailabilityContext.Provider>
    )
  }

  return (
    <ConvexAvailabilityContext.Provider value={availabilityValue}>
      <ProviderComponent url={convexUrl}>{children}</ProviderComponent>
    </ConvexAvailabilityContext.Provider>
  )
}
