import { createEmptyServiceForm } from '~/constants/serviceForm'
import type { CreateServiceResult } from '~/interfaces/composables/useServiceManagement'
import type { UseServiceFormOptions, UseServiceFormReturn } from '~/interfaces/composables/useServiceForm'
import type { Service } from '~/interfaces/service'
import type { ServiceForm, ServiceValidationError } from '~/interfaces/serviceForm'
import { getServiceFieldError } from '~/utils/formErrors'
import { scrollIntoView } from '~/utils/scrollIntoView'
import { validateService } from '~/utils/validateService'

export const useServiceForm = (options: UseServiceFormOptions = {}): UseServiceFormReturn => {
  const { createService, updateService } = useServiceManagement()
  const isEditMode = Boolean(options.serviceId)

  const form = reactive<ServiceForm>(
    options.initial ? { ...options.initial } : createEmptyServiceForm(),
  )
  const errors = ref<ServiceValidationError[]>([])
  const isSubmitting = ref(false)
  const submitSuccess = ref(false)
  const successMessage = ref('')
  const savedServiceId = ref<string | null>(null)
  const savedServiceTitle = ref('')
  const serverError = ref('')
  const errorSummaryRef = ref<{ focus: () => void } | null>(null)
  const serverErrorRef = ref<HTMLElement | null>(null)

  const errorFor = (field: keyof ServiceForm): string | undefined =>
    getServiceFieldError(errors.value, field)

  const resetSubmitState = (): void => {
    submitSuccess.value = false
    successMessage.value = ''
    savedServiceId.value = null
    savedServiceTitle.value = ''
    serverError.value = ''
  }

  const focusErrorSummary = async (): Promise<void> => {
    await nextTick()
    errorSummaryRef.value?.focus()
  }

  const focusServerError = async (): Promise<void> => {
    await nextTick()
    serverErrorRef.value?.focus()
  }

  const saveService = (): Promise<CreateServiceResult> =>
    isEditMode
      ? updateService(options.serviceId!, { ...form })
      : createService({ ...form })

  const applySuccess = async (service: Service): Promise<Service> => {
    submitSuccess.value = true
    savedServiceId.value = service.id
    savedServiceTitle.value = service.title
    successMessage.value = isEditMode
      ? `"${service.title}" has been updated.`
      : `"${service.title}" has been added.`

    if (!isEditMode) {
      Object.assign(form, createEmptyServiceForm())
    }

    if (options.scrollTarget) {
      await nextTick()
      scrollIntoView(options.scrollTarget.value)
    }

    return service
  }

  const applyMutationFailure = async (
    result: Extract<CreateServiceResult, { success: false }>,
  ): Promise<null> => {
    if ('validationErrors' in result && result.validationErrors.length) {
      errors.value = result.validationErrors
      await focusErrorSummary()
      return null
    }

    if ('serverError' in result) {
      serverError.value = result.serverError
      await focusServerError()
    }

    return null
  }

  const handleSubmit = async (): Promise<Service | null> => {
    resetSubmitState()
    errors.value = validateService(form)

    if (errors.value.length) {
      await focusErrorSummary()
      return null
    }

    isSubmitting.value = true
    try {
      const result = await saveService()

      return result.success
        ? await applySuccess(result.service)
        : await applyMutationFailure(result)
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    form,
    errors,
    isSubmitting,
    submitSuccess,
    successMessage,
    savedServiceId,
    savedServiceTitle,
    serverError,
    errorSummaryRef,
    serverErrorRef,
    errorFor,
    handleSubmit,
    isEditMode,
  }
}
