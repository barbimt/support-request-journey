import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ServiceListLoadState from '~/components/molecules/ServiceListLoadState.vue'

describe('ServiceListLoadState', () => {
  it('shows loading message while fetching with no data', async () => {
    const wrapper = await mountSuspended(ServiceListLoadState, {
      props: {
        pending: true,
        error: false,
        hasData: false,
      },
    })

    expect(wrapper.text()).toContain('Loading services…')
  })

  it('shows retry message when fetch fails with no data', async () => {
    const wrapper = await mountSuspended(ServiceListLoadState, {
      props: {
        pending: false,
        error: true,
        hasData: false,
      },
    })

    expect(wrapper.text()).toContain('We could not load services right now.')
    expect(wrapper.find('button').text()).toContain('Try again')
  })

  it('renders nothing when data is already available', async () => {
    const wrapper = await mountSuspended(ServiceListLoadState, {
      props: {
        pending: false,
        error: true,
        hasData: true,
      },
    })

    expect(wrapper.text()).toBe('')
  })
})
