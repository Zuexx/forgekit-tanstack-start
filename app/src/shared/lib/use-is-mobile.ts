import { useSyncExternalStore } from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * Matches forgekit's own use-mobile.ts convention: 768px breakpoint, driven by
 * window.innerWidth rather than the MediaQueryList's own `matches` (which some jsdom test
 * mocks don't update), with the media query listener only used to know WHEN to re-check.
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

function subscribe(callback: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

function getServerSnapshot() {
  return false
}
