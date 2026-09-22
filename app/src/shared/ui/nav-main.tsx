import { Link } from '@tanstack/react-router'
import { create, props as stylexProps } from '@stylexjs/stylex'
import { LayoutDashboard } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { colors, radius } from '#/shared/lib/tokens.stylex'

const styles = create({
  link: {
    alignItems: 'center',
    borderRadius: radius.md,
    color: colors.sidebarForeground,
    display: 'flex',
    fontSize: '0.875rem',
    gap: '0.5rem',
    paddingBlock: '0.5rem',
    paddingInline: '0.75rem',
    textDecorationLine: 'none',
    ':hover': {
      backgroundColor: colors.sidebarAccent,
      color: colors.sidebarAccentForeground,
    },
    ':is([data-status="active"])': {
      backgroundColor: colors.sidebarAccent,
      color: colors.sidebarAccentForeground,
      fontWeight: 500,
    },
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    paddingBlock: '0.5rem',
    paddingInline: '0.5rem',
  },
})

export function NavMain() {
  const { t } = useTranslation('common')
  const linkProps = stylexProps(styles.link)

  return (
    <nav className={stylexProps(styles.nav).className} style={stylexProps(styles.nav).style}>
      <Link
        to="/{-$locale}/dashboard"
        className={linkProps.className}
        style={linkProps.style}
      >
        <LayoutDashboard size={16} />
        <span>{t('nav.dashboard')}</span>
      </Link>
    </nav>
  )
}
