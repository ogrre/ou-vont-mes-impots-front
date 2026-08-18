<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  term: string
  title: string
}>()

const descriptionId = useId()
</script>

<template>
  <details class="info-bubble">
    <summary :aria-label="`Comprendre ${term}`" :aria-describedby="descriptionId">
      <span aria-hidden="true">i</span>
    </summary>
    <div :id="descriptionId" class="info-bubble-content" role="note">
      <strong>{{ title }}</strong>
      <p><slot /></p>
    </div>
  </details>
</template>
