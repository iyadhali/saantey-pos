<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const NAV_ITEMS: NavigationMenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/',
  },
  {
    label: 'Purchasing',
    icon: 'i-lucide-shopping-cart',
    type: 'trigger',
    defaultOpen: true,
    children: [
      { label: 'Overview', to: '/purchasing' },
      { label: 'Purchase Orders', to: '/purchasing/orders' },
      { label: 'Invoices', to: '/purchasing/invoices' },
      { label: 'Bills', to: '/purchasing/bills' },
      { label: 'Vendors', to: '/purchasing/vendors' },
    ],
  },
  {
    label: 'Inventory',
    icon: 'i-lucide-package',
    type: 'trigger',
    defaultOpen: true,
    children: [
      { label: 'Overview', to: '/inventory' },
      { label: 'Item Lookup', to: '/inventory/lookup' },
      { label: 'Postings', to: '/inventory/posting' },
      { label: 'Wastage', to: '/inventory/waste' },
      { label: 'Worksheet', to: '/inventory/worksheet' },
    ],
  },
  {
    label: 'Recipes',
    icon: 'i-lucide-chef-hat',
    type: 'trigger',
    defaultOpen: true,
    children: [
      { label: 'Overview', to: '/recipes/overview' },
      { label: 'Menu Items', to: '/recipes/menu' },
      { label: 'Prep Items', to: '/recipes/prep' },
    ],
  },
  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    to: '/settings',
  },
]

const SECONDARY_NAV: NavigationMenuItem[] = [
  {
    label: 'Point of Sale',
    icon: 'i-lucide-monitor',
    to: '/pos',
  },
]

const searchGroups = computed(() => {
  const pages: { id: string; label: string; to: string; icon?: string }[] = []
  for (const item of NAV_ITEMS) {
    if (item.to) {
      pages.push({ id: item.to as string, label: item.label!, to: item.to as string, icon: item.icon })
    }
    if (item.children) {
      for (const child of item.children) {
        pages.push({ id: child.to as string, label: `${item.label} / ${child.label}`, to: child.to as string })
      }
    }
  }
  for (const item of SECONDARY_NAV) {
    if (item.to) {
      pages.push({ id: item.to as string, label: item.label!, to: item.to as string, icon: item.icon })
    }
  }
  return [{ id: 'pages', label: 'Pages', items: pages }]
})
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible resizable>
      <template #header="{ collapsed }">
        <SaanteyMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" />
        <UNavigationMenu
          :collapsed="collapsed"
          :items="NAV_ITEMS"
          orientation="vertical"
          class="flex-1"
        />
        <UNavigationMenu
          :collapsed="collapsed"
          :items="SECONDARY_NAV"
          orientation="vertical"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="searchGroups" />

    <slot />
  </UDashboardGroup>
</template>
