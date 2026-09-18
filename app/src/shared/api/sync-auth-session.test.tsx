import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { StateProvider, useAppStoreContext } from '#/shared/state/state-provider'

import { authClient } from './auth-client'
import { useSyncAuthSession } from './sync-auth-session'

vi.mock('./auth-client', () => ({
  authClient: {
    useSession: vi.fn(),
  },
}))

function wrapper({ children }: { children: React.ReactNode }) {
  return <StateProvider>{children}</StateProvider>
}

describe('useSyncAuthSession', () => {
  beforeEach(() => {
    vi.mocked(authClient.useSession).mockReset()
  })

  it('sets the store user when a session resolves', () => {
    vi.mocked(authClient.useSession).mockReturnValue({
      data: {
        user: {
          id: '1',
          name: 'Ada',
          email: 'ada@example.com',
          image: null,
        },
      },
      isPending: false,
    } as ReturnType<typeof authClient.useSession>)

    const { result } = renderHook(
      () => {
        useSyncAuthSession()
        return useAppStoreContext((state) => state.user)
      },
      { wrapper },
    )

    expect(result.current).toEqual({
      id: '1',
      name: 'Ada',
      email: 'ada@example.com',
      avatar: undefined,
    })
  })

  it('clears the store user when there is no session', () => {
    vi.mocked(authClient.useSession).mockReturnValue({
      data: null,
      isPending: false,
    } as ReturnType<typeof authClient.useSession>)

    const { result } = renderHook(
      () => {
        useSyncAuthSession()
        return useAppStoreContext((state) => state.user)
      },
      { wrapper },
    )

    expect(result.current).toBeNull()
  })

  it('does not touch the store while the session is still loading', () => {
    vi.mocked(authClient.useSession).mockReturnValue({
      data: {
        user: {
          id: '1',
          name: 'Ada',
          email: 'ada@example.com',
          image: null,
        },
      },
      isPending: true,
    } as ReturnType<typeof authClient.useSession>)

    const { result } = renderHook(
      () => {
        useSyncAuthSession()
        return useAppStoreContext((state) => state.user)
      },
      { wrapper },
    )

    expect(result.current).toBeNull()
  })
})
