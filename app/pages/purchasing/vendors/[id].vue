<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { VendorProduct } from '~~/shared/types'
import { MOCK_VENDORS } from '~/utils/mockData'

const route = useRoute()
const vendorId = computed(() => route.params.id as string)

const vendor = computed(() => MOCK_VENDORS.find((v) => v.id === vendorId.value))

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const catalogColumns: TableColumn<VendorProduct>[] = [
  { accessorKey: 'sku', header: 'SKU' },
  { accessorKey: 'name', header: 'Product' },
  { accessorKey: 'price', header: 'Price', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'unit', header: 'Unit' },
]
</script>

<template>
  <UDashboardPanel id="vendor-detail">
    <template #header>
      <UDashboardNavbar :title="vendor?.name ?? 'Vendor'">
        <template #leading>
          <UButton icon="i-lucide-arrow-left" variant="ghost" to="/purchasing/vendors" />
        </template>
        <template v-if="vendor" #right>
          <CommonStatusBadge :status="vendor.status" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <template v-if="vendor">
        <!-- Vendor Profile -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 flex items-start gap-3">
            <div class="p-2 rounded-lg bg-(--color-secondary)/80 text-(--color-secondary-foreground)">
              <UIcon name="i-lucide-user" class="size-4" />
            </div>
            <div class="space-y-1">
              <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Contact</p>
              <p class="font-medium">{{ vendor.contactName }}</p>
            </div>
          </div>
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 flex items-start gap-3">
            <div class="p-2 rounded-lg bg-(--color-secondary)/80 text-(--color-secondary-foreground)">
              <UIcon name="i-lucide-mail" class="size-4" />
            </div>
            <div class="space-y-1">
              <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Email</p>
              <p class="font-medium">{{ vendor.email }}</p>
            </div>
          </div>
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 flex items-start gap-3">
            <div class="p-2 rounded-lg bg-(--color-secondary)/80 text-(--color-secondary-foreground)">
              <UIcon name="i-lucide-package" class="size-4" />
            </div>
            <div class="space-y-1">
              <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Last Order</p>
              <p class="font-medium">{{ vendor.lastOrder }}</p>
            </div>
          </div>
        </div>

        <!-- Product Catalog -->
        <div class="space-y-3">
          <h2 class="text-lg font-semibold">
            Product Catalog
            <span class="text-sm font-normal text-(--color-muted-foreground) ml-2">
              {{ vendor.products.length }} items
            </span>
          </h2>
          <UTable :data="vendor.products" :columns="catalogColumns" caption="Product catalog" empty="No products in catalog.">
            <template #price-cell="{ row }">
              <span class="font-medium">{{ fmt(row.original.price) }}</span>
            </template>
          </UTable>
        </div>
      </template>

      <div v-else class="text-center py-12">
        <p class="text-(--color-muted-foreground)">Vendor not found.</p>
        <NuxtLink to="/purchasing/vendors" class="text-sm text-primary hover:underline mt-2 inline-block">
          Return to Vendors
        </NuxtLink>
      </div>
    </template>
  </UDashboardPanel>
</template>
