import { QueryClient } from '@tanstack/react-query'

/**
 * Creates a new QueryClient instance.
 *
 * TanStack Query's SSR guidance requires a fresh QueryClient per
 * request/render rather than one shared module-level singleton, or cached
 * data leaks between users across SSR requests. Callers (see
 * `QueryProvider`) should construct one via a lazy `useState` initializer so
 * it's created once per component instance, not once per module load.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 0 },
    },
  })
}
