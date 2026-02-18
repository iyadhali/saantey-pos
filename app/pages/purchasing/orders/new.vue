<script setup lang="ts">
import { MOCK_VENDORS, MOCK_ORDERS, MOCK_ORDER_ITEMS, addMockOrder } from '~/utils/mockData'
import type { Order } from '~~/shared/types'

interface EditableOrderItem {
  id: number
  productId: string
  name: string
  sku: string
  quantity: number
  unit: string
  cost: number
}

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

// Auto-generated PO number (computed eagerly)
const poNumber = generatePoNumber()

// Form state
const selectedVendorId = ref('')
const deliveryDate = ref(new Date().toISOString().split('T')[0])
const notes = ref('')
const items = ref<EditableOrderItem[]>([])
let nextItemId = 1

// Computed
const selectedVendor = computed(() =>
  MOCK_VENDORS.find((v) => v.id === selectedVendorId.value) || null,
)

const vendorItems = computed(() =>
  MOCK_VENDORS.map(v => ({
    label: `${v.id} — ${v.name}`,
    value: v.id,
  })),
)

const vendorProducts = computed(() => selectedVendor.value?.products ?? [])

const availableProducts = computed(() => {
  const usedProductIds = new Set(items.value.map((i) => i.productId))
  return vendorProducts.value.filter((p) => !usedProductIds.has(p.id))
})

const subtotal = computed(() =>
  items.value.reduce((sum, item) => sum + item.quantity * item.cost, 0),
)

const total = computed(() => subtotal.value)

// Validation
const hasItems = computed(() => items.value.length > 0)

const allItemsValid = computed(() =>
  items.value.every((item) => item.productId && item.quantity > 0),
)

const canCreateOrder = computed(
  () => selectedVendorId.value && deliveryDate.value && hasItems.value && allItemsValid.value,
)

const canSaveDraft = computed(() => selectedVendorId.value !== '')

// Clear items when vendor changes
watch(selectedVendorId, (newVal, oldVal) => {
  if (oldVal && newVal !== oldVal) {
    items.value = []
    nextItemId = 1
  }
})

// Handlers
function addItem() {
  items.value.push({
    id: nextItemId++,
    productId: '',
    name: '',
    sku: '',
    quantity: 1,
    unit: '',
    cost: 0,
  })
}

function getAvailableProductItems(currentItem: EditableOrderItem) {
  return vendorProducts.value
    .filter((p) => p.id === currentItem.productId || !items.value.some((i) => i !== currentItem && i.productId === p.id))
    .map((p) => ({
      label: `${p.name} (${p.sku})`,
      value: p.id,
    }))
}

function onProductSelect(item: EditableOrderItem) {
  const product = vendorProducts.value.find((p) => p.id === item.productId)
  if (product) {
    item.name = product.name
    item.sku = product.sku
    item.unit = product.unit
    item.cost = product.price
  }
}

function removeItem(itemId: number) {
  items.value = items.value.filter((i) => i.id !== itemId)
}

function generatePoNumber(): string {
  const existingNumbers = MOCK_ORDERS.map((o) => {
    const num = parseInt(o.id.replace('PO-', ''), 10)
    return isNaN(num) ? 0 : num
  })
  const maxNum = Math.max(0, ...existingNumbers)
  return `PO-${maxNum + 1}`
}

function saveOrder(status: 'Draft' | 'Open') {
  if (status === 'Open') {
    if (!hasItems.value) {
      alert('Please add at least one item.')
      return
    }
    if (!allItemsValid.value) {
      alert('All items must have a product selected and quantity greater than 0.')
      return
    }
  }

  const today = new Date().toISOString().split('T')[0] ?? ''

  const order: Order = {
    id: poNumber,
    vendorId: selectedVendorId.value,
    vendorName: selectedVendor.value!.name,
    orderDate: today,
    deliveryDate: deliveryDate.value ?? '',
    status,
    total: total.value,
    itemCount: items.value.length,
    memo: notes.value || undefined,
  }

  MOCK_ORDER_ITEMS[poNumber] = items.value.map((item) => ({
    id: item.id,
    name: item.name,
    sku: item.sku,
    quantity: item.quantity,
    unit: item.unit,
    cost: item.cost,
  }))

  addMockOrder(order)
  navigateTo('/purchasing/orders')
}
</script>

