import type { ServiceCategory } from '~/interfaces/service'

export interface ServiceFiltersProps {
  search: string
  category: ServiceCategory | '' | 'all'
}

export interface ServiceFiltersEmits {
  'update:search': [value: string]
  'update:category': [value: ServiceCategory | '' | 'all']
}
