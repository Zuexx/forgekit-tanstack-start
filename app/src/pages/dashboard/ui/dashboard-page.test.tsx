import { cleanup, render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { afterEach, describe, expect, it } from 'vitest'

import { createI18nInstance } from '#/shared/i18n'

import { DashboardPage } from './dashboard-page'

describe('DashboardPage', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders a translated welcome heading with the user name interpolated', () => {
    const i18n = createI18nInstance('en')
    render(
      <I18nextProvider i18n={i18n}>
        <DashboardPage user={{ name: 'A Person' }} />
      </I18nextProvider>,
    )

    expect(screen.getByRole('heading', { name: 'Welcome, A Person' })).toBeInTheDocument()
  })
})
