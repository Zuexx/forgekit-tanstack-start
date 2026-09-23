import type { BrowserContext } from '@playwright/test'

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
