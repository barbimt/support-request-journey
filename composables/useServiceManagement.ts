import { FetchError } from 'ofetch'
import type {
  CreateServiceResult,
  DeleteServiceResult,
  UseServiceManagementReturn,
} from '~/interfaces/composables/useServiceManagement'
import type { Service } from '~/interfaces/service'
import type { ServiceForm } from '~/interfaces/serviceForm'
import { mapServiceValidationErrors } from '~/utils/apiMappers'

const saveService = async (request: () => Promise<Service>): Promise<CreateServiceResult> => {
  try {
    return { success: true, service: await request() }
  } catch (error) {
    if (error instanceof FetchError && error.statusCode === 422) {
      const validationErrors = mapServiceValidationErrors(error.data?.errors ?? {})

      if (validationErrors.length) {
        return { success: false, validationErrors }
      }
    }

    return {
      success: false,
      serverError: 'Something went wrong while saving the service. Please try again later.',
    }
  }
}

export const useServiceManagement = (): UseServiceManagementReturn => {
  const createService = (payload: ServiceForm): Promise<CreateServiceResult> =>
    saveService(() => $fetch<Service>('/api/services', { method: 'POST', body: payload }))

  const updateService = (id: string, payload: ServiceForm): Promise<CreateServiceResult> =>
    saveService(() => $fetch<Service>(`/api/services/${id}`, { method: 'PATCH', body: payload }))

  const deleteService = async (id: string): Promise<DeleteServiceResult> => {
    try {
      await $fetch(`/api/services/${id}`, { method: 'DELETE' })
      return { success: true }
    } catch (error) {
      if (error instanceof FetchError && error.statusCode === 404) {
        return { success: false, notFound: true }
      }

      return {
        success: false,
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
