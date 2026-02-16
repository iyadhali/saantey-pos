import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PurchasingHome from '~/pages/purchasing/index.vue'
import OrdersList from '~/pages/purchasing/orders/index.vue'
import InvoicesList from '~/pages/purchasing/invoices/index.vue'
import VendorsList from '~/pages/purchasing/vendors/index.vue'
import BillsList from '~/pages/purchasing/bills/index.vue'

describe('Purchasing Home', () => {
  it('renders "Purchasing" heading', async () => {
    const wrapper = await mountSuspended(PurchasingHome)
    expect(wrapper.text()).toContain('Purchasing')
  })

  it('renders KPI cards', async () => {
    const wrapper = await mountSuspended(PurchasingHome)
    expect(wrapper.text()).toContain('Weekly Spend')
  })

  it('renders quick action links', async () => {
    const wrapper = await mountSuspended(PurchasingHome)
    expect(wrapper.text()).toContain('Orders')
    expect(wrapper.text()).toContain('Invoices')
    expect(wrapper.text()).toContain('Vendors')
  })

  it('renders recent orders', async () => {
    const wrapper = await mountSuspended(PurchasingHome)
    expect(wrapper.text()).toContain('PO-8291')
  })
})

describe('Orders List', () => {
  it('renders "Purchase Orders" heading', async () => {
    const wrapper = await mountSuspended(OrdersList)
    expect(wrapper.text()).toContain('Purchase Orders')
  })

  it('renders New PO button', async () => {
    const wrapper = await mountSuspended(OrdersList)
    expect(wrapper.text()).toContain('New PO')
  })

  it('renders order rows', async () => {
    const wrapper = await mountSuspended(OrdersList)
    expect(wrapper.text()).toContain('PO-8291')
    expect(wrapper.text()).toContain('Sysco Foods')
  })

  it('renders status filter buttons', async () => {
    const wrapper = await mountSuspended(OrdersList)
    expect(wrapper.text()).toContain('All')
    expect(wrapper.text()).toContain('Sent')
    expect(wrapper.text()).toContain('Closed')
  })
})

describe('Invoices List', () => {
  it('renders "Invoices" heading', async () => {
    const wrapper = await mountSuspended(InvoicesList)
    expect(wrapper.text()).toContain('Invoices')
  })

  it('renders invoice rows', async () => {
    const wrapper = await mountSuspended(InvoicesList)
    expect(wrapper.text()).toContain('INV-2024-001')
    expect(wrapper.text()).toContain('Sysco Foods')
  })
})

describe('Vendors List', () => {
  it('renders "Vendors" heading', async () => {
    const wrapper = await mountSuspended(VendorsList)
    expect(wrapper.text()).toContain('Vendors')
  })

  it('renders vendor rows', async () => {
    const wrapper = await mountSuspended(VendorsList)
    expect(wrapper.text()).toContain('Sysco Foods')
    expect(wrapper.text()).toContain('Baldor Specialty')
  })
})

describe('Bills List', () => {
  it('renders "Bills" heading', async () => {
    const wrapper = await mountSuspended(BillsList)
    expect(wrapper.text()).toContain('Bills')
  })
})
