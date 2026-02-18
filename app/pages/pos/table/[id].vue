<script setup lang="ts">
import { MOCK_TABLES } from '~/utils/mockData'

definePageMeta({ layout: 'pos' })

const route = useRoute()
const tableId = computed(() => route.params.id as string)
const table = computed(() => MOCK_TABLES.find(t => t.id === tableId.value))
</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- Header -->
    <header class="h-14 border-b border-(--color-border) bg-(--color-background) px-6 flex items-center gap-4 shrink-0">
      <NuxtLink to="/pos" class="flex items-center gap-2 text-sm text-(--color-muted-foreground) hover:text-(--color-foreground)">
        <UIcon name="i-lucide-arrow-left" class="size-4" />
        Back to Floor
      </NuxtLink>
      <span class="text-sm font-medium">
        Table {{ table?.name || tableId }}
      </span>
    </header>

    <!-- Content -->
    <div class="flex-1 p-6">
      <div v-if="table" class="max-w-4xl mx-auto">
        <div class="border border-(--color-border) rounded-lg p-8 text-center">
          <h2 class="text-xl font-semibold mb-2">Table {{ table.name }}</h2>
          <p class="text-(--color-muted-foreground) mb-4">
            Capacity: {{ table.capacity }} | Status: {{ table.status }}
          </p>
          <p class="text-sm text-(--color-muted-foreground)">
            Order entry interface coming soon. This is a placeholder for the full POS order entry screen.
          </p>
        </div>
      </div>
      <div v-else class="text-center py-12">
        <p class="text-(--color-muted-foreground)">Table not found</p>
        <NuxtLink to="/pos" class="text-primary text-sm mt-2 inline-block">Back to Floor Plan</NuxtLink>
      </div>
    </div>
  </div>
</template>
