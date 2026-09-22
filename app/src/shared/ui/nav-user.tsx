import { create, props as stylexProps } from '@stylexjs/stylex'
import { LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useSignOut } from '#/features/auth'
import { useUser } from '#/shared/state'
import { colors } from '#/shared/lib/tokens.stylex'
import { Button } from './button'

const styles = create({
  container: {
    alignItems: 'center',
    borderTopColor: colors.sidebarBorder,
    borderTopStyle: 'solid',
    borderTopWidth: '1px',
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'space-between',
    paddingBlock: '0.75rem',
    paddingInline: '0.75rem',
  },
  identity: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    overflow: 'hidden',
  },
  email: {
    color: colors.mutedForeground,
    fontSize: '0.75rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  name: {
    fontSize: '0.875rem',
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

export function NavUser() {
  const { user } = useUser()
  const signOut = useSignOut()
  const { t } = useTranslation('common')

  const containerProps = stylexProps(styles.container)

  if (!user) {
    return (
      <div
        data-testid="nav-user-loading"
        className={containerProps.className}
        style={containerProps.style}
      />
    )
  }

  const identityProps = stylexProps(styles.identity)
  const nameProps = stylexProps(styles.name)
  const emailProps = stylexProps(styles.email)

  return (
    <div className={containerProps.className} style={containerProps.style}>
      <div className={identityProps.className} style={identityProps.style}>
        <span className={nameProps.className} style={nameProps.style}>
          {user.name}
        </span>
        <span className={emailProps.className} style={emailProps.style}>
          {user.email}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label={t('nav.signOut')}
        onClick={() => signOut.mutate()}
      >
        <LogOut />
      </Button>
    </div>
  )
}
