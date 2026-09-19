// @vitest-environment node
//
// require-session.ts imports getRequestHeaders/createServerFn from '@tanstack/react-start' —
// server-only APIs. Under the default jsdom environment, TanStack Start's import-protection
// Vite plugin classifies this file as client-reachable and intercepts those imports. Running
// this file under the plain 'node' environment sidesteps that classification. The test only
// exercises getSessionForHeaders(), the plain-function core — requireSession() itself wraps a
// createServerFn, which throws "No Start context found in AsyncLocalStorage" when invoked
// directly outside TanStack Start's real request runtime, so it has no test of its own (same
// accepted pattern as shared/api/abac/resolve-context.ts).
import { existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import type { auth as Auth } from './auth'
import type { getSessionForHeaders as GetSessionForHeaders } from './require-session'

const TEST_DB_PATH = resolve(process.cwd(), '.require-session-test.db')
const TEST_TIMEOUT_MS = 15000

let auth: typeof Auth
let getSessionForHeaders: typeof GetSessionForHeaders
let sessionCookie: string

beforeAll(async () => {
  process.env.SQLITE_DATABASE_PATH = TEST_DB_PATH
  process.env.BETTER_AUTH_SECRET = 'test-secret-at-least-32-characters-long'
  process.env.BETTER_AUTH_URL = 'http://localhost:3000'
  process.env.Database__Provider = 'Sqlite'
  vi.resetModules()

  ;({ auth } = await import('./auth'))
  ;({ getSessionForHeaders } = await import('./require-session'))

  const { getMigrations } = await import('better-auth/db/migration')
  const { runMigrations } = await getMigrations(auth.options)
  await runMigrations()

  const signUpResponse = await auth.handler(
    new Request('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'require-session-test@example.com',
        password: 'require-session-test-password-123',
        name: 'Require Session Test',
      }),
    }),
  )
  sessionCookie = signUpResponse.headers.get('set-cookie')!.split(';')[0]
}, TEST_TIMEOUT_MS)

afterAll(() => {
  delete process.env.SQLITE_DATABASE_PATH
  delete process.env.BETTER_AUTH_SECRET
  delete process.env.BETTER_AUTH_URL
  delete process.env.Database__Provider
  if (existsSync(TEST_DB_PATH)) rmSync(TEST_DB_PATH)
  if (existsSync(`${TEST_DB_PATH}-wal`)) rmSync(`${TEST_DB_PATH}-wal`)
  if (existsSync(`${TEST_DB_PATH}-shm`)) rmSync(`${TEST_DB_PATH}-shm`)
})

describe('getSessionForHeaders', () => {
  it('resolves the real session for a valid cookie', async () => {
    const session = await getSessionForHeaders(new Headers({ cookie: sessionCookie }))

    expect(session?.user.email).toBe('require-session-test@example.com')
  })

  it('resolves to null when there is no cookie', async () => {
    const session = await getSessionForHeaders(new Headers())

    expect(session).toBeNull()
  })
})
