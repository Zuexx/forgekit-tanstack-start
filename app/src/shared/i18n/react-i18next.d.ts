import 'react-i18next'

import type auth from './locales/en/auth.json'
import type common from './locales/en/common.json'
import type form from './locales/en/form.json'
import type toast from './locales/en/toast.json'
import type validation from './locales/en/validation.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      auth: typeof auth
      common: typeof common
      form: typeof form
      toast: typeof toast
      validation: typeof validation
    }
  }
}
