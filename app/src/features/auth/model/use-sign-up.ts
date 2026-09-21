import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import toast from 'react-hot-toast'

import { authClient } from '#/shared/api'

import type { SignUpInput } from './sign-up-schema'

export function useSignUp() {
  const router = useRouter()

  return useMutation({
    mutationFn: (input: SignUpInput) => authClient.signUp.email(input),
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error.message ?? 'Sign up failed')
        return
      }
      toast.success('Account created')
      router.navigate({ to: '/{-$locale}/dashboard' })
    },
    onError: () => toast.error('Sign up failed'),
  })
}
