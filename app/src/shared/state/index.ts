import { createStore } from 'zustand/vanilla'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { createUISlice } from './slices/ui.slice'
import type { UISlice } from './slices/ui.slice'
import { createUserSlice } from './slices/user.slice'
import type { UserSlice } from './slices/user.slice'

export type AppStore = UserSlice & UISlice

/**
 * A factory, not a ready-made instance. A module-level singleton store is shared
 * process-wide across concurrent SSR requests — safe while this store only held mock
 * theme/sidebar state, a real bug once it holds a real signed-in visitor's session (one
 * visitor's data leaking into another's initial render). state-provider.tsx calls this once
 * per component-tree mount via useState, matching forgekit's own real, live
 * providers/store-provider.tsx pattern (not its dead lib/store/index.ts singleton, which is
 * what this file used to mirror).
 */
export const createAppStore = () =>
  createStore<AppStore>()(
    devtools(
      immer((...args) => ({
        ...createUserSlice(...args),
        ...createUISlice(...args),
      })),
      { name: 'AppStore' },
    ),
  )

export * from './slices/ui.slice'
export * from './slices/user.slice'
export { StateProvider } from './state-provider'
