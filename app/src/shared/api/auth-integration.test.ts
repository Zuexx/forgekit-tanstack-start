import { existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

const TEST_DB_PATH = resolve(
  process.cwd(),
  '.auth-integration-test.db',
)

beforeAll(() => {
  process.env.SQLITE_DATABASE_PATH = TEST_DB_PATH
  process.env.BETTER_AUTH_SECRET = 'test-secret-at-least-32-characters-long'
  process.env.BETTER_AUTH_URL = 'http://localhost:3000'
  vi.resetModules()
})

afterAll(() => {
  delete process.env.SQLITE_DATABASE_PATH
  delete process.env.BETTER_AUTH_SECRET
  delete process.env.BETTER_AUTH_URL
  if (existsSync(TEST_DB_PATH)) rmSync(TEST_DB_PATH)
  if (existsSync(`${TEST_DB_PATH}-wal`)) rmSync(`${TEST_DB_PATH}-wal`)
  if (existsSync(`${TEST_DB_PATH}-shm`)) rmSync(`${TEST_DB_PATH}-shm`)
})

describe('auth.handler() against a real SQLite database', () => {
  it('signs up, sets a session cookie, and the cookie resolves back to the same user', async () => {
    const { auth } = await import('./auth')

    // Better Auth's own migration path (its Kysely adapter creates tables from the plugin
    // set on first use in dev, but a fresh DB file needs the CLI's migration applied first
    // in a test context where nothing else has touched this file yet). getMigrations lives
    // at the dedicated better-auth/db/migration subpath, not the general better-auth/db one
    // — confirmed by reading the published package's own exports map before this plan was
    // dispatched, not assumed.
    const { getMigrations } = await import('better-auth/db/migration')
    const { runMigrations } = await getMigrations(auth.options)
    await runMigrations()

    const signUpResponse = await auth.handler(
      new Request('http://localhost:3000/api/auth/sign-up/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'integration-test@example.com',
          password: 'integration-test-password-123',
          name: 'Integration Test',
        }),
      }),
    )

    expect(signUpResponse.status).toBe(200)
    const setCookieHeader = signUpResponse.headers.get('set-cookie')
    expect(setCookieHeader).toBeTruthy()

    const sessionCookie = setCookieHeader!.split(';')[0]

    const getSessionResponse = await auth.handler(
      new Request('http://localhost:3000/api/auth/get-session', {
        headers: { cookie: sessionCookie },
      }),
    )

    expect(getSessionResponse.status).toBe(200)
    const sessionBody = await getSessionResponse.json()
    expect(sessionBody.user.email).toBe('integration-test@example.com')
  })

  it('signs in with the same credentials and receives a fresh session', async () => {
    const { auth } = await import('./auth')

    const signInResponse = await auth.handler(
      new Request('http://localhost:3000/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'integration-test@example.com',
          password: 'integration-test-password-123',
        }),
      }),
    )

    expect(signInResponse.status).toBe(200)
    expect(signInResponse.headers.get('set-cookie')).toBeTruthy()
    const body = await signInResponse.json()
    expect(body.user.email).toBe('integration-test@example.com')
  })
})
