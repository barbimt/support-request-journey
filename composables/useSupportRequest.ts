import type { SupportRequestForm } from '~/types/supportRequest'

export function useSupportRequest() {
  async function submitSupportRequest(_payload: SupportRequestForm): Promise<{ success: true }> {
    // Future: $fetch('/api/support-requests', { method: 'POST', body: payload })
    await new Promise((resolve) => setTimeout(resolve, 800))
    return { success: true }
  }

  return {
    submitSupportRequest,
  }
}
