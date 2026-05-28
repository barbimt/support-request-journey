import type { SupportRequestForm } from '~/interfaces/supportRequest'

export const SUPPORT_FOR_OPTIONS = [
  { value: 'myself', label: 'Myself' },
  { value: 'family-member', label: 'A family member' },
  { value: 'friend', label: 'A friend' },
  { value: 'someone-i-support', label: 'Someone I support professionally' },
  { value: 'other', label: 'Someone else' },
] as const

export const CONTACT_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'either', label: 'Either email or phone' },
] as const

export const createEmptySupportRequestForm = (): SupportRequestForm => ({
  fullName: '',
  email: '',
  phone: '',
  supportFor: '',
  supportType: '',
  preferredContact: '',
  message: '',
  consent: false,
})
