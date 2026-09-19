import { createRootRoute, redirect } from '@tanstack/react-router'

import { evaluatePolicy, resolveContext } from '#/shared/api/abac'
import { ABAC_CONFIG } from '#/shared/lib/abac-config'
import { RootDocument } from '#/app/root-document'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    const decision = evaluatePolicy(
      await resolveContext(location.pathname, ABAC_CONFIG),
    )
    if (decision.effect === 'redirect' && decision.to) {
      throw redirect({ to: decision.to })
    }
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
