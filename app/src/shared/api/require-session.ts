import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

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
 * getRequestHeaders is a server-only API — a plain top-level import of it from any file
 * reachable by the client bundle fails a real `pnpm build` outright (confirmed against this
 * repo's ABAC guard, shared/api/abac/resolve-context.ts). createServerFn isolates it: the
 * client gets an auto-generated RPC-calling stub, the server gets the real handler.
 */
const getSessionFn = createServerFn({ method: 'GET' }).handler(() => {
  return getSessionForHeaders(getRequestHeaders())
})

export async function requireSession() {
  const session = await getSessionFn()
  if (!session) {
    throw redirect({ to: '/sign-in' })
  }
  return session
}
