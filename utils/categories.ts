import type { ServiceCategory } from '~/interfaces/service'

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  housing: 'Housing',
  family: 'Family support',
  'mental-health': 'Mental health',
  send: 'SEND',
  'care-leavers': 'Care leavers',
}

export const ALL_CATEGORIES: ServiceCategory[] = [
  'housing',
  'family',
  'mental-health',
  'send',
  'care-leavers',
]

export const getCategoryLabel = (category: ServiceCategory): string => {
  return CATEGORY_LABELS[category]
}
