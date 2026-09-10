<script setup lang="ts">
import MoneyAmount from './MoneyAmount.vue'
import QualityBadge from './QualityBadge.vue'
import SourcePanel from './SourcePanel.vue'
import type { RevenueHomeBlock } from '@/types/publicFinance'
defineProps<{ block: RevenueHomeBlock }>()
</script>

<template>
  <section class="home-section" aria-labelledby="revenues-title">
    <div class="section-heading"><div><p class="eyebrow">Les recettes</p><h2 id="revenues-title">{{ block.title }}</h2></div><QualityBadge :status="block.quality_status" :quality="block.quality" /></div>
    <p class="section-description">{{ block.description }}</p>
    <div class="revenue-sources">
      <article v-for="item in block.items" :key="item.code ?? item.label" class="revenue-source"><div><h3>{{ item.label }}</h3><QualityBadge :status="item.quality_status ?? 'not_importable'" /><p>{{ item.accounting_basis === 'national_accounts' ? 'Ensemble des administrations publiques, comptes nationaux INSEE.' : 'Budget de l’État uniquement, comptabilité budgétaire PLRG.' }}</p></div><MoneyAmount :value="item.amount" compact /></article>
    </div>
    <SourcePanel :provenance="block.provenance" :methodology="block.methodology" />
  </section>
</template>
