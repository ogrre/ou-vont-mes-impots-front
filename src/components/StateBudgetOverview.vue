<script setup lang="ts">
import MoneyAmount from './MoneyAmount.vue'
import QualityBadge from './QualityBadge.vue'
import type { HomeBlock } from '@/types/publicFinance'
defineProps<{ block: HomeBlock; year?: number }>()
</script>

<template>
  <section class="home-section state-budget-section" aria-labelledby="state-budget-title">
    <div class="section-heading"><div><p class="eyebrow">Zoom</p><h2 id="state-budget-title">{{ block.title }}</h2></div><QualityBadge :status="block.quality_status" :quality="block.quality" show-reason /></div>
    <p class="section-description">{{ block.description }}</p>
    <ol class="mission-list">
      <li v-for="item in block.items.slice(0, 12)" :key="item.code ?? item.label"><RouterLink :to="`/budget-etat/${year ?? 2024}/missions/${item.code}`"><span><strong>{{ item.label }}</strong><small><MoneyAmount :value="item.amount" compact /></small></span><span aria-hidden="true">→</span></RouterLink></li>
    </ol>
  </section>
</template>
