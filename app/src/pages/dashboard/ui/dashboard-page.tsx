import { useSignOut } from '#/features/auth'
import { Button } from '#/shared/ui/button'

interface DashboardPageProps {
  user: { name: string }
}

export function DashboardPage({ user }: DashboardPageProps) {
  const signOut = useSignOut()

  return (
    <main>
      <h1>Welcome, {user.name}</h1>
      <Button onClick={() => signOut.mutate()}>Sign out</Button>
    </main>
  )
}
