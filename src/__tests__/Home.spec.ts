import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import HomeView from '@/views/HomeView.vue'
import { clearApiSessionCache } from '@/services/apiCache'

const quality = { status: 'validated' as const, reason: 'Test' }
const block = {
  title: 'Bloc', description: 'Description', amount: '1000000000.00', unit: 'EUR', items: [],
  percentage: null, per_100: null, quality_status: 'validated' as const, quality, methodology: 'Méthode', provenance: { source: 'INSEE', dataset: 'test' },
}

function payload() {
  return {
    data_year: 2024, reference_year: 2024, generated_at: '2026-09-09T10:00:00+02:00', methodology_version: '2024.1',
    headline: { ...block, description: 'Une phrase pédagogique.' }, public_spending: block,
    who_spends: { ...block, quality_status: 'review_required' as const, quality: { status: 'review_required' as const, reason: 'T_3215 absent' }, items: [{ code: 'central', label: 'Administrations centrales', amount: '10.00', per_100: '10.00', percentage: '10.00' }] },
    what_for: { ...block, items: [{ code: 'GF01', label: 'Services généraux', amount: '20.00', percent: '20.00', per_100: '20.00' }] },
    state_budget: { ...block, distribution: [] },
    revenues: { ...block, amount: null, items: [{ code: 'public_revenues', label: 'Recettes publiques', amount: '20.00', per_100: null, accounting_basis: 'national_accounts', quality_status: 'validated' as const }, { code: 'state_budget_revenues', label: 'Recettes budgétaires de l’État', amount: null, per_100: null, accounting_basis: 'budgetary', quality_status: 'not_importable' as const }], sub_blocks: { public_revenues: {}, state_budget_revenues: {} } },
  }
}

type MockResponse = { ok: boolean; json: () => Promise<unknown> }

afterEach(() => { vi.restoreAllMocks(); clearApiSessionCache() })

describe('HomeView', () => {
  it('consomme le endpoint home et expose les blocs pédagogiques', async () => {
    const fetchMock = vi.fn<() => Promise<MockResponse>>().mockResolvedValue({ ok: true, json: () => Promise.resolve(payload()) })
    vi.stubGlobal('fetch', fetchMock)
    const wrapper = mount(HomeView, { global: { stubs: { RouterLink: true } } })
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/api/v1/home/2024'), expect.anything())
    expect(wrapper.get('h1').text()).toContain('Mais où vont mes impôts')
    expect(wrapper.text()).toContain('Services généraux')
    expect(wrapper.text()).toContain('Donnée à consolider')
    expect(wrapper.text()).toContain('Recettes publiques')
  })

  it('affiche une erreur et permet de réessayer', async () => {
    const fetchMock = vi.fn<() => Promise<MockResponse>>().mockRejectedValue(new Error('API indisponible'))
    vi.stubGlobal('fetch', fetchMock)
    const wrapper = mount(HomeView, { global: { stubs: { RouterLink: true } } })
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('API indisponible')
    await wrapper.get('[role="alert"] button').trigger('click')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
