import {
  CONTACT_OPTIONS,
  SUPPORT_FOR_OPTIONS,
  createEmptySupportRequestForm,
} from '~/constants/supportRequestForm'
import type { UseSupportRequestFormReturn } from '~/interfaces/composables/useSupportRequestForm'
import type { SupportRequestForm, ValidationError } from '~/interfaces/supportRequest'
import { getFieldError } from '~/utils/formErrors'
import { validateSupportRequest } from '~/utils/validateSupportRequest'

export type { UseSupportRequestFormReturn } from '~/interfaces/composables/useSupportRequestForm'

export const useSupportRequestForm = (): UseSupportRequestFormReturn => {
  const route = useRoute()
  const { submitSupportRequest } = useSupportRequest()

  const form = reactive<SupportRequestForm>(createEmptySupportRequestForm())
  const errors = ref<ValidationError[]>([])
  const isSubmitting = ref(false)
  const submitSuccess = ref(false)
  const successMessage = ref('')
  const serverError = ref('')
  const errorSummaryRef = ref<{ focus: () => void } | null>(null)

  const errorFor = (field: keyof SupportRequestForm): string | undefined =>
    getFieldError(errors.value, field)

  const handleSubmit = async (): Promise<void> => {
    submitSuccess.value = false
    successMessage.value = ''
    serverError.value = ''
    errors.value = validateSupportRequest(form)

    if (errors.value.length) {
      await nextTick()
      errorSummaryRef.value?.focus()
      return
    }

    isSubmitting.value = true
    try {
      const serviceId = typeof route.query.service === 'string' ? route.query.service : undefined
      const result = await submitSupportRequest({ ...form }, serviceId)

      if (result.success) {
        submitSuccess.value = true
        successMessage.value = result.reference
          ? `${result.message} Your reference is ${result.reference}.`
          : result.message
        Object.assign(form, createEmptySupportRequestForm())
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
    supportForOptions: SUPPORT_FOR_OPTIONS,
    contactOptions: CONTACT_OPTIONS,
    errorFor,
    handleSubmit,
  }
}
