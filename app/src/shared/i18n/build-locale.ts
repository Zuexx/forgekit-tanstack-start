import type { Locale } from './config'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, isLocale } from './config'

/**
 * The pure half of locale resolution — no server-only imports, so it's directly
 * unit-testable with plain values. resolve-locale.ts (a createServerFn wrapper — it can
 * only run inside TanStack Start's real request runtime) reads the actual cookie/header
 * values and passes them in here. Mirrors sub-project 2's build-context.ts/resolve-context.ts
 * split for the exact same reason.
 */
export function buildLocale(
  path: string,
  cookieLocale: string | undefined,
  acceptLanguage: string | undefined,
): { locale: Locale; path: string } {
  const segments = path.split('/')
  const leadingSegment = segments[1] ?? ''

  if (isLocale(leadingSegment)) {
    const rest = `/${segments.slice(2).join('/')}`
    return { locale: leadingSegment, path: rest === '/' ? '/' : rest.replace(/\/+$/, '') }
  }

  if (cookieLocale && isLocale(cookieLocale)) {
    return { locale: cookieLocale, path }
  }

  return { locale: negotiateLocale(acceptLanguage), path }
}

function negotiateLocale(acceptLanguage: string | undefined): Locale {
  if (!acceptLanguage) {
    return DEFAULT_LOCALE
  }

  const preferences = acceptLanguage
    .split(',')
    .map((part) => part.split(';')[0]?.trim().toLowerCase())
    .filter((part): part is string => Boolean(part))

  for (const preference of preferences) {
    const match = SUPPORTED_LOCALES.find(
      (locale) =>
        locale.toLowerCase() === preference ||
        preference.startsWith(`${locale.toLowerCase().split('-')[0]}-`) ||
        preference === locale.toLowerCase().split('-')[0],
    )
    if (match) {
      return match
    }
  }

  return DEFAULT_LOCALE
}

export function withLocalePrefix(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) {
    return path
  }
  return path === '/' ? `/${locale}` : `/${locale}${path}`
}
