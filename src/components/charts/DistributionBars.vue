<script setup lang="ts">
import MoneyAmount from '@/components/MoneyAmount.vue'
import QualityBadge from '@/components/QualityBadge.vue'
import type { DistributionItem } from '@/types/publicFinance'

const props = defineProps<{ items: DistributionItem[]; maxAmount: number; selectedCode?: string | null; explanations?: Record<string, string> }>()
const emit = defineEmits<{ select: [item: DistributionItem] }>()
</script>

<template>
  <ol class="distribution-bars">
    <li v-for="item in items" :key="item.code ?? item.label">
      <button type="button" class="distribution-row" @click="emit('select', item)">
        <span class="distribution-name"><strong>{{ item.label }}</strong><small><MoneyAmount :value="item.amount" compact /></small></span>
        <span class="distribution-track" aria-hidden="true"><span :style="{ width: item.amount === null ? '0%' : `${(Number(item.amount) / maxAmount) * 100}%` }"></span></span>
        <span class="distribution-values"><strong>{{ item.percent ? `${item.percent.replace('.', ',')} %` : '—' }}</strong><small>part du total</small></span>
        <QualityBadge :status="item.quality_status" />
      </button>
      <div v-if="props.selectedCode === item.code" class="distribution-inline-detail" role="status" aria-live="polite">
        <strong>À quoi correspond cette ligne&nbsp;?</strong>
        <p>{{ item.description ?? props.explanations?.[item.code ?? ''] ?? 'Cette ligne détaille la catégorie sélectionnée. Son montant est déjà compris dans le total affiché.' }}</p>
        <small>{{ item.amount === null ? 'Montant indisponible pour cette année.' : 'Montant et part fournis par l’API.' }}</small>
      </div>
    </li>
  </ol>
</template>
