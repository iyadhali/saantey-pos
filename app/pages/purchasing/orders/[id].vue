<script setup lang="ts">
import { ArrowLeft, Send, Edit, XCircle } from 'lucide-vue-next'
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

const itemColumns = [
  { key: 'sku', label: 'SKU' },
  { key: 'name', label: 'Item' },
  { key: 'quantity', label: 'Qty', class: 'text-right' },
  { key: 'unit', label: 'Unit' },
  { key: 'cost', label: 'Unit Cost', class: 'text-right' },
  { key: 'lineTotal', label: 'Total', class: 'text-right' },
]

const lineItemRows = computed(() =>
  lineItems.value.map((item) => ({
    ...item,
    lineTotal: item.quantity * item.cost,
  })),
)
</script>

<template>
  <div class="space-y-6">
    <!-- Back Link -->
    <NuxtLink
      to="/purchasing/orders"
      class="inline-flex items-center gap-1.5 text-sm text-(--color-muted-foreground) hover:text-(--color-foreground) transition-colors"
    >
      <ArrowLeft class="size-4" />
      Back to Orders
    </NuxtLink>

    <template v-if="order">
      <LayoutPageHeader :title="order.id" :subtitle="`Order to ${order.vendorName}`">
        <template #actions>
          <button
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-(--color-border) text-sm font-medium hover:bg-(--color-accent) transition-colors"
          >
            <Edit class="size-4" />
            Edit
          </button>
          <button
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Send class="size-4" />
            Send
          </button>
          <button
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
          >
            <XCircle class="size-4" />
            Close
          </button>
        </template>
      </LayoutPageHeader>

      <!-- Order Info -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4 space-y-1">
          <p class="text-xs text-(--color-muted-foreground) uppercase tracking-wide">Vendor</p>
          <p class="font-medium">{{ order.vendorName }}</p>
        </div>
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4 space-y-1">
          <p class="text-xs text-(--color-muted-foreground) uppercase tracking-wide">Order Date</p>
          <p class="font-medium">{{ order.orderDate }}</p>
        </div>
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4 space-y-1">
          <p class="text-xs text-(--color-muted-foreground) uppercase tracking-wide">Delivery Date</p>
          <p class="font-medium">{{ order.deliveryDate }}</p>
        </div>
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4 space-y-1">
          <p class="text-xs text-(--color-muted-foreground) uppercase tracking-wide">Status</p>
          <CommonStatusBadge :status="order.status" />
        </div>
      </div>

      <!-- Memo -->
      <div v-if="order.memo" class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4">
        <p class="text-xs text-(--color-muted-foreground) uppercase tracking-wide mb-1">Memo</p>
        <p class="text-sm">{{ order.memo }}</p>
      </div>

      <!-- Line Items -->
      <div class="space-y-3">
        <h2 class="text-lg font-semibold">Line Items</h2>
        <CommonDataTable :columns="itemColumns" :rows="lineItemRows">
          <template #cell-cost="{ value }">
            {{ fmt(value) }}
          </template>
          <template #cell-lineTotal="{ value }">
            <span class="font-medium">{{ fmt(value) }}</span>
          </template>
        </CommonDataTable>
      </div>

      <!-- Totals -->
      <div class="flex justify-end">
        <div class="w-full max-w-xs border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-(--color-muted-foreground)">Subtotal</span>
            <span>{{ fmt(subtotal) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-(--color-muted-foreground)">GST (6%)</span>
            <span>{{ fmt(gst) }}</span>
          </div>
          <div class="flex justify-between font-semibold border-t border-(--color-border)/40 pt-2">
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
  </div>
</template>
