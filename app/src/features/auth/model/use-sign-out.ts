import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { authClient } from '#/shared/api'

export function useSignOut() {
  const router = useRouter()
  const { t } = useTranslation('toast')

  return useMutation({
    mutationFn: () => authClient.signOut(),
    onSuccess: (result) => {
      if (result.error) {
        toast.error(t('error.signOut'))
        return
      }
      toast.success(t('success.signOut'))
      router.navigate({ to: '/{-$locale}' })
    },
    onError: () => toast.error(t('error.signOut')),
  })
}
