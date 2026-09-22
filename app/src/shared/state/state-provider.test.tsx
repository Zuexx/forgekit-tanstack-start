import { cleanup, render, renderHook, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { createAppStore, StateProvider, useAppStoreContext } from './state-provider'
import { SIDEBAR_STORAGE_KEY } from './slices/ui.slice'

afterEach(() => {
  cleanup()
})

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

describe('StateProvider sidebarOpen hydration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('renders sidebarOpen true first (matching the SSR default), then applies the persisted localStorage value in a post-mount effect', () => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, 'false')

    const observedValues: boolean[] = []

    function Probe() {
      const sidebarOpen = useAppStoreContext((state) => state.sidebarOpen)
      observedValues.push(sidebarOpen)
      return <div data-testid="sidebar-open">{String(sidebarOpen)}</div>
    }

    render(
      <StateProvider>
        <Probe />
      </StateProvider>,
    )

    // The very first render must match what the server always sent (true) -- that's
    // the hydration-mismatch fix itself. StateProvider's post-mount effect then reads
    // localStorage and corrects the state client-only, producing a second render.
    expect(observedValues[0]).toBe(true)
    expect(screen.getByTestId('sidebar-open').textContent).toBe('false')
  })

  it('leaves sidebarOpen at the default true when nothing is stored', () => {
    function Probe() {
      const sidebarOpen = useAppStoreContext((state) => state.sidebarOpen)
      return <div data-testid="sidebar-open">{String(sidebarOpen)}</div>
    }

    render(
      <StateProvider>
        <Probe />
      </StateProvider>,
    )

    expect(screen.getByTestId('sidebar-open').textContent).toBe('true')
  })

  it('does not throw and keeps the SSR-matching default when localStorage.getItem is blocked (e.g. Safari "block all cookies")', () => {
    const originalGetItem = Storage.prototype.getItem
    Storage.prototype.getItem = () => {
      throw new DOMException('blocked', 'SecurityError')
    }

    function Probe() {
      const sidebarOpen = useAppStoreContext((state) => state.sidebarOpen)
      return <div data-testid="sidebar-open">{String(sidebarOpen)}</div>
    }

    try {
      expect(() =>
        render(
          <StateProvider>
            <Probe />
          </StateProvider>,
        ),
      ).not.toThrow()

      expect(screen.getByTestId('sidebar-open').textContent).toBe('true')
    } finally {
      Storage.prototype.getItem = originalGetItem
    }
  })
})
