import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import ManageServicesPage from '~/pages/manage/services/index.vue'

const mockCreateService = vi.fn()

vi.mock('~/composables/useServiceManagement', () => ({
  useServiceManagement: () => ({
    createService: mockCreateService,
    deleteService: vi.fn(),
  }),
}))

vi.mock('~/composables/useServices', () => ({
  useServices: () => ({
    getServices: vi.fn().mockResolvedValue([]),
    getServiceById: vi.fn(),
    filterServices: vi.fn((services: unknown[]) => services ?? []),
  }),
}))

describe('manage services page', () => {
  it('shows validation errors when submitted empty', async () => {
    const wrapper = await mountSuspended(ManageServicesPage)

    await wrapper.get('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('There is a problem')
    expect(wrapper.text()).toContain('Enter a service title.')
    expect(mockCreateService).not.toHaveBeenCalled()
  })

  it('shows success message after valid submit', async () => {
    mockCreateService.mockResolvedValueOnce({
      success: true,
      service: {
        id: '99',
        title: 'Youth housing advice',
        category: 'housing',
        description: 'Support for young people facing housing issues.',
        eligibility: '',
        contactEmail: '',
        phone: '',
        openingHours: '',
        accessibilityNotes: '',
        onlineSupport: false,
      },
    })

    const wrapper = await mountSuspended(ManageServicesPage)

    await wrapper.get('#title').setValue('Youth housing advice')
    await wrapper.get('#category').setValue('housing')
    await wrapper.get('#description').setValue('Support for young people facing housing issues.')

    await wrapper.get('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockCreateService).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Youth housing advice',
        category: 'housing',
        description: 'Support for young people facing housing issues.',
      }),
    )
    expect(wrapper.text()).toContain('Youth housing advice')
    expect(wrapper.text()).toContain('has been added.')
    expect(wrapper.text()).toContain('View service details')
  })
})
