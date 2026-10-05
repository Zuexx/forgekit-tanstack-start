import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { createI18nInstance } from '#/shared/i18n'

import { NavUser } from './nav-user'

const { mockUseUser } = vi.hoisted(() => ({
  mockUseUser: vi.fn(),
}))

vi.mock('#/shared/state', () => ({
  useUser: mockUseUser,
}))

function renderNavUser(onSignOut: () => void) {
  const i18n = createI18nInstance('en')
  return render(
    <I18nextProvider i18n={i18n}>
      <NavUser onSignOut={onSignOut} />
    </I18nextProvider>,
  )
}

describe('NavUser', () => {
  afterEach(() => {
    cleanup()
    mockUseUser.mockReset()
  })

  it('renders a loading placeholder when user is null', () => {
    mockUseUser.mockReturnValue({ user: null })

    renderNavUser(vi.fn())

    expect(screen.getByTestId('nav-user-loading')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /sign out/i })).not.toBeInTheDocument()
  })

  it('renders the signed-in user as the dropdown trigger', () => {
    mockUseUser.mockReturnValue({
      user: { email: 'a@example.com', id: '1', name: 'A Person' },
    })

    renderNavUser(vi.fn())

    expect(screen.getByRole('button', { name: /user menu/i })).toBeInTheDocument()
    expect(screen.getAllByText('A Person')[0]).toBeInTheDocument()
    expect(screen.getAllByText('a@example.com')[0]).toBeInTheDocument()
  })

  it('calls onSignOut when the sign-out menu item is clicked', async () => {
    mockUseUser.mockReturnValue({
      user: { email: 'a@example.com', id: '1', name: 'A Person' },
    })
    const onSignOut = vi.fn()

    renderNavUser(onSignOut)
    await userEvent.click(screen.getByRole('button', { name: /user menu/i }))
    await userEvent.click(await screen.findByRole('menuitem', { name: /sign out/i }))

    expect(onSignOut).toHaveBeenCalledOnce()
  })
})
