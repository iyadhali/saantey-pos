<script setup lang="ts">
import { Save, CheckCircle2 } from 'lucide-vue-next'
import { MOCK_INVENTORY } from '~/utils/mockData'

const countValues = ref<Record<string, number | null>>(
  Object.fromEntries(MOCK_INVENTORY.map((item) => [item.id, null])),
)

const filledCount = computed(() =>
  Object.values(countValues.value).filter((v) => v !== null && v !== undefined).length,
)

const totalCount = computed(() => MOCK_INVENTORY.length)

const saveDraft = () => {
  navigateTo('/inventory')
}

const submitCount = () => {
  navigateTo('/inventory/posting')
}
</script>

<template>
  <div class="space-y-6">
    <LayoutPageHeader title="Weekly Count" subtitle="Enter counted quantities for all inventory items">
      <template #actions>
        <span class="text-sm text-(--color-muted-foreground)">
          {{ filledCount }}/{{ totalCount }} items counted
        </span>
      </template>
    </LayoutPageHeader>

    <!-- Count Table -->
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
          <tr
            v-for="item in MOCK_INVENTORY"
            :key="item.id"
            class="border-b border-(--color-border) last:border-0"
          >
            <td class="px-4 py-3 font-medium">{{ item.name }}</td>
            <td class="px-4 py-3 text-(--color-muted-foreground)">{{ item.unit }}</td>
            <td class="px-4 py-3 text-right">
              <input
                v-model.number="countValues[item.id]"
                type="number"
                min="0"
                step="any"
                placeholder="--"
                class="w-24 text-right px-2 py-1 rounded border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-3">
      <button
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-(--color-border) text-sm font-medium hover:bg-(--color-accent) transition-colors"
        @click="saveDraft"
      >
        <Save class="size-4" />
        Save Draft
      </button>
      <button
        :disabled="filledCount === 0"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="submitCount"
      >
        <CheckCircle2 class="size-4" />
        Submit Count
      </button>
    </div>
  </div>
</template>
