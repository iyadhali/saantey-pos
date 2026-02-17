<script setup lang="ts">
import { Plus, Trash2, DollarSign } from 'lucide-vue-next'
import { MOCK_INVENTORY } from '~/utils/mockData'

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

// Form state
const wasteDate = ref(new Date().toISOString().split('T')[0]!)
const wasteTime = ref(
  new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
)
const wasteType = ref<'Raw' | 'Prep' | 'Menu'>('Raw')
const wasteItem = ref('')
const wasteUnit = ref('')
const wasteQuantity = ref<number | null>(null)
const wasteReason = ref('')

const matchedItem = computed(() =>
  MOCK_INVENTORY.find(
    (item) => item.name.toLowerCase() === wasteItem.value.toLowerCase(),
  ),
)

const costPreview = computed(() => {
  if (!matchedItem.value || !wasteQuantity.value) return 0
  return matchedItem.value.cost * wasteQuantity.value
})

// Update unit when item is matched
watch(matchedItem, (item) => {
  if (item) {
    wasteUnit.value = item.unit
  }
})

interface WasteEntry {
  id: string
  date: string
  time: string
  type: string
  item: string
  unit: string
  quantity: number
  reason: string
  cost: number
}

const wasteEntries = ref<WasteEntry[]>([
  { id: 'W-001', date: '2024-05-21', time: '09:30', type: 'Raw', item: 'Romaine Lettuce', unit: 'HD', quantity: 3, reason: 'Wilted beyond use', cost: 4.50 },
  { id: 'W-002', date: '2024-05-21', time: '11:15', type: 'Prep', item: 'Burger Patty (Prep)', unit: 'EA', quantity: 5, reason: 'Dropped on floor', cost: 9.25 },
  { id: 'W-003', date: '2024-05-21', time: '14:00', type: 'Raw', item: 'Whole Milk', unit: 'GAL', quantity: 2, reason: 'Expired', cost: 9.00 },
  { id: 'W-004', date: '2024-05-20', time: '16:45', type: 'Menu', item: 'House Mayo', unit: 'QT', quantity: 1, reason: 'Temperature abuse', cost: 3.00 },
])

const todayEntries = computed(() =>
  wasteEntries.value.filter((e) => e.date === wasteDate.value),
)

const todayTotalCost = computed(() =>
  todayEntries.value.reduce((sum, e) => sum + e.cost, 0),
)

const todayTotalItems = computed(() =>
  todayEntries.value.reduce((sum, e) => sum + e.quantity, 0),
)

const wasteColumns = [
  { key: 'date', label: 'Date' },
  { key: 'time', label: 'Time' },
  { key: 'type', label: 'Type' },
  { key: 'item', label: 'Item' },
  { key: 'quantity', label: 'Qty', class: 'text-right' },
  { key: 'unit', label: 'Unit' },
  { key: 'reason', label: 'Reason' },
  { key: 'cost', label: 'Cost', class: 'text-right' },
]

const logWaste = () => {
  if (!wasteItem.value || !wasteQuantity.value) return

  const newEntry: WasteEntry = {
    id: `W-${String(wasteEntries.value.length + 1).padStart(3, '0')}`,
    date: wasteDate.value,
    time: wasteTime.value,
    type: wasteType.value,
    item: wasteItem.value,
    unit: wasteUnit.value,
    quantity: wasteQuantity.value,
    reason: wasteReason.value,
    cost: costPreview.value,
  }

  wasteEntries.value.unshift(newEntry)

  // Reset form
  wasteItem.value = ''
  wasteUnit.value = ''
  wasteQuantity.value = null
  wasteReason.value = ''
}
</script>

