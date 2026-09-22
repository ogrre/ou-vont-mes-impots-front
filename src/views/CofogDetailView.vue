<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchCofogDetail, type CofogDetailResponse } from '@/api/publicFinance'
import MoneyAmount from '@/components/MoneyAmount.vue'
import QualityBadge from '@/components/QualityBadge.vue'
import SourcePanel from '@/components/SourcePanel.vue'
import InfoBubble from '@/components/InfoBubble.vue'
import DistributionExplorer from '@/components/charts/DistributionExplorer.vue'
import ViewModeSelector, { type ViewMode } from '@/components/explorer/ViewModeSelector.vue'

const route = useRoute()
const year = Number(route.params.year)
const code = String(route.params.code)
const detail = ref<CofogDetailResponse | null>(null)
const detailView = ref<ViewMode>('bars')
const loading = ref(true)
const error = ref<string | null>(null)

const item = computed(() => detail.value ? {
  code: detail.value.code,
  label: detail.value.label,
  amount: detail.value.amount,
  quality_status: detail.value.quality.status,
} : null)

onMounted(async () => {
  try {
    detail.value = await fetchCofogDetail(year, code)
  } catch (reason) {
    error.value = reason instanceof Error ? reason.message : 'Le détail de cette fonction est indisponible.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main id="contenu" class="page-shell cofog-detail-page">
    <div v-if="loading" class="state-card" role="status">Chargement du détail COFOG…</div>
    <div v-else-if="error" class="state-card error" role="alert"><strong>Le détail ne peut pas être chargé.</strong><span>{{ error }}</span></div>
    <template v-else-if="item && detail">
      <nav class="breadcrumbs" aria-label="Fil d’Ariane"><RouterLink :to="`/?year=${year}#cofog`">Accueil</RouterLink><span aria-hidden="true">›</span><span>Destination des dépenses</span><span aria-hidden="true">›</span><strong>{{ item.label }}</strong></nav>
      <section class="hero compact-hero cofog-detail-hero"><p class="eyebrow">COFOG · {{ year }}</p><h1>{{ item.label }}</h1><p class="hero-copy">{{ detail.description ?? 'Cette fonction regroupe les dépenses publiques classées dans ce domaine par la nomenclature COFOG.' }}</p><div class="detail-actions"><RouterLink class="secondary-cta" :to="`/?year=${year}#cofog`">← Retour à la destination des dépenses</RouterLink><InfoBubble term="COFOG" title="Une classification fonctionnelle"><span>La COFOG décrit la fonction poursuivie par la dépense. Elle ne désigne pas un ministère et ne permet pas d’attribuer une recette précise à cette fonction.</span></InfoBubble></div></section>
      <section class="detail-summary cofog-summary" aria-labelledby="cofog-summary-title"><div><span>Dépenses publiques en {{ year }}</span><strong id="cofog-summary-title"><MoneyAmount :value="item.amount" compact /></strong></div><div><span>Répartition interne</span><strong>{{ detail.items.length }} sous-fonction{{ detail.items.length > 1 ? 's' : '' }}</strong></div><QualityBadge :status="item.quality_status" :quality="detail.quality" show-reason /></section>
      <section class="cofog-detail-card" aria-labelledby="what-means-title"><div class="section-heading"><div><p class="eyebrow">Ce que cela recouvre</p><h2 id="what-means-title">Que représente cette fonction&nbsp;?</h2></div></div><p>{{ detail.description ?? 'La fonction regroupe les dépenses publiques qui poursuivent cet objectif, quel que soit le niveau d’administration qui les porte.' }}</p><p class="detail-note">Le montant est fourni par l’API pour les administrations publiques, selon la COFOG, en comptabilité nationale et sur un périmètre consolidé. Il ne s’agit pas uniquement du budget de l’État.</p></section>
      <section class="cofog-detail-card" aria-labelledby="subcategories-title"><div class="section-heading"><div><p class="eyebrow">Répartition interne</p><h2 id="subcategories-title">Dans le détail</h2></div><span>{{ detail.items.length }} sous-fonction{{ detail.items.length > 1 ? 's' : '' }}</span></div><p>Ces montants détaillent la fonction « {{ item.label }} ». Ils ne s’ajoutent pas au total général une seconde fois. Cliquez sur une ligne pour afficher son explication.</p><ViewModeSelector v-if="detail.items.length" v-model="detailView" /><DistributionExplorer v-if="detail.items.length" :items="detail.items" :view="detailView" /><p v-else class="empty-note">Aucun niveau inférieur chiffré n’est disponible pour cette fonction dans cette année.</p></section>
      <SourcePanel :provenance="{ source: detail.source, dataset: detail.dataset }" methodology="COFOG · comptes nationaux INSEE · dépenses consolidées des administrations publiques." />
    </template>
    <div v-else class="state-card" role="status">Cette fonction COFOG n’est pas disponible pour {{ year }}.</div>
  </main>
</template>
