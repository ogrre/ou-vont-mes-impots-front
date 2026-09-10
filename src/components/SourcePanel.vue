<script setup lang="ts">
import type { Provenance } from '@/types/publicFinance'

defineProps<{ provenance: Provenance; methodology?: string }>()
</script>

<template>
  <details class="source-panel">
    <summary>Sources et méthode</summary>
    <p v-if="methodology">{{ methodology }}</p>
    <dl>
      <div v-if="provenance.source"><dt>Source</dt><dd>{{ provenance.source }}</dd></div>
      <div v-if="provenance.dataset"><dt>Dataset</dt><dd>{{ provenance.dataset }}</dd></div>
      <div v-if="provenance.source_page"><dt>Page</dt><dd>{{ provenance.source_page }}</dd></div>
    </dl>
    <a v-if="provenance.source_url" :href="provenance.source_url" target="_blank" rel="noopener noreferrer">Consulter la source officielle ↗</a>
  </details>
</template>
