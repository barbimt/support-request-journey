import type { UseServicesReturn, ServiceFilterOptions } from '~/interfaces/composables/useServices'
import type { Service } from '~/interfaces/service'

export type { ServiceFilterOptions, UseServicesReturn } from '~/interfaces/composables/useServices'

export const useServices = (): UseServicesReturn => {
  const getServices = async (): Promise<Service[]> => {
    return await $fetch<Service[]>('/api/services')
  }

  const getServiceById = async (id: string): Promise<Service | null> => {
    try {
      return await $fetch<Service>(`/api/services/${id}`)
    } catch {
      return null
    }
  }

  const filterServices = (services: Service[], options: ServiceFilterOptions): Service[] => {
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
