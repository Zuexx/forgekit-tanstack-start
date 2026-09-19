import { createRootRoute, redirect } from '@tanstack/react-router'

import { evaluatePolicy, resolveContext } from '#/shared/api/abac'
import { ABAC_CONFIG } from '#/shared/lib/abac-config'
import { RootDocument } from '#/app/root-document'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    let decision
    try {
      decision = evaluatePolicy(
        await resolveContext(location.pathname, ABAC_CONFIG),
      )
    } catch {
      // Fail open: this gate is a cheap redirect convenience, not the real authorization
      // boundary — requireSession() on protected routes is, so letting a transient
      // resolveContext RPC failure through here (rather than breaking every route,
      // including public ones) doesn't create a security hole.
      return
    }
    if (decision.effect === 'redirect') {
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
