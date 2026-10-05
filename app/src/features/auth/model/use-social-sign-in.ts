import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { authClient } from '#/shared/api'
import { buildLocale, withLocalePrefix } from '#/shared/i18n'

/**
 * Better Auth's client manages the OAuth redirect itself — simpler than forgekit's manual
 * window.location.href to a Hono-wrapped endpoint, which this repo's architecture doesn't
 * have (sub-project 1 decided against a BFF layer).
 */
export function useSocialSignIn() {
  const { t } = useTranslation('toast')

  return {
    signIn: async () => {
      // Without an explicit callbackURL, better-auth's OAuth redirect lands back on "/" --
      // unlike useSignIn/useSignUp's explicit router.navigate to the dashboard after an
      // email/password success, this flow never reaches app code between leaving for the
      // provider and coming back, so there's no onSuccess handler to put that navigation in.
      const { locale } = buildLocale(window.location.pathname, undefined, undefined)
      const result = await authClient.signIn.social({
        provider: 'microsoft',
        callbackURL: withLocalePrefix('/dashboard', locale),
      })
      if (result.error) {
        toast.error(result.error.message ?? t('error.signIn'))
      }
    },
  }
}
