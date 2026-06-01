export interface UsePaginationReturn<T> {
  currentPage: Ref<number>
  totalPages: ComputedRef<number>
  paginatedItems: ComputedRef<T[]>
  rangeStart: ComputedRef<number>
  rangeEnd: ComputedRef<number>
  goToPreviousPage: () => void
  goToNextPage: () => void
  resetPage: () => void
}

export const usePagination = <T>(
  items: Ref<T[]>,
  pageSize = 8,
): UsePaginationReturn<T> => {
  const currentPage = ref(1)

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(items.value.length / pageSize)),
  )

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

  watch(totalPages, (pages) => {
    if (currentPage.value > pages) {
      currentPage.value = pages
    }
  })

  const goToPreviousPage = (): void => {
    currentPage.value = Math.max(1, currentPage.value - 1)
  }

  const goToNextPage = (): void => {
    currentPage.value = Math.min(totalPages.value, currentPage.value + 1)
  }

  const resetPage = (): void => {
    currentPage.value = 1
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
