<script setup lang="ts">
import type { OrderItem } from '~~/shared/types'
import { MOCK_ORDERS, MOCK_ORDER_ITEMS, addMockReceiving } from '~/utils/mockData'

const route = useRoute()
const orderId = computed(() => route.params.id as string)

const order = computed(() => MOCK_ORDERS.find((o) => o.id === orderId.value))
const poItems = computed(() => MOCK_ORDER_ITEMS[orderId.value] || [])

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

// Editable received quantities — pre-filled with PO qty
interface ReceivingRow {
  item: OrderItem
  receivedQty: number
}

const rows = ref<ReceivingRow[]>([])

watch(
  poItems,
  (items) => {
    rows.value = items.map((item) => ({
      item,
      receivedQty: item.quantity,
    }))
  },
  { immediate: true },
)

const fullyReceivedCount = computed(
  () => rows.value.filter((r) => r.receivedQty >= r.item.quantity).length,
)

const subtotal = computed(() =>
  rows.value.reduce((sum, r) => sum + r.receivedQty * r.item.cost, 0),
)

function saveReceiving() {
  const receivedItems: OrderItem[] = rows.value.map((r) => ({
    ...r.item,
    quantity: r.receivedQty,
  }))

  const allReceived = rows.value.every((r) => r.receivedQty >= r.item.quantity)
  addMockReceiving(orderId.value, receivedItems, allReceived)
  navigateTo(`/purchasing/orders/${orderId.value}`)
}
</script>

<template>
  <UDashboardPanel id="receive-order">
    <template #header>
      <UDashboardNavbar :title="order ? `Receive — ${order.id}` : 'Receive Order'">
        <template #leading>
          <UButton
            icon="i-lucide-arrow-left"
            variant="ghost"
            :to="`/purchasing/orders/${orderId}`"
          />
        </template>
        <template v-if="order" #right>
          <UButton
            icon="i-lucide-save"
            label="Save Receiving"
            @click="saveReceiving"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <template v-if="order">
        <!-- Order Info Card -->
        <div class="border border-(--color-border) rounded-lg p-6 mb-6">
          <h2 class="text-lg font-semibold mb-4">Order Information</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-(--color-muted-foreground) uppercase tracking-wide text-xs font-medium mb-1">Vendor</p>
              <p class="font-medium">{{ order.vendorName }}</p>
            </div>
            <div>
              <p class="text-(--color-muted-foreground) uppercase tracking-wide text-xs font-medium mb-1">Expected Delivery</p>
              <p class="font-medium">{{ order.deliveryDate }}</p>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="border border-(--color-border) rounded-lg overflow-hidden mb-6">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-(--color-muted)/50 border-b border-(--color-border)">
                <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground)">SKU</th>
                <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground)">Item</th>
                <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground) w-20">Unit</th>
                <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground) w-24">PO Qty</th>
                <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground) w-32">Received Qty</th>
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
                <td class="px-4 py-3 text-right">{{ row.item.quantity }}</td>
                <td class="px-4 py-3 text-right">
                  <UInput
                    v-model.number="row.receivedQty"
                    type="number"
                    :min="0"
                    :max="row.item.quantity"
                    class="w-24 ml-auto"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary Footer -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-(--color-border) pt-4">
          <p class="text-sm text-(--color-muted-foreground)">
            <span class="font-medium text-(--color-foreground)">{{ fullyReceivedCount }}</span>
            of
            <span class="font-medium text-(--color-foreground)">{{ rows.length }}</span>
            items fully received
          </p>
          <div class="w-full sm:max-w-xs space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-(--color-muted-foreground)">Subtotal</span>
              <span>{{ fmt(subtotal) }}</span>
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
