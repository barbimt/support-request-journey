import type { Service } from '~/interfaces/service'
import type { ServiceForm } from '~/interfaces/serviceForm'

export type CreateServiceResult =
  | { success: true; service: Service }
  | { success: false; validationErrors: Array<{ field: keyof ServiceForm; message: string }> }
  | { success: false; serverError: string }

export type UpdateServiceResult = CreateServiceResult

export type DeleteServiceResult =
  | { success: true }
  | { success: false; notFound: true }
  | { success: false; serverError: string }

export interface UseServiceManagementReturn {
  createService: (payload: ServiceForm) => Promise<CreateServiceResult>
  updateService: (id: string, payload: ServiceForm) => Promise<UpdateServiceResult>
  deleteService: (id: string) => Promise<DeleteServiceResult>
}
