import { describe, expect, it } from 'vitest'

import { createI18nInstance } from './i18n'

describe('createI18nInstance', () => {
  it('resolves a key from the requested locale', () => {
    const i18n = createI18nInstance('zh-TW')
    expect(i18n.t('common:tos.terms')).toBe('服務條款')
  })

  it('resolves the same key from a different locale', () => {
    const i18n = createI18nInstance('en')
    expect(i18n.t('common:tos.terms')).toBe('Terms of Service')
  })

  it('interpolates a validation message', () => {
    const i18n = createI18nInstance('en')
    expect(i18n.t('validation:authenticate.password.min', { min: 8 })).toBe(
      'Password must be at least 8 characters',
    )
  })

  it('creates independent instances per call', () => {
    const first = createI18nInstance('en')
    const second = createI18nInstance('zh-TW')
    expect(first.language).toBe('en')
    expect(second.language).toBe('zh-TW')
  })
})
