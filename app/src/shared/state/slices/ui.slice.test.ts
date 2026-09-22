import { beforeEach, describe, expect, it } from 'vitest'

import { createAppStore } from '../index'
import { SIDEBAR_STORAGE_KEY } from './ui.slice'

describe('createUISlice sidebarOpen persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to true when nothing is stored', () => {
    const store = createAppStore()
    expect(store.getState().sidebarOpen).toBe(true)
  })

  it('initial state is always true regardless of localStorage content, matching the SSR default (the persisted value is applied later, client-only, by StateProvider -- see state-provider.test.tsx)', () => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, 'false')
    const store = createAppStore()
    expect(store.getState().sidebarOpen).toBe(true)
  })

  it('persists toggleSidebar to localStorage', () => {
    const store = createAppStore()
    store.getState().toggleSidebar()
    expect(localStorage.getItem(SIDEBAR_STORAGE_KEY)).toBe('false')
  })

  it('persists setSidebarOpen to localStorage', () => {
    const store = createAppStore()
    store.getState().setSidebarOpen(false)
    expect(localStorage.getItem(SIDEBAR_STORAGE_KEY)).toBe('false')
  })

  it('does not throw when localStorage.setItem is blocked (e.g. Safari "block all cookies")', () => {
    const originalSetItem = Storage.prototype.setItem
    Storage.prototype.setItem = () => {
      throw new DOMException('blocked', 'SecurityError')
    }

    try {
      const store = createAppStore()
      expect(() => store.getState().toggleSidebar()).not.toThrow()
      // The in-memory value still updates even though the write failed.
      expect(store.getState().sidebarOpen).toBe(false)
    } finally {
      Storage.prototype.setItem = originalSetItem
    }
  })
})
