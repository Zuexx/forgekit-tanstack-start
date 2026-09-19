import { createFileRoute } from '@tanstack/react-router'

import { requireSession } from '#/shared/api/require-session'
import { DashboardPage } from '#/pages/dashboard'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const { user } = await requireSession()
    return { user }
  },
  component: () => {
    const { user } = Route.useRouteContext()
    return <DashboardPage user={user} />
  },
})
