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
