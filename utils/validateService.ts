import type { ServiceForm, ServiceValidationError } from '~/interfaces/serviceForm'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[\d\s+()-]{7,20}$/

export const validateService = (form: ServiceForm): ServiceValidationError[] => {
  const errors: ServiceValidationError[] = []

  if (!form.title.trim()) {
    errors.push({ field: 'title', message: 'Enter a service title.' })
  }

  if (!form.category) {
    errors.push({ field: 'category', message: 'Select a category.' })
  }

  if (!form.description.trim()) {
    errors.push({ field: 'description', message: 'Enter a description.' })
  }

  if (form.contactEmail.trim() && !EMAIL_PATTERN.test(form.contactEmail.trim())) {
    errors.push({ field: 'contactEmail', message: 'Enter a valid email address or leave this field blank.' })
  }

  if (form.phone.trim() && !PHONE_PATTERN.test(form.phone.trim())) {
    errors.push({ field: 'phone', message: 'Enter a valid phone number or leave this field blank.' })
  }

  return errors
}
