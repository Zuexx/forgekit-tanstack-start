// @vitest-environment node
//
// require-session.ts imports getRequestHeaders from '@tanstack/react-start/server' (a
// server-only API). Under the default jsdom environment, TanStack Start's import-protection
// Vite plugin classifies this file as client-reachable and substitutes its own auto-mock for
// that import before this file's vi.mock() below ever takes effect, silently returning empty
// headers no matter what — the "valid cookie" case then falsely redirects. Running this file
// under the plain 'node' environment sidesteps that client-vs-server classification, so this
// file's own vi.mock() is the only mock in play, matching the exact test expectations.
import { existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import type { auth as Auth } from './auth'

const TEST_DB_PATH = resolve(process.cwd(), '.require-session-test.db')
const TEST_TIMEOUT_MS = 15000

let auth: typeof Auth
let sessionCookie: string

vi.mock('@tanstack/react-start/server', () => ({
  getRequestHeaders: () => new Headers({ cookie: sessionCookie }),
}))

beforeAll(async () => {
  process.env.SQLITE_DATABASE_PATH = TEST_DB_PATH
  process.env.BETTER_AUTH_SECRET = 'test-secret-at-least-32-characters-long'
  process.env.BETTER_AUTH_URL = 'http://localhost:3000'
  process.env.Database__Provider = 'Sqlite'
  vi.resetModules()

  ;({ auth } = await import('./auth'))

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

describe('requireSession', () => {
  it('returns the session for a valid cookie', async () => {
    const { requireSession } = await import('./require-session')

    const result = await requireSession()

    expect(result.user.email).toBe('require-session-test@example.com')
  })

  it('redirects when there is no cookie', async () => {
    const validCookie = sessionCookie
    sessionCookie = ''

    const { requireSession } = await import('./require-session')

    await expect(requireSession()).rejects.toMatchObject({
      options: { to: '/sign-in' },
    })

    sessionCookie = validCookie
  })
})
