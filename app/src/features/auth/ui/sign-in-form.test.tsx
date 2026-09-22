import type * as ReactRouter from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { authClient } from '#/shared/api'
import { createI18nInstance } from '#/shared/i18n'

import { SignInForm } from './sign-in-form'

vi.mock('#/shared/api', () => ({
  authClient: { signIn: { email: vi.fn(), social: vi.fn() } },
}))
vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))
vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof ReactRouter>()
  return { ...actual, useRouter: () => ({ navigate: vi.fn() }) }
})

function renderWithQuery() {
  const queryClient = new QueryClient()
  const i18n = createI18nInstance('en')
  return render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <SignInForm />
      </I18nextProvider>
    </QueryClientProvider>,
  )
}

describe('SignInForm', () => {
  beforeEach(() => {
    vi.mocked(authClient.signIn.email).mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  it('calls signIn.email with the parsed values on valid submission', async () => {
    vi.mocked(authClient.signIn.email).mockResolvedValue({
      data: { user: { id: '1' } },
      error: null,
    })

    renderWithQuery()
    await userEvent.type(screen.getByLabelText(/email/i), 'a@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'abcd1234')
    await userEvent.click(screen.getByRole('button', { name: /^login$/i }))

    await waitFor(() =>
      expect(authClient.signIn.email).toHaveBeenCalledWith({
        email: 'a@example.com',
        password: 'abcd1234',
      }),
    )
  })

  it('shows a validation error and does not submit when the email is invalid', async () => {
    renderWithQuery()
    await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email')
    await userEvent.type(screen.getByLabelText(/password/i), 'abcd1234')
    await userEvent.click(screen.getByRole('button', { name: /^login$/i }))

    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument()
    expect(authClient.signIn.email).not.toHaveBeenCalled()
  })
})
