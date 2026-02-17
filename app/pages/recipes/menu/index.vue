<script setup lang="ts">
import { Plus, Search } from 'lucide-vue-next'
import { MOCK_RECIPES } from '~/utils/mockData'

const searchQuery = ref('')

const columns = [
  { key: 'id', label: 'Item ID' },
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status' },
  { key: 'foodCostPercent', label: 'Food Cost %', class: 'text-right' },
]

const menuItems = computed(() => {
  const items = MOCK_RECIPES
    .filter(r => r.price > 0)
    .map(r => ({ ...r, status: 'Active' as const }))

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
    <LayoutPageHeader title="Menu Items" subtitle="Costed menu recipes">
      <template #actions>
        <NuxtLink
          to="/recipes/menu/new/new"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus class="size-4" />
          New Menu Item
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
          placeholder="Search menu items..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
      </div>
    </div>

    <!-- Table -->
    <CommonDataTable :columns="columns" :rows="menuItems" @row-click="handleRowClick">
      <template #cell-status="{ value }">
        <CommonStatusBadge :status="value" />
      </template>
      <template #cell-foodCostPercent="{ value }">
        <span
          class="font-medium"
          :class="value > 30 ? 'text-red-600' : value > 25 ? 'text-amber-600' : 'text-emerald-600'"
        >
          {{ value }}%
        </span>
      </template>
    </CommonDataTable>

    <p v-if="menuItems.length === 0" class="text-center py-8 text-(--color-muted-foreground)">
      No menu items found matching your criteria.
    </p>
  </div>
</template>
