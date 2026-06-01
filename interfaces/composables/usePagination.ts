export interface UsePaginationOptions {
  syncQueryKey?: string
}

export interface UsePaginationReturn<T> {
  currentPage: Ref<number>
  totalPages: ComputedRef<number>
  paginatedItems: ComputedRef<T[]>
  rangeStart: ComputedRef<number>
  rangeEnd: ComputedRef<number>
  goToPreviousPage: () => void | Promise<void>
  goToNextPage: () => void | Promise<void>
  resetPage: () => void | Promise<void>
}
