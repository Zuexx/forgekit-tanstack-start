import type { AbacContext, PolicyDecision } from './types'

export function evaluatePolicy(ctx: AbacContext): PolicyDecision {
  const { subject, resource } = ctx

  if (resource.isAuthRoute) {
    if (subject.isAuthenticated) {
      return { effect: 'redirect', to: '/dashboard' }
    }
    return { effect: 'allow' }
  }

  if (!subject.isAuthenticated && !resource.isPublic) {
    return { effect: 'redirect', to: '/sign-in' }
  }

  return { effect: 'allow' }
}
