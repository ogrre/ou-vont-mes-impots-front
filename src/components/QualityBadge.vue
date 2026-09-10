<script setup lang="ts">
import { computed } from 'vue'
import type { Quality, QualityStatus } from '@/types/publicFinance'

const props = defineProps<{ status: QualityStatus; quality?: Quality; showReason?: boolean }>()
const label = computed(() => ({ validated: 'Donnée validée', review_required: 'Donnée à consolider', not_importable: 'Donnée indisponible' })[props.status])
</script>

<template>
  <details class="quality-details" v-if="showReason && quality?.reason">
    <summary class="quality-badge" :class="`quality-${status}`">{{ label }}</summary>
    <p>{{ quality.reason }}</p>
  </details>
  <span v-else class="quality-badge" :class="`quality-${status}`">{{ label }}</span>
</template>
