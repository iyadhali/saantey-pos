import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import InventoryHome from '~/pages/inventory/index.vue'
import ItemLookup from '~/pages/inventory/lookup.vue'
import PostingsList from '~/pages/inventory/posting/index.vue'
import PostingNew from '~/pages/inventory/posting/new.vue'
import Worksheet from '~/pages/inventory/worksheet.vue'
import Waste from '~/pages/inventory/waste.vue'
import CountEntry from '~/pages/inventory/count.vue'

describe('Inventory Home', () => {
  it('renders "Inventory" heading', async () => {
    const wrapper = await mountSuspended(InventoryHome)
    expect(wrapper.text()).toContain('Inventory')
  })

  it('renders module navigation cards', async () => {
    const wrapper = await mountSuspended(InventoryHome)
    expect(wrapper.text()).toContain('Item Lookup')
    expect(wrapper.text()).toContain('Posting')
  })

  it('renders low stock alerts', async () => {
    const wrapper = await mountSuspended(InventoryHome)
    // Whole Milk has onHand: 12, par: 15, so it's below par
    expect(wrapper.text()).toContain('Whole Milk')
  })
})

describe('Item Lookup', () => {
  it('renders "Item Lookup" heading', async () => {
    const wrapper = await mountSuspended(ItemLookup)
    expect(wrapper.text()).toContain('Item Lookup')
  })

  it('renders inventory items', async () => {
    const wrapper = await mountSuspended(ItemLookup)
    expect(wrapper.text()).toContain('Whole Milk')
    expect(wrapper.text()).toContain('DAIRY-001')
  })

  it('renders category filter buttons', async () => {
    const wrapper = await mountSuspended(ItemLookup)
    expect(wrapper.text()).toContain('All')
    expect(wrapper.text()).toContain('Dairy')
    expect(wrapper.text()).toContain('Meat')
  })
})

describe('Postings List', () => {
  it('renders "Inventory Postings" heading', async () => {
    const wrapper = await mountSuspended(PostingsList)
    expect(wrapper.text()).toContain('Inventory Postings')
  })

  it('renders New Count button', async () => {
    const wrapper = await mountSuspended(PostingsList)
    expect(wrapper.text()).toContain('New Count')
  })

  it('renders posting rows', async () => {
    const wrapper = await mountSuspended(PostingsList)
    expect(wrapper.text()).toContain('CNT-2024-001')
  })
})

describe('New Posting', () => {
  it('renders "New Inventory Count" heading', async () => {
    const wrapper = await mountSuspended(PostingNew)
    expect(wrapper.text()).toContain('New Inventory Count')
  })
})

describe('Worksheet', () => {
  it('renders "Inventory Worksheet" heading', async () => {
    const wrapper = await mountSuspended(Worksheet)
    expect(wrapper.text()).toContain('Inventory Worksheet')
  })

  it('renders print button', async () => {
    const wrapper = await mountSuspended(Worksheet)
    expect(wrapper.text()).toContain('Print')
  })
})

describe('Waste Entry', () => {
  it('renders "Waste Log" heading', async () => {
    const wrapper = await mountSuspended(Waste)
    expect(wrapper.text()).toContain('Waste Log')
  })

  it('renders waste entry form fields', async () => {
    const wrapper = await mountSuspended(Waste)
    expect(wrapper.text()).toContain('Type')
    expect(wrapper.text()).toContain('Reason')
  })
})

describe('Count Entry', () => {
  it('renders "Weekly Count" heading', async () => {
    const wrapper = await mountSuspended(CountEntry)
    expect(wrapper.text()).toContain('Weekly Count')
  })

  it('renders inventory items to count', async () => {
    const wrapper = await mountSuspended(CountEntry)
    expect(wrapper.text()).toContain('Whole Milk')
  })
})
