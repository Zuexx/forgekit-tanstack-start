import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { cleanup, render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { afterEach, describe, expect, it } from 'vitest'

import { createI18nInstance } from '#/shared/i18n'

import { NavMain } from './nav-main'

function renderNavMainAt(path: string) {
  const i18n = createI18nInstance('en')
  const rootRoute = createRootRoute({
    component: () => (
      <I18nextProvider i18n={i18n}>
        <NavMain />
      </I18nextProvider>
    ),
  })
  const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/{-$locale}/dashboard',
    component: () => null,
  })
  const otherRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/{-$locale}/other',
    component: () => null,
  })
  const routeTree = rootRoute.addChildren([dashboardRoute, otherRoute])
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: [path] }),
    routeTree,
  })
  return render(<RouterProvider router={router} />)
}

describe('NavMain', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders a Dashboard link pointing at the dashboard route', async () => {
    renderNavMainAt('/dashboard')

    const link = await screen.findByRole('link', { name: /dashboard/i })
    expect(link).toHaveAttribute('href', '/dashboard')
  })

  it('marks the link active when the current route is the dashboard', async () => {
    renderNavMainAt('/dashboard')

    const link = await screen.findByRole('link', { name: /dashboard/i })
    expect(link).toHaveAttribute('data-status', 'active')
  })

  it('does not mark the link active on a different route', async () => {
    renderNavMainAt('/other')

    const link = await screen.findByRole('link', { name: /dashboard/i })
    expect(link).not.toHaveAttribute('data-status')
  })
})
