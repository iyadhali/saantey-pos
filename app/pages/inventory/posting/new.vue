<script setup lang="ts">
import { ArrowLeft, ArrowRight, Save, CheckCircle2 } from 'lucide-vue-next'
import { MOCK_INVENTORY } from '~/utils/mockData'

const currentStep = ref(1)

const frequency = ref<'Daily' | 'Weekly' | 'Monthly'>('Weekly')
const countDate = ref(new Date().toISOString().split('T')[0])
const location = ref('Downtown Location')

const countedQuantities = ref<Record<string, number | null>>(
  Object.fromEntries(MOCK_INVENTORY.map((item) => [item.id, null])),
)

const itemsCountedCount = computed(() =>
  Object.values(countedQuantities.value).filter((v) => v !== null && v !== undefined).length,
)

const totalItemsCount = computed(() => MOCK_INVENTORY.length)

const progressPercent = computed(() =>
  totalItemsCount.value > 0
    ? Math.round((itemsCountedCount.value / totalItemsCount.value) * 100)
    : 0,
)

const canProceed = computed(() => {
  if (currentStep.value === 1) return !!countDate.value
  return itemsCountedCount.value > 0
})

const nextStep = () => {
  if (currentStep.value < 2) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const saveDraft = () => {
  navigateTo('/inventory/posting')
}

const postCount = () => {
  navigateTo('/inventory/posting')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Back Link -->
    <NuxtLink
      to="/inventory/posting"
      class="inline-flex items-center gap-1.5 text-sm text-(--color-muted-foreground) hover:text-(--color-foreground) transition-colors"
    >
      <ArrowLeft class="size-4" />
      Back to Postings
    </NuxtLink>

    <LayoutPageHeader title="New Inventory Count" subtitle="Create a new inventory count posting" />

    <!-- Progress Indicator -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <div
          class="size-8 rounded-full flex items-center justify-center text-sm font-medium"
          :class="currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-(--color-muted) text-(--color-muted-foreground)'"
        >
          1
        </div>
        <span class="text-sm font-medium" :class="currentStep >= 1 ? 'text-(--color-foreground)' : 'text-(--color-muted-foreground)'">
          Setup
        </span>
      </div>
      <div class="flex-1 h-px bg-(--color-border)" />
      <div class="flex items-center gap-2">
        <div
          class="size-8 rounded-full flex items-center justify-center text-sm font-medium"
          :class="currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-(--color-muted) text-(--color-muted-foreground)'"
        >
          2
        </div>
        <span class="text-sm font-medium" :class="currentStep >= 2 ? 'text-(--color-foreground)' : 'text-(--color-muted-foreground)'">
          Counting
        </span>
      </div>
    </div>

    <!-- Step 1: Setup -->
    <div v-if="currentStep === 1" class="space-y-6">
      <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-6 space-y-6">
        <!-- Frequency -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Count Frequency</label>
          <div class="flex gap-4">
            <label
              v-for="freq in (['Daily', 'Weekly', 'Monthly'] as const)"
              :key="freq"
              class="flex items-center gap-2 cursor-pointer"
            >
              <input
                v-model="frequency"
                type="radio"
                :value="freq"
                class="accent-primary"
              >
              <span class="text-sm">{{ freq }}</span>
            </label>
          </div>
        </div>

        <!-- Count Date -->
        <div class="space-y-2">
          <label class="text-sm font-medium" for="count-date">Count Date</label>
          <input
            id="count-date"
            v-model="countDate"
            type="date"
            class="block w-full max-w-xs px-3 py-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
        </div>

        <!-- Location -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Location</label>
          <div class="border border-(--color-border)/60 bg-(--color-muted)/30 rounded-lg px-3 py-2 text-sm">
            {{ location }}
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          :disabled="!canProceed"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="nextStep"
        >
          Next
          <ArrowRight class="size-4" />
        </button>
      </div>
    </div>

    <!-- Step 2: Counting -->
    <div v-if="currentStep === 2" class="space-y-6">
      <!-- Progress Bar -->
      <div class="border border-(--color-border)/60 bg-(--color-card)/50 rounded-lg p-4 space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-(--color-muted-foreground)">
            {{ itemsCountedCount }} of {{ totalItemsCount }} items counted
          </span>
          <span class="font-medium">{{ progressPercent }}%</span>
        </div>
        <div class="w-full bg-(--color-muted)/50 rounded-full h-2">
          <div
            class="bg-primary h-2 rounded-full transition-all"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>
      </div>

      <!-- Counting Table -->
      <div class="border border-(--color-border) rounded-lg overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-(--color-muted)/50 border-b border-(--color-border)">
              <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground)">Item</th>
              <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground)">SKU</th>
              <th class="text-left px-4 py-3 font-medium text-(--color-muted-foreground)">Unit</th>
              <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground)">Expected</th>
              <th class="text-right px-4 py-3 font-medium text-(--color-muted-foreground)">Counted</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in MOCK_INVENTORY"
              :key="item.id"
              class="border-b border-(--color-border) last:border-0"
            >
              <td class="px-4 py-3 font-medium">{{ item.name }}</td>
              <td class="px-4 py-3 text-(--color-muted-foreground)">{{ item.sku }}</td>
              <td class="px-4 py-3">{{ item.unit }}</td>
              <td class="px-4 py-3 text-right text-(--color-muted-foreground)">{{ item.onHand }}</td>
              <td class="px-4 py-3 text-right">
                <input
                  v-model.number="countedQuantities[item.id]"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="--"
                  class="w-20 text-right px-2 py-1 rounded border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between">
        <button
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-(--color-border) text-sm font-medium hover:bg-(--color-accent) transition-colors"
          @click="prevStep"
        >
          <ArrowLeft class="size-4" />
          Back
        </button>
        <div class="flex items-center gap-3">
          <button
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-(--color-border) text-sm font-medium hover:bg-(--color-accent) transition-colors"
            @click="saveDraft"
          >
            <Save class="size-4" />
            Save Draft
          </button>
          <button
            :disabled="!canProceed"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            @click="postCount"
          >
            <CheckCircle2 class="size-4" />
            Post Count
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
