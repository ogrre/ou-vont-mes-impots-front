<script setup lang="ts">
import { computed } from 'vue'

export interface DonutSegment {
  label: string
  value: number
  color: string
}

const props = defineProps<{
  segments: DonutSegment[]
  centerLabel: string
  centerValue: string
}>()

const total = computed(() => props.segments.reduce((sum, segment) => sum + segment.value, 0))

const gradient = computed(() => {
  if (total.value <= 0) return '#e5e8e4'

  let cursor = 0
  const stops = props.segments.map((segment) => {
    const start = cursor
    cursor += (segment.value / total.value) * 100
    return `${segment.color} ${start}% ${cursor}%`
  })

  return `conic-gradient(${stops.join(', ')})`
})

function percentage(value: number) {
  return total.value ? (value / total.value) * 100 : 0
}
</script>

<template>
  <div class="donut-layout">
    <div
      class="donut"
      :style="{ background: gradient }"
      role="img"
      :aria-label="`${centerLabel} : ${centerValue}. La légende détaille la répartition.`"
    >
      <div class="donut-center">
        <strong>{{ centerValue }}</strong>
        <span>{{ centerLabel }}</span>
      </div>
    </div>
    <ul class="donut-legend">
      <li v-for="segment in segments" :key="segment.label">
        <span
          class="legend-color"
          :style="{ backgroundColor: segment.color }"
          aria-hidden="true"
        ></span>
        <span>{{ segment.label }}</span>
        <strong>{{ percentage(segment.value).toFixed(1).replace('.', ',') }}&nbsp;%</strong>
      </li>
    </ul>
  </div>
</template>
