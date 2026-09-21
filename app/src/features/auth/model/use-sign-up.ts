import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { authClient } from '#/shared/api'

import type { SignUpInput } from './sign-up-schema'

export function useSignUp() {
  const router = useRouter()
  const { t } = useTranslation('toast')

  return useMutation({
    mutationFn: (input: SignUpInput) => authClient.signUp.email(input),
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error.message ?? t('error.signUp'))
        return
      }
      toast.success(t('success.signUp'))
      router.navigate({ to: '/{-$locale}/dashboard' })
    },
    onError: () => toast.error(t('error.signUp')),
  })
}
