import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import toast from 'react-hot-toast'

import { authClient } from '#/shared/api'

export function useSignOut() {
  const router = useRouter()

  return useMutation({
    mutationFn: () => authClient.signOut(),
    onSuccess: () => {
      toast.success('Signed out')
      router.navigate({ to: '/' })
    },
    onError: () => toast.error('Sign out failed'),
  })
}
