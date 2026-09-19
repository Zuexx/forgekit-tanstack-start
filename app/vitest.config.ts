import { defineConfig, mergeConfig } from 'vitest/config'

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
      // A few tests do real work (SQLite migrations, bcrypt hashing, RSA keygen for the jwt
      // plugin) that can run past Vitest's 5000ms default under parallel-worker CPU
      // contention — real I/O/CPU cost, not a hang, so the budget is raised globally rather
      // than chased per file.
      testTimeout: 15000,
    },
  }),
)

export default config
