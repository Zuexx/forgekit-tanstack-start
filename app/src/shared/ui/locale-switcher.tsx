import { useRouter } from '@tanstack/react-router'
import { Languages } from 'lucide-react'

import { RadialMenu } from '#/shared/ui/radial-menu'
import type { RadialMenuItem } from '#/shared/ui/radial-menu'
import { LOCALE_COOKIE, SUPPORTED_LOCALES } from '../i18n/config'
import type { Locale } from '../i18n/config'
import { withLocalePrefix, buildLocale } from '../i18n/build-locale'

const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  'zh-TW': '中',
  'ko-KR': '한',
}

/**
 * Ported from forgekit's real components/locale-switcher.tsx — reads the current path,
 * strips any existing locale prefix, and re-prefixes it for the chosen locale, matching
 * the "as-needed" convention (no prefix for the default locale).
 */
export function LocaleSwitcher() {
  const router = useRouter()

  const handleLocaleChange = (locale: Locale) => {
    const { path: pathWithoutPrefix } = buildLocale(window.location.pathname, undefined, undefined)
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000`
    router.navigate({ to: withLocalePrefix(pathWithoutPrefix, locale) })
  }

  const items: RadialMenuItem[] = SUPPORTED_LOCALES.map((locale) => ({
    label: LOCALE_LABELS[locale],
    onClick: () => handleLocaleChange(locale),
  }))

  return (
    <RadialMenu
      items={items}
      toggle={<Languages />}
      toggleAriaLabel="Change language"
      trigger="click"
      arc={75}
      startAngle={340}
    />
  )
}
