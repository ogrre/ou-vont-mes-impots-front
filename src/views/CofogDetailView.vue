<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchCategoryChildren, fetchPublicFinanceHome, type FinanceCategory } from '@/api/publicFinance'
import MoneyAmount from '@/components/MoneyAmount.vue'
import QualityBadge from '@/components/QualityBadge.vue'
import SourcePanel from '@/components/SourcePanel.vue'
import InfoBubble from '@/components/InfoBubble.vue'
import type { HomeItem, PublicFinanceHome } from '@/types/publicFinance'

const route = useRoute()
const year = Number(route.params.year)
const code = String(route.params.code)
const data = ref<PublicFinanceHome | null>(null)
const children = ref<FinanceCategory[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const item = computed<HomeItem | null>(() => data.value?.what_for.items.find((candidate) => candidate.code === code) ?? null)
const explanations: Record<string, string> = {
  GF01: 'Les services généraux couvrent le fonctionnement des institutions publiques, les services financiers et fiscaux, les affaires étrangères ainsi que les opérations liées à la dette publique.',
  GF02: 'La défense regroupe les dépenses consacrées à la défense militaire, à la protection du territoire et aux infrastructures et équipements militaires.',
  GF03: 'L’ordre et la sécurité publics comprennent notamment la police, la justice, les établissements pénitentiaires, les tribunaux et les services de secours.',
  GF04: 'Les affaires économiques rassemblent les politiques qui soutiennent l’activité économique : transports, agriculture, énergie, recherche, emploi et développement des entreprises.',
  GF05: 'La protection de l’environnement couvre la gestion des déchets, la lutte contre les pollutions, la protection de la biodiversité et la gestion des ressources naturelles.',
  GF06: 'Les logements et équipements collectifs comprennent le logement, l’aménagement urbain, l’eau, l’éclairage public et les infrastructures collectives.',
  GF07: 'La santé regroupe les services hospitaliers, les soins ambulatoires, les médicaments et les politiques de prévention et de santé publique.',
  GF08: 'Les loisirs, la culture et le culte comprennent les activités sportives, culturelles, les médias, les bibliothèques, les musées et la protection du patrimoine.',
  GF09: 'L’enseignement couvre les différents niveaux d’éducation, de la maternelle à l’enseignement supérieur, ainsi que les services qui les accompagnent.',
  GF10: 'La protection sociale regroupe notamment les retraites, les prestations liées à la maladie, au handicap, à la famille, au chômage, au logement et à l’exclusion sociale.',
}

onMounted(async () => {
  try {
    const [home, categoryChildren] = await Promise.all([
      fetchPublicFinanceHome(year),
      fetchCategoryChildren('cofog', code),
    ])
    data.value = home
    children.value = categoryChildren.categories
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
      <section class="hero compact-hero cofog-detail-hero"><p class="eyebrow">COFOG · {{ year }}</p><h1>{{ item.label }}</h1><p class="hero-copy">{{ explanations[code] ?? 'Cette fonction regroupe les dépenses publiques classées dans ce domaine par la nomenclature COFOG.' }}</p><div class="detail-actions"><RouterLink class="secondary-cta" :to="`/?year=${year}#cofog`">← Retour à la destination des dépenses</RouterLink><InfoBubble term="COFOG" title="Une classification fonctionnelle"><span>La COFOG décrit la fonction poursuivie par la dépense. Elle ne désigne pas un ministère et ne permet pas d’attribuer une recette précise à cette fonction.</span></InfoBubble></div></section>
      <section class="detail-summary cofog-summary" aria-labelledby="cofog-summary-title"><div><span>Montant en {{ year }}</span><strong id="cofog-summary-title"><MoneyAmount :value="item.amount" compact /></strong></div><div><span>Part des dépenses COFOG</span><strong>{{ item.percentage ?? item.percent ? `${(item.percentage ?? item.percent)?.replace('.', ',')} %` : 'Donnée indisponible' }}</strong></div><QualityBadge :status="item.quality_status ?? data.what_for.quality_status" :quality="item.quality" show-reason /></section>
      <section class="cofog-detail-card" aria-labelledby="what-means-title"><div class="section-heading"><div><p class="eyebrow">Ce que cela recouvre</p><h2 id="what-means-title">Que représente cette fonction&nbsp;?</h2></div></div><p>{{ explanations[code] ?? 'La fonction regroupe les dépenses publiques qui poursuivent cet objectif, quel que soit le niveau d’administration qui les porte.' }}</p><p class="detail-note">Le montant présenté est celui fourni par l’API pour les dépenses des administrations publiques, dans le périmètre COFOG consolidé. Il ne s’agit pas uniquement du budget de l’État.</p></section>
      <section class="cofog-detail-card" aria-labelledby="subcategories-title"><div class="section-heading"><div><p class="eyebrow">Nomenclature</p><h2 id="subcategories-title">Catégories détaillées</h2></div><span>{{ children.length }} catégorie{{ children.length > 1 ? 's' : '' }}</span></div><ul v-if="children.length" class="cofog-children"><li v-for="child in children" :key="child.code"><strong>{{ child.code }} · {{ child.name }}</strong><p v-if="child.description">{{ child.description }}</p></li></ul><p v-else class="empty-note">L’API ne fournit pas de niveau inférieur pour cette fonction dans cette année.</p></section>
      <SourcePanel :provenance="data.what_for.provenance" :methodology="data.what_for.methodology" />
    </template>
    <div v-else class="state-card" role="status">Cette fonction COFOG n’est pas disponible pour {{ year }}.</div>
  </main>
</template>
