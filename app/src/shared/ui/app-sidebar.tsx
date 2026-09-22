import { create, props as stylexProps } from '@stylexjs/stylex'

import { useIsMobile } from '#/shared/lib/use-is-mobile'
import { colors } from '#/shared/lib/tokens.stylex'
import { useUI } from '#/shared/state'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'

const SIDEBAR_WIDTH = '16rem'

const styles = create({
  backdrop: {
    backgroundColor: 'rgb(0 0 0 / 0.4)',
    inset: 0,
    position: 'fixed',
    zIndex: 40,
  },
  brand: {
    borderBottomColor: colors.sidebarBorder,
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    fontWeight: 600,
    paddingBlock: '0.75rem',
    paddingInline: '0.75rem',
  },
  sidebar: {
    backgroundColor: colors.sidebar,
    borderRightColor: colors.sidebarBorder,
    borderRightStyle: 'solid',
    borderRightWidth: '1px',
    color: colors.sidebarForeground,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    transitionDuration: '200ms',
    transitionProperty: 'width, transform',
    width: SIDEBAR_WIDTH,
  },
  sidebarCollapsedDesktop: {
    width: '3.5rem',
  },
  sidebarMobile: {
    left: 0,
    position: 'fixed',
    top: 0,
    zIndex: 50,
  },
  sidebarMobileClosed: {
    transform: 'translateX(-100%)',
  },
  sidebarMobileOpen: {
    transform: 'translateX(0)',
  },
})

export interface AppSidebarProps {
  onSignOut: () => void
}

export function AppSidebar({ onSignOut }: AppSidebarProps) {
  const { sidebarOpen, toggleSidebar } = useUI()
  const isMobile = useIsMobile()

  const sidebarProps = stylexProps(
    styles.sidebar,
    isMobile && styles.sidebarMobile,
    isMobile && (sidebarOpen ? styles.sidebarMobileOpen : styles.sidebarMobileClosed),
    !isMobile && !sidebarOpen && styles.sidebarCollapsedDesktop,
  )
  const backdropProps = stylexProps(styles.backdrop)
  const brandProps = stylexProps(styles.brand)

  return (
    <>
      {isMobile && sidebarOpen && (
        <div
          data-testid="app-sidebar-backdrop"
          className={backdropProps.className}
          style={backdropProps.style}
          onClick={toggleSidebar}
        />
      )}
      <div
        data-testid="app-sidebar"
        data-open={sidebarOpen}
        className={sidebarProps.className}
        style={sidebarProps.style}
      >
        <div className={brandProps.className} style={brandProps.style}>
          {!isMobile && !sidebarOpen ? 'FK' : 'ForgeKit'}
        </div>
        <NavMain />
        <div style={{ flex: 1 }} />
        <NavUser onSignOut={onSignOut} />
      </div>
    </>
  )
}
