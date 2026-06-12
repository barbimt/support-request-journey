export type ServiceCategory =
  | 'housing'
  | 'family'
  | 'mental-health'
  | 'send'
  | 'care-leavers'

export interface ServiceFilterOptions {
  search: string
  category: ServiceCategory | '' | 'all'
}

export interface Service {
  id: string
  title: string
  category: ServiceCategory
  description: string
  eligibility: string
  contactEmail: string
  phone: string
  openingHours: string
  accessibilityNotes: string
  onlineSupport: boolean
}
