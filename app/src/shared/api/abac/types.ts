export type Effect = 'allow' | 'redirect'

export interface Subject {
  isAuthenticated: boolean
}

export interface Resource {
  path: string
  isPublic: boolean
  isAuthRoute: boolean
}

export interface Environment {
  method: string
}

export interface AbacContext {
  subject: Subject
  resource: Resource
  environment: Environment
}

export interface PolicyDecision {
  effect: Effect
  to?: string
}

export interface AbacConfig {
  publicRoutes: string[]
  authRoutes: string[]
}
