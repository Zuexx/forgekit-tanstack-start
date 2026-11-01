import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import type { BrowserContext, Page } from '@playwright/test'
import { expect } from '@playwright/test'

/** Writes a named artifact under $VF_EVIDENCE/<feature>/ and returns its path. */
function target(feature: string, name: string) {
  const dir = join(process.env.VF_EVIDENCE!, feature)
  mkdirSync(dir, { recursive: true })
  return join(dir, name)
}

export async function shot(page: Page, feature: string, name: string) {
  await page.screenshot({ path: target(feature, `${name}.png`), fullPage: true })
}

export function record(feature: string, name: string, data: unknown) {
  writeFileSync(target(feature, `${name}.json`), JSON.stringify(data, null, 2))
}

/**
 * A precondition, not proof: leaves `context` signed in as a fresh user so a journey can start
 * past the route guard. Pages created from `context` share its cookie jar.
 */
export async function signedInAsFreshUser(context: BrowserContext, prefix: string) {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const user = {
    name: `${prefix} Verify`,
    email: `verify-${prefix}-${unique}@test.local`,
    password: `verify-${prefix}-${unique}`,
  }
  const response = await context.request.post('/api/auth/sign-up/email', { data: user })
  expect(response.ok(), await response.text()).toBe(true)
  return user
}
