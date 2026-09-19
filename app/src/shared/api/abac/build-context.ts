import type { AbacConfig, AbacContext } from './types'

/**
 * The pure half of context resolution: no server-only imports, so it's directly
 * unit-testable with plain values. resolve-context.ts (a createServerFn wrapper — it
 * can only run inside TanStack Start's real request runtime, not a plain Vitest call)
 * reads the actual cookie/request-method values and passes them in here.
 */
export function buildContext(
  path: string,
  config: AbacConfig,
  session: string | undefined,
  method: string,
): AbacContext {
  return {
    subject: { isAuthenticated: Boolean(session) },
    resource: {
      path,
      isPublic: config.publicRoutes.includes(path),
      isAuthRoute: config.authRoutes.includes(path),
    },
    environment: { method },
  }
}
