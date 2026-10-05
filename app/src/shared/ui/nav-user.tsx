import { create, props as stylexProps } from '@stylexjs/stylex'
import { ChevronsUpDown, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useUser } from '#/shared/state'
import { colors, radius } from '#/shared/lib/tokens.stylex'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'

/** Mirrors forgekit's real user-menu-content.tsx getInitials -- same unicode-aware rule
 * (CJK/single-word names take their first two characters; multi-word names take one
 * character per word, up to two). */
function getInitials(name: string) {
  const trimmed = name.trim()
  if (!trimmed) return 'U'
  if (!trimmed.includes(' ')) return trimmed.slice(0, 2).toUpperCase()
  return trimmed
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

const styles = create({
  chevron: {
    color: colors.mutedForeground,
    flexShrink: 0,
    height: '1rem',
    marginLeft: 'auto',
    width: '1rem',
  },
  email: {
    color: colors.mutedForeground,
    fontSize: '0.75rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  identity: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    overflow: 'hidden',
  },
  labelRow: {
    alignItems: 'center',
    display: 'flex',
    gap: '0.5rem',
  },
  loading: {
    height: '3rem',
  },
  name: {
    fontSize: '0.875rem',
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  trigger: {
    alignItems: 'center',
    backgroundColor: {
      ':hover': colors.sidebarAccent,
      default: 'transparent',
    },
    borderRadius: radius.md,
    color: {
      ':hover': colors.sidebarAccentForeground,
      default: 'inherit',
    },
    cursor: 'pointer',
    display: 'flex',
    gap: '0.5rem',
    outline: 'none',
    paddingBlock: '0.375rem',
    paddingInline: '0.5rem',
    textAlign: 'left',
    width: '100%',
  },
})

export interface NavUserProps {
  onSignOut: () => void
}

export function NavUser({ onSignOut }: NavUserProps) {
  const { user } = useUser()
  const { t } = useTranslation('common')

  if (!user) {
    const loadingProps = stylexProps(styles.loading)
    return (
      <div
        data-testid="nav-user-loading"
        className={loadingProps.className}
        style={loadingProps.style}
      />
    )
  }

  const triggerProps = stylexProps(styles.trigger)
  const identityProps = stylexProps(styles.identity)
  const nameProps = stylexProps(styles.name)
  const emailProps = stylexProps(styles.email)
  const chevronProps = stylexProps(styles.chevron)
  const labelRowProps = stylexProps(styles.labelRow)

  const initials = getInitials(user.name)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('nav.userMenu')}
        className={triggerProps.className}
        style={triggerProps.style}
      >
        <Avatar>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className={identityProps.className} style={identityProps.style}>
          <span className={nameProps.className} style={nameProps.style}>
            {user.name}
          </span>
          <span className={emailProps.className} style={emailProps.style}>
            {user.email}
          </span>
        </div>
        <ChevronsUpDown className={chevronProps.className} style={chevronProps.style} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start">
        <DropdownMenuLabel>
          <div className={labelRowProps.className} style={labelRowProps.style}>
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className={identityProps.className} style={identityProps.style}>
              <span className={nameProps.className} style={nameProps.style}>
                {user.name}
              </span>
              <span className={emailProps.className} style={emailProps.style}>
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>
          <LogOut />
          {t('nav.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
