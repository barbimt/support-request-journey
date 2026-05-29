import type { Service } from '~/interfaces/service'
import type { ServiceForm } from '~/interfaces/serviceForm'

export interface CreateServiceResult =
  | { success: true; service: Service }
  | { success: false; validationErrors: Array<{ field: keyof ServiceForm; message: string }> }
  | { success: false; serverError: string }

export interface UseServiceManagementReturn {
  createService: (payload: ServiceForm) => Promise<CreateServiceResult>
}
