<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui'
import type { Recipe } from '~~/shared/types'
import { MOCK_RECIPES } from '~/utils/mockData'

const searchQuery = ref('')

type MenuItem = Recipe & { status: 'Active' }

const columns: TableColumn<MenuItem>[] = [
  { accessorKey: 'id', header: 'Item ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'foodCostPercent', header: 'Food Cost %', meta: { class: { th: 'text-right', td: 'text-right' } } },
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

const handleRowClick = (_e: Event, row: TableRow<MenuItem>) => {
  navigateTo(`/recipes/detail/${row.original.id}`)
}

</script>

<template>
  <UDashboardPanel id="menu-items">
    <template #header>
      <UDashboardNavbar title="Recipes">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton icon="i-lucide-plus" label="New Menu Item" to="/recipes/menu/new/new" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <RecipeTabs />

      <!-- Search -->
      <UInput v-model="searchQuery" icon="i-lucide-search" placeholder="Search menu items..." aria-label="Search menu items" class="max-w-sm" />

      <!-- Table -->
      <UTable :data="menuItems" :columns="columns" caption="Menu items" empty="No menu items found matching your criteria." @select="handleRowClick">
        <template #status-cell="{ row }">
          <CommonStatusBadge :status="row.original.status" />
        </template>
        <template #foodCostPercent-cell="{ row }">
          <span
            class="font-medium"
            :class="row.original.foodCostPercent > 30 ? 'text-red-600' : row.original.foodCostPercent > 25 ? 'text-amber-700' : 'text-emerald-700'"
          >
            <UIcon v-if="row.original.foodCostPercent > 30" name="i-lucide-trending-up" class="size-3.5 inline align-text-bottom" />
            {{ row.original.foodCostPercent }}%
          </span>
        </template>
      </UTable>
    </template>
  </UDashboardPanel>
</template>
