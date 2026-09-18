import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { createUISlice } from './slices/ui.slice'
import type { UISlice } from './slices/ui.slice'
import { createUserSlice } from './slices/user.slice'
import type { UserSlice } from './slices/user.slice'

export type AppStore = UserSlice & UISlice

export const useAppStore = create<AppStore>()(
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
