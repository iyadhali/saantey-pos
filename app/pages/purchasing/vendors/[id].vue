<script setup lang="ts">
import { ArrowLeft, Mail, User, Package } from 'lucide-vue-next'
import { MOCK_VENDORS } from '~/utils/mockData'

const route = useRoute()
const vendorId = computed(() => route.params.id as string)

const vendor = computed(() => MOCK_VENDORS.find((v) => v.id === vendorId.value))

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

const catalogColumns = [
  { key: 'sku', label: 'SKU' },
  { key: 'name', label: 'Product' },
  { key: 'price', label: 'Price', class: 'text-right' },
  { key: 'unit', label: 'Unit' },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Back Link -->
    <NuxtLink
      to="/purchasing/vendors"
      class="inline-flex items-center gap-1.5 text-sm text-(--color-muted-foreground) hover:text-(--color-foreground) transition-colors"
    >
      <ArrowLeft class="size-4" />
      Back to Vendors
    </NuxtLink>

    <template v-if="vendor">
      <LayoutPageHeader :title="vendor.name">
        <template #actions>
          <CommonStatusBadge :status="vendor.status" />
        </template>
      </LayoutPageHeader>

      <!-- Vendor Profile -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4 flex items-start gap-3">
          <div class="p-2 rounded-lg bg-(--color-secondary)/80 text-(--color-secondary-foreground)">
            <User class="size-4" />
          </div>
          <div class="space-y-1">
            <p class="text-xs text-(--color-muted-foreground) uppercase tracking-wide">Contact</p>
            <p class="font-medium">{{ vendor.contactName }}</p>
          </div>
        </div>
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4 flex items-start gap-3">
          <div class="p-2 rounded-lg bg-(--color-secondary)/80 text-(--color-secondary-foreground)">
            <Mail class="size-4" />
          </div>
          <div class="space-y-1">
            <p class="text-xs text-(--color-muted-foreground) uppercase tracking-wide">Email</p>
            <p class="font-medium">{{ vendor.email }}</p>
          </div>
        </div>
        <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4 flex items-start gap-3">
          <div class="p-2 rounded-lg bg-(--color-secondary)/80 text-(--color-secondary-foreground)">
            <Package class="size-4" />
          </div>
          <div class="space-y-1">
            <p class="text-xs text-(--color-muted-foreground) uppercase tracking-wide">Last Order</p>
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
        <CommonDataTable :columns="catalogColumns" :rows="vendor.products">
          <template #cell-price="{ value }">
            <span class="font-medium">{{ fmt(value) }}</span>
          </template>
        </CommonDataTable>
      </div>
    </template>

    <div v-else class="text-center py-12">
      <p class="text-(--color-muted-foreground)">Vendor not found.</p>
      <NuxtLink to="/purchasing/vendors" class="text-sm text-primary hover:underline mt-2 inline-block">
        Return to Vendors
      </NuxtLink>
    </div>
  </div>
</template>
