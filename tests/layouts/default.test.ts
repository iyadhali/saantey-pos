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

  it('renders outlet switcher with current outlet name', async () => {
    const wrapper = await mountSuspended(DefaultLayout)
    expect(wrapper.text()).toContain('Main Restaurant')
  })

  it('renders search button', async () => {
    const wrapper = await mountSuspended(DefaultLayout)
    expect(wrapper.text()).toContain('Search')
  })

  it('renders user menu with user name', async () => {
    const wrapper = await mountSuspended(DefaultLayout)
    expect(wrapper.text()).toContain('John Doe')
  })

  it('has slot for page content', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      slots: {
        default: () => '<div data-testid="page-content">Page Content</div>',
      },
    })
    expect(wrapper.html()).toContain('Page Content')
  })

  it('renders Point of Sale secondary nav', async () => {
    const wrapper = await mountSuspended(DefaultLayout)
    expect(wrapper.text()).toContain('Point of Sale')
  })
})
