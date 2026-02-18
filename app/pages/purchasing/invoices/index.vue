<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui'
import type { Invoice } from '~~/shared/types'
import { MOCK_INVOICES } from '~/utils/mockData'

const searchQuery = ref('')
const activeStatus = ref('All')

const statuses = ['All', 'Draft', 'Pending', 'Finalized', 'Rejected']

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const columns: TableColumn<Invoice>[] = [
  { accessorKey: 'id', header: 'Invoice #' },
  { accessorKey: 'vendorName', header: 'Vendor' },
  { accessorKey: 'poNumber', header: 'PO Number' },
  { accessorKey: 'invoiceDate', header: 'Invoice Date' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'subtotal', header: 'Subtotal', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'gst', header: 'GST', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'total', header: 'Total', meta: { class: { th: 'text-right', td: 'text-right' } } },
]

const filteredInvoices = computed(() => {
  return MOCK_INVOICES.filter((inv) => {
    const matchesSearch =
      !searchQuery.value ||
      inv.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      inv.vendorName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      inv.poNumber.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus =
      activeStatus.value === 'All' || inv.status === activeStatus.value
    return matchesSearch && matchesStatus
  })
})

const handleRowClick = (_e: Event, row: TableRow<Invoice>) => {
  navigateTo(`/purchasing/invoices/${row.original.id}`)
}
</script>

<template>
  <UDashboardPanel id="invoices">
    <template #header>
      <UDashboardNavbar title="Invoices">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-4">
        <UInput v-model="searchQuery" icon="i-lucide-search" placeholder="Search invoices..." aria-label="Search invoices" class="flex-1 max-w-sm" />
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="status in statuses"
            :key="status"
            class="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors"
            :class="
              activeStatus === status
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-(--color-card) text-(--color-muted-foreground) border-(--color-border) hover:bg-(--color-accent)'
            "
            @click="activeStatus = status"
          >
            {{ status }}
          </button>
        </div>
      </div>

      <!-- Table -->
      <UTable :data="filteredInvoices" :columns="columns" caption="Invoices" empty="No invoices found matching your criteria." @select="handleRowClick">
        <template #status-cell="{ row }">
          <CommonStatusBadge :status="row.original.status" />
        </template>
        <template #subtotal-cell="{ row }">
          {{ fmt(row.original.subtotal) }}
        </template>
        <template #gst-cell="{ row }">
          {{ fmt(row.original.gst) }}
        </template>
        <template #total-cell="{ row }">
          <span class="font-medium">{{ fmt(row.original.total) }}</span>
        </template>
      </UTable>
    </template>
  </UDashboardPanel>
</template>
