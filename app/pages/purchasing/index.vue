<script setup lang="ts">
import {
  DollarSign,
  ShoppingCart,
  FileText,
  ClipboardList,
  Users,
  ArrowRight,
  TrendingUp,
} from 'lucide-vue-next'
import { MOCK_ORDERS, MOCK_VENDORS } from '~/utils/mockData'

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const kpis = [
  { label: 'Weekly Spend', value: fmt(4976.45), icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Pending Orders', value: '2', icon: ShoppingCart, color: 'text-amber-600 bg-amber-50' },
  { label: 'Open Invoices', value: '3', icon: FileText, color: 'text-blue-600 bg-blue-50' },
]

const quickActions = [
  { label: 'Orders', description: 'View and manage purchase orders', icon: ClipboardList, href: '/purchasing/orders' },
  { label: 'Invoices', description: 'Track and finalize invoices', icon: FileText, href: '/purchasing/invoices' },
  { label: 'Vendors', description: 'Manage vendor relationships', icon: Users, href: '/purchasing/vendors' },
]

const orderColumns = [
  { key: 'id', label: 'PO #' },
  { key: 'vendorName', label: 'Vendor' },
  { key: 'orderDate', label: 'Order Date' },
  { key: 'status', label: 'Status' },
  { key: 'total', label: 'Total', class: 'text-right' },
]

const recentOrders = MOCK_ORDERS.slice(0, 5)

const suggestedOrders = [
  { vendor: 'Sysco Foods', reason: 'Weekly restock due', items: 14 },
  { vendor: 'Baldor Specialty', reason: 'Low stock: Arugula, Tomatoes', items: 3 },
]

const topVendors = MOCK_VENDORS.slice(0, 3)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleOrderClick = (row: Record<string, any>) => {
  navigateTo(`/purchasing/orders/${row.id}`)
}
</script>

<template>
  <div class="space-y-8">
    <LayoutPageHeader title="Purchasing" subtitle="Overview of purchasing activity and quick actions" />

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
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
      <!-- Recent Orders Table -->
      <div class="lg:col-span-2 space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Recent Orders</h2>
          <NuxtLink to="/purchasing/orders" class="text-sm text-primary hover:underline">
            View all
          </NuxtLink>
        </div>
        <CommonDataTable :columns="orderColumns" :rows="recentOrders" @row-click="handleOrderClick">
          <template #cell-status="{ value }">
            <CommonStatusBadge :status="value" />
          </template>
          <template #cell-total="{ value }">
            <span class="font-medium">{{ fmt(value) }}</span>
          </template>
        </CommonDataTable>
      </div>

      <!-- Side Panel -->
      <div class="space-y-6">
        <!-- Suggested Orders -->
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-5 space-y-4">
          <h3 class="font-semibold flex items-center gap-2">
            <TrendingUp class="size-4 text-primary" />
            Suggested Orders
          </h3>
          <div
            v-for="suggestion in suggestedOrders"
            :key="suggestion.vendor"
            class="border border-(--color-border)/40 rounded-md p-3 space-y-1"
          >
            <p class="font-medium text-sm">{{ suggestion.vendor }}</p>
            <p class="text-xs text-(--color-muted-foreground)">{{ suggestion.reason }}</p>
            <p class="text-xs text-(--color-muted-foreground)">{{ suggestion.items }} items</p>
          </div>
        </div>

        <!-- Top Vendors -->
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-5 space-y-4">
          <h3 class="font-semibold flex items-center gap-2">
            <Users class="size-4 text-primary" />
            Top Vendors
          </h3>
          <div
            v-for="vendor in topVendors"
            :key="vendor.id"
            class="flex items-center justify-between py-2 border-b border-(--color-border)/30 last:border-0"
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
  </div>
</template>
