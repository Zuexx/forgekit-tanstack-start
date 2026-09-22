import type { TFunction } from 'i18next'
import { z } from 'zod'

const passwordsMatch = (data: { password: string; confirmPassword: string }) =>
  data.password === data.confirmPassword

export const signUpSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string('Confirm password is required'),
  })
  .refine(passwordsMatch, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  })

/**
 * The i18n-aware counterpart of signUpSchema, matching forgekit's createSignUpSchema(t)
 * shape exactly. sign-up-form.tsx (Task 7) switches to this; the plain schema above stays
 * as the non-translated fallback/reference shape sub-project 2 originally shipped.
 */
export const createSignUpSchema = (t: TFunction<'validation'>) =>
  z
    .object({
      name: z.string().min(1, t('authenticate.name.required')),
      email: z
        .email(t('authenticate.email.invalid'))
        .min(1, t('authenticate.email.required')),
      password: z
        .string()
        .min(8, t('authenticate.password.min', { min: 8 })),
      confirmPassword: z.string(t('authenticate.confirmPassword.required')),
    })
    .refine(passwordsMatch, {
      path: ['confirmPassword'],
      message: t('authenticate.confirmPassword.confirm'),
    })

export type SignUpInput = z.infer<typeof signUpSchema>
