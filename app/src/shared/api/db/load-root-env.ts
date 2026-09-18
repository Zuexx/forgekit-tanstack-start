import { config } from 'dotenv'
import { resolve } from 'node:path'

// Loads the one setting shared by the .NET API and Better Auth — Database__Provider —
// from the repo-root .env. A plain side-effecting import (not an inline function call)
// keeps every consumer's own import block free of the code-between-imports shape
// eslint's import/first rule rejects.
config({ path: resolve(process.cwd(), '..', '.env') })
