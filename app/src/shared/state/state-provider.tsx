import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useStore } from 'zustand'

import { createAppStore } from './index'
import type { AppStore } from './index'
import { SIDEBAR_STORAGE_KEY } from './slices/ui.slice'

export { createAppStore } from './index'
export type { AppStore } from './index'

type AppStoreApi = ReturnType<typeof createAppStore>

const AppStoreContext = createContext<AppStoreApi | undefined>(undefined)

export function StateProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createAppStore)

  // Runs once after mount, i.e. strictly after hydration -- applying the real
  // persisted sidebar value here (rather than reading it synchronously into the
  // store's initial state) avoids a hydration mismatch: the store's initial state
  // always matches the SSR default (true), and this effect corrects it client-only.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)
      if (stored !== null) {
        store.getState().setSidebarOpen(stored === 'true')
      }
    } catch {
      // Storage can throw (e.g. Safari's "block all cookies") -- no-op and keep the
      // SSR-matching default, rather than crashing the whole app (this provider wraps
      // every page, not just the authenticated shell).
    }
  }, [store])

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
