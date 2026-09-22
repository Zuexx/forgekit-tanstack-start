import type * as ReactRouter from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { authClient } from '#/shared/api'
import { createI18nInstance } from '#/shared/i18n'

import { SignUpForm } from './sign-up-form'

vi.mock('#/shared/api', () => ({
  authClient: { signUp: { email: vi.fn() } },
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
        <SignUpForm />
      </I18nextProvider>
    </QueryClientProvider>,
  )
}

describe('SignUpForm', () => {
  beforeEach(() => {
    vi.mocked(authClient.signUp.email).mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  it('calls signUp.email with the parsed values on valid submission', async () => {
    vi.mocked(authClient.signUp.email).mockResolvedValue({
      data: { user: { id: '1' } },
      error: null,
    })

    renderWithQuery()
    await userEvent.type(screen.getByLabelText(/name/i), 'A Person')
    await userEvent.type(screen.getByLabelText(/email/i), 'a@example.com')
    await userEvent.type(screen.getByLabelText(/^password/i), 'abcd1234')
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'abcd1234')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() =>
      expect(authClient.signUp.email).toHaveBeenCalledWith({
        name: 'A Person',
        email: 'a@example.com',
        password: 'abcd1234',
        confirmPassword: 'abcd1234',
      }),
    )
  })

  it('shows a validation error and does not submit when passwords do not match', async () => {
    renderWithQuery()
    await userEvent.type(screen.getByLabelText(/name/i), 'A Person')
    await userEvent.type(screen.getByLabelText(/email/i), 'a@example.com')
    await userEvent.type(screen.getByLabelText(/^password/i), 'abcd1234')
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'different1')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText(/password not matched/i)).toBeInTheDocument()
    expect(authClient.signUp.email).not.toHaveBeenCalled()
  })
})
