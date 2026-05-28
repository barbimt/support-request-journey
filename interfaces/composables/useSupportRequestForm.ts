import type { CONTACT_OPTIONS, SUPPORT_FOR_OPTIONS } from '~/constants/supportRequestForm'
import type { SupportRequestForm, ValidationError } from '~/interfaces/supportRequest'

export interface UseSupportRequestFormReturn {
  form: SupportRequestForm
  errors: Ref<ValidationError[]>
  isSubmitting: Ref<boolean>
  submitSuccess: Ref<boolean>
  successMessage: Ref<string>
  serverError: Ref<string>
  errorSummaryRef: Ref<{ focus: () => void } | null>
  supportForOptions: typeof SUPPORT_FOR_OPTIONS
  contactOptions: typeof CONTACT_OPTIONS
  errorFor: (field: keyof SupportRequestForm) => string | undefined
  handleSubmit: () => Promise<void>
}
