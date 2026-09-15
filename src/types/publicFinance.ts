export type QualityStatus = 'validated' | 'review_required' | 'not_importable'

export interface Provenance {
  source?: string | null
  source_url?: string | null
  dataset?: string | null
  source_page?: number | string | null
  sources?: string[]
  datasets?: string[]
}

export interface Quality {
  status: QualityStatus
  reason?: string
  coverage_percent?: string | null
  included_amount?: string | null
  excluded_amount?: string | null
  excluded_items?: Array<{ code?: string | null; label?: string; status?: QualityStatus }>
}

export interface HomeItem {
  code?: string | null
  label: string
  amount: string | null
  percentage?: string | null
  percent?: string | null
  per_100: string | null
  quality_status?: QualityStatus
  accounting_basis?: 'national_accounts' | 'budgetary' | string
  provenance?: Provenance
  quality?: Quality
}

export interface HomeBlock {
  title: string
  description: string
  amount: string | null
  unit: string
  items: HomeItem[]
  percentage: string | null
  per_100: string | null
  quality_status: QualityStatus
  quality: Quality
  methodology: string
  provenance: Provenance
}

export interface RevenueHomeBlock extends HomeBlock {
  amount: null
  sub_blocks: {
    public_revenues: Record<string, unknown>
    state_budget_revenues: Record<string, unknown>
  }
}

export interface PublicFinanceHome {
  data_year: number
  reference_year: number
  generated_at: string
  methodology_version: string
  headline: HomeBlock
  public_spending: HomeBlock
  who_spends: HomeBlock
  what_for: HomeBlock
  state_budget: HomeBlock
  revenues: RevenueHomeBlock
}

export interface AvailableYear {
  year: number
  status?: string
  label?: string
  coverage?: string
  [key: string]: unknown
}

export interface BudgetAmounts {
  lfi: string | null
  execution: string | null
}

export interface BudgetNode {
  code: string | null
  label: string
  year: number
  hierarchy_level: 'mission' | 'programme' | 'action' | 'sub_action' | string
  parent_action_code?: string | null
  contributes_to_program_total?: boolean
  ae: BudgetAmounts
  cp: BudgetAmounts
  quality: Quality & { source?: string | null; source_page?: string | number | null }
  provenance: Provenance & { raw_label?: string | null }
  children?: BudgetNode[]
}

export interface BudgetCollectionResponse {
  year: number
  items: BudgetNode[]
  coverage?: Record<string, number>
}

export interface BudgetItemResponse {
  year: number
  item: BudgetNode
  coverage?: Record<string, number>
}

export interface BudgetActionsResponse {
  year: number
  programme: BudgetNode
  items: BudgetNode[]
  coverage?: Record<string, number>
}

export interface DistributionItem {
  code: string | null
  label: string
  amount: string | null
  percent: string | null
  per_100: string | null
  quality_status: QualityStatus
  quality?: Quality
  provenance?: Provenance
}

export interface DistributionResponse {
  year: number
  scope: string
  measurement: 'commitment_authorization' | 'payment_credit'
  stage: 'initial_budget' | 'executed'
  unit: 'amount' | 'percent' | 'per_100'
  denominator: string | null
  denominator_type?: string
  items: DistributionItem[]
  quality?: Quality
  coverage?: Record<string, number>
}

export interface HistoryItem {
  year: number
  amount?: string | null
  value?: string | null
  percent?: string | null
  [key: string]: unknown
}

export interface HistoryResponse {
  metric: string
  from: number
  to: number
  items: HistoryItem[]
}

export interface SearchBreadcrumb {
  type: string
  code: string | null
  label: string
}

export interface FinanceSearchResult {
  type: string
  code: string | null
  label: string
  year: number | null
  scope: string
  classification: string
  parent: SearchBreadcrumb | null
  breadcrumb: SearchBreadcrumb[]
  amount: string | null
  quality_status: QualityStatus
}

export interface FinanceSearchResponse {
  query: string
  year: number | null
  items: FinanceSearchResult[]
}
