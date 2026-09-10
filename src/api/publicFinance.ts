import type {
  AvailableYear,
  BudgetActionsResponse,
  BudgetCollectionResponse,
  BudgetItemResponse,
  DistributionResponse,
  HistoryResponse,
  FinanceSearchResponse,
  PublicFinanceHome,
} from '@/types/publicFinance'
import { cachedJson } from '@/services/apiCache'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080').replace(/\/$/, '')
export const MIN_AVAILABLE_YEAR = 2017
const SNAPSHOT_CACHE_TTL = 30 * 60 * 1000
const SEARCH_CACHE_TTL = 5 * 60 * 1000
const YEARS_CACHE_TTL = 60 * 60 * 1000

async function getWithTtl<T>(path: string, parameters: Record<string, string | number | undefined> = {}, ttl = SNAPSHOT_CACHE_TTL): Promise<T> {
  const url = new URL(`${apiBaseUrl}${path}`)
  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value))
  })
  return cachedJson<T>(url.toString(), ttl)
}

function get<T>(path: string, parameters: Record<string, string | number | undefined> = {}) {
  return getWithTtl<T>(path, parameters)
}

export function fetchAvailableYears() {
  return getWithTtl<{ years: Array<number | AvailableYear> }>('/api/v1/years', {}, YEARS_CACHE_TTL).then((response) => ({
    ...response,
    years: response.years.filter((item) => (typeof item === 'number' ? item : item.year) >= MIN_AVAILABLE_YEAR),
  }))
}

export function fetchPublicFinanceHome(year = 2024) {
  return get<PublicFinanceHome>(`/api/v1/home/${year}`)
}

export interface FinanceCategory {
  id: number
  code: string
  slug: string
  name: string
  description?: string | null
  parent_id?: number | null
}

export function fetchCategoryChildren(classification: string, category: string) {
  return getWithTtl<{ classification: string; category: string; categories: FinanceCategory[] }>(`/api/v1/categories/${encodeURIComponent(classification)}/${encodeURIComponent(category)}/children`)
}

export function fetchBudgetMissions(year: number) {
  return get<BudgetCollectionResponse>(`/api/v1/budget-state/${year}/missions`)
}

export function fetchBudgetMission(year: number, code: string) {
  return get<BudgetItemResponse>(`/api/v1/budget-state/${year}/missions/${encodeURIComponent(code)}`)
}

export function fetchBudgetProgramme(year: number, code: string) {
  return get<BudgetItemResponse>(`/api/v1/budget-state/${year}/programmes/${encodeURIComponent(code)}`)
}

export function fetchBudgetProgrammeActions(year: number, code: string) {
  return get<BudgetActionsResponse>(`/api/v1/budget-state/${year}/programmes/${encodeURIComponent(code)}/actions`)
}

export function fetchBudgetDistribution(
  year: number,
  options: {
    mission?: string
    programme?: string
    measurement: 'payment_credit' | 'commitment_authorization'
    stage: 'executed' | 'initial_budget'
  },
) {
  return get<DistributionResponse>(`/api/v1/budget-state/${year}/distribution`, {
    ...options,
    unit: 'amount',
  })
}

export function fetchMissionDistribution(
  year: number,
  mission: string,
  options: { measurement: 'payment_credit' | 'commitment_authorization'; stage: 'executed' | 'initial_budget' },
) {
  return fetchBudgetDistribution(year, { ...options, mission })
}

export function fetchProgrammeDistribution(
  year: number,
  programme: string,
  options: { measurement: 'payment_credit' | 'commitment_authorization'; stage: 'executed' | 'initial_budget' },
) {
  return fetchBudgetDistribution(year, { ...options, programme })
}

export function fetchHistory(parameters: {
  metric: 'expenditure' | 'revenue' | 'tax' | 'social_contribution' | 'deficit' | 'debt'
  from: number
  to: number
  classification?: string
  category?: string
  scope?: string
  accounting_basis?: 'national_accounts' | 'budgetary'
}) {
  return get<HistoryResponse>('/api/v1/history', parameters)
}

export function fetchOverview(year: number) {
  return get<Record<string, unknown>>(`/api/v1/overview/${year}`)
}

export function fetchSearch(parameters: { q: string; year?: number; scope?: string; types?: string; limit?: number }) {
  return getWithTtl<FinanceSearchResponse>('/api/v1/search', parameters, SEARCH_CACHE_TTL)
}

export function fetchStateRevenue(year: number, status: 'executed' | 'initial_estimate' | 'revised_estimate' | 'budget_bill') {
  return get<Record<string, unknown>>('/api/v1/state-revenue', { year, status })
}
