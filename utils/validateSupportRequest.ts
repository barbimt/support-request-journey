import type { SupportRequestForm, ValidationError } from '~/types/supportRequest'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[\d\s+()-]{7,20}$/

export function validateSupportRequest(form: SupportRequestForm): ValidationError[] {
  const errors: ValidationError[] = []

  if (!form.fullName.trim()) {
    errors.push({ field: 'fullName', message: 'Enter your full name.' })
  } else if (form.fullName.trim().length < 2) {
    errors.push({ field: 'fullName', message: 'Full name must be at least 2 characters.' })
  }

  if (!form.email.trim()) {
    errors.push({ field: 'email', message: 'Enter your email address.' })
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.push({ field: 'email', message: 'Enter a valid email address.' })
  }

  if (form.phone.trim() && !PHONE_PATTERN.test(form.phone.trim())) {
    errors.push({ field: 'phone', message: 'Enter a valid phone number or leave this field blank.' })
  }

  if (!form.supportFor) {
    errors.push({ field: 'supportFor', message: 'Select who you are asking support for.' })
  }

  if (!form.supportType) {
    errors.push({ field: 'supportType', message: 'Select the type of support needed.' })
  }

  if (!form.preferredContact) {
    errors.push({ field: 'preferredContact', message: 'Select a preferred contact method.' })
  }

  if (!form.message.trim()) {
    errors.push({ field: 'message', message: 'Enter a message describing what you need.' })
  } else if (form.message.trim().length < 20) {
    errors.push({ field: 'message', message: 'Message must be at least 20 characters.' })
  }

  if (!form.consent) {
    errors.push({ field: 'consent', message: 'You must agree before we can process your request.' })
  }

  return errors
}
