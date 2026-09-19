import { createServerFn } from '@tanstack/react-start'
import { getCookie, getRequest } from '@tanstack/react-start/server'

import { AUTH_COOKIE } from '#/shared/lib/constants'

import { buildContext } from './build-context'
import type { AbacConfig, AbacContext } from './types'

/**
 * getCookie/getRequest are server-only APIs (TanStack Start's import-protection plugin
 * rejects a plain import of '@tanstack/react-start/server' from any file reachable by the
 * client bundle, confirmed against a real `pnpm build` before this was written — __root.tsx's
 * beforeLoad calls this, and __root.tsx is unavoidably part of the client bundle for
 * hydration). createServerFn is the officially-supported bridge: the client gets an
 * auto-generated RPC-calling stub, the server gets the real handler — confirmed by inspecting
 * the built output, where this file's code appears only in dist/server/, never dist/client/.
 */
const resolveContextFn = createServerFn({ method: 'GET' })
  .validator((data: { path: string; config: AbacConfig }) => data)
  .handler(({ data }): AbacContext => {
    const session =
      getCookie(`${AUTH_COOKIE}.session_token`) ??
      getCookie(`__Secure-${AUTH_COOKIE}.session_token`)

    return buildContext(data.path, data.config, session, getRequest().method)
  })

export function resolveContext(
  path: string,
  config: AbacConfig,
): Promise<AbacContext> {
  return resolveContextFn({ data: { path, config } })
}
