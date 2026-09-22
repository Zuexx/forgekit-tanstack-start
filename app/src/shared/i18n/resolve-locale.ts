import { createServerFn } from '@tanstack/react-start'
import { getCookie, getRequestHeader } from '@tanstack/react-start/server'

import type { Locale } from './config'
import { LOCALE_COOKIE } from './config'
import { buildLocale } from './build-locale'

/**
 * getCookie/getRequestHeader are server-only APIs, same import-protection constraint
 * documented in shared/api/abac/resolve-context.ts and shared/api/require-session.ts —
 * createServerFn is the bridge. No test of its own: it can only run inside TanStack
 * Start's real request runtime ("No Start context found in AsyncLocalStorage" outside
 * it), same accepted gap as those two files. buildLocale (above) carries the real,
 * directly-tested logic.
 */
const resolveLocaleFn = createServerFn({ method: 'GET' })
  .validator((data: { path: string }) => data)
  .handler(({ data }) => {
    const cookieLocale = getCookie(LOCALE_COOKIE)
    const acceptLanguage = getRequestHeader('accept-language')
    return buildLocale(data.path, cookieLocale, acceptLanguage)
  })

export function resolveLocale(path: string): Promise<{ locale: Locale; path: string }> {
  return resolveLocaleFn({ data: { path } })
}
