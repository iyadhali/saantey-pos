<script setup lang="ts">
import type { Invoice, OrderItem } from '~~/shared/types'
import {
  MOCK_ORDERS,
  MOCK_ORDER_ITEMS,
  MOCK_RECEIVED_ITEMS,
  addMockInvoice,
  addMockInvoiceItems,
  updateMockOrderStatus,
  generateInvoiceNumber,
} from '~/utils/mockData'

const route = useRoute()
const orderId = computed(() => route.params.id as string)

const order = computed(() => MOCK_ORDERS.find((o) => o.id === orderId.value))

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

// Invoice details
const today = new Date().toISOString().split('T')[0] ?? ''
const newInvoiceId = generateInvoiceNumber()
const invoiceDate = ref(today)
const deliveryDate = ref(order.value?.deliveryDate ?? today)

// Line items: pre-fill from received items, fallback to PO items
interface InvoiceRow {
  item: OrderItem
  invoiceQty: number
}

const rows = ref<InvoiceRow[]>([])

watch(
  [orderId, order],
  () => {
    const source =
      MOCK_RECEIVED_ITEMS[orderId.value] ?? MOCK_ORDER_ITEMS[orderId.value] ?? []
    rows.value = source.map((item) => ({
      item,
      invoiceQty: item.quantity,
    }))
  },
  { immediate: true },
)

const subtotal = computed(() =>
  rows.value.reduce((sum, r) => sum + r.invoiceQty * r.item.cost, 0),
)
const gst = computed(() => subtotal.value * 0.06)
const total = computed(() => subtotal.value + gst.value)

function createInvoice() {
  if (!order.value) return

  const invoice: Invoice = {
    id: newInvoiceId,
    vendorId: order.value.vendorId,
    vendorName: order.value.vendorName,
    poNumber: orderId.value,
    invoiceDate: invoiceDate.value,
    deliveryDate: deliveryDate.value,
    status: 'Draft',
    subtotal: subtotal.value,
    gst: gst.value,
    total: total.value,
    updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
  }

  const invoiceItems: OrderItem[] = rows.value.map((r) => ({
    ...r.item,
    quantity: r.invoiceQty,
  }))

  addMockInvoice(invoice)
  addMockInvoiceItems(newInvoiceId, invoiceItems)
  updateMockOrderStatus(orderId.value, 'Closed')
  navigateTo(`/purchasing/invoices/${newInvoiceId}`)
}
</script>

<template>
  <UDashboardPanel id="invoice-create">
    <template #header>
      <UDashboardNavbar :title="order ? `New Invoice from ${order.id}` : 'New Invoice'">
        <template #leading>
          <UButton
            icon="i-lucide-arrow-left"
            variant="ghost"
            :to="`/purchasing/orders/${orderId}`"
          />
        </template>
        <template v-if="order" #right>
          <UButton
            icon="i-lucide-file-check"
            label="Create Invoice"
            @click="createInvoice"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <template v-if="order">
        <p class="text-sm text-(--color-muted-foreground) mb-4">Creating invoice for <span class="font-medium text-(--color-foreground)">{{ order.vendorName }}</span></p>

        <!-- Invoice Details Card -->
        <div class="border border-(--color-border) rounded-lg p-6 space-y-4 mb-6">
          <h2 class="text-lg font-semibold">Invoice Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <UFormField label="Invoice #" name="invoice-number">
              <UInput :model-value="newInvoiceId" disabled icon="i-lucide-hash" />
            </UFormField>

            <UFormField label="Vendor" name="vendor">
              <UInput :model-value="order.vendorName" disabled icon="i-lucide-building-2" />
            </UFormField>

            <UFormField label="Invoice Date" name="invoice-date">
              <UInput v-model="invoiceDate" type="date" />
            </UFormField>

            <UFormField label="Delivery Date" name="delivery-date">
              <UInput v-model="deliveryDate" type="date" />
            </UFormField>
          </div>
        </div>

        <!-- Line Items Card -->
        <div class="border border-(--color-border) rounded-lg p-6 space-y-4 mb-6">
          <h2 class="text-lg font-semibold">Line Items</h2>

          <div class="border border-(--color-border) rounded-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-(--color-muted)/50 border-b border-(--color-border)">
                  <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground)">SKU</th>
                  <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground)">Item</th>
                  <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground) w-20">Unit</th>
                  <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground) w-28">Invoice Qty</th>
                  <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground) w-28">Unit Cost</th>
                  <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground) w-28">Line Total</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in rows"
                  :key="row.item.id"
                  class="border-b border-(--color-border) last:border-0"
                >
                  <td class="px-4 py-3 text-(--color-muted-foreground) font-mono text-xs">{{ row.item.sku }}</td>
                  <td class="px-4 py-3 font-medium">{{ row.item.name }}</td>
                  <td class="px-4 py-3 text-(--color-muted-foreground)">{{ row.item.unit }}</td>
                  <td class="px-4 py-3 text-right">
                    <UInput
                      v-model.number="row.invoiceQty"
                      type="number"
                      min="0"
                      class="w-24 ml-auto"
                    />
                  </td>
                  <td class="px-4 py-3 text-right text-(--color-muted-foreground)">{{ fmt(row.item.cost) }}</td>
                  <td class="px-4 py-3 text-right font-medium">{{ fmt(row.invoiceQty * row.item.cost) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Totals Card -->
        <div class="flex justify-end">
          <div class="w-full sm:max-w-xs border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-2">
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
              <span class="text-primary">{{ fmt(total) }}</span>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="flex flex-col items-center justify-center py-12 text-center">
        <p class="text-(--color-muted-foreground)">Order not found.</p>
        <UButton to="/purchasing/orders" label="Return to Orders" variant="solid" class="mt-4" />
      </div>
    </template>
  </UDashboardPanel>
</template>
