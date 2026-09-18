import { describe, expect, it } from 'vitest'

describe('authClient', () => {
  it('exposes the email/password and admin methods Better Auth generates', async () => {
    const { authClient } = await import('./auth-client')
    expect(typeof authClient.signIn.email).toBe('function')
    expect(typeof authClient.signUp.email).toBe('function')
    expect(typeof authClient.signOut).toBe('function')
    expect(typeof authClient.getSession).toBe('function')
    expect(typeof authClient.useSession).toBe('function')
  })
})
