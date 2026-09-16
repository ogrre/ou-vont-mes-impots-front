<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchCofogDetail, fetchPublicFinanceHome, type CofogDetailResponse } from '@/api/publicFinance'
import MoneyAmount from '@/components/MoneyAmount.vue'
import QualityBadge from '@/components/QualityBadge.vue'
import SourcePanel from '@/components/SourcePanel.vue'
import InfoBubble from '@/components/InfoBubble.vue'
import DistributionExplorer from '@/components/charts/DistributionExplorer.vue'
import ViewModeSelector, { type ViewMode } from '@/components/explorer/ViewModeSelector.vue'
import type { HomeItem, PublicFinanceHome } from '@/types/publicFinance'

const route = useRoute()
const year = Number(route.params.year)
const code = String(route.params.code)
const data = ref<PublicFinanceHome | null>(null)
const detail = ref<CofogDetailResponse | null>(null)
const detailView = ref<ViewMode>('bars')
const loading = ref(true)
const error = ref<string | null>(null)

const item = computed<HomeItem | null>(() => data.value?.what_for.items.find((candidate) => candidate.code === code) ?? null)
const subcategoryExplanations = computed(() => Object.fromEntries((detail.value?.items ?? []).filter((child) => child.code && child.description).map((child) => [child.code, child.description])))

onMounted(async () => {
  try {
    const [home, categoryDetail] = await Promise.all([
      fetchPublicFinanceHome(year),
      fetchCofogDetail(year, code),
    ])
    data.value = home
    detail.value = categoryDetail
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
    <template v-else-if="item && data">
      <nav class="breadcrumbs" aria-label="Fil d’Ariane"><RouterLink :to="`/?year=${year}#cofog`">Accueil</RouterLink><span aria-hidden="true">›</span><span>Destination des dépenses</span><span aria-hidden="true">›</span><strong>{{ item.label }}</strong></nav>
      <section class="hero compact-hero cofog-detail-hero"><p class="eyebrow">COFOG · {{ year }}</p><h1>{{ item.label }}</h1><p class="hero-copy">{{ detail?.description ?? 'Cette fonction regroupe les dépenses publiques classées dans ce domaine par la nomenclature COFOG.' }}</p><div class="detail-actions"><RouterLink class="secondary-cta" :to="`/?year=${year}#cofog`">← Retour à la destination des dépenses</RouterLink><InfoBubble term="COFOG" title="Une classification fonctionnelle"><span>La COFOG décrit la fonction poursuivie par la dépense. Elle ne désigne pas un ministère et ne permet pas d’attribuer une recette précise à cette fonction.</span></InfoBubble></div></section>
      <section class="detail-summary cofog-summary" aria-labelledby="cofog-summary-title"><div><span>Montant en {{ year }}</span><strong id="cofog-summary-title"><MoneyAmount :value="item.amount" compact /></strong></div><div><span>Part des dépenses COFOG</span><strong>{{ item.percentage ?? item.percent ? `${(item.percentage ?? item.percent)?.replace('.', ',')} %` : 'Donnée indisponible' }}</strong></div><QualityBadge :status="item.quality_status ?? data.what_for.quality_status" :quality="item.quality" show-reason /></section>
      <section class="cofog-detail-card" aria-labelledby="what-means-title"><div class="section-heading"><div><p class="eyebrow">Ce que cela recouvre</p><h2 id="what-means-title">Que représente cette fonction&nbsp;?</h2></div></div><p>{{ detail?.description ?? 'La fonction regroupe les dépenses publiques qui poursuivent cet objectif, quel que soit le niveau d’administration qui les porte.' }}</p><p class="detail-note">Le montant présenté est celui fourni par l’API pour les dépenses des administrations publiques, dans le périmètre COFOG consolidé. Il ne s’agit pas uniquement du budget de l’État.</p></section>
      <section class="cofog-detail-card" aria-labelledby="subcategories-title"><div class="section-heading"><div><p class="eyebrow">Répartition interne</p><h2 id="subcategories-title">Dans le détail</h2></div><span v-if="detail">{{ detail.items.length }} sous-fonction{{ detail.items.length > 1 ? 's' : '' }}</span></div><p>Ces montants détaillent la fonction « {{ item.label }} ». Ils ne s’ajoutent pas au total général une seconde fois. Cliquez sur une ligne pour comprendre ce qu’elle recouvre.</p><ViewModeSelector v-if="detail?.items.length" v-model="detailView" /><DistributionExplorer v-if="detail?.items.length" :items="detail.items" :view="detailView" :explanations="subcategoryExplanations" /><p v-else class="empty-note">Aucun niveau inférieur chiffré n’est disponible pour cette fonction dans cette année.</p></section>
      <SourcePanel :provenance="{ source: detail?.source, dataset: detail?.dataset }" :methodology="data.what_for.methodology" />
    </template>
    <div v-else class="state-card" role="status">Cette fonction COFOG n’est pas disponible pour {{ year }}.</div>
  </main>
</template>
