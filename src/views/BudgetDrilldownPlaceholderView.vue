<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchBudgetDistribution, fetchBudgetMission, fetchBudgetProgramme, fetchBudgetProgrammeActions } from '@/api/publicFinance'
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

function routeValue(code: string | null | undefined, label: string) { return encodeURIComponent(code ?? label) }
function levelLabel(level: string) { return ({ mission: 'mission', programme: 'programme', action: 'action', sub_action: 'sous-action' }[level] ?? 'poste budgétaire') }
function distribution(nodes: BudgetNode[]): DistributionItem[] { return nodes.map((node) => ({ code: node.code, label: node.label, description: node.description, amount: node.cp.execution, percent: null, per_100: null, quality_status: node.quality.status, quality: node.quality, provenance: node.provenance })) }
async function load() {
  try {
    if (kind.value === 'budget') {
      distributionItems.value = (await fetchBudgetDistribution(year, { measurement: 'payment_credit', stage: 'executed' })).items
    } else if (kind.value === 'mission') {
      const [mission, distribution] = await Promise.all([
        fetchBudgetMission(year, code),
        fetchBudgetDistribution(year, { mission: code, measurement: 'payment_credit', stage: 'executed' }),
      ])
      item.value = mission.item
      children.value = mission.item.children ?? []
      distributionItems.value = distribution.items
    } else if (kind.value === 'programme') {
      const [programme, actions, distribution] = await Promise.all([
        fetchBudgetProgramme(year, code),
        fetchBudgetProgrammeActions(year, code),
        fetchBudgetDistribution(year, { programme: code, measurement: 'payment_credit', stage: 'executed' }),
      ])
      item.value = programme.item
      children.value = actions.items
      distributionItems.value = distribution.items
    }
    else { const response = await fetchBudgetProgrammeActions(year, String(route.params.programme)); item.value = response.items.find((candidate) => candidate.code === code || candidate.label === code) ?? null; children.value = item.value?.children ?? [] }
  } catch (reason) { error.value = reason instanceof Error ? reason.message : 'Impossible de charger cette page.' }
  finally { loading.value = false }
}
function openChild(selected: DistributionItem) {
  if (!selected.code) return
  if (kind.value === 'budget') void router.push(`/budget-etat/${year}/missions/${routeValue(selected.code, selected.label)}`)
  else if (kind.value === 'mission') void router.push(`/budget-etat/${year}/programmes/${routeValue(selected.code, selected.label)}`)
  else if (kind.value === 'programme') void router.push(`/budget-etat/${year}/programmes/${encodeURIComponent(code)}/actions/${routeValue(selected.code, selected.label)}`)
}
onMounted(load)
</script>

<template>
  <main id="contenu" class="page-shell"><div v-if="loading" class="state-card" role="status">Chargement du budget {{ year }}…</div><div v-else-if="error" class="state-card error" role="alert">{{ error }}</div><template v-else><section class="hero compact-hero"><p class="eyebrow">Budget de l’État · {{ year }}</p><p class="breadcrumbs"><RouterLink to="/">Accueil</RouterLink> <span aria-hidden="true">›</span> <RouterLink :to="`/budget-etat/${year}`">Missions</RouterLink><template v-if="item"><span aria-hidden="true">›</span><span>{{ item.label }}</span></template></p><h1>{{ item?.label ?? 'Missions du budget de l’État' }}</h1><p v-if="item" class="hero-copy">{{ item.code ?? item.label }} · {{ levelLabel(item.hierarchy_level) }}</p><RouterLink v-if="item?.hierarchy_level === 'action' && route.params.programme" class="back-link" :to="`/budget-etat/${year}/programmes/${encodeURIComponent(String(route.params.programme))}`">← Retour au programme</RouterLink></section><section v-if="item" class="budget-detail-intro"><p>{{ item.description ?? `Cette page présente le détail du budget de l’État consacré à « ${item.label} ». Les montants sont séparés entre budget initial et exécution, et entre AE et CP.` }}</p><p class="detail-note">Les sous-niveaux détaillent ce poste : ils ne doivent pas être additionnés une seconde fois au montant du parent.</p></section><section v-if="item" class="detail-summary budget-amounts"><div><span>CP · budget initial</span><strong><MoneyAmount :value="item.cp.lfi" compact /></strong></div><div><span>CP · exécutés</span><strong><MoneyAmount :value="item.cp.execution" compact /></strong></div><div><span>AE · budget initial</span><strong><MoneyAmount :value="item.ae.lfi" compact /></strong></div><div><span>AE · exécutées</span><strong><MoneyAmount :value="item.ae.execution" compact /></strong></div><QualityBadge :status="item.quality.status" :quality="item.quality" show-reason /></section><section class="explorer-section"><div class="section-heading"><div><p class="eyebrow">{{ kind === 'budget' ? 'Répartition' : 'Niveau inférieur' }}</p><h2>{{ kind === 'budget' ? 'Missions' : kind === 'mission' ? 'Programmes' : kind === 'programme' ? 'Actions' : 'Sous-actions' }}</h2></div><span>{{ (distributionItems.length || children.length) }} postes</span></div><DistributionExplorer :items="distributionItems.length ? distributionItems : distribution(children)" view="bars" @select="openChild" /></section><SourcePanel v-if="item" :provenance="item.provenance" methodology="Les montants sont fournis par l’API du budget de l’État. Les CP correspondent aux paiements ; les AE correspondent aux engagements." /></template></main>
</template>
