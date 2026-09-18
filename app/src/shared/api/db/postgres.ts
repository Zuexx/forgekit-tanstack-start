import { config } from 'dotenv'
import { resolve } from 'path'

// Provider-specific connection details are app-scoped, unlike Database__Provider itself
// (loaded by sqlite.ts from the repo-root .env). A fork with a real Postgres deployment
// sets this in app/.env.local, not the shared root .env.
config({ path: resolve(process.cwd(), '.env.local') })

import { Pool } from 'pg'

const databaseUrl = process.env.DATABASE_URL || ''

export const db = new Pool({
  connectionString: databaseUrl,
})
