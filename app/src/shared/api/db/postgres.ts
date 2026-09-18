import './load-local-env'

import { Pool } from 'pg'

const databaseUrl = process.env.DATABASE_URL || ''

export const db = new Pool({
  connectionString: databaseUrl,
})
