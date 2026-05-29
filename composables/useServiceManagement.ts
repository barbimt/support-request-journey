import type { UseServiceManagementReturn } from '~/interfaces/composables/useServiceManagement'
import type { Service } from '~/interfaces/service'
import type { ServiceForm } from '~/interfaces/serviceForm'
import { mapServiceValidationErrors } from '~/utils/apiMappers'

export type { UseServiceManagementReturn } from '~/interfaces/composables/useServiceManagement'

export const useServiceManagement = (): UseServiceManagementReturn => {
  const createService = async (payload: ServiceForm) => {
    try {
      const service = await $fetch<Service>('/api/services', {
        method: 'POST',
        body: payload,
      })

      return {
        success: true as const,
        service,
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 422) {
        const data = (error as { data?: { errors?: Record<string, string[]> } }).data

        return {
          success: false as const,
          validationErrors: mapServiceValidationErrors(data?.errors ?? {}),
        }
      }

      return {
        success: false as const,
        serverError: 'Something went wrong while creating the service. Please try again later.',
      }
    }
  }

  return {
    createService,
  }
}
