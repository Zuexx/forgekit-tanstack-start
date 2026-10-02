import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config.ts'

const config = mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // The bare scaffold ships with zero test files; `pnpm test` must still exit 0 so
      // later tasks (5, 7, 8) can rely on it as a gate rather than a guaranteed failure.
      passWithNoTests: true,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      // Vitest's default include glob (**/*.{test,spec}.*) also matches Playwright's own
      // e2e/*.spec.ts files. Those use @playwright/test's own test.describe/test, which
      // throws ("Playwright Test did not expect test.describe() to be called here") when
      // Vitest's runner tries to execute them directly -- the two suites are run by two
      // different CLIs (`pnpm test` vs `pnpm test:e2e`) and must not overlap.
      exclude: [...configDefaults.exclude, 'e2e/**'],
      // A few tests do real work (SQLite migrations, bcrypt hashing, RSA keygen for the jwt
      // plugin) that can run past Vitest's 5000ms default under parallel-worker CPU
      // contention — real I/O/CPU cost, not a hang, so the budget is raised globally rather
      // than chased per file.
      testTimeout: 15000,
    },
  }),
)

export default config
