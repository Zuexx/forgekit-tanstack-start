import { createFileRoute, redirect } from '@tanstack/react-router'

import { DEFAULT_LOCALE } from '#/shared/i18n'
import { buildLocale } from '#/shared/i18n/build-locale'
import { parseLocaleParam } from '#/shared/i18n/parse-locale-param'

export const Route = createFileRoute('/{-$locale}')({
  params: {
    parse: (raw) => parseLocaleParam(raw.locale),
  },
  beforeLoad: ({ params, location }) => {
    if (params.locale === DEFAULT_LOCALE) {
      throw redirect({
        to: buildLocale(location.pathname, undefined, undefined).path,
        replace: true,
      })
    }
  },
})
