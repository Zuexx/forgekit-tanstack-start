import { defineConfig } from '@playwright/test'
import { resolve } from 'node:path'

const DB_PATH = resolve(import.meta.dirname, '.e2e-test.db')

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // 'list' for a live terminal view; 'html' alone would open (and block on) its report server
  // whenever a local `pnpm verify` run has a failure, rather than just writing the report to
  // disk -- open: 'never' keeps the report file (used by CI's upload-artifact step) without
  // that hang.
  reporter: [['list'], ['html', { open: 'never' }]],
  // Every worker here shares one preview-server process and one SQLite file, both stood up
  // once by webServer below, so concurrency in this suite is contention on shared server-side
  // resources, not just a speed knob. Two rounds of real flakiness confirmed this the hard way:
  // same-file test races (concurrent scrypt password hashing during sign-up) first, fixed by
  // dropping fullyParallel; then, once a third spec file doing real sign-ups landed, the same
  // contention reappeared across *different* files running concurrently in separate workers --
  // confirmed via repeated fresh-cold-start runs (intermittent failures only when multiple spec
  // files ran concurrently, never against an already-warm server or run serially). workers: 1
  // removes the remaining concurrency entirely, matching forgekit's own e2e config's reasoning
  // (a single worker there too, for its own resource-contention reason: a shared database rather
  // than a shared auth-hashing server, but the same lever). Known, accepted gap this leaves: no
  // test in this suite can exercise genuinely concurrent overlapping requests, so a regression of
  // the app's documented per-request-scoped i18n instance (see the singleton-leak note near its
  // definition) would not be caught here -- would need a test that fires simultaneous requests in
  // two locales from separate workers or contexts, deliberately reintroducing concurrency in one
  // narrow, controlled place. Not yet written; parked as a follow-up.
  workers: 1,
  // The very first request(s) to a freshly-built preview server are measurably slower than
  // steady-state, so a generous per-assertion timeout avoids cold-start flakiness even with
  // workers: 1 above.
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
