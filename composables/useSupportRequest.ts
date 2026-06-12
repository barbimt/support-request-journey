import { FetchError } from 'ofetch'
import type { UseSupportRequestReturn } from '~/interfaces/composables/useSupportRequest'
import type { SupportRequestForm } from '~/interfaces/supportRequest'
import { mapRailsValidationErrors } from '~/utils/apiMappers'

interface SupportRequestSuccessResponse {
  message: string
  reference: string
}

export const useSupportRequest = (): UseSupportRequestReturn => {
  const submitSupportRequest = async (
    payload: SupportRequestForm,
    serviceId?: string,
  ) => {
    try {
      const response = await $fetch<SupportRequestSuccessResponse>('/api/support-requests', {
        method: 'POST',
        body: {
          ...payload,
          serviceId,
        },
      })

      return {
        success: true as const,
        message: response.message,
        reference: response.reference,
      }
    } catch (error) {
      if (error instanceof FetchError && error.statusCode === 422) {
        return {
          success: false as const,
          validationErrors: mapRailsValidationErrors(error.data?.errors ?? {}),
        }
      }

      return {
        success: false as const,
        serverError: 'Something went wrong while sending your request. Please try again later.',
      }
    }
  }

  return {
    submitSupportRequest,
  }
}
