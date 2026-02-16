<script setup lang="ts">
import { ArrowLeft, Plus, Trash2, ChevronDown } from 'lucide-vue-next'
import type { InventoryItem } from '~~/shared/types'
import { MOCK_INVENTORY } from '~/utils/mockData'
import { useMenuStore, type MenuIngredientLine } from '~~/stores/menu'

const route = useRoute()
const menuStore = useMenuStore()

const draftId = ref('')
const showIngredientPicker = ref(false)

const isNew = computed(() => route.params.id === 'new')
const pageTitle = computed(() => isNew.value ? 'New Menu Item' : 'Edit Menu Item')

const categories = ['Mains', 'Salads', 'Appetizers', 'Desserts', 'Beverages']

// Initialize draft on mount
onMounted(() => {
  const paramId = route.params.id as string
  if (paramId === 'new') {
    draftId.value = menuStore.createMenuDraft()
  } else if (menuStore.menuDrafts[paramId]) {
    draftId.value = paramId
  } else {
    draftId.value = menuStore.createMenuDraft()
  }
})

const draft = computed(() => menuStore.menuDrafts[draftId.value])

const totalCost = computed(() => {
  if (!draft.value) return 0
  return draft.value.lines.reduce((sum: number, line: MenuIngredientLine) => sum + line.unitCost * line.qty, 0)
})

const foodCostPercent = computed(() => {
  if (!draft.value || draft.value.sellingPrice <= 0) return 0
  return (totalCost.value / draft.value.sellingPrice) * 100
})

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

function updateName(event: Event) {
  const value = (event.target as HTMLInputElement).value
  menuStore.updateMenuDraft(draftId.value, { name: value })
}

function updateCategory(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  menuStore.updateMenuDraft(draftId.value, { category: value })
}

function updateSellingPrice(event: Event) {
  const value = parseFloat((event.target as HTMLInputElement).value) || 0
  menuStore.updateMenuDraft(draftId.value, { sellingPrice: value })
}

function addIngredient(item: InventoryItem) {
  menuStore.addLine(draftId.value, {
    id: `LINE-${Date.now()}`,
    inventoryItemId: item.id,
    name: item.name,
    vendorId: '',
    unitCost: item.cost,
    qty: 1,
    unit: item.unit,
  })
  showIngredientPicker.value = false
}

function updateLineQty(lineId: string, event: Event) {
  const value = parseFloat((event.target as HTMLInputElement).value) || 0
  menuStore.updateLine(draftId.value, lineId, { qty: value })
}

