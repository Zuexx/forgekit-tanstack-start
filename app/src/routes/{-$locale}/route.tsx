import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

import { DEFAULT_LOCALE, isLocale } from '#/shared/i18n'
import { buildLocale } from '#/shared/i18n/build-locale'
import { parseLocaleParam } from '#/shared/i18n/parse-locale-param'

export const Route = createFileRoute('/{-$locale}')({
  params: {
    parse: (raw) => parseLocaleParam(raw.locale),
  },
  beforeLoad: ({ params, location }) => {
    // params.parse (above) does not actually gate the match here, on client or server: this
    // route has a child layout route (_authenticated) with no path segment of its own and no
    // parse function, and TanStack Router's route-tree construction has every node -- including
    // ones with no path -- overwrite node.parse with its own (parseParams ?? null), which
    // clobbers this route's parse with null for any URL that resolves into _authenticated (e.g.
    // /dashboard). That's an upstream TanStack Router bug (new-process-route-tree.ts, the node.parse
    // assignment), not a client/server split -- confirmed by direct reproduction against the
    // installed router-core package. So an unsupported locale segment reached the real page on
    // the very first server-rendered response (an authenticated visitor hitting it directly, not
    // through a client-side navigation, which is what every prior curl-based check exercised --
    // ABAC's own unauthenticated-implicit-deny redirect happens first and masked this for every
    // previously-tested unauthenticated case). Checking here instead is unaffected by that bug and
    // catches it in both environments, since beforeLoad runs on every request regardless of SSR vs.
    // client-side navigation, and continues to work if/when the upstream bug is fixed.
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
