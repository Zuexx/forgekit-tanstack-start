import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

import { DEFAULT_LOCALE, isLocale } from '#/shared/i18n'
import { buildLocale } from '#/shared/i18n/build-locale'
import { parseLocaleParam } from '#/shared/i18n/parse-locale-param'

export const Route = createFileRoute('/{-$locale}')({
  params: {
    parse: (raw) => parseLocaleParam(raw.locale),
  },
  beforeLoad: ({ params, location }) => {
    // params.parse (above) does not actually gate the match here, on client or server, for the
    // ENTIRE {-$locale} subtree -- not just routes under _authenticated. This route and its
    // child layout route (_authenticated, no path segment of its own, no parse function) share
    // one route-tree node, and TanStack Router's tree construction has every node -- including
    // ones with no path -- overwrite node.parse with its own (parseParams ?? null). Because
    // _authenticated is built after {-$locale}, its null wins and disables parse for every route
    // in this subtree, authenticated or not (/dashboard, /sign-in, /sign-up, the bare index --
    // confirmed directly with a scratch router-tree harness against the installed router-core
    // package: removing _authenticated from the tree restores rejection everywhere, leaving it
    // in place disables it everywhere). That's an upstream TanStack Router bug
    // (new-process-route-tree.ts's node.parse assignment), not a client/server split -- client and
    // server behave identically. This previously went unnoticed because ABAC's own
    // unauthenticated-implicit-deny redirect fires before any unauthenticated request reaches
    // this check, and only an authenticated /dashboard visit was ever tested end-to-end. Checking
    // here instead is unaffected by that bug and catches it for every route in the subtree, since
    // beforeLoad runs on every request regardless of SSR vs. client-side navigation, and keeps
    // working if/when the upstream bug is fixed. (Upstream issue not yet filed -- TODO: file
    // against tanstack/router referencing new-process-route-tree.ts's node.parse assignment.)
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
