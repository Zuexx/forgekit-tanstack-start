import { expect, test } from '@playwright/test'

import { makeTestUser, signUpViaApi } from './helpers'

test.describe('auth flow', () => {
  test('signing up through the real form writes a session cookie and reaches the dashboard', async ({
    page,
  }) => {
    const user = makeTestUser('signup-form')

    await page.goto('/sign-up')
    await page.locator('#name').fill(user.name)
    await page.locator('#email').fill(user.email)
    await page.locator('#password').fill(user.password)
    await page.locator('#confirmPassword').fill(user.password)
    await page.getByRole('button', { name: 'Create Account' }).click()

    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.getByRole('heading', { name: /Welcome,/ })).toBeVisible()

    const cookies = await page.context().cookies()
    const sessionCookie = cookies.find((cookie) => cookie.name.includes('session_token'))
    expect(sessionCookie).toBeDefined()
  })

  test('/api/auth/$ genuinely routes a request through TanStack Start', async ({ context }) => {
    const user = makeTestUser('api-route')
    const response = await context.request.post('/api/auth/sign-up/email', { data: user })

    expect(response.ok()).toBe(true)
    const body = await response.json()
    expect(body.user.email).toBe(user.email)
  })

  test('signing in with valid credentials reaches the dashboard', async ({ page, context }) => {
    const user = makeTestUser('signin-valid')
    await signUpViaApi(context, user)
    await context.clearCookies()

    await page.goto('/sign-in')
    await page.locator('#email').fill(user.email)
    await page.locator('#password').fill(user.password)
    await page.getByRole('button', { name: 'Login', exact: true }).click()

    await expect(page).toHaveURL(/\/dashboard$/)
  })

  test('signing in with an invalid password stays on sign-in and shows an error', async ({
    page,
    context,
  }) => {
    const user = makeTestUser('signin-invalid')
    await signUpViaApi(context, user)
    await context.clearCookies()

    await page.goto('/sign-in')
    await page.locator('#email').fill(user.email)
    await page.locator('#password').fill('wrong-password-entirely')
    await page.getByRole('button', { name: 'Login', exact: true }).click()

    await expect(page).toHaveURL(/\/sign-in$/)
    // react-hot-toast's <Toaster/> wrapper is always present in the DOM, even with zero
    // toasts (confirmed against this app's real rendered HTML) — asserting the wrapper is
    // merely visible would pass trivially with no error toast at all. Asserting its text
    // content is non-empty only passes once an actual toast has rendered inside it.
    await expect(page.locator('[data-rht-toaster]')).not.toHaveText('')
  })

  test('signing out clears the session and returns to the home page', async ({ page, context }) => {
    const user = makeTestUser('signout')
    await signUpViaApi(context, user)

    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: /Welcome,/ })).toBeVisible()

    await page.getByRole('button', { name: 'Sign out' }).click()
    await expect(page).toHaveURL(/\/$/)

    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/sign-in$/)
  })
})
