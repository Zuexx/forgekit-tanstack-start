'use client'

import { Menu } from '@base-ui/react/menu'
import { create, props as stylexProps } from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentProps } from 'react'

import { colors, radius } from '#/shared/lib/tokens.stylex'
import { customClassName } from '#/shared/lib/utils.stylex'

const styles = create({
  content: {
    backgroundColor: colors.popover,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: '1px',
    boxShadow: '0 4px 16px rgb(0 0 0 / 0.12)',
    color: colors.popoverForeground,
    minWidth: '14rem',
    overflow: 'hidden',
    padding: '0.25rem',
    zIndex: 50,
  },
  item: {
    ':is(svg)': {
      flexShrink: 0,
      height: '1rem',
      pointerEvents: 'none',
      width: '1rem',
    },
    alignItems: 'center',
    backgroundColor: {
      ':hover': colors.accent,
      '[data-highlighted]': colors.accent,
      default: 'transparent',
    },
    borderRadius: radius.sm,
    color: {
      ':hover': colors.accentForeground,
      '[data-highlighted]': colors.accentForeground,
      default: 'inherit',
    },
    cursor: 'pointer',
    display: 'flex',
    fontSize: '0.875rem',
    gap: '0.5rem',
    outline: 'none',
    paddingBlock: '0.375rem',
    paddingInline: '0.5rem',
  },
  label: {
    color: colors.mutedForeground,
    fontSize: '0.75rem',
    paddingBlock: '0.25rem',
    paddingInline: '0.5rem',
  },
  separator: {
    backgroundColor: colors.border,
    height: '1px',
    marginBlock: '0.25rem',
    marginInline: '-0.25rem',
  },
})

export const DropdownMenu = Menu.Root
export const DropdownMenuTrigger = Menu.Trigger

export type DropdownMenuContentProps = Omit<Menu.Popup.Props, 'style'> & {
  className?: string
  style?: StyleXStyles
  side?: Menu.Positioner.Props['side']
  align?: Menu.Positioner.Props['align']
  sideOffset?: Menu.Positioner.Props['sideOffset']
}

export function DropdownMenuContent({
  className,
  style,
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  ...props
}: DropdownMenuContentProps) {
  const styleProps = stylexProps(styles.content, customClassName(className), style)
  return (
    <Menu.Portal>
      <Menu.Positioner side={side} align={align} sideOffset={sideOffset}>
        <Menu.Popup
          data-slot="dropdown-menu-content"
          className={styleProps.className}
          style={styleProps.style}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  )
}

export type DropdownMenuItemProps = Omit<Menu.Item.Props, 'style'> & {
  className?: string
  style?: StyleXStyles
}

export function DropdownMenuItem({ className, style, ...props }: DropdownMenuItemProps) {
  const styleProps = stylexProps(styles.item, customClassName(className), style)
  return (
    <Menu.Item
      data-slot="dropdown-menu-item"
      className={styleProps.className}
      style={styleProps.style}
      {...props}
    />
  )
}

export type DropdownMenuLabelProps = Omit<ComponentProps<'div'>, 'style'> & {
  className?: string
  style?: StyleXStyles
}

export function DropdownMenuLabel({ className, style, ...props }: DropdownMenuLabelProps) {
  const styleProps = stylexProps(styles.label, customClassName(className), style)
  return (
    <div
      data-slot="dropdown-menu-label"
      className={styleProps.className}
      style={styleProps.style}
      {...props}
    />
  )
}

export type DropdownMenuSeparatorProps = Omit<Menu.Separator.Props, 'style'> & {
  className?: string
  style?: StyleXStyles
}

export function DropdownMenuSeparator({ className, style, ...props }: DropdownMenuSeparatorProps) {
  const styleProps = stylexProps(styles.separator, customClassName(className), style)
  return (
    <Menu.Separator
      data-slot="dropdown-menu-separator"
      className={styleProps.className}
      style={styleProps.style}
      {...props}
    />
  )
}
