import type { ServiceCategory } from '~/interfaces/service'

export interface ServiceForm {
  title: string
  category: ServiceCategory | ''
  description: string
  eligibility: string
  contactEmail: string
  phone: string
  openingHours: string
  accessibilityNotes: string
  onlineSupport: boolean
}

export interface ServiceValidationError {
  field: keyof ServiceForm
  message: string
}
