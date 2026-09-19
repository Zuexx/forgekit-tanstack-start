import { describe, expect, it } from 'vitest'

import { signInSchema } from './sign-in-schema'

describe('signInSchema', () => {
  it('accepts a valid sign-in', () => {
    const result = signInSchema.safeParse({
      email: 'person@example.com',
      password: 'abcd1234',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a malformed email', () => {
    const result = signInSchema.safeParse({
      email: 'not-an-email',
      password: 'abcd1234',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a password under eight characters', () => {
    const result = signInSchema.safeParse({
      email: 'person@example.com',
      password: 'abc123',
    })
    expect(result.success).toBe(false)
  })
})
