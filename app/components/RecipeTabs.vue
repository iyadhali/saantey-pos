<script setup lang="ts">
const route = useRoute()
const items = [
  { label: 'Overview', value: '/recipes/overview' },
  { label: 'Menu Items', value: '/recipes/menu' },
  { label: 'Prep Items', value: '/recipes/prep' },
]
const active = computed(() =>
  items.find(i => route.path === i.value || route.path.startsWith(i.value + '/'))?.value ?? items[0]!.value,
)
</script>

<template>
  <UTabs
    :items="items"
    :model-value="active"
    variant="link"
    :content="false"
    @update:model-value="navigateTo($event as string)"
  />
</template>
