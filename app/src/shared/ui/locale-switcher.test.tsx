import type * as ReactRouter from '@tanstack/react-router'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { LocaleSwitcher } from './locale-switcher'

const navigate = vi.fn()

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof ReactRouter>()
  return { ...actual, useRouter: () => ({ navigate }) }
})

afterEach(() => {
  cleanup()
  navigate.mockReset()
  document.cookie = 'forgekit-tanstack-start.locale=; expires=Thu, 01 Jan 1970 00:00:00 UTC'
})

describe('LocaleSwitcher', () => {
  it('renders one item per supported locale', async () => {
    render(<LocaleSwitcher />)
    await userEvent.click(screen.getByRole('button', { name: 'Change language' }))

    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '中' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '한' })).toBeInTheDocument()
  })

  it('navigates to the same path with the new locale prefix on click', async () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/sign-in' },
      writable: true,
    })

    render(<LocaleSwitcher />)
    await userEvent.click(screen.getByRole('button', { name: 'Change language' }))
    await userEvent.click(screen.getByRole('button', { name: '中' }))

    expect(navigate).toHaveBeenCalledWith({ to: '/zh-TW/sign-in' })
  })

  it('writes the locale cookie on switch', async () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/sign-in' },
      writable: true,
    })

    render(<LocaleSwitcher />)
    await userEvent.click(screen.getByRole('button', { name: 'Change language' }))
    await userEvent.click(screen.getByRole('button', { name: '한' }))

    expect(document.cookie).toContain('forgekit-tanstack-start.locale=ko-KR')
  })
})
