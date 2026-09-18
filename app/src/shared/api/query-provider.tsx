import type { ReactNode } from 'react'
import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { makeQueryClient } from './query-client'

export function QueryProvider({ children }: { children: ReactNode }) {
  // Lazy useState initializer: creates exactly one QueryClient per component
  // instance (per request under SSR), rather than sharing one module-level
  // singleton across every request.
  const [queryClient] = useState(() => makeQueryClient())

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
