import { SERVICES_PUBLIC_PAGE_SIZE } from '~/constants/serviceList'
import type { UseServiceListOptions, UseServiceListReturn } from '~/interfaces/composables/useServiceList'
import type { ServiceFilterOptions } from '~/interfaces/composables/useServices'
import type { Service, ServiceCategory } from '~/interfaces/service'
import { scrollIntoView } from '~/utils/scrollIntoView'

export const useServiceList = (options: UseServiceListOptions = {}): UseServiceListReturn => {
  const { getServices, filterServices } = useServices()

  const search = ref('')
  const category = ref<ServiceCategory | '' | 'all'>('all')

  const { data: services, pending, error, refresh } = useAsyncData(
    'public-services',
    () => getServices(),
    { default: () => [] as Service[] },
  )

  const hasServices = computed(() => (services.value?.length ?? 0) > 0)
  const isLoadingServices = computed(() => pending.value && !hasServices.value)
  const servicesLoadError = computed(() => Boolean(error.value) && !hasServices.value)

  const retryLoad = async (): Promise<void> => {
    await refresh()
  }

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
    isLoadingServices,
    servicesLoadError,
    hasServices,
    retryLoad,
  }
}
