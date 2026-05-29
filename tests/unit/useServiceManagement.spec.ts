import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useServiceManagement } from '~/composables/useServiceManagement'

const mockFetch = vi.fn()

vi.stubGlobal('$fetch', mockFetch)

describe('useServiceManagement', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('sends service data through the Nuxt endpoint', async () => {
    mockFetch.mockResolvedValueOnce({
      id: '42',
      title: 'Family wellbeing hub',
      category: 'family',
      description: 'Drop-in support for families.',
      eligibility: '',
      contactEmail: 'hub@example.com',
      phone: '',
      openingHours: '',
      accessibilityNotes: '',
      onlineSupport: true,
    })

    const { createService } = useServiceManagement()
    const result = await createService({
      title: 'Family wellbeing hub',
      category: 'family',
      description: 'Drop-in support for families.',
      eligibility: '',
      contactEmail: 'hub@example.com',
      phone: '',
      openingHours: '',
      accessibilityNotes: '',
      onlineSupport: true,
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/services', {
      method: 'POST',
      body: {
        title: 'Family wellbeing hub',
        category: 'family',
        description: 'Drop-in support for families.',
        eligibility: '',
        contactEmail: 'hub@example.com',
        phone: '',
        openingHours: '',
        accessibilityNotes: '',
        onlineSupport: true,
      },
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.service.title).toBe('Family wellbeing hub')
    }
  })
})
