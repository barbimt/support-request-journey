import type { Service, ServiceCategory } from '~/interfaces/service'

export interface ServiceFilterOptions {
  search: string
  category: ServiceCategory | '' | 'all'
}

export interface UseServicesReturn {
  getServices: () => Promise<Service[]>
  getServiceById: (id: string) => Promise<Service | null>
  filterServices: (services: Service[], options: ServiceFilterOptions) => Service[]
}
