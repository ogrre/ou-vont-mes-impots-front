<script setup lang="ts">
import { computed, ref } from 'vue'
import DistributionBars from './DistributionBars.vue'
import DistributionDonut from './DistributionDonut.vue'
import DistributionTable from './DistributionTable.vue'
import DistributionTreemap from './DistributionTreemap.vue'
import type { DistributionItem } from '@/types/publicFinance'
import type { ViewMode } from '../explorer/ViewModeSelector.vue'

const props = defineProps<{ items: DistributionItem[]; view: ViewMode; search?: string }>()
const selected = ref<DistributionItem | null>(null)
const items = computed(() => props.items.filter((item) => !props.search || item.label.toLocaleLowerCase('fr-FR').includes(props.search.toLocaleLowerCase('fr-FR'))))
const maxAmount = computed(() => Math.max(...items.value.map((item) => Number(item.amount ?? 0)), 0))
</script>

<template>
  <DistributionBars v-if="view === 'bars'" :items="items" :max-amount="maxAmount" @select="selected = $event" />
  <DistributionTreemap v-else-if="view === 'treemap'" :items="items" @select="selected = $event" />
  <DistributionDonut v-else-if="view === 'donut'" :items="items" />
  <DistributionTable v-else :items="items" />
  <p v-if="selected" class="detail-note" role="status">{{ selected.label }} · {{ selected.amount === null ? 'Donnée indisponible' : 'Détail sélectionné' }}</p>
  <p v-if="items.length === 0" class="empty-note">Aucun résultat pour cette recherche.</p>
</template>
