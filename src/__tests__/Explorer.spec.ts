import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import YearSelector from '@/components/explorer/YearSelector.vue'
import DistributionExplorer from '@/components/charts/DistributionExplorer.vue'

describe('Explorateur financier', () => {
  it('émet le changement d’année depuis le sélecteur réutilisable', async () => {
    const wrapper = mount(YearSelector, { props: { years: [{ year: 2024 }, { year: 2025, status: 'données partielles' }], modelValue: 2024 } })
    await wrapper.get('select').setValue('2025')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2025])
    expect(wrapper.text()).toContain('données partielles')
  })

  it('conserve null comme donnée indisponible dans la vue tableau', () => {
    const wrapper = mount(DistributionExplorer, { props: { view: 'table', items: [{ code: 'x', label: 'Détail absent', amount: null, percent: null, per_100: null, quality_status: 'not_importable' }] } })
    expect(wrapper.text()).toContain('Donnée indisponible')
    expect(wrapper.text()).toContain('Donnée indisponible')
  })
})
