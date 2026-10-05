'use client'

import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar'
import { create, props as stylexProps } from '@stylexjs/stylex'
import type { StyleXStyles } from '@stylexjs/stylex'

import { colors, radius } from '#/shared/lib/tokens.stylex'
import { customClassName } from '#/shared/lib/utils.stylex'

const styles = create({
  fallback: {
    alignItems: 'center',
    backgroundColor: colors.muted,
    color: colors.mutedForeground,
    display: 'flex',
    fontSize: '0.75rem',
    fontWeight: 500,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    height: '100%',
    objectFit: 'cover',
    width: '100%',
  },
  root: {
    borderRadius: radius.full,
    display: 'flex',
    flexShrink: 0,
    height: '2rem',
    overflow: 'hidden',
    width: '2rem',
  },
})

export type AvatarProps = Omit<AvatarPrimitive.Root.Props, 'style'> & {
  className?: string
  style?: StyleXStyles
}

export function Avatar({ className, style, ...props }: AvatarProps) {
  const styleProps = stylexProps(styles.root, customClassName(className), style)
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={styleProps.className}
      style={styleProps.style}
      {...props}
    />
  )
}

export type AvatarImageProps = Omit<AvatarPrimitive.Image.Props, 'style'> & {
  className?: string
  style?: StyleXStyles
}

export function AvatarImage({ className, style, ...props }: AvatarImageProps) {
  const styleProps = stylexProps(styles.image, customClassName(className), style)
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={styleProps.className}
      style={styleProps.style}
      {...props}
    />
  )
}

export type AvatarFallbackProps = Omit<AvatarPrimitive.Fallback.Props, 'style'> & {
  className?: string
  style?: StyleXStyles
}

export function AvatarFallback({ className, style, ...props }: AvatarFallbackProps) {
  const styleProps = stylexProps(styles.fallback, customClassName(className), style)
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={styleProps.className}
      style={styleProps.style}
      {...props}
    />
  )
}
