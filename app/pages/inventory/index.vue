<script setup lang="ts">
import {
  Search,
  Package,
  ClipboardList,
  Trash2,
  FileSpreadsheet,
  ArrowRight,
  AlertTriangle,
  TrendingDown,
} from 'lucide-vue-next'
import { MOCK_INVENTORY, MOCK_POSTINGS } from '~/utils/mockData'

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const quickActions = [
  { label: 'Item Lookup', description: 'Search and view inventory items', icon: Search, href: '/inventory/lookup' },
  { label: 'Inventory Posting', description: 'Count and post inventory', icon: ClipboardList, href: '/inventory/posting' },
  { label: 'Wastage', description: 'Log waste and spoilage', icon: Trash2, href: '/inventory/waste' },
  { label: 'Worksheet', description: 'Printable count sheets', icon: FileSpreadsheet, href: '/inventory/worksheet' },
]

const lowStockItems = computed(() =>
  MOCK_INVENTORY.filter((item) => item.onHand < item.par),
)

const lowStockColumns = [
  { key: 'name', label: 'Item' },
  { key: 'sku', label: 'SKU' },
  { key: 'onHand', label: 'On Hand', class: 'text-right' },
  { key: 'par', label: 'Par', class: 'text-right' },
  { key: 'unit', label: 'Unit' },
]

const totalValue = computed(() =>
  MOCK_INVENTORY.reduce((sum, item) => sum + item.onHand * item.cost, 0),
)

const belowParCount = computed(() => lowStockItems.value.length)

const kpis = computed(() => [
  { label: 'Total Items', value: String(MOCK_INVENTORY.length), icon: Package, color: 'text-blue-600 bg-blue-50' },
  { label: 'Total Value', value: fmt(totalValue.value), icon: TrendingDown, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Below Par', value: String(belowParCount.value), icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handlePostingClick = (row: Record<string, any>) => {
  navigateTo(`/inventory/posting/${row.id}`)
}
</script>

<template>
  <div class="space-y-8">
    <LayoutPageHeader title="Inventory" subtitle="Manage stock levels, counts, and waste tracking" />

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

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <NuxtLink
        v-for="action in quickActions"
        :key="action.label"
        :to="action.href"
        class="group block border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-5 hover:border-primary/50 hover:shadow-md transition-all"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-(--color-secondary)/80 text-(--color-secondary-foreground) group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <component :is="action.icon" class="size-5" />
            </div>
            <div>
              <h3 class="font-semibold">{{ action.label }}</h3>
              <p class="text-sm text-(--color-muted-foreground)">{{ action.description }}</p>
            </div>
          </div>
          <ArrowRight class="size-4 text-(--color-muted-foreground) group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </NuxtLink>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Low Stock Alerts -->
      <div class="lg:col-span-2 space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle class="size-4 text-amber-500" />
            Low Stock Alerts
          </h2>
          <NuxtLink to="/inventory/lookup" class="text-sm text-primary hover:underline">
            View all items
          </NuxtLink>
        </div>
        <CommonDataTable :columns="lowStockColumns" :rows="lowStockItems">
          <template #cell-onHand="{ row }">
            <span
              class="font-medium"
              :class="row.onHand < row.par * 0.5 ? 'text-red-600' : 'text-amber-600'"
            >
              {{ row.onHand }}
            </span>
          </template>
        </CommonDataTable>
        <p v-if="lowStockItems.length === 0" class="text-center py-8 text-(--color-muted-foreground)">
          All items are at or above par levels.
        </p>
      </div>

      <!-- Recent Counts Panel -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Recent Counts</h2>
          <NuxtLink to="/inventory/posting" class="text-sm text-primary hover:underline">
            View all
          </NuxtLink>
        </div>
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg divide-y divide-(--color-border)/40">
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
  </div>
</template>
