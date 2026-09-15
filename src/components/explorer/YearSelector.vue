<script setup lang="ts">
import type { AvailableYear } from '@/types/publicFinance'

defineProps<{ years: AvailableYear[]; modelValue: number; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
</script>

<template>
  <label class="control-field">
    <span>Année</span>
    <select :value="modelValue" :disabled="disabled" @change="emit('update:modelValue', Number(($event.target as HTMLSelectElement).value))">
      <option v-for="item in years" :key="item.year" :value="item.year">
        {{ item.year }}{{ item.status ? ` — ${item.status}` : '' }}
      </option>
    </select>
  </label>
</template>
