<script setup lang="ts">
import { computed } from 'vue'

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
const props = withDefaults(defineProps<{ value: string | null; compact?: boolean }>(), { compact: false })
const formattedParts = computed(() => (props.compact ? compactFormatter : fullFormatter).formatToParts(Number(props.value)))

function unitHelp(value: string) {
  return {
    k: 'k signifie mille euros.',
    M: 'M signifie million d’euros.',
    Md: 'Md signifie milliard d’euros : 1 Md € = 1 000 millions d’euros.',
    Bn: 'Bn signifie billion d’euros en français : 1 Bn € = 1 000 milliards d’euros. Cette unité est rarement nécessaire pour les finances publiques françaises.',
  }[value] ?? `${value} est une unité monétaire abrégée.`
}
</script>

<template>
  <span v-if="value === null" class="money-amount">Donnée indisponible</span>
  <span v-else class="money-amount">
    <template v-for="(part, index) in formattedParts" :key="`${part.type}-${index}`">
      <abbr v-if="part.type === 'compact'" class="money-unit" :title="unitHelp(part.value)">{{ part.value }}</abbr>
      <abbr v-else-if="part.type === 'currency'" class="money-currency" title="€ signifie euro.">{{ part.value }}</abbr>
      <span v-else>{{ part.value }}</span>
    </template>
  </span>
</template>
