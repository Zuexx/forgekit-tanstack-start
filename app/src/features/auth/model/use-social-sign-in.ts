import { authClient } from '#/shared/api'

/**
 * Better Auth's client manages the OAuth redirect itself — simpler than forgekit's manual
 * window.location.href to a Hono-wrapped endpoint, which this repo's architecture doesn't
 * have (sub-project 1 decided against a BFF layer).
 */
export function useSocialSignIn() {
  return {
    signIn: () => authClient.signIn.social({ provider: 'microsoft' }),
  }
}
