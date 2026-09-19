import { redirect } from '@tanstack/react-router'
import { getRequestHeaders } from '@tanstack/react-start/server'

import { auth } from './auth'

export async function requireSession() {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  })
  if (!session) {
    throw redirect({ to: '/sign-in' })
  }
  return session
}
