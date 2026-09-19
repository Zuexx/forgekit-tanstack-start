import { getCookie, getRequest } from '@tanstack/react-start/server'

import { resolveContext as resolveContextCore } from './resolve-context'
import type { AbacConfig, AbacContext } from './types'

export function resolveContext(path: string, config: AbacConfig): AbacContext {
  return resolveContextCore(
    path,
    config,
    (name) => getCookie(name),
    () => getRequest().method,
  )
}
