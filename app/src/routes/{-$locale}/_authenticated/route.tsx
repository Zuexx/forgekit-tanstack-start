import { Outlet, createFileRoute } from '@tanstack/react-router'
import { create, props as stylexProps } from '@stylexjs/stylex'

import { useSignOut } from '#/features/auth'
import { AppHeader } from '#/shared/ui/app-header'
import { AppSidebar } from '#/shared/ui/app-sidebar'

export const Route = createFileRoute('/{-$locale}/_authenticated')({
  component: AuthenticatedLayout,
})

const styles = create({
  content: {
    padding: '1.5rem',
  },
  main: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    minWidth: 0,
  },
  shell: {
    display: 'flex',
    minHeight: '100vh',
  },
})

function AuthenticatedLayout() {
  const signOut = useSignOut()
  const shellProps = stylexProps(styles.shell)
  const mainProps = stylexProps(styles.main)
  const contentProps = stylexProps(styles.content)

  return (
    <div className={shellProps.className} style={shellProps.style}>
      <AppSidebar onSignOut={() => signOut.mutate()} />
      <div className={mainProps.className} style={mainProps.style}>
        <AppHeader />
        <main className={contentProps.className} style={contentProps.style}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
