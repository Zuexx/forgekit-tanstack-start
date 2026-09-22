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

const SIDEBAR_STORAGE_KEY = 'forgekit-tanstack-start.sidebar-open'

/**
 * The store is recreated fresh per component-tree mount (see index.ts's own doc comment,
 * to avoid one SSR visitor's state leaking into another's) -- so sidebarOpen alone would
 * reset to its default on every page load without this. window is undefined during SSR.
 */
function readStoredSidebarOpen(): boolean {
  if (typeof window === 'undefined') {
    return true
  }
  const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)
  return stored === null ? true : stored === 'true'
}

function writeStoredSidebarOpen(open: boolean): void {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open))
}

export const createUISlice: ImmerStateCreator<UISlice, AppStore> = (set) => ({
  theme: 'light',
  sidebarOpen: readStoredSidebarOpen(),
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
