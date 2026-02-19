<script setup lang="ts">
import { MOCK_INVOICES, MOCK_ORDER_ITEMS, MOCK_RECEIVED_ITEMS, MOCK_INVOICE_ITEMS } from '~/utils/mockData'

const route = useRoute()
const invoiceId = computed(() => route.params.id as string)

const invoice = computed(() => MOCK_INVOICES.find((inv) => inv.id === invoiceId.value))

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

// 3-way match: merge PO items, received items, and invoice items
const matchRows = computed(() => {
  if (!invoice.value) return []
  const poNumber = invoice.value.poNumber

  const poItems = MOCK_ORDER_ITEMS[poNumber] ?? []
  const rcvItems = MOCK_RECEIVED_ITEMS[poNumber] ?? []
  const invItems = MOCK_INVOICE_ITEMS[invoice.value.id] ?? poItems

  return poItems.map((poItem) => {
    const rcvItem = rcvItems.find((r) => r.id === poItem.id)
    const invItem = invItems.find((i) => i.id === poItem.id)

    const invQty = invItem?.quantity ?? poItem.quantity
    const invCost = invItem?.cost ?? poItem.cost
    const rcvQty = rcvItem?.quantity

    const matched =
      invQty === poItem.quantity && invCost === poItem.cost

    return {
      id: poItem.id,
      sku: poItem.sku,
      name: poItem.name,
      unit: poItem.unit,
      poQty: poItem.quantity,
      rcvQty,
      invQty,
      invCost,
      lineTotal: invQty * invCost,
      matched,
    }
  })
})

const subtotal = computed(() =>
  matchRows.value.reduce((sum, r) => sum + r.lineTotal, 0),
)
const gst = computed(() => subtotal.value * 0.06)
const total = computed(() => subtotal.value + gst.value)
</script>

<template>
  <UDashboardPanel id="invoice-detail">
    <template #header>
      <UDashboardNavbar :title="invoice?.id ?? 'Invoice'">
        <template #leading>
          <UButton icon="i-lucide-arrow-left" variant="ghost" to="/purchasing/invoices" />
        </template>
        <template v-if="invoice && invoice.status !== 'Finalized' && invoice.status !== 'Rejected'" #right>
          <UButton icon="i-lucide-check-circle-2" label="Approve / Finalize" />
          <UButton icon="i-lucide-x-circle" label="Reject" color="error" variant="outline" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <template v-if="invoice">
        <p class="text-sm text-muted">Invoice from {{ invoice.vendorName }}</p>

        <!-- Invoice Info -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-1">
            <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Vendor</p>
            <p class="font-medium">{{ invoice.vendorName }}</p>
          </div>
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-1">
            <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">PO Number</p>
            <NuxtLink
              :to="`/purchasing/orders/${invoice.poNumber}`"
              class="font-medium text-primary hover:underline"
            >
              {{ invoice.poNumber }}
            </NuxtLink>
          </div>
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-1">
            <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Invoice Date</p>
            <p class="font-medium">{{ invoice.invoiceDate }}</p>
          </div>
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-1">
            <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Status</p>
            <CommonStatusBadge :status="invoice.status" />
          </div>
        </div>

        <!-- Delivery Info -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-1">
            <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Delivery Date</p>
            <p class="font-medium">{{ invoice.deliveryDate }}</p>
          </div>
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-1">
            <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Last Updated</p>
            <p class="font-medium">{{ invoice.updatedAt }}</p>
          </div>
        </div>

        <!-- 3-way Match Table -->
        <div class="space-y-3">
          <h2 class="text-lg font-semibold">Line Items — 3-Way Match</h2>
          <div class="border border-(--color-border) rounded-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-(--color-muted)/50 border-b border-(--color-border)">
                  <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground)">SKU</th>
                  <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground)">Item</th>
                  <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground) w-20">PO Qty</th>
                  <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground) w-20">Rcv Qty</th>
                  <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground) w-20">Inv Qty</th>
                  <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground) w-28">Unit Cost</th>
                  <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground) w-28">Line Total</th>
                  <th class="text-center px-4 py-3 font-medium text-(--color-muted-foreground) w-20">Match</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in matchRows"
                  :key="row.id"
                  class="border-b border-(--color-border) last:border-0"
                  :class="{ 'bg-warning-50/30 dark:bg-warning-900/10': !row.matched }"
                >
                  <td class="px-4 py-3 text-(--color-muted-foreground) font-mono text-xs">{{ row.sku }}</td>
                  <td
                    class="px-4 py-3 font-medium"
                    :class="{ 'text-amber-600 dark:text-amber-400': !row.matched }"
                  >
                    {{ row.name }}
                  </td>
                  <td class="px-4 py-3 text-right">{{ row.poQty }}</td>
                  <td class="px-4 py-3 text-right text-(--color-muted-foreground)">
                    {{ row.rcvQty !== undefined ? row.rcvQty : '—' }}
                  </td>
                  <td
                    class="px-4 py-3 text-right"
                    :class="{ 'text-amber-600 dark:text-amber-400 font-medium': !row.matched }"
                  >
                    {{ row.invQty }}
                  </td>
                  <td class="px-4 py-3 text-right text-(--color-muted-foreground)">{{ fmt(row.invCost) }}</td>
                  <td class="px-4 py-3 text-right font-medium">{{ fmt(row.lineTotal) }}</td>
                  <td class="px-4 py-3 text-center">
                    <UBadge
                      v-if="row.matched"
                      color="success"
                      label="✓"
                      variant="subtle"
                    />
                    <UBadge
                      v-else
                      color="warning"
                      label="⚠"
                      variant="subtle"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
        <p class="text-(--color-muted-foreground)">Invoice not found.</p>
        <NuxtLink to="/purchasing/invoices" class="text-sm text-primary hover:underline mt-2 inline-block">
          Return to Invoices
        </NuxtLink>
      </div>
    </template>
  </UDashboardPanel>
</template>
