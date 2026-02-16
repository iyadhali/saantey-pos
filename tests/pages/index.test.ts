import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from '~/pages/index.vue'

describe('Dashboard Page', () => {
  it('renders "Dashboard" heading', async () => {
    const wrapper = await mountSuspended(IndexPage)
    expect(wrapper.text()).toContain('Dashboard')
  })

  it('renders Point of Sale module card', async () => {
    const wrapper = await mountSuspended(IndexPage)
    expect(wrapper.text()).toContain('Point of Sale')
  })

  it('renders Purchasing module card', async () => {
    const wrapper = await mountSuspended(IndexPage)
    expect(wrapper.text()).toContain('Purchasing')
  })

  it('renders Inventory module card', async () => {
    const wrapper = await mountSuspended(IndexPage)
    expect(wrapper.text()).toContain('Inventory')
  })

  it('renders Recipes module card', async () => {
    const wrapper = await mountSuspended(IndexPage)
    expect(wrapper.text()).toContain('Recipes')
  })

  it('renders Reports module card', async () => {
    const wrapper = await mountSuspended(IndexPage)
    expect(wrapper.text()).toContain('Reports')
  })

  it('renders Settings module card', async () => {
    const wrapper = await mountSuspended(IndexPage)
    expect(wrapper.text()).toContain('Settings')
  })

  it('shows module descriptions', async () => {
    const wrapper = await mountSuspended(IndexPage)
    expect(wrapper.text()).toContain('Floor plan, orders, and payments')
    expect(wrapper.text()).toContain('Manage orders, invoices, and vendors')
  })

  it('shows counter badges', async () => {
    const wrapper = await mountSuspended(IndexPage)
    expect(wrapper.text()).toContain('Active Tables')
    expect(wrapper.text()).toContain('Open Checks')
  })
})
