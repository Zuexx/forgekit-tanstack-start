import { expect, test } from '@playwright/test'

import { record, shot, signedInAsFreshUser } from './evidence'

// Feature map: features/shell.md.
const F = 'shell'

test('theme-toggle: dark mode applies and survives a reload', async ({ page }) => {
  await page.goto('/sign-in')
  const toggle = page.getByRole('button', { name: /Switch theme/ })
  await expect(toggle).toHaveAccessibleName('Switch theme (current: light)')
  const background = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  const light = await background()
  await shot(page, F, '01-light')

  await toggle.click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect.poll(background).not.toBe(light)
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await shot(page, F, '02-dark-after-reload')
  record(F, '02-backgrounds', { light, dark: await background() })
})

test('shell-sidebar: the signed-in shell renders, highlights the route, and toggles', async ({
  page,
  context,
}) => {
  await signedInAsFreshUser(context, 'shell')

  await page.goto('/dashboard')
  const sidebar = page.getByTestId('app-sidebar')
  await expect(sidebar).toHaveAttribute('data-open', 'true')
  await expect(page.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
    'data-status',
    'active',
  )
  await shot(page, F, '03-sidebar-open')

  await page.getByRole('button', { name: 'Toggle sidebar' }).click()
  await expect(sidebar).toHaveAttribute('data-open', 'false')
  await shot(page, F, '04-sidebar-closed')
})
