<script setup lang="ts">
import MoneyAmount from '@/components/MoneyAmount.vue'
import QualityBadge from '@/components/QualityBadge.vue'
import type { DistributionItem } from '@/types/publicFinance'

defineProps<{ items: DistributionItem[]; maxAmount: number }>()
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
    </li>
  </ol>
</template>
