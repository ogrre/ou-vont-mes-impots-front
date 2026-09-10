import type {
  Classification,
  ExpenditureResponse,
  Measure,
  RevenueResponse,
  RevenueStatus,
} from '@/types/api'
import { cachedJson } from './apiCache'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080').replace(/\/$/, '')

async function get<T>(path: string, parameters: Record<string, string | number>): Promise<T> {
  const url = new URL(`${apiBaseUrl}${path}`)
  Object.entries(parameters).forEach(([key, value]) => url.searchParams.set(key, String(value)))

  return cachedJson<T>(url, 30 * 60 * 1000)
}

export function fetchExpenditure(classification: Classification, measure: Measure) {
  return get<ExpenditureResponse>('/api/v1/state-expenditure', {
    year: 2025,
    classification,
    measure,
  })
}

export function fetchRevenue(status: RevenueStatus, requestedYear?: number) {
  const year = requestedYear ?? (status === 'budget_bill' ? 2026 : 2025)
  return get<RevenueResponse>('/api/v1/state-revenue', { year, status })
}
