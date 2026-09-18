import { describe, expect, it } from 'vitest'
import { useAppStore } from './index'

describe('useAppStore', () => {
  it('starts with the expected default state', () => {
    const state = useAppStore.getState()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.theme).toBe('light')
    expect(state.sidebarOpen).toBe(true)
    expect(state.loading).toBe(false)
  })

  it('setUser updates user and isAuthenticated together', () => {
    useAppStore
      .getState()
      .setUser({ id: '1', name: 'Ada', email: 'ada@example.com' })
    const state = useAppStore.getState()
    expect(state.user).toEqual({
      id: '1',
      name: 'Ada',
      email: 'ada@example.com',
    })
    expect(state.isAuthenticated).toBe(true)
    useAppStore.getState().logout()
  })
})
