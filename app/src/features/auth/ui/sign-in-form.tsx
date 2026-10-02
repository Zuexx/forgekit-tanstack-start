import { zodResolver } from '@hookform/resolvers/zod'
import { create, props as stylexProps } from '@stylexjs/stylex'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '#/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/shared/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '#/shared/ui/field'
import { Input } from '#/shared/ui/input'
import { LocaleSwitcher } from '#/shared/ui/locale-switcher'
import { Logo, LogoMark } from '#/shared/ui/logo'
import { ThemeSwitcher } from '#/shared/ui/theme-switcher'

import { useSignIn } from '../model/use-sign-in'
import { useSocialSignIn } from '../model/use-social-sign-in'
import { createSignInSchema } from '../model/sign-in-schema'
import type { SignInInput } from '../model/sign-in-schema'

const styles = create({
  header: {
    position: 'relative',
  },
  switchers: {
    alignItems: 'center',
    display: 'flex',
    gap: '0.5rem',
    position: 'absolute',
    right: '0.5rem',
    top: '-1rem',
    zIndex: 10,
  },
  logo: {
    height: '3.5rem',
    width: 'auto',
  },
})

export function SignInForm() {
  const headerProps = stylexProps(styles.header)
  const switchersProps = stylexProps(styles.switchers)
  const logoProps = stylexProps(styles.logo)
  const signIn = useSignIn()
  const socialSignIn = useSocialSignIn()
  const { t } = useTranslation('validation')
  const { t: tAuth } = useTranslation('auth')
  const { t: tForm } = useTranslation('form')

  const form = useForm<SignInInput>({
    resolver: zodResolver(createSignInSchema(t)),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (values: SignInInput) => {
    signIn.mutate(values)
  }

  return (
    <Card>
      <CardHeader className={headerProps.className} style={headerProps.style}>
        <div className={switchersProps.className} style={switchersProps.style}>
          <ThemeSwitcher />
          <LocaleSwitcher />
        </div>
        <Logo
          className={logoProps.className}
          style={logoProps.style}
          role="img"
          aria-label="App Logo"
        />
        <CardTitle>{tAuth('signIn.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <Button type="button" variant="outline" onClick={socialSignIn.signIn}>
                <LogoMark aria-hidden="true" width={16} height={16} />
                {tAuth('signIn.loginWithSSO')}
              </Button>
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
              <FieldLabel htmlFor="password">{tForm('password.label')}</FieldLabel>
              <Input id="password" type="password" {...form.register('password')} />
              {form.formState.errors.password && (
                <FieldDescription role="alert">
                  {form.formState.errors.password.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <Button type="submit">{tAuth('signIn.loginButton')}</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
