<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchSearch } from '@/api/publicFinance'
import MoneyAmount from '@/components/MoneyAmount.vue'
import type { FinanceSearchResult } from '@/types/publicFinance'

const props = withDefaults(defineProps<{ year?: number }>(), { year: 2024 })
const router = useRouter()
const query = ref('')
const results = ref<FinanceSearchResult[]>([])
const open = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const activeIndex = ref(-1)
let timer: ReturnType<typeof setTimeout> | undefined

const labels: Record<string, string> = { mission: 'Mission', programme: 'Programme', action: 'Action', sub_action: 'Sous-action', classification: 'Classification', cofog: 'COFOG', revenue: 'Recette' }
function typeLabel(type: string) { return labels[type] ?? type }
function routeFor(result: FinanceSearchResult) {
  if (!result.code) return '/explorer/' + (result.year ?? props.year)
  const year = result.year ?? props.year
  if (result.type === 'mission') return `/budget-etat/${year}/missions/${encodeURIComponent(result.code)}`
  if (result.type === 'programme') return `/budget-etat/${year}/programmes/${encodeURIComponent(result.code)}`
  if (result.type === 'action' || result.type === 'sub_action') {
    const programme = result.breadcrumb.find((item) => item.type === 'programme')?.code
    const action = result.type === 'action' ? result.code : result.breadcrumb.find((item) => item.type === 'action')?.code
    if (programme && action) return `/budget-etat/${year}/programmes/${encodeURIComponent(programme)}/actions/${encodeURIComponent(action)}`
  }
  return `/explorer/${year}`
}
function choose(result: FinanceSearchResult) { open.value = false; activeIndex.value = -1; void router.push(routeFor(result)) }
async function search() {
  if (query.value.trim().length < 2) { results.value = []; return }
  loading.value = true; error.value = null
  try { results.value = (await fetchSearch({ q: query.value.trim(), year: props.year, limit: 20 })).items; activeIndex.value = -1 }
  catch (reason) { results.value = []; error.value = reason instanceof Error ? reason.message : 'La recherche est indisponible.' }
  finally { loading.value = false }
}
function schedule() { open.value = true; if (timer) clearTimeout(timer); timer = setTimeout(() => void search(), 280) }
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') { open.value = false; return }
  if (event.key === 'ArrowDown' && results.value.length) { event.preventDefault(); open.value = true; activeIndex.value = Math.min(activeIndex.value + 1, results.value.length - 1) }
  if (event.key === 'ArrowUp' && results.value.length) { event.preventDefault(); activeIndex.value = Math.max(activeIndex.value - 1, 0) }
  if (event.key === 'Enter' && results.value.length) { event.preventDefault(); const result = results.value[activeIndex.value < 0 ? 0 : activeIndex.value]; if (result) choose(result) }
}
function globalShortcut(event: KeyboardEvent) { if ((event.key === '/' || (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey))) && document.activeElement?.tagName !== 'INPUT') { event.preventDefault(); document.querySelector<HTMLInputElement>('#global-finance-search')?.focus() } }
onMounted(() => window.addEventListener('keydown', globalShortcut)); onBeforeUnmount(() => { window.removeEventListener('keydown', globalShortcut); if (timer) clearTimeout(timer) }); watch(() => props.year, () => { if (query.value.length >= 2) schedule() })
</script>

<template>
  <div class="global-search"><label for="global-finance-search">Rechercher <span class="search-shortcut">/ ou ⌘ K</span></label><div class="search-input-wrap"><input id="global-finance-search" v-model="query" type="search" role="combobox" aria-controls="global-search-results" :aria-activedescendant="activeIndex >= 0 ? `search-result-${activeIndex}` : undefined" :aria-expanded="open" aria-autocomplete="list" placeholder="École, défense…" @focus="open = query.length >= 2" @input="schedule" @keydown="onKeydown" /><button v-if="query" class="search-clear" type="button" aria-label="Effacer la recherche" @click="query = ''; results = []; open = false">×</button></div><div v-if="open" id="global-search-results" class="search-results" role="listbox"><p v-if="loading" role="status">Recherche…</p><p v-else-if="error" role="alert">{{ error }}</p><p v-else-if="query.length >= 2 && results.length === 0" role="status">Aucun résultat pour « {{ query }} ».</p><button v-for="(result, index) in results" :id="`search-result-${index}`" :key="`${result.type}-${result.code}`" type="button" role="option" :aria-selected="index === activeIndex" :class="{ active: index === activeIndex }" @click="choose(result)"><span class="search-result-type">{{ typeLabel(result.type) }}</span><strong>{{ result.label }}</strong><small>{{ result.breadcrumb.slice(0, -1).map((item) => item.label).join(' › ') || 'Résultat financier' }}<template v-if="result.amount !== null"> · <MoneyAmount :value="result.amount" compact /></template><template v-if="result.year"> · {{ result.year }}</template></small></button></div></div>
</template>
