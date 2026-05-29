import type { UseServiceListReturn } from '~/interfaces/composables/useServiceList'
import type { ServiceFilterOptions } from '~/interfaces/composables/useServices'
import type { Service, ServiceCategory } from '~/interfaces/service'

export type { UseServiceListReturn } from '~/interfaces/composables/useServiceList'

export const useServiceList = (): UseServiceListReturn => {
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

  return {
    search,
    category,
    filteredServices,
  }
}
