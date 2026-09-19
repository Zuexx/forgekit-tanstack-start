import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { deleteCookie, getRequestHeaders } from '@tanstack/react-start/server'

import { AUTH_COOKIE } from '#/shared/lib/constants'

import { auth } from './auth'

/**
 * The testable core: takes headers directly rather than reading them itself, so a test can
 * construct a real Headers object from a real signed-up user's cookie without needing
 * TanStack Start's server runtime at all.
 */
export async function getSessionForHeaders(headers: Headers) {
  return auth.api.getSession({ headers })
}

/**
 * getRequestHeaders/deleteCookie are server-only APIs — a plain top-level import of them from
 * any file reachable by the client bundle fails a real `pnpm build` outright (confirmed against
 * this repo's ABAC guard, shared/api/abac/resolve-context.ts). createServerFn isolates it: the
 * client gets an auto-generated RPC-calling stub, the server gets the real handler.
 *
 * When there's no real session, this also deletes the session cookie server-side. Without
 * this, a stale/invalid cookie (revoked, DB reset, secret rotated, tampered) still reads as
 * "authenticated" to the ABAC gate (shared/api/abac/resolve-context.ts, which only checks
 * cookie presence as a cheap defense-in-depth split), so the gate would keep bouncing the
 * visitor from /sign-in back to /dashboard while this function bounces /dashboard back to
 * /sign-in — an infinite redirect loop the user can't escape, since the cookie is httpOnly.
 * Deleting it here breaks that loop on the very next request.
 */
const getSessionFn = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSessionForHeaders(getRequestHeaders())
  if (!session) {
    deleteCookie(`${AUTH_COOKIE}.session_token`)
    deleteCookie(`__Secure-${AUTH_COOKIE}.session_token`)
  }
  return session
})

export async function requireSession() {
  const session = await getSessionFn()
  if (!session) {
    throw redirect({ to: '/sign-in' })
  }
  return session
}
