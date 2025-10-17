import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { useMemo } from 'react'
import type { ReactNode } from 'react'

interface Props {
  url: string
  children: ReactNode
}

export default function ConvexProviderClient({ url, children }: Props) {
  const client = useMemo(() => new ConvexReactClient(url), [url])
  return <ConvexProvider client={client}>{children}</ConvexProvider>
}
