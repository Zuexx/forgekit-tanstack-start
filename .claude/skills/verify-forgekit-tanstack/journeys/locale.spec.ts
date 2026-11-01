import { expect, test } from '@playwright/test'

import { record, shot, signedInAsFreshUser } from './evidence'

// Feature map: features/locale.md.
const F = 'locale'

test('locale-switch: the language menu switches to zh-TW and the URL follows', async ({ page }) => {
  await page.goto('/sign-in')
  const title = page.locator('[data-slot="card-title"]')
  await expect(title).toHaveText('Sign in')
  await shot(page, F, '01-sign-in-en')

  const toggle = page.getByRole('button', { name: 'Change language' })
  await toggle.click()
  await expect(toggle).toHaveAttribute('data-open', 'true')
  await shot(page, F, '02-language-menu-open')
  await page.getByRole('button', { name: '中', exact: true }).click()

  await expect(page).toHaveURL(/\/zh-TW\/sign-in$/)
  await expect(title).toHaveText('登入')
  await shot(page, F, '03-sign-in-zh-TW')
  record(F, '03-result', { url: page.url(), title: await title.textContent() })
})

test('locale-guard: the locale prefix survives the sign-in redirect', async ({ page }) => {
  await page.goto('/zh-TW/dashboard')
  await expect(page).toHaveURL(/\/zh-TW\/sign-in$/)
  await shot(page, F, '04-zh-TW-guard-redirect')
})

test('locale-unknown: an unsupported segment is not served as a page', async ({
  page,
  context,
}) => {
  // Signed in, so the route guard does not redirect first (features/locale.md, Gotchas).
  await signedInAsFreshUser(context, 'locale')

  await page.goto('/not-a-real-locale/dashboard')
  await expect(page.getByText('Not Found')).toBeVisible()
  await expect(page.getByRole('heading', { name: /Welcome,/ })).not.toBeVisible()
  await shot(page, F, '05-unknown-locale-not-found')
})
