import { HeadContent, Scripts, useRouteContext } from '@tanstack/react-router'
import { useMemo } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Toaster } from 'react-hot-toast'

import { QueryProvider, useSyncAuthSession } from '#/shared/api'
import { StateProvider } from '#/shared/state'
import { createI18nInstance } from '#/shared/i18n'

function AuthSessionSync({ children }: { children: React.ReactNode }) {
  useSyncAuthSession()
  return <>{children}</>
}

function I18nProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useRouteContext({ from: '__root__' })
  const i18n = useMemo(() => createI18nInstance(locale), [locale])
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

const THEME_FLASH_PREVENTION_SCRIPT = `(function() {
  try {
    var stored = localStorage.getItem('forgekit-tanstack-start.theme');
    var theme = stored === 'dark' || stored === 'light'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();`

export function RootDocument({ children }: { children: React.ReactNode }) {
  const { locale } = useRouteContext({ from: '__root__' })

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <HeadContent />
        {import.meta.env.DEV && (
          <script type="module" src="/@id/virtual:stylex:runtime" />
        )}
        <script dangerouslySetInnerHTML={{ __html: THEME_FLASH_PREVENTION_SCRIPT }} />
      </head>
      <body>
        <StateProvider>
          <QueryProvider>
            <I18nProvider>
              <AuthSessionSync>{children}</AuthSessionSync>
            </I18nProvider>
          </QueryProvider>
        </StateProvider>
        <Toaster position="bottom-right" />

        <Scripts />
      </body>
    </html>
  )
}
