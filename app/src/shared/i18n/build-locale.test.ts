import { describe, expect, it } from 'vitest'

import { buildLocale, withLocalePrefix } from './build-locale'

describe('buildLocale', () => {
  it('takes the locale from a leading path segment', () => {
    const result = buildLocale('/zh-TW/dashboard', undefined, undefined)
    expect(result).toEqual({ locale: 'zh-TW', path: '/dashboard' })
  })

  it('normalizes a bare locale-only path to root', () => {
    const result = buildLocale('/en', undefined, undefined)
    expect(result).toEqual({ locale: 'en', path: '/' })
  })

  it('does not treat a look-alike segment as a locale', () => {
    const result = buildLocale('/english/page', undefined, undefined)
    expect(result.locale).toBe('en')
    expect(result.path).toBe('/english/page')
  })

  it('strips only the leading locale segment, never a later occurrence', () => {
    const result = buildLocale('/zh-TW/enroll', undefined, undefined)
    expect(result).toEqual({ locale: 'zh-TW', path: '/enroll' })
  })

  it('falls back to a valid cookie locale when the path has no prefix', () => {
    const result = buildLocale('/dashboard', 'ko-KR', undefined)
    expect(result).toEqual({ locale: 'ko-KR', path: '/dashboard' })
  })

  it('ignores an invalid cookie value and falls through to negotiation', () => {
    const result = buildLocale('/dashboard', 'fr', 'ko-KR,en;q=0.5')
    expect(result.locale).toBe('ko-KR')
  })

  it('negotiates a supported locale from Accept-Language when no path/cookie locale exists', () => {
    const result = buildLocale('/dashboard', undefined, 'zh-TW,en;q=0.8')
    expect(result).toEqual({ locale: 'zh-TW', path: '/dashboard' })
  })

  it('falls back to the default locale when nothing matches', () => {
    const result = buildLocale('/dashboard', undefined, 'fr-FR,de;q=0.5')
    expect(result).toEqual({ locale: 'en', path: '/dashboard' })
  })

  it('falls back to the default locale when there is no Accept-Language at all', () => {
    const result = buildLocale('/dashboard', undefined, undefined)
    expect(result).toEqual({ locale: 'en', path: '/dashboard' })
  })
})

describe('withLocalePrefix', () => {
  it('adds no prefix for the default locale', () => {
    expect(withLocalePrefix('/sign-in', 'en')).toBe('/sign-in')
  })

  it('prefixes a non-default locale', () => {
    expect(withLocalePrefix('/sign-in', 'zh-TW')).toBe('/zh-TW/sign-in')
  })

  it('prefixes the root path without a double slash', () => {
    expect(withLocalePrefix('/', 'ko-KR')).toBe('/ko-KR')
  })
})
