import { existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const DB_PATH = resolve(import.meta.dirname, '..', '.e2e-test.db')

for (const suffix of ['', '-wal', '-shm']) {
  const file = `${DB_PATH}${suffix}`
  if (existsSync(file)) rmSync(file)
}

process.env.SQLITE_DATABASE_PATH = DB_PATH
process.env.BETTER_AUTH_SECRET = 'e2e-test-secret-at-least-32-characters-long'
process.env.BETTER_AUTH_URL = 'http://localhost:4173'
process.env.Database__Provider = 'Sqlite'

const { auth } = await import('../src/shared/api/auth.server')
const { getMigrations } = await import('better-auth/db/migration')
// getMigrations logs its own "ERROR [Better Auth]: Database schema mismatch -- Missing tables"
// line here, every run, before creating them -- it's diagnosing the fresh, still-empty file
// deleted above, not reporting a real failure. Benign; runMigrations() below is what actually
// creates the tables, and every test run through this suite confirms they exist afterward.
const { runMigrations } = await getMigrations(auth.options)
await runMigrations()

console.log(`e2e test database migrated at ${DB_PATH}`)
