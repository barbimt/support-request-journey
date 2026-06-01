import { createEmptyServiceForm } from '~/constants/serviceForm'
import type { UseServiceFormOptions, UseServiceFormReturn } from '~/interfaces/composables/useServiceForm'
import type { ServiceForm, ServiceValidationError } from '~/interfaces/serviceForm'
import { getServiceFieldError } from '~/utils/formErrors'
import { scrollIntoView } from '~/utils/scrollIntoView'
import { validateService } from '~/utils/validateService'

export type { UseServiceFormOptions, UseServiceFormReturn } from '~/interfaces/composables/useServiceForm'

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

  const handleSubmit = async (): Promise<Service | null> => {
    submitSuccess.value = false
    successMessage.value = ''
    savedServiceId.value = null
    savedServiceTitle.value = ''
    serverError.value = ''
    errors.value = validateService(form)

    if (errors.value.length) {
      await nextTick()
      errorSummaryRef.value?.focus()
      return null
    }

    isSubmitting.value = true
    try {
      const result = isEditMode
        ? await updateService(options.serviceId!, { ...form })
        : await createService({ ...form })

      if (result.success) {
        submitSuccess.value = true
        savedServiceId.value = result.service.id
        savedServiceTitle.value = result.service.title
        successMessage.value = isEditMode
          ? `"${result.service.title}" has been updated.`
          : `"${result.service.title}" has been added.`

        if (!isEditMode) {
          Object.assign(form, createEmptyServiceForm())
        }

        if (options.scrollTarget) {
          await nextTick()
          scrollIntoView(options.scrollTarget.value)
        }

        return result.service
      }

      if ('validationErrors' in result && result.validationErrors.length) {
        errors.value = result.validationErrors
        await nextTick()
        errorSummaryRef.value?.focus()
        return null
      }

      if ('serverError' in result) {
        serverError.value = result.serverError
        await nextTick()
        serverErrorRef.value?.focus()
      }

      return null
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
