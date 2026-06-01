import {
  CONTACT_OPTIONS,
  SUPPORT_FOR_OPTIONS,
  createEmptySupportRequestForm,
} from '~/constants/supportRequestForm'
import type {
  SubmitSupportRequestResult,
  SubmitSupportRequestSuccess,
} from '~/interfaces/composables/useSupportRequest'
import type { UseSupportRequestFormReturn } from '~/interfaces/composables/useSupportRequestForm'
import type { SupportRequestForm, ValidationError } from '~/interfaces/supportRequest'
import { getFieldError } from '~/utils/formErrors'
import { validateSupportRequest } from '~/utils/validateSupportRequest'

export const useSupportRequestForm = (): UseSupportRequestFormReturn => {
  const route = useRoute()
  const { submitSupportRequest } = useSupportRequest()

  const form = reactive<SupportRequestForm>(createEmptySupportRequestForm())
  const errors = ref<ValidationError[]>([])
  const isSubmitting = ref(false)
  const submitSuccess = ref(false)
  const successMessage = ref('')
  const serverError = ref('')
  const serverErrorRef = ref<HTMLElement | null>(null)
  const errorSummaryRef = ref<{ focus: () => void } | null>(null)

  const errorFor = (field: keyof SupportRequestForm): string | undefined =>
    getFieldError(errors.value, field)

  const resetSubmitState = (): void => {
    submitSuccess.value = false
    successMessage.value = ''
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

  const submitRequest = (): Promise<SubmitSupportRequestResult> => {
    const serviceId = typeof route.query.service === 'string' ? route.query.service : undefined
    return submitSupportRequest({ ...form }, serviceId)
  }

  const applySuccess = (result: SubmitSupportRequestSuccess): void => {
    submitSuccess.value = true
    successMessage.value = result.reference
      ? `${result.message} Your reference is ${result.reference}.`
      : result.message
    Object.assign(form, createEmptySupportRequestForm())
  }

  const applyMutationFailure = async (
    result: Extract<SubmitSupportRequestResult, { success: false }>,
  ): Promise<void> => {
    if ('validationErrors' in result && result.validationErrors.length) {
      errors.value = result.validationErrors
      await focusErrorSummary()
      return
    }

    if ('serverError' in result) {
      serverError.value = result.serverError
      await focusServerError()
    }
  }

  const handleSubmit = async (): Promise<void> => {
    resetSubmitState()
    errors.value = validateSupportRequest(form)

    if (errors.value.length) {
      await focusErrorSummary()
      return
    }

    isSubmitting.value = true
    try {
      const result = await submitRequest()

      if (result.success) {
        applySuccess(result)
        return
      }

      await applyMutationFailure(result)
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
    serverErrorRef,
    errorSummaryRef,
    supportForOptions: SUPPORT_FOR_OPTIONS,
    contactOptions: CONTACT_OPTIONS,
    errorFor,
    handleSubmit,
  }
}
