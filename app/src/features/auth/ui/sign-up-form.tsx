import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '#/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/shared/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '#/shared/ui/field'
import { Input } from '#/shared/ui/input'

import { useSignUp } from '../model/use-sign-up'
import { signUpSchema } from '../model/sign-up-schema'
import type { SignUpInput } from '../model/sign-up-schema'

export function SignUpForm() {
  const signUp = useSignUp()

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = (values: SignUpInput) => {
    signUp.mutate(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" type="text" {...form.register('name')} />
              {form.formState.errors.name && (
                <FieldDescription role="alert">
                  {form.formState.errors.name.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" {...form.register('email')} />
              {form.formState.errors.email && (
                <FieldDescription role="alert">
                  {form.formState.errors.email.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" {...form.register('password')} />
              {form.formState.errors.password && (
                <FieldDescription role="alert">
                  {form.formState.errors.password.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
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
              <Button type="submit">Create account</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
