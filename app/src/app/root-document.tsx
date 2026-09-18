import { HeadContent, Scripts } from '@tanstack/react-router'

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
        {children}

        <Scripts />
      </body>
    </html>
  )
}
