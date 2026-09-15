<script setup lang="ts">
import MoneyAmount from '@/components/MoneyAmount.vue'
import type { DistributionItem } from '@/types/publicFinance'
defineProps<{ items: DistributionItem[] }>()
const emit = defineEmits<{ select: [item: DistributionItem] }>()
</script>

<template>
  <div class="treemap" role="list" aria-label="Treemap de la distribution">
    <button v-for="item in items" :key="item.code ?? item.label" type="button" role="listitem" class="treemap-cell" :style="{ flex: `${Math.max(Number(item.percent ?? 0), 1)} 1 0` }" @click="emit('select', item)">
      <strong>{{ item.label }}</strong><small><span v-if="item.amount !== null"><MoneyAmount :value="item.amount" compact /></span><span v-else>Donnée indisponible</span></small>
    </button>
  </div>
</template>
