import { defineConfig } from 'steiger'
import fsd from '@feature-sliced/steiger-plugin'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // `store` is on steiger's generic BAD_NAMES list (named after its contents, not
    // its purpose), but this segment intentionally mirrors forgekit's existing
    // `app/lib/store/` naming for the Zustand client-state layer. Scoped override
    // instead of a blanket disable of fsd/segments-by-purpose.
    files: ['src/shared/store/**'],
    rules: {
      'fsd/segments-by-purpose': 'off',
    },
  },
])
