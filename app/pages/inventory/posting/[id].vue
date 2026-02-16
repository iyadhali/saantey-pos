<script setup lang="ts">
import { ArrowLeft, Printer } from 'lucide-vue-next'
import { MOCK_POSTINGS, MOCK_INVENTORY } from '~/utils/mockData'

const route = useRoute()
const postingId = computed(() => route.params.id as string)

const posting = computed(() => MOCK_POSTINGS.find((p) => p.id === postingId.value))

// Simulate counted quantities (use onHand as the counted value for demo)
const countedItems = computed(() =>
  MOCK_INVENTORY.map((item, idx) => ({
    ...item,
    counted: posting.value && idx < posting.value.itemsCounted ? item.onHand : null,
    variance: posting.value && idx < posting.value.itemsCounted ? 0 : null,
  })),
)

const itemColumns = [
  { key: 'name', label: 'Item' },
  { key: 'sku', label: 'SKU' },
  { key: 'unit', label: 'Unit' },
  { key: 'onHand', label: 'Expected', class: 'text-right' },
  { key: 'counted', label: 'Counted', class: 'text-right' },
  { key: 'variance', label: 'Variance', class: 'text-right' },
]

const handlePrint = () => {
  window.print()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Back Link -->
    <NuxtLink
      to="/inventory/posting"
      class="inline-flex items-center gap-1.5 text-sm text-(--color-muted-foreground) hover:text-(--color-foreground) transition-colors"
    >
      <ArrowLeft class="size-4" />
      Back to Postings
    </NuxtLink>

    <template v-if="posting">
      <LayoutPageHeader :title="posting.id" :subtitle="`Inventory count for ${posting.location}`">
        <template #actions>
          <button
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-(--color-border) text-sm font-medium hover:bg-(--color-accent) transition-colors"
            @click="handlePrint"
          >
            <Printer class="size-4" />
            Print
          </button>
        </template>
      </LayoutPageHeader>

      <!-- Posting Info -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4 space-y-1">
          <p class="text-xs text-(--color-muted-foreground) uppercase tracking-wide">Date</p>
          <p class="font-medium">{{ posting.date }}</p>
        </div>
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4 space-y-1">
          <p class="text-xs text-(--color-muted-foreground) uppercase tracking-wide">Location</p>
          <p class="font-medium">{{ posting.location }}</p>
        </div>
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4 space-y-1">
          <p class="text-xs text-(--color-muted-foreground) uppercase tracking-wide">Created By</p>
          <p class="font-medium">{{ posting.createdBy }}</p>
        </div>
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4 space-y-1">
          <p class="text-xs text-(--color-muted-foreground) uppercase tracking-wide">Status</p>
          <CommonStatusBadge :status="posting.status" />
        </div>
      </div>

      <!-- Items Counted Summary -->
      <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4">
        <p class="text-xs text-(--color-muted-foreground) uppercase tracking-wide mb-1">Items Counted</p>
        <p class="font-medium">{{ posting.itemsCounted }} of {{ posting.totalItems }} items</p>
      </div>

      <!-- Items Table -->
      <div class="space-y-3">
        <h2 class="text-lg font-semibold">Count Details</h2>
        <CommonDataTable :columns="itemColumns" :rows="countedItems">
          <template #cell-counted="{ value }">
            <span v-if="value !== null">{{ value }}</span>
            <span v-else class="text-(--color-muted-foreground)">--</span>
          </template>
          <template #cell-variance="{ value }">
            <span
              v-if="value !== null"
              :class="{
                'text-red-600': value < 0,
                'text-emerald-600': value > 0,
                'text-(--color-muted-foreground)': value === 0,
              }"
            >
              {{ value > 0 ? `+${value}` : value }}
            </span>
            <span v-else class="text-(--color-muted-foreground)">--</span>
          </template>
        </CommonDataTable>
      </div>
    </template>

    <div v-else class="text-center py-12">
      <p class="text-(--color-muted-foreground)">Posting not found.</p>
      <NuxtLink to="/inventory/posting" class="text-sm text-primary hover:underline mt-2 inline-block">
        Return to Postings
      </NuxtLink>
    </div>
  </div>
</template>
