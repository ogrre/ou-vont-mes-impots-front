<script setup lang="ts">
import MoneyAmount from './MoneyAmount.vue'
import QualityBadge from './QualityBadge.vue'
import type { HomeBlock } from '@/types/publicFinance'
import GlossaryInfo from './GlossaryInfo.vue'
const props = defineProps<{ block: HomeBlock; year?: number }>()

function routeValue(item: HomeBlock['items'][number]) {
  return encodeURIComponent(item.code ?? item.label)
}
</script>

<template>
  <section class="home-section state-budget-section" aria-labelledby="state-budget-title">
    <div class="section-heading"><div><p class="eyebrow">Zoom <GlossaryInfo term="Périmètre" /></p><h2 id="state-budget-title">{{ block.title }}</h2></div><QualityBadge :status="block.quality_status" :quality="block.quality" show-reason /></div>
    <p class="section-description">{{ block.description }}</p>
    <ol class="mission-list">
      <li v-for="item in props.block.items.slice(0, 12)" :key="item.code ?? item.label"><RouterLink :to="`/budget-etat/${props.year ?? 2024}/missions/${routeValue(item)}`"><span><strong>{{ item.label }}</strong><small><MoneyAmount :value="item.amount" compact /></small></span><span aria-hidden="true">→</span></RouterLink></li>
    </ol>
  </section>
</template>
