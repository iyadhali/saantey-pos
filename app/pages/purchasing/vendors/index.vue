<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui'
import type { Vendor } from '~~/shared/types'
import { MOCK_VENDORS } from '~/utils/mockData'

const searchQuery = ref('')

const columns: TableColumn<Vendor>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'contactName', header: 'Contact' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'lastOrder', header: 'Last Order' },
  { accessorKey: 'catalogItems', header: 'Catalog Items', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'status', header: 'Status' },
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

const handleRowClick = (_e: Event, row: TableRow<Vendor>) => {
  navigateTo(`/purchasing/vendors/${row.original.id}`)
}
</script>

<template>
  <UDashboardPanel id="vendors">
    <template #header>
      <UDashboardNavbar title="Vendors">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- Search -->
      <UInput v-model="searchQuery" icon="i-lucide-search" placeholder="Search vendors..." aria-label="Search vendors" class="max-w-sm" />

      <!-- Table -->
      <UTable :data="filteredVendors" :columns="columns" caption="Vendors" empty="No vendors found matching your search." @select="handleRowClick">
        <template #status-cell="{ row }">
          <CommonStatusBadge :status="row.original.status" />
        </template>
        <template #email-cell="{ row }">
          <span class="text-(--color-muted-foreground)">{{ row.original.email }}</span>
        </template>
      </UTable>
    </template>
  </UDashboardPanel>
</template>
