<script setup lang="ts">
export type ViewMode = 'bars' | 'treemap' | 'donut' | 'table'
defineProps<{ modelValue: ViewMode }>()
const emit = defineEmits<{ 'update:modelValue': [value: ViewMode] }>()
const modes: Array<[ViewMode, string]> = [['bars', 'Barres'], ['treemap', 'Treemap'], ['donut', 'Donut'], ['table', 'Tableau']]
</script>

<template>
  <div class="view-mode" aria-label="Mode d’affichage">
    <span>Affichage</span>
    <div class="segmented">
      <button v-for="[value, label] in modes" :key="value" type="button" :class="{ active: modelValue === value }" :aria-pressed="modelValue === value" @click="emit('update:modelValue', value)">{{ label }}</button>
    </div>
  </div>
</template>
