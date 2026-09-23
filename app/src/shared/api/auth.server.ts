// Both loaders are imported directly here rather than relied upon as a side effect of the
// db adapters below. normalizeProvider reads Database__Provider (from load-root-env), and the
// betterAuth config below reads BETTER_AUTH_SECRET, BETTER_AUTH_URL, BETTER_AUTH_ADMIN_USER_IDS,
// BETTER_AUTH_TRUSTED_ORIGINS, and the AZURE_AD_* vars (from load-local-env) — none of that can
// depend on postgres.ts/mssql.ts happening to import load-local-env themselves, since those
// imports could become conditional or lazy. dotenv's config does not override an already-set
// variable, so importing both loaders again here (postgres.ts and mssql.ts also import
// load-local-env) is always a safe no-op. Plain imports, not inline config() calls, per Task 1's
// Step 3 note on why this repo's import/first lint rule needs the side effect isolated this way.
import './db/load-root-env'
import './db/load-local-env'

import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { admin, customSession, jwt, openAPI } from 'better-auth/plugins'

import { AUTH_COOKIE } from '#/shared/lib/constants'

import { db as mssqlDb } from './db/mssql'
import { db as postgresDb } from './db/postgres'
import { db as sqliteDb } from './db/sqlite'

/**
 * Reads a comma-separated environment variable into a list.
 *
 * Used for settings that are per-deployment and must not be baked into the starter kit —
 * admin user ids and trusted origins are both values a fork has to supply.
 */
export function parseEnvList(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

/**
 * Normalises Database__Provider the same way the API's own
 * DatabaseProviderExtensions.NormalizeProvider does, so a value that resolves on one side
 * resolves identically on the other. Defaults to "sqlite", matching the API's DefaultProvider.
 */
export function normalizeProvider(
  value: string | undefined,
): 'sqlite' | 'postgres' | 'sqlserver' {
  const normalized = (value ?? '').trim().toLowerCase()
  switch (normalized) {
    case '':
    case 'sqlite':
      return 'sqlite'
    case 'postgres':
    case 'postgresql':
    case 'npgsql':
      return 'postgres'
    case 'sqlserver':
    case 'sql-server':
    case 'mssql':
      return 'sqlserver'
    default:
      throw new Error(
        `Unsupported database provider '${value}'. Supported providers: sqlite, postgres, sqlserver.`,
      )
  }
}

/**
 * The three adapters this kit ships need different shapes, and getting it wrong fails at
 * runtime rather than at compile time — Better Auth does not type-check this option.
 *
 * - postgres.ts exports a pg.Pool. Pass it directly; Better Auth builds the Kysely instance
 *   and detects the dialect itself.
 * - mssql.ts and sqlite.ts export a Kysely instance. Those need the wrapper:
 *   { db: kyselyInstance, type: "mssql" | "sqlite" as const }.
 */
const selectedProvider = normalizeProvider(process.env.Database__Provider)

export const database =
  selectedProvider === 'postgres'
    ? postgresDb
    : selectedProvider === 'sqlserver'
      ? { db: mssqlDb, type: 'mssql' as const }
      : { db: sqliteDb, type: 'sqlite' as const }

const microsoftClientId = process.env.AZURE_AD_CLIENT_ID
const microsoftTenantId = process.env.AZURE_AD_TENANT_ID
const microsoftClientSecret = process.env.AZURE_AD_CLIENT_SECRET
const microsoftProvider =
  microsoftClientId && microsoftTenantId && microsoftClientSecret
    ? {
        microsoft: {
          enabled: true,
          clientId: microsoftClientId,
          tenantId: microsoftTenantId,
          clientSecret: microsoftClientSecret,
          scope: ['User.Read'],
        },
      }
    : {}

const isProduction = process.env.NODE_ENV === 'production'

/**
 * Admin user ids come from the environment and default to none.
 *
 * A starter kit cannot ship a real id here: every fork would inherit it, and whoever held
 * that account in a fork's database would be an administrator of it.
 */
const adminUserIds = parseEnvList(process.env.BETTER_AUTH_ADMIN_USER_IDS)

/** Extra origins allowed to receive auth callbacks and redirects. baseURL is always trusted. */
const trustedOrigins = parseEnvList(process.env.BETTER_AUTH_TRUSTED_ORIGINS)

export const auth = betterAuth({
  database,
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: microsoftProvider,
  advanced: {
    cookiePrefix: AUTH_COOKIE,
    defaultCookieAttributes: {
      sameSite: 'lax',
      secure: isProduction,
      httpOnly: true,
    },
  },
  plugins: [
    admin({
      adminUserIds,
    }),
    openAPI({ disableDefaultReference: isProduction }),
    jwt({
      jwks: {
        disablePrivateKeyEncryption: false,
        keyPairConfig: {
          alg: 'RS256',
        },
      },
    }),
    customSession(async ({ user, session }) => {
      return {
        user: {
          ...user,
        },
        session,
      }
    }),
    // Must stay last — it forwards Set-Cookie into TanStack Start's own cookie-setting
    // mechanism, so any plugin whose after-hook sets a cookie has to run before it or that
    // cookie is dropped. Verified against a real dev server during this plan's design spike.
    tanstackStartCookies(),
  ],
})
