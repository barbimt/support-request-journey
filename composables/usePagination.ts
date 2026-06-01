import type {
  UsePaginationOptions,
  UsePaginationReturn,
} from '~/interfaces/composables/usePagination'

const parsePageQuery = (raw: unknown): number => {
  const value = typeof raw === 'string' ? Number(raw) : Number.NaN

  if (!Number.isFinite(value) || value < 1) {
    return 1
  }

  return Math.floor(value)
}

export const usePagination = <T>(
  items: Ref<T[]>,
  pageSize = 8,
  options: UsePaginationOptions = {},
): UsePaginationReturn<T> => {
  const { syncQueryKey } = options
  const route = syncQueryKey ? useRoute() : null

  const localCurrentPage = ref(1)

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(items.value.length / pageSize)),
  )

  const currentPage = syncQueryKey && route
    ? computed(() => {
        const requestedPage = parsePageQuery(route.query[syncQueryKey])
        return Math.min(requestedPage, totalPages.value)
      })
    : localCurrentPage

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return items.value.slice(start, start + pageSize)
  })

  const rangeStart = computed(() => {
    if (!items.value.length) {
      return 0
    }

    return (currentPage.value - 1) * pageSize + 1
  })

  const rangeEnd = computed(() =>
    Math.min(currentPage.value * pageSize, items.value.length),
  )

  const goToPage = async (page: number): Promise<void> => {
    if (!syncQueryKey || !route) {
      localCurrentPage.value = Math.max(1, Math.min(page, totalPages.value))
      return
    }

    const normalizedPage = Math.max(1, Math.min(page, totalPages.value))
    const query = { ...route.query }

    if (normalizedPage <= 1) {
      delete query[syncQueryKey]
    } else {
      query[syncQueryKey] = String(normalizedPage)
    }

    await navigateTo({ path: route.path, query }, { replace: true })
  }

  watch(totalPages, (pages) => {
    if (syncQueryKey && route) {
      const requestedPage = parsePageQuery(route.query[syncQueryKey])

      if (requestedPage > pages) {
        void goToPage(pages)
      }

      return
    }

    if (localCurrentPage.value > pages) {
      localCurrentPage.value = pages
    }
  }, { immediate: true })

  const goToPreviousPage = (): void | Promise<void> => {
    return goToPage(currentPage.value - 1)
  }

  const goToNextPage = (): void | Promise<void> => {
    return goToPage(currentPage.value + 1)
  }

  const resetPage = (): void | Promise<void> => {
    return goToPage(1)
  }

  return {
    currentPage,
    totalPages,
    paginatedItems,
    rangeStart,
    rangeEnd,
    goToPreviousPage,
    goToNextPage,
    resetPage,
  }
}
