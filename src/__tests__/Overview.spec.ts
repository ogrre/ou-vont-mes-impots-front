import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import OverviewView from '@/views/OverviewView.vue'

const source = {
  dataset: {
    id: 'test',
    name: 'Test',
    publication_title: null,
    publication_date: null,
    source_url: null,
    download_url: null,
    downloaded_at: null,
    license: { name: null, url: null },
    publication_ready: false,
  },
  publisher: { name: null, source_name: 'Test', homepage_url: null, official: true },
  file: { descriptor: 'test', filename: 'test.csv', checksum_sha256: 'abc' },
  import: { batch_id: 1, completed_at: null, rows_read: 1, observations_imported: 1 },
}

const expenditure = {
  period: 2025,
  scope: { code: 'french_state_budget', label: 'Budget de l’État' },
  status: 'executed',
  flow_type: 'expenditure',
  measure: { code: 'payment_credit', official_label: 'CP' },
  classification: 'mission',
  currency: 'EUR',
  total: '700000000000.00',
  percentage_denominator: { amount: '700000000000.00', description: 'test' },
  items: [
    {
      code: null,
      slug: 'test',
      label: 'Test',
      amount: '700000000000.00',
      percentage: '100.00',
      components: [{ code: 'general_budget', label: 'Budget général', amount: '578000000000.00' }],
    },
  ],
  source,
}

function revenue(status: 'initial_estimate' | 'revised_estimate', amount: string) {
  return {
    period: 2025,
    scope: {
      code: 'french_state_budget',
      label: 'Budget de l’État',
      budget_component: 'general_budget',
    },
    status,
    flow_type: 'revenue',
    classification: 'revenue',
    currency: 'EUR',
    aggregation_warning: 'Ne pas additionner.',
    items: [
      {
        slug: 'recettes-nettes-totales-du-budget-general-ab-cd',
        label: 'Recettes nettes totales',
        amount,
        is_aggregate: true,
        is_deduction: false,
        source_row_number: 23,
      },
    ],
    source,
  }
}

afterEach(() => vi.restoreAllMocks())

describe('Vue d’ensemble', () => {
  it('distingue les montants disponibles des données manquantes', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(expenditure) })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(revenue('initial_estimate', '300000000000.00')),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(revenue('revised_estimate', '315000000000.00')),
        }),
    )

    const wrapper = mount(OverviewView)
    await flushPromises()

    expect(wrapper.text()).toContain('Deux côtés du budget')
    expect(wrapper.text()).toContain('578 Md')
    expect(wrapper.text()).toContain('315 Md')
    expect(wrapper.text()).toContain('+5,0 %')
    expect(wrapper.findAll('.matrix-cell.missing')).toHaveLength(2)
  })
})
