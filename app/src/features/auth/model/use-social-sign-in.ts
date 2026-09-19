import toast from 'react-hot-toast'

import { authClient } from '#/shared/api'

/**
 * Better Auth's client manages the OAuth redirect itself — simpler than forgekit's manual
 * window.location.href to a Hono-wrapped endpoint, which this repo's architecture doesn't
 * have (sub-project 1 decided against a BFF layer).
 */
export function useSocialSignIn() {
  return {
    signIn: async () => {
      const result = await authClient.signIn.social({ provider: 'microsoft' })
      if (result.error) {
        toast.error(result.error.message ?? 'Sign in failed')
      }
    },
  }
}
