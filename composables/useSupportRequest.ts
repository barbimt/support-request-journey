import type { UseSupportRequestReturn } from '~/interfaces/composables/useSupportRequest'
import type { SupportRequestForm } from '~/interfaces/supportRequest'

export type { UseSupportRequestReturn } from '~/interfaces/composables/useSupportRequest'

export const useSupportRequest = (): UseSupportRequestReturn => {
  const submitSupportRequest = async (_payload: SupportRequestForm): Promise<{ success: true }> => {
    // Future: $fetch('/api/support-requests', { method: 'POST', body: payload })
    await new Promise((resolve) => setTimeout(resolve, 800))
    return { success: true }
  }

  return {
    submitSupportRequest,
  }
}
