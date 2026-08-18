<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import InfoBubble from '@/components/InfoBubble.vue'
import DonutChart, { type DonutSegment } from '@/components/DonutChart.vue'
import SourceCard from '@/components/SourceCard.vue'
import { fetchRevenue } from '@/services/api'
import type { RevenueResponse, RevenueStatus } from '@/types/api'

const status = ref<RevenueStatus>('revised_estimate')
const data = ref<RevenueResponse | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const statuses: Array<{ value: RevenueStatus; label: string }> = [
  { value: 'initial_estimate', label: 'Prévision initiale 2025' },
  { value: 'revised_estimate', label: 'Prévision révisée 2025' },
  { value: 'budget_bill', label: 'Projet de loi 2026' },
]

const formatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const chartColors = [
  '#286b58',
  '#e7b93f',
  '#d76d4b',
  '#6e86a6',
  '#8e6d9e',
  '#82a65f',
  '#d695a7',
  '#799b93',
]
const grossTaxTotal = computed(() =>
  Number(data.value?.items.find((item) => item.slug === 'recettes-fiscales-brutes')?.amount ?? 0),
)
const donutSegments = computed<DonutSegment[]>(() =>
  (data.value?.items ?? [])
    .filter((item) => !item.is_aggregate && !item.is_deduction && Number(item.amount) > 0)
    .map((item, index) => ({
      label: item.label,
      value: Number(item.amount),
      color: chartColors[index % chartColors.length]!,
    })),
)

async function load() {
  loading.value = true
  error.value = null
  try {
    data.value = await fetchRevenue(status.value)
  } catch (reason) {
    data.value = null
    error.value = reason instanceof Error ? reason.message : 'Impossible de charger les données.'
  } finally {
    loading.value = false
  }
}

watch(status, load)
onMounted(load)
</script>

<template>
  <main id="contenu" class="page-shell">
    <section class="hero revenue-hero">
      <p class="eyebrow">Budget de l’État</p>
      <h1>D’où vient l’argent&nbsp;?</h1>
      <p class="hero-copy">
        Consultez les recettes de l’État tout en distinguant clairement prévisions et exécution.
      </p>
    </section>

    <section class="controls" aria-label="Filtres des recettes">
      <label>
        <span class="label-with-help">
          Version budgétaire
          <InfoBubble term="version budgétaire" title="Pourquoi plusieurs versions ?">
            Le budget évolue : une prévision initiale peut être révisée avec les nouvelles
            informations. Le projet de loi présente, lui, les montants proposés pour l’année
            suivante. Ce ne sont pas des recettes exécutées.
          </InfoBubble>
        </span>
        <select v-model="status">
          <option v-for="option in statuses" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
    </section>

    <div v-if="loading" class="state-card" role="status">Chargement des données officielles…</div>
    <div v-else-if="error" class="state-card error" role="alert">
      <strong>Les données ne sont pas disponibles.</strong><span>{{ error }}</span>
      <button type="button" @click="load">Réessayer</button>
    </div>

    <template v-else-if="data">
      <div class="notice">
        <strong>À lire avant de comparer.</strong> {{ data.aggregation_warning }}
      </div>
      <section class="ranking revenue-list" aria-labelledby="revenue-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">{{ data.period }}</p>
            <h2 id="revenue-title">Recettes du budget général</h2>
          </div>
          <span>{{ data.items.length }} lignes</span>
        </div>
        <div class="chart-introduction">
          <h3>Composition des recettes fiscales brutes</h3>
          <p>
            Le camembert exclut les remboursements, dégrèvements, prélèvements et sous-totaux afin
            d’éviter le double comptage.
          </p>
        </div>
        <DonutChart
          v-if="grossTaxTotal > 0"
          class="chart-block"
          :segments="donutSegments"
          center-label="recettes fiscales brutes"
          :center-value="formatter.format(grossTaxTotal)"
        />
        <ul>
          <li v-for="item in data.items" :key="item.slug" :class="{ aggregate: item.is_aggregate }">
            <span>{{ item.label }}</span>
            <strong>{{ formatter.format(Number(item.amount)) }}</strong>
            <small v-if="item.is_deduction">Déduction</small>
          </li>
        </ul>
      </section>
      <SourceCard :source="data.source" />
    </template>
  </main>
</template>
