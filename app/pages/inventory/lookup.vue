<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import type { InventoryItem } from '~~/shared/types'
import { MOCK_INVENTORY } from '~/utils/mockData'

const searchQuery = ref('')
const activeCategory = ref('All')
const activeType = ref('All')

const categories = ['All', 'Dairy', 'Meat', 'Produce', 'Sauces']
const types = ['All', 'Raw', 'Prep', 'Menu']

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const columns = [
  { key: 'id', label: 'Item ID' },
  { key: 'name', label: 'Name' },
  { key: 'sku', label: 'SKU' },
  { key: 'category', label: 'Category' },
  { key: 'type', label: 'Type' },
  { key: 'unit', label: 'Unit' },
  { key: 'par', label: 'Par Level', class: 'text-right' },
  { key: 'onHand', label: 'On Hand', class: 'text-right' },
  { key: 'cost', label: 'Cost', class: 'text-right' },
]

const filteredItems = computed(() => {
  return MOCK_INVENTORY.filter((item) => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch =
      !searchQuery.value ||
      item.name.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    const matchesCategory =
      activeCategory.value === 'All' || item.category === activeCategory.value
    const matchesType =
      activeType.value === 'All' || item.type === activeType.value
    return matchesSearch && matchesCategory && matchesType
  })
})

const getStockColorClass = (item: InventoryItem): string => {
  const ratio = item.onHand / item.par
  if (ratio < 0.5) return 'text-red-600 font-semibold'
  if (ratio < 0.8) return 'text-amber-600 font-medium'
  return 'text-emerald-600 font-medium'
}
</script>

<template>
  <div class="space-y-6">
    <LayoutPageHeader title="Item Lookup" subtitle="Search and view all inventory items" />

    <!-- Search -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-(--color-muted-foreground)" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name, SKU, or category..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
      </div>
    </div>

    <!-- Category Filters -->
    <div class="space-y-3">
      <div class="flex gap-2 flex-wrap items-center">
        <span class="text-sm font-medium text-(--color-muted-foreground) mr-1">Category:</span>
        <button
          v-for="category in categories"
          :key="category"
          class="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors"
          :class="
            activeCategory === category
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-(--color-card) text-(--color-muted-foreground) border-(--color-border) hover:bg-(--color-accent)'
          "
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </div>

      <!-- Type Filters -->
      <div class="flex gap-2 flex-wrap items-center">
        <span class="text-sm font-medium text-(--color-muted-foreground) mr-1">Type:</span>
        <button
          v-for="itemType in types"
          :key="itemType"
          class="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors"
          :class="
            activeType === itemType
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-(--color-card) text-(--color-muted-foreground) border-(--color-border) hover:bg-(--color-accent)'
          "
          @click="activeType = itemType"
        >
          {{ itemType }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <CommonDataTable :columns="columns" :rows="filteredItems">
      <template #cell-onHand="{ row }">
        <span :class="getStockColorClass(row as InventoryItem)">
          {{ row.onHand }}
        </span>
      </template>
      <template #cell-cost="{ value }">
        {{ fmt(value) }}
      </template>
    </CommonDataTable>

    <p v-if="filteredItems.length === 0" class="text-center py-8 text-(--color-muted-foreground)">
      No items found matching your criteria.
    </p>
  </div>
</template>
