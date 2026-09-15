<script setup lang="ts">
import MoneyAmount from './MoneyAmount.vue'
import type { HomeBlock } from '@/types/publicFinance'

defineProps<{ block: HomeBlock }>()
</script>

<template>
  <section class="home-section spending-overview" aria-labelledby="public-spending-title">
    <div class="section-heading"><div><p class="eyebrow">Le total</p><h2 id="public-spending-title">{{ block.title }}</h2></div><MoneyAmount :value="block.amount" compact /></div>
    <p class="section-description">{{ block.description }}</p>
  </section>
</template>
