import type { Service } from '~/interfaces/service'
import type { ServiceForm, ServiceValidationError } from '~/interfaces/serviceForm'

export interface UseServiceFormOptions {
  serviceId?: string
  initial?: ServiceForm
  scrollTarget?: Ref<HTMLElement | null>
}

export interface UseServiceFormReturn {
  form: ServiceForm
  errors: Ref<ServiceValidationError[]>
  isSubmitting: Ref<boolean>
  submitSuccess: Ref<boolean>
  successMessage: Ref<string>
  savedServiceId: Ref<string | null>
  savedServiceTitle: Ref<string>
  serverError: Ref<string>
  errorSummaryRef: Ref<{ focus: () => void } | null>
  serverErrorRef: Ref<HTMLElement | null>
  errorFor: (field: keyof ServiceForm) => string | undefined
  handleSubmit: () => Promise<Service | null>
  isEditMode: boolean
}
