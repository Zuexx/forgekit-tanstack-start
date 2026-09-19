import { describe, expect, it } from 'vitest'

import { signUpSchema } from './sign-up-schema'

const valid = {
  name: 'A Person',
  email: 'person@example.com',
  password: 'abcd1234',
  confirmPassword: 'abcd1234',
}

describe('signUpSchema', () => {
  it('accepts a valid registration', () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const result = signUpSchema.safeParse({
      ...valid,
      confirmPassword: 'different1',
    })
    expect(result.success).toBe(false)
    expect(
      result.error?.issues.some((i) => i.path[0] === 'confirmPassword'),
    ).toBe(true)
  })

  it('rejects a password under eight characters', () => {
    const short = 'abc123'
    const result = signUpSchema.safeParse({
      ...valid,
      password: short,
      confirmPassword: short,
    })
    expect(result.success).toBe(false)
  })

  it('rejects a malformed email', () => {
    expect(
      signUpSchema.safeParse({ ...valid, email: 'not-an-email' }).success,
    ).toBe(false)
  })

  it('rejects an empty name', () => {
    expect(signUpSchema.safeParse({ ...valid, name: '' }).success).toBe(false)
  })
})
