import { createEmptyServiceForm } from '~/constants/serviceForm'
import type { UseServiceFormReturn } from '~/interfaces/composables/useServiceForm'
import type { ServiceForm, ServiceValidationError } from '~/interfaces/serviceForm'
import { getServiceFieldError } from '~/utils/formErrors'
import { validateService } from '~/utils/validateService'

export type { UseServiceFormReturn } from '~/interfaces/composables/useServiceForm'

export const useServiceForm = (): UseServiceFormReturn => {
  const { createService } = useServiceManagement()

  const form = reactive<ServiceForm>(createEmptyServiceForm())
  const errors = ref<ServiceValidationError[]>([])
  const isSubmitting = ref(false)
  const submitSuccess = ref(false)
  const successMessage = ref('')
  const serverError = ref('')
  const errorSummaryRef = ref<{ focus: () => void } | null>(null)

  const errorFor = (field: keyof ServiceForm): string | undefined =>
    getServiceFieldError(errors.value, field)

  const handleSubmit = async (): Promise<boolean> => {
    submitSuccess.value = false
    successMessage.value = ''
    serverError.value = ''
    errors.value = validateService(form)

    if (errors.value.length) {
      await nextTick()
      errorSummaryRef.value?.focus()
      return false
    }

    isSubmitting.value = true
    try {
      const result = await createService({ ...form })

      if (result.success) {
        submitSuccess.value = true
        successMessage.value = `"${result.service.title}" has been added.`
        Object.assign(form, createEmptyServiceForm())
        return true
      }

      if ('validationErrors' in result && result.validationErrors.length) {
        errors.value = result.validationErrors
        await nextTick()
        errorSummaryRef.value?.focus()
        return false
      }

      if ('serverError' in result) {
        serverError.value = result.serverError
        await nextTick()
        errorSummaryRef.value?.focus()
      }

      return false
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
    serverError,
    errorSummaryRef,
    errorFor,
    handleSubmit,
  }
}
