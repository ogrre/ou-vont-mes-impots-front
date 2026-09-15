<script setup lang="ts">
withDefaults(defineProps<{ value: string | null; compact?: boolean }>(), { compact: false })

const compactFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  notation: 'compact',
  maximumFractionDigits: 1,
})
const fullFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})
</script>

<template>
  <span class="money-amount">{{ value === null ? 'Donnée indisponible' : (compact ? compactFormatter : fullFormatter).format(Number(value)) }}</span>
</template>
