import type { Service, ServiceFilterOptions } from '~/interfaces/service'

export const filterServices = (services: Service[], options: ServiceFilterOptions): Service[] => {
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
