<script setup lang="ts">
import type { Component } from 'vue'
import { CheckCircle2, Clock, XCircle, Package, FileText } from 'lucide-vue-next'

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

const VARIANT_STYLES: Record<StatusType, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-slate-50 text-slate-700 border-slate-200',
  draft: 'bg-slate-100 text-slate-600 border-slate-200 border-dashed',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
}

const ICONS: Record<StatusType, Component> = {
  success: CheckCircle2,
  warning: Clock,
  error: XCircle,
  info: Package,
  neutral: FileText,
  draft: FileText,
  pending: Clock,
}

const resolvedType = computed<StatusType>(() => {
  return props.type || TYPE_MAP[props.status.toLowerCase()] || 'neutral'
})

const iconComponent = computed(() => ICONS[resolvedType.value])
const variantClass = computed(() => VARIANT_STYLES[resolvedType.value])
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 py-0.5 px-2.5 font-medium capitalize text-xs rounded-full border"
    :class="variantClass"
  >
    <component :is="iconComponent" v-if="showIcon" class="size-3.5" />
    {{ status }}
  </span>
</template>
