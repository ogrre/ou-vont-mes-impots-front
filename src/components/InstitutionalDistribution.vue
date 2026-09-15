<script setup lang="ts">
import MoneyAmount from './MoneyAmount.vue'
import QualityBadge from './QualityBadge.vue'
import SourcePanel from './SourcePanel.vue'
import type { HomeBlock } from '@/types/publicFinance'
defineProps<{ block: HomeBlock }>()
</script>

<template>
  <section class="home-section" aria-labelledby="who-spends-title">
    <div class="section-heading"><div><p class="eyebrow">Les acteurs</p><h2 id="who-spends-title">{{ block.title }}</h2></div><QualityBadge :status="block.quality_status" :quality="block.quality" show-reason /></div>
    <p class="section-description">{{ block.description }}</p>
    <div class="institution-grid">
      <article v-for="item in block.items" :key="item.code ?? item.label" class="institution-card"><h3>{{ item.label }}</h3><MoneyAmount :value="item.amount" compact /><small v-if="item.percentage">{{ item.percentage.replace('.', ',') }} % du total</small></article>
    </div>
    <SourcePanel :provenance="block.provenance" :methodology="block.methodology" />
  </section>
</template>
