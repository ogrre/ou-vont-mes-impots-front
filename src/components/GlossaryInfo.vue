<script setup lang="ts">
import InfoBubble from '@/components/InfoBubble.vue'

type GlossaryTerm =
  | 'COFOG' | 'APU' | 'APUC' | 'APUL' | 'ASSO' | 'CP' | 'AE' | 'LFI'
  | 'Exécution' | 'Comptes nationaux' | 'Comptabilité budgétaire' | 'Consolidé'
  | 'Mission' | 'Programme' | 'Action' | 'Sous-action' | 'PLRG' | 'RAP' | 'Périmètre'

const definitions: Record<GlossaryTerm, { title: string; description: string }> = {
  COFOG: { title: 'La classification COFOG', description: 'La COFOG répartit les dépenses publiques selon leur fonction : santé, enseignement, défense, protection sociale, etc. Elle ne désigne pas un ministère.' },
  APU: { title: 'Administrations publiques (APU)', description: 'L’ensemble des administrations publiques : administrations centrales, administrations locales et administrations de sécurité sociale.' },
  APUC: { title: 'Administrations publiques centrales (APUC)', description: 'L’État et les organismes publics qui dépendent principalement de lui.' },
  APUL: { title: 'Administrations publiques locales (APUL)', description: 'Les collectivités territoriales et les organismes publics locaux.' },
  ASSO: { title: 'Administrations de sécurité sociale (ASSO)', description: 'Les caisses et organismes qui gèrent notamment les retraites, la maladie, la famille et le chômage.' },
  CP: { title: 'Crédits de paiement (CP)', description: 'Les CP correspondent aux paiements qui peuvent réellement être effectués pendant l’année.' },
  AE: { title: 'Autorisations d’engagement (AE)', description: 'Les AE autorisent un engagement financier. Les paiements correspondants peuvent intervenir sur plusieurs années.' },
  LFI: { title: 'Loi de finances initiale (LFI)', description: 'Le budget voté au début de l’année. Il s’agit d’une prévision, pas du montant finalement payé.' },
  Exécution: { title: 'Exécution budgétaire', description: 'Les crédits exécutés correspondent aux montants effectivement consommés ou payés, selon la mesure affichée.' },
  'Comptes nationaux': { title: 'Comptes nationaux', description: 'Les comptes nationaux décrivent les opérations de l’ensemble des administrations publiques selon les règles de la comptabilité nationale.' },
  'Comptabilité budgétaire': { title: 'Comptabilité budgétaire', description: 'La comptabilité du budget de l’État, organisée autour des crédits votés, des engagements et des paiements.' },
  Consolidé: { title: 'Montant consolidé', description: 'Les flux entre administrations publiques sont neutralisés pour éviter de compter deux fois les mêmes sommes.' },
  Mission: { title: 'Mission', description: 'Le niveau le plus large du budget de l’État. Une mission regroupe plusieurs programmes autour d’une politique publique.' },
  Programme: { title: 'Programme', description: 'Un programme regroupe les crédits et les actions d’une politique publique au sein d’une mission.' },
  Action: { title: 'Action', description: 'Une action décrit une partie opérationnelle d’un programme et permet de descendre dans le détail des dépenses.' },
  'Sous-action': { title: 'Sous-action', description: 'Le niveau détaillé d’une action. Elle précise l’utilisation des crédits sans être ajoutée une seconde fois au total de son parent.' },
  PLRG: { title: 'PLRG', description: 'Le projet de loi relatif aux résultats de la gestion présente les résultats d’exécution du budget de l’État.' },
  RAP: { title: 'RAP', description: 'Le rapport annuel de performances explique les résultats et l’exécution des crédits d’un programme.' },
  Périmètre: { title: 'Périmètre du chiffre', description: 'Le périmètre indique quelles administrations, quelle année, quelle méthode comptable et quel type de dépense sont inclus.' },
}

const props = defineProps<{ term: GlossaryTerm }>()
const definition = definitions[props.term]
</script>

<template>
  <InfoBubble :term="term" :title="definition.title">{{ definition.description }}</InfoBubble>
</template>
