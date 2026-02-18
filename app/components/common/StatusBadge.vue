<script setup lang="ts">
type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'draft' | 'pending'

const props = withDefaults(
  defineProps<{
    status: string
    type?: StatusType
    showIcon?: boolean
  }>(),
  {
    type: undefined,
    showIcon: true,
  },
)

const TYPE_MAP: Record<string, StatusType> = {
  finalized: 'success',
  approved: 'success',
  active: 'success',
  sent: 'success',
  delivered: 'success',
  closed: 'success',
  posted: 'success',
  pending: 'warning',
  'needs receiving': 'warning',
  'partially received': 'warning',
  rejected: 'error',
  deleted: 'error',
  overdue: 'error',
  draft: 'draft',
  open: 'info',
}

type BadgeColor = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary' | 'secondary'

const COLOR_MAP: Record<StatusType, BadgeColor> = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  neutral: 'neutral',
  draft: 'neutral',
  pending: 'warning',
}

const ICON_MAP: Record<StatusType, string> = {
  success: 'i-lucide-check-circle-2',
  warning: 'i-lucide-clock',
  error: 'i-lucide-x-circle',
  info: 'i-lucide-package',
  neutral: 'i-lucide-file-text',
  draft: 'i-lucide-file-text',
  pending: 'i-lucide-clock',
}

const resolvedType = computed<StatusType>(() => {
  return props.type || TYPE_MAP[props.status.toLowerCase()] || 'neutral'
})

const badgeColor = computed(() => COLOR_MAP[resolvedType.value])
const badgeIcon = computed(() => props.showIcon ? ICON_MAP[resolvedType.value] : undefined)
const badgeVariant = computed(() => resolvedType.value === 'draft' ? 'outline' : 'subtle')
</script>

<template>
  <UBadge
    :label="status"
    :color="badgeColor"
    :variant="badgeVariant"
    :icon="badgeIcon"
    size="sm"
    class="capitalize"
  />
</template>
