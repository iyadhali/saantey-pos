<script setup lang="ts">
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-vue-next'
import { MOCK_INVOICES, MOCK_ORDER_ITEMS } from '~/utils/mockData'

const route = useRoute()
const invoiceId = computed(() => route.params.id as string)

const invoice = computed(() => MOCK_INVOICES.find((inv) => inv.id === invoiceId.value))

const lineItems = computed(() => {
  if (!invoice.value) return []
  return MOCK_ORDER_ITEMS[invoice.value.poNumber] || []
})

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
      to="/purchasing/invoices"
      class="inline-flex items-center gap-1.5 text-sm text-(--color-muted-foreground) hover:text-(--color-foreground) transition-colors"
    >
      <ArrowLeft class="size-4" />
      Back to Invoices
    </NuxtLink>

    <template v-if="invoice">
      <LayoutPageHeader :title="invoice.id" :subtitle="`Invoice from ${invoice.vendorName}`">
        <template #actions>
          <button
            v-if="invoice.status !== 'Finalized' && invoice.status !== 'Rejected'"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <CheckCircle2 class="size-4" />
            Approve / Finalize
          </button>
          <button
            v-if="invoice.status !== 'Finalized' && invoice.status !== 'Rejected'"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
          >
            <XCircle class="size-4" />
            Reject
          </button>
        </template>
      </LayoutPageHeader>

      <!-- Invoice Info -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4 space-y-1">
          <p class="text-xs text-(--color-muted-foreground) uppercase tracking-wide">Vendor</p>
          <p class="font-medium">{{ invoice.vendorName }}</p>
        </div>
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4 space-y-1">
          <p class="text-xs text-(--color-muted-foreground) uppercase tracking-wide">PO Number</p>
          <NuxtLink
            :to="`/purchasing/orders/${invoice.poNumber}`"
            class="font-medium text-primary hover:underline"
          >
            {{ invoice.poNumber }}
          </NuxtLink>
        </div>
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4 space-y-1">
          <p class="text-xs text-(--color-muted-foreground) uppercase tracking-wide">Invoice Date</p>
          <p class="font-medium">{{ invoice.invoiceDate }}</p>
        </div>
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4 space-y-1">
          <p class="text-xs text-(--color-muted-foreground) uppercase tracking-wide">Status</p>
          <CommonStatusBadge :status="invoice.status" />
        </div>
      </div>

      <!-- Delivery Info -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4 space-y-1">
          <p class="text-xs text-(--color-muted-foreground) uppercase tracking-wide">Delivery Date</p>
          <p class="font-medium">{{ invoice.deliveryDate }}</p>
        </div>
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4 space-y-1">
          <p class="text-xs text-(--color-muted-foreground) uppercase tracking-wide">Last Updated</p>
          <p class="font-medium">{{ invoice.updatedAt }}</p>
        </div>
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
      <p class="text-(--color-muted-foreground)">Invoice not found.</p>
      <NuxtLink to="/purchasing/invoices" class="text-sm text-primary hover:underline mt-2 inline-block">
        Return to Invoices
      </NuxtLink>
    </div>
  </div>
</template>
