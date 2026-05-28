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
  const { submitSupportRequest } = useSupportRequest()

  const form = reactive<SupportRequestForm>(createEmptySupportRequestForm())
  const errors = ref<ValidationError[]>([])
  const isSubmitting = ref(false)
  const submitSuccess = ref(false)
  const errorSummaryRef = ref<{ focus: () => void } | null>(null)

  const errorFor = (field: keyof SupportRequestForm): string | undefined =>
    getFieldError(errors.value, field)

  const handleSubmit = async (): Promise<void> => {
    submitSuccess.value = false
    errors.value = validateSupportRequest(form)

    if (errors.value.length) {
      await nextTick()
      errorSummaryRef.value?.focus()
      return
    }

    isSubmitting.value = true
    try {
      await submitSupportRequest({ ...form })
      submitSuccess.value = true
      Object.assign(form, createEmptySupportRequestForm())
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    form,
    errors,
    isSubmitting,
    submitSuccess,
    errorSummaryRef,
    supportForOptions: SUPPORT_FOR_OPTIONS,
    contactOptions: CONTACT_OPTIONS,
    errorFor,
    handleSubmit,
  }
}
