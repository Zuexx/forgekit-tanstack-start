import { create, props as stylexProps } from '@stylexjs/stylex'
import { PanelLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { colors } from '#/shared/lib/tokens.stylex'
import { useUI } from '#/shared/state'
import { Button } from './button'
import { LocaleSwitcher } from './locale-switcher'
import { Separator } from './separator'
import { ThemeSwitcher } from './theme-switcher'

const styles = create({
  header: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    display: 'flex',
    gap: '0.75rem',
    paddingBlock: '0.75rem',
    paddingInline: '1rem',
  },
  spacer: {
    flex: 1,
  },
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    margin: 0,
  },
})

export function AppHeader() {
  const { toggleSidebar } = useUI()
  const { t } = useTranslation('common')

  const headerProps = stylexProps(styles.header)
  const spacerProps = stylexProps(styles.spacer)
  const titleProps = stylexProps(styles.title)

  return (
    <header className={headerProps.className} style={headerProps.style}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={t('nav.toggleSidebar')}
        onClick={toggleSidebar}
      >
        <PanelLeft size={16} />
      </Button>
      <Separator orientation="vertical" />
      <h1 className={titleProps.className} style={titleProps.style}>
        {t('nav.dashboard')}
      </h1>
      <div className={spacerProps.className} style={spacerProps.style} />
      <ThemeSwitcher />
      <LocaleSwitcher />
    </header>
  )
}
