<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui'

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

interface BillRow {
  id: string
  vendorName: string
  invoiceId: string
  billDate: string
  dueDate: string
  status: string
  total: number
}

const bills: BillRow[] = [
  { id: 'BILL-2024-001', vendorName: 'Sysco Foods', invoiceId: 'INV-2024-001', billDate: '2024-05-22', dueDate: '2024-06-22', status: 'Open', total: 1245.50 },
  { id: 'BILL-2024-002', vendorName: 'Baldor Specialty', invoiceId: 'INV-2024-002', billDate: '2024-05-23', dueDate: '2024-06-23', status: 'Paid', total: 450.00 },
  { id: 'BILL-2024-003', vendorName: 'Meat Packers Inc', invoiceId: 'INV-2024-003', billDate: '2024-05-24', dueDate: '2024-06-24', status: 'Overdue', total: 2300.75 },
]

const columns: TableColumn<BillRow>[] = [
  { accessorKey: 'id', header: 'Bill #' },
  { accessorKey: 'vendorName', header: 'Vendor' },
  { accessorKey: 'invoiceId', header: 'Invoice' },
  { accessorKey: 'billDate', header: 'Bill Date' },
  { accessorKey: 'dueDate', header: 'Due Date' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'total', header: 'Total', meta: { class: { th: 'text-right', td: 'text-right' } } },
]

const handleRowClick = (_e: Event, row: TableRow<BillRow>) => {
  navigateTo(`/purchasing/bills/${row.original.id}`)
}
</script>

<template>
  <UDashboardPanel id="bills">
    <template #header>
      <UDashboardNavbar title="Bills">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UTable :data="bills" :columns="columns" caption="Bills" @select="handleRowClick">
        <template #status-cell="{ row }">
          <CommonStatusBadge :status="row.original.status" />
        </template>
        <template #total-cell="{ row }">
          <span class="font-medium">{{ fmt(row.original.total) }}</span>
        </template>
        <template #invoiceId-cell="{ row }">
          <NuxtLink
            :to="`/purchasing/invoices/${row.original.invoiceId}`"
            class="text-primary hover:underline"
            @click.stop
          >
            {{ row.original.invoiceId }}
          </NuxtLink>
        </template>
      </UTable>
    </template>
  </UDashboardPanel>
</template>
