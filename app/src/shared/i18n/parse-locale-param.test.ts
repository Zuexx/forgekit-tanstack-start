import { describe, expect, it } from 'vitest'

import { parseLocaleParam } from './parse-locale-param'

describe('parseLocaleParam', () => {
  it('accepts an absent locale segment as the default (no prefix)', () => {
    expect(parseLocaleParam(undefined)).toEqual({ locale: undefined })
  })

  it('accepts each supported locale', () => {
    expect(parseLocaleParam('en')).toEqual({ locale: 'en' })
    expect(parseLocaleParam('zh-TW')).toEqual({ locale: 'zh-TW' })
    expect(parseLocaleParam('ko-KR')).toEqual({ locale: 'ko-KR' })
  })

  it('rejects a segment that is not a supported locale', () => {
    expect(parseLocaleParam('foo')).toBe(false)
    expect(parseLocaleParam('EN')).toBe(false)
  })
})
