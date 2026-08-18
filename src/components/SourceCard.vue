<script setup lang="ts">
import type { Source } from '@/types/api'

defineProps<{ source: Source }>()
</script>

<template>
  <aside class="source-card" aria-labelledby="source-title">
    <p class="eyebrow">Traçabilité</p>
    <h2 id="source-title">D’où viennent ces chiffres ?</h2>
    <p>
      <strong>{{ source.dataset.publication_title || source.dataset.name }}</strong>
      <span v-if="source.publisher.name"> — {{ source.publisher.name }}</span>
    </p>
    <dl>
      <div v-if="source.dataset.publication_date">
        <dt>Publication</dt>
        <dd>{{ source.dataset.publication_date }}</dd>
      </div>
      <div v-if="source.dataset.downloaded_at">
        <dt>Téléchargement</dt>
        <dd>{{ source.dataset.downloaded_at }}</dd>
      </div>
      <div v-if="source.dataset.license.name">
        <dt>Réutilisation</dt>
        <dd>{{ source.dataset.license.name }}</dd>
      </div>
    </dl>
    <a
      v-if="source.dataset.source_url || source.publisher.homepage_url"
      :href="source.dataset.source_url || source.publisher.homepage_url || undefined"
      target="_blank"
      rel="noopener noreferrer"
    >
      Consulter la source officielle <span aria-hidden="true">↗</span>
    </a>
  </aside>
</template>
