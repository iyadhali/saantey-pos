<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { OrderItem } from '~~/shared/types'
import { MOCK_ORDERS, MOCK_ORDER_ITEMS, updateMockOrderStatus } from '~/utils/mockData'

const route = useRoute()
const orderId = computed(() => route.params.id as string)

const order = computed(() => MOCK_ORDERS.find((o) => o.id === orderId.value))
const lineItems = computed(() => MOCK_ORDER_ITEMS[orderId.value] || [])

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const subtotal = computed(() =>
  lineItems.value.reduce((sum, item) => sum + item.quantity * item.cost, 0),
)
const total = computed(() => subtotal.value)

// Status-based button visibility
const showSend = computed(() =>
  order.value?.status === 'Draft' || order.value?.status === 'Open',
)
const showReceive = computed(() =>
  order.value?.status === 'Sent' ||
  order.value?.status === 'Needs Receiving' ||
  order.value?.status === 'Partially Received',
)
const showCreateInvoice = computed(() =>
  order.value?.status === 'Sent' ||
  order.value?.status === 'Needs Receiving' ||
  order.value?.status === 'Partially Received' ||
  order.value?.status === 'Received',
)
const showClose = computed(() => order.value?.status !== 'Closed')

function sendOrder() {
  updateMockOrderStatus(orderId.value, 'Sent')
}

function closeOrder() {
  if (!confirm(`Close ${orderId.value}? This cannot be undone.`)) return
  updateMockOrderStatus(orderId.value, 'Closed')
  navigateTo('/purchasing/orders')
}

const itemColumns: TableColumn<OrderItem & { lineTotal: number }>[] = [
  { accessorKey: 'sku', header: 'SKU' },
  { accessorKey: 'name', header: 'Item' },
  { accessorKey: 'quantity', header: 'Qty', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'unit', header: 'Unit' },
  { accessorKey: 'cost', header: 'Unit Cost', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'lineTotal', header: 'Total', meta: { class: { th: 'text-right', td: 'text-right' } } },
]

const lineItemRows = computed(() =>
  lineItems.value.map((item) => ({
    ...item,
    lineTotal: item.quantity * item.cost,
  })),
)
</script>

<template>
  <UDashboardPanel id="purchase-order-detail">
    <template #header>
      <UDashboardNavbar :title="order ? `Purchase Order #${order.id}` : 'Loading...'">
        <template #leading>
          <UButton icon="i-lucide-arrow-left" variant="ghost" to="/purchasing/orders" />
        </template>

        <template #title>
          <div class="flex items-center gap-3">
            <span class="font-semibold text-lg">{{ order ? `Purchase Order #${order.id}` : 'Loading...' }}</span>
            <CommonStatusBadge v-if="order" :status="order.status" size="sm" />
          </div>
        </template>

        <template v-if="order" #right>
          <UButton icon="i-lucide-edit" label="Edit" variant="outline" :to="`/purchasing/orders/edit/${orderId}`" />
          <UButton
            v-if="showSend"
            icon="i-lucide-send"
            label="Send"
            @click="sendOrder"
          />
          <UButton
            v-if="showReceive"
            icon="i-lucide-package-check"
            label="Receive"
            variant="outline"
            :to="`/purchasing/orders/receive/${orderId}`"
          />
          <UButton
            v-if="showCreateInvoice"
            icon="i-lucide-file-plus"
            label="Create Invoice"
            :to="`/purchasing/orders/invoice/${orderId}`"
          />
          <UButton
            v-if="showClose"
            icon="i-lucide-x-circle"
            label="Close"
            color="error"
            variant="ghost"
            @click="closeOrder"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <template v-if="order">
        <!-- Order Metadata -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-8 text-sm">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-building" class="w-5 h-5 text-(--color-muted-foreground)" />
            <div>
              <p class="text-(--color-muted-foreground) text-xs uppercase tracking-wide font-medium">Vendor</p>
              <p class="font-medium text-base">{{ order.vendorName }}</p>
            </div>
          </div>

          <USeparator orientation="vertical" class="hidden sm:block h-8" />

          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-calendar" class="w-5 h-5 text-(--color-muted-foreground)" />
            <div>
              <p class="text-(--color-muted-foreground) text-xs uppercase tracking-wide font-medium">Order Date</p>
              <p class="font-medium text-base">{{ order.orderDate }}</p>
            </div>
          </div>

          <USeparator orientation="vertical" class="hidden sm:block h-8" />

          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-truck" class="w-5 h-5 text-(--color-muted-foreground)" />
            <div>
              <p class="text-(--color-muted-foreground) text-xs uppercase tracking-wide font-medium">Delivery</p>
              <p class="font-medium text-base">{{ order.deliveryDate }}</p>
            </div>
          </div>
        </div>

        <USeparator class="mb-8" />

        <!-- Memo -->
        <UAlert v-if="order.memo" icon="i-lucide-info" color="neutral" variant="subtle" title="Memo" :description="order.memo" class="mb-8" />

        <!-- Line Items -->
        <UCard :ui="{ body: '!p-0', header: 'p-4 sm:px-6' }" class="mb-8 overflow-hidden">
          <template #header>
            <h2 class="font-semibold">Line Items</h2>
          </template>

          <UTable
            :data="lineItemRows"
            :columns="itemColumns"
            :ui="{
              th: 'whitespace-nowrap',
              td: 'whitespace-nowrap'
            }"
          >
            <template #cost-cell="{ row }">
              {{ fmt(row.original.cost) }}
            </template>
            <template #lineTotal-cell="{ row }">
              <span class="font-medium">{{ fmt(row.original.lineTotal) }}</span>
            </template>
          </UTable>
        </UCard>

        <!-- Totals -->
        <div class="flex justify-end">
          <div class="w-full sm:max-w-xs space-y-4">
            <div class="flex justify-between items-center text-sm">
              <span class="text-(--color-muted-foreground)">Subtotal</span>
              <span class="font-medium">{{ fmt(subtotal) }}</span>
            </div>

            <USeparator />

            <div class="flex justify-between items-center">
              <span class="text-base font-semibold">Total</span>
              <span class="text-xl font-bold text-primary">{{ fmt(total) }}</span>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="flex flex-col items-center justify-center py-12 text-center">
        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
          <UIcon name="i-lucide-search-x" class="w-8 h-8 text-(--color-muted-foreground)" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Order not found</h3>
        <p class="text-(--color-muted-foreground) mb-6">The purchase order you are looking for does not exist or has been removed.</p>
        <UButton to="/purchasing/orders" label="Return to Orders" variant="solid" />
      </div>
    </template>
  </UDashboardPanel>
</template>
