import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import InvoiceDetail from '~/pages/purchasing/invoices/[id].vue'
import { MOCK_RECEIVED_ITEMS, MOCK_INVOICE_ITEMS } from '~/utils/mockData'

describe('Invoice Detail – 3-way match table', () => {
  async function mountInvoice(id: string) {
    return mountSuspended(InvoiceDetail, {
      route: `/purchasing/invoices/${id}`,
    })
  }

  beforeEach(() => {
    // Clear any test overrides
    delete MOCK_RECEIVED_ITEMS['PO-8291']
    delete MOCK_INVOICE_ITEMS['INV-2024-001']
  })

  // Cycle 1 – invoice detail shows "PO Qty" column header
  it('shows "PO Qty" column header', async () => {
    const wrapper = await mountInvoice('INV-2024-001')
    expect(wrapper.text()).toContain('PO Qty')
  })

  // Cycle 2 – invoice detail shows "Rcv Qty" column header
  it('shows "Rcv Qty" column header', async () => {
    const wrapper = await mountInvoice('INV-2024-001')
    expect(wrapper.text()).toContain('Rcv Qty')
  })

  // Cycle 3 – invoice detail shows "Inv Qty" column header
  it('shows "Inv Qty" column header', async () => {
    const wrapper = await mountInvoice('INV-2024-001')
    expect(wrapper.text()).toContain('Inv Qty')
  })

  // Cycle 4 – row with matching qty/cost shows success match badge
  it('row with matching qty/cost shows success match badge', async () => {
    // Set up invoice items matching PO items exactly for PO-8291
    MOCK_INVOICE_ITEMS['INV-2024-001'] = [
      { id: 1, name: 'Whole Milk', sku: 'DAIRY-001', quantity: 10, unit: 'GAL', cost: 4.50 },
    ]
    const wrapper = await mountInvoice('INV-2024-001')
    // Look for the success badge character or text
    const html = wrapper.html()
    // Success badge should be present (color="success")
    expect(html).toMatch(/success/)
  })

  // Cycle 5 – row with mismatched qty shows warning variance badge
  it('row with mismatched qty shows warning variance badge', async () => {
    // Set up invoice items with different qty than PO
    MOCK_INVOICE_ITEMS['INV-2024-001'] = [
      { id: 1, name: 'Whole Milk', sku: 'DAIRY-001', quantity: 5, unit: 'GAL', cost: 4.50 }, // PO has 10
    ]
    const wrapper = await mountInvoice('INV-2024-001')
    const html = wrapper.html()
    expect(html).toMatch(/warning/)
  })
})
