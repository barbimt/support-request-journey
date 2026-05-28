import type { ServiceCategory } from '~/types/service'

export type PreferredContactMethod = 'email' | 'phone' | 'either'

export type SupportForOption =
  | 'myself'
  | 'family-member'
  | 'friend'
  | 'someone-i-support'
  | 'other'

export interface SupportRequestForm {
  fullName: string
  email: string
  phone: string
  supportFor: SupportForOption | ''
  supportType: ServiceCategory | ''
  preferredContact: PreferredContactMethod | ''
  message: string
  consent: boolean
}

export interface ValidationError {
  field: keyof SupportRequestForm
  message: string
}
