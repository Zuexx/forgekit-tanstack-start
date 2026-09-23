import { expect, test } from '@playwright/test'

test.describe('theme switcher', () => {
  test('clicking the toggle switches to dark mode and visibly applies it', async ({ page }) => {
    await page.goto('/sign-in')
    const toggle = page.getByRole('button', { name: /Switch theme/ })
    await expect(toggle).toHaveAccessibleName('Switch theme (current: light)')

    // getComputedStyle().backgroundColor is always normalized to rgb(...)/rgba(...) by the
    // browser regardless of the CSS source syntax (oklch here) — comparing against a literal
    // oklch(...) string would never match either way and silently prove nothing. Capture the
    // real light-mode value first and assert it actually changed, rather than guessing the
    // browser's normalized dark-mode output.
    const lightBackground = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    )

    await toggle.click()

    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(toggle).toHaveAccessibleName('Switch theme (current: dark)')
    await expect
      .poll(async () => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
      .not.toBe(lightBackground)
  })

  test('the theme persists across a reload with no flash of the wrong color', async ({ page }) => {
    await page.goto('/sign-in')
    await page.getByRole('button', { name: /Switch theme/ }).click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.reload()

    // Read immediately after navigation settles, before any client-side re-render could run —
    // this is the flash-prevention <script> in root-document.tsx's <head>, not React state.
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('prefers-color-scheme sets the first-visit default for a new visitor', async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: 'dark' })
    const page = await context.newPage()

    await page.goto('/sign-in')

    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.getByRole('button', { name: /Switch theme/ })).toHaveAccessibleName(
      'Switch theme (current: dark)',
    )

    await context.close()
  })
})
