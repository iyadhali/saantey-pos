<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { OrderItem } from '~~/shared/types'
import { MOCK_ORDERS, MOCK_ORDER_ITEMS } from '~/utils/mockData'

const route = useRoute()
const orderId = computed(() => route.params.id as string)

const order = computed(() => MOCK_ORDERS.find((o) => o.id === orderId.value))
const lineItems = computed(() => MOCK_ORDER_ITEMS[orderId.value] || [])

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const subtotal = computed(() =>
  lineItems.value.reduce((sum, item) => sum + item.quantity * item.cost, 0),
)
const gst = computed(() => subtotal.value * 0.06)
const total = computed(() => subtotal.value + gst.value)

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
      <UDashboardNavbar :title="order?.id ?? 'Order'">
        <template #leading>
          <UButton icon="i-lucide-arrow-left" variant="ghost" to="/purchasing/orders" />
        </template>
        <template v-if="order" #right>
          <UButton icon="i-lucide-edit" label="Edit" variant="outline" />
          <UButton icon="i-lucide-send" label="Send" />
          <UButton icon="i-lucide-x-circle" label="Close" color="error" variant="outline" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <template v-if="order">
        <p class="text-sm text-muted">Order to {{ order.vendorName }}</p>

        <!-- Order Info -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-1">
            <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Vendor</p>
            <p class="font-medium">{{ order.vendorName }}</p>
          </div>
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-1">
            <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Order Date</p>
            <p class="font-medium">{{ order.orderDate }}</p>
          </div>
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-1">
            <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Delivery Date</p>
            <p class="font-medium">{{ order.deliveryDate }}</p>
          </div>
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-1">
            <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Status</p>
            <CommonStatusBadge :status="order.status" />
          </div>
        </div>

        <!-- Memo -->
        <div v-if="order.memo" class="border border-(--color-border) bg-(--color-card) rounded-lg p-4">
          <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide mb-1">Memo</p>
          <p class="text-sm">{{ order.memo }}</p>
        </div>

        <!-- Line Items -->
        <div class="space-y-3">
          <h2 class="text-lg font-semibold">Line Items</h2>
          <UTable :data="lineItemRows" :columns="itemColumns" caption="Order line items" empty="No line items.">
            <template #cost-cell="{ row }">
              {{ fmt(row.original.cost) }}
            </template>
            <template #lineTotal-cell="{ row }">
              <span class="font-medium">{{ fmt(row.original.lineTotal) }}</span>
            </template>
          </UTable>
        </div>

        <!-- Totals -->
        <div class="flex justify-end">
          <div class="w-full max-w-xs border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-(--color-muted-foreground)">Subtotal</span>
              <span>{{ fmt(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-(--color-muted-foreground)">GST (6%)</span>
              <span>{{ fmt(gst) }}</span>
            </div>
            <div class="flex justify-between font-semibold border-t border-(--color-border) pt-2">
              <span>Total</span>
              <span>{{ fmt(total) }}</span>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="text-center py-12">
        <p class="text-(--color-muted-foreground)">Order not found.</p>
        <NuxtLink to="/purchasing/orders" class="text-sm text-primary hover:underline mt-2 inline-block">
          Return to Orders
        </NuxtLink>
      </div>
    </template>
  </UDashboardPanel>
</template>
