import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from '../App.vue'
import ExpenditureView from '@/views/ExpenditureView.vue'
import RevenueView from '@/views/RevenueView.vue'
import OverviewView from '@/views/OverviewView.vue'
import { clearApiSessionCache } from '@/services/apiCache'

const source = {
  dataset: {
    id: 'state-expenditure-2025',
    name: 'Dépenses 2025',
    publication_title: 'Projet de loi relatif aux résultats de la gestion 2025',
    publication_date: '2026-04-01',
    source_url: 'https://www.budget.gouv.fr/budget-etat',
    download_url: null,
    downloaded_at: '2026-08-01T12:00:00+00:00',
    license: { name: 'Licence Ouverte', url: null },
    publication_ready: true,
  },
  publisher: {
    name: 'Direction du Budget',
    source_name: 'budget.gouv.fr',
    homepage_url: 'https://www.budget.gouv.fr',
    official: true,
  },
  file: { descriptor: 'mission-cp', filename: 'mission-cp.csv', checksum_sha256: 'abc' },
  import: { batch_id: 1, completed_at: null, rows_read: 2, observations_imported: 2 },
}

function routerAt(path: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', redirect: '/depenses' },
      { path: '/vue-d-ensemble', component: OverviewView },
      { path: '/depenses', component: ExpenditureView },
      { path: '/recettes', component: RevenueView },
    ],
  })
  return router.push(path).then(() => router)
}

afterEach(() => { vi.restoreAllMocks(); clearApiSessionCache() })

describe('App', () => {
  it('affiche les dépenses et leur provenance', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            period: 2025,
            scope: { code: 'french_state_budget', label: 'Budget de l’État français' },
            status: 'executed',
            flow_type: 'expenditure',
            measure: { code: 'payment_credit', official_label: 'CP' },
            classification: 'mission',
            currency: 'EUR',
            total: '1500000000.00',
            percentage_denominator: { amount: '1500000000.00', description: 'Même périmètre' },
            items: [
              {
                code: null,
                slug: 'enseignement',
                label: 'Enseignement scolaire',
                amount: '1500000000.00',
                percentage: '100.00',
                components: [],
              },
            ],
            source,
          }),
      }),
    )
    const router = await routerAt('/depenses')
    const wrapper = mount(App, { global: { plugins: [router] } })
    await flushPromises()

    expect(wrapper.get('h1').text()).toContain('Où va l’argent')
    expect(wrapper.text()).toContain('Enseignement scolaire')
    expect(wrapper.text()).toContain('Direction du Budget')
    expect(wrapper.text()).toContain('Une API publique et gratuite')
    expect(wrapper.get('a[href$="/docs/api"]').attributes('target')).toBe('_blank')
    expect(wrapper.get('a.api-link').text()).toContain('API / OpenAPI')
    expect(wrapper.get('a.github-link').attributes('aria-label')).toContain('backend')
    const cpHelp = wrapper.get('[aria-label="Comprendre CP"]')
    await cpHelp.trigger('click')
    expect(wrapper.text()).toContain('Crédits de paiement')
    expect(wrapper.text()).toContain('les AE ne s’additionnent donc pas aux CP')
    expect(fetch).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/api/v1/state-expenditure' }),
      expect.anything(),
    )
  })

  it('affiche une erreur API et permet de réessayer', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Aucune donnée.' }),
      }),
    )
    const router = await routerAt('/depenses')
    const wrapper = mount(App, { global: { plugins: [router] } })
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('Aucune donnée.')
    await wrapper.get('[role="alert"] button').trigger('click')
    expect(fetch).toHaveBeenCalledTimes(2)
  })
})
