<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchOverview } from '@/api/publicFinance'
import { fetchRevenue } from '@/services/api'
import SourcePanel from '@/components/SourcePanel.vue'
import QualityBadge from '@/components/QualityBadge.vue'
import DistributionExplorer from '@/components/charts/DistributionExplorer.vue'
import ViewModeSelector, { type ViewMode } from '@/components/explorer/ViewModeSelector.vue'
import GlossaryInfo from '@/components/GlossaryInfo.vue'
import type { QualityStatus } from '@/types/publicFinance'
import type { RevenueResponse } from '@/types/api'

interface RevenueOverviewBlock { amount: string | null; year: number; source?: string | null; dataset?: string | null; accounting_basis: string; scope: string; stage: string; quality: { status: QualityStatus; reason?: string } }
interface OverviewResponse { revenues: { public_revenues: RevenueOverviewBlock; state_budget_revenues: RevenueOverviewBlock } }

const year = 2024
const overview = ref<OverviewResponse | null>(null)
const stateRevenue = ref<RevenueResponse | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const revenueView = ref<ViewMode>('bars')
const stateRows = computed(() => stateRevenue.value?.items ?? [])
const revenueDetails = computed(() => {
  const levelRows = stateRows.value.filter((item) => item.level === 3 && item.amount !== null)
  const candidates = levelRows.length ? levelRows : stateRows.value.filter((item) => item.amount !== null)
  const seen = new Set<string>()

  return candidates.filter((item) => {
    const key = `${item.code ?? item.slug}:${item.amount}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
})
function cleanRevenueLabel(label: string) { return label.replace(/(?:\s+\(total\))+$/iu, ' (total)') }
const stateVisualItems = computed(() => revenueDetails.value.map((item) => ({
  code: item.code ?? item.slug,
  label: cleanRevenueLabel(item.label),
  description: [item.breadcrumb?.slice(0, -1).join(' › '), item.description].filter(Boolean).join(' — '),
  amount: item.amount,
  percent: null,
  per_100: null,
  quality_status: 'validated' as const,
})))
const formatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', notation: 'compact', maximumFractionDigits: 1 })
function format(value: string | null | undefined) { return value === null || value === undefined ? 'Donnée indisponible' : formatter.format(Number(value)) }
async function load() {
  loading.value = true; error.value = null
  const results = await Promise.allSettled([fetchOverview(year), fetchRevenue('executed', year)])
  if (results[0].status === 'fulfilled') overview.value = results[0].value as unknown as OverviewResponse
  if (results[1].status === 'fulfilled') stateRevenue.value = results[1].value
  if (results.every((result) => result.status === 'rejected')) error.value = 'Aucune donnée de recettes n’est disponible.'
  loading.value = false
}
onMounted(load)
</script>

<template>
  <main id="contenu" class="page-shell">
    <section class="hero compact-hero"><p class="eyebrow">Recettes · {{ year }}</p><h1>D’où vient l’argent public&nbsp;?</h1><p class="hero-copy">Explorez les recettes publiques et les recettes exécutées du budget de l’État, dans deux périmètres comptables distincts.</p></section>
    <div v-if="loading" class="state-card" role="status">Chargement des recettes officielles…</div>
    <div v-else-if="error" class="state-card error" role="alert">{{ error }}<button type="button" @click="load">Réessayer</button></div>
    <template v-else>
      <section class="revenue-world"><div class="section-heading"><div><p class="eyebrow">INSEE · comptes nationaux <GlossaryInfo term="Comptes nationaux" /></p><h2>Recettes publiques</h2></div><QualityBadge v-if="overview" :status="overview.revenues.public_revenues.quality.status" :quality="overview.revenues.public_revenues.quality" show-reason /></div><p>Ce total concerne les administrations publiques consolidées <GlossaryInfo term="Consolidé" />, pas uniquement l’État. Les catégories détaillées disponibles dans cette page concernent le budget de l’État.</p><strong class="revenue-total">{{ format(overview?.revenues.public_revenues.amount) }}</strong><SourcePanel v-if="overview" :provenance="{ source: overview.revenues.public_revenues.source, dataset: overview.revenues.public_revenues.dataset }" /></section>
      <section class="revenue-world state-revenue-world"><div class="section-heading"><div><p class="eyebrow">PLRG <GlossaryInfo term="PLRG" /> · comptabilité budgétaire <GlossaryInfo term="Comptabilité budgétaire" /></p><h2>Recettes du budget de l’État</h2></div><QualityBadge v-if="overview" :status="overview.revenues.state_budget_revenues.quality.status" :quality="overview.revenues.state_budget_revenues.quality" show-reason /></div><p>Cette partie montre concrètement d’où viennent les recettes de l’État : impôt sur le revenu, TVA, autres impôts, taxes, prélèvements et autres recettes. Les montants sont exécutés en {{ year }}.</p><p class="context-help"><strong>À lire :</strong> les lignes affichées viennent de la hiérarchie officielle. Les sous-totaux et totaux ne sont pas additionnés aux lignes détaillées.</p><div v-if="stateVisualItems.length" class="revenue-detail-heading"><div><p class="eyebrow">Répartition détaillée</p><h3>Les recettes exécutées</h3></div><span>{{ stateVisualItems.length }} lignes</span></div><ViewModeSelector v-if="stateVisualItems.length" v-model="revenueView" /><DistributionExplorer v-if="stateVisualItems.length" :items="stateVisualItems" :view="revenueView" /><p v-else class="empty-note">Détail indisponible pour cette année.</p><SourcePanel v-if="stateRevenue" :provenance="{ source: stateRevenue.source.publisher?.name ?? stateRevenue.source.publisher?.source_name, dataset: stateRevenue.source.dataset?.name, source_url: stateRevenue.source.dataset?.source_url }" /></section>
    </template>
  </main>
</template>
