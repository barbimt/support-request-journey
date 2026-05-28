import type { Service, ServiceCategory } from '~/interfaces/service'
import type { SupportRequestForm, ValidationError } from '~/interfaces/supportRequest'

export interface RailsService {
  id: number
  title: string
  category: string
  description: string
  eligibility: string
  contact_email: string
  phone: string
  opening_hours: string
  accessibility_notes: string
  online_support: boolean
}

export interface RailsValidationErrors {
  message: string
  errors: Record<string, string[]>
}

const SUPPORT_REQUEST_FIELD_MAP: Record<string, keyof SupportRequestForm> = {
  full_name: 'fullName',
  email: 'email',
  phone: 'phone',
  requester_type: 'supportFor',
  support_type: 'supportType',
  preferred_contact_method: 'preferredContact',
  message: 'message',
  consent: 'consent',
}

export const mapRailsServiceToService = (railsService: RailsService): Service => ({
  id: String(railsService.id),
  title: railsService.title,
  category: railsService.category as ServiceCategory,
  description: railsService.description,
  eligibility: railsService.eligibility,
  contactEmail: railsService.contact_email,
  phone: railsService.phone,
  openingHours: railsService.opening_hours,
  accessibilityNotes: railsService.accessibility_notes,
  onlineSupport: railsService.online_support,
})

export const mapSupportRequestFormToRails = (form: SupportRequestForm, serviceId?: string) => ({
  support_request: {
    full_name: form.fullName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    requester_type: form.supportFor,
    support_type: form.supportType,
    preferred_contact_method: form.preferredContact,
    message: form.message.trim(),
    consent: form.consent,
    ...(serviceId ? { service_id: Number(serviceId) } : {}),
  },
})

export const mapRailsValidationErrors = (
  errors: Record<string, string[]>,
): ValidationError[] =>
  Object.entries(errors).flatMap(([field, messages]) => {
    const mappedField = SUPPORT_REQUEST_FIELD_MAP[field]

    if (!mappedField) {
      return []
    }

    return messages.map((message) => ({
      field: mappedField,
      message,
    }))
  })
