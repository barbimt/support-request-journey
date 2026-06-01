import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { usePagination } from '~/composables/usePagination'

const { route, navigateTo } = vi.hoisted(() => {
  const route = {
    path: '/services',
    query: {} as Record<string, string>,
  }
  const navigateTo = vi.fn().mockResolvedValue(undefined)

  return { route, navigateTo }
})

mockNuxtImport('useRoute', () => () => route)
mockNuxtImport('navigateTo', () => navigateTo)

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

  it('reads the current page from the route query', () => {
    route.query = { page: '2' }

    const items = ref(['a', 'b', 'c', 'd', 'e'])
    const { currentPage, paginatedItems } = usePagination(items, 2, { syncQueryKey: 'page' })

    expect(currentPage.value).toBe(2)
    expect(paginatedItems.value).toEqual(['c', 'd'])
  })

  it('navigates with navigateTo when changing page', async () => {
    route.query = { page: '2' }
    navigateTo.mockClear()

    const items = ref(['a', 'b', 'c', 'd', 'e'])
    const { goToNextPage } = usePagination(items, 2, { syncQueryKey: 'page' })

    await goToNextPage()

    expect(navigateTo).toHaveBeenCalledWith(
      { path: '/services', query: { page: '3' } },
      { replace: true },
    )
  })

  it('removes the page query when returning to page 1', async () => {
    route.query = { page: '2' }
    navigateTo.mockClear()

    const items = ref(['a', 'b', 'c', 'd', 'e'])
    const { resetPage } = usePagination(items, 2, { syncQueryKey: 'page' })

    await resetPage()

    expect(navigateTo).toHaveBeenCalledWith(
      { path: '/services', query: {} },
      { replace: true },
    )
  })

  it('corrects an out-of-range page in the route query', async () => {
    route.query = { page: '5' }
    navigateTo.mockClear()

    const items = ref(['a', 'b', 'c', 'd', 'e'])
    usePagination(items, 2, { syncQueryKey: 'page' })

    await nextTick()

    expect(navigateTo).toHaveBeenCalledWith(
      { path: '/services', query: { page: '3' } },
      { replace: true },
    )
  })
})
