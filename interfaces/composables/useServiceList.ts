import type { Service, ServiceCategory } from '~/interfaces/service'

export interface UseServiceListOptions {
  scrollTarget?: Ref<HTMLElement | null>
}

export interface UseServiceListReturn {
  search: Ref<string>
  category: Ref<ServiceCategory | '' | 'all'>
  filteredServices: ComputedRef<Service[]>
  paginatedServices: ComputedRef<Service[]>
  currentPage: Ref<number>
  totalPages: ComputedRef<number>
  rangeStart: ComputedRef<number>
  rangeEnd: ComputedRef<number>
  goToPreviousPage: () => void
  goToNextPage: () => void
}
