import { createRootRoute, redirect } from '@tanstack/react-router'

import { evaluatePolicy, resolveContext } from '#/shared/api/abac'
import { ABAC_CONFIG } from '#/shared/lib/abac-config'
import { DEFAULT_LOCALE } from '#/shared/i18n'
import type { Locale } from '#/shared/i18n'
import { resolveLocale } from '#/shared/i18n/resolve-locale'
import { withLocalePrefix } from '#/shared/i18n/build-locale'
import { RootDocument } from '#/app/root-document'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    let locale: Locale = DEFAULT_LOCALE
    let path = location.pathname
    try {
      const localeResult = await resolveLocale(location.pathname)
      locale = localeResult.locale
      path = localeResult.path
    } catch {
      // Fail open to the default locale — same reasoning as the ABAC gate below: this
      // step is a convenience, not a security boundary, so a transient RPC failure
      // shouldn't break every route.
    }

    let decision
    try {
      decision = evaluatePolicy(await resolveContext(path, ABAC_CONFIG))
    } catch {
      return { locale }
    }
    if (decision.effect === 'redirect') {
      throw redirect({ to: withLocalePrefix(decision.to, locale) })
    }
    return { locale }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      ...(import.meta.env.DEV
        ? [{ rel: 'stylesheet', href: '/virtual:stylex.css' }]
        : []),
    ],
  }),
  shellComponent: RootDocument,
})
