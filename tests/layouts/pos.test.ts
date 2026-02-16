import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PosLayout from '~/layouts/pos.vue'

describe('PosLayout', () => {
  it('renders without sidebar', async () => {
    const wrapper = await mountSuspended(PosLayout)
    expect(wrapper.find('aside').exists()).toBe(false)
  })

  it('renders full-screen content slot', async () => {
    const wrapper = await mountSuspended(PosLayout, {
      slots: {
        default: () => '<div>POS Content</div>',
      },
    })
    expect(wrapper.html()).toContain('POS Content')
  })
})
