import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { usePagination } from '~/composables/usePagination'

describe('usePagination', () => {
  it('returns the requested page of items', () => {
    const items = ref(['a', 'b', 'c', 'd', 'e'])
    const { paginatedItems, currentPage, totalPages } = usePagination(items, 2)

    expect(totalPages.value).toBe(3)
    expect(paginatedItems.value).toEqual(['a', 'b'])

    currentPage.value = 2
    expect(paginatedItems.value).toEqual(['c', 'd'])

    currentPage.value = 3
    expect(paginatedItems.value).toEqual(['e'])
  })

  it('moves to the last page when items shrink', async () => {
    const items = ref([1, 2, 3, 4, 5])
    const { currentPage, totalPages } = usePagination(items, 2)

    currentPage.value = 3
    items.value = [1, 2]
    await nextTick()

    expect(totalPages.value).toBe(1)
    expect(currentPage.value).toBe(1)
  })
})
