import type { UseServiceListReturn } from '~/interfaces/composables/useServiceList'
import type { ServiceFilterOptions } from '~/interfaces/composables/useServices'
import type { Service, ServiceCategory } from '~/interfaces/service'

export type { UseServiceListReturn } from '~/interfaces/composables/useServiceList'

export const useServiceList = (): UseServiceListReturn => {
  const { getServices, filterServices } = useServices()

  const search = ref('')
  const category = ref<ServiceCategory | '' | 'all'>('all')
  const services = ref<Service[]>([])

  onMounted(async () => {
    services.value = await getServices()
  })

  const filteredServices = computed(() =>
    filterServices(services.value, {
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
