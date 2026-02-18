<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { InventoryItem } from '~~/shared/types'
import { MOCK_POSTINGS, MOCK_INVENTORY } from '~/utils/mockData'

interface CountedItem extends InventoryItem {
  counted: number | null
  variance: number | null
}

const route = useRoute()
const postingId = computed(() => route.params.id as string)

const posting = computed(() => MOCK_POSTINGS.find((p) => p.id === postingId.value))

const countedItems = computed(() =>
  MOCK_INVENTORY.map((item, idx) => ({
    ...item,
    counted: posting.value && idx < posting.value.itemsCounted ? item.onHand : null,
    variance: posting.value && idx < posting.value.itemsCounted ? 0 : null,
  })),
)

const itemColumns: TableColumn<CountedItem>[] = [
  { accessorKey: 'name', header: 'Item' },
  { accessorKey: 'sku', header: 'SKU' },
  { accessorKey: 'unit', header: 'Unit' },
  { accessorKey: 'onHand', header: 'Expected', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'counted', header: 'Counted', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'variance', header: 'Variance', meta: { class: { th: 'text-right', td: 'text-right' } } },
]

const handlePrint = () => {
  window.print()
}
</script>

<template>
  <UDashboardPanel id="posting-detail">
    <template #header>
      <UDashboardNavbar :title="posting?.id ?? 'Posting'">
        <template #leading>
          <UButton icon="i-lucide-arrow-left" variant="ghost" to="/inventory/posting" />
        </template>
        <template v-if="posting" #right>
          <UButton icon="i-lucide-printer" label="Print" variant="outline" @click="handlePrint" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <template v-if="posting">
        <p class="text-sm text-muted">Inventory count for {{ posting.location }}</p>

        <!-- Posting Info -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-1">
            <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Date</p>
            <p class="font-medium">{{ posting.date }}</p>
          </div>
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-1">
            <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Location</p>
            <p class="font-medium">{{ posting.location }}</p>
          </div>
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-1">
            <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Created By</p>
            <p class="font-medium">{{ posting.createdBy }}</p>
          </div>
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-1">
            <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Status</p>
            <CommonStatusBadge :status="posting.status" />
          </div>
        </div>

        <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4">
          <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide mb-1">Items Counted</p>
          <p class="font-medium">{{ posting.itemsCounted }} of {{ posting.totalItems }} items</p>
        </div>

        <div class="space-y-3">
          <h2 class="text-lg font-semibold">Count Details</h2>
          <UTable :data="countedItems" :columns="itemColumns" caption="Count details">
            <template #counted-cell="{ row }">
              <span v-if="row.original.counted !== null">{{ row.original.counted }}</span>
              <span v-else class="text-(--color-muted-foreground)">--</span>
            </template>
            <template #variance-cell="{ row }">
              <span v-if="row.original.variance !== null" :class="{ 'text-red-600': row.original.variance < 0, 'text-emerald-700': row.original.variance > 0, 'text-(--color-muted-foreground)': row.original.variance === 0 }">
                {{ row.original.variance > 0 ? `+${row.original.variance}` : row.original.variance }}
              </span>
              <span v-else class="text-(--color-muted-foreground)">--</span>
            </template>
          </UTable>
        </div>
      </template>

      <div v-else class="text-center py-12">
        <p class="text-(--color-muted-foreground)">Posting not found.</p>
        <NuxtLink to="/inventory/posting" class="text-sm text-primary hover:underline mt-2 inline-block">Return to Postings</NuxtLink>
      </div>
    </template>
  </UDashboardPanel>
</template>
