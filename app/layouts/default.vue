<script setup lang="ts">
import type { Component } from 'vue'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  ChefHat,
  Settings,
  Search,
  Bell,
  Menu,
} from 'lucide-vue-next'

interface NavChild {
  label: string
  href: string
}

interface NavItem {
  label: string
  icon: Component
  href: string
  children?: NavChild[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  {
    label: 'Purchasing',
    icon: ShoppingCart,
    href: '/purchasing',
    children: [
      { label: 'Overview', href: '/purchasing' },
      { label: 'Purchase Orders', href: '/purchasing/orders' },
      { label: 'Invoices', href: '/purchasing/invoices' },
      { label: 'Bills', href: '/purchasing/bills' },
      { label: 'Vendors', href: '/purchasing/vendors' },
    ],
  },
  {
    label: 'Inventory',
    icon: Package,
    href: '/inventory',
    children: [
      { label: 'Overview', href: '/inventory' },
      { label: 'Item Lookup', href: '/inventory/lookup' },
      { label: 'Postings', href: '/inventory/posting' },
      { label: 'Wastage', href: '/inventory/waste' },
      { label: 'Worksheet', href: '/inventory/worksheet' },
    ],
  },
  {
    label: 'Recipes',
    icon: ChefHat,
    href: '/recipes',
    children: [
      { label: 'Overview', href: '/recipes/overview' },
      { label: 'Menu Items', href: '/recipes/menu' },
      { label: 'Prep Items', href: '/recipes/prep' },
    ],
  },
  { label: 'Settings', icon: Settings, href: '/settings' },
]

const route = useRoute()
const isMobileMenuOpen = ref(false)

const openGroups = ref<Record<string, boolean>>({
  Purchasing: route.path.startsWith('/purchasing'),
  Inventory: route.path.startsWith('/inventory'),
  Recipes: route.path.startsWith('/recipes'),
})

function toggleGroup(key: string) {
  openGroups.value[key] = !openGroups.value[key]
}

function isActive(href: string) {
  return route.path === href || (href !== '/' && route.path.startsWith(href))
}
</script>

<template>
  <div class="min-h-screen bg-(--color-background) flex">
    <!-- Desktop Sidebar -->
    <aside class="hidden md:block w-64 fixed inset-y-0 z-50">
      <div class="flex flex-col h-full bg-(--color-sidebar) border-r border-(--color-sidebar-border)">
        <!-- Logo -->
        <div class="h-16 flex items-center px-6 border-b border-(--color-sidebar-border)">
          <div class="flex items-center gap-2 font-semibold text-lg text-(--color-sidebar-foreground)">
            <div class="size-8 rounded bg-primary flex items-center justify-center text-white font-bold">
              S
            </div>
            Saantey
          </div>
        </div>

        <!-- Nav -->
        <nav class="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <template v-for="item in NAV_ITEMS" :key="item.href">
            <!-- Simple nav item (no children) -->
            <NuxtLink
              v-if="!item.children"
              :to="item.href"
              class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="
                isActive(item.href)
                  ? 'bg-(--color-sidebar-primary) text-(--color-sidebar-primary-foreground)'
                  : 'text-(--color-sidebar-foreground) hover:bg-(--color-sidebar-accent) hover:text-(--color-sidebar-accent-foreground)'
              "
            >
              <component :is="item.icon" class="size-4" />
              {{ item.label }}
            </NuxtLink>

            <!-- Collapsible nav group -->
            <div v-else class="space-y-1">
              <button
                type="button"
                class="w-full flex items-center justify-between gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors"
                :class="
                  isActive(item.href)
                    ? 'bg-(--color-sidebar-primary)/10 text-(--color-sidebar-foreground)'
                    : 'text-(--color-sidebar-foreground) hover:bg-(--color-sidebar-accent) hover:text-(--color-sidebar-accent-foreground)'
                "
                @click="toggleGroup(item.label)"
              >
                <span class="flex items-center gap-3">
                  <component :is="item.icon" class="size-4" />
                  {{ item.label }}
                </span>
                <span
                  class="text-xs text-(--color-muted-foreground) transition-transform"
                  :class="openGroups[item.label] && 'rotate-180'"
                >
                  &#9660;
                </span>
              </button>

