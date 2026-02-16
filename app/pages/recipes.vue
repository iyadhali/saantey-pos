<script setup lang="ts">
const tabs = [
  { label: 'Overview', to: '/recipes/overview' },
  { label: 'Menu Items', to: '/recipes/menu' },
  { label: 'Prep Items', to: '/recipes/prep' },
]
</script>

<template>
  <div class="space-y-6">
    <LayoutPageHeader title="Recipes" subtitle="Recipe costing and menu management" />

    <div class="flex gap-2 border-b border-(--color-border)">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
        :class="$route.path === tab.to || $route.path.startsWith(tab.to + '/') ? 'border-primary text-primary' : 'border-transparent text-(--color-muted-foreground) hover:text-(--color-foreground)'"
      >
        {{ tab.label }}
      </NuxtLink>
    </div>

    <NuxtPage />
  </div>
</template>
