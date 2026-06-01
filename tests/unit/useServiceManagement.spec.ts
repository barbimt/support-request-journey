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

  it('updates a service through the Nuxt endpoint', async () => {
    mockFetch.mockResolvedValueOnce({
      id: '42',
      title: 'Updated wellbeing hub',
      category: 'family',
      description: 'Drop-in support for families.',
      eligibility: '',
      contactEmail: 'hub@example.com',
      phone: '',
      openingHours: '',
      accessibilityNotes: '',
      onlineSupport: true,
    })

    const { updateService } = useServiceManagement()
    const payload = {
      title: 'Updated wellbeing hub',
      category: 'family' as const,
      description: 'Drop-in support for families.',
      eligibility: '',
      contactEmail: 'hub@example.com',
      phone: '',
      openingHours: '',
      accessibilityNotes: '',
      onlineSupport: true,
    }
    const result = await updateService('42', payload)

    expect(mockFetch).toHaveBeenCalledWith('/api/services/42', {
      method: 'PATCH',
      body: payload,
    })
    expect(result.success).toBe(true)
  })

  it('deletes a service through the Nuxt endpoint', async () => {
    mockFetch.mockResolvedValueOnce({ success: true })

    const { deleteService } = useServiceManagement()
    const result = await deleteService('42')

    expect(mockFetch).toHaveBeenCalledWith('/api/services/42', {
      method: 'DELETE',
    })
    expect(result.success).toBe(true)
  })
})
