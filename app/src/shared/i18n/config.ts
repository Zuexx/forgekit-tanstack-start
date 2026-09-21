export const SUPPORTED_LOCALES = ['en', 'zh-TW', 'ko-KR'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export const NAMESPACES = ['auth', 'common', 'form', 'toast', 'validation'] as const
export type Namespace = (typeof NAMESPACES)[number]

export const LOCALE_COOKIE = 'forgekit-tanstack-start.locale'

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value)
}
