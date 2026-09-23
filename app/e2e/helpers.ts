import type { BrowserContext } from '@playwright/test'
import { test as base, expect } from '@playwright/test'

/**
 * Every spec file in this suite imports `test`/`expect` from here rather than
 * `@playwright/test` directly, so every test automatically fails on an uncaught client-side
 * error -- the exact symptom of the app-wide hydration bug that motivated this whole e2e
 * sub-project (a server-only module leaking into the client bundle threw during hydration,
 * silently breaking every onClick/onSubmit, invisible to every prior curl/jsdom-based check).
 * Without this, a regression of that class would only be caught if it happened to break some
 * other assertion downstream -- most of this suite's own assertions are on server-rendered
 * state (URLs, redirects) that a purely client-side hydration failure wouldn't touch.
 */
export const test = base.extend<{ failOnPageError: void }>({
  failOnPageError: [
    async ({ page }, use) => {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      await use()
      expect(errors, `Unexpected client-side error(s): ${errors.join('; ')}`).toEqual([])
    },
    { auto: true },
  ],
})
export { expect }

export interface TestUser {
  name: string
  email: string
  password: string
}

export function makeTestUser(prefix: string): TestUser {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return {
    name: `${prefix} Test User`,
    email: `${prefix}-${unique}@example.com`,
    password: `${prefix}-test-password-123`,
  }
}

/**
 * Signs up a fresh user via the real API and leaves `context` authenticated for it.
 * `context.request` shares its cookie jar with every page created from this same context, so
 * the sign-up response's Set-Cookie header is automatically sent on every subsequent
 * `page.goto()` made from a page in this context — no manual cookie parsing needed.
 */
export async function signUpViaApi(context: BrowserContext, user: TestUser): Promise<void> {
  const response = await context.request.post('/api/auth/sign-up/email', {
    data: user,
  })
  if (!response.ok()) {
    throw new Error(`Sign-up API call failed: ${response.status()} ${await response.text()}`)
  }
}
