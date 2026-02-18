<script setup lang="ts">
import { MOCK_TABLES } from '~/utils/mockData'

definePageMeta({ layout: 'pos' })

const statusColors: Record<string, string> = {
  Available: 'border-emerald-300 bg-emerald-50',
  Occupied: 'border-blue-300 bg-blue-50',
  Dirty: 'border-amber-300 bg-amber-50',
  Reserved: 'border-purple-300 bg-purple-50',
}

const statusDotColors: Record<string, string> = {
  Available: 'bg-emerald-500',
  Occupied: 'bg-blue-500',
  Dirty: 'bg-amber-500',
  Reserved: 'bg-purple-500',
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- POS Header -->
    <header class="h-14 border-b border-(--color-border) bg-(--color-background) px-6 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-3">
        <NuxtLink to="/" class="flex items-center gap-2 text-sm text-(--color-muted-foreground) hover:text-(--color-foreground)">
          <UIcon name="i-lucide-monitor" class="size-4" />
          Exit POS
        </NuxtLink>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium">Floor Plan</span>
      </div>
      <div class="flex items-center gap-3">
        <button class="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90">
          <UIcon name="i-lucide-plus" class="size-4" />
          New Tab
        </button>
      </div>
    </header>

    <!-- Legend -->
    <div class="px-6 py-3 flex items-center gap-6 border-b border-(--color-border) bg-(--color-muted)/30">
      <div v-for="(color, status) in statusDotColors" :key="status" class="flex items-center gap-2 text-xs text-(--color-muted-foreground)">
        <span class="size-2.5 rounded-full" :class="color" />
        {{ status }}
      </div>
    </div>

    <!-- Table Grid -->
    <div class="flex-1 p-6 overflow-auto">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <NuxtLink
          v-for="table in MOCK_TABLES"
          :key="table.id"
          :to="`/pos/table/${table.id}`"
          class="block"
        >
          <div
            class="border-2 rounded-lg p-4 transition-all hover:shadow-md cursor-pointer"
            :class="statusColors[table.status]"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-lg font-bold">{{ table.name }}</span>
              <span class="size-2.5 rounded-full" :class="statusDotColors[table.status]" />
            </div>

            <div class="text-xs text-(--color-muted-foreground) space-y-1">
              <div class="flex items-center gap-1">
                <UIcon name="i-lucide-users" class="size-3" />
                {{ table.guests || 0 }}/{{ table.capacity }}
              </div>
              <div class="font-medium capitalize">{{ table.status }}</div>

              <template v-if="table.status === 'Occupied'">
                <div class="flex items-center gap-1">
                  <UIcon name="i-lucide-clock" class="size-3" />
                  {{ table.timeSeated }}
                </div>
                <div class="flex items-center gap-1 font-medium text-(--color-foreground)">
                  <UIcon name="i-lucide-dollar-sign" class="size-3" />
                  {{ table.checkTotal?.toFixed(2) }}
                </div>
                <div class="text-xs">{{ table.server }}</div>
              </template>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
