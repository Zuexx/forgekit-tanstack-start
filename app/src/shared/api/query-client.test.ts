import { describe, expect, it } from 'vitest'
import { queryClient } from './query-client'

describe('queryClient', () => {
  it('is a configured QueryClient instance', () => {
    expect(queryClient.getDefaultOptions().queries?.staleTime).toBe(0)
  })
})
