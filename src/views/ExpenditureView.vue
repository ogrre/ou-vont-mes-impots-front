<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import InfoBubble from '@/components/InfoBubble.vue'
import DonutChart, { type DonutSegment } from '@/components/DonutChart.vue'
import SourceCard from '@/components/SourceCard.vue'
import { fetchExpenditure } from '@/services/api'
import type { Classification, ExpenditureResponse, Measure } from '@/types/api'

const classification = ref<Classification>('mission')
const measure = ref<Measure>('cp')
const data = ref<ExpenditureResponse | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const classifications: Array<{
  value: Classification
  label: string
  explanation: string
}> = [
  {
    value: 'mission',
    label: 'Par mission',
    explanation:
      'Une mission regroupe les dépenses qui poursuivent un même grand objectif public, par exemple l’enseignement scolaire ou la défense.',
  },
  {
    value: 'ministry',
    label: 'Par ministère',
    explanation:
      'Cette vue répartit les dépenses selon le ministère responsable. Un ministère peut contribuer à plusieurs missions.',
  },
  {
    value: 'nature',
    label: 'Par nature',
    explanation:
      'Cette vue indique à quoi sert comptablement l’argent : personnel, fonctionnement, investissement, interventions ou dette.',
  },
]

const selectedClassification = computed(() =>
  classifications.find((item) => item.value === classification.value),
)

const formatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const maxAmount = computed(() =>
  Math.max(...(data.value?.items.map((item) => Number(item.amount)) ?? [0])),
)

const chartColors = ['#e7b93f', '#286b58', '#d76d4b', '#6e86a6', '#8e6d9e', '#82a65f', '#d695a7']
const donutSegments = computed<DonutSegment[]>(() => {
  if (!data.value) return []
  const visible = data.value.items.slice(0, 6)
  const other = data.value.items.slice(6).reduce((sum, item) => sum + Number(item.amount), 0)
  return [
    ...visible.map((item, index) => ({
      label: item.label,
      value: Number(item.amount),
      color: chartColors[index]!,
    })),
    ...(other > 0 ? [{ label: 'Autres postes', value: other, color: chartColors[6]! }] : []),
  ]
})

function formatAmount(amount: string) {
  return formatter.format(Number(amount))
}

function barWidth(amount: string) {
  return `${maxAmount.value ? (Number(amount) / maxAmount.value) * 100 : 0}%`
}

async function load() {
  loading.value = true
  error.value = null
  try {
    data.value = await fetchExpenditure(classification.value, measure.value)
  } catch (reason) {
    data.value = null
    error.value = reason instanceof Error ? reason.message : 'Impossible de charger les données.'
  } finally {
    loading.value = false
  }
}

watch([classification, measure], load)
onMounted(load)
</script>

<template>
  <main id="contenu" class="page-shell">
    <section class="hero">
      <p class="eyebrow">Budget de l’État · exécution 2025</p>
      <h1>Où va l’argent de l’État&nbsp;?</h1>
      <p class="hero-copy">
        Explorez les dépenses réellement exécutées selon les classifications officielles du budget
        de l’État français.
      </p>
    </section>

    <section class="controls" aria-label="Filtres des dépenses">
      <div class="segmented" aria-label="Classification">
        <div v-for="option in classifications" :key="option.value" class="filter-choice">
          <button
            type="button"
            :class="{ active: classification === option.value }"
            :aria-pressed="classification === option.value"
            @click="classification = option.value"
          >
            {{ option.label }}
          </button>
          <InfoBubble :term="option.label" :title="option.label">
            {{ option.explanation }}
          </InfoBubble>
        </div>
      </div>
      <div class="measure-control">
        <span>Mesure</span>
        <div class="filter-choice">
          <button type="button" :class="{ active: measure === 'cp' }" @click="measure = 'cp'">
            CP <small>paiements</small>
          </button>
          <InfoBubble term="CP" title="Crédits de paiement (CP)">
            C’est l’argent effectivement payé pendant l’année, y compris pour des engagements pris
            auparavant. Utilisez les CP pour comprendre les décaissements de 2025.
          </InfoBubble>
        </div>
        <div class="filter-choice">
          <button type="button" :class="{ active: measure === 'ae' }" @click="measure = 'ae'">
            AE <small>engagements</small>
          </button>
          <InfoBubble term="AE" title="Autorisations d’engagement (AE)">
            C’est le montant maximal que l’État peut engager juridiquement. Le paiement peut être
            réparti sur 2025 et les années suivantes : les AE ne s’additionnent donc pas aux CP.
          </InfoBubble>
        </div>
      </div>
    </section>

    <p class="context-help">
      <strong>{{ selectedClassification?.label }} :</strong>
      {{ selectedClassification?.explanation }}
    </p>

    <div v-if="loading" class="state-card" role="status">Chargement des données officielles…</div>
    <div v-else-if="error" class="state-card error" role="alert">
      <strong>Les données ne sont pas disponibles.</strong>
      <span>{{ error }}</span>
      <button type="button" @click="load">Réessayer</button>
    </div>

    <template v-else-if="data">
      <section class="summary-card">
        <div>
          <p>
            Total exécuté en {{ data.measure.official_label }}
            <InfoBubble term="dépense exécutée" title="Que signifie « exécuté » ?">
              Il s’agit de ce qui a été enregistré dans les comptes pour 2025, et non d’une simple
              prévision votée avant le début de l’année.
            </InfoBubble>
          </p>
          <strong>{{ formatAmount(data.total) }}</strong>
        </div>
        <p>
          Périmètre&nbsp;: <strong>{{ data.scope.label }}</strong>
          <InfoBubble term="périmètre" title="Le périmètre du chiffre">
            Ces données couvrent le budget de l’État. Elles n’incluent pas automatiquement les
            collectivités locales ni les administrations de sécurité sociale. </InfoBubble
          >. Ce total ne représente pas l’ensemble des dépenses publiques françaises.
        </p>
      </section>

      <section class="ranking" aria-labelledby="ranking-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Répartition officielle</p>
            <h2 id="ranking-title">
              {{ selectedClassification?.label }}
            </h2>
          </div>
          <span>{{ data.items.length }} postes</span>
        </div>
        <DonutChart
          class="chart-block"
          :segments="donutSegments"
          :center-label="data.measure.official_label"
          :center-value="formatAmount(data.total)"
        />
        <ol>
          <li v-for="item in data.items" :key="item.slug">
            <div class="item-heading">
              <span>{{ item.label }}</span>
              <strong>{{ formatAmount(item.amount) }}</strong>
            </div>
            <div class="bar" aria-hidden="true">
              <span :style="{ width: barWidth(item.amount) }"></span>
            </div>
            <small v-if="item.percentage !== null"
              >{{ item.percentage.replace('.', ',') }}&nbsp;% du total</small
            >
          </li>
        </ol>
      </section>

      <SourceCard :source="data.source" />
    </template>
  </main>
</template>
