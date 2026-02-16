<script setup lang="ts">
import { Plus, Search } from 'lucide-vue-next'
import { MOCK_ORDERS } from '~/utils/mockData'

const searchQuery = ref('')
const activeStatus = ref('All')

const statuses = ['All', 'Draft', 'Open', 'Sent', 'Needs Receiving', 'Closed']

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const columns = [
  { key: 'id', label: 'PO #' },
  { key: 'vendorName', label: 'Vendor' },
  { key: 'orderDate', label: 'Order Date' },
  { key: 'deliveryDate', label: 'Delivery Date' },
  { key: 'status', label: 'Status' },
  { key: 'total', label: 'Total', class: 'text-right' },
]

const filteredOrders = computed(() => {
  return MOCK_ORDERS.filter((order) => {
    const matchesSearch =
      !searchQuery.value ||
      order.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.vendorName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus =
      activeStatus.value === 'All' || order.status === activeStatus.value
    return matchesSearch && matchesStatus
  })
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleRowClick = (row: Record<string, any>) => {
  navigateTo(`/purchasing/orders/${row.id}`)
}
</script>

<template>
  <div class="space-y-6">
    <LayoutPageHeader title="Purchase Orders" subtitle="Manage and track all purchase orders">
      <template #actions>
        <NuxtLink
          to="/purchasing/orders/new"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus class="size-4" />
          New PO
        </NuxtLink>
      </template>
    </LayoutPageHeader>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-(--color-muted-foreground)" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search orders..."
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
    <CommonDataTable :columns="columns" :rows="filteredOrders" @row-click="handleRowClick">
      <template #cell-status="{ value }">
        <CommonStatusBadge :status="value" />
      </template>
      <template #cell-total="{ value }">
        <span class="font-medium">{{ fmt(value) }}</span>
      </template>
    </CommonDataTable>

    <p v-if="filteredOrders.length === 0" class="text-center py-8 text-(--color-muted-foreground)">
      No orders found matching your criteria.
    </p>
  </div>
</template>
