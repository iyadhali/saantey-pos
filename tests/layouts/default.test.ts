import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DefaultLayout from '~/layouts/default.vue'

describe('DefaultLayout', () => {
  it('renders sidebar with "Saantey" logo text', async () => {
    const wrapper = await mountSuspended(DefaultLayout)
    expect(wrapper.text()).toContain('Saantey')
  })

  it('renders Dashboard nav item', async () => {
    const wrapper = await mountSuspended(DefaultLayout)
    expect(wrapper.text()).toContain('Dashboard')
  })

  it('renders Purchasing nav item', async () => {
    const wrapper = await mountSuspended(DefaultLayout)
    expect(wrapper.text()).toContain('Purchasing')
  })

  it('renders Inventory nav item', async () => {
    const wrapper = await mountSuspended(DefaultLayout)
    expect(wrapper.text()).toContain('Inventory')
  })

  it('renders Recipes nav item', async () => {
    const wrapper = await mountSuspended(DefaultLayout)
    expect(wrapper.text()).toContain('Recipes')
  })

  it('renders Settings nav item', async () => {
    const wrapper = await mountSuspended(DefaultLayout)
    expect(wrapper.text()).toContain('Settings')
  })

  it('renders context switcher with property name', async () => {
    const wrapper = await mountSuspended(DefaultLayout)
    expect(wrapper.text()).toContain('Maldives Resort & Spa')
  })

  it('has slot for page content', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      slots: {
        default: () => '<div data-testid="page-content">Page Content</div>',
      },
    })
    expect(wrapper.html()).toContain('Page Content')
  })
})