function removeLine(lineId: string) {
  menuStore.removeLine(draftId.value, lineId)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Back Link -->
    <NuxtLink
      to="/recipes/menu"
      class="inline-flex items-center gap-1.5 text-sm text-(--color-muted-foreground) hover:text-(--color-foreground) transition-colors"
    >
      <ArrowLeft class="size-4" />
      Back to Menu Items
    </NuxtLink>

    <LayoutPageHeader :title="pageTitle" />

    <template v-if="draft">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Info -->
          <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-5 space-y-4">
            <h2 class="text-lg font-semibold">Basic Information</h2>

            <div class="space-y-2">
              <label class="text-sm font-medium text-(--color-foreground)">Name</label>
              <input
                :value="draft.name"
                type="text"
                placeholder="Menu item name"
                class="w-full px-3 py-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                @input="updateName"
              >
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-(--color-foreground)">Category</label>
                <select
                  :value="draft.category"
                  class="w-full px-3 py-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  @change="updateCategory"
                >
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-(--color-foreground)">Selling Price ($)</label>
                <input
                  :value="draft.sellingPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="w-full px-3 py-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  @input="updateSellingPrice"
                >
              </div>
            </div>
          </div>

          <!-- Ingredients -->
          <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-5 space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold">Ingredients</h2>
              <div class="relative">
                <button
                  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                  @click="showIngredientPicker = !showIngredientPicker"
                >
                  <Plus class="size-4" />
                  Add Ingredient
                  <ChevronDown class="size-3" />
                </button>

                <!-- Ingredient Picker Dropdown -->
                <div
                  v-if="showIngredientPicker"
                  class="absolute right-0 top-full mt-1 w-72 bg-(--color-card) border border-(--color-border) rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto"
                >
                  <button
                    v-for="item in MOCK_INVENTORY"
                    :key="item.id"
                    class="w-full text-left px-4 py-2.5 text-sm hover:bg-(--color-accent)/50 transition-colors border-b border-(--color-border)/30 last:border-0"
                    @click="addIngredient(item)"
                  >
                    <p class="font-medium">{{ item.name }}</p>
                    <p class="text-xs text-(--color-muted-foreground)">
                      {{ fmt(item.cost) }} / {{ item.unit }}
                    </p>
                  </button>
                </div>
              </div>
            </div>

            <!-- Ingredients Table -->
            <div v-if="draft.lines.length > 0" class="border border-(--color-border) rounded-lg overflow-hidden">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-(--color-muted)/50 border-b border-(--color-border)">
                    <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground)">Item</th>
                    <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground) w-24">Qty</th>
                    <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground)">Unit</th>
                    <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground)">Unit Cost</th>
                    <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground)">Line Total</th>
                    <th class="px-4 py-3 w-12" />
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="line in draft.lines"
                    :key="line.id"
                    class="border-b border-(--color-border) last:border-0"
                  >
                    <td class="px-4 py-3 font-medium">{{ line.name }}</td>
                    <td class="px-4 py-3">
                      <input
                        :value="line.qty"
                        type="number"
                        step="0.01"
                        min="0"
                        class="w-20 px-2 py-1 rounded border border-(--color-border) bg-(--color-background) text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary/50"
                        @input="updateLineQty(line.id, $event)"
                      >
                    </td>
                    <td class="px-4 py-3 text-(--color-muted-foreground)">{{ line.unit }}</td>
                    <td class="px-4 py-3 text-right">{{ fmt(line.unitCost) }}</td>
                    <td class="px-4 py-3 text-right font-medium">{{ fmt(line.unitCost * line.qty) }}</td>
                    <td class="px-4 py-3 text-center">
                      <button
                        class="p-1 rounded hover:bg-red-50 text-(--color-muted-foreground) hover:text-red-600 transition-colors"
                        @click="removeLine(line.id)"
                      >
                        <Trash2 class="size-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p v-else class="text-center py-6 text-(--color-muted-foreground) text-sm">
              No ingredients added yet. Click "Add Ingredient" to start building the recipe.
            </p>
          </div>
        </div>

        <!-- Costing Analysis Sidebar -->
        <div class="space-y-6">
          <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-5 space-y-4 sticky top-6">
            <h2 class="text-lg font-semibold">Costing Analysis</h2>

            <div class="space-y-3">
              <div class="flex items-center justify-between py-2 border-b border-(--color-border)/30">
                <span class="text-sm text-(--color-muted-foreground)">Total Cost</span>
                <span class="font-bold text-lg">{{ fmt(totalCost) }}</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-(--color-border)/30">
                <span class="text-sm text-(--color-muted-foreground)">Selling Price</span>
                <span class="font-medium">{{ fmt(draft.sellingPrice) }}</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-(--color-muted-foreground)">Food Cost %</span>
                <span
                  class="font-bold text-lg"
                  :class="foodCostPercent > 35 ? 'text-red-600' : foodCostPercent > 28 ? 'text-amber-600' : 'text-emerald-600'"
                >
                  {{ foodCostPercent.toFixed(1) }}%
                </span>
              </div>
            </div>

            <div
              class="p-3 rounded-lg text-sm"
              :class="foodCostPercent > 35 ? 'bg-red-50 text-red-700' : foodCostPercent > 28 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'"
            >
              <p v-if="foodCostPercent > 35">Food cost is above target. Consider adjusting portions or pricing.</p>
              <p v-else-if="foodCostPercent > 28">Food cost is within acceptable range but could be optimized.</p>
              <p v-else-if="foodCostPercent > 0">Food cost is within target range.</p>
              <p v-else class="text-(--color-muted-foreground)">Set a selling price to see food cost analysis.</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
