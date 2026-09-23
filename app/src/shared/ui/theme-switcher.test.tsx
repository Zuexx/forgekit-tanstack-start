import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ThemeSwitcher } from './theme-switcher'

const { mockSetTheme } = vi.hoisted(() => ({
  mockSetTheme: vi.fn(),
}))

vi.mock('#/shared/state', () => ({
  useUI: () => ({ setTheme: mockSetTheme }),
}))

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    addEventListener: vi.fn(),
    matches,
    media: query,
    removeEventListener: vi.fn(),
  }))
}

describe('ThemeSwitcher', () => {
  afterEach(() => {
    cleanup()
    mockSetTheme.mockReset()
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('renders reflecting a stored light theme', () => {
    window.localStorage.setItem('forgekit-tanstack-start.theme', 'light')
    mockMatchMedia(false)

    render(<ThemeSwitcher />)

    expect(screen.getByRole('button', { name: /current: light/i })).toBeInTheDocument()
  })

  it('renders reflecting a stored dark theme', () => {
    window.localStorage.setItem('forgekit-tanstack-start.theme', 'dark')
    mockMatchMedia(false)

    render(<ThemeSwitcher />)

    expect(screen.getByRole('button', { name: /current: dark/i })).toBeInTheDocument()
  })

  it('falls back to system preference when nothing is stored', () => {
    mockMatchMedia(true)

    render(<ThemeSwitcher />)

    expect(screen.getByRole('button', { name: /current: dark/i })).toBeInTheDocument()
  })

  it('toggles the DOM class, localStorage, and zustand setTheme on click', async () => {
    window.localStorage.setItem('forgekit-tanstack-start.theme', 'light')
    mockMatchMedia(false)

    render(<ThemeSwitcher />)
    await userEvent.click(screen.getByRole('button', { name: /current: light/i }))

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(window.localStorage.getItem('forgekit-tanstack-start.theme')).toBe('dark')
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })
})
