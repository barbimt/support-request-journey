import { mockServices } from '~/data/services'
import type { Service, ServiceCategory } from '~/types/service'

export interface ServiceFilterOptions {
  search: string
  category: ServiceCategory | '' | 'all'
}

export function useServices() {
  // Future: replace mockServices with $fetch('/api/services')
  async function getServices(): Promise<Service[]> {
    return mockServices
  }

  async function getServiceById(id: string): Promise<Service | null> {
    const services = await getServices()
    return services.find((service) => service.id === id) ?? null
  }

  function filterServices(services: Service[], options: ServiceFilterOptions): Service[] {
    const query = options.search.trim().toLowerCase()
    const category = options.category

    return services.filter((service) => {
      const matchesCategory =
        !category || category === 'all' || service.category === category

      const matchesSearch =
        !query ||
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.eligibility.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }

  return {
    getServices,
    getServiceById,
    filterServices,
  }
}
