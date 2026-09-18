import { describe, expect, it } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('imports without throwing and exports a component', () => {
    // This is a minimal smoke test: it proves the module graph behind
    // `shared/ui/button.tsx` (the `#/` alias resolution and StyleX's babel
    // transform) resolves correctly under vitest, per Fix 1 of the
    // final-review pass. A full render/DOM assertion would need jsdom +
    // @testing-library/react, which aren't installed and are out of scope
    // here.
    expect(typeof Button).toBe('function')
  })
})
