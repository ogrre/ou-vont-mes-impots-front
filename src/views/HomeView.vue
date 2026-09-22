<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchAvailableYears, fetchPublicFinanceHome, MIN_AVAILABLE_YEAR } from '@/api/publicFinance'
import CofogDistribution from '@/components/CofogDistribution.vue'
import HomeHero from '@/components/HomeHero.vue'
import InstitutionalDistribution from '@/components/InstitutionalDistribution.vue'
import RevenuesOverview from '@/components/RevenuesOverview.vue'
import SourcePanel from '@/components/SourcePanel.vue'
import StateBudgetOverview from '@/components/StateBudgetOverview.vue'
import type { PublicFinanceHome } from '@/types/publicFinance'
import YearSelector from '@/components/explorer/YearSelector.vue'
import type { AvailableYear } from '@/types/publicFinance'

const data = ref<PublicFinanceHome | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedYear = ref(2024)
const years = ref<AvailableYear[]>([])
const route = useRoute()
const router = useRouter()

async function load() {
  loading.value = true
  error.value = null
  try {
    data.value = await fetchPublicFinanceHome(selectedYear.value)
  } catch (reason) {
    data.value = null
    error.value = reason instanceof Error ? reason.message : 'Impossible de charger les données.'
  } finally {
    loading.value = false
  }
}

async function loadSecondary(year: number) {
  try {
    const availableYears = await fetchAvailableYears()
    years.value = availableYears.years.map((item) => typeof item === 'number' ? { year: item } : { year: item.year, status: item.status ?? item.label ?? item.coverage })
  } catch {
    years.value = [{ year }]
  }
}

async function selectYear() { await router.replace({ query: { year: String(selectedYear.value) } }); await load(); if (data.value) void loadSecondary(selectedYear.value) }

watch(() => route?.query.year, (value) => { const next = Math.max(Number(value), MIN_AVAILABLE_YEAR); if (next && next !== selectedYear.value) { selectedYear.value = next; void load().then(() => { if (data.value) void loadSecondary(next) }) } })
onMounted(async () => { selectedYear.value = Math.max(Number(route?.query.year ?? 2024), MIN_AVAILABLE_YEAR); await load(); if (data.value && route) void loadSecondary(selectedYear.value) })
</script>

<template>
  <main id="contenu" class="home-page page-shell">
    <div v-if="loading" class="state-card" role="status" aria-live="polite">Chargement des finances publiques {{ selectedYear }}…</div>
    <div v-else-if="error" class="state-card error" role="alert">
      <strong>La page d’accueil ne peut pas être chargée.</strong>
      <span>{{ error }}</span>
      <button type="button" @click="load">Réessayer</button>
    </div>
    <template v-else-if="data">
      <HomeHero :year="data.data_year" :amount="data.headline.amount" :description="data.headline.description" />
      <div class="home-year-control"><YearSelector v-if="years.length" v-model="selectedYear" :years="years" @update:model-value="selectYear" /></div>
      <RevenuesOverview :block="data.revenues" />
      <CofogDistribution :block="data.what_for" :year="data.data_year" />
      <InstitutionalDistribution :block="data.who_spends" />
      <StateBudgetOverview :block="data.state_budget" :year="data.data_year" />
      <section class="home-section methodology-section" aria-labelledby="methodology-title">
        <div class="section-heading"><div><p class="eyebrow">Transparence</p><h2 id="methodology-title">Sources et méthodologie</h2></div></div>
        <div class="methodology-grid">
          <div><strong>Année des données</strong><span>{{ data.data_year }}</span></div>
          <div><strong>Année de référence</strong><span>{{ data.reference_year }}</span></div>
          <div><strong>Générée le</strong><span>{{ new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(data.generated_at)) }}</span></div>
          <div><strong>Version méthodologique</strong><span>{{ data.methodology_version }}</span></div>
        </div>
        <p class="methodology-note">Les montants sont calculés par l’API à partir de sources officielles. Les statuts indiquent si une donnée est validée, à consolider ou indisponible.</p>
        <SourcePanel :provenance="{ sources: ['INSEE', 'PLRG/RAP 2024'] }" methodology="Les comptes nationaux des administrations publiques et la comptabilité budgétaire de l’État sont présentés dans des blocs séparés. Ils ne sont jamais additionnés entre eux." />
      </section>
    </template>
    <div v-else class="state-card" role="status">Aucune donnée disponible pour cette année.</div>
  </main>
</template>
