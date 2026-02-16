<script setup lang="ts">
import { ArrowLeft, Save, Send, AlertTriangle } from 'lucide-vue-next'
import { MOCK_RECIPES, MOCK_INVENTORY } from '~/utils/mockData'

const route = useRoute()
const recipeId = computed(() => route.params.id as string)

const recipe = computed(() => MOCK_RECIPES.find(r => r.id === recipeId.value))

const isNew = computed(() => recipeId.value === 'new')

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const instructions = ref('')

// Mock ingredient detail data for the recipe
const ingredientColumns = [
  { key: 'name', label: 'Ingredient' },
  { key: 'qty', label: 'Qty', class: 'text-right' },
  { key: 'unit', label: 'Unit' },
  { key: 'cost', label: 'Unit Cost', class: 'text-right' },
  { key: 'lineTotal', label: 'Line Total', class: 'text-right' },
]

const mockIngredients = computed(() => {
  if (!recipe.value) return []
  // Generate plausible ingredient rows based on the recipe
  const pool = MOCK_INVENTORY.slice(0, recipe.value.ingredients)
  return pool.map(item => ({
    name: item.name,
    qty: Math.round(Math.random() * 3 * 10 + 1) / 10,
    unit: item.unit,
    cost: item.cost,
    lineTotal: item.cost * (Math.round(Math.random() * 3 * 10 + 1) / 10),
  }))
})

const costPerUnit = computed(() => {
  if (!recipe.value || recipe.value.yield <= 0) return 0
  return recipe.value.cost / recipe.value.yield
})

const allergenTags = computed(() => {
  if (!recipe.value) return []
  // Derive plausible allergens from recipe category
  const base = ['Dairy', 'Eggs']
  if (recipe.value.category === 'Mains') return [...base, 'Gluten']
  if (recipe.value.category === 'Salads') return ['Dairy', 'Fish']
  return base
})

const foodCostClass = computed(() => {
  if (!recipe.value) return ''
  const pct = recipe.value.foodCostPercent
  if (pct > 35) return 'text-red-600'
  if (pct > 28) return 'text-amber-600'
  return 'text-emerald-600'
})
</script>

<template>
  <div class="space-y-6">
    <!-- Back Link -->
    <NuxtLink
      to="/recipes"
      class="inline-flex items-center gap-1.5 text-sm text-(--color-muted-foreground) hover:text-(--color-foreground) transition-colors"
    >
      <ArrowLeft class="size-4" />
      Back to Recipes
    </NuxtLink>

    <template v-if="isNew">
      <LayoutPageHeader title="New Recipe" subtitle="Create a new prep recipe" />
      <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-8 text-center">
        <p class="text-(--color-muted-foreground)">New recipe form will be available soon.</p>
      </div>
    </template>

    <template v-else-if="recipe">
      <LayoutPageHeader :title="recipe.name" :subtitle="`${recipe.category} - Yield: ${recipe.yield} ${recipe.yieldUnit}`">
        <template #actions>
          <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-(--color-border) bg-(--color-card) font-medium text-sm hover:bg-(--color-accent) transition-colors">
            <Save class="size-4" />
            Save
          </button>
          <button class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">
            <Send class="size-4" />
            Publish
          </button>
        </template>
      </LayoutPageHeader>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Ingredients -->
          <div class="space-y-3">
            <h2 class="text-lg font-semibold">Ingredients</h2>
            <CommonDataTable :columns="ingredientColumns" :rows="mockIngredients">
              <template #cell-cost="{ value }">
                <span class="font-medium">{{ fmt(value) }}</span>
              </template>
              <template #cell-lineTotal="{ value }">
                <span class="font-medium">{{ fmt(value) }}</span>
              </template>
              <template #cell-qty="{ value }">
                <span class="font-medium">{{ value }}</span>
              </template>
            </CommonDataTable>
          </div>

          <!-- Preparation Instructions -->
          <div class="space-y-3">
            <h2 class="text-lg font-semibold">Preparation Instructions</h2>
            <textarea
              v-model="instructions"
              rows="6"
              placeholder="Enter step-by-step preparation instructions..."
              class="w-full px-4 py-3 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
            />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Costing Analysis -->
          <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-5 space-y-4">
            <h2 class="text-lg font-semibold">Costing Analysis</h2>

            <div class="space-y-3">
              <div class="flex items-center justify-between py-2 border-b border-(--color-border)/30">
                <span class="text-sm text-(--color-muted-foreground)">Yield</span>
                <span class="font-medium">{{ recipe.yield }} {{ recipe.yieldUnit }}</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-(--color-border)/30">
                <span class="text-sm text-(--color-muted-foreground)">Total Cost</span>
                <span class="font-bold">{{ fmt(recipe.cost) }}</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-(--color-border)/30">
                <span class="text-sm text-(--color-muted-foreground)">Cost per {{ recipe.yieldUnit }}</span>
                <span class="font-medium">{{ fmt(costPerUnit) }}</span>
              </div>
              <div v-if="recipe.price > 0" class="flex items-center justify-between py-2 border-b border-(--color-border)/30">
                <span class="text-sm text-(--color-muted-foreground)">Selling Price</span>
                <span class="font-medium">{{ fmt(recipe.price) }}</span>
              </div>
              <div v-if="recipe.price > 0" class="flex items-center justify-between py-2">
                <span class="text-sm text-(--color-muted-foreground)">Food Cost %</span>
                <span class="font-bold text-lg" :class="foodCostClass">
                  {{ recipe.foodCostPercent }}%
                </span>
              </div>
            </div>

            <div
              v-if="recipe.price > 0"
              class="p-3 rounded-lg text-sm"
              :class="recipe.foodCostPercent > 35 ? 'bg-red-50 text-red-700' : recipe.foodCostPercent > 28 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'"
            >
              <div class="flex items-start gap-2">
                <AlertTriangle v-if="recipe.foodCostPercent > 28" class="size-4 mt-0.5 shrink-0" />
                <p v-if="recipe.foodCostPercent > 35">Food cost exceeds target. Review ingredient costs or selling price.</p>
                <p v-else-if="recipe.foodCostPercent > 28">Food cost is acceptable but above the ideal range.</p>
                <p v-else>Food cost is within the target range.</p>
              </div>
            </div>
          </div>

          <!-- Allergen Tags -->
          <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-5 space-y-4">
            <h2 class="text-lg font-semibold">Allergens</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="allergen in allergenTags"
                :key="allergen"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200"
              >
                {{ allergen }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-12">
      <p class="text-(--color-muted-foreground)">Recipe not found.</p>
      <NuxtLink to="/recipes" class="text-sm text-primary hover:underline mt-2 inline-block">
        Return to Recipes
      </NuxtLink>
    </div>
  </div>
</template>
