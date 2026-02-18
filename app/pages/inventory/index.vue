<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { InventoryItem, InventoryPosting } from '~~/shared/types'
import { MOCK_INVENTORY, MOCK_POSTINGS } from '~/utils/mockData'

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const quickActions = [
  { label: 'Item Lookup', description: 'Search and view inventory items', icon: 'i-lucide-search', href: '/inventory/lookup' },
  { label: 'Inventory Posting', description: 'Count and post inventory', icon: 'i-lucide-clipboard-list', href: '/inventory/posting' },
  { label: 'Wastage', description: 'Log waste and spoilage', icon: 'i-lucide-trash-2', href: '/inventory/waste' },
  { label: 'Worksheet', description: 'Printable count sheets', icon: 'i-lucide-file-spreadsheet', href: '/inventory/worksheet' },
]

const lowStockItems = computed(() =>
  MOCK_INVENTORY.filter((item) => item.onHand < item.par),
)

const lowStockColumns: TableColumn<InventoryItem>[] = [
  { accessorKey: 'name', header: 'Item' },
  { accessorKey: 'sku', header: 'SKU' },
  { accessorKey: 'onHand', header: 'On Hand', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'par', header: 'Par', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'unit', header: 'Unit' },
]

const totalValue = computed(() =>
  MOCK_INVENTORY.reduce((sum, item) => sum + item.onHand * item.cost, 0),
)

const belowParCount = computed(() => lowStockItems.value.length)

const kpis = computed(() => [
  { label: 'Total Items', value: String(MOCK_INVENTORY.length), icon: 'i-lucide-package', color: 'text-blue-600 bg-blue-50' },
  { label: 'Total Value', value: fmt(totalValue.value), icon: 'i-lucide-trending-down', color: 'text-emerald-700 bg-emerald-50' },
  { label: 'Below Par', value: String(belowParCount.value), icon: 'i-lucide-alert-triangle', color: 'text-amber-700 bg-amber-50' },
])

const handlePostingClick = (row: InventoryPosting) => {
  navigateTo(`/inventory/posting/${row.id}`)
}
</script>

<template>
  <UDashboardPanel id="inventory">
    <template #header>
      <UDashboardNavbar title="Inventory">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <p class="text-sm text-muted">Manage stock levels, counts, and waste tracking</p>

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

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink
          v-for="action in quickActions"
          :key="action.label"
          :to="action.href"
          class="group block border border-(--color-border) bg-(--color-card) rounded-lg p-5 hover:border-primary/50 hover:shadow-md transition-all"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-(--color-secondary)/80 text-(--color-secondary-foreground) group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <UIcon :name="action.icon" class="size-5" />
              </div>
              <div>
                <h3 class="font-semibold">{{ action.label }}</h3>
                <p class="text-sm text-(--color-muted-foreground)">{{ action.description }}</p>
              </div>
            </div>
            <UIcon name="i-lucide-arrow-right" class="size-4 text-(--color-muted-foreground) group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </NuxtLink>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Low Stock Alerts -->
        <div class="lg:col-span-2 space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold flex items-center gap-2">
              <UIcon name="i-lucide-alert-triangle" class="size-4 text-amber-500" />
              Low Stock Alerts
            </h2>
            <NuxtLink to="/inventory/lookup" class="text-sm text-primary hover:underline">
              View all items
            </NuxtLink>
          </div>
          <UTable :data="lowStockItems" :columns="lowStockColumns" caption="Low stock alerts" empty="All items are at or above par levels.">
            <template #onHand-cell="{ row }">
              <span
                class="font-medium"
                :class="row.original.onHand < row.original.par * 0.5 ? 'text-red-600' : 'text-amber-700'"
              >
                {{ row.original.onHand }}
              </span>
            </template>
          </UTable>
        </div>

        <!-- Recent Counts Panel -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Recent Counts</h2>
            <NuxtLink to="/inventory/posting" class="text-sm text-primary hover:underline">
              View all
            </NuxtLink>
          </div>
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg divide-y divide-(--color-border)">
            <div
              v-for="posting in MOCK_POSTINGS"
              :key="posting.id"
              class="p-4 hover:bg-(--color-accent)/50 cursor-pointer transition-colors"
              @click="handlePostingClick(posting)"
            >
              <div class="flex items-center justify-between mb-1">
                <p class="font-medium text-sm">{{ posting.id }}</p>
                <CommonStatusBadge :status="posting.status" :show-icon="false" />
              </div>
              <p class="text-xs text-(--color-muted-foreground)">{{ posting.date }} &middot; {{ posting.createdBy }}</p>
              <p class="text-xs text-(--color-muted-foreground)">{{ posting.itemsCounted }}/{{ posting.totalItems }} items counted</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
