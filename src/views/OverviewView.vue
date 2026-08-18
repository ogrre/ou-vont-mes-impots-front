<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import InfoBubble from '@/components/InfoBubble.vue'
import { fetchExpenditure, fetchRevenue } from '@/services/api'
import type { ExpenditureResponse, RevenueResponse } from '@/types/api'

const expenditure = ref<ExpenditureResponse | null>(null)
const initialRevenue = ref<RevenueResponse | null>(null)
const revisedRevenue = ref<RevenueResponse | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const formatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const generalBudgetExpenditure = computed(
  () =>
    expenditure.value?.items.reduce(
      (total, item) =>
        total +
        Number(
          item.components.find((component) => component.code === 'general_budget')?.amount ?? 0,
        ),
      0,
    ) ?? null,
)

function netRevenue(response: RevenueResponse | null) {
  return (
    Number(
      response?.items.find(
        (item) => item.slug === 'recettes-nettes-totales-du-budget-general-ab-cd',
      )?.amount ?? 0,
    ) || null
  )
}

const initialTotal = computed(() => netRevenue(initialRevenue.value))
const revisedTotal = computed(() => netRevenue(revisedRevenue.value))
const revenueRevision = computed(() =>
  initialTotal.value && revisedTotal.value
    ? ((revisedTotal.value - initialTotal.value) / initialTotal.value) * 100
    : null,
)

function format(value: number | null) {
  return value === null ? 'Donnée indisponible' : formatter.format(value)
}

async function load() {
  loading.value = true
  error.value = null
  const results = await Promise.allSettled([
    fetchExpenditure('mission', 'cp'),
    fetchRevenue('initial_estimate'),
    fetchRevenue('revised_estimate'),
  ])
  if (results[0].status === 'fulfilled') expenditure.value = results[0].value
  if (results[1].status === 'fulfilled') initialRevenue.value = results[1].value
  if (results[2].status === 'fulfilled') revisedRevenue.value = results[2].value
  if (results.every((result) => result.status === 'rejected')) {
    error.value = 'Aucune donnée de synthèse n’est disponible pour le moment.'
  }
  loading.value = false
}

onMounted(load)
</script>

<template>
  <main id="contenu" class="page-shell">
    <section class="hero overview-hero">
      <p class="eyebrow">Vue d’ensemble · budget général 2025</p>
      <h1>Les grands équilibres, en un regard.</h1>
      <p class="hero-copy">
        Ce tableau distingue systématiquement les prévisions des montants exécutés et signale ce qui
        manque encore.
      </p>
    </section>

    <div v-if="loading" class="state-card" role="status">Préparation de la vue d’ensemble…</div>
    <div v-else-if="error" class="state-card error" role="alert">{{ error }}</div>

    <template v-else>
      <section class="comparison-section" aria-labelledby="flow-comparison-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Recettes et dépenses</p>
            <h2 id="flow-comparison-title">Deux côtés du budget</h2>
          </div>
          <InfoBubble
            term="comparaison recettes dépenses"
            title="Une comparaison à interpréter avec prudence"
          >
            Les dépenses affichées sont exécutées, tandis que les recettes sont encore une prévision
            révisée. Elles partagent le périmètre du budget général, mais pas le même statut
            comptable.
          </InfoBubble>
        </div>
        <div class="flow-cards">
          <article class="flow-card revenue-flow">
            <span>Recettes nettes</span><strong>{{ format(revisedTotal) }}</strong>
            <small>Prévision révisée 2025</small>
          </article>
          <div class="versus" aria-hidden="true">↔</div>
          <article class="flow-card expenditure-flow">
            <span>Dépenses</span><strong>{{ format(generalBudgetExpenditure) }}</strong>
            <small>CP exécutés 2025</small>
          </article>
        </div>
        <p class="comparison-warning">
          Ces deux montants ne constituent pas à eux seuls le calcul du solde budgétaire : des
          opérations et conventions comptables supplémentaires peuvent intervenir.
        </p>
      </section>

      <section class="matrix-section" aria-labelledby="matrix-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Prévu ou réalisé ?</p>
            <h2 id="matrix-title">Ce que les sources permettent de comparer</h2>
          </div>
        </div>
        <div
          class="matrix-scroll"
          tabindex="0"
          role="region"
          aria-label="Tableau comparatif prévu et réalisé"
        >
          <table class="comparison-matrix">
            <caption class="visually-hidden">
              Disponibilité des recettes et dépenses prévues et réalisées en 2025
            </caption>
            <thead>
              <tr>
                <td></td>
                <th scope="col">Prévision</th>
                <th scope="col">Réalisé</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Recettes</th>
                <td class="matrix-cell available">
                  <strong>{{ format(revisedTotal) }}</strong
                  ><span>révisée 2025</span>
                </td>
                <td class="matrix-cell missing">
                  <strong>À venir</strong><span>source exécutée requise</span>
                </td>
              </tr>
              <tr>
                <th scope="row">Dépenses</th>
                <td class="matrix-cell missing">
                  <strong>À venir</strong><span>source prévisionnelle requise</span>
                </td>
                <td class="matrix-cell available">
                  <strong>{{ format(generalBudgetExpenditure) }}</strong
                  ><span>CP exécutés 2025</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="revision-card" aria-labelledby="revision-title">
        <div>
          <p class="eyebrow">Évolution de la prévision</p>
          <h2 id="revision-title">Les recettes ont été révisées en cours d’année</h2>
        </div>
        <div class="revision-values">
          <span
            >Initiale <strong>{{ format(initialTotal) }}</strong></span
          ><span class="revision-arrow" aria-hidden="true">→</span
          ><span
            >Révisée <strong>{{ format(revisedTotal) }}</strong></span
          >
        </div>
        <p v-if="revenueRevision !== null">
          Écart :
          <strong
            >{{ revenueRevision > 0 ? '+' : ''
            }}{{ revenueRevision.toFixed(1).replace('.', ',') }}&nbsp;%</strong
          >. Une révision reste une estimation, pas une exécution.
        </p>
      </section>
    </template>
  </main>
</template>
