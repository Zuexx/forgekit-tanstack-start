import './load-local-env'

import { Kysely, MssqlDialect } from 'kysely'
import * as tarn from 'tarn'
import * as tedious from 'tedious'

import type { DB } from './types'

// Do not throw on import. Values are read when a connection is created, not at module load —
// this module is imported unconditionally alongside sqlite.ts and postgres.ts (see auth.ts),
// so an unset env var here must not crash a deployment that selected a different provider.
const mssqlServer = process.env.MSSQL_SERVER || ''
const mssqlDatabase = process.env.MSSQL_DATABASE || ''
const mssqlUser = process.env.MSSQL_USER || ''
const mssqlPassword = process.env.MSSQL_PASSWORD || ''
const mssqlPort = Number(process.env.MSSQL_PORT ?? '1433')
const mssqlTrustServerCertificate =
  (process.env.MSSQL_TRUST_SERVER_CERT ?? 'true') === 'true'

const dialect = new MssqlDialect({
  tarn: {
    ...tarn,
    options: {
      min: 0,
      max: 10,
    },
  },
  tedious: {
    ...tedious,
    connectionFactory: () =>
      new tedious.Connection({
        authentication: {
          options: {
            userName: mssqlUser,
            password: mssqlPassword,
          },
          type: 'default',
        },
        server: mssqlServer,
        options: {
          database: mssqlDatabase,
          port: mssqlPort,
          trustServerCertificate: mssqlTrustServerCertificate,
        },
      }),
  },
})

export const db = new Kysely<DB>({ dialect })
