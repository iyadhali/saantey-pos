import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import OrderDetail from '~/pages/purchasing/orders/[id].vue'
import { MOCK_ORDERS } from '~/utils/mockData'

const { navigateToMock } = vi.hoisted(() => ({ navigateToMock: vi.fn() }))
mockNuxtImport('navigateTo', () => navigateToMock)

describe('Purchase Order Detail', () => {
  async function mountOrder(id: string) {
    return mountSuspended(OrderDetail, {
      route: `/purchasing/orders/${id}`,
    })
  }

  beforeEach(() => {
    navigateToMock.mockClear()
    const order = MOCK_ORDERS.find((o) => o.id === 'PO-8291')
    if (order) order.status = 'Sent'
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // Cycle 1 – tracer bullet: basic rendering
  it('renders the vendor name for a known order', async () => {
    const wrapper = await mountOrder('PO-8291')
    expect(wrapper.text()).toContain('Sysco Foods')
  })

  // Cycle 2 – no GST row
  it('does not show a GST row in the totals', async () => {
    const wrapper = await mountOrder('PO-8291')
    expect(wrapper.text()).not.toContain('GST')
  })

  // Cycle 3 – total equals subtotal (no tax)
  // PO-8291 items: 10×$4.50 + 5×$45.00 + 20×$18.50 = $640.00
  it('shows total equal to subtotal with no tax added', async () => {
    const wrapper = await mountOrder('PO-8291')
    const text = wrapper.text()
    // Both "Subtotal" and "Total" rows must show the same $640.00
    const matches = [...text.matchAll(/\$640\.00/g)]
    expect(matches.length).toBeGreaterThanOrEqual(2)
  })

  // Cycle 4 – edit button links to the edit route
  it('edit button links to /purchasing/orders/edit/<id>', async () => {
    const wrapper = await mountOrder('PO-8291')
    const editLink = wrapper.find('a[href*="/purchasing/orders/edit/PO-8291"]')
    expect(editLink.exists()).toBe(true)
  })

  // Cycle 5 – Close button is rendered
  it('renders a Close button', async () => {
    const wrapper = await mountOrder('PO-8291')
    const buttons = wrapper.findAll('button')
    const closeBtn = buttons.find((b) => b.text().includes('Close'))
    expect(closeBtn).toBeDefined()
  })

  // Cycle 6 – confirming Close sets order status to Closed
  it('clicking Close (confirmed) sets order status to Closed', async () => {
    vi.stubGlobal('confirm', () => true)
    const wrapper = await mountOrder('PO-8291')

    const buttons = wrapper.findAll('button')
    const closeBtn = buttons.find((b) => b.text().includes('Close'))
    await closeBtn!.trigger('click')

    const order = MOCK_ORDERS.find((o) => o.id === 'PO-8291')
    expect(order!.status).toBe('Closed')
  })

  // Cycle 7 – cancelling the confirm does not change status
  it('clicking Close (cancelled) leaves the order status unchanged', async () => {
    vi.stubGlobal('confirm', () => false)
    const wrapper = await mountOrder('PO-8291')

    const buttons = wrapper.findAll('button')
    const closeBtn = buttons.find((b) => b.text().includes('Close'))
    await closeBtn!.trigger('click')

    const order = MOCK_ORDERS.find((o) => o.id === 'PO-8291')
    expect(order!.status).toBe('Sent')
  })

  // Cycle 8 – Send button visible for Open status
  it('Send button visible for Open status', async () => {
    const order = MOCK_ORDERS.find((o) => o.id === 'PO-8292')
    if (order) order.status = 'Open'
    const wrapper = await mountOrder('PO-8292')
    const buttons = wrapper.findAll('button')
    const sendBtn = buttons.find((b) => b.text().includes('Send'))
    expect(sendBtn).toBeDefined()
  })

  // Cycle 9 – Receive button visible for Needs Receiving status and links to receive route
  it('Receive button visible for Needs Receiving status and links to receive route', async () => {
    const wrapper = await mountOrder('PO-8290')
    const receiveLink = wrapper.find('a[href*="/purchasing/orders/receive/PO-8290"]')
    expect(receiveLink.exists()).toBe(true)
  })

  // Cycle 10 – Receive button NOT visible for Closed status
  it('Receive button NOT visible for Closed status', async () => {
    const wrapper = await mountOrder('PO-8289')
    const links = wrapper.findAll('a')
    const receiveLink = links.find((a) => a.attributes('href')?.includes('/receive/'))
    expect(receiveLink).toBeUndefined()
  })

  // Cycle 11 – Create Invoice button visible for Sent status and links to invoice route
  it('Create Invoice button visible for Sent status and links to invoice route', async () => {
    const wrapper = await mountOrder('PO-8291')
    const invoiceLink = wrapper.find('a[href*="/purchasing/orders/invoice/PO-8291"]')
    expect(invoiceLink.exists()).toBe(true)
  })

  // Cycle 12 – Create Invoice NOT visible for Draft status
  it('Create Invoice NOT visible for Draft status', async () => {
    const order = MOCK_ORDERS.find((o) => o.id === 'PO-8292')
    if (order) order.status = 'Draft'
    const wrapper = await mountOrder('PO-8292')
    const links = wrapper.findAll('a')
    const invoiceLink = links.find((a) => a.attributes('href')?.includes('/invoice/'))
    expect(invoiceLink).toBeUndefined()
  })

  // Cycle 13 – Close button NOT visible for Closed status
  it('Close button NOT visible for Closed status', async () => {
    const wrapper = await mountOrder('PO-8289')
    const buttons = wrapper.findAll('button')
    const closeBtn = buttons.find((b) => b.text().includes('Close'))
    expect(closeBtn).toBeUndefined()
  })
})

describe('Purchase Order Detail – not found', () => {
  it('shows "Order not found" for an unknown PO id', async () => {
    const wrapper = await mountSuspended(OrderDetail, {
      route: '/purchasing/orders/PO-9999',
    })
    expect(wrapper.text()).toContain('Order not found')
  })
})
