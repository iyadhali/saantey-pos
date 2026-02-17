<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { MOCK_INVOICES } from '~/utils/mockData'

const searchQuery = ref('')
const activeStatus = ref('All')

const statuses = ['All', 'Draft', 'Pending', 'Finalized', 'Rejected']

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const columns = [
  { key: 'id', label: 'Invoice #' },
  { key: 'vendorName', label: 'Vendor' },
  { key: 'poNumber', label: 'PO Number' },
  { key: 'invoiceDate', label: 'Invoice Date' },
  { key: 'status', label: 'Status' },
  { key: 'subtotal', label: 'Subtotal', class: 'text-right' },
  { key: 'gst', label: 'GST', class: 'text-right' },
  { key: 'total', label: 'Total', class: 'text-right' },
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleRowClick = (row: Record<string, any>) => {
  navigateTo(`/purchasing/invoices/${row.id}`)
}
</script>

<template>
  <div class="space-y-6">
    <LayoutPageHeader title="Invoices" subtitle="Track and manage vendor invoices" />

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-(--color-muted-foreground)" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search invoices..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
      </div>
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
    <CommonDataTable :columns="columns" :rows="filteredInvoices" @row-click="handleRowClick">
      <template #cell-status="{ value }">
        <CommonStatusBadge :status="value" />
      </template>
      <template #cell-subtotal="{ value }">
        {{ fmt(value) }}
      </template>
      <template #cell-gst="{ value }">
        {{ fmt(value) }}
      </template>
      <template #cell-total="{ value }">
        <span class="font-medium">{{ fmt(value) }}</span>
      </template>
    </CommonDataTable>

    <p v-if="filteredInvoices.length === 0" class="text-center py-8 text-(--color-muted-foreground)">
      No invoices found matching your criteria.
    </p>
  </div>
</template>