              <div
                class="grid transition-[grid-template-rows] duration-200 ease-out"
                :class="openGroups[item.label] ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
              >
                <div class="overflow-hidden">
                  <div class="pl-9 pr-2 py-1 space-y-1">
                    <NuxtLink
                      v-for="child in item.children"
                      :key="child.href"
                      :to="child.href"
                      class="flex items-center px-3 py-1.5 text-sm rounded-md transition-colors"
                      :class="
                        isActive(child.href)
                          ? 'bg-(--color-sidebar-primary) text-(--color-sidebar-primary-foreground)'
                          : 'text-(--color-muted-foreground) hover:bg-(--color-sidebar-accent) hover:text-(--color-sidebar-accent-foreground)'
                      "
                    >
                      {{ child.label }}
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </nav>

        <!-- User Footer -->
        <div class="p-4 border-t border-(--color-sidebar-border)">
          <div class="flex items-center gap-3 p-2 rounded-md hover:bg-(--color-sidebar-accent) transition-colors cursor-pointer">
            <UAvatar text="JD" size="sm" />
            <div class="flex flex-col text-sm">
              <span class="font-medium text-(--color-sidebar-foreground)">John Doe</span>
              <span class="text-xs text-(--color-muted-foreground)">Manager</span>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Mobile Sidebar (Sheet) -->
    <USlideover v-model:open="isMobileMenuOpen" side="left" class="md:hidden">
      <div class="flex flex-col h-full bg-(--color-sidebar)">
        <div class="h-16 flex items-center px-6 border-b border-(--color-sidebar-border)">
          <div class="flex items-center gap-2 font-semibold text-lg">
            <div class="size-8 rounded bg-primary flex items-center justify-center text-white font-bold">
              S
            </div>
            Saantey
          </div>
        </div>
        <nav class="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <template v-for="item in NAV_ITEMS" :key="item.href">
            <NuxtLink
              v-if="!item.children"
              :to="item.href"
              class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md"
              @click="isMobileMenuOpen = false"
            >
              <component :is="item.icon" class="size-4" />
              {{ item.label }}
            </NuxtLink>
            <div v-else class="space-y-1">
              <button
                type="button"
                class="w-full flex items-center justify-between gap-3 px-3 py-2 text-sm font-medium rounded-md"
                @click="toggleGroup(item.label)"
              >
                <span class="flex items-center gap-3">
                  <component :is="item.icon" class="size-4" />
                  {{ item.label }}
                </span>
              </button>
              <div v-if="openGroups[item.label]" class="pl-9 pr-2 py-1 space-y-1">
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.href"
                  :to="child.href"
                  class="flex items-center px-3 py-1.5 text-sm rounded-md"
                  @click="isMobileMenuOpen = false"
                >
                  {{ child.label }}
                </NuxtLink>
              </div>
            </div>
          </template>
        </nav>
      </div>
    </USlideover>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-h-screen md:ml-64">
      <!-- Top Header -->
      <header class="h-16 border-b border-(--color-border) bg-(--color-background)/95 backdrop-blur sticky top-0 z-40 px-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- Mobile Menu Trigger -->
          <UButton
            variant="ghost"
            size="sm"
            class="md:hidden"
            @click="isMobileMenuOpen = true"
          >
            <Menu class="size-5" />
          </UButton>

          <!-- Context Switcher -->
          <UDropdownMenu
            :items="[
              [
                { label: 'Main Restaurant' },
                { label: 'Pool Bar' },
                { label: 'Room Service' },
              ],
            ]"
          >
            <UButton variant="outline" class="h-9 gap-2 font-normal">
              <div class="flex flex-col items-start text-xs leading-none">
                <span class="font-semibold">Maldives Resort & Spa</span>
                <span class="text-(--color-muted-foreground)">Main Restaurant</span>
              </div>
            </UButton>
          </UDropdownMenu>
        </div>

        <div class="flex items-center gap-4">
          <div class="hidden sm:flex items-center gap-2 text-sm text-(--color-muted-foreground) bg-(--color-secondary)/50 px-3 py-1.5 rounded-full">
            <span class="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </div>

          <UButton variant="ghost" size="sm">
            <Search class="size-5 text-(--color-muted-foreground)" />
          </UButton>
          <UButton variant="ghost" size="sm" class="relative">
            <Bell class="size-5 text-(--color-muted-foreground)" />
            <span class="absolute top-1 right-1 size-2 bg-red-500 rounded-full border-2 border-(--color-background)" />
          </UButton>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-x-hidden p-6">
        <div class="max-w-7xl mx-auto space-y-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
