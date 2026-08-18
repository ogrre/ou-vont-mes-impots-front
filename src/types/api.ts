export type Classification = 'mission' | 'ministry' | 'nature'
export type Measure = 'ae' | 'cp'
export type RevenueStatus = 'initial_estimate' | 'revised_estimate' | 'budget_bill'

export interface Source {
  dataset: {
    id: string
    name: string
    publication_title: string | null
    publication_date: string | null
    source_url: string | null
    download_url: string | null
    downloaded_at: string | null
    license: { name: string | null; url: string | null }
    publication_ready: boolean
  }
  publisher: {
    name: string | null
    source_name: string
    homepage_url: string | null
    official: boolean
  }
  file: { descriptor: string; filename: string; checksum_sha256: string }
  import: {
    batch_id: number
    completed_at: string | null
    rows_read: number
    observations_imported: number
  }
}

export interface ExpenditureItem {
  code: string | null
  slug: string
  label: string
  amount: string
  percentage: string | null
  components: Array<{ code: string; label: string; amount: string }>
}

export interface ExpenditureResponse {
  period: number
  scope: { code: string; label: string }
  status: 'executed'
  flow_type: 'expenditure'
  measure: { code: string; official_label: string }
  classification: Classification
  currency: 'EUR'
  total: string
  percentage_denominator: { amount: string; description: string }
  items: ExpenditureItem[]
  source: Source
}

export interface RevenueItem {
  slug: string
  label: string
  amount: string
  is_aggregate: boolean
  is_deduction: boolean
  source_row_number: number | null
}

export interface RevenueResponse {
  period: number
  scope: { code: string; label: string; budget_component: string }
  status: RevenueStatus
  flow_type: 'revenue'
  classification: 'revenue'
  currency: 'EUR'
  aggregation_warning: string
  items: RevenueItem[]
  source: Source
}
