import { describe, expect, it } from 'vitest'

describe('authClient', () => {
  it('exposes the email/password and admin methods Better Auth generates', async () => {
    const { authClient } = await import('./auth-client')
    expect(typeof authClient.signIn.email).toBe('function')
    expect(typeof authClient.signUp.email).toBe('function')
    expect(typeof authClient.signOut).toBe('function')
    expect(typeof authClient.getSession).toBe('function')
    // useSession is a Zustand store object in Better Auth 1.7.5, not a function
    expect(typeof authClient.useSession).toBe('object')
    expect(typeof (authClient.useSession as any).subscribe).toBe('function')
    expect(typeof (authClient.useSession as any).get).toBe('function')
  })
})
