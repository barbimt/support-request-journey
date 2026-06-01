import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { mockServices } from '~/data/services'
import { useServices } from '~/composables/useServices'
import { usePagination } from '~/composables/usePagination'
import { MANAGE_SERVICES_PAGE_SIZE, SERVICES_PUBLIC_PAGE_SIZE } from '~/constants/serviceList'

describe('services filtering', () => {
  it('filters services by search text', () => {
    const { filterServices } = useServices()

    const results = filterServices([...mockServices], {
      search: 'mental',
      category: 'all',
    })

    expect(results).toHaveLength(1)
    expect(results[0]?.id).toBe('mental-health-support')
  })
})

describe('services list pagination', () => {
  it('returns six services per page on the public list', () => {
    const filteredServices = ref([...mockServices])
    const { paginatedItems, totalPages } = usePagination(
      filteredServices,
      SERVICES_PUBLIC_PAGE_SIZE,
    )

    expect(SERVICES_PUBLIC_PAGE_SIZE).toBe(6)
    expect(totalPages.value).toBe(Math.ceil(mockServices.length / SERVICES_PUBLIC_PAGE_SIZE))
    expect(paginatedItems.value).toHaveLength(
      Math.min(SERVICES_PUBLIC_PAGE_SIZE, mockServices.length),
    )
  })

  it('returns five services per page on the manage list', () => {
    expect(MANAGE_SERVICES_PAGE_SIZE).toBe(5)
  })
})
