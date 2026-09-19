import { AUTH_COOKIE } from '#/shared/lib/constants'

import type { AbacConfig, AbacContext } from './types'

export function resolveContext(
  path: string,
  config: AbacConfig,
  getCookieFn: (name: string) => string | undefined,
  getMethodFn: () => string,
): AbacContext {
  const session =
    getCookieFn(`${AUTH_COOKIE}.session_token`) ??
    getCookieFn(`__Secure-${AUTH_COOKIE}.session_token`)

  return {
    subject: { isAuthenticated: Boolean(session) },
    resource: {
      path,
      isPublic: config.publicRoutes.includes(path),
      isAuthRoute: config.authRoutes.includes(path),
    },
    environment: { method: getMethodFn() },
  }
}
