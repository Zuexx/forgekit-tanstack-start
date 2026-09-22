import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { authClient } from '#/shared/api'

import { useSignIn } from './use-sign-in'

vi.mock('#/shared/api', () => ({
  authClient: { signIn: { email: vi.fn() } },
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

describe('useSignIn', () => {
  beforeEach(() => {
    vi.mocked(authClient.signIn.email).mockReset()
    vi.mocked(toast.success).mockReset()
    vi.mocked(toast.error).mockReset()
    navigate.mockReset()
  })

  it('navigates to /dashboard and shows a success toast on success', async () => {
    vi.mocked(authClient.signIn.email).mockResolvedValue({
      data: { user: { id: '1' } },
      error: null,
    })

    const { result } = renderHook(() => useSignIn(), { wrapper })
    result.current.mutate({ email: 'a@example.com', password: 'abcd1234' })

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith({ to: '/{-$locale}/dashboard' }),
    )
    expect(toast.success).toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('shows an error toast and does not navigate when Better Auth returns an error', async () => {
    vi.mocked(authClient.signIn.email).mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    })

    const { result } = renderHook(() => useSignIn(), { wrapper })
    result.current.mutate({ email: 'a@example.com', password: 'wrong' })

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Invalid credentials'))
    expect(navigate).not.toHaveBeenCalled()
  })
})
