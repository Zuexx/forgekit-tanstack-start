import { beforeEach, describe, expect, it } from 'vitest'

import { createAppStore } from '../index'

describe('createUISlice sidebarOpen persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to true when nothing is stored', () => {
    const store = createAppStore()
    expect(store.getState().sidebarOpen).toBe(true)
  })

  it('reads a previously stored value on creation', () => {
    localStorage.setItem('forgekit-tanstack-start.sidebar-open', 'false')
    const store = createAppStore()
    expect(store.getState().sidebarOpen).toBe(false)
  })

  it('persists toggleSidebar to localStorage', () => {
    const store = createAppStore()
    store.getState().toggleSidebar()
    expect(localStorage.getItem('forgekit-tanstack-start.sidebar-open')).toBe('false')
  })

  it('persists setSidebarOpen to localStorage', () => {
    const store = createAppStore()
    store.getState().setSidebarOpen(false)
    expect(localStorage.getItem('forgekit-tanstack-start.sidebar-open')).toBe('false')
  })
})
