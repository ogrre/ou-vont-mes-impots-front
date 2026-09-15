<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchBudgetDistribution, fetchBudgetMission, fetchBudgetMissions, fetchBudgetProgramme, fetchBudgetProgrammeActions } from '@/api/publicFinance'
import DistributionExplorer from '@/components/charts/DistributionExplorer.vue'
import QualityBadge from '@/components/QualityBadge.vue'
import SourcePanel from '@/components/SourcePanel.vue'
import type { BudgetNode, DistributionItem } from '@/types/publicFinance'

const route = useRoute()
const router = useRouter()
const year = Number(route.params.year)
const code = String(route.params.code ?? '')
const kind = computed(() => route.name === 'state-budget-mission' ? 'mission' : route.name === 'state-budget-programme' ? 'programme' : route.name === 'state-budget-action' ? 'action' : 'budget')
const item = ref<BudgetNode | null>(null)
const children = ref<BudgetNode[]>([])
const distributionItems = ref<DistributionItem[]>([])
const error = ref<string | null>(null)
const loading = ref(true)

function distribution(nodes: BudgetNode[]): DistributionItem[] { return nodes.map((node) => ({ code: node.code, label: node.label, amount: node.cp.execution, percent: null, per_100: null, quality_status: node.quality.status, quality: node.quality, provenance: node.provenance })) }
function amount(node: BudgetNode | null) { return node?.cp.execution }
async function load() {
  try {
    if (kind.value === 'budget') { const response = await fetchBudgetMissions(year); children.value = response.items; distributionItems.value = (await fetchBudgetDistribution(year, { measurement: 'payment_credit', stage: 'executed' })).items }
    else if (kind.value === 'mission') { const response = await fetchBudgetMission(year, code); item.value = response.item; children.value = response.item.children ?? []; distributionItems.value = (await fetchBudgetDistribution(year, { mission: code, measurement: 'payment_credit', stage: 'executed' })).items }
    else if (kind.value === 'programme') { const response = await fetchBudgetProgramme(year, code); item.value = response.item; const actions = await fetchBudgetProgrammeActions(year, code); children.value = actions.items; distributionItems.value = (await fetchBudgetDistribution(year, { programme: code, measurement: 'payment_credit', stage: 'executed' })).items }
    else { const response = await fetchBudgetProgrammeActions(year, String(route.params.programme)); item.value = response.items.find((candidate) => candidate.code === code || candidate.label === code) ?? null; children.value = item.value?.children ?? [] }
  } catch (reason) { error.value = reason instanceof Error ? reason.message : 'Impossible de charger cette page.' }
  finally { loading.value = false }
}
function openChild(selected: DistributionItem) {
  if (!selected.code) return
  if (kind.value === 'budget') void router.push(`/budget-etat/${year}/missions/${selected.code}`)
  else if (kind.value === 'mission') void router.push(`/budget-etat/${year}/programmes/${selected.code}`)
  else if (kind.value === 'programme') void router.push(`/budget-etat/${year}/programmes/${code}/actions/${selected.code}`)
}
onMounted(load)
</script>

<template>
  <main id="contenu" class="page-shell"><div v-if="loading" class="state-card" role="status">Chargement du budget {{ year }}…</div><div v-else-if="error" class="state-card error" role="alert">{{ error }}</div><template v-else><section class="hero compact-hero"><p class="eyebrow">Budget de l’État · {{ year }}</p><p class="breadcrumbs"><RouterLink to="/">Accueil</RouterLink> <span aria-hidden="true">›</span> <RouterLink :to="`/budget-etat/${year}`">Missions</RouterLink><template v-if="item"><span aria-hidden="true">›</span><span>{{ item.label }}</span></template></p><h1>{{ item?.label ?? 'Missions du budget de l’État' }}</h1><p v-if="item" class="hero-copy">{{ item.code }} · {{ item.hierarchy_level }}</p><RouterLink v-if="item?.hierarchy_level === 'action' && route.params.programme" class="back-link" :to="`/budget-etat/${year}/programmes/${route.params.programme}`">← Retour au programme</RouterLink></section><section v-if="item" class="detail-summary"><div><span>CP exécutés</span><strong>{{ amount(item) === null ? 'Donnée indisponible' : amount(item) }}</strong></div><div><span>AE exécutées</span><strong>{{ item.ae.execution === null ? 'Donnée indisponible' : item.ae.execution }}</strong></div><QualityBadge :status="item.quality.status" :quality="item.quality" show-reason /></section><section class="explorer-section"><div class="section-heading"><div><p class="eyebrow">{{ kind === 'budget' ? 'Répartition' : 'Niveau inférieur' }}</p><h2>{{ kind === 'budget' ? 'Missions' : kind === 'mission' ? 'Programmes' : kind === 'programme' ? 'Actions' : 'Sous-actions' }}</h2></div><span>{{ (distributionItems.length || children.length) }} postes</span></div><DistributionExplorer :items="distributionItems.length ? distributionItems : distribution(children)" view="bars" @select="openChild" /></section><SourcePanel v-if="item" :provenance="item.provenance" /></template></main>
</template>
