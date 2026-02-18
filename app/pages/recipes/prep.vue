<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui'
import type { InventoryItem } from '~~/shared/types'
import { MOCK_INVENTORY } from '~/utils/mockData'

const searchQuery = ref('')

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const columns: TableColumn<InventoryItem>[] = [
  { accessorKey: 'id', header: 'Item ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'onHand', header: 'On Hand', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'unit', header: 'Unit' },
  { accessorKey: 'cost', header: 'Cost', meta: { class: { th: 'text-right', td: 'text-right' } } },
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

const handleRowClick = (_e: Event, row: TableRow<InventoryItem>) => {
  navigateTo(`/recipes/detail/${row.original.id}`)
}

</script>

<template>
  <UDashboardPanel id="prep-items">
    <template #header>
      <UDashboardNavbar title="Recipes">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton icon="i-lucide-plus" label="New Prep Recipe" to="/recipes/detail/new" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <RecipeTabs />

      <!-- Search -->
      <UInput v-model="searchQuery" icon="i-lucide-search" placeholder="Search prep items..." aria-label="Search prep items" class="max-w-sm" />

      <!-- Table -->
      <UTable :data="prepItems" :columns="columns" caption="Prep items" empty="No prep items found matching your criteria." @select="handleRowClick">
        <template #onHand-cell="{ row }">
          <span class="font-medium">{{ row.original.onHand }}</span>
        </template>
        <template #cost-cell="{ row }">
          <span class="font-medium">{{ fmt(row.original.cost) }}</span>
        </template>
      </UTable>
    </template>
  </UDashboardPanel>
</template>
