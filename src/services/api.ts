import type {
  Classification,
  ExpenditureResponse,
  Measure,
  RevenueResponse,
  RevenueStatus,
} from '@/types/api'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080').replace(/\/$/, '')

async function get<T>(path: string, parameters: Record<string, string | number>): Promise<T> {
  const url = new URL(`${apiBaseUrl}${path}`)
  Object.entries(parameters).forEach(([key, value]) => url.searchParams.set(key, String(value)))

  const response = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(payload?.message ?? `L’API a répondu avec le statut ${response.status}.`)
  }

  return response.json() as Promise<T>
}

export function fetchExpenditure(classification: Classification, measure: Measure) {
  return get<ExpenditureResponse>('/api/v1/state-expenditure', {
    year: 2025,
    classification,
    measure,
  })
}

export function fetchRevenue(status: RevenueStatus) {
  const year = status === 'budget_bill' ? 2026 : 2025
  return get<RevenueResponse>('/api/v1/state-revenue', { year, status })
}
