<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { InventoryItem } from '~~/shared/types'
import { MOCK_INVENTORY } from '~/utils/mockData'

const searchQuery = ref('')
const activeCategory = ref('All')
const activeType = ref('All')

const categories = ['All', 'Dairy', 'Meat', 'Produce', 'Sauces']
const types = ['All', 'Raw', 'Prep', 'Menu']

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const columns: TableColumn<InventoryItem>[] = [
  { accessorKey: 'id', header: 'Item ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'sku', header: 'SKU' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'unit', header: 'Unit' },
  { accessorKey: 'par', header: 'Par Level', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'onHand', header: 'On Hand', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'cost', header: 'Cost', meta: { class: { th: 'text-right', td: 'text-right' } } },
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
  if (ratio < 0.8) return 'text-amber-700 font-medium'
  return 'text-emerald-700 font-medium'
}
</script>

<template>
  <UDashboardPanel id="item-lookup">
    <template #header>
      <UDashboardNavbar title="Item Lookup">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- Search -->
      <UInput v-model="searchQuery" icon="i-lucide-search" placeholder="Search by name, SKU, or category..." aria-label="Search inventory items" class="max-w-sm" />

      <!-- Filters -->
      <div class="space-y-3">
        <div class="flex gap-2 flex-wrap items-center">
          <span class="text-sm font-medium text-(--color-muted-foreground) mr-1">Category:</span>
          <button
            v-for="category in categories"
            :key="category"
            class="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors"
            :class="activeCategory === category ? 'bg-primary text-primary-foreground border-primary' : 'bg-(--color-card) text-(--color-muted-foreground) border-(--color-border) hover:bg-(--color-accent)'"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>
        <div class="flex gap-2 flex-wrap items-center">
          <span class="text-sm font-medium text-(--color-muted-foreground) mr-1">Type:</span>
          <button
            v-for="itemType in types"
            :key="itemType"
            class="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors"
            :class="activeType === itemType ? 'bg-primary text-primary-foreground border-primary' : 'bg-(--color-card) text-(--color-muted-foreground) border-(--color-border) hover:bg-(--color-accent)'"
            @click="activeType = itemType"
          >
            {{ itemType }}
          </button>
        </div>
      </div>

      <!-- Table -->
      <UTable :data="filteredItems" :columns="columns" caption="Inventory items" empty="No items found matching your criteria.">
        <template #onHand-cell="{ row }">
          <span :class="getStockColorClass(row.original as InventoryItem)">
            <UIcon v-if="row.original.onHand / row.original.par < 0.5" name="i-lucide-triangle-alert" class="size-3.5 inline align-text-bottom" />
            <UIcon v-else-if="row.original.onHand / row.original.par < 0.8" name="i-lucide-circle-alert" class="size-3.5 inline align-text-bottom" />
            {{ row.original.onHand }}
          </span>
        </template>
        <template #cost-cell="{ row }">{{ fmt(row.original.cost) }}</template>
      </UTable>
    </template>
  </UDashboardPanel>
</template>
