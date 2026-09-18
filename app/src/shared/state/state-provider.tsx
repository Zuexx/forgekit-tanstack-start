import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { useStore } from 'zustand'

import { createAppStore } from './index'
import type { AppStore } from './index'

export { createAppStore } from './index'
export type { AppStore } from './index'

type AppStoreApi = ReturnType<typeof createAppStore>

const AppStoreContext = createContext<AppStoreApi | undefined>(undefined)

export function StateProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createAppStore)

  return (
    <AppStoreContext.Provider value={store}>
      {children}
    </AppStoreContext.Provider>
  )
}

export function useAppStoreContext<T>(selector: (state: AppStore) => T): T {
  const context = useContext(AppStoreContext)

  if (!context) {
    throw new Error('useAppStoreContext must be used within StateProvider')
  }

  return useStore(context, selector)
}
