<script setup lang="ts">
import MoneyAmount from '@/components/MoneyAmount.vue'
import QualityBadge from '@/components/QualityBadge.vue'
import type { DistributionItem } from '@/types/publicFinance'
defineProps<{ items: DistributionItem[] }>()
</script>

<template>
  <div class="table-scroll"><table class="distribution-table"><caption class="visually-hidden">Détail de la distribution</caption><thead><tr><th scope="col">Nom</th><th scope="col">Montant</th><th scope="col">Part du total</th><th scope="col">Qualité</th></tr></thead><tbody><tr v-for="item in items" :key="item.code ?? item.label"><th scope="row">{{ item.label }}</th><td><MoneyAmount :value="item.amount" compact /></td><td>{{ item.percent ? `${item.percent.replace('.', ',')} %` : '—' }}</td><td><QualityBadge :status="item.quality_status" /></td></tr></tbody></table></div>
</template>
