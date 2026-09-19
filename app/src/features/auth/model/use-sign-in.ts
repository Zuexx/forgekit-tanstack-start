import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import toast from 'react-hot-toast'

import { authClient } from '#/shared/api'

import type { SignInInput } from './sign-in-schema'

export function useSignIn() {
  const router = useRouter()

  return useMutation({
    mutationFn: (input: SignInInput) => authClient.signIn.email(input),
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error.message ?? 'Sign in failed')
        return
      }
      toast.success('Signed in')
      router.navigate({ to: '/dashboard' })
    },
    onError: () => toast.error('Sign in failed'),
  })
}
