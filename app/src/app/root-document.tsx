import { HeadContent, Scripts } from '@tanstack/react-router'
import { QueryProvider, useSyncAuthSession } from '#/shared/api'
import { StateProvider } from '#/shared/state'

function AuthSessionSync({ children }: { children: React.ReactNode }) {
  useSyncAuthSession()
  return <>{children}</>
}

export function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {import.meta.env.DEV && (
          <script type="module" src="/@id/virtual:stylex:runtime" />
        )}
      </head>
      <body>
        <StateProvider>
          <QueryProvider>
            <AuthSessionSync>{children}</AuthSessionSync>
          </QueryProvider>
        </StateProvider>

        <Scripts />
      </body>
    </html>
  )
}
