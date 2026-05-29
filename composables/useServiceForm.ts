import { createEmptyServiceForm } from '~/constants/serviceForm'
import type { UseServiceFormReturn } from '~/interfaces/composables/useServiceForm'
import type { Service } from '~/interfaces/service'
import type { ServiceForm, ServiceValidationError } from '~/interfaces/serviceForm'
import { getServiceFieldError } from '~/utils/formErrors'
import { validateService } from '~/utils/validateService'

export type { UseServiceFormReturn } from '~/interfaces/composables/useServiceForm'

export const useServiceForm = (): UseServiceFormReturn => {
  const { createService } = useServiceManagement()
  const { getServices } = useServices()

  const form = reactive<ServiceForm>(createEmptyServiceForm())
  const errors = ref<ServiceValidationError[]>([])
  const isSubmitting = ref(false)
  const submitSuccess = ref(false)
  const successMessage = ref('')
  const serverError = ref('')
  const errorSummaryRef = ref<{ focus: () => void } | null>(null)
  const existingServices = ref<Service[]>([])
  const isLoadingServices = ref(true)

  const errorFor = (field: keyof ServiceForm): string | undefined =>
    getServiceFieldError(errors.value, field)

  const loadExistingServices = async (): Promise<void> => {
    isLoadingServices.value = true
    try {
      existingServices.value = await getServices()
    } catch {
      existingServices.value = []
    } finally {
      isLoadingServices.value = false
    }
  }

  onMounted(() => {
    void loadExistingServices()
  })

  const handleSubmit = async (): Promise<void> => {
    submitSuccess.value = false
    successMessage.value = ''
    serverError.value = ''
    errors.value = validateService(form)

    if (errors.value.length) {
      await nextTick()
      errorSummaryRef.value?.focus()
      return
    }

    isSubmitting.value = true
    try {
      const result = await createService({ ...form })

      if (result.success) {
        submitSuccess.value = true
        successMessage.value = `"${result.service.title}" has been added.`
        Object.assign(form, createEmptyServiceForm())
        await loadExistingServices()
        return
      }

      if ('validationErrors' in result && result.validationErrors.length) {
        errors.value = result.validationErrors
        await nextTick()
        errorSummaryRef.value?.focus()
        return
      }

      if ('serverError' in result) {
        serverError.value = result.serverError
        await nextTick()
        errorSummaryRef.value?.focus()
      }
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
    existingServices,
    isLoadingServices,
    errorFor,
    handleSubmit,
  }
}
