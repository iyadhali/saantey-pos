<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()

const items = [
  [{ label: 'Profile', icon: 'i-lucide-user' }],
  [{ label: 'Settings', icon: 'i-lucide-settings', to: '/settings' }],
  [{ label: 'Log out', icon: 'i-lucide-log-out' }],
]
</script>

<template>
  <div class="p-2">
    <UDropdownMenu :items="items">
      <UButton variant="ghost" class="w-full justify-start gap-2">
        <UAvatar text="JD" size="sm" />
        <template v-if="!collapsed">
          <div class="flex flex-col items-start text-sm leading-tight truncate">
            <span class="font-medium">John Doe</span>
            <span class="text-xs text-muted">Manager</span>
          </div>
        </template>
      </UButton>
    </UDropdownMenu>
  </div>
</template>
