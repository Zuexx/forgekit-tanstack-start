import { config } from 'dotenv'
import { existsSync, mkdirSync } from 'fs'
import { Kysely, SqliteDialect } from 'kysely'
import { dirname, resolve as resolvePath } from 'path'

// Loads the one setting shared by the .NET API and Better Auth — Database__Provider — from
// the repo-root .env. This file's own path is app/src/shared/api/db/sqlite.ts, five levels
// below the repo root.
config({ path: resolvePath(process.cwd(), '..', '.env') })

import BetterSqlite3 from 'better-sqlite3'

import type { DB } from './types'

// Matches the API's default (<repo root>/data/forgekit.db). SQLITE_DATABASE_PATH is a
// separate setting from Database__Provider on purpose — this answers "where", that one
// answers "which".
const sqlitePath =
  process.env.SQLITE_DATABASE_PATH ??
  resolvePath(process.cwd(), '..', 'data', 'forgekit.db')

// Lazy, matching postgres.ts's Pool and mssql.ts's tarn pool: the file is not opened until a
// query actually runs. This module is imported unconditionally alongside the other two
// adapters (see auth.ts), so eager construction here would create/open the SQLite file even
// when a different provider is selected.
const dialect = new SqliteDialect({
  database: async () => {
    const dir = dirname(sqlitePath)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    const database = new BetterSqlite3(sqlitePath)
    // WAL lets one writer proceed concurrent with readers instead of locking the whole
    // file; busy_timeout makes a writer wait for a released lock instead of failing
    // immediately with SQLITE_BUSY — both matter because the API (EF Core) opens its own,
    // independent connection to this same file.
    database.pragma('journal_mode = WAL')
    database.pragma('busy_timeout = 5000')
    return database
  },
})

export const db = new Kysely<DB>({ dialect })
