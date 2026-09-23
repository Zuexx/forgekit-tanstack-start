import { defineConfig } from '@playwright/test'
import { resolve } from 'node:path'

const DB_PATH = resolve(import.meta.dirname, '.e2e-test.db')

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
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
    },
  },
})
