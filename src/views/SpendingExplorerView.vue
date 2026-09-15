<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchAvailableYears, fetchBudgetDistribution, MIN_AVAILABLE_YEAR } from '@/api/publicFinance'
import DistributionExplorer from '@/components/charts/DistributionExplorer.vue'
import ExplorerToolbar from '@/components/explorer/ExplorerToolbar.vue'
import type { ViewMode } from '@/components/explorer/ViewModeSelector.vue'
import type { AvailableYear, DistributionResponse } from '@/types/publicFinance'

const route = useRoute()
const router = useRouter()
const years = ref<AvailableYear[]>([])
const year = ref(Math.max(Number(route.params.year ?? route.query.year ?? 2024), MIN_AVAILABLE_YEAR))
const classification = ref(String(route.query.classification ?? 'mission'))
const measurement = ref<'payment_credit' | 'commitment_authorization'>(route.query.measurement === 'commitment_authorization' ? 'commitment_authorization' : 'payment_credit')
const stage = ref<'executed' | 'initial_budget'>(route.query.stage === 'initial_budget' ? 'initial_budget' : 'executed')
const view = ref<ViewMode>((['bars', 'treemap', 'donut', 'table'] as ViewMode[]).includes(route.query.view as ViewMode) ? route.query.view as ViewMode : 'bars')
const search = ref(String(route.query.search ?? ''))
const data = ref<DistributionResponse | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const title = computed(() => classification.value === 'mission' ? 'Où va l’argent de l’État ?' : 'Les programmes de l’État')

function syncUrl() {
  void router.replace({ path: `/explorer/${year.value}`, query: { year: String(year.value), classification: classification.value, measurement: measurement.value, stage: stage.value, view: view.value, ...(search.value ? { search: search.value } : {}) } })
}

async function load() {
  loading.value = true
  error.value = null
  data.value = null
  try {
    data.value = await fetchBudgetDistribution(year.value, { measurement: measurement.value, stage: stage.value })
  } catch (reason) {
    error.value = reason instanceof Error ? reason.message : 'Impossible de charger la distribution.'
  } finally { loading.value = false }
}

watch([year, classification, measurement, stage], () => { syncUrl(); if (year.value && (classification.value === 'mission' || classification.value === 'programme')) void load() })
watch([view, search], syncUrl)
onMounted(async () => {
  try {
    const response = await fetchAvailableYears()
    years.value = response.years.map((item) => typeof item === 'number' ? { year: item } : { year: item.year, status: item.status ?? item.label ?? item.coverage })
  } catch { years.value = [{ year: year.value }] }
  await load()
})
</script>

<template>
  <main id="contenu" class="page-shell">
    <section class="hero compact-hero"><p class="eyebrow">Explorateur · budget de l’État</p><h1>{{ title }}</h1><p class="hero-copy">Explorez les crédits de paiement et les autorisations d’engagement, en distinguant budget initial et exécution.</p></section>
    <ExplorerToolbar v-if="years.length" :years="years" :year="year" :classification="classification" :measurement="measurement" :stage="stage" :view="view" :search="search" @update:year="year = $event" @update:classification="classification = $event" @update:measurement="measurement = $event" @update:stage="stage = $event" @update:view="view = $event" @update:search="search = $event" />
    <p class="context-help"><strong>Budget de l’État uniquement.</strong> Cette vue ne représente pas l’ensemble des dépenses publiques françaises. Les CP correspondent aux paiements ; les AE aux engagements.</p>
    <div v-if="loading" class="state-card" role="status">Chargement de la distribution {{ year }}…</div>
    <div v-else-if="error" class="state-card error" role="alert"><strong>Les données ne sont pas disponibles.</strong><span>{{ error }}</span><button type="button" @click="load">Réessayer</button></div>
    <section v-else-if="data" class="explorer-section" aria-labelledby="distribution-title"><div class="section-heading"><div><p class="eyebrow">{{ data.stage === 'executed' ? 'Exécution' : 'Budget initial' }} · {{ data.measurement === 'payment_credit' ? 'CP' : 'AE' }}</p><h2 id="distribution-title">Répartition par {{ classification === 'mission' ? 'mission' : 'programme' }}</h2></div><span>{{ data.items.length }} postes</span></div><DistributionExplorer :items="data.items" :view="view" :search="search" /></section>
  </main>
</template>
