import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import NotFound from '~/pages/[...slug].vue'

describe('404 Page', () => {
  it('renders 404 message', async () => {
    const wrapper = await mountSuspended(NotFound)
    expect(wrapper.text()).toContain('404')
    expect(wrapper.text()).toContain('Page not found')
  })

  it('renders back to dashboard link', async () => {
    const wrapper = await mountSuspended(NotFound)
    expect(wrapper.text()).toContain('Back to Dashboard')
  })
})
