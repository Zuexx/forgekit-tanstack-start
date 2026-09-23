import { create, props as stylexProps } from '@stylexjs/stylex'
import { Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useSyncExternalStore } from 'react'

import { useUI } from '#/shared/state'
import { Button } from './button'

const THEME_STORAGE_KEY = 'forgekit-tanstack-start.theme'

type Theme = 'light' | 'dark'

/**
 * Mirrors forgekit's own theme-switcher.tsx mechanism: useSyncExternalStore reads
 * localStorage directly (not React state), so a same-tab 'themechange' event is needed
 * alongside the native 'storage' event (which only fires in OTHER tabs, per spec) to
 * notify this hook's subscribers after a same-tab toggle.
 */
function getSnapshot(): Theme {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getServerSnapshot(): Theme {
  return 'light'
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener('themechange', callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener('themechange', callback)
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  window.dispatchEvent(new Event('themechange'))
}

const styles = create({
  iconWrapper: {
    alignItems: 'center',
    display: 'flex',
    height: '1rem',
    justifyContent: 'center',
    width: '1rem',
  },
})

export function ThemeSwitcher() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const { setTheme } = useUI()

  const handleToggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  const wrapperProps = stylexProps(styles.iconWrapper)

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Switch theme (current: ${theme})`}
      onClick={handleToggle}
    >
      <span className={wrapperProps.className} style={wrapperProps.style}>
        <AnimatePresence mode="wait" initial={false}>
          {theme === 'dark' ? (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Moon size={16} />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Sun size={16} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </Button>
  )
}
