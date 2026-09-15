<script setup lang="ts">
import DonutChart, { type DonutSegment } from '@/components/DonutChart.vue'
import type { DistributionItem } from '@/types/publicFinance'

const props = defineProps<{ items: DistributionItem[]; limit?: number }>()
const colors = ['#e7b93f', '#286b58', '#d76d4b', '#6e86a6', '#8e6d9e', '#82a65f', '#d695a7', '#799b93']
const limit = props.limit ?? 7
const visible = props.items.filter((item) => item.amount !== null).slice(0, limit)
const other = props.items.filter((item) => item.amount !== null).slice(limit).reduce((sum, item) => sum + Number(item.amount), 0)
const segments: DonutSegment[] = [...visible.map((item, index) => ({ label: item.label, value: Number(item.amount), color: colors[index % colors.length]! })), ...(other > 0 ? [{ label: 'Autres', value: other, color: '#b5bdb8' }] : [])]
</script>

<template><DonutChart :segments="segments" center-label="distribution affichée" center-value="Montants réels" /></template>
