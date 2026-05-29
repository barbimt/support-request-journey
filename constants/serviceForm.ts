import type { ServiceForm } from '~/interfaces/serviceForm'

export const createEmptyServiceForm = (): ServiceForm => ({
  title: '',
  category: '',
  description: '',
  eligibility: '',
  contactEmail: '',
  phone: '',
  openingHours: '',
  accessibilityNotes: '',
  onlineSupport: false,
})
