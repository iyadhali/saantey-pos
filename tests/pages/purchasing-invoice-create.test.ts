import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import InvoiceCreatePage from '~/pages/purchasing/orders/invoice/[id].vue'
import { MOCK_ORDERS, MOCK_INVOICES } from '~/utils/mockData'

const { navigateToMock } = vi.hoisted(() => ({ navigateToMock: vi.fn() }))
mockNuxtImport('navigateTo', () => navigateToMock)

describe('Invoice Creation from PO', () => {
  const initialInvoiceCount = MOCK_INVOICES.length

  async function mountInvoiceCreate(id: string) {
    return mountSuspended(InvoiceCreatePage, {
      route: `/purchasing/orders/invoice/${id}`,
    })
  }

  beforeEach(() => {
    navigateToMock.mockClear()
    // Reset PO-8290 status
    const order = MOCK_ORDERS.find((o) => o.id === 'PO-8290')
    if (order) order.status = 'Needs Receiving'
    // Remove any invoices added during tests
    while (MOCK_INVOICES.length > initialInvoiceCount) {
      MOCK_INVOICES.shift()
    }
  })

  // Cycle 1 – invoice creation page shows vendor name from PO
  it('shows vendor name from PO', async () => {
    const wrapper = await mountInvoiceCreate('PO-8290')
    expect(wrapper.text()).toContain('Meat Packers Inc')
  })

  // Cycle 2 – invoice creation page shows PO line items pre-filled
  it('shows PO line items pre-filled', async () => {
    const wrapper = await mountInvoiceCreate('PO-8290')
    expect(wrapper.text()).toContain('Ground Beef 80/20')
    expect(wrapper.text()).toContain('Ribeye Steaks')
  })

  // Cycle 3 – saving adds new entry to MOCK_INVOICES with correct poNumber
  it('saving adds new invoice with correct poNumber', async () => {
    const wrapper = await mountInvoiceCreate('PO-8290')
    const countBefore = MOCK_INVOICES.length

    const buttons = wrapper.findAll('button')
    const createBtn = buttons.find((b) => b.text().includes('Create Invoice'))
    await createBtn!.trigger('click')

    expect(MOCK_INVOICES.length).toBe(countBefore + 1)
    expect(MOCK_INVOICES[0]!.poNumber).toBe('PO-8290')
  })

  // Cycle 4 – saving sets PO status to Closed
  it('saving sets PO status to Closed', async () => {
    const wrapper = await mountInvoiceCreate('PO-8290')

    const buttons = wrapper.findAll('button')
    const createBtn = buttons.find((b) => b.text().includes('Create Invoice'))
    await createBtn!.trigger('click')

    const order = MOCK_ORDERS.find((o) => o.id === 'PO-8290')
    expect(order!.status).toBe('Closed')
  })

  // Cycle 5 – new invoice total includes GST (total > subtotal)
  it('new invoice total includes GST (total > subtotal)', async () => {
    const wrapper = await mountInvoiceCreate('PO-8290')

    const buttons = wrapper.findAll('button')
    const createBtn = buttons.find((b) => b.text().includes('Create Invoice'))
    await createBtn!.trigger('click')

    const newInvoice = MOCK_INVOICES[0]
    expect(newInvoice).toBeDefined()
    expect(newInvoice!.total).toBeGreaterThan(newInvoice!.subtotal)
    expect(newInvoice!.gst).toBeGreaterThan(0)
  })
})
