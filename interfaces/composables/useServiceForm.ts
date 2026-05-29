import type { ServiceForm, ServiceValidationError } from '~/interfaces/serviceForm'

export interface UseServiceFormReturn {
  form: ServiceForm
  errors: Ref<ServiceValidationError[]>
  isSubmitting: Ref<boolean>
  submitSuccess: Ref<boolean>
  successMessage: Ref<string>
  serverError: Ref<string>
  errorSummaryRef: Ref<{ focus: () => void } | null>
  errorFor: (field: keyof ServiceForm) => string | undefined
  handleSubmit: () => Promise<boolean>
}
