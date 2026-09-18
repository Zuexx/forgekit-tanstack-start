import { render, renderHook, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { createAppStore, StateProvider, useAppStoreContext } from './state-provider'

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

  it('is a fresh instance on every call', () => {
    const a = createAppStore()
    const b = createAppStore()
    expect(a).not.toBe(b)
  })
})

describe('useAppStoreContext', () => {
  it('throws when used outside StateProvider', () => {
    // @testing-library/react@16's renderHook has no result.error capture — a synchronous
    // throw from the render callback propagates straight out of the renderHook() call
    // itself, so the assertion wraps that call, not a returned result field. Confirmed
    // against the actual installed package's dist/pure.js before this plan was dispatched.
    expect(() =>
      renderHook(() => useAppStoreContext((state) => state.theme)),
    ).toThrow('StateProvider')
  })

  it('resolves the store state when used inside StateProvider', () => {
    function Probe() {
      const theme = useAppStoreContext((state) => state.theme)
      return <div data-testid="theme">{theme}</div>
    }

    render(
      <StateProvider>
        <Probe />
      </StateProvider>,
    )

    expect(screen.getByTestId('theme').textContent).toBe('light')
  })
})
