import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PosHome from '~/pages/pos/index.vue'
import TableOrder from '~/pages/pos/table/[id].vue'

describe('POS Home', () => {
  it('renders table grid', async () => {
    const wrapper = await mountSuspended(PosHome)
    // Table names from MOCK_TABLES
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('2')
  })

  it('shows status indicators', async () => {
    const wrapper = await mountSuspended(PosHome)
    expect(wrapper.text()).toContain('Occupied')
    expect(wrapper.text()).toContain('Available')
  })

  it('uses POS layout', async () => {
    const wrapper = await mountSuspended(PosHome)
    // POS page should not have the sidebar nav
    expect(wrapper.text()).not.toContain('Saantey')
  })
})

describe('Table Order Entry', () => {
  it('renders table order page', async () => {
    const wrapper = await mountSuspended(TableOrder)
    expect(wrapper.text()).toContain('Table')
  })
})
