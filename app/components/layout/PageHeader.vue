<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-(--color-border)/40">
    <div class="space-y-1">
      <h1 class="text-2xl font-bold tracking-tight text-(--color-foreground)">{{ title }}</h1>
      <div v-if="subtitle" data-testid="page-header-subtitle" class="text-sm text-(--color-muted-foreground)">
        {{ subtitle }}
      </div>
    </div>

    <div v-if="$slots.actions" class="flex items-center gap-3 self-start sm:self-center">
      <slot name="actions" />
    </div>
  </div>
</template>
