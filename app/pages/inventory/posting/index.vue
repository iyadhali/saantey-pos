<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui'
import type { InventoryPosting } from '~~/shared/types'
import { MOCK_POSTINGS } from '~/utils/mockData'

interface PostingRow extends InventoryPosting {
  counted: string
}

const columns: TableColumn<PostingRow>[] = [
  { accessorKey: 'id', header: 'Posting ID' },
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'location', header: 'Location' },
  { accessorKey: 'counted', header: 'Items Counted' },
  { accessorKey: 'createdBy', header: 'Created By' },
  { accessorKey: 'status', header: 'Status' },
]

const postingRows = computed(() =>
  MOCK_POSTINGS.map((posting) => ({
    ...posting,
    counted: `${posting.itemsCounted}/${posting.totalItems}`,
  })),
)

const handleRowClick = (_e: Event, row: TableRow<PostingRow>) => {
  navigateTo(`/inventory/posting/${row.original.id}`)
}
</script>

<template>
  <UDashboardPanel id="inventory-postings">
    <template #header>
      <UDashboardNavbar title="Inventory Postings">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton icon="i-lucide-plus" label="New Count" to="/inventory/posting/new" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UTable :data="postingRows" :columns="columns" caption="Inventory postings" empty="No inventory postings found." @select="handleRowClick">
        <template #status-cell="{ row }">
          <CommonStatusBadge :status="row.original.status" />
        </template>
      </UTable>
    </template>
  </UDashboardPanel>
</template>
