import { describe, expect, it } from 'vitest'
import { createAppStore } from './index'

describe('createAppStore', () => {
  it('starts with the expected default state', () => {
    const store = createAppStore()
    const state = store.getState()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.theme).toBe('light')
    expect(state.sidebarOpen).toBe(true)
    expect(state.loading).toBe(false)
  })

  it('setUser updates user and isAuthenticated together', () => {
    const store = createAppStore()
    store.getState().setUser({ id: '1', name: 'Ada', email: 'ada@example.com' })
    const state = store.getState()
    expect(state.user).toEqual({
      id: '1',
      name: 'Ada',
      email: 'ada@example.com',
    })
    expect(state.isAuthenticated).toBe(true)
  })
})
