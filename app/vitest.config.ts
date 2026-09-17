import { defineConfig } from 'vitest/config'

const config = defineConfig({
  test: {
    // The bare scaffold ships with zero test files; `pnpm test` must still exit 0 so
    // later tasks (5, 7, 8) can rely on it as a gate rather than a guaranteed failure.
    passWithNoTests: true,
  },
})

export default config
