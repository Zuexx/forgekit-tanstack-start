import { expect, test } from './helpers'

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

    // This measures the class's final state once the page settles, not paint timing, so it
    // can't literally prove there was no flash. It's still a meaningful proxy: nothing in
    // ThemeSwitcher re-applies the class on mount (only on click), so the only thing able to
    // set it this early is the synchronous, blocking flash-prevention <script> in
    // root-document.tsx's <head>. If that script broke, this assertion would fail for real.
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test.describe('for a fresh visitor whose OS prefers dark mode', () => {
    // Scopes colorScheme to just this test via a context Playwright creates and tears down
    // itself, rather than manually managing (and risking leaking, if an assertion above threw)
    // a browser context via browser.newContext().
    test.use({ colorScheme: 'dark' })

    test('prefers-color-scheme sets the first-visit default', async ({ page }) => {
      await page.goto('/sign-in')

      await expect(page.locator('html')).toHaveClass(/dark/)
      await expect(page.getByRole('button', { name: /Switch theme/ })).toHaveAccessibleName(
        'Switch theme (current: dark)',
      )
    })
  })
})
