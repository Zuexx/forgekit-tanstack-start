import { expect, makeTestUser, signUpViaApi, test } from './helpers'

test.describe('ABAC route guard', () => {
  test('an unauthenticated visit to a protected route redirects to sign-in', async ({ page }) => {
    await page.goto('/dashboard')

    await expect(page).toHaveURL(/\/sign-in$/)
  })

  test('an authenticated visit to sign-in redirects to the dashboard', async ({ page, context }) => {
    const user = makeTestUser('abac-authed')
    await signUpViaApi(context, user)

    await page.goto('/sign-in')

    await expect(page).toHaveURL(/\/dashboard$/)
  })

  test('an authenticated visit to sign-up also redirects to the dashboard', async ({
    page,
    context,
  }) => {
    const user = makeTestUser('abac-authed-signup')
    await signUpViaApi(context, user)

    await page.goto('/sign-up')

    await expect(page).toHaveURL(/\/dashboard$/)
  })

  test('an unauthenticated visit to the public home page renders normally', async ({ page }) => {
    await page.goto('/')

    // A negative URL check alone would also pass on a 500 error page or a blank one -- assert
    // the real page heading actually rendered.
    await expect(page).not.toHaveURL(/\/sign-in$/)
    await expect(page.getByRole('heading', { name: 'Welcome to TanStack Start' })).toBeVisible()
  })
})
