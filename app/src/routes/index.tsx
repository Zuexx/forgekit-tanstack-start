import { createFileRoute } from '@tanstack/react-router'

import { StyleXProbe } from '#/shared/styles/probe'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main>
      <h1>Welcome to TanStack Start</h1>
      <p>
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
      <StyleXProbe />
    </main>
  )
}
