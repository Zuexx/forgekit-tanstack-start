import type { Locale } from './config'
import { isLocale } from './config'

/**
 * params.parse for the {-$locale} route segment. In principle, returning `false` (rather than
 * accepting any string) should make TanStack Router's own matching treat an unsupported segment
 * as no match at all. In practice, for this route tree it never gates the match, for any route
 * in the {-$locale} subtree (not just authenticated ones) -- {-$locale}/route.tsx has a child
 * layout route with no path segment of its own, which overwrites this parse function for the
 * whole subtree during route-tree construction (a confirmed upstream TanStack Router bug; see
 * the comment on {-$locale}/route.tsx's beforeLoad for the full mechanism). The real guard
 * against an unsupported locale segment is the explicit isLocale() check in that beforeLoad,
 * which runs regardless of this bug. Keep this function returning `false` for invalid input
 * anyway — it's still correct type-narrowing for params.locale and costs nothing — but don't
 * rely on it alone for rejection.
 */
export function parseLocaleParam(
  rawLocale: string | undefined,
): { locale?: Locale } | false {
  if (rawLocale === undefined) {
    return { locale: undefined }
  }
  return isLocale(rawLocale) ? { locale: rawLocale } : false
}
