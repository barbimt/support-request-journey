import { SERVICES_PUBLIC_PAGE_SIZE } from '~/constants/serviceList'
import type { UseServiceListOptions, UseServiceListReturn } from '~/interfaces/composables/useServiceList'
import type { ServiceFilterOptions } from '~/interfaces/composables/useServices'
import type { Service, ServiceCategory } from '~/interfaces/service'
import { scrollIntoView } from '~/utils/scrollIntoView'

export type { UseServiceListOptions, UseServiceListReturn } from '~/interfaces/composables/useServiceList'

export const useServiceList = (options: UseServiceListOptions = {}): UseServiceListReturn => {
  const { getServices, filterServices } = useServices()

  const search = ref('')
  const category = ref<ServiceCategory | '' | 'all'>('all')

  const { data: services } = useAsyncData(
    'services',
    () => getServices(),
    { default: () => [] as Service[] },
  )

  const filteredServices = computed(() =>
    filterServices(services.value ?? [], {
      search: search.value,
      category: category.value,
    } satisfies ServiceFilterOptions),
  )

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedServices,
    rangeStart,
    rangeEnd,
    goToPreviousPage,
    goToNextPage,
    resetPage,
  } = usePagination(filteredServices, SERVICES_PUBLIC_PAGE_SIZE)

  watch([search, category], () => {
    resetPage()
  })

  const scrollToResults = (): void => {
    if (!options.scrollTarget) {
      return
    }

    nextTick(() => {
      scrollIntoView(options.scrollTarget?.value)
    })
  }

  const goToPreviousPageWithScroll = (): void => {
    goToPreviousPage()
    scrollToResults()
  }

  const goToNextPageWithScroll = (): void => {
    goToNextPage()
    scrollToResults()
  }

  return {
    search,
    category,
    filteredServices,
    paginatedServices,
    currentPage,
    totalPages,
    rangeStart,
    rangeEnd,
    goToPreviousPage: goToPreviousPageWithScroll,
    goToNextPage: goToNextPageWithScroll,
  }
}
