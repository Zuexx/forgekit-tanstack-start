import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { createI18nInstance } from '#/shared/i18n'

import { NavUser } from './nav-user'

const { mockUseUser, mockMutate } = vi.hoisted(() => ({
  mockMutate: vi.fn(),
  mockUseUser: vi.fn(),
}))

vi.mock('#/shared/state', () => ({
  useUser: mockUseUser,
}))

vi.mock('#/features/auth', () => ({
  useSignOut: () => ({ mutate: mockMutate }),
}))

function renderNavUser() {
  const i18n = createI18nInstance('en')
  return render(
    <I18nextProvider i18n={i18n}>
      <NavUser />
    </I18nextProvider>,
  )
}

describe('NavUser', () => {
  afterEach(() => {
    cleanup()
    mockUseUser.mockReset()
    mockMutate.mockReset()
  })

  it('renders a loading placeholder when user is null', () => {
    mockUseUser.mockReturnValue({ user: null })

    renderNavUser()

    expect(screen.getByTestId('nav-user-loading')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /sign out/i })).not.toBeInTheDocument()
  })

  it('renders the signed-in user and a sign-out button', () => {
    mockUseUser.mockReturnValue({
      user: { email: 'a@example.com', id: '1', name: 'A Person' },
    })

    renderNavUser()

    expect(screen.getByText('A Person')).toBeInTheDocument()
    expect(screen.getByText('a@example.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  it('calls signOut.mutate when the sign-out button is clicked', async () => {
    mockUseUser.mockReturnValue({
      user: { email: 'a@example.com', id: '1', name: 'A Person' },
    })

    renderNavUser()
    await userEvent.click(screen.getByRole('button', { name: /sign out/i }))

    expect(mockMutate).toHaveBeenCalledOnce()
  })
})
