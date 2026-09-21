import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '#/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/shared/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '#/shared/ui/field'
import { Input } from '#/shared/ui/input'
import { LocaleSwitcher } from '#/shared/ui/locale-switcher'

import { useSignUp } from '../model/use-sign-up'
import { createSignUpSchema } from '../model/sign-up-schema'
import type { SignUpInput } from '../model/sign-up-schema'

export function SignUpForm() {
  const signUp = useSignUp()
  const { t } = useTranslation('validation')
  const { t: tAuth } = useTranslation('auth')
  const { t: tForm } = useTranslation('form')

  const form = useForm<SignUpInput>({
    resolver: zodResolver(createSignUpSchema(t)),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = (values: SignUpInput) => {
    signUp.mutate(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tAuth('signUp.title')}</CardTitle>
        <LocaleSwitcher />
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">{tForm('fullName.label')}</FieldLabel>
              <Input id="name" type="text" {...form.register('name')} />
              {form.formState.errors.name && (
                <FieldDescription role="alert">
                  {form.formState.errors.name.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">{tForm('email.label')}</FieldLabel>
              <Input id="email" type="email" {...form.register('email')} />
              {form.formState.errors.email && (
                <FieldDescription role="alert">
                  {form.formState.errors.email.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">{tForm('signUp.password.label')}</FieldLabel>
              <Input id="password" type="password" {...form.register('password')} />
              {form.formState.errors.password && (
                <FieldDescription role="alert">
                  {form.formState.errors.password.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                {tForm('signUp.confirmPassword.label')}
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                {...form.register('confirmPassword')}
              />
              {form.formState.errors.confirmPassword && (
                <FieldDescription role="alert">
                  {form.formState.errors.confirmPassword.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <Button type="submit">{tAuth('signUp.createAccountButton')}</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
