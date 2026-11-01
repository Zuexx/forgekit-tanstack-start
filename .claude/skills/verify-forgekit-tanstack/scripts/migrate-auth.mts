// Creates the Better Auth tables in $SQLITE_DATABASE_PATH: what app/e2e/migrate-test-db.ts
// does, minus its fixed path and its delete-first step, since vf.sh hands it a fresh per-run
// file. Run from app/ with tsx.
//
// Goes through auth.$context rather than importing better-auth/db/migration: this file lives
// outside app/, so a bare package import would resolve from here and find nothing.
const { auth } = await import('../../../../app/src/shared/api/auth.server')
const context = await auth.$context
await context.runMigrations()

console.log(`auth schema migrated at ${process.env.SQLITE_DATABASE_PATH}`)
