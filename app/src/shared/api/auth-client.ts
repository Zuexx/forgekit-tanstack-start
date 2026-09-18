import { createAuthClient } from 'better-auth/react'
import { adminClient } from 'better-auth/client/plugins'

// No baseURL: this client only supports same-origin deployment today. Better Auth falls back to
// window.location.origin, which is correct for that shape — process.env.BETTER_AUTH_URL is
// always undefined here anyway (rolldown replaces process.env with {} in the browser bundle), so
// passing it was silently inert. Wire a VITE_-prefixed env var here if/when a split-origin
// deployment is actually needed.
export const authClient = createAuthClient({
  plugins: [adminClient()],
})
