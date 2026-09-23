import { defineConfig } from '@playwright/test'
import { resolve } from 'node:path'

const DB_PATH = resolve(import.meta.dirname, '.e2e-test.db')

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  // An earlier fix round already found that same-file test races cause real server-side
  // contention (concurrent scrypt password hashing) and removed fullyParallel to fix it. Once a
  // second spec file exercising real sign-ups landed, the same contention reappeared across
  // *different* files running in separate workers against the one shared preview-server process
  // -- confirmed by repeated fresh-cold-start runs (intermittent failures only when multiple
  // spec files ran concurrently, never when re-run against an already-warm server or serially).
  // workers: 1 removes the remaining concurrency entirely, matching forgekit's own e2e config's
  // reasoning (it uses a single worker too, for its own resource-contention reason: a shared
  // database rather than a shared auth-hashing server, but the fix is the same lever).
  workers: 1,
  // Kept as a smaller, independent hardening on top of full serialization: the very first
  // request(s) to a freshly-built preview server are measurably slower than steady-state, so a
  // generous per-assertion timeout avoids new cold-start flakiness even with workers: 1.
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { channel: 'chromium' } }],
  webServer: {
    command: 'pnpm exec tsx e2e/migrate-test-db.ts && pnpm build && pnpm preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      SQLITE_DATABASE_PATH: DB_PATH,
      BETTER_AUTH_SECRET: 'e2e-test-secret-at-least-32-characters-long',
      BETTER_AUTH_URL: 'http://localhost:4173',
      Database__Provider: 'Sqlite',
      E2E_TEST: 'true',
    },
  },
})
