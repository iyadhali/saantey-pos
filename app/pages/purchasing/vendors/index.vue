<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { MOCK_VENDORS } from '~/utils/mockData'

const searchQuery = ref('')

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'contactName', label: 'Contact' },
  { key: 'email', label: 'Email' },
  { key: 'lastOrder', label: 'Last Order' },
  { key: 'catalogItems', label: 'Catalog Items', class: 'text-right' },
  { key: 'status', label: 'Status' },
]

const filteredVendors = computed(() => {
  if (!searchQuery.value) return MOCK_VENDORS
  const q = searchQuery.value.toLowerCase()
  return MOCK_VENDORS.filter(
    (v) =>
      v.name.toLowerCase().includes(q) ||
      v.contactName.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q),
  )
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleRowClick = (row: Record<string, any>) => {
  navigateTo(`/purchasing/vendors/${row.id}`)
}
</script>

<template>
  <div class="space-y-6">
    <LayoutPageHeader title="Vendors" subtitle="Manage vendor relationships and catalogs" />

    <!-- Search -->
    <div class="relative max-w-sm">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-(--color-muted-foreground)" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search vendors..."
        class="w-full pl-10 pr-4 py-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
    </div>

    <!-- Table -->
    <CommonDataTable :columns="columns" :rows="filteredVendors" @row-click="handleRowClick">
      <template #cell-status="{ value }">
        <CommonStatusBadge :status="value" />
      </template>
      <template #cell-email="{ value }">
        <span class="text-(--color-muted-foreground)">{{ value }}</span>
      </template>
    </CommonDataTable>

    <p v-if="filteredVendors.length === 0" class="text-center py-8 text-(--color-muted-foreground)">
      No vendors found matching your search.
    </p>
  </div>
</template>
