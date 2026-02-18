<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
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
  MOCK_INVENTORY.find((item) => item.name.toLowerCase() === wasteItem.value.toLowerCase()),
)

const costPreview = computed(() => {
  if (!matchedItem.value || !wasteQuantity.value) return 0
  return matchedItem.value.cost * wasteQuantity.value
})

watch(matchedItem, (item) => { if (item) wasteUnit.value = item.unit })

interface WasteEntry {
  id: string; date: string; time: string; type: string; item: string; unit: string; quantity: number; reason: string; cost: number
}

const wasteEntries = ref<WasteEntry[]>([
  { id: 'W-001', date: '2024-05-21', time: '09:30', type: 'Raw', item: 'Romaine Lettuce', unit: 'HD', quantity: 3, reason: 'Wilted beyond use', cost: 4.50 },
  { id: 'W-002', date: '2024-05-21', time: '11:15', type: 'Prep', item: 'Burger Patty (Prep)', unit: 'EA', quantity: 5, reason: 'Dropped on floor', cost: 9.25 },
  { id: 'W-003', date: '2024-05-21', time: '14:00', type: 'Raw', item: 'Whole Milk', unit: 'GAL', quantity: 2, reason: 'Expired', cost: 9.00 },
  { id: 'W-004', date: '2024-05-20', time: '16:45', type: 'Menu', item: 'House Mayo', unit: 'QT', quantity: 1, reason: 'Temperature abuse', cost: 3.00 },
])

const todayEntries = computed(() => wasteEntries.value.filter((e) => e.date === wasteDate.value))
const todayTotalCost = computed(() => todayEntries.value.reduce((sum, e) => sum + e.cost, 0))
const todayTotalItems = computed(() => todayEntries.value.reduce((sum, e) => sum + e.quantity, 0))

const wasteColumns: TableColumn<WasteEntry>[] = [
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'time', header: 'Time' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'item', header: 'Item' },
  { accessorKey: 'quantity', header: 'Qty', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'unit', header: 'Unit' },
  { accessorKey: 'reason', header: 'Reason' },
  { accessorKey: 'cost', header: 'Cost', meta: { class: { th: 'text-right', td: 'text-right' } } },
]

const logWaste = () => {
  if (!wasteItem.value || !wasteQuantity.value) return
  wasteEntries.value.unshift({
    id: `W-${String(wasteEntries.value.length + 1).padStart(3, '0')}`,
    date: wasteDate.value, time: wasteTime.value, type: wasteType.value,
    item: wasteItem.value, unit: wasteUnit.value, quantity: wasteQuantity.value,
    reason: wasteReason.value, cost: costPreview.value,
  })
  wasteItem.value = ''; wasteUnit.value = ''; wasteQuantity.value = null; wasteReason.value = ''
}
</script>

<template>
  <UDashboardPanel id="waste-log">
    <template #header>
      <UDashboardNavbar title="Waste Log">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Waste Entry Form -->
        <div class="lg:col-span-2">
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-6 space-y-5">
            <h2 class="text-lg font-semibold flex items-center gap-2">
              <UIcon name="i-lucide-trash-2" class="size-4 text-(--color-muted-foreground)" />
              New Waste Entry
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField label="Date" name="waste-date">
                <UInput v-model="wasteDate" type="date" />
              </UFormField>
              <UFormField label="Time" name="waste-time">
                <UInput v-model="wasteTime" type="time" />
              </UFormField>
              <UFormField label="Type" name="waste-type">
                <USelect v-model="wasteType" :items="['Raw', 'Prep', 'Menu']" />
              </UFormField>
              <UFormField label="Item" name="waste-item">
                <UInput v-model="wasteItem" placeholder="e.g. Whole Milk" />
              </UFormField>
              <UFormField label="Unit" name="waste-unit">
                <UInput v-model="wasteUnit" placeholder="e.g. GAL" />
              </UFormField>
              <UFormField label="Quantity" name="waste-quantity">
                <UInput v-model.number="wasteQuantity" type="number" min="0" step="any" placeholder="0" />
              </UFormField>
            </div>
            <UFormField label="Reason" name="waste-reason">
              <UTextarea v-model="wasteReason" :rows="3" placeholder="Describe the reason for waste..." />
            </UFormField>
            <div v-if="costPreview > 0" class="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <UIcon name="i-lucide-dollar-sign" class="size-4 text-amber-700" />
              <span class="text-sm font-medium text-amber-700">Estimated cost: {{ fmt(costPreview) }}</span>
            </div>
            <div class="flex justify-end">
              <UButton icon="i-lucide-plus" label="Log Waste" :disabled="!wasteItem || !wasteQuantity" @click="logWaste" />
            </div>
          </div>
        </div>

        <!-- Today's Summary -->
        <div class="space-y-4">
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-5 space-y-4">
            <h3 class="font-semibold">Today's Waste Summary</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between py-2 border-b border-(--color-border)">
                <span class="text-sm text-(--color-muted-foreground)">Total Entries</span>
                <span class="font-medium">{{ todayEntries.length }}</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-(--color-border)">
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

      <!-- Waste History -->
      <div class="space-y-3">
        <h2 class="text-lg font-semibold">Waste History</h2>
        <UTable :data="wasteEntries" :columns="wasteColumns" caption="Waste history">
          <template #cost-cell="{ row }">
            <span class="font-medium text-red-600">{{ fmt(row.original.cost) }}</span>
          </template>
        </UTable>
      </div>
    </template>
  </UDashboardPanel>
</template>
