import { describe, expect, it } from 'vitest'
import { makeQueryClient } from './query-client'

describe('makeQueryClient', () => {
  it('returns a configured QueryClient instance', () => {
    const queryClient = makeQueryClient()
    expect(queryClient.getDefaultOptions().queries?.staleTime).toBe(0)
  })

  it('returns a new instance on every call (no shared singleton)', () => {
    expect(makeQueryClient()).not.toBe(makeQueryClient())
  })
})
