<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchHistory, fetchOverview } from '@/api/publicFinance'
import { fetchRevenue } from '@/services/api'
import HistoricalChart from '@/components/charts/HistoricalChart.vue'
import SourcePanel from '@/components/SourcePanel.vue'
import QualityBadge from '@/components/QualityBadge.vue'
import DistributionExplorer from '@/components/charts/DistributionExplorer.vue'
import ViewModeSelector, { type ViewMode } from '@/components/explorer/ViewModeSelector.vue'
import type { HistoryItem, QualityStatus } from '@/types/publicFinance'
import type { RevenueResponse } from '@/types/api'

interface RevenueOverviewBlock { amount: string | null; year: number; source?: string | null; dataset?: string | null; accounting_basis: string; scope: string; stage: string; quality: { status: QualityStatus; reason?: string } }
interface OverviewResponse { revenues: { public_revenues: RevenueOverviewBlock; state_budget_revenues: RevenueOverviewBlock } }
const year = 2024
const overview = ref<OverviewResponse | null>(null)
const stateRevenue = ref<RevenueResponse | null>(null)
const history = ref<HistoryItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const revenueView = ref<ViewMode>('table')
const stateRows = computed(() => stateRevenue.value?.items ?? [])
const stateVisualItems = computed(() => stateRows.value.filter((item) => item.level === 3).map((item) => ({ code: item.code ?? item.slug, label: item.label, amount: item.amount, percent: null, per_100: null, quality_status: 'validated' as const })))
const formatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', notation: 'compact', maximumFractionDigits: 1 })
function format(value: string | null | undefined) { return value === null || value === undefined ? 'Donnée indisponible' : formatter.format(Number(value)) }
async function load() {
  loading.value = true; error.value = null
  const results = await Promise.allSettled([fetchOverview(year), fetchRevenue('executed', year), fetchHistory({ metric: 'revenue', classification: 'insee_accounting', scope: 'general_government', accounting_basis: 'national_accounts', from: 1978, to: year })])
  if (results[0].status === 'fulfilled') overview.value = results[0].value as unknown as OverviewResponse
  if (results[1].status === 'fulfilled') stateRevenue.value = results[1].value
  if (results[2].status === 'fulfilled') history.value = results[2].value.items
  if (results.every((result) => result.status === 'rejected')) error.value = 'Aucune donnée de recettes n’est disponible.'
  loading.value = false
}
onMounted(load)
</script>

<template>
  <main id="contenu" class="page-shell"><section class="hero compact-hero"><p class="eyebrow">Recettes · {{ year }}</p><h1>D’où vient l’argent public&nbsp;?</h1><p class="hero-copy">Deux périmètres sont présentés séparément : les recettes de l’ensemble des administrations publiques et les recettes exécutées du budget de l’État.</p></section><div v-if="loading" class="state-card" role="status">Chargement des recettes officielles…</div><div v-else-if="error" class="state-card error" role="alert">{{ error }}<button type="button" @click="load">Réessayer</button></div><template v-else><section class="revenue-world"><div class="section-heading"><div><p class="eyebrow">INSEE · comptes nationaux</p><h2>Recettes publiques</h2></div><QualityBadge v-if="overview" :status="overview.revenues.public_revenues.quality.status" :quality="overview.revenues.public_revenues.quality" show-reason /></div><p>Ce total concerne les administrations publiques consolidées, pas uniquement l’État.</p><strong class="revenue-total">{{ format(overview?.revenues.public_revenues.amount) }}</strong><SourcePanel v-if="overview" :provenance="{ source: overview.revenues.public_revenues.source, dataset: overview.revenues.public_revenues.dataset }" /></section><HistoricalChart v-if="history.length > 1" :items="history" title="Les recettes publiques dans le temps" source="INSEE · comptes nationaux" /><section class="revenue-world state-revenue-world"><div class="section-heading"><div><p class="eyebrow">PLRG · comptabilité budgétaire</p><h2>Recettes du budget de l’État</h2></div><QualityBadge v-if="overview" :status="overview.revenues.state_budget_revenues.quality.status" :quality="overview.revenues.state_budget_revenues.quality" show-reason /></div><p>Cette partie concerne le budget de l’État. Les lignes comprennent catégories, sections, lignes et agrégats : elles ne doivent pas être additionnées entre elles.</p><ViewModeSelector v-if="stateVisualItems.length" v-model="revenueView" /><DistributionExplorer v-if="revenueView !== 'table'" :items="stateVisualItems" :view="revenueView" /><div v-if="stateRevenue" class="table-scroll"><table class="distribution-table"><caption class="visually-hidden">Recettes exécutées du budget de l’État en 2024</caption><thead><tr><th scope="col">Hiérarchie</th><th scope="col">Libellé</th><th scope="col">Montant exécuté</th></tr></thead><tbody><tr v-for="item in stateRows" :key="item.slug"><td>{{ item.breadcrumb?.slice(0, -1).join(' › ') || '—' }}</td><th scope="row">{{ item.label }}</th><td>{{ format(item.amount) }}</td></tr></tbody></table></div><p v-else class="empty-note">Détail indisponible pour cette année.</p><SourcePanel v-if="stateRevenue" :provenance="{ source: stateRevenue.source.publisher?.name ?? stateRevenue.source.publisher?.source_name, dataset: stateRevenue.source.dataset?.name, source_url: stateRevenue.source.dataset?.source_url }" /></section></template></main>
</template>
