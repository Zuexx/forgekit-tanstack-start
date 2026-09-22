import { describe, expect, it } from 'vitest'
import type { TFunction } from 'i18next'

import { createSignInSchema, signInSchema } from './sign-in-schema'

const stubT = ((key: string, options?: { min?: number }) =>
  options ? `${key}:${options.min}` : key) as unknown as TFunction<'validation'>

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

describe('createSignInSchema', () => {
  it('accepts a valid sign-in', () => {
    const result = createSignInSchema(stubT).safeParse({
      email: 'person@example.com',
      password: 'abcd1234',
    })
    expect(result.success).toBe(true)
  })

  it('uses the translated message for an invalid email', () => {
    const result = createSignInSchema(stubT).safeParse({
      email: 'not-an-email',
      password: 'abcd1234',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('authenticate.email.invalid')
  })

  it('uses the translated, interpolated message for a short password', () => {
    const result = createSignInSchema(stubT).safeParse({
      email: 'person@example.com',
      password: 'abc123',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('authenticate.password.min:8')
  })
})
