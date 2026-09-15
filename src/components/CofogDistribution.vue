<script setup lang="ts">
import { ref } from 'vue'
import MoneyAmount from './MoneyAmount.vue'
import QualityBadge from './QualityBadge.vue'
import SourcePanel from './SourcePanel.vue'
import DonutChart, { type DonutSegment } from './DonutChart.vue'
import InfoBubble from './InfoBubble.vue'
import type { HomeBlock, HomeItem } from '@/types/publicFinance'

const props = defineProps<{ block: HomeBlock; year: number }>()
const selected = ref<HomeItem | null>(null)
function percentage(item: HomeItem) { return item.percentage ?? item.percent }
function width(item: HomeItem) { return `${percentage(item) ?? 0}%` }
function toggle(item: HomeItem) { selected.value = selected.value?.code === item.code ? null : item }
const colors = ['#e7b93f', '#286b58', '#d76d4b', '#6e86a6', '#8e6d9e', '#82a65f', '#d695a7', '#799b93']
const chartItems = props.block.items.filter((item) => item.amount !== null)
const chartLimit = 7
const chartSegments: DonutSegment[] = [
  ...chartItems.slice(0, chartLimit).map((item, index) => ({ label: item.label, value: Number(item.amount), color: colors[index % colors.length]! })),
  ...(chartItems.slice(chartLimit).length ? [{ label: 'Autres fonctions', value: chartItems.slice(chartLimit).reduce((sum, item) => sum + Number(item.amount), 0), color: '#b5bdb8' }] : []),
]
</script>

<template>
  <section id="cofog" class="home-section feature-section" aria-labelledby="what-for-title">
    <div class="section-heading"><div><p class="eyebrow">Destination des dépenses</p><div class="heading-with-help"><h2 id="what-for-title">Où sont dépensées les finances publiques&nbsp;?</h2><InfoBubble term="COFOG" title="La classification COFOG"><span>Elle répartit les dépenses publiques par fonction : santé, enseignement, défense, protection sociale, etc. Les montants couvrent l’ensemble des administrations publiques.</span></InfoBubble></div></div><QualityBadge :status="block.quality_status" :quality="block.quality" show-reason /></div>
    <p class="section-description">{{ block.description }}</p>
    <div v-if="chartSegments.length" class="cofog-chart" aria-labelledby="cofog-chart-title">
      <div><p class="eyebrow">Vue d’ensemble</p><h3 id="cofog-chart-title">La répartition en un coup d’œil</h3><p class="chart-caption">Les plus grandes fonctions sont affichées séparément ; les autres sont regroupées uniquement dans le graphique.</p></div>
      <DonutChart :segments="chartSegments" center-label="Dépenses publiques" center-value="100 %" />
    </div>
    <p class="detail-instruction">Cliquez sur une fonction dans la liste pour afficher son montant, sa part du total et la qualité de la donnée.</p>
    <ol class="cofog-list">
      <li v-for="item in block.items" :key="item.code ?? item.label" class="cofog-item">
        <button class="cofog-row" type="button" :aria-expanded="selected?.code === item.code" @click="toggle(item)" :aria-label="`Détails pour ${item.label}`">
          <span class="cofog-label"><strong>{{ item.label }}</strong><small><MoneyAmount :value="item.amount" compact /></small></span>
          <span class="cofog-track" aria-hidden="true"><span :style="{ width: width(item) }"></span></span>
          <span class="cofog-value"><strong>{{ percentage(item) ? `${percentage(item)?.replace('.', ',')} %` : '—' }}</strong><small>{{ selected?.code === item.code ? 'masquer le détail' : 'voir le détail' }}</small></span>
        </button>
        <div v-if="selected?.code === item.code" class="cofog-inline-detail" role="region" :aria-label="`Détail de ${item.label}`">
          <div><span>Montant</span><strong><MoneyAmount :value="item.amount" compact /></strong></div>
          <div><span>Part des dépenses COFOG</span><strong>{{ percentage(item) ? `${percentage(item)?.replace('.', ',')} %` : 'Donnée indisponible' }}</strong></div>
          <QualityBadge :status="item.quality_status ?? block.quality_status" />
          <RouterLink class="inline-detail-link" :to="`/depenses/cofog/${props.year}/${encodeURIComponent(item.code ?? item.label)}`">Comprendre cette fonction <span aria-hidden="true">→</span></RouterLink>
        </div>
      </li>
    </ol>
    <SourcePanel :provenance="block.provenance" :methodology="block.methodology" />
  </section>
</template>
