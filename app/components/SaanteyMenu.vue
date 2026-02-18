<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()

const outlets = [
  [{ label: 'Main Restaurant', icon: 'i-lucide-utensils' }],
  [{ label: 'Pool Bar', icon: 'i-lucide-glass-water' }],
  [{ label: 'Room Service', icon: 'i-lucide-concierge-bell' }],
]

const currentOutlet = ref('Main Restaurant')
</script>

<template>
  <div class="flex items-center gap-2 p-2">
    <div class="size-8 rounded bg-primary flex items-center justify-center text-white font-bold shrink-0">
      S
    </div>
    <template v-if="!collapsed">
      <UDropdownMenu :items="outlets" class="flex-1 min-w-0">
        <UButton variant="ghost" class="w-full justify-start gap-1 font-normal" trailing-icon="i-lucide-chevrons-up-down">
          <div class="flex flex-col items-start text-xs leading-tight truncate">
            <span class="font-semibold">Saantey</span>
            <span class="text-muted">{{ currentOutlet }}</span>
          </div>
        </UButton>
      </UDropdownMenu>
    </template>
  </div>
</template>
