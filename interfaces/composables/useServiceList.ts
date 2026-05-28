import type { Service, ServiceCategory } from '~/interfaces/service'

export interface UseServiceListReturn {
  search: Ref<string>
  category: Ref<ServiceCategory | '' | 'all'>
  filteredServices: ComputedRef<Service[]>
}
