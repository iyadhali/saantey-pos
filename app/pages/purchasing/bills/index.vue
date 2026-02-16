<script setup lang="ts">
const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const bills = [
  { id: 'BILL-2024-001', vendorName: 'Sysco Foods', invoiceId: 'INV-2024-001', billDate: '2024-05-22', dueDate: '2024-06-22', status: 'Open', total: 1245.50 },
  { id: 'BILL-2024-002', vendorName: 'Baldor Specialty', invoiceId: 'INV-2024-002', billDate: '2024-05-23', dueDate: '2024-06-23', status: 'Paid', total: 450.00 },
  { id: 'BILL-2024-003', vendorName: 'Meat Packers Inc', invoiceId: 'INV-2024-003', billDate: '2024-05-24', dueDate: '2024-06-24', status: 'Overdue', total: 2300.75 },
]

const columns = [
  { key: 'id', label: 'Bill #' },
  { key: 'vendorName', label: 'Vendor' },
  { key: 'invoiceId', label: 'Invoice' },
  { key: 'billDate', label: 'Bill Date' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'status', label: 'Status' },
  { key: 'total', label: 'Total', class: 'text-right' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleRowClick = (row: Record<string, any>) => {
  navigateTo(`/purchasing/bills/${row.id}`)
}
</script>

<template>
  <div class="space-y-6">
    <LayoutPageHeader title="Bills" subtitle="Track payments and outstanding balances" />

    <CommonDataTable :columns="columns" :rows="bills" @row-click="handleRowClick">
      <template #cell-status="{ value }">
        <CommonStatusBadge :status="value" />
      </template>
      <template #cell-total="{ value }">
        <span class="font-medium">{{ fmt(value) }}</span>
      </template>
      <template #cell-invoiceId="{ value }">
        <NuxtLink
          :to="`/purchasing/invoices/${value}`"
          class="text-primary hover:underline"
          @click.stop
        >
          {{ value }}
        </NuxtLink>
      </template>
    </CommonDataTable>
  </div>
</template>
