import type { AppStore } from '../index'
import type { ImmerStateCreator } from '../types'

export interface UISlice {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  loading: boolean
  setTheme: (theme: 'light' | 'dark') => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setLoading: (loading: boolean) => void
}

export const SIDEBAR_STORAGE_KEY = 'forgekit-tanstack-start.sidebar-open'

/**
 * sidebarOpen's initial value is always `true`, matching what SSR always renders --
 * reading localStorage synchronously here would also run during the client's very first
 * hydration render (window already exists then, not just post-hydration), producing a
 * hydration mismatch for any visitor who'd previously collapsed the sidebar. The real
 * persisted value is applied afterwards, client-only, by StateProvider's post-mount effect
 * (see state-provider.tsx), which is safe because it runs strictly after hydration.
 */
function writeStoredSidebarOpen(open: boolean): void {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open))
  } catch {
    // Storage can throw (e.g. Safari's "block all cookies") -- no-op and keep the
    // in-memory value only, rather than crashing the whole app (StateProvider wraps
    // every page, not just the authenticated shell).
  }
}

export const createUISlice: ImmerStateCreator<UISlice, AppStore> = (set) => ({
  theme: 'light',
  sidebarOpen: true,
  loading: false,

  setTheme: (theme) =>
    set((state) => {
      state.theme = theme
    }),

  toggleSidebar: () =>
    set((state) => {
      state.sidebarOpen = !state.sidebarOpen
      writeStoredSidebarOpen(state.sidebarOpen)
    }),

  setSidebarOpen: (open) =>
    set((state) => {
      state.sidebarOpen = open
      writeStoredSidebarOpen(open)
    }),

  setLoading: (loading) =>
    set((state) => {
      state.loading = loading
    }),
})
