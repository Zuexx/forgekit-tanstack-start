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
    },
  }),
)

export default config
