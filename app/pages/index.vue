<script setup lang="ts">
import {
  Monitor,
  ShoppingCart,
  Package,
  ChefHat,
  FileText,
  Settings,
  ArrowRight,
  AlertCircle,
} from 'lucide-vue-next'

const MODULES = [
  {
    title: 'Point of Sale',
    icon: Monitor,
    href: '/pos',
    description: 'Floor plan, orders, and payments',
    counters: [
      { label: 'Active Tables', value: '8', type: 'neutral' },
      { label: 'Open Checks', value: '12', type: 'warning' },
    ],
  },
  {
    title: 'Purchasing',
    icon: ShoppingCart,
    href: '/purchasing',
    description: 'Manage orders, invoices, and vendors',
    counters: [
      { label: 'Unfinalized Invoices', value: '3', type: 'warning' },
      { label: 'Open Orders', value: '5', type: 'neutral' },
    ],
  },
  {
    title: 'Inventory',
    icon: Package,
    href: '/inventory',
    description: 'Counts, waste logs, and transfers',
    counters: [
      { label: 'Counts Due', value: '1', type: 'warning' },
      { label: 'Low Stock', value: '12', type: 'error' },
    ],
  },
  {
    title: 'Recipes',
    icon: ChefHat,
    href: '/recipes',
    description: 'Recipe costing and menu management',
    counters: [
      { label: 'High Variance', value: '2', type: 'error' },
    ],
  },
  {
    title: 'Reports',
    icon: FileText,
    href: '/reports',
    description: 'Cost of goods, variance, and usage',
    counters: [
      { label: 'Pending Review', value: '0', type: 'neutral' },
    ],
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
    description: 'System configuration and users',
    counters: [],
  },
]
</script>

<template>
  <div class="space-y-8">
    <LayoutPageHeader
      title="Dashboard"
      subtitle="Welcome back, John. Here is what needs your attention today."
    />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="mod in MODULES"
        :key="mod.title"
        :to="mod.href"
        class="block group"
      >
        <div class="h-full border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-6 hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer">
          <div class="flex items-start justify-between pb-2">
            <div class="flex items-center gap-3">
              <div class="p-2.5 rounded-lg bg-(--color-secondary)/80 text-(--color-secondary-foreground) group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <component :is="mod.icon" class="size-6" />
              </div>
              <div>
                <h3 class="text-xl font-semibold">{{ mod.title }}</h3>
                <p class="text-sm text-(--color-muted-foreground) mt-1">{{ mod.description }}</p>
              </div>
            </div>
            <ArrowRight class="size-5 text-(--color-muted-foreground) group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>

          <div class="flex flex-wrap gap-3 pt-6">
            <div
              v-for="(counter, i) in mod.counters"
              :key="i"
              class="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border"
              :class="
                counter.type === 'warning'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : counter.type === 'error'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-(--color-secondary)/50 text-(--color-secondary-foreground) border-transparent'
              "
            >
              <AlertCircle v-if="counter.type !== 'neutral'" class="size-3.5" />
              <span>{{ counter.value }} {{ counter.label }}</span>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
