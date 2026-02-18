<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui'
import type { Recipe } from '~~/shared/types'
import { MOCK_RECIPES, MOCK_INVENTORY } from '~/utils/mockData'

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const menuItemCount = computed(() => MOCK_INVENTORY.filter(i => i.type === 'Menu').length)
const prepItemCount = computed(() => MOCK_INVENTORY.filter(i => i.type === 'Prep').length)
const rawItemCount = computed(() => MOCK_INVENTORY.filter(i => i.type === 'Raw').length)

const kpis = computed(() => [
  { label: 'Menu Items', value: String(menuItemCount.value), icon: 'i-lucide-utensils-crossed', color: 'text-blue-600 bg-blue-50' },
  { label: 'Prep Items', value: String(prepItemCount.value), icon: 'i-lucide-chef-hat', color: 'text-amber-700 bg-amber-50' },
  { label: 'Raw Items', value: String(rawItemCount.value), icon: 'i-lucide-leaf', color: 'text-emerald-700 bg-emerald-50' },
])

const totalRecipes = computed(() => MOCK_RECIPES.length)

const averageFoodCost = computed(() => {
  const menuRecipes = MOCK_RECIPES.filter(r => r.price > 0)
  if (menuRecipes.length === 0) return 0
  return menuRecipes.reduce((sum, r) => sum + r.foodCostPercent, 0) / menuRecipes.length
})

const highestCostItem = computed(() => {
  const menuRecipes = MOCK_RECIPES.filter(r => r.price > 0)
  if (menuRecipes.length === 0) return null
  return menuRecipes.reduce((max, r) => (r.foodCostPercent > max.foodCostPercent ? r : max), menuRecipes[0]!)
})

const recipeColumns: TableColumn<Recipe>[] = [
  { accessorKey: 'id', header: 'Recipe ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'cost', header: 'Cost', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'foodCostPercent', header: 'Food Cost %', meta: { class: { th: 'text-right', td: 'text-right' } } },
]

const handleRecipeClick = (_e: Event, row: TableRow<Recipe>) => {
  navigateTo(`/recipes/detail/${row.original.id}`)
}

</script>

<template>
  <UDashboardPanel id="recipes-overview">
    <template #header>
      <UDashboardNavbar title="Recipes">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <RecipeTabs />

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          v-for="kpi in kpis"
          :key="kpi.label"
          class="border border-(--color-border) bg-(--color-card) rounded-lg p-5"
        >
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-lg" :class="kpi.color">
              <UIcon :name="kpi.icon" class="size-5" />
            </div>
            <div>
              <p class="text-sm text-(--color-muted-foreground)">{{ kpi.label }}</p>
              <p class="text-2xl font-bold tracking-tight">{{ kpi.value }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recipe Summary -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-lg text-violet-600 bg-violet-50">
              <UIcon name="i-lucide-bar-chart-3" class="size-5" />
            </div>
            <div>
              <p class="text-sm text-(--color-muted-foreground)">Total Recipes</p>
              <p class="text-2xl font-bold tracking-tight">{{ totalRecipes }}</p>
            </div>
          </div>
        </div>
        <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-lg text-orange-600 bg-orange-50">
              <UIcon name="i-lucide-trending-up" class="size-5" />
            </div>
            <div>
              <p class="text-sm text-(--color-muted-foreground)">Avg Food Cost %</p>
              <p class="text-2xl font-bold tracking-tight">{{ averageFoodCost.toFixed(1) }}%</p>
            </div>
          </div>
        </div>
        <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-5">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-lg text-red-600 bg-red-50">
              <UIcon name="i-lucide-dollar-sign" class="size-5" />
            </div>
            <div>
              <p class="text-sm text-(--color-muted-foreground)">Highest Cost Item</p>
              <p class="text-2xl font-bold tracking-tight">
                {{ highestCostItem ? highestCostItem.name : 'N/A' }}
              </p>
              <p v-if="highestCostItem" class="text-xs text-(--color-muted-foreground)">
                {{ highestCostItem.foodCostPercent }}% food cost
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- All Recipes Table -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">All Recipes</h2>
        </div>
        <UTable :data="MOCK_RECIPES" :columns="recipeColumns" caption="All recipes" @select="handleRecipeClick">
          <template #cost-cell="{ row }">
            <span class="font-medium">{{ fmt(row.original.cost) }}</span>
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
      </div>
    </template>
  </UDashboardPanel>
</template>
