import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import ReceivePage from '~/pages/purchasing/orders/receive/[id].vue'
import { MOCK_ORDERS, MOCK_RECEIVED_ITEMS } from '~/utils/mockData'

const { navigateToMock } = vi.hoisted(() => ({ navigateToMock: vi.fn() }))
mockNuxtImport('navigateTo', () => navigateToMock)

describe('Purchase Order Receive Page', () => {
  async function mountReceive(id: string) {
    return mountSuspended(ReceivePage, {
      route: `/purchasing/orders/receive/${id}`,
    })
  }

  beforeEach(() => {
    navigateToMock.mockClear()
    // Reset PO-8290 to Needs Receiving
    const order = MOCK_ORDERS.find((o) => o.id === 'PO-8290')
    if (order) order.status = 'Needs Receiving'
    delete MOCK_RECEIVED_ITEMS['PO-8290']
  })

  // Cycle 1 – receive page renders PO line items
  it('renders PO line items on the receive page', async () => {
    const wrapper = await mountReceive('PO-8290')
    expect(wrapper.text()).toContain('Ground Beef 80/20')
    expect(wrapper.text()).toContain('Ribeye Steaks')
  })

  // Cycle 2 – default received qty matches PO qty
  it('default received qty inputs are pre-filled with PO qty', async () => {
    const wrapper = await mountReceive('PO-8290')
    const inputs = wrapper.findAll('input[type="number"]')
    // PO-8290 has qty 100 and 50
    const values = inputs.map((i) => i.element.value)
    expect(values).toContain('100')
    expect(values).toContain('50')
  })

  // Cycle 3 – saving with all full qty sets PO status to Received
  it('saving with all full qty sets PO status to Received', async () => {
    const wrapper = await mountReceive('PO-8290')

    const buttons = wrapper.findAll('button')
    const saveBtn = buttons.find((b) => b.text().includes('Save Receiving'))
    await saveBtn!.trigger('click')

    const order = MOCK_ORDERS.find((o) => o.id === 'PO-8290')
    expect(order!.status).toBe('Received')
  })

  // Cycle 4 – saving with partial qty sets PO status to Partially Received
  it('saving with partial qty sets PO status to Partially Received', async () => {
    const wrapper = await mountReceive('PO-8290')

    // Set first input to a partial qty (less than PO qty of 100)
    const inputs = wrapper.findAll('input[type="number"]')
    const firstInput = inputs[0]
    await firstInput!.setValue('50')

    const buttons = wrapper.findAll('button')
    const saveBtn = buttons.find((b) => b.text().includes('Save Receiving'))
    await saveBtn!.trigger('click')

    const order = MOCK_ORDERS.find((o) => o.id === 'PO-8290')
    expect(order!.status).toBe('Partially Received')
  })
})
