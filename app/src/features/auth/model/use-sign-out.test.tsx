import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { authClient } from '#/shared/api'

import { useSignOut } from './use-sign-out'

vi.mock('#/shared/api', () => ({
  authClient: { signOut: vi.fn() },
}))
vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

const navigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({ navigate }),
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useSignOut', () => {
  beforeEach(() => {
    vi.mocked(authClient.signOut).mockReset()
    vi.mocked(toast.success).mockReset()
    navigate.mockReset()
  })

  it('navigates home and shows a success toast', async () => {
    vi.mocked(authClient.signOut).mockResolvedValue({ data: null, error: null })

    const { result } = renderHook(() => useSignOut(), { wrapper })
    result.current.mutate()

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith({ to: '/{-$locale}' }),
    )
    expect(toast.success).toHaveBeenCalled()
  })
})
