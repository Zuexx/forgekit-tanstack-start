/**
 * Better Auth's core schema (account/session/user/verification) plus the jwt plugin's
 * jwks table. Hand-maintained here rather than kysely-codegen output — the shape is fixed
 * by Better Auth's own migrations, not by anything project-specific.
 */
import type { ColumnType } from 'kysely'

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>

export interface Account {
  accessToken: string | null
  accessTokenExpiresAt: Date | null
  accountId: string
  createdAt: Generated<Date>
  id: string
  idToken: string | null
  password: string | null
  providerId: string
  refreshToken: string | null
  refreshTokenExpiresAt: Date | null
  scope: string | null
  updatedAt: Date
  userId: string
}

export interface Jwks {
  createdAt: Date
  expiresAt: Date | null
  id: string
  privateKey: string
  publicKey: string
}

export interface Session {
  createdAt: Generated<Date>
  expiresAt: Date
  id: string
  ipAddress: string | null
  token: string
  updatedAt: Date
  userAgent: string | null
  userId: string
}

export interface User {
  createdAt: Generated<Date>
  email: string
  emailVerified: number
  id: string
  image: string | null
  name: string
  updatedAt: Generated<Date>
}

export interface Verification {
  createdAt: Generated<Date>
  expiresAt: Date
  id: string
  identifier: string
  updatedAt: Generated<Date>
  value: string
}

export interface DB {
  account: Account
  jwks: Jwks
  session: Session
  user: User
  verification: Verification
}
