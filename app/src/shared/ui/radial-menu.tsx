import { create, props as stylexProps } from '@stylexjs/stylex'
import { Circle } from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { radius } from '#/shared/lib/tokens.stylex'
import { Button } from './button'

const ORBIT_RADIUS = 72

const styles = create({
  container: {
    height: '2.25rem',
    position: 'relative',
    width: '2.25rem',
  },
  toggle: {
    borderRadius: radius.full,
    position: 'relative',
    zIndex: 60,
  },
  itemWrapper: {
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 50,
  },
  itemInner: {
    transform: 'translate(-50%, -50%)',
  },
  item: {
    borderRadius: radius.full,
    height: '2rem',
    minHeight: '2rem',
    minWidth: '2rem',
    width: '2rem',
  },
})

export interface RadialMenuItem {
  label: ReactNode
  onClick?: () => void
}

export interface RadialMenuProps {
  arc?: number
  startAngle?: number
  trigger?: 'hover' | 'click' | 'both'
  angles?: number[]
  items: RadialMenuItem[]
  toggle?: ReactNode
  toggleAriaLabel?: string
  radius?: number
}

/**
 * Ported from forgekit's real components/radial-menu.tsx — a generic, reusable radial
 * menu, not invented for this port. The circular placement is a rotate-then-translate
 * CSS composition trick: each item's outer wrapper is rotated to its target angle while
 * pinned to the toggle's center, then a plain inner div pushes it outward by a constant
 * radius along its own (now-rotated) local X axis — guaranteeing every item sits exactly
 * `radius` px from center regardless of angle, with no explicit sin/cos math. A second,
 * inner counter-rotation cancels the parent's rotation so the item's content renders
 * upright. Confirmed against forgekit's original before porting: no third-party geometry
 * dependency, just this transform-composition identity plus Motion's spring interpolation.
 */
export function RadialMenu({
  arc = 120,
  startAngle = 210,
  trigger = 'both',
  angles,
  items,
  toggle,
  toggleAriaLabel = 'Open menu',
  radius: radiusProp,
}: RadialMenuProps) {
  const [open, setOpen] = useState(false)

  const hoverEnabled = trigger !== 'click'
  const clickEnabled = trigger !== 'hover'

  const step = items.length > 1 ? arc / (items.length - 1) : 0
  const anglesList =
    angles && angles.length === items.length
      ? angles
      : items.map((_, i) => startAngle + step * i)
  const orbitRadius = typeof radiusProp === 'number' ? radiusProp : ORBIT_RADIUS

  const containerProps = stylexProps(styles.container)
  const toggleProps = stylexProps(styles.toggle)
  const itemWrapperProps = stylexProps(styles.itemWrapper)
  const itemInnerProps = stylexProps(styles.itemInner)
  const itemProps = stylexProps(styles.item)

  return (
    <div className={containerProps.className} style={containerProps.style}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={toggleAriaLabel}
        data-open={open}
        className={toggleProps.className}
        style={toggleProps.style}
        onClick={() => {
          if (clickEnabled) setOpen((value) => !value)
        }}
        onMouseEnter={() => {
          if (hoverEnabled) setOpen(true)
        }}
        onMouseLeave={() => {
          if (hoverEnabled) setOpen(false)
        }}
      >
        {toggle ?? <Circle />}
      </Button>

      {items.map((item, index) => {
        const angle = anglesList[index] ?? startAngle
        return (
          <motion.div
            key={index}
            className={itemWrapperProps.className}
            style={{ ...itemWrapperProps.style, pointerEvents: open ? 'auto' : 'none' }}
            initial={{ rotate: 0, opacity: 0 }}
            animate={open ? { rotate: angle, opacity: 1 } : { rotate: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 26, delay: index * 0.05 }}
          >
            <div style={{ transform: `translateX(${orbitRadius}px)` }}>
              <motion.div
                className={itemInnerProps.className}
                style={{ ...itemInnerProps.style, rotate: -angle }}
              >
                <Button
                  variant="outline"
                  className={itemProps.className}
                  style={itemProps.style}
                  onClick={() => {
                    item.onClick?.()
                    setOpen(false)
                  }}
                >
                  {item.label}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
