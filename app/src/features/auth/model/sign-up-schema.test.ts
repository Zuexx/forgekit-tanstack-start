import { describe, expect, it } from 'vitest'
import type { TFunction } from 'i18next'

import { createSignUpSchema, signUpSchema } from './sign-up-schema'

const stubT = ((key: string, options?: { min?: number }) =>
  options ? `${key}:${options.min}` : key) as unknown as TFunction<'validation'>

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

describe('createSignUpSchema', () => {
  it('accepts a valid registration', () => {
    expect(createSignUpSchema(stubT).safeParse(valid).success).toBe(true)
  })

  it('uses the translated message for mismatched passwords', () => {
    const result = createSignUpSchema(stubT).safeParse({
      ...valid,
      confirmPassword: 'different1',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('authenticate.confirmPassword.confirm')
  })

  it('uses the translated message for an empty name', () => {
    const result = createSignUpSchema(stubT).safeParse({ ...valid, name: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('authenticate.name.required')
  })
})
