<script setup lang="ts">
import {
  UtensilsCrossed,
  ChefHat,
  Leaf,
  TrendingUp,
  DollarSign,
  BarChart3,
} from 'lucide-vue-next'


import { MOCK_RECIPES, MOCK_INVENTORY } from '~/utils/mockData'

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const menuItemCount = computed(() => MOCK_INVENTORY.filter(i => i.type === 'Menu').length)
const prepItemCount = computed(() => MOCK_INVENTORY.filter(i => i.type === 'Prep').length)
const rawItemCount = computed(() => MOCK_INVENTORY.filter(i => i.type === 'Raw').length)

const kpis = computed(() => [
  { label: 'Menu Items', value: String(menuItemCount.value), icon: UtensilsCrossed, color: 'text-blue-600 bg-blue-50' },
  { label: 'Prep Items', value: String(prepItemCount.value), icon: ChefHat, color: 'text-amber-600 bg-amber-50' },
  { label: 'Raw Items', value: String(rawItemCount.value), icon: Leaf, color: 'text-emerald-600 bg-emerald-50' },
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

const recipeColumns = [
  { key: 'id', label: 'Recipe ID' },
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'cost', label: 'Cost', class: 'text-right' },
  { key: 'foodCostPercent', label: 'Food Cost %', class: 'text-right' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleRecipeClick = (row: Record<string, any>) => {
  navigateTo(`/recipes/detail/${row.id}`)
}
</script>

<template>
  <div class="space-y-8">
    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div
        v-for="kpi in kpis"
        :key="kpi.label"
        class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-5"
      >
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg" :class="kpi.color">
            <component :is="kpi.icon" class="size-5" />
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
      <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-5">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg text-violet-600 bg-violet-50">
            <BarChart3 class="size-5" />
          </div>
          <div>
            <p class="text-sm text-(--color-muted-foreground)">Total Recipes</p>
            <p class="text-2xl font-bold tracking-tight">{{ totalRecipes }}</p>
          </div>
        </div>
      </div>
      <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-5">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg text-orange-600 bg-orange-50">
            <TrendingUp class="size-5" />
          </div>
          <div>
            <p class="text-sm text-(--color-muted-foreground)">Avg Food Cost %</p>
            <p class="text-2xl font-bold tracking-tight">{{ averageFoodCost.toFixed(1) }}%</p>
          </div>
        </div>
      </div>
      <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-5">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-lg text-red-600 bg-red-50">
            <DollarSign class="size-5" />
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
      <CommonDataTable :columns="recipeColumns" :rows="MOCK_RECIPES" @row-click="handleRecipeClick">
        <template #cell-cost="{ value }">
          <span class="font-medium">{{ fmt(value) }}</span>
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
    </div>
  </div>
</template>
