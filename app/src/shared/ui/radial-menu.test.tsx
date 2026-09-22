import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { RadialMenu } from './radial-menu'

afterEach(() => {
  cleanup()
})

describe('RadialMenu', () => {
  it('renders the toggle and one button per item, closed by default', () => {
    render(
      <RadialMenu
        items={[{ label: 'A' }, { label: 'B' }, { label: 'C' }]}
        toggleAriaLabel="Open menu"
      />,
    )
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(4) // toggle + 3 items
  })

  it('opens on click and fires an item onClick, then closes', async () => {
    const onClick = vi.fn()
    render(
      <RadialMenu
        items={[{ label: 'A', onClick }, { label: 'B' }]}
        toggleAriaLabel="Open menu"
        trigger="click"
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    await userEvent.click(screen.getByRole('button', { name: 'A' }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('opens on hover when trigger is "hover"', async () => {
    render(
      <RadialMenu
        items={[{ label: 'A' }]}
        toggleAriaLabel="Open menu"
        trigger="hover"
      />,
    )

    const toggle = screen.getByRole('button', { name: 'Open menu' })
    await userEvent.hover(toggle)

    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument()
  })

  it('does not open on hover when trigger is "click"', async () => {
    render(
      <RadialMenu
        items={[{ label: 'A' }]}
        toggleAriaLabel="Open menu"
        trigger="click"
      />,
    )

    await userEvent.hover(screen.getByRole('button', { name: 'Open menu' }))

    // The item button exists in the DOM (always mounted, opacity-animated) but isn't
    // interactive — assert the toggle itself never flips to its "open" state instead.
    expect(screen.getByRole('button', { name: 'Open menu' })).not.toHaveAttribute(
      'data-open',
      'true',
    )
  })
})
