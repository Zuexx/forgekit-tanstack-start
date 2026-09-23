import { expect, test } from '@playwright/test'

import { makeTestUser, signUpViaApi } from './helpers'

test.describe('locale routing', () => {
  test('the locale prefix survives the ABAC redirect chain', async ({ page }) => {
    await page.goto('/zh-TW/dashboard')

    await expect(page).toHaveURL(/\/zh-TW\/sign-in$/)
  })

  test('switching locale via the LocaleSwitcher changes rendered text and the URL', async ({
    page,
  }) => {
    await page.goto('/sign-in')
    const cardTitle = page.locator('[data-slot="card-title"]')
    await expect(cardTitle).toHaveText('Sign in')

    const toggle = page.getByRole('button', { name: 'Change language' })
    await toggle.click()
    await expect(toggle).toHaveAttribute('data-open', 'true')

    await page.getByRole('button', { name: '中', exact: true }).click()

    await expect(page).toHaveURL(/\/zh-TW\/sign-in$/)
    await expect(cardTitle).toHaveText('登入')
  })

  test('an unsupported locale segment does not leak the real page to an authenticated visitor', async ({
    page,
    context,
  }) => {
    const user = makeTestUser('locale-bad-segment')
    await signUpViaApi(context, user)

    await page.goto('/not-a-real-locale/dashboard')

    await expect(page.getByText('Not Found')).toBeVisible()
    await expect(page.getByRole('heading', { name: /Welcome,/ })).not.toBeVisible()
  })
})
