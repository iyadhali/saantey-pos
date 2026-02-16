<script setup lang="ts">
import { Plus, Search } from 'lucide-vue-next'
import { MOCK_INVENTORY } from '~/utils/mockData'

const searchQuery = ref('')

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const columns = [
  { key: 'id', label: 'Item ID' },
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'onHand', label: 'On Hand', class: 'text-right' },
  { key: 'unit', label: 'Unit' },
  { key: 'cost', label: 'Cost', class: 'text-right' },
]

const prepItems = computed(() => {
  const items = MOCK_INVENTORY.filter(i => i.type === 'Prep')

  if (!searchQuery.value) return items

  const query = searchQuery.value.toLowerCase()
  return items.filter(
    item =>
      item.name.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query),
  )
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleRowClick = (row: Record<string, any>) => {
  navigateTo(`/recipes/detail/${row.id}`)
}
</script>

<template>
  <div class="space-y-6">
    <LayoutPageHeader title="Prep Items" subtitle="Prepared ingredients and sub-recipes">
      <template #actions>
        <NuxtLink
          to="/recipes/detail/new"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus class="size-4" />
          New Prep Recipe
        </NuxtLink>
      </template>
    </LayoutPageHeader>

    <!-- Search -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-(--color-muted-foreground)" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search prep items..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
      </div>
    </div>

    <!-- Table -->
    <CommonDataTable :columns="columns" :rows="prepItems" @row-click="handleRowClick">
      <template #cell-onHand="{ value }">
        <span class="font-medium">{{ value }}</span>
      </template>
      <template #cell-cost="{ value }">
        <span class="font-medium">{{ fmt(value) }}</span>
      </template>
    </CommonDataTable>

    <p v-if="prepItems.length === 0" class="text-center py-8 text-(--color-muted-foreground)">
      No prep items found matching your criteria.
    </p>
  </div>
</template>
