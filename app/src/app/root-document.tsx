import { HeadContent, Scripts } from '@tanstack/react-router'
import { QueryProvider } from '#/shared/api'

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
        <QueryProvider>{children}</QueryProvider>

        <Scripts />
      </body>
    </html>
  )
}
