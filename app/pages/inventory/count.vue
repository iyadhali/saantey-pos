<script setup lang="ts">
import { MOCK_INVENTORY } from '~/utils/mockData'

const countValues = ref<Record<string, number | null>>(
  Object.fromEntries(MOCK_INVENTORY.map((item) => [item.id, null])),
)

const filledCount = computed(() =>
  Object.values(countValues.value).filter((v) => v !== null && v !== undefined).length,
)

const totalCount = computed(() => MOCK_INVENTORY.length)
const saveDraft = () => { navigateTo('/inventory') }
const submitCount = () => { navigateTo('/inventory/posting') }
</script>

<template>
  <UDashboardPanel id="weekly-count">
    <template #header>
      <UDashboardNavbar title="Weekly Count">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <span class="text-sm text-(--color-muted-foreground)">{{ filledCount }}/{{ totalCount }} items counted</span>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="border border-(--color-border) rounded-lg overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-(--color-muted)/50 border-b border-(--color-border)">
              <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground)">Name</th>
              <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground)">Unit</th>
              <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground)">Count</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in MOCK_INVENTORY" :key="item.id" class="border-b border-(--color-border) last:border-0">
              <td class="px-4 py-3 font-medium">{{ item.name }}</td>
              <td class="px-4 py-3 text-(--color-muted-foreground)">{{ item.unit }}</td>
              <td class="px-4 py-3 text-right">
                <input v-model.number="countValues[item.id]" type="number" min="0" step="any" placeholder="--" class="w-24 text-right px-2 py-1 rounded border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-end gap-3">
        <UButton icon="i-lucide-save" label="Save Draft" variant="outline" @click="saveDraft" />
        <UButton icon="i-lucide-check-circle-2" label="Submit Count" :disabled="filledCount === 0" @click="submitCount" />
      </div>
    </template>
  </UDashboardPanel>
</template>
