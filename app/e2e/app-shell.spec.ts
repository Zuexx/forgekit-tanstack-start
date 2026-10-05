import { expect, makeTestUser, signUpViaApi, test } from './helpers'

test.describe('authenticated app shell', () => {
  test.beforeEach(async ({ context }) => {
    await signUpViaApi(context, makeTestUser('app-shell'))
  })

  test('the sidebar renders and toggles', async ({ page }) => {
    await page.goto('/dashboard')

    const sidebar = page.getByTestId('app-sidebar')
    await expect(sidebar).toHaveAttribute('data-open', 'true')

    await page.getByRole('button', { name: 'Toggle sidebar' }).click()
    await expect(sidebar).toHaveAttribute('data-open', 'false')

    await page.getByRole('button', { name: 'Toggle sidebar' }).click()
    await expect(sidebar).toHaveAttribute('data-open', 'true')
  })

  test('the nav highlights the current route', async ({ page }) => {
    await page.goto('/dashboard')

    const dashboardLink = page.getByRole('link', { name: 'Dashboard' })
    await expect(dashboardLink).toHaveAttribute('data-status', 'active')
  })

  test('signing out from the shell actually signs out', async ({ page }) => {
    await page.goto('/dashboard')

    await page.getByRole('button', { name: 'User menu' }).click()
    await page.getByRole('menuitem', { name: 'Sign out' }).click()

    await expect(page).toHaveURL(/\/$/)
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/sign-in$/)
  })
})
