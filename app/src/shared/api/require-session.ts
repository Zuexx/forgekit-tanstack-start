import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { deleteCookie, getRequestHeaders } from '@tanstack/react-start/server'

import { AUTH_COOKIE } from '#/shared/lib/constants'

/**
 * The testable core: takes headers directly rather than reading them itself, so a test can
 * construct a real Headers object from a real signed-up user's cookie without needing
 * TanStack Start's server runtime at all.
 *
 * `auth` is imported dynamically, not as a plain top-level `import { auth } from './auth.server'`.
 * createServerFn's compiler only drops an import from the client build when nothing outside
 * the handler closure uses it — getRequestHeaders/deleteCookie below qualify (used only inside
 * the handler), but this function is separately exported for testing and uses `auth` outside
 * any handler, so the compiler can't prove it's droppable and bundles it into the client build
 * as-is. auth.server.ts side-effect-imports db/load-root-env.ts (dotenv + node:path.resolve at
 * module scope) and the db adapters (better-sqlite3, mssql, pg); none of that failed a real
 * `pnpm build`, because TanStack Start's import-protection plugin only rejects a *static*
 * client-reachable import of '@tanstack/react-start/server' or a '*.server.*' file outright —
 * it doesn't catch a plain module that merely behaves as server-only. Confirmed via a real
 * browser (this repo's first real-browser test — every prior check across every sub-project
 * used curl or jsdom, which never execute a real client bundle): `node:path.resolve` throws
 * the instant that chunk evaluated client-side (Vite stubs `node:path` to throw on property
 * access in browser builds), and that throw broke React's event delegation for the entire
 * app — every onClick/onSubmit silently did nothing.
 *
 * Two independent layers now prevent this: the dynamic `import()` here means Vite only ever
 * creates a separate async chunk for auth.server.ts, never requested client-side since nothing
 * client-side calls this function; and the `.server.ts` suffix (renamed from `auth.ts`) means
 * import-protection would now fail the *build* outright if a future static import of it ever
 * became client-reachable again, rather than silently shipping the same hydration break.
 */
export async function getSessionForHeaders(headers: Headers) {
  const { auth } = await import('./auth.server')
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
