<script setup lang="ts">
import type { Order } from '~~/shared/types'
import type { TableColumn, TableRow } from '@nuxt/ui'
import { MOCK_ORDERS } from '~/utils/mockData'
import type { DateRangeValue } from '~/components/common/DateRangePicker.vue'

const searchQuery = ref('')
const activeStatus = ref('All')
const dateRange = ref<DateRangeValue>()

function clearDateRange() {
  dateRange.value = undefined
}

const statuses = ['All', 'Draft', 'Open', 'Sent', 'Needs Receiving', 'Closed']

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const columns: TableColumn<Order>[] = [
  { accessorKey: 'id', header: 'PO #' },
  { accessorKey: 'vendorName', header: 'Vendor' },
  { accessorKey: 'orderDate', header: 'Order Date' },
  { accessorKey: 'deliveryDate', header: 'Delivery Date' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'total', header: 'Total', meta: { class: { th: 'text-right', td: 'text-right' } } },
]

const filteredOrders = computed(() => {
  return MOCK_ORDERS.filter((order) => {
    const matchesSearch =
      !searchQuery.value ||
      order.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.vendorName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus =
      activeStatus.value === 'All' || order.status === activeStatus.value
    const matchesDateRange = !dateRange.value?.start || !dateRange.value?.end || (() => {
      const orderDate = order.orderDate
      const s = dateRange.value!.start
      const e = dateRange.value!.end
      const start = `${s.getFullYear()}-${String(s.getMonth() + 1).padStart(2, '0')}-${String(s.getDate()).padStart(2, '0')}`
      const end = `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, '0')}-${String(e.getDate()).padStart(2, '0')}`
      return orderDate >= start && orderDate <= end
    })()
    return matchesSearch && matchesStatus && matchesDateRange
  })
})

const handleRowSelect = (_e: Event, row: TableRow<Order>) => {
  navigateTo(`/purchasing/orders/${row.original.id}`)
}
</script>

<template>
  <UDashboardPanel id="purchase-orders">
    <template #header>
      <UDashboardNavbar title="Purchase Orders">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton icon="i-lucide-plus" label="New PO" to="/purchasing/orders/new" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-4 flex-wrap">
        <UInput v-model="searchQuery" icon="i-lucide-search" placeholder="Search orders..." aria-label="Search orders" class="flex-1 max-w-sm" />
        <div class="flex items-center gap-2">
          <CommonDateRangePicker v-model="dateRange" />
          <UButton
            v-if="dateRange"
            icon="i-lucide-x"
            size="xs"
            variant="ghost"
            @click="clearDateRange"
          />
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
      <UTable
        :data="filteredOrders"
        :columns="columns"
        caption="Purchase orders"
        :empty="filteredOrders.length === 0 ? 'No orders found matching your criteria.' : undefined"
        @select="handleRowSelect"
      >
        <template #status-cell="{ row }">
          <CommonStatusBadge :status="row.original.status" />
        </template>
        <template #total-cell="{ row }">
          <span class="font-medium">{{ fmt(row.original.total) }}</span>
        </template>
      </UTable>
    </template>
  </UDashboardPanel>
</template>
