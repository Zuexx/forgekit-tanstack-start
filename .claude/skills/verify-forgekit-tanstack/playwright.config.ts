import { defineConfig, devices } from '@playwright/test'

// Drives an instance started by `vf.sh launch`; never starts its own server. Run from app/:
//   eval "$(bash ../.claude/skills/verify-forgekit-tanstack/scripts/vf.sh env)"
//   pnpm exec playwright test -c ../.claude/skills/verify-forgekit-tanstack/playwright.config.ts
const baseURL = process.env.VF_APP_URL
if (!baseURL) throw new Error('VF_APP_URL is not set: eval the output of `vf.sh env` first')

export default defineConfig({
  testDir: './journeys',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  outputDir: `${process.env.VF_EVIDENCE}/playwright`,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    screenshot: 'on',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