<template>
  <div class="space-y-6">
    <LayoutPageHeader title="Waste Log" subtitle="Track and record inventory waste and spoilage" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Waste Entry Form -->
      <div class="lg:col-span-2">
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-6 space-y-5">
          <h2 class="text-lg font-semibold flex items-center gap-2">
            <Trash2 class="size-4 text-(--color-muted-foreground)" />
            New Waste Entry
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Date -->
            <div class="space-y-1.5">
              <label class="text-sm font-medium" for="waste-date">Date</label>
              <input
                id="waste-date"
                v-model="wasteDate"
                type="date"
                class="block w-full px-3 py-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
            </div>

            <!-- Time -->
            <div class="space-y-1.5">
              <label class="text-sm font-medium" for="waste-time">Time</label>
              <input
                id="waste-time"
                v-model="wasteTime"
                type="time"
                class="block w-full px-3 py-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
            </div>

            <!-- Type -->
            <div class="space-y-1.5">
              <label class="text-sm font-medium" for="waste-type">Type</label>
              <select
                id="waste-type"
                v-model="wasteType"
                class="block w-full px-3 py-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Raw">Raw</option>
                <option value="Prep">Prep</option>
                <option value="Menu">Menu</option>
              </select>
            </div>

            <!-- Item -->
            <div class="space-y-1.5">
              <label class="text-sm font-medium" for="waste-item">Item</label>
              <input
                id="waste-item"
                v-model="wasteItem"
                type="text"
                placeholder="e.g. Whole Milk"
                class="block w-full px-3 py-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
            </div>

            <!-- Unit -->
            <div class="space-y-1.5">
              <label class="text-sm font-medium" for="waste-unit">Unit</label>
              <input
                id="waste-unit"
                v-model="wasteUnit"
                type="text"
                placeholder="e.g. GAL"
                class="block w-full px-3 py-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
            </div>

            <!-- Quantity -->
            <div class="space-y-1.5">
              <label class="text-sm font-medium" for="waste-quantity">Quantity</label>
              <input
                id="waste-quantity"
                v-model.number="wasteQuantity"
                type="number"
                min="0"
                step="any"
                placeholder="0"
                class="block w-full px-3 py-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
            </div>
          </div>

          <!-- Reason -->
          <div class="space-y-1.5">
            <label class="text-sm font-medium" for="waste-reason">Reason</label>
            <textarea
              id="waste-reason"
              v-model="wasteReason"
              rows="3"
              placeholder="Describe the reason for waste..."
              class="block w-full px-3 py-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <!-- Cost Preview -->
          <div v-if="costPreview > 0" class="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <DollarSign class="size-4 text-amber-600" />
            <span class="text-sm font-medium text-amber-700">
              Estimated cost: {{ fmt(costPreview) }}
            </span>
          </div>

          <!-- Submit -->
          <div class="flex justify-end">
            <button
              :disabled="!wasteItem || !wasteQuantity"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              @click="logWaste"
            >
              <Plus class="size-4" />
              Log Waste
            </button>
          </div>
        </div>
      </div>

      <!-- Today's Summary Panel -->
      <div class="space-y-4">
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-5 space-y-4">
          <h3 class="font-semibold">Today's Waste Summary</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between py-2 border-b border-(--color-border)/30">
              <span class="text-sm text-(--color-muted-foreground)">Total Entries</span>
              <span class="font-medium">{{ todayEntries.length }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-(--color-border)/30">
              <span class="text-sm text-(--color-muted-foreground)">Items Wasted</span>
              <span class="font-medium">{{ todayTotalItems }}</span>
            </div>
            <div class="flex items-center justify-between py-2">
              <span class="text-sm text-(--color-muted-foreground)">Total Cost</span>
              <span class="font-semibold text-red-600">{{ fmt(todayTotalCost) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Waste Entries Table -->
    <div class="space-y-3">
      <h2 class="text-lg font-semibold">Waste History</h2>
      <CommonDataTable :columns="wasteColumns" :rows="wasteEntries">
        <template #cell-cost="{ value }">
          <span class="font-medium text-red-600">{{ fmt(value) }}</span>
        </template>
      </CommonDataTable>
    </div>
  </div>
</template>
