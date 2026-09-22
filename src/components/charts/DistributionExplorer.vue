<script setup lang="ts">
import { computed, ref } from 'vue'
import DistributionBars from './DistributionBars.vue'
import DistributionDonut from './DistributionDonut.vue'
import DistributionTable from './DistributionTable.vue'
import DistributionTreemap from './DistributionTreemap.vue'
import type { DistributionItem } from '@/types/publicFinance'
import type { ViewMode } from '../explorer/ViewModeSelector.vue'

const props = defineProps<{ items: DistributionItem[]; view: ViewMode; search?: string; explanations?: Record<string, string> }>()
const selected = ref<DistributionItem | null>(null)
const items = computed(() => props.items.filter((item) => !props.search || item.label.toLocaleLowerCase('fr-FR').includes(props.search.toLocaleLowerCase('fr-FR'))))
const maxAmount = computed(() => Math.max(...items.value.map((item) => Number(item.amount ?? 0)), 0))
</script>

<template>
  <DistributionBars v-if="view === 'bars'" :items="items" :max-amount="maxAmount" :selected-code="selected?.code" :explanations="explanations" @select="selected = $event" />
  <DistributionTreemap v-else-if="view === 'treemap'" :items="items" @select="selected = $event" />
  <DistributionDonut v-else-if="view === 'donut'" :items="items" />
  <DistributionTable v-else :items="items" />
  <section v-if="selected && view !== 'bars'" class="distribution-selection" role="status" aria-live="polite" aria-label="Explication de la ligne sélectionnée">
    <div class="section-heading"><div><p class="eyebrow">Détail sélectionné</p><h3>{{ selected.label }}</h3></div><span v-if="selected.code">{{ selected.code }}</span></div>
    <p>{{ selected.description ?? props.explanations?.[selected.code ?? ''] ?? 'Cette ligne précise le type de dépense couvert par la catégorie sélectionnée. Son montant est déjà compris dans le total de la distribution affichée.' }}</p>
    <p class="detail-note">{{ selected.amount === null ? 'Le montant est indisponible pour cette année.' : 'Le montant et la part affichés proviennent directement de l’API.' }}</p>
  </section>
  <p v-if="items.length === 0" class="empty-note">Aucun résultat pour cette recherche.</p>
</template>
