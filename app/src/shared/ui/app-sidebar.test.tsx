import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AppSidebar } from './app-sidebar'

const { mockUseUI, mockToggleSidebar, mockUseIsMobile } = vi.hoisted(() => ({
  mockToggleSidebar: vi.fn(),
  mockUseIsMobile: vi.fn(),
  mockUseUI: vi.fn(),
}))

vi.mock('#/shared/state', () => ({
  useUI: mockUseUI,
}))

vi.mock('#/shared/lib/use-is-mobile', () => ({
  useIsMobile: mockUseIsMobile,
}))

vi.mock('./nav-main', () => ({
  NavMain: () => <div data-testid="nav-main" />,
}))

vi.mock('./nav-user', () => ({
  NavUser: () => <div data-testid="nav-user" />,
}))

describe('AppSidebar', () => {
  afterEach(() => {
    cleanup()
    mockUseUI.mockReset()
    mockToggleSidebar.mockReset()
    mockUseIsMobile.mockReset()
  })

  it('renders NavMain and NavUser', () => {
    mockUseUI.mockReturnValue({ sidebarOpen: true, toggleSidebar: mockToggleSidebar })
    mockUseIsMobile.mockReturnValue(false)

    render(<AppSidebar onSignOut={vi.fn()} />)

    expect(screen.getByTestId('nav-main')).toBeInTheDocument()
    expect(screen.getByTestId('nav-user')).toBeInTheDocument()
  })

  it('reflects sidebarOpen via data-open', () => {
    mockUseUI.mockReturnValue({ sidebarOpen: false, toggleSidebar: mockToggleSidebar })
    mockUseIsMobile.mockReturnValue(false)

    render(<AppSidebar onSignOut={vi.fn()} />)

    expect(screen.getByTestId('app-sidebar')).toHaveAttribute('data-open', 'false')
  })

  it('renders a backdrop on mobile when open, and clicking it toggles the sidebar closed', async () => {
    mockUseUI.mockReturnValue({ sidebarOpen: true, toggleSidebar: mockToggleSidebar })
    mockUseIsMobile.mockReturnValue(true)

    render(<AppSidebar onSignOut={vi.fn()} />)
    await userEvent.click(screen.getByTestId('app-sidebar-backdrop'))

    expect(mockToggleSidebar).toHaveBeenCalledOnce()
  })

  it('renders no backdrop on desktop', () => {
    mockUseUI.mockReturnValue({ sidebarOpen: true, toggleSidebar: mockToggleSidebar })
    mockUseIsMobile.mockReturnValue(false)

    render(<AppSidebar onSignOut={vi.fn()} />)

    expect(screen.queryByTestId('app-sidebar-backdrop')).not.toBeInTheDocument()
  })
})
