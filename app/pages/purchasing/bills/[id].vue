<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const route = useRoute()
const billId = computed(() => route.params.id as string)

const fmt = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

interface BillItem {
  name: string
  quantity: number
  unit: string
  cost: number
}

interface Bill {
  id: string
  vendorName: string
  invoiceId: string
  billDate: string
  dueDate: string
  status: string
  subtotal: number
  gst: number
  total: number
  items: BillItem[]
}

const bills: Record<string, Bill> = {
  'BILL-2024-001': {
    id: 'BILL-2024-001',
    vendorName: 'Sysco Foods',
    invoiceId: 'INV-2024-001',
    billDate: '2024-05-22',
    dueDate: '2024-06-22',
    status: 'Open',
    subtotal: 1175.00,
    gst: 70.50,
    total: 1245.50,
    items: [
      { name: 'Whole Milk', quantity: 10, unit: 'GAL', cost: 4.50 },
      { name: 'Eggs, Large', quantity: 5, unit: 'CS', cost: 45.00 },
      { name: 'Cheddar Cheese', quantity: 20, unit: 'LB', cost: 18.50 },
    ],
  },
  'BILL-2024-002': {
    id: 'BILL-2024-002',
    vendorName: 'Baldor Specialty',
    invoiceId: 'INV-2024-002',
    billDate: '2024-05-23',
    dueDate: '2024-06-23',
    status: 'Paid',
    subtotal: 424.53,
    gst: 25.47,
    total: 450.00,
    items: [
      { name: 'Organic Arugula', quantity: 5, unit: 'CS', cost: 12.50 },
      { name: 'Heirloom Tomatoes', quantity: 10, unit: 'CS', cost: 24.00 },
    ],
  },
  'BILL-2024-003': {
    id: 'BILL-2024-003',
    vendorName: 'Meat Packers Inc',
    invoiceId: 'INV-2024-003',
    billDate: '2024-05-24',
    dueDate: '2024-06-24',
    status: 'Overdue',
    subtotal: 2170.52,
    gst: 130.23,
    total: 2300.75,
    items: [
      { name: 'Ground Beef 80/20', quantity: 100, unit: 'LB', cost: 4.25 },
      { name: 'Ribeye Steaks', quantity: 50, unit: 'LB', cost: 16.50 },
    ],
  },
}

const bill = computed(() => bills[billId.value])

const itemColumns: TableColumn<BillItem & { lineTotal: number }>[] = [
  { accessorKey: 'name', header: 'Item' },
  { accessorKey: 'quantity', header: 'Qty', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'unit', header: 'Unit' },
  { accessorKey: 'cost', header: 'Unit Cost', meta: { class: { th: 'text-right', td: 'text-right' } } },
  { accessorKey: 'lineTotal', header: 'Total', meta: { class: { th: 'text-right', td: 'text-right' } } },
]

const itemRows = computed(() => {
  if (!bill.value) return []
  return bill.value.items.map((item: BillItem) => ({
    ...item,
    lineTotal: item.quantity * item.cost,
  }))
})
</script>

<template>
  <UDashboardPanel id="bill-detail">
    <template #header>
      <UDashboardNavbar :title="bill?.id ?? 'Bill'">
        <template #leading>
          <UButton icon="i-lucide-arrow-left" variant="ghost" to="/purchasing/bills" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <template v-if="bill">
        <p class="text-sm text-muted">Bill from {{ bill.vendorName }}</p>

        <!-- Bill Info -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-1">
            <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Vendor</p>
            <p class="font-medium">{{ bill.vendorName }}</p>
          </div>
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-1">
            <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Invoice</p>
            <NuxtLink
              :to="`/purchasing/invoices/${bill.invoiceId}`"
              class="font-medium text-primary hover:underline"
            >
              {{ bill.invoiceId }}
            </NuxtLink>
          </div>
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-1">
            <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Bill Date</p>
            <p class="font-medium">{{ bill.billDate }}</p>
          </div>
          <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-1">
            <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Status</p>
            <CommonStatusBadge :status="bill.status" />
          </div>
        </div>

        <div class="border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-1">
          <p class="text-sm text-(--color-muted-foreground) uppercase tracking-wide">Due Date</p>
          <p class="font-medium">{{ bill.dueDate }}</p>
        </div>

        <!-- Items Table -->
        <div class="space-y-3">
          <h2 class="text-lg font-semibold">Items</h2>
          <UTable :data="itemRows" :columns="itemColumns" caption="Bill items" empty="No items.">
            <template #cost-cell="{ row }">
              {{ fmt(row.original.cost) }}
            </template>
            <template #lineTotal-cell="{ row }">
              <span class="font-medium">{{ fmt(row.original.lineTotal) }}</span>
            </template>
          </UTable>
        </div>

        <!-- Totals -->
        <div class="flex justify-end">
          <div class="w-full max-w-xs border border-(--color-border) bg-(--color-card) rounded-lg p-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-(--color-muted-foreground)">Subtotal</span>
              <span>{{ fmt(bill.subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-(--color-muted-foreground)">GST</span>
              <span>{{ fmt(bill.gst) }}</span>
            </div>
            <div class="flex justify-between font-semibold border-t border-(--color-border) pt-2">
              <span>Total</span>
              <span>{{ fmt(bill.total) }}</span>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="text-center py-12">
        <p class="text-(--color-muted-foreground)">Bill not found.</p>
        <NuxtLink to="/purchasing/bills" class="text-sm text-primary hover:underline mt-2 inline-block">
          Return to Bills
        </NuxtLink>
      </div>
    </template>
  </UDashboardPanel>
</template>
