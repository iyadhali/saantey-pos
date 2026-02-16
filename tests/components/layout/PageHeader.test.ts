import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PageHeader from '~/components/layout/PageHeader.vue'

describe('PageHeader', () => {
  it('renders title text', async () => {
    const wrapper = await mountSuspended(PageHeader, {
      props: { title: 'Dashboard' },
    })
    expect(wrapper.text()).toContain('Dashboard')
  })

  it('renders optional subtitle', async () => {
    const wrapper = await mountSuspended(PageHeader, {
      props: { title: 'Dashboard', subtitle: 'Welcome back' },
    })
    expect(wrapper.text()).toContain('Welcome back')
  })

  it('does not render subtitle when not provided', async () => {
    const wrapper = await mountSuspended(PageHeader, {
      props: { title: 'Dashboard' },
    })
    const subtitleEl = wrapper.find('[data-testid="page-header-subtitle"]')
    expect(subtitleEl.exists()).toBe(false)
  })

  it('renders actions slot', async () => {
    const wrapper = await mountSuspended(PageHeader, {
      props: { title: 'Orders' },
      slots: {
        actions: () => '<button>New Order</button>',
      },
    })
    expect(wrapper.text()).toContain('New Order')
  })
})
