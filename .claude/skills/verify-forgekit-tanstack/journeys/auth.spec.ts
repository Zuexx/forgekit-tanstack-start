import { randomBytes } from 'node:crypto'

import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import { record, shot } from './evidence'

// Feature map: features/auth.md. The email is written to evidence so the database row can
// be checked afterwards with `vf.sh sql`.
const F = 'auth'
const PASSWORD = randomBytes(16).toString('base64url')
const email = `verify-${Date.now()}@test.local`

const getSession = () => fetch('/api/auth/get-session').then((r) => r.json())

async function signIn(page: Page, password: string) {
  await page.goto('/sign-in')
  await page.locator('#email').fill(email)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: 'Login', exact: true }).click()
}

test.describe.configure({ mode: 'serial' })

test('auth-guard: an anonymous visitor is sent to sign-in', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/sign-in$/)
  await shot(page, F, '01-guard-redirected-to-sign-in')
})

test('auth-sign-up: a visitor creates an account and lands on the dashboard', async ({ page }) => {
  await page.goto('/sign-up')
  await page.locator('#name').fill('Verify User')
  await page.locator('#email').fill(email)
  await page.locator('#password').fill(PASSWORD)
  await page.locator('#confirmPassword').fill(PASSWORD)
  await shot(page, F, '02-sign-up-filled')
  await page.getByRole('button', { name: 'Create Account' }).click()

  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole('heading', { name: /Welcome,/ })).toBeVisible()
  await shot(page, F, '03-dashboard-after-sign-up')

  const session = await page.evaluate(getSession)
  record(F, '03-session', { email, url: page.url(), session })
  expect(session?.user?.email).toBe(email)
})

test('auth-signed-in-guard: a signed-in visitor on sign-in goes to the dashboard', async ({
  page,
}) => {
  await signIn(page, PASSWORD)
  await expect(page).toHaveURL(/\/dashboard$/)
  await page.goto('/sign-in')
  await expect(page).toHaveURL(/\/dashboard$/)
  await shot(page, F, '04-sign-in-redirected-to-dashboard')
})

test('auth-sign-in: the account signs in again and survives a reload', async ({ page }) => {
  await signIn(page, PASSWORD)
  await expect(page).toHaveURL(/\/dashboard$/)
  await page.reload()
  await expect(page.getByRole('heading', { name: /Welcome,/ })).toBeVisible()
  const session = await page.evaluate(getSession)
  record(F, '05-session-after-reload', { url: page.url(), session })
  await shot(page, F, '05-signed-in-after-reload')
  expect(session?.user?.email).toBe(email)
})

test('auth-sign-out: signing out from the user menu ends the session', async ({ page }) => {
  await signIn(page, PASSWORD)
  await expect(page).toHaveURL(/\/dashboard$/)
  await page.getByRole('button', { name: 'User menu' }).click()
  await shot(page, F, '06-user-menu-open')
  await page.getByRole('menuitem', { name: 'Sign out' }).click()
  await expect(page).toHaveURL(/\/$/)
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/sign-in$/)
  await shot(page, F, '06-after-sign-out')
  expect((await page.evaluate(getSession))?.user).toBeFalsy()
})

test('auth-sign-in-wrong-password: a wrong password is refused', async ({ page }) => {
  await signIn(page, randomBytes(16).toString('base64url'))
  // The refusal is a toast. The toaster wrapper is always in the DOM, so assert it has text;
  // the URL alone would also pass if the submit never fired.
  await expect(page.locator('[data-rht-toaster]')).not.toHaveText('')
  await expect(page).toHaveURL(/\/sign-in$/)
  await shot(page, F, '07-wrong-password')
  expect((await page.evaluate(getSession))?.user).toBeFalsy()
})
