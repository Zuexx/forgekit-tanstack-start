import type { Locale } from './config'
import { isLocale } from './config'

/**
 * params.parse for the {-$locale} route segment. Returning `false` (rather than accepting any
 * string) makes TanStack Router's own matching treat an unsupported segment as no match at
 * all — the router falls through to its not-found handling instead of silently rendering the
 * default locale for any arbitrary path segment.
 */
export function parseLocaleParam(
  rawLocale: string | undefined,
): { locale?: Locale } | false {
  if (rawLocale === undefined) {
    return { locale: undefined }
  }
  return isLocale(rawLocale) ? { locale: rawLocale } : false
}
