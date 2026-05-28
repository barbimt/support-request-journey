import type { SupportRequestForm } from '~/interfaces/supportRequest'

export interface UseSupportRequestReturn {
  submitSupportRequest: (payload: SupportRequestForm) => Promise<{ success: true }>
}
