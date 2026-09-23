import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { deleteCookie, getRequestHeaders } from '@tanstack/react-start/server'

import { AUTH_COOKIE } from '#/shared/lib/constants'

/**
 * The testable core: takes headers directly rather than reading them itself, so a test can
 * construct a real Headers object from a real signed-up user's cookie without needing
 * TanStack Start's server runtime at all.
 *
 * `auth` is imported dynamically, not as a plain top-level `import { auth } from './auth'`.
 * auth.ts side-effect-imports db/load-root-env.ts (dotenv + node:path.resolve at module scope)
 * and the db adapters (better-sqlite3, mssql, pg) — none of that is a TanStack Start
 * server-only API the framework's own import-protection plugin recognizes (that plugin only
 * guards '@tanstack/react-start/server' exports, confirmed by this file's own
 * getRequestHeaders/deleteCookie imports below still needing createServerFn's split). A plain
 * top-level `import { auth } from './auth'` therefore bundled this entire chain into the
 * *client* build with no build-time error: dashboard.tsx imports requireSession from this
 * file, and Vite's static analysis eagerly includes anything a client-reachable file imports
 * at module scope. Confirmed via a real browser: `node:path.resolve` throws the instant that
 * chunk evaluates client-side (Vite stubs `node:path` to throw on property access in browser
 * builds), and that throw broke React's event delegation for the entire app — every onClick/
 * onSubmit silently did nothing, invisible to every prior verification in this project because
 * curl-based checks and jsdom-mocked unit tests never execute a real client bundle. A dynamic
 * `import()` here, used only inside this function (itself only ever called from the
 * createServerFn handler below, never from client code), keeps auth.ts's whole module graph
 * out of the client chunk: Vite gives it its own async chunk that's simply never requested
 * client-side, since nothing client-side ever calls this function.
 */
export async function getSessionForHeaders(headers: Headers) {
  const { auth } = await import('./auth')
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
    throw redirect({ to: '/{-$locale}/sign-in' })
  }
  return session
}
