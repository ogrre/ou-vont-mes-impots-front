<script setup lang="ts">
import YearSelector from './YearSelector.vue'
import ViewModeSelector, { type ViewMode } from './ViewModeSelector.vue'
import InfoBubble from '@/components/InfoBubble.vue'
import type { AvailableYear } from '@/types/publicFinance'

defineProps<{
  years: AvailableYear[]
  year: number
  classification: string
  measurement: 'payment_credit' | 'commitment_authorization'
  stage: 'executed' | 'initial_budget'
  view: ViewMode
  search?: string
}>()
const emit = defineEmits<{
  'update:year': [value: number]
  'update:classification': [value: string]
  'update:measurement': [value: 'payment_credit' | 'commitment_authorization']
  'update:stage': [value: 'executed' | 'initial_budget']
  'update:view': [value: ViewMode]
  'update:search': [value: string]
}>()
</script>

<template>
  <section class="explorer-toolbar" aria-label="Filtres de l’explorateur">
    <YearSelector :years="years" :model-value="year" @update:model-value="emit('update:year', $event)" />
    <label class="control-field"><span>Répartition</span><select :value="classification" @change="emit('update:classification', ($event.target as HTMLSelectElement).value)"><option value="mission">Par mission</option><option value="programme">Par programme</option></select></label>
    <label class="control-field"><span>Mesure <InfoBubble term="CP et AE" title="CP ou AE"><span><strong>CP</strong> : paiements réellement effectués. <strong>AE</strong> : engagements qui pourront donner lieu à des paiements.</span></InfoBubble></span><select :value="measurement" @change="emit('update:measurement', ($event.target as HTMLSelectElement).value as 'payment_credit' | 'commitment_authorization')"><option value="payment_credit">CP — paiements</option><option value="commitment_authorization">AE — engagements</option></select></label>
    <label class="control-field"><span>Stade <InfoBubble term="Exécuté et budget initial" title="Le stade budgétaire"><span><strong>Exécuté</strong> correspond aux paiements réalisés. <strong>Budget initial</strong> correspond à la prévision votée.</span></InfoBubble></span><select :value="stage" @change="emit('update:stage', ($event.target as HTMLSelectElement).value as 'executed' | 'initial_budget')"><option value="executed">Exécuté</option><option value="initial_budget">Budget initial</option></select></label>
    <ViewModeSelector :model-value="view" @update:model-value="emit('update:view', $event)" />
    <label class="control-field search-field"><span>Rechercher dans les résultats</span><input :value="search" type="search" placeholder="Ex. défense, école…" @input="emit('update:search', ($event.target as HTMLInputElement).value)" /></label>
  </section>
</template>
