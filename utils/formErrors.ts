import type { SupportRequestForm, ValidationError } from '~/interfaces/supportRequest'

export const getFieldError = (
  errors: ValidationError[],
  field: keyof SupportRequestForm,
): string | undefined => errors.find((entry) => entry.field === field)?.message
