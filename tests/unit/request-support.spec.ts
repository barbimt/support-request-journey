import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import RequestSupportPage from '~/pages/request-support.vue'

vi.mock('~/composables/useSupportRequest', () => ({
  useSupportRequest: () => ({
    submitSupportRequest: vi.fn().mockResolvedValue({
      success: true,
      message: 'Your support request has been submitted.',
      reference: 'SR-0001',
    }),
  }),
}))

describe('request support page', () => {
  it('shows validation errors when submitted empty', async () => {
    const wrapper = await mountSuspended(RequestSupportPage)

    await wrapper.get('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('There is a problem')
    expect(wrapper.text()).toContain('Enter your full name.')
  })

  it('shows success message after valid submit', async () => {
    const wrapper = await mountSuspended(RequestSupportPage)

    await wrapper.get('#fullName').setValue('Alex Taylor')
    await wrapper.get('#email').setValue('alex@example.com')
    await wrapper.get('#supportFor').setValue('myself')
    await wrapper.get('#supportType').setValue('housing')
    await wrapper.get('input[type="radio"][value="email"]').setValue(true)
    await wrapper.get('#message').setValue('I need advice about my tenancy agreement and next steps.')
    await wrapper.get('#consent').setValue(true)

    await wrapper.get('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Your support request has been submitted')
    expect(wrapper.text()).toContain('SR-0001')
  })
})
