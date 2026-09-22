import type { TFunction } from 'i18next'
import { z } from 'zod'

export const signInSchema = z.object({
  email: z.email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

/**
 * The i18n-aware counterpart of signInSchema, matching forgekit's createSignInSchema(t)
 * shape exactly. sign-in-form.tsx (Task 7) switches to this; the plain schema above stays
 * as the non-translated fallback/reference shape sub-project 2 originally shipped.
 */
export const createSignInSchema = (t: TFunction<'validation'>) =>
  signInSchema.extend({
    email: z
      .email(t('authenticate.email.invalid'))
      .min(1, t('authenticate.email.required')),
    password: z
      .string()
      .min(8, t('authenticate.password.min', { min: 8 })),
  })

export type SignInInput = z.infer<typeof signInSchema>
