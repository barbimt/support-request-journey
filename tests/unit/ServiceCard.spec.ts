import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ServiceCard from '~/components/ServiceCard.vue'
import { mockServices } from '~/data/services'

describe('ServiceCard', () => {
  it('renders title, category and detail link', async () => {
    const service = mockServices[0]
    const wrapper = await mountSuspended(ServiceCard, {
      props: { service },
    })

    expect(wrapper.text()).toContain(service.title)
    expect(wrapper.text()).toContain('Housing')
    const link = wrapper.get('a')
    expect(link.attributes('href')).toBe(`/services/${service.id}`)
  })
})
