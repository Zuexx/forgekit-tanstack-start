import i18next from 'i18next'

import type { Locale } from './config'
import { DEFAULT_LOCALE, NAMESPACES } from './config'

import enAuth from './locales/en/auth.json'
import enCommon from './locales/en/common.json'
import enForm from './locales/en/form.json'
import enToast from './locales/en/toast.json'
import enValidation from './locales/en/validation.json'
import zhTWAuth from './locales/zh-TW/auth.json'
import zhTWCommon from './locales/zh-TW/common.json'
import zhTWForm from './locales/zh-TW/form.json'
import zhTWToast from './locales/zh-TW/toast.json'
import zhTWValidation from './locales/zh-TW/validation.json'
import koKRAuth from './locales/ko-KR/auth.json'
import koKRCommon from './locales/ko-KR/common.json'
import koKRForm from './locales/ko-KR/form.json'
import koKRToast from './locales/ko-KR/toast.json'
import koKRValidation from './locales/ko-KR/validation.json'

const resources = {
  en: {
    auth: enAuth,
    common: enCommon,
    form: enForm,
    toast: enToast,
    validation: enValidation,
  },
  'zh-TW': {
    auth: zhTWAuth,
    common: zhTWCommon,
    form: zhTWForm,
    toast: zhTWToast,
    validation: zhTWValidation,
  },
  'ko-KR': {
    auth: koKRAuth,
    common: koKRCommon,
    form: koKRForm,
    toast: koKRToast,
    validation: koKRValidation,
  },
}

/**
 * A fresh instance per call, not a shared module-level singleton — request isolation
 * matters here the same way it already does for this app's Zustand store (sub-project 1's
 * per-request StateProvider decision): a singleton would leak one visitor's locale into
 * another's concurrent SSR render.
 */
export function createI18nInstance(locale: Locale) {
  const instance = i18next.createInstance()
  void instance.init({
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    resources,
    ns: NAMESPACES,
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  })
  return instance
}
