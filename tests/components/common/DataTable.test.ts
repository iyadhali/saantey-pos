import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DataTable from '~/components/common/DataTable.vue'

describe('DataTable', () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
  ]

  const rows = [
    { id: '1', name: 'Item A', status: 'Active' },
    { id: '2', name: 'Item B', status: 'Draft' },
  ]

  it('renders column headers', async () => {
    const wrapper = await mountSuspended(DataTable, {
      props: { columns, rows },
    })
    expect(wrapper.text()).toContain('ID')
    expect(wrapper.text()).toContain('Name')
    expect(wrapper.text()).toContain('Status')
  })

  it('renders row data', async () => {
    const wrapper = await mountSuspended(DataTable, {
      props: { columns, rows },
    })
    expect(wrapper.text()).toContain('Item A')
    expect(wrapper.text()).toContain('Item B')
  })

  it('emits row-click event', async () => {
    const wrapper = await mountSuspended(DataTable, {
      props: { columns, rows },
    })
    const tableRows = wrapper.findAll('tbody tr')
    if (tableRows.length > 0) {
      await tableRows[0]?.trigger('click')
      expect(wrapper.emitted('row-click')).toBeTruthy()
    }
  })
})
