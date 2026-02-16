<script setup lang="ts">
interface Column {
  key: string
  label: string
  class?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>

defineProps<{
  columns: Column[]
  rows: Row[]
}>()

const emit = defineEmits<{
  'row-click': [row: Row]
}>()
</script>

<template>
  <div class="border border-(--color-border) rounded-lg overflow-hidden">
    <table class="w-full text-sm">
      <thead>
        <tr class="bg-(--color-muted)/50 border-b border-(--color-border)">
          <th
            v-for="col in columns"
            :key="col.key"
            class="text-left px-4 py-3 font-medium text-(--color-muted-foreground)"
            :class="col.class"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, idx) in rows"
          :key="idx"
          class="border-b border-(--color-border) last:border-0 hover:bg-(--color-accent)/50 cursor-pointer transition-colors"
          @click="emit('row-click', row)"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3"
            :class="col.class"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
