import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

import { DEFAULT_LOCALE, isLocale } from '#/shared/i18n'
import { buildLocale } from '#/shared/i18n/build-locale'
import { parseLocaleParam } from '#/shared/i18n/parse-locale-param'

export const Route = createFileRoute('/{-$locale}')({
  params: {
    parse: (raw) => parseLocaleParam(raw.locale),
  },
  beforeLoad: ({ params, location }) => {
    // params.parse (above) only runs for client-side route matching -- confirmed directly:
    // the built dist/client bundle contains the params.parse call site, dist/server does not.
    // TanStack Start's SSR request handler renders whatever URL structurally fits the route
    // pattern without ever invoking params.parse, so an unsupported locale segment reached the
    // real page on the very first server-rendered response (an authenticated visitor hitting
    // it directly, not through a client-side navigation, which is what every prior curl-based
    // check exercised -- ABAC's own unauthenticated-implicit-deny redirect happens first and
    // masked this for every previously-tested unauthenticated case). Checking here instead
    // catches it in both environments, since beforeLoad runs on every request regardless of
    // SSR vs. client-side navigation.
    if (params.locale !== undefined && !isLocale(params.locale)) {
      throw notFound()
    }
    if (params.locale === DEFAULT_LOCALE) {
      throw redirect({
        to: buildLocale(location.pathname, undefined, undefined).path,
        replace: true,
      })
    }
  },
})
