import type { UseServiceManagementReturn } from '~/interfaces/composables/useServiceManagement'
import type { Service } from '~/interfaces/service'
import type { ServiceForm } from '~/interfaces/serviceForm'
import { mapServiceValidationErrors } from '~/utils/apiMappers'

export type { UseServiceManagementReturn } from '~/interfaces/composables/useServiceManagement'

const handleServiceMutationError = (error: unknown): {
  validationErrors?: Array<{ field: keyof ServiceForm; message: string }>
  serverError?: string
} => {
  if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 422) {
    const data = (error as { data?: { errors?: Record<string, string[]> } }).data

    return {
      validationErrors: mapServiceValidationErrors(data?.errors ?? {}),
    }
  }

  return {
    serverError: 'Something went wrong while saving the service. Please try again later.',
  }
}

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
      const result = handleServiceMutationError(error)

      if (result.validationErrors?.length) {
        return {
          success: false as const,
          validationErrors: result.validationErrors,
        }
      }

      return {
        success: false as const,
        serverError: result.serverError ?? 'Something went wrong while creating the service. Please try again later.',
      }
    }
  }

  const updateService = async (id: string, payload: ServiceForm) => {
    try {
      const service = await $fetch<Service>(`/api/services/${id}`, {
        method: 'PATCH',
        body: payload,
      })

      return {
        success: true as const,
        service,
      }
    } catch (error: unknown) {
      const result = handleServiceMutationError(error)

      if (result.validationErrors?.length) {
        return {
          success: false as const,
          validationErrors: result.validationErrors,
        }
      }

      return {
        success: false as const,
        serverError: result.serverError ?? 'Something went wrong while updating the service. Please try again later.',
      }
    }
  }

  const deleteService = async (id: string) => {
    try {
      await $fetch(`/api/services/${id}`, {
        method: 'DELETE',
      })

      return {
        success: true as const,
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
        return {
          success: false as const,
          notFound: true as const,
        }
      }

      return {
        success: false as const,
        serverError: 'Something went wrong while deleting the service. Please try again later.',
      }
    }
  }

  return {
    createService,
    updateService,
    deleteService,
  }
}
