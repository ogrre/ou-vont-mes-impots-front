import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import GlobalFinanceSearch from '@/components/explorer/GlobalFinanceSearch.vue'
import router from '@/router'

afterEach(() => vi.restoreAllMocks())

describe('Navigation produit', () => {
  it('reconnaît un deep-link explorateur et conserve les filtres', async () => {
    await router.push('/explorer/2024?measurement=commitment_authorization&stage=initial_budget&view=table')
    expect(router.currentRoute.value.name).toBe('explorer')
    expect(router.currentRoute.value.params.year).toBe('2024')
    expect(router.currentRoute.value.query.view).toBe('table')
  })

  it('ouvre la page détaillée depuis un résultat de recherche avec un vrai router', async () => {
    const searchRouter = createRouter({ history: createMemoryHistory(), routes: [{ path: '/', component: { template: '<div />' } }, { path: '/budget-etat/:year/missions/:code', component: { template: '<div />' } }] })
    await searchRouter.push('/')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ query: 'défense', year: 2024, items: [{ type: 'mission', code: 'DEF', label: 'Défense', year: 2024, scope: 'state_budget_programme_action', classification: 'state_budget_programme_action', parent: null, breadcrumb: [{ type: 'mission', code: 'DEF', label: 'Défense' }], amount: null, quality_status: 'review_required' }] }) }))
    const wrapper = mount(GlobalFinanceSearch, { props: { year: 2024 }, global: { plugins: [searchRouter] } })
    await wrapper.get('input').setValue('défense')
    await new Promise((resolve) => setTimeout(resolve, 320))
    await flushPromises()
    await wrapper.get('[role="option"]').trigger('click')
    await searchRouter.isReady()
    await flushPromises()
    expect(searchRouter.currentRoute.value.fullPath).toBe('/budget-etat/2024/missions/DEF')
  })
})
