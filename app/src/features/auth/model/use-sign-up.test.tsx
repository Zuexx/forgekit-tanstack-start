import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { authClient } from '#/shared/api'

import { useSignUp } from './use-sign-up'

vi.mock('#/shared/api', () => ({
  authClient: { signUp: { email: vi.fn() } },
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

describe('useSignUp', () => {
  beforeEach(() => {
    vi.mocked(authClient.signUp.email).mockReset()
    vi.mocked(toast.success).mockReset()
    vi.mocked(toast.error).mockReset()
    navigate.mockReset()
  })

  it('navigates to /dashboard and shows a success toast on success', async () => {
    vi.mocked(authClient.signUp.email).mockResolvedValue({
      data: { user: { id: '1' } },
      error: null,
    })

    const { result } = renderHook(() => useSignUp(), { wrapper })
    result.current.mutate({
      name: 'A Person',
      email: 'a@example.com',
      password: 'abcd1234',
      confirmPassword: 'abcd1234',
    })

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith({ to: '/{-$locale}/dashboard' }),
    )
    expect(toast.success).toHaveBeenCalled()
  })

  it('shows an error toast and does not navigate when Better Auth returns an error', async () => {
    vi.mocked(authClient.signUp.email).mockResolvedValue({
      data: null,
      error: { message: 'Email already in use' },
    })

    const { result } = renderHook(() => useSignUp(), { wrapper })
    result.current.mutate({
      name: 'A Person',
      email: 'a@example.com',
      password: 'abcd1234',
      confirmPassword: 'abcd1234',
    })

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Email already in use'),
    )
    expect(navigate).not.toHaveBeenCalled()
  })
})
