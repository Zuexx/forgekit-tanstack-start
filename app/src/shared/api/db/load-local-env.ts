import { config } from 'dotenv'
import { resolve } from 'node:path'

// Provider-specific connection details are app-scoped, unlike Database__Provider itself
// (loaded from the repo-root .env by load-root-env.ts). A fork with a real Postgres/SQL
// Server deployment sets this in app/.env.local, not the shared root .env.
config({ path: resolve(process.cwd(), '.env.local') })
