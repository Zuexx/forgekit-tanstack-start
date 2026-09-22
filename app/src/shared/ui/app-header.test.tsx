import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { createI18nInstance } from '#/shared/i18n'

import { AppHeader } from './app-header'

const { mockUseUI, mockToggleSidebar } = vi.hoisted(() => ({
  mockToggleSidebar: vi.fn(),
  mockUseUI: vi.fn(),
}))

vi.mock('#/shared/state', () => ({
  useUI: mockUseUI,
}))

vi.mock('./locale-switcher', () => ({
  LocaleSwitcher: () => <div data-testid="locale-switcher" />,
}))

function renderAppHeader() {
  const i18n = createI18nInstance('en')
  return render(
    <I18nextProvider i18n={i18n}>
      <AppHeader />
    </I18nextProvider>,
  )
}

describe('AppHeader', () => {
  afterEach(() => {
    cleanup()
    mockUseUI.mockReset()
    mockToggleSidebar.mockReset()
  })

  it('renders the page title and the LocaleSwitcher', () => {
    mockUseUI.mockReturnValue({ toggleSidebar: mockToggleSidebar })

    renderAppHeader()

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByTestId('locale-switcher')).toBeInTheDocument()
  })

  it('calls toggleSidebar when the toggle button is clicked', async () => {
    mockUseUI.mockReturnValue({ toggleSidebar: mockToggleSidebar })

    renderAppHeader()
    await userEvent.click(screen.getByRole('button', { name: /toggle sidebar/i }))

    expect(mockToggleSidebar).toHaveBeenCalledOnce()
  })
})
