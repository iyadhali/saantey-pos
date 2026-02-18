<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { MOCK_RECIPES, MOCK_INVENTORY } from '~/utils/mockData'

const route = useRoute()
const recipeId = computed(() => route.params.id as string)

const recipe = computed(() => MOCK_RECIPES.find(r => r.id === recipeId.value))

const isNew = computed(() => recipeId.value === 'new')

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const instructions = ref('')

interface RecipeIngredient {
  name: string
  qty: number
  unit: string
  cost: number
  lineTotal: number
}

// Mock ingredient detail data for the recipe
const ingredientColumns: TableColumn<RecipeIngredient>[] = [
  { accessorKey: 'name', header: 'Ingredient' },
  { accessorKey: 'qty', header: 'Qty', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'unit', header: 'Unit' },
  { accessorKey: 'cost', header: 'Unit Cost', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'lineTotal', header: 'Line Total', meta: { class: { th: 'text-right', td: 'text-right' } } },
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
  if (pct > 28) return 'text-amber-700'
  return 'text-emerald-700'
})
</script>

<template>
  <UDashboardPanel id="recipe-detail">
    <template #header>
      <UDashboardNavbar :title="isNew ? 'New Recipe' : (recipe?.name ?? 'Recipe Detail')">
        <template #leading>
          <UButton icon="i-lucide-arrow-left" variant="ghost" to="/recipes/overview" />
        </template>
        <template v-if="recipe" #right>
          <UButton icon="i-lucide-save" label="Save" variant="outline" />
          <UButton icon="i-lucide-send" label="Publish" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <template v-if="isNew">
        <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-8 text-center">
          <p class="text-(--color-muted-foreground)">New recipe form will be available soon.</p>
        </div>
      </template>

      <template v-else-if="recipe">
        <p class="text-sm text-(--color-muted-foreground)">{{ recipe.category }} - Yield: {{ recipe.yield }} {{ recipe.yieldUnit }}</p>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Ingredients -->
            <div class="space-y-3">
              <h2 class="text-lg font-semibold">Ingredients</h2>
              <UTable :data="mockIngredients" :columns="ingredientColumns" caption="Recipe ingredients">
                <template #cost-cell="{ row }">
                  <span class="font-medium">{{ fmt(row.original.cost) }}</span>
                </template>
                <template #lineTotal-cell="{ row }">
                  <span class="font-medium">{{ fmt(row.original.lineTotal) }}</span>
                </template>
                <template #qty-cell="{ row }">
                  <span class="font-medium">{{ row.original.qty }}</span>
                </template>
              </UTable>
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
            <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-5 space-y-4">
              <h2 class="text-lg font-semibold">Costing Analysis</h2>

              <div class="space-y-3">
                <div class="flex items-center justify-between py-2 border-b border-(--color-border)">
                  <span class="text-sm text-(--color-muted-foreground)">Yield</span>
                  <span class="font-medium">{{ recipe.yield }} {{ recipe.yieldUnit }}</span>
                </div>
                <div class="flex items-center justify-between py-2 border-b border-(--color-border)">
                  <span class="text-sm text-(--color-muted-foreground)">Total Cost</span>
                  <span class="font-bold">{{ fmt(recipe.cost) }}</span>
                </div>
                <div class="flex items-center justify-between py-2 border-b border-(--color-border)">
                  <span class="text-sm text-(--color-muted-foreground)">Cost per {{ recipe.yieldUnit }}</span>
                  <span class="font-medium">{{ fmt(costPerUnit) }}</span>
                </div>
                <div v-if="recipe.price > 0" class="flex items-center justify-between py-2 border-b border-(--color-border)">
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
                  <UIcon v-if="recipe.foodCostPercent > 28" name="i-lucide-alert-triangle" class="size-4 mt-0.5 shrink-0" />
                  <p v-if="recipe.foodCostPercent > 35">Food cost exceeds target. Review ingredient costs or selling price.</p>
                  <p v-else-if="recipe.foodCostPercent > 28">Food cost is acceptable but above the ideal range.</p>
                  <p v-else>Food cost is within the target range.</p>
                </div>
              </div>
            </div>

            <!-- Allergen Tags -->
            <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-5 space-y-4">
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
    </template>
  </UDashboardPanel>
</template>
