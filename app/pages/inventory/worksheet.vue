<script setup lang="ts">
import type { InventoryItem } from '~~/shared/types'
import { MOCK_INVENTORY } from '~/utils/mockData'

const groupedItems = computed(() => {
  const groups: Record<string, InventoryItem[]> = {}
  for (const item of MOCK_INVENTORY) {
    if (!groups[item.category]) groups[item.category] = []
    groups[item.category]!.push(item)
  }
  return groups
})

const categoryNames = computed(() => Object.keys(groupedItems.value).sort())
const handlePrint = () => { window.print() }
</script>

<template>
  <UDashboardPanel id="inventory-worksheet">
    <template #header>
      <UDashboardNavbar title="Inventory Worksheet">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton icon="i-lucide-printer" label="Print Worksheet" @click="handlePrint" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-for="category in categoryNames" :key="category" class="space-y-3">
        <h2 class="text-lg font-semibold border-b border-(--color-border) pb-2">{{ category }}</h2>
        <div class="border border-(--color-border) rounded-lg overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-(--color-muted)/50 border-b border-(--color-border)">
                <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground)">Item</th>
                <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground)">SKU</th>
                <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground)">Unit</th>
                <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground)">Par</th>
                <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground) w-32">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in groupedItems[category]" :key="item.id" class="border-b border-(--color-border) last:border-0">
                <td class="px-4 py-3 font-medium">{{ item.name }}</td>
                <td class="px-4 py-3 text-(--color-muted-foreground)">{{ item.sku }}</td>
                <td class="px-4 py-3">{{ item.unit }}</td>
                <td class="px-4 py-3 text-right">{{ item.par }}</td>
                <td class="px-4 py-3 text-right"><div class="border-b border-(--color-border) w-full min-h-[1.5rem]" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p v-if="categoryNames.length === 0" class="text-center py-8 text-(--color-muted-foreground)">No inventory items found.</p>
    </template>
  </UDashboardPanel>
</template>
