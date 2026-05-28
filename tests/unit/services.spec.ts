import { describe, expect, it } from 'vitest'
import { mockServices } from '~/data/services'
import { useServices } from '~/composables/useServices'

describe('services filtering', () => {
  it('filters services by search text', () => {
    const { filterServices } = useServices()

    const results = filterServices(mockServices, {
      search: 'mental',
      category: 'all',
    })

    expect(results).toHaveLength(1)
    expect(results[0]?.id).toBe('mental-health-support')
  })
})
