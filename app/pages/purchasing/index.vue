<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui'
import type { Order } from '~~/shared/types'
import { MOCK_ORDERS, MOCK_VENDORS } from '~/utils/mockData'

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const kpis = [
  { label: 'Weekly Spend', value: fmt(4976.45), icon: 'i-lucide-dollar-sign', color: 'text-emerald-700 bg-emerald-50' },
  { label: 'Pending Orders', value: '2', icon: 'i-lucide-shopping-cart', color: 'text-amber-700 bg-amber-50' },
  { label: 'Open Invoices', value: '3', icon: 'i-lucide-file-text', color: 'text-blue-600 bg-blue-50' },
]

const quickActions = [
  { label: 'Orders', description: 'View and manage purchase orders', icon: 'i-lucide-clipboard-list', href: '/purchasing/orders' },
  { label: 'Invoices', description: 'Track and finalize invoices', icon: 'i-lucide-file-text', href: '/purchasing/invoices' },
  { label: 'Vendors', description: 'Manage vendor relationships', icon: 'i-lucide-users', href: '/purchasing/vendors' },
]

const orderColumns: TableColumn<Order>[] = [
  { accessorKey: 'id', header: 'PO #' },
  { accessorKey: 'vendorName', header: 'Vendor' },
  { accessorKey: 'orderDate', header: 'Order Date' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'total', header: 'Total', meta: { class: { th: 'text-right', td: 'text-right' } } },
]

const recentOrders = MOCK_ORDERS.slice(0, 5)

const suggestedOrders = [
  { vendor: 'Sysco Foods', reason: 'Weekly restock due', items: 14 },
  { vendor: 'Baldor Specialty', reason: 'Low stock: Arugula, Tomatoes', items: 3 },
]

const topVendors = MOCK_VENDORS.slice(0, 3)

const handleOrderClick = (_e: Event, row: TableRow<Order>) => {
  navigateTo(`/purchasing/orders/${row.original.id}`)
}
</script>

<template>
  <UDashboardPanel id="purchasing">
    <template #header>
      <UDashboardNavbar title="Purchasing">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <p class="text-sm text-muted">Overview of purchasing activity and quick actions</p>

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
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
        <!-- Recent Orders Table -->
        <div class="lg:col-span-2 space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Recent Orders</h2>
            <NuxtLink to="/purchasing/orders" class="text-sm text-primary hover:underline">
              View all
            </NuxtLink>
          </div>
          <UTable :data="recentOrders" :columns="orderColumns" caption="Recent purchase orders" @select="handleOrderClick">
            <template #status-cell="{ row }">
              <CommonStatusBadge :status="row.original.status" />
            </template>
            <template #total-cell="{ row }">
              <span class="font-medium">{{ fmt(row.original.total) }}</span>
            </template>
          </UTable>
        </div>

        <!-- Side Panel -->
        <div class="space-y-6">
          <!-- Suggested Orders -->
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-5 space-y-4">
            <h3 class="font-semibold flex items-center gap-2">
              <UIcon name="i-lucide-trending-up" class="size-4 text-primary" />
              Suggested Orders
            </h3>
            <div
              v-for="suggestion in suggestedOrders"
              :key="suggestion.vendor"
              class="border border-(--color-border) rounded-md p-3 space-y-1"
            >
              <p class="font-medium text-sm">{{ suggestion.vendor }}</p>
              <p class="text-xs text-(--color-muted-foreground)">{{ suggestion.reason }}</p>
              <p class="text-xs text-(--color-muted-foreground)">{{ suggestion.items }} items</p>
            </div>
          </div>

          <!-- Top Vendors -->
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-5 space-y-4">
            <h3 class="font-semibold flex items-center gap-2">
              <UIcon name="i-lucide-users" class="size-4 text-primary" />
              Top Vendors
            </h3>
            <div
              v-for="vendor in topVendors"
              :key="vendor.id"
              class="flex items-center justify-between py-2 border-b border-(--color-border) last:border-0"
            >
              <div>
                <p class="font-medium text-sm">{{ vendor.name }}</p>
                <p class="text-xs text-(--color-muted-foreground)">{{ vendor.catalogItems }} items</p>
              </div>
              <CommonStatusBadge :status="vendor.status" :show-icon="false" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
