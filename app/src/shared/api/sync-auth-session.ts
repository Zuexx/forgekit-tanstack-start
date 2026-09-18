import { useEffect } from 'react'

import { useUser } from '#/shared/state/hooks'

import { authClient } from './auth-client'

/**
 * Bridges shared/api (Better Auth's own reactive session) and shared/state (the app's
 * Zustand user slice). Better Auth's client already tracks session state reactively via
 * useSession() — this hook is the one place that pushes it into the store, so every other
 * component reads "who's signed in" through useUser()/useIsAuthenticated() rather than
 * calling Better Auth's client directly. Mount once, near the root.
 */
export function useSyncAuthSession() {
  const { data: session, isPending } = authClient.useSession()
  const { setUser } = useUser()

  useEffect(() => {
    if (isPending) return

    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.image ?? undefined,
      })
    } else {
      setUser(null)
    }
  }, [session, isPending, setUser])
}
