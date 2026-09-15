<script setup lang="ts">
import { computed } from 'vue'
import MoneyAmount from '@/components/MoneyAmount.vue'
import type { HistoryItem } from '@/types/publicFinance'

const props = defineProps<{ items: HistoryItem[]; title: string; source?: string }>()
const values = computed(() => props.items.map((item) => Number(item.amount ?? item.value ?? 0)))
const maximum = computed(() => Math.max(...values.value, 0))
const points = computed(() => props.items.map((item, index) => `${(index / Math.max(props.items.length - 1, 1)) * 100},${maximum.value ? 100 - (Number(item.amount ?? item.value ?? 0) / maximum.value) * 90 : 100}`).join(' '))
</script>

<template>
  <section class="historical-chart" :aria-labelledby="`history-${title.replace(/ /g, '-')}`"><div class="section-heading"><div><p class="eyebrow">Évolution</p><h2 :id="`history-${title.replace(/ /g, '-')}`">{{ title }}</h2></div><span v-if="source">{{ source }}</span></div><div class="history-visual" role="img" :aria-label="`Évolution de ${title} de ${items[0]?.year ?? ''} à ${items[items.length - 1]?.year ?? ''}`"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline :points="points" fill="none" stroke="#286b58" stroke-width="2" vector-effect="non-scaling-stroke" /></svg></div><div class="table-scroll"><table class="history-table"><caption class="visually-hidden">Valeurs historiques de {{ title }}</caption><thead><tr><th scope="col">Année</th><th scope="col">Montant</th></tr></thead><tbody><tr v-for="item in items" :key="item.year"><th scope="row">{{ item.year }}</th><td><MoneyAmount :value="item.amount ?? item.value ?? null" compact /></td></tr></tbody></table></div></section>
</template>
