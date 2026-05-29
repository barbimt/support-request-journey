import type { Service } from '~/interfaces/service'
import type { ServiceForm, ServiceValidationError } from '~/interfaces/serviceForm'

export interface UseServiceFormReturn {
  form: ServiceForm
  errors: Ref<ServiceValidationError[]>
  isSubmitting: Ref<boolean>
  submitSuccess: Ref<boolean>
  successMessage: Ref<string>
  serverError: Ref<string>
  errorSummaryRef: Ref<{ focus: () => void } | null>
  existingServices: Ref<Service[]>
  isLoadingServices: Ref<boolean>
  errorFor: (field: keyof ServiceForm) => string | undefined
  handleSubmit: () => Promise<void>
}
