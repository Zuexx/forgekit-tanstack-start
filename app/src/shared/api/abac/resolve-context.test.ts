import { beforeEach, describe, expect, it } from 'vitest'

import { AUTH_COOKIE } from '#/shared/lib/constants'

import { resolveContext } from './resolve-context'

const cookieJar = new Map<string, string>()
let requestMethod = 'GET'

const config = {
  publicRoutes: ['/'],
  authRoutes: ['/sign-in', '/sign-up'],
}

const getCookieMock = (name: string) => cookieJar.get(name)
const getMethodMock = () => requestMethod

describe('resolveContext', () => {
  beforeEach(() => {
    cookieJar.clear()
    requestMethod = 'GET'
  })

  it('reads the session cookie named after AUTH_COOKIE', () => {
    cookieJar.set(`${AUTH_COOKIE}.session_token`, 'a-token')

    const ctx = resolveContext('/dashboard', config, getCookieMock, getMethodMock)

    expect(ctx.subject.isAuthenticated).toBe(true)
  })

  it('reads the __Secure- prefixed cookie set over HTTPS', () => {
    cookieJar.set(`__Secure-${AUTH_COOKIE}.session_token`, 'a-token')

    const ctx = resolveContext('/dashboard', config, getCookieMock, getMethodMock)

    expect(ctx.subject.isAuthenticated).toBe(true)
  })

  it('treats a missing cookie as anonymous', () => {
    const ctx = resolveContext('/dashboard', config, getCookieMock, getMethodMock)

    expect(ctx.subject.isAuthenticated).toBe(false)
  })

  it('marks a configured public route', () => {
    const ctx = resolveContext('/', config, getCookieMock, getMethodMock)

    expect(ctx.resource.isPublic).toBe(true)
    expect(ctx.resource.isAuthRoute).toBe(false)
  })

  it('marks a configured auth route', () => {
    const ctx = resolveContext('/sign-in', config, getCookieMock, getMethodMock)

    expect(ctx.resource.isAuthRoute).toBe(true)
  })

  it('treats an unlisted route as neither public nor an auth route', () => {
    const ctx = resolveContext('/dashboard', config, getCookieMock, getMethodMock)

    expect(ctx.resource.isPublic).toBe(false)
    expect(ctx.resource.isAuthRoute).toBe(false)
  })

  it('carries the request method through', () => {
    requestMethod = 'POST'

    const ctx = resolveContext('/', config, getCookieMock, getMethodMock)

    expect(ctx.environment.method).toBe('POST')
  })
})
