<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { MOCK_POSTINGS } from '~/utils/mockData'

const columns = [
  { key: 'id', label: 'Posting ID' },
  { key: 'date', label: 'Date' },
  { key: 'location', label: 'Location' },
  { key: 'counted', label: 'Items Counted' },
  { key: 'createdBy', label: 'Created By' },
  { key: 'status', label: 'Status' },
]

const postingRows = computed(() =>
  MOCK_POSTINGS.map((posting) => ({
    ...posting,
    counted: `${posting.itemsCounted}/${posting.totalItems}`,
  })),
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleRowClick = (row: Record<string, any>) => {
  navigateTo(`/inventory/posting/${row.id}`)
}
</script>

<template>
  <div class="space-y-6">
    <LayoutPageHeader title="Inventory Postings" subtitle="View and manage inventory counts">
      <template #actions>
        <NuxtLink
          to="/inventory/posting/new"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus class="size-4" />
          New Count
        </NuxtLink>
      </template>
    </LayoutPageHeader>

    <!-- Table -->
    <CommonDataTable :columns="columns" :rows="postingRows" @row-click="handleRowClick">
      <template #cell-status="{ value }">
        <CommonStatusBadge :status="value" />
      </template>
    </CommonDataTable>

    <p v-if="postingRows.length === 0" class="text-center py-8 text-(--color-muted-foreground)">
      No inventory postings found.
    </p>
  </div>
</template>
