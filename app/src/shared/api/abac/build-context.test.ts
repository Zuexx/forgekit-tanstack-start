import { describe, expect, it } from 'vitest'

import { buildContext } from './build-context'

const config = {
  publicRoutes: ['/'],
  authRoutes: ['/sign-in', '/sign-up'],
}

describe('buildContext', () => {
  it('treats a present session as authenticated', () => {
    const ctx = buildContext('/dashboard', config, 'a-token', 'GET')

    expect(ctx.subject.isAuthenticated).toBe(true)
  })

  it('treats a missing session as anonymous', () => {
    const ctx = buildContext('/dashboard', config, undefined, 'GET')

    expect(ctx.subject.isAuthenticated).toBe(false)
  })

  it('marks a configured public route', () => {
    const ctx = buildContext('/', config, undefined, 'GET')

    expect(ctx.resource.isPublic).toBe(true)
    expect(ctx.resource.isAuthRoute).toBe(false)
  })

  it('marks a configured auth route', () => {
    const ctx = buildContext('/sign-in', config, undefined, 'GET')

    expect(ctx.resource.isAuthRoute).toBe(true)
  })

  it('treats an unlisted route as neither public nor an auth route', () => {
    const ctx = buildContext('/dashboard', config, undefined, 'GET')

    expect(ctx.resource.isPublic).toBe(false)
    expect(ctx.resource.isAuthRoute).toBe(false)
  })

  it('carries the request method through', () => {
    const ctx = buildContext('/', config, undefined, 'POST')

    expect(ctx.environment.method).toBe('POST')
  })
})