<template>
  <UDashboardPanel id="new-purchase-order">
    <template #header>
      <UDashboardNavbar title="New Purchase Order">
        <template #leading>
          <UButton icon="i-lucide-arrow-left" variant="ghost" to="/purchasing/orders" />
        </template>
        <template #right>
          <UButton
            icon="i-lucide-save"
            label="Save Draft"
            variant="outline"
            :disabled="!canSaveDraft"
            @click="saveOrder('Draft')"
          />
          <UButton
            icon="i-lucide-check"
            label="Create Order"
            :disabled="!canCreateOrder"
            @click="saveOrder('Open')"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- Order Details Card -->
      <div class="border border-(--color-border) rounded-lg p-6 space-y-4">
        <h2 class="text-lg font-semibold">Order Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <UFormField label="PO Number" name="po-number">
            <UInput :model-value="poNumber" disabled icon="i-lucide-hash" />
          </UFormField>

          <UFormField label="Vendor" name="vendor">
            <USelectMenu
              v-model="selectedVendorId"
              :items="vendorItems"
              placeholder="Search vendors..."
              value-key="value"
              label-key="label"
              icon="i-lucide-building-2"
            />
          </UFormField>

          <UFormField label="Delivery Date" name="delivery-date">
            <UInput v-model="deliveryDate" type="date" />
          </UFormField>

          <UFormField label="Notes" name="notes">
            <UInput v-model="notes" placeholder="Delivery instructions..." />
          </UFormField>
        </div>
      </div>

      <!-- Order Items Card -->
      <div class="border border-(--color-border) rounded-lg p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Order Items</h2>
          <UButton
            icon="i-lucide-plus"
            label="Add Item"
            variant="outline"
            size="sm"
            :disabled="!selectedVendorId || availableProducts.length === 0"
            @click="addItem"
          />
        </div>

        <!-- Empty state: no vendor selected -->
        <div v-if="!selectedVendorId" class="py-12 text-center">
          <p class="text-sm text-(--color-muted-foreground)">
            Please select a vendor to view their catalog.
          </p>
        </div>

        <!-- Empty state: vendor selected but no items -->
        <div v-else-if="items.length === 0" class="py-12 text-center">
          <p class="text-sm text-(--color-muted-foreground)">
            No items added yet. Click "+ Add Item" to begin.
          </p>
        </div>

        <!-- Items table -->
        <div v-else>
          <div class="border border-(--color-border) rounded-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-(--color-muted)/50 border-b border-(--color-border)">
                  <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground)">Item</th>
                  <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground) w-24">Qty</th>
                  <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground) w-20">Unit</th>
                  <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground) w-28">Unit Cost</th>
                  <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground) w-28">Total</th>
                  <th class="w-12" />
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in items"
                  :key="item.id"
                  class="border-b border-(--color-border) last:border-0"
                >
                  <td class="px-4 py-3">
                    <USelectMenu
                      v-model="item.productId"
                      :items="getAvailableProductItems(item)"
                      placeholder="Select item..."
                      value-key="value"
                      label-key="label"
                      class="min-w-48"
                      @update:model-value="onProductSelect(item)"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <UInput
                      v-model.number="item.quantity"
                      type="number"
                      min="1"
                      step="1"
                      class="w-24 text-right"
                    />
                  </td>
                  <td class="px-4 py-3 text-(--color-muted-foreground)">
                    {{ item.unit || '—' }}
                  </td>
                  <td class="px-4 py-3 text-right text-(--color-muted-foreground)">
                    {{ item.cost ? fmt(item.cost) : '—' }}
                  </td>
                  <td class="px-4 py-3 text-right font-medium">
                    {{ item.productId ? fmt(item.quantity * item.cost) : '—' }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <UButton
                      icon="i-lucide-trash-2"
                      variant="ghost"
                      color="error"
                      size="xs"
                      @click="removeItem(item.id)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Summary Footer -->
        <div class="flex justify-end border-t border-(--color-border) pt-4">
          <div class="w-full max-w-xs space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-(--color-muted-foreground)">Subtotal</span>
              <span>{{ fmt(subtotal) }}</span>
            </div>
            <div class="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span class="text-primary">{{ fmt(total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
