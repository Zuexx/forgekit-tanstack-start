import type { AbacConfig } from '#/shared/api/abac'

/**
 * Anything not listed here falls through to the protected-by-default branch of
 * evaluatePolicy — matching forgekit's own implicit-deny shape. Add a route here only
 * when it's genuinely public or is itself a sign-in/sign-up-style auth route; every other
 * new route is protected with zero extra configuration.
 */
export const ABAC_CONFIG: AbacConfig = {
  publicRoutes: ['/'],
  authRoutes: ['/sign-in', '/sign-up'],
}
